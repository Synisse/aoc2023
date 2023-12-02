import {DAY2_DATA, DAY2_DATA_DUMMY} from './data';
import {includes, isUndefined, maxBy, sumBy} from 'lodash';

function parseData(aData: string) {
	return aData.split('\n').map((aValue) => aValue.replace(' ', ''));
}

enum CubeColors {
	RED = 'red',
	GREEN = 'green',
	BLUE = 'blue',
}

const RED_THRESHOLD = 12;
const GREEN_THRESHOLD = 13;
const BLUE_THRESHOLD = 14;

export function solveDay2() {
	let parsedData = parseData(DAY2_DATA);

	let gameData = parsedData.map((aEntry) => {
		const splitString = aEntry.split(':');
		const gameId = parseInt(splitString[0].replace('Game', ''), 10);

		const gameRounds = splitString[1].split(';');

		// parse game data of each game
		let parsedGameRounds = gameRounds.map((aRound) => {
			const values = aRound.split(',');
			const redCubeString = values.find((aValue) => includes(aValue, CubeColors.RED));
			const greenCubeString = values.find((aValue) => includes(aValue, CubeColors.GREEN));
			const blueCubeString = values.find((aValue) => includes(aValue, CubeColors.BLUE));

			const redString = redCubeString?.replace(/\D/g, '');
			const greenString = greenCubeString?.replace(/\D/g, '');
			const blueString = blueCubeString?.replace(/\D/g, '');

			return {
				red: !isNaN(parseInt(redString as string, 10)) ? parseInt(redString as string, 10) : 0,
				green: !isNaN(parseInt(greenString as string, 10)) ? parseInt(greenString as string, 10) : 0,
				blue: !isNaN(parseInt(blueString as string, 10)) ? parseInt(blueString as string, 10) : 0,
			};
		});

		const maxRed = maxBy(parsedGameRounds, (aRound) => aRound.red);
		const maxGreen = maxBy(parsedGameRounds, (aRound) => aRound.green);
		const maxBlue = maxBy(parsedGameRounds, (aRound) => aRound.blue);

		const maxRedValue = !isUndefined(maxRed) ? maxRed.red : 0;
		const maxGreenValue = !isUndefined(maxGreen) ? maxGreen.green : 0;
		const maxBlueValue = !isUndefined(maxBlue) ? maxBlue.blue : 0;

		const power = maxRedValue * maxGreenValue * maxBlueValue;

		let isGameValid = true;

		parsedGameRounds.forEach((aGameRound) => {
			if (aGameRound.red > RED_THRESHOLD || aGameRound.green > GREEN_THRESHOLD || aGameRound.blue > BLUE_THRESHOLD) {
				isGameValid = false;
			}
		});

		return {
			gameId: gameId,
			rounds: parsedGameRounds,
			valid: isGameValid,
			power: power,
		};
	});

	console.log(
		'Solution Part 1: ',
		sumBy(gameData, (aGame) => (aGame.valid ? aGame.gameId : 0)),
	);
	console.log(
		'Solution Part 2: ',
		sumBy(gameData, (aGame) => aGame.power),
	);
}
