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
	const current = data.children[0]
	const currentStats = getStats(current.stats)

	const currentData = {
		legend: getLegendName(current),
		kills: currentStats.Kills || currentStats.SeasonKills || 0,
		damage: currentStats.Damage || currentStats.SeasonDamage || 0,
		wins: currentStats.Wins || currentStats.SeasonWins || 0,
	}

	const diff = getDifference(state, currentData)
	state = currentData

	if(diff.changedLegend) {
		return {
			type: "ChangedLegend",
			data: currentData.legend
		}
	}
	else if(Math.max(diff.kills, diff.wins, diff.damage) > 0) {
		return {
			type: "MatchResults",
			data: {
				kills: diff.kills,
				damage: diff.damage,
				wins: diff.wins,
			}
		}
	}
}

const getLegendName = (legend) => (
	legend.metadata.legend_name
)

const getStats = stats => stats
	.map(stat => ({
		key: stat.metadata.key,
		value: stat.value
	}))
	.reduce((prev, current) => Object.assign(prev, {
		[current.key]: current.value
	}), {})

const getDifference = (prev, current) => prev.legend !== current.legend
	? {changedLegend: true, kills: 0, damage: 0, wins: 0 }
	: {
		changedLegend: false,
		kills: Math.max(0, current.kills - prev.kills),
		damage: Math.max(0, current.damage - prev.damage),
		wins: Math.max(0, current.wins - prev.wins),
	}

const isDifference = (diff) => (
	diff.changedLegend
	|| diff.kills > 0
	|| diff.damage > 0
	|| diff.wins > 0
)
