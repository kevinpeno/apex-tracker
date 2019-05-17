const fetch = require("node-fetch")
const { Headers,
	Response,
} = fetch

const getConfig = require("./config-manager")
const { getConfigOr } = getConfig

const PlatformEnum = {
	"xbox": 1,
	"playstation": 2,
	"psn": 2,
	"pc": 5,
	"origin": 5,
}
const getPlatform = getConfigOr("TRN-Platform", (value) => PlatformEnum[value.toLowerCase()])

module.exports = (platform) => (profile) => {
	const realPlatform = getPlatform(platform)
	const uri = `https://public-api.tracker.gg/apex/v1/standard/profile/${realPlatform}/${profile}`

	if(!realPlatform) {
		return Promise.reject(new Response(null, {
			status: 400,
			statusText: `Platform not set`,
			headers: new Headers({
				"content-type": "text/plain"
			})
		}))
	}
	else {
		return fetch(uri, {
			headers: {
				"TRN-Api-Key": getConfig("TRN-Api-Key")
			}
		})
		.then((apiResponse) => {
			if(!apiResponse.ok) {
				if(apiResponse.status === 404) {
					throw new Response(null, {
						status: 404,
						statusText: `Not Found (${platform}:${profile})`,
						headers: new Headers({
							"content-type": "text/plain"
						})
					})
				}
				else {
					throw apiResponse
				}
			}

			return apiResponse.json()
		})
		.then((apiResponse) => {
			return Object.assign({
				profile,
				platform,
			}, apiResponse)
		})
	}
}
