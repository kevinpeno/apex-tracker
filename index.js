// content of index.js
const http = require("http")
const port = 3000

const index = require("./src/routes/index")
const api = require("./src/routes/api")
const error = require("./src/routes/error")

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
