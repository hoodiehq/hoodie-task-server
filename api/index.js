module.exports = TaskAPIFactory

var _ = require('lodash')

function addToProgressLifeCycle (taskDoc, options) {
  // shallow merge options with defaults
  var progressState = _.assign({
    name: 'progress',
    at: new Date().toISOString()
  }, options)

  // check whether `progress` is a key in taskDoc and if it is an Array
  if (taskDoc['progress'] === undefined || !Array.isArray(taskDoc['progress'])) {
    taskDoc['progress'] = []
  }
  taskDoc['progress'].push(progressState)
}

function TaskAPIFactory (PouchDB) {
  if (typeof PouchDB !== 'function') {
    throw new Error('Task API Factory requires PouchDB as first argument')
  }

  var storeApi = require('@hoodie/store-server-api')(PouchDB)

  return storeApi.create('tasks')
  .then(makeApi)
  .catch(function (error) {
    if (error.status !== 409) {
      throw new Error('Something unexpected happened: ' + error)
    } else {
      return makeApi()
    }
  })

  function makeApi () {
    return storeApi.open('tasks')
    .then(function (taskStore) {
      var api = {}

      api.adapter = storeApi.adapter
      api.on = taskStore.on

      api.success = function (taskDoc, data) {
        if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')
        if (data) {
          addToProgressLifeCycle(taskDoc, {name: 'success', data: data})
        } else {
          addToProgressLifeCycle(taskDoc, {name: 'success'})
        }
        return taskStore.remove(taskDoc)
      }

      api.progress = function (taskDoc, options) {
        if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')

        addToProgressLifeCycle(taskDoc, options)
        // update the taskDoc with new progress state, in the task store
        return taskStore.update(taskDoc)
      }

      api.error = function (taskDoc, error) {
        if (!taskDoc) throw new Error('Task Error requires taskdoc as first argument')
        if (!error) throw new Error('Task Error requires error as second argument')
        addToProgressLifeCycle(taskDoc, {name: 'error', error: error})
        return taskStore.remove(taskDoc)
      }

      return api
    })
    .catch(function (error) {
      throw error
    })
  }
}
