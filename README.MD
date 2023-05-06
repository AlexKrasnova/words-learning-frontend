For building docker image run from root folder:

```bash
docker build -t pirogsoft/words-learning-web:version .
docker push pirogsoft/words-learning-web:version
```

for starting whole application (with DB and backend) run from words-learning-docker-compose folder

```bash
docker-compose up -d
```