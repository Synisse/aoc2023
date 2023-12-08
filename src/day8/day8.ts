import {DAY8_DATA, DAY8_DATA_DUMMY_A, DAY8_DATA_DUMMY_B, DAY8_DATA_DUMMY_C} from './data';
import {endsWith, every, find, some} from 'lodash';

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
		const networkValues = aNetworkEntry.match(/^(\w+) = \((\w+), (\w+)\)$/);
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

function solvePart1(aNetwork: Network) {
	const destination = 'ZZZ';
	let currentLocation = 'AAA';

	let directionCounter = 0;

	while (currentLocation !== destination) {
		const direction = aNetwork.directions[directionCounter % aNetwork.directions.length];
		const networkEntry = find(aNetwork.networkEntries, (aEntry) => aEntry.origin === currentLocation)!;
		currentLocation = direction === Directions.LEFT ? networkEntry?.left : networkEntry?.right;

		directionCounter++;
	}

	console.log('Part 1: ', directionCounter);
}

function solvePart2(aNetwork: Network) {
	let currentLocations = aNetwork.networkEntries.filter((entry) => endsWith(entry.origin, 'A')).map((aEntry) => aEntry.origin);

	const numbersOfDirections = currentLocations.map((aCurrentLocation) => {
		let directionCounter = 0;

		while (!endsWith(aCurrentLocation, 'Z')) {
			const direction = aNetwork.directions[directionCounter % aNetwork.directions.length];
			const networkEntry = find(aNetwork.networkEntries, (aEntry) => aEntry.origin === aCurrentLocation)!;
			aCurrentLocation = direction === Directions.LEFT ? networkEntry?.left : networkEntry?.right;

			directionCounter++;
		}

		return directionCounter;
	});

	const greatestCommonDivisor: any = (a: number, b: number) => (b === 0 ? a : greatestCommonDivisor(b, a % b));

	const leastCommonMultiple = (aNumbersOfDirections: number[]) => {
		const lcmTwoNumbers = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b);

		return aNumbersOfDirections.reduce((acc, num) => lcmTwoNumbers(acc, num), 1);
	};

	console.log('Part 2: ', leastCommonMultiple(numbersOfDirections));
}

export function solveDay8() {
	let network = parseData(DAY8_DATA);

	// solvePart1(network);
	solvePart2(network);
}
