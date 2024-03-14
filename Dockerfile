FROM node:16

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000
    
CMD ["npm", "start"]