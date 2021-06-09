const axios = require('axios');

const getTodaysGame = async () => {
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

					const awayStarter = rowHTML[2]
						.split('/mlb/player')[1]
						.split('>')[1]
						.split('</a')[0];

					const homeStarter = rowHTML[2]
						.split('/mlb/player')[2]
						.split('>')[1]
						.split('</a')[0];

					let date = rowHTML[2].split('data-date=')[1]
						? new Date(
								rowHTML[2]
									.split('data-date=')[1]
									.split('><')[0]
									.replace(/"/g, '')
						  )
						: 'live';

					return {
						home: { team: homeTeam, starter: homeStarter },
						away: { team: awayTeam, starter: awayStarter },
						time: date
					};
				});
		})
		.catch(err => console.log(err));
};

const init = async () => {
	try {
		const gameData = await getTodaysGame();
		const rawDate = new Date(Date.now());

		const result = {
			date: rawDate,
			games: gameData
		};

		console.log(result);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

init();
