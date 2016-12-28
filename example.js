var Hapi = require('hapi')
var PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-plugin-http'))
  .plugin(require('pouchdb-replication'))
  .plugin(require('pouchdb-mapreduce'))
  .defaults({
    prefix: 'http://localhost:5984',
    auth: {
      username: 'admin',
      password: 'secret'
    }
  })

var server = new Hapi.Server()

server.connection({
  port: 3000
})

server.register({
  register: require('./'),
  options: {
    PouchDB: PouchDB
  }
}, function (err) {
  if (err) return console.log(err)
  server.start(function () {
    console.log('Server running at:', server.info.uri)
  })
})
