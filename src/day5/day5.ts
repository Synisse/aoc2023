import {DAY5_DATA, DAY5_DATA_DUMMY} from './data';
import {chunk, difference, flatten, intersection, min, range} from 'lodash';

function parseData(aData: string) {
	const [seeds, ...maps] = aData.split('\n\n');
	const parsedSeeds = seeds.split(':')[1].trim().split(' ').map(Number);
	const parsedMaps = maps.map((aMap) =>
		aMap
			.split('\n')
			.filter((_, aIndex) => aIndex > 0)
			.map((aRow) => aRow.split(' ').map(Number))
			.map(([aDestination, aSource, aLength]) => [[aSource, aSource + aLength], aDestination - aSource]),
	);

	return {
		seeds: parsedSeeds,
		maps: parsedMaps,
	};
}

export function solveDay5() {
	let parsedData = parseData(DAY5_DATA);

	const mapSeeds = (aSeeds: Number[], aMaps: any) =>
		aSeeds.map((aSeed: any) =>
			aMaps.reduce((aPrev: any, aValue: any) => aPrev + (aValue.find(([[aSource, e]]: any) => aPrev >= aSource && aPrev < e)?.[1] ?? 0), aSeed),
		);

	console.log('Part 1: ', min(mapSeeds(parsedData.seeds, parsedData.maps)));

	// RIP Part 2
	let range1;
	let range2;
	let values: Number[] = [];
	chunk(parsedData.seeds, 2).forEach((aSeedArray) => {
		const halfSeed = Math.ceil(aSeedArray[1] / 2);
		const secondHalf = aSeedArray[1] - halfSeed;
		range1 = range(aSeedArray[0], aSeedArray[0] + halfSeed, 1);
		range2 = range(aSeedArray[0] + halfSeed, aSeedArray[0] + halfSeed + secondHalf, 1);
		let range1Solution = min(mapSeeds(flatten(range1), parsedData.maps));
		values.push(range1Solution);
		let range2Solution = min(mapSeeds(flatten(range2), parsedData.maps));
		values.push(range2Solution);
		range1 = [];
		range2 = [];
	});

	console.log('Part 2: ', min(values));
}
