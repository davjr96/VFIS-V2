FROM node:10.3.0 as builder
COPY . /app
WORKDIR /app
RUN npm install && npm run build

FROM nginx:1.15.2-alpine
COPY --from=builder /app/dist /app/build
COPY ./nginx etc/nginx

EXPOSE 80
