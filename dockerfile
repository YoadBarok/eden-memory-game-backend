FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030

RUN npx prisma generate

CMD ["npm", "run", "start:prod"]
