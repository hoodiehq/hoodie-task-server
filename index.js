module.exports = hapiCouchDbStore

hapiCouchDbStore.attributes = {
  name: 'tasks'
}

var url = require('url')

var hapiToExpress = require('@gr2m/hapi-to-express')

var TaskFactory = require('./api')
var toCouchDbUrl = require('./api/utils/pouchdb-options-to-couchdb-url')

function hapiCouchDbStore (server, options, next) {
  var api = TaskFactory(options.PouchDB)

  // if connected to a CouchDb, we proxy the requests right through.
  // Otherwise we load express-pouchdb and proxy the request to the express app
  if (api.adapter === 'http') {
    // workaround for https://github.com/pouchdb/pouchdb/issues/5548
    var couchDbUrl = toCouchDbUrl(new options.PouchDB('hack', {skip_setup: true}).__opts)
    server.register({
      register: require('h2o2'),
      once: true
    })
  } else {
    var xapp = require('express-pouchdb')(options.PouchDB, {
      mode: 'fullCouchDB' /* change to minimumForPouchDB when ready */
    })
    xapp.disable('x-powered-by')
  }

  if (options.hooks) {
    Object.keys(options.hooks).forEach(function (type) {
      server.ext({
        type: type,
        method: options.hooks[type],
        options: {
          sandbox: 'plugin'
        }
      })
    })
  }

  server.expose({
    api: api
  })

  // TODO: Deal with trailing slashes(?)
  var routes = [{
    method: 'GET',
    path: '/api/queue/', /* root welcome */
    handler: function (request, reply) {
      request.raw.req.url = '/'
      handler(request, reply)
    }
  }, {
    method: 'GET',
    path: '/api/queue/{queueId}/', /* stats how many docs etc */
    handler: function (request, reply) {
      request.raw.req.url = '/tasks'
      handler(request, reply)
    }
  }, {
    method: ['GET', 'PUT'],
    path: '/api/queue/{queueId}/_local/{id}', /* _local - not replicated */
    handler: function (request, reply) {
      var id = request.params.id
      request.raw.req.url = '/tasks/_local/' + id
      handler(request, reply)
    }
  }, {
    method: 'GET',
    path: '/api/queue/{queueId}/_changes',
    handler: function (request, reply) {
      // TODO: needs to be filtered by queueId
      request.raw.req.url = '/tasks/_changes'
      handler(request, reply)
    }
  }, {
    method: 'GET',
    path: '/api/queue/{queueId}/_all_docs',
    handler: function (request, reply) {
      // TODO: needs to be filtered by queueId
      request.raw.req.url = '/tasks/_all_docs'
      handler(request, reply)
    }
  }, {
    method: 'GET',
    path: '/api/queue/{queueId}/{docId}',
    handler: function (request, reply) {
      // TODO: needs to be filtered by queueId
      request.raw.req.url = '/tasks/' + request.params.docId
      handler(request, reply)
    }
  }, {
    method: 'POST',
    path: '/api/queue/{queueId}/_revs_diff',
    handler: function (request, reply) {
      request.raw.req.url = '/tasks/_revs_diff'
      handler(request, reply)
    }
  }, {
    method: 'POST',
    path: '/api/queue/{queueId}/_bulk_docs',
    handler: function (request, reply) {
      request.raw.req.url = '/tasks/_bulk_docs'
      handler(request, reply)
    }
  }]

  server.route(routes)

  function handler (request, reply) {
    if (api.adapter === 'http') {
      return reply.proxy({
        passThrough: true,
        mapUri: function (request, callback) {
          callback(null, url.resolve(couchDbUrl, request.raw.req.url))
        }
      })
    }

    var hapress = hapiToExpress(request, reply)

    xapp(hapress.req, hapress.res)
  }

  next()
}
