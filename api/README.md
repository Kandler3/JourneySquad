# Как развернуть для локального тестирования
Нет смысла запускать без базы данных, как развернуть всё приложение см. в README.md корневой папки
# Как сгенерировать спецификацию Swagger
Находясь в этой папке выполнить:
```bash
swag fmt
swag init -g ./cmd/server/main.go -o cmd/docs
```
При запуске всего приложения Swagger по адресу: `http://localhost:8082/users/swagger/index.html`
