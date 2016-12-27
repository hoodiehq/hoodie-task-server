module.exports = TaskAPIFactory

function TaskAPIFactory (PouchDB) {
  if (typeof PouchDB !== 'function') {
    throw new Error('Task API Factory requires PouchDB as first argument')
  }

  var storeApi = require('@hoodie/store-server/api')(PouchDB);  

  return storeApi.create('tasks')
  .then(makeApi)
  .catch(function (error) {
    if (error.status !== 409) {
      throw new Error('Something unexpected happened: '+error)
    } else {
      return makeApi();
    }
  })

  function makeApi() {
    return storeApi.open('tasks')
    .then(function (taskStore) {
      var api = {}
      
      api.adapter = storeApi.adapter
      api.on = taskStore.on
      
      api.success = function (taskDoc, data) {
        if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')
        if (data) taskDoc['data'] = data
        taskStore.remove(taskDoc);
      }
      
      api.error = function(taskDoc, error) {
        if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')
        if (!error) throw new Error('Task Error requires error as second argument')
        taskDoc['error'] = error
        taskStore.remove(taskDoc)
      }
      
      return api
    })
    .catch(function (error) {
      throw error
    })
  }
}
