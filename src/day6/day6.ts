import {DAY6_DATA, DAY6_DATA_DUMMY} from './data';
import {join, multiply, reduce, times, zip} from 'lodash';

function parseData(aData: string) {
	const [time, distance] = aData.split('\n');
	const mapData = (aInput: string) =>
		aInput
			.split(':')[1]
			.trim()
			.split(' ')
			.map(Number)
			.filter((aNumber: Number) => aNumber !== 0);
	const parsedTime = mapData(time);
	const parsedDistance = mapData(distance);

	return {
		time: parsedTime,
		distance: parsedDistance,
	};
}

function calculateWinnableMoves(aTime: number, aDistance: number) {
	let winnableMoves = 0;

	times(aTime, (aIndex) => {
		const buttonTime = aIndex;
		const timeLeftAfterPress = aTime - buttonTime;
		const distanceTravelled = timeLeftAfterPress * buttonTime;
		if (distanceTravelled > aDistance) {
			winnableMoves++;
		}
	});

	return winnableMoves;
}

export function solveDay6() {
	let parsedData = parseData(DAY6_DATA);

	// part 1:
	const preparedGameData = zip(parsedData.time, parsedData.distance);

	const win = preparedGameData.map((aGameEntry) => {
		const time = aGameEntry[0] as number;
		const distance = aGameEntry[1] as number;

		return calculateWinnableMoves(time, distance);
	});

	console.log('Part 1: ', reduce(win, multiply, 1));

	// part 2:
	const time = parseInt(join(parsedData.time, ''));
	const distance = parseInt(join(parsedData.distance, ''));

	console.log('Part 2: ', calculateWinnableMoves(time, distance));
}
