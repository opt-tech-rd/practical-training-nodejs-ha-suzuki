docker build -t frontend-ha-suzuki .

docker run -d --name frontend-ha-suzuki -p 5173:8080 frontend-ha-suzuki