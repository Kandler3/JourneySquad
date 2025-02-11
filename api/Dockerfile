FROM golang:1.23-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей и загружаем модули
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь исходный код в контейнер
COPY . .

# Переходим в директорию с основным файлом приложения
WORKDIR /app/cmd/server

# Собираем бинарный файл для Linux без зависимости от C-библиотек
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server .

# Финальный этап: создаём минимальный образ
FROM alpine:latest

# Копируем собранный бинарник из предыдущего этапа
COPY --from=builder /app/cmd/server/server /server

# Указываем порт, который будет использоваться приложением (например, 8080)
EXPOSE 8080

# Запускаем приложение при старте контейнера
ENTRYPOINT ["/server"]
