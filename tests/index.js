var Hapi = require('hapi')
var H2o2 = require('h2o2')
var test = require('tap').test

var plugin = require('../')

var noop = function () {}

function provisionServer () {
  var server = new Hapi.Server()
  server.connection()
  server.register(H2o2, noop)
  return server
}

test('register', function (t) {
  t.plan(1)

  var server = provisionServer()
  server.register({
    register: plugin,
    options: {
      couchdb: 'http://example.com'
    }
  }, function (error) {
    t.is(error, undefined, 'works')
  })
})
