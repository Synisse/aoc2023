import {DAY4_DATA, DAY4_DATA_DUMMY} from './data';
import {compact, filter, flattenDeep, forEach, includes, indexOf, intersection, map, reduce, repeat, slice, sum, times, without} from 'lodash';

function parseData(aData: string) {
	let splitData = aData.split('\n').map((aValue) => aValue.replace(' ', ''));

	return splitData.map((aCard) => {
		let cardSplit = aCard.split(':');
		let valueSplit = cardSplit[1].split('|');

		const card = {
			name: cardSplit[0],
			winningnumbers: without(
				valueSplit[0].split(' ').map((ANumberValue) => parseInt(ANumberValue, 10)),
				NaN,
			),
			drawnNumbers: without(
				valueSplit[1].split(' ').map((ANumberValue) => parseInt(ANumberValue, 10)),
				NaN,
			),
			copies: 1,
		};

		return card;
	});
}

export function solveDay4() {
	let parsedData = parseData(DAY4_DATA);

	// part 1
	let part1Values = parsedData.map((aCard) => {
		let intersections = intersection(aCard.drawnNumbers, aCard.winningnumbers);

		if (intersections.length > 0) {
			return reduce(intersections, (a, b, aIndex) => (aIndex === 0 ? 1 : a * 2), 1);
		}

		return 0;
	});

	// part 2
	let playedCards = map(parsedData, (aCard) => {
		let intersections = intersection(aCard.drawnNumbers, aCard.winningnumbers);

		let originalCardIndex = indexOf(parsedData, aCard);

		forEach(
			slice(parsedData, originalCardIndex + 1, originalCardIndex + 1 + intersections.length),
			(aInnerCard) => (aInnerCard.copies += aCard.copies),
		);

		return aCard;
	});

	console.log('part1: ', sum(part1Values));
	console.log('part2: ', sum(map(playedCards, (aCard) => aCard.copies)));
}
