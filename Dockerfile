FROM node:10.15
ARG NODE_ENV=local
ADD ./package.json /app/package.json
RUN  cd /app && npm install --only=production
ADD . /app
EXPOSE 4000

WORKDIR /app

ENTRYPOINT ["npm"]
CMD ["run", "start"]
