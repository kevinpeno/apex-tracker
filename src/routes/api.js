const Url = require('url').Url
const fetch = require("node-fetch")
const config = require("../../config.json")
const error = require("./error")

module.exports = (request, response) => {
	const url = new URL(`https://localhost${request.url}`)
	const platform = getPlatform(url.searchParams.get("platform"))
	const profile = getProfile(url.searchParams.get("profile"))

	console.log(platform, profile)

	if(platform && profile) {
		const uri = `https://public-api.tracker.gg/apex/v1/standard/profile/${platform}/${profile}`
		console.log(`Requesting: ${uri}`)

		fetch(uri, {
			headers: {
				"TRN-Api-Key": getApiKey()
			}
		})
		.then((apiResponse) => {
			if(apiResponse.ok) {
				return apiResponse.json()
			}
			else {
				response.setHeader("Content-Type", apiResponse.headers.get('content-type'));
				console.error(apiResponse.statusText)
				error(request, response, apiResponse.statusText, 500)
			}
		})
		.then(({data}) => {
			response.setHeader("Content-Type", "application/json");
			response.end(JSON.stringify(data))
		})
	}
	else {
		console.log("errored")
		error(request, response,
			"you must specify the platform and profile to look for in the query params (e.g. ?platform=pc&profile=bbqsamich) [err 01] or in your configuration file",
			400
		)
	}
}

// helpers
const identity = (a) => a
const returnSetIfSet = (a) => ( //
	!(a === undefined && a === null)
		? a
		: undefined
)

// generic function to setup config/url path getters
const getRequestedOrConfig = ((config) => (thingName, callback=identity) => (requestedValue) => callback(
	returnSetIfSet(requestedValue) || returnSetIfSet(config[thingName])
))(config)

// getters
const getApiKey = getRequestedOrConfig("TRN-Api-Key")
const getProfile = getRequestedOrConfig("TRN-Profile")
const getPlatform = getRequestedOrConfig("TRN-Platform", (value) => PlatformEnum[value.toLowerCase()])
const PlatformEnum = {
	"xbox": 1,
	"playstation": 2,
	"psn": 2,
	"pc": 5,
	"origin": 5,
}
