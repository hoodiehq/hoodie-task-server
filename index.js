module.exports = hapiCouchDbStore
hapiCouchDbStore.attributes = {
  name: 'couchdb-task',
  dependencies: 'h2o2'
}

var couchdbProxyRoutes = require('./lib/routes/couchdb-proxy')

function hapiCouchDbStore (server, options, next) {
  server.route(couchdbProxyRoutes)
  next()
}
