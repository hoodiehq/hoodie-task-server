# hoodie-task-server

> Task API

`hoodie-task-server` is a [Hapi](http://hapijs.com/) plugin that exposes an API for managing tasks and defines all [CouchDB endpoint routes](http://docs.couchdb.org/en/2.0.0/http-api.html) that are necessary for replication so that task objects can be synced.

## Example

```js
var Hapi = require('hapi')
var hoodieTask = require('@hoodie/task-server')
var PouchDB = require('pouchdb')

var server = new Hapi.Server()

server.connection({
  port: 8000
})

server.register({
  register: hoodieTask,
  options: {
    PouchDB: PouchDB
  }
}, function (error) {
  if (error) throw error
})


server.start(function () {
  console.log('Server running at %s', server.info.uri)
})
```

## Options

### options.PouchDB

PouchDB constructor. _Required_

```js
options: {
  PouchDB: require('pouchdb-core')
    .plugin(require('pouchdb-adapter-leveldb'))
    .plugin(require('pouchdb-replication'))
    .plugin(require('pouchdb-mapreduce'))
}
```

If you want connect to a CouchDB instance, use the `pouchdb-adapter-http` and set
`options.prefix` to the CouchDB url. All requests will be proxied to CouchDB
directly, the PouchDB constructor is only used for [server.plugins.store.api](api)

```js
options: {
  PouchDB: require('pouchdb-core')
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require('pouchdb-replication'))
    .plugin(require('pouchdb-mapreduce'))
    .defaults({
      prefix: 'http://localhost:5984',
      auth: {
        username: 'admin',
        password: 'secret'
      }
    })
}
```

## Testing

Local setup

```
git clone https://github.com/hoodiehq/hoodie-task-server.git
cd hoodie-task-server
npm install
```

Run all tests and code style checks

```
npm test
```

## Contributing

Have a look at the Hoodie project's [contribution guidelines](https://github.com/hoodiehq/hoodie/blob/master/CONTRIBUTING.md).
If you want to hang out you can join our [Hoodie Community Chat](http://hood.ie/chat/).

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
