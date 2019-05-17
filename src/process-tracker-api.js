const getProfileDetails = require("./tracker.gg")
const state = new Map();

module.exports = (platform, profiles) => Promise.all(
	profiles.map(getProfileDetails(platform))
)
.then((profiles) =>
	profiles.map(processData)
)

const processData = ({ platform, profile, data }) => {
	const current = data.children[0]
	const currentStats = getStats(current.stats)

	const currentData = {
		Platform: platform,
		Profile: profile,
		Legend: getLegendName(current),
		Kills: currentStats.Kills || currentStats.SeasonKills,
		Damage: currentStats.Damage || currentStats.SeasonDamage,
		Wins: currentStats.Wins || currentStats.SeasonWins,
	}

	const oldData = state.get(profile) || currentData
	state.set(profile, currentData)

	const difference = getDifference(oldData, currentData)

	const matchLog = {
		Profile: profile,
		Legend: currentData.Legend
	}

	if(isDifference(difference)) {
		return Object.assign({}, matchLog, {
			data: difference
		})
	}

	return matchLog
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

const getDifference = (prev, current) => prev.Legend !== current.Legend
	? {changedLegend: true, Kills: 0, Damage: 0, Wins: 0 }
	: {
		changedLegend: false,
		Kills: deNaNify(Math.max(0, current.Kills - prev.Kills)),
		Damage: deNaNify(Math.max(0, current.Damage - prev.Damage)),
		Wins: deNaNify(Math.max(0, current.Wins - prev.Wins)),
	}

const isDifference = (diff) => (
	diff.changedLegend
	|| diff.Kills > 0
	|| diff.Damage > 0
	|| diff.Wins > 0
)

const deNaNify = (num) => isNaN(num) ? 0 : num
