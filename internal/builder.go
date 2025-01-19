package internal

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type ResponseBuilder struct {
	rw http.ResponseWriter
	rc *http.ResponseController

	event string
	data  []string
	id    string
	retry int
}

func NewResponseBuilder(rw http.ResponseWriter) *ResponseBuilder {
	return &ResponseBuilder{
		rw: rw,
		rc: http.NewResponseController(rw),
	}
}

func (rb *ResponseBuilder) SetEvent(event string) {
	rb.event = event
}

func (rb *ResponseBuilder) AddData(data string) {
	rb.data = append(rb.data, data)
}

func (rb *ResponseBuilder) AddJsonData(data any) error {
	d, err := json.Marshal(data)
	if err != nil {
		return err
	}

	rb.data = append(rb.data, string(d))
	return nil
}

func (rb *ResponseBuilder) SetId(id string) {
	rb.id = id
}

func (rb *ResponseBuilder) SetRetry(time int) {
	rb.retry = time
}

func createField(sb *strings.Builder, fn, fd string) {
	if fd == "" || fd == "0" {
		return
	}

	sb.WriteString(fn)
	sb.WriteString(": ")
	sb.WriteString(fd)
	sb.WriteString("\n")
}

func (rb *ResponseBuilder) Flush() error {
	sb := new(strings.Builder)

	createField(sb, "event", rb.event)
	createField(sb, "id", rb.id)
	createField(sb, "retry", strconv.Itoa(rb.retry))
	for _, data := range rb.data {
		createField(sb, "data", data)
	}
	sb.WriteString("\n")

	rb.rw.Write([]byte(sb.String()))

	return rb.rc.Flush()
}

func (rb *ResponseBuilder) Reset() {
	rb.event = ""
	rb.data = []string{}
	rb.id = ""
	rb.retry = 0
}
