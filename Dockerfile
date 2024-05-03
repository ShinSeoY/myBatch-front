FROM node:20 AS builder
# 폴더 지정
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# vue배포하려면 웹서버 필요함 -> nginx 이용
FROM nginx:latest
# builder를 통해 빌드된 dist안에 있는 파일을 app으로 가져옴
COPY  ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]