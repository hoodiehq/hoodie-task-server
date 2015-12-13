// http://docs.couchdb.org/en/latest/replication/protocol.html#api-reference

module.exports = [{
  method: 'GET',
  path: '/api/queue/',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].couchUrl + '/' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/api/queue/{queueId}/',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/' + queryString)
      }
    }
  }
}, {
  method: ['GET', 'PUT'],
  path: '/api/queue/{queueId}/_local/{id}',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var id = request.params.id
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/_local/' + id + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/api/queue/{queueId}/_changes',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/_changes' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/api/queue/{queueId}/_all_docs',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/_all_docs' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/api/queue/{queueId}/{docId}',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/' + request.params.docId + queryString)
      }
    }
  }
}, {
  method: 'POST',
  path: '/api/queue/{queueId}/_revs_diff',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/_revs_diff' + queryString)
      }
    }
  }
}, {
  method: 'POST',
  path: '/api/queue/{queueId}/_bulk_docs',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, server.plugins['couchdb-task'].dbUrl + '/_bulk_docs' + queryString)
      }
    }
  }
}]
