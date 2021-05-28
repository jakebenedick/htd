FROM node:alpine

WORKDIR /app/backend

COPY package.json /app/backend/

RUN npm install

COPY . /app/backend

EXPOSE 4000

CMD ["npm", "run", "bootup"]