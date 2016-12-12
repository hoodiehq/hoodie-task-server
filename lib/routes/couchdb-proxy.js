// http://docs.couchdb.org/en/latest/replication/protocol.html#api-reference

var couchUrl = 'http://admin:secret@localhost:1234'
var dbUrl = couchUrl + '/tasks'

module.exports = [{
  method: 'GET',
  path: '/queue/',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, couchUrl + '/' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/queue/{queueId}/',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/' + queryString)
      }
    }
  }
}, {
  method: ['GET', 'PUT'],
  path: '/queue/{queueId}/_local/{id}',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var id = request.params.id
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/_local/' + id + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/queue/{queueId}/_changes',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/_changes' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/queue/{queueId}/_all_docs',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/_all_docs' + queryString)
      }
    }
  }
}, {
  method: 'GET',
  path: '/queue/{queueId}/{docId}',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        // TODO: needs to be filtered by queueId
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/' + request.params.docId + queryString)
      }
    }
  }
}, {
  method: 'POST',
  path: '/queue/{queueId}/_revs_diff',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/_revs_diff' + queryString)
      }
    }
  }
}, {
  method: 'POST',
  path: '/queue/{queueId}/_bulk_docs',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, next) {
        var queryString = request.url.search || ''
        var server = request.connection.server
        next(null, dbUrl + '/_bulk_docs' + queryString)
      }
    }
  }
}]
