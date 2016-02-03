import localStorage from 'universal-localstorage'

const persistenceManager = {
    set: (key, version, value) => {
            localStorage.setItem(key, JSON.stringify({ 'version': version, 'value': value }))
         },

    get: (key) => {
            return JSON.parse(localStorage.getItem(key)).value
         },

    getVersion: (key) => {
            return JSON.parse(localStorage.getItem(key)).version
         },

    delete: (key) => {
            localStorage.removeItem(key)
         }
}

export default persistenceManager
