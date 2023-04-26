# User Backend contribution guide

Hello and welcome to the clippic user backend :tada:

[[_TOC_]]

## Getting help

If you're lost or need help with setting up the project, please reach out to our 
[Mattermost backend channel](https://mattermost.clippic.app/clippic/channels/backend).

## Run local development database

Speeding up the local development, it is very easy to spin up a temporary MariaDB database with this command:

```shell
docker run \
  --detach \
  --publish 3306:3306 \
  --env MARIADB_USER=jest \
  --env MARIADB_PASSWORD=jest \
  --env MARIADB_ROOT_PASSWORD=test12345 \
  --env MARIADB_DATABASE=users \
  mariadb
```

A local database can be used as well.

## Exporting Gitlab Access Token

Some resources, like released packages, can only be downloaded when you have access to our gitlab an the corresponding
project, so you need to authenticate against Gitlab.

1. Navigate in the User Settings area to [Access Tokens](https://gitlab.clippic.app/-/profile/personal_access_tokens)
2. Create a new personal access token with at least `read_registry` permissions.
3. Export it in your IDE or via `~/.bashrc` as `CI_JOB_TOKEN=<your token>`

## Install packages

Great, everything is setup properly to install dependencies, just run:

```shell
npm install
```

## Important variables

The backend is relying on environment variables for configuration. Here are required example values, which have to set 
in your IDE or locally:

```shell
DATABASE_NAME=users;
DATABASE_PASSWORD=jest;
DATABASE_PORT=3306;
DATABASE_SERVER=127.0.0.1;
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

## Copy required service account file

We are using firebase, and thus we need to a load a service account file from Google Cloud. An example file is added to 
this repository.

```shell
cp serviceAccountKey.json.sample serviceAccountKey.json
```

## Ready to start

Great, you are ready to start :rocket:

```shell
npm run dev
```

Thanks for your contribution!
