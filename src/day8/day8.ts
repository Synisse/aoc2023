import {DAY8_DATA, DAY8_DATA_DUMMY_A, DAY8_DATA_DUMMY_B} from './data';
import {find} from 'lodash';

interface Network {
	directions: string;
	networkEntries: {
		origin: string;
		left: string;
		right: string;
	}[];
}

enum Directions {
	LEFT = 'L',
	RIGHT = 'R',
}

function parseData(aData: string): Network {
	const data = aData.split('\n\n');

	const directions = data[0];

	const networkEntries = data[1].split('\n').map((aNetworkEntry) => {
		console.log('aNetworkEntry: ' + aNetworkEntry);

		const networkValues = aNetworkEntry.match(/([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/);
		return {
			origin: networkValues![1],
			left: networkValues![2],
			right: networkValues![3],
		};
	});

	return {
		directions,
		networkEntries,
	};
}

export function solveDay8() {
	let network = parseData(DAY8_DATA) as Network;
	const destination = 'ZZZ';
	let currentLocation = 'AAA';

	let directionCounter = 0;

	while (currentLocation !== destination) {
		const direction = network.directions[directionCounter % network.directions.length];
		const networkEntry = find(network.networkEntries, (aEntry) => aEntry.origin === currentLocation)!;
		currentLocation = direction === Directions.LEFT ? networkEntry?.left : networkEntry?.right;

		directionCounter++;
	}

	console.log('Part 1: ', directionCounter);
}
