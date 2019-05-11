const fs = require("fs")

module.exports = (request, response) => {
	fs.readFile("src/index.html", function(error, content) {
		if(error) {
			console.log(error)
		} else {
			response.writeHead(200, {
				"Content-Type": "text/html"
			});
			response.end(content,'utf-8')
		}
	})
}
