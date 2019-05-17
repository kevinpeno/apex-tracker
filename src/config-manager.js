const config = require("../config.json")

// helpers
const identity = (a) => a
const returnSetIfSet = (a) => ( //
	!(a === undefined && a === null)
		? a
		: undefined
)

module.exports = (thingName, callback=identity) => callback(config[thingName])

module.exports.getConfigOr = (thingName, callback=identity) => (requestedValue) => callback(
	returnSetIfSet(requestedValue) || returnSetIfSet(config[thingName])
)
