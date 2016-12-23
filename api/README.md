[back to hoodie-task-server](../README.md)

# hoodie-task-server/api

> API to manage tasks.

After registering the `@hoodie/task-server` hapi plugin, the `Task` API becomes available at `server.plugins.task.api`, so for example to close a task with a plugin, use `server.plugins.task.api.success(taskDoc)` It can also be required directly.

## Example

```js
var PouchDB = require('pouchdb')
var task = require('@hoodie/task-server/api')(PouchDB)
```

## API

- [Factory](#factory)
- [Task.success()](#tasksuccess)
- [Task.error()](#taskerror)
- [Events](#events)



```js
// all methods return promises
task.success(taskDoc)
store.error(taskDoc, error)

// events
task.on('add', function(object, options) {})
task.on('update', function(object, options) {})
task.on('remove', function(object, options) {})
task.on('change', function(eventName, object, options) {})
store.one(eventName, eventHandlerFunction)
store.off(eventName, eventHandlerFunction)

// original PouchDB (http://pouchdb.com/api.html) instance used for the store
store.db
```