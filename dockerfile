FROM golang:1.23-alpine AS builder

WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ./bin

FROM scratch

WORKDIR /app
COPY --from=builder /build/bin ./bin
CMD ["/app/bin"]
