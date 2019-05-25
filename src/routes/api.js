const error = require("./error")

module.exports = (request, response, messages) => {
	const url = new URL(`https://localhost${request.url}`)
	const lastMessageId = url.searchParams.get("since") || 0

	response.setHeader("Content-Type", "application/json");
	response.end(JSON.stringify(
		messages.filter((message) => message.id > lastMessageId)
	))
}
