default: docker_run

docker_build:
	time docker build -t fakelink-client .

docker_run: 
	docker-compose up  