const getProfileDetails = require("./tracker.gg")

module.exports = () =>
	getProfileDetails()
		.then(processData)

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

let state = {};
const processData = ({ platform, profile, data }) => {

	const currentData = data.children[0]
	const currentStats = getStats(currentData.stats)

	const incomingState = {
		legend: getLegendName(currentData),
		kills: currentStats.Kills || 0,
		damage: currentStats.Damage || 0,
		wins: currentStats.Wins || 0,
		seasonKills: currentStats.SeasonKills || 0,
		seasonDamage: currentStats.SeasonDamage || 0,
		seasonWins: currentStats.SeasonWins || 0,
	}

	console.table(incomingState)

	let message = null
	if(state.legend !== incomingState.legend) {
		message =  {
			type: "ChangedLegend",
			data: incomingState.legend
		}
	}
	else {
		const diff = getMatchLog(state, incomingState)

		if(Math.max.apply(null, Object.values(diff)) > 0) {
			message = {
				type: "MatchResults",
				data: {
					kills: Math.max(diff.kills, diff.seasonKills),
					damage: Math.max(diff.damage, diff.seasonDamage),
					wins: Math.max(diff.wins, diff.seasonWins),
				}
			}
		}
	}

	state = incomingState
	return message
}

const getLegendName = (rawData) => (
	rawData.metadata.legend_name
)

const getStats = stats => stats
	.map(stat => ({
		key: stat.metadata.key,
		value: stat.value
	}))
	.reduce((prev, current) => Object.assign(prev, {
		[current.key]: current.value
	}), {})

const MatchTrackingKeys = [
	"kills",
	"seasonKills",
	"damage",
	"seasonDamage",
	"wins",
	"seasonWins",
]
const getMatchLog = (prev, current) => {
	const diff = MatchTrackingKeys.reduce((obj, k) => ({
		...obj,
		[k]: Math.max(0, current[k] - prev[k])
	}), {})

	console.table({
		previous: prev,
		current: current,
		diff
	})

	return diff
}
