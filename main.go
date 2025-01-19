package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"

	"github.com/CaptainFallaway/sse-messaging/internal"
	"github.com/google/uuid"

	"github.com/charmbracelet/log"

	"github.com/rs/cors"
)

const addr = "0.0.0.0:3000"

//go:embed frontend/dist
var webFs embed.FS

func main() {
	mux := http.NewServeMux()

	distSubFS, err := fs.Sub(webFs, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServerFS(distSubFS)
	mux.Handle("/", fs)

	c := cors.New(cors.Options{
		AllowedMethods:   []string{http.MethodGet, http.MethodPost},
		AllowCredentials: true,
	})

	messageService := internal.NewMessageStorage()

	mux.HandleFunc("/subscribe", subscribe(messageService))
	mux.HandleFunc("/send", sendMessage(messageService))

	log.Info("Server started on", "addr", addr)

	handler := c.Handler(mux)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}

func sendMessage(storage *internal.MessageService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info("Message Recieved", "host", r.Host)

		if r.Method != http.MethodPost {
			log.Error("Method not allowed", r.Method)
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}

		var m internal.Message
		err := json.NewDecoder(r.Body).Decode(&m)

		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusUnprocessableEntity)
			return
		}

		m.Id = uuid.New().String()
		storage.AddMessage(m)

		w.WriteHeader(http.StatusCreated)
	}
}

func subscribe(ms *internal.MessageService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info("Subscribed", "host", r.Host)

		header := w.Header()
		header.Set("Access-Control-Allow-Origin", "*")
		header.Set("Content-Type", "text/event-stream")
		header.Set("Cache-Control", "no-cache")
		header.Set("Connection", "keep-alive")

		b := internal.NewResponseBuilder(w)

		b.SetEvent("open")
		for _, msg := range ms.GetAllMessages() {
			b.AddJsonData(msg)
		}
		b.Flush()
		b.Reset()

		ch, uid := ms.Subscribe()
		defer ms.Unsubscribe(uid)

		for {
			select {
			case <-r.Context().Done():
				log.Info("Unsubscribed", "host", r.Host)
				return
			case msg := <-ch:
				b.SetEvent("message")
				b.AddJsonData(msg)
				b.Flush()
				b.Reset()
			}
		}
	}
}
