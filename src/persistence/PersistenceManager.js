import localStorage from 'universal-localstorage'

const persistenceManager = {
    set: (key, version, value) => {
        localStorage.setItem(key, JSON.stringify({'version': version, 'value': value}))
    },

    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)).value
        } catch (e) {
            // return undefined
        }
    },

    getVersion: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)).version
        } catch (e) {
            // return undefined
        }
    },

    delete: (key) => {
        localStorage.removeItem(key)
    }
};

export default persistenceManager
