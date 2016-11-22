# hoodie-task-server

> CouchDB-based REST & front-end API for asynchronous background tasks

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-task-server.svg?branch=master)](https://travis-ci.org/hoodiehq/hoodie-task-server)
[![Coverage Status](https://coveralls.io/repos/hoodiehq/hoodie-task-server/badge.svg?branch=master)](https://coveralls.io/r/hoodiehq/hoodie-task-server?branch=master)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-task-server.svg)](https://david-dm.org/hoodiehq/hoodie-task-server)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-task-server/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-task-server#info=devDependencies)

## Scope

The goal is to create very simplistic server for static apps that can
run background tasks that require back-end logic using a simple front-end
API.

## Install

```
npm install --save hoodie-task-server
```


## Server API

Example usage with [nodemailer](https://www.npmjs.com/package/nodemailer) to
send emails from the front-end

```js
var Hapi = require('hapi')
var hapiTask = require('hoodie-task-server')

var options = {
  couchdb: 'http://localhost:5984'
})

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    queue: 'mailer@example.com',
    pass: 'secret'
  }
})

server.register({register: hapiTask}, options, function (error) {
  var taskApi = server.plugins.task.api
  taskApi('mytask').on('start', function (task) {
    if (task.isFunky) {
      taskApi.success(task, function (error) {})
    } else {
      taskApi.success(task, 'you not funky!', function (error) {})
    }
  })
});

server.connection({
  port: 8000
});

server.start(function () {
  console.log('Server running at %s', server.info.uri);
});
```

## REST API

```
POST /api/queue/<id>/_bulk_docs
GET /api/queue/<id>/_changes
```

## How it works

Tasks are json objects with special properties. `hoodie-task-server` creates a
database (`tasks` by default) where all task objects from all queues are
replicated to / from. Queues can only access their own tasks
(`/api/queue/<id>/_changes` is a filtered changes feed by the given queue id).

## Local setup & tests

```bash
git clone https://github.com/hoodiehq/hoodie-task-server.git
cd hoodie-task-server
npm install
npm test
```

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
