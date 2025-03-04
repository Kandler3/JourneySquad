# Развертывание
### Локально
- склонировать репозиторий

    `git clone https://github.com/Kandler3/JourneySquad`


- перейти в директорию с frontend частью

    `cd JourneySquad/miniapp`


- установить зависимости

    `npm install`


- запустить проекта

    `npm run dev`

### Подключение к тг боту через ngrok

- в miniapp создать файл `.env`


- в файле указать порт для локального запуска `PORT=<some_port>`


- установить ngrok


- создать туннель (внутри ngrok, обязательно включить впн)

    `ngrok http <port>`


- получаем публичный url (далее \<url>)


- в .env указать url `NGROKHOST=<url>`


- с помощью BotFather настроить Mini App URL = \<url>


- перезапустить проект