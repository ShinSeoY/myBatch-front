FROM node:20 AS builder
# 폴더 지정
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# vue배포하려면 웹서버 필요함 -> nginx 이용
FROM nginx:latest
# builder를 통해 빌드된 dist안에 있는 파일을 app으로 가져옴
COPY --from=builder /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80