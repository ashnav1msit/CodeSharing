# AE Digital Platform

![ci workflow](https://github.com/GovAlta/dio-ae-digital/actions/workflows/ci.yml/badge.svg)

This repository contains the microservices and frontend apps that make up the Advanced Education Digital Platform.

### Tools

- [VS Code](https://code.visualstudio.com/Download)
- [node 14](https://nodejs.org/dist/latest-v14.x/)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [docker](https://www.docker.com/products/docker-desktop)
- [dotnet 5](https://dotnet.microsoft.com/download/dotnet/5.0)
- [Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=ssl-netstd21)

## Getting Started

### Install Dependencies

In repo root run:

```sh
yarn
```

### Starting Local Database

```sh
yarn up
```

> Currently this runs database in docker in the foreground
> In order to stop the containers, use **ctrl-c** in the same terminal

### Destroying Local Database

This is good for recreating your local database.

> Warning: This will delete existing data

```sh
yarn down
```

### Configure PG Admin

The backend stack runs pgadmin on http://localhost:5050
To add your local instance, _Right Click_ **Servers** -> **Create** and use the following parameters

| parameter            | value    |
| -------------------- | -------- |
| Host name/address    | db       |
| Port                 | 5432     |
| Maintenance Database | postgres |
| Username             | postgres |
| Password             | postgres |

## Cosmos DB

Loading Cosmos DB. This will create/drop databases found in the cosmos data directory

```sh
yarn data:import-cosmos-db
```

## Common Tasks

### Creating an new application

#### Angular App

When creating a new angular app, make sure to also add the [custom configuration](.docs/angular-app-configuration.md)
