import {DAY6_DATA, DAY6_DATA_DUMMY} from './data';
import {chunk, difference, flatten, intersection, join, min, multiply, range, reduce, times, zip} from 'lodash';

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

export function solveDay6() {
	let parsedData = parseData(DAY6_DATA);

	// 1mm per second
	const preparedGameData = zip(parsedData.time, parsedData.distance);

	const win = preparedGameData.map((aGameEntry) => {
		console.log('aGameEntry: ', aGameEntry);
		const time = aGameEntry[0] as number;
		const distance = aGameEntry[1] as number;
		let winnableMoves = 0;

		times(time, (aIndex) => {
			const buttonTime = aIndex;
			const timeLeftAfterPress = time - buttonTime;
			const distanceTravelled = timeLeftAfterPress * buttonTime;
			if (distanceTravelled > distance) {
				winnableMoves++;
				console.log(`time: ${buttonTime}, distance: ${distance}, time: ${distanceTravelled}, `);
			}
		});

		return winnableMoves;
	});

	console.log('Part 1: ', reduce(win, multiply, 1));
}
