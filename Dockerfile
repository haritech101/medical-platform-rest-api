FROM node:18

WORKDIR /opt/medical-platform-rest-api
COPY package* ./
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "start" ]
