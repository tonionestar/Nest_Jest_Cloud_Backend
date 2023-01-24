# User Backend contribution guide

## Run local development database

```shell
docker run -d -p 3306:3306 --env MARIADB_USER=jest --env MARIADB_PASSWORD=jest --env MARIADB_ROOT_PASSWORD=test12345 --env MARIADB_DATABASE=users mariadb
```

## Important variables

```shell
DATABASE_NAME=users;
DATABASE_PASSWORD=jest;
DATABASE_PORT=3306;
DATABASE_SERVER=10.234.0.211;
DATABASE_SYNCHRONIZE=true;
DATABASE_USER=jest;
JAEGER_ENDPOINT=https://jaeger-api.brained.io/api/traces;
ORDER_BACKEND=http://localhost:3003/;
VIDEO_BACKEND=http://localhost:3001/
SMTP_PASS=empty;
SMTP_PORT=465;
SMTP_SERVER=mail.brained.io;
SMTP_USER=notifications@clippic.app;
```
