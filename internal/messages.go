package internal

import (
	"sync"

	"github.com/google/uuid"
)

type Message struct {
	Id      string `json:"id"`
	Author  string `json:"author"`
	Message string `json:"message"`
}

type MessageService struct {
	messages    []Message
	mux         sync.Mutex
	subscribers map[string]chan Message
}

func NewMessageStorage() *MessageService {
	return &MessageService{
		messages:    make([]Message, 0),
		mux:         sync.Mutex{},
		subscribers: make(map[string]chan Message),
	}
}

func (ms *MessageService) AddMessage(m Message) {
	ms.mux.Lock()
	defer ms.mux.Unlock()

	ms.messages = append(ms.messages, m)
	if len(ms.messages) > 100 {
		ms.messages = ms.messages[1:]
	}

	for _, ch := range ms.subscribers {
		ch <- m
	}
}

func (ms *MessageService) GetAllMessages() []Message {
	return ms.messages
}

func (ms *MessageService) Subscribe() (chan Message, string) {
	ch := make(chan Message)
	uuid := uuid.New().String()
	ms.subscribers[uuid] = ch
	return ch, uuid
}

func (ms *MessageService) Unsubscribe(id string) {
	delete(ms.subscribers, id)
}
