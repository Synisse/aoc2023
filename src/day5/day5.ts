import {DAY5_DATA, DAY5_DATA_DUMMY} from './data';
import {chunk, difference, flatten, intersection, min} from 'lodash';

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
	let parsedData = parseData(DAY5_DATA_DUMMY);

	const mapSeeds = (aSeeds: Number[], aMaps: any) =>
		aSeeds.map((aSeed: any) =>
			aMaps.reduce((aPrev: any, aValue: any) => aPrev + (aValue.find(([[aSource, e]]: any) => aPrev >= aSource && aPrev < e)?.[1] ?? 0), aSeed),
		);

	console.log('Part 1: ', min(mapSeeds(parsedData.seeds, parsedData.maps)));

	// RIP Part 2
}
