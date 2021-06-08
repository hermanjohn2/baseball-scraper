const axios = require('axios');

const getData = async () => {
	return await axios
		.get('https://www.espn.com/mlb/schedule')
		.then(res => {
			return res.data
				.split('<tbody>')[1]
				.split('</tbody>')[0]
				.split('<tr')
				.filter(row => row.includes('<td'))
				.map(row => {
					const rowHTML = row.split('<span>');
					const awayTeam = rowHTML[1].split('</span>')[0];
					const homeTeam = rowHTML[2].split('</span>')[0];
					const time = rowHTML[2]
						.split('data-date=')[1]
						.split('>')[0]
						.replace(/"/g, '');

					const network = rowHTML[2]
						.split('<td class="network">')[1]
						.split('<')[0];

					const awayStarter = rowHTML[2]
						.split('/mlb/player')[1]
						.split('>')[1]
						.split('</a')[0];

					const homeStarter = rowHTML[2]
						.split('/mlb/player')[2]
						.split('>')[1]
						.split('</a')[0];

					return {
						home: { team: homeTeam, starter: homeStarter },
						away: { team: awayTeam, starter: awayStarter },
						time: time,
						network: network
					};
				});
		})
		.catch(err => console.log(err));
};

const getGameStats = async () => {
	try {
		const gameData = await getData();
		console.table(gameData);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

getGameStats();
