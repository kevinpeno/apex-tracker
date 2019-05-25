/**
 * Apex Status Tracker
 * regularly requests data from the API to store for retrieval later
*/
const getConfig = require("./src/config-manager")
const getProfileRequest = require("./src/process-tracker-api")
const queue = []

/* Queue Message format:
{
	id:   number(1...Infinity),
	type: "ChangedLegend"
	data: "legendID"
}

{
	id:   number(1...Infinity),
	type: "MatchResults"
	data: {
		kills:  number(0...Infinity),
		damage: number(0...Infinity),
		wins:   number(0...Infinity),
	}
}
*/

const refreshRate = Math.max(3500, getConfig("TRN-Update-Interval"))
const checkForUpdates = () =>
	getProfileRequest()
		.then((message) => {
			if( message ) {
				const log = Object.assign({
					id: queue.length + 1
				}, message)

				console.log("Message received", log)
				queue.push(log)
			}
			else {
				console.log("API update complete, no changes detected")
			}

			setTimeout(checkForUpdates, refreshRate)
		})
		.catch((err) => {
			console.error(`API request failed. ERRNO ${err.status}: ${err.statusText}`)

			switch(err.status) {
				case 429:
					setTimeout(checkForUpdates, refreshRate + 10000)
				break;
				default:
					setTimeout(checkForUpdates, refreshRate)
				break;
			}
		})

checkForUpdates()
/*
* HTTP Server
*/
const http = require("http")
const port = 3000

const html = require("./src/routes/html")
const api = require("./src/routes/api")
const error = require("./src/routes/error")

http
	.createServer((request, response) => {
		// / or /?profile...etc
		if(/^\/match-log$/.test(request.url))
			html('match-log', response)
		else if(/^\/stream-total$/.test(request.url))
			html('stream-total', response)
		else if(/^\/api\??.*/.test(request.url))
			api(request, response, queue)
		else
			error(request, response)

		console.log(`[${response.statusCode}] ${request.url}`)
	})
	.listen(port, (err) => {
		if (err) {
			return console.log("something bad happened", err)
		}

		console.log(`server is listening on ${port}`)
	})
