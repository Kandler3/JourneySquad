FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

ENV PORT=3000

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]