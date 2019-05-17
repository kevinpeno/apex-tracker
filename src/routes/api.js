const error = require("./error")
const { getConfigOr } = require("../config-manager")
const getProfile = getConfigOr("TRN-Profile")

const getProfileRequest = require("../process-tracker-api")

module.exports = (request, response) => {
	const url = new URL(`https://localhost${request.url}`)
	const platform = url.searchParams.get("platform")
	const profile = getProfile(url.searchParams.get("profile"))
	const profiles = profile.split(',')

	if (profiles.length) {
		getProfileRequest(platform, profiles)
			.then((profiles) => {
				response.setHeader("Content-Type", "application/json");
				response.end(JSON.stringify(profiles))
			}, (err => {
				console.error(err.statusText)

				response.setHeader("Content-Type", err.headers.get('content-type'));
				error(request, response, err.statusText, err.status)
			}))
	}
	else {
		console.log("errored")
		error(request, response,
			"you must specify the platform and profile to look for in the query params (e.g. ?platform=pc&profile=bbqsamich) [err 01] or in your configuration file",
			400
		)
	}
}
