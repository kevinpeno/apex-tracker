const fetch = require("node-fetch")
const { Headers,
	Response,
} = fetch

const getConfig = require("./config-manager")

const Platforms = {
	"xbox": 1,
	"playstation": 2,
	"psn": 2,
	"pc": 5,
	"origin": 5,
}

const platform = getConfig("TRN-Platform", (value) => Platforms[value.toLowerCase()])
const profile = getConfig("TRN-Profile")
if( !platform ) {
	throw "platform not set in config"
}

const uri = `https://public-api.tracker.gg/apex/v1/standard/profile/${platform}/${profile}`
const options = {
	headers: {
		"TRN-Api-Key": getConfig("TRN-Api-Key")
	}
}

module.exports = () =>
	fetch(uri, options)
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
		.then((apiResponse) => Object.assign({
				profile,
				platform,
			},
			apiResponse
		))
