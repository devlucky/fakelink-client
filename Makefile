default: docker_run

docker_build:
	time docker build -t fakelink-client .

docker_run: 
	docker-compose up  

docker_tag:
	docker tag fakelink-client zzarcon/fakelink-client

docker_push:
  docker push zzarcon/fakelink-client:latest