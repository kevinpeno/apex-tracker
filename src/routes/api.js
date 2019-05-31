const error = require("./error")

module.exports = (request, response, messages) => {
	const url = new URL(`https://localhost${request.url}`)
	const lastMessageId = url.searchParams.get("since") || 0

	response.setHeader("Content-Type", "application/json");

	// Server reset
	if(messages.length === 1 && lastMessageId > 0) {
		response.end(JSON.stringify(messages))
	}
	// Every other time
	else {
		response.end(JSON.stringify(
			messages.filter((message) => message.id > lastMessageId)
		))
	}
}
