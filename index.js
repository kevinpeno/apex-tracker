// content of index.js
const http = require("http")
const Url = require('url').Url
const fetch = require("node-fetch")
const config = require("./config.json")
const port = 3000

const requestHandler = (request, response) => {
	if(request.url === "/")
		index(request, response)
	else if(/^\/api/.test(request.url))
		api(request, response)
	else
		error(request, response)

	console.log(`[${response.statusCode}] ${request.url}`)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
	if (err) {
		return console.log("something bad happened", err)
	}

	console.log(`server is listening on ${port}`)
})


// Routes
const index = (request, response) => {
	response.setHeader("Content-Type", "text/html");
	response.end("Hello World")
}

const Platform = {
	"xbox": 1,
	"playstation": 2,
	"psn": 2,
	"pc": 5,
	"origin": 5,
}

const api = (request, response) => {
	const url = new URL(`https://localhost${request.url}`)
	const platformEnum = url.searchParams.get("platform")

	const platform = platformEnum && Platform[platformEnum.toLowerCase()]
	const profile = url.searchParams.get("profile")

	if(platform !== null && profile !== null) {
		const uri = `https://public-api.tracker.gg/apex/v1/standard/profile/${platform}/${profile}`
		console.log(`Requesting: ${uri}`)

		fetch(uri, {
			headers: {
				"TRN-Api-Key": config["TRN-Api-Key"]
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
		.then((data) => {
			response.setHeader("Content-Type", "application/json");
			response.end(JSON.stringify(data))
		})
	}
	else {
		console.log("errored")
		error(request, response,
			"you must specify the platform and profile to look for in the query params (e.g. ?platform=pc&profile=bbqsamich) [err 01]",
			400
		)
	}
}

const error = (request, response, message, status=404) => {
	response.writeHead(status)
	response.end(message);
}
