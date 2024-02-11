# Reploy

## Reploy is a simple, lightweight, and easy-to-use deployment tool for web developers

It is designed to be used with small to medium-sized react projects and is perfect for developers who want to deploy their projects to a server without having to deal with complex configuration files or other deployment tools.

### Features

- Simple and easy to use
- Lightweight and fast
- No complex configuration files
- No need to install any additional software
- No need to learn a new deployment tool
- No need to deal with complex deployment processes

!!! Currently reploy only supports deploying react projects to a server. Support for other frameworks and languages will be added in the future.

### run on local machine

#### 1. Clone the repository

```bash
git clone "https://github.com/souvik-13/Reploy.git"
```

#### 2. Install dependencies

```bash
cd Reploy
cd server
bun install
```

#### 3. run redis-server

```bash
sudo service redis-server restart
```

#### 4. Run the services

```bash
# You need to run three different commands in three different terminal
# 1
cd server/services/upload
nodemon
# 2
cd server/services/deploy
nodemon
# 3
cd server/services/request-handler
nodemon
```

#### 5. Run the client

```bash

```
