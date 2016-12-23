module.exports = TaskAPIFactory

var hoodieApi = require('pouchdb-hoodie-api')
var request = require('request').defaults({json: true})

var toCouchDbUrl = require('./utils/pouchdb-options-to-couchdb-url')

function TaskAPIFactory (PouchDB) {
  if (typeof PouchDB !== 'function') {
    throw new Error('Store API Factory requires PouchDB as first argument')
  }

  // https://github.com/hoodiehq/pouchdb-hoodie-api
  PouchDB.plugin(hoodieApi)

  var metaDb = new PouchDB('hoodie-store')
  var adapter = new PouchDB('hack', {skip_setup: true}).adapter
  var usesHttpAdapter = adapter === 'http' || adapter === 'https'
  var couchDbUrl = toCouchDbUrl(metaDb.__opts)

  var state = {
    PouchDB: PouchDB,
    metaDb: metaDb,
    couchDbUrl: couchDbUrl,
    usesHttpAdapter: usesHttpAdapter
  }
  
  var create = require('./store/create').bind(null, state)
  create('tasks')
  .catch(function (error) {
    if (error.status !== 409) {
      console.log('Something unexpected happened:', error)
    }
  })
  
  var taskStore = new state.PouchDB('tasks').hoodieApi()
    
  var api = {}

  // set adapter to http for both http & https
  api.adapter = usesHttpAdapter ? 'http' : adapter
  api.on = taskStore.on
  api.success = taskStore.remove
  
  api.error = function(taskDoc, error) {
    if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')
    if (!error) throw new Error('Task Error requires error as second argument')
    taskDoc['error'] = error
    taskStore.remove(taskDoc)
  }

  return api
}
