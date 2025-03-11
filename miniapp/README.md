# Развертывание

- клонировать репозиторий

    `git clone https://github.com/Kandler3/JourneySquad`


- перейти в директорию с frontend частью

    `cd JourneySquad/miniapp`


## Локально

- установить зависимости

    `npm install`


- запустить проект

    `npm run dev`

## Подключение к тг боту через ngrok (нужен VPN)

### Запуск через Docker

- [получить ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken) 


- в miniapp создать файл `.env`


- в файле указать `NGROK_AUTHTOKEN=<your_auth_token>`


- запустить проект

  `docker-compose up -d --build`


- получить публичный url в PowerShell

  `(Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels[0].public_url`


- с помощью BotFather настроить Mini App URL = \<url>

### Запуск вручную

- в miniapp создать файл `.env`


- в файле указать порт для локального запуска `PORT=<some_port>`


- запустить проект локально


- установить ngrok


- создать туннель (внутри ngrok, обязательно включить впн)

    `ngrok http <port>`


- получаем публичный url (далее \<url>)


- с помощью BotFather настроить Mini App URL = \<url>
