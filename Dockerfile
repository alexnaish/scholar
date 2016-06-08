FROM mhart/alpine-node:4

WORKDIR /src
ADD . .

RUN npm install --production
ENV NODE_ENV docker
EXPOSE 8080
CMD ["node", "api/server.js"] 
