FROM golang:1.23-alpine AS builder

WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o ./bin

FROM scratch

WORKDIR /app
COPY --from=builder /build/bin ./bin
EXPOSE 3000
CMD ["/app/bin"]
