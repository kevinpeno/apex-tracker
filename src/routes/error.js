module.exports = (request, response, message, status=404) => {
	response.writeHead(status)
	response.end(message);
}
