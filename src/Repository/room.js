const configuration = require('../configuration.js')

module.exports = {
    search: () => new Promise(resolve => resolve([
        {
            id: "living",
            label: "Living Room"
        },
        {
            id: "fakeRoom",
            label: "Fake Room"
        }
    ]))
}