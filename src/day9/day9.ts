import {DAY9_DATA, DAY9_DATA_DUMMY} from './data';
import {every, last, map, sum, without} from 'lodash';

function parseData(aData: string) {
	const data = map(aData.split('\n'), (aListEntry) => aListEntry.split(' ').map(Number));

	return data;
}

function getPattern(aListEntry: number[]): number[] {
	return without(
		map(aListEntry, (aEntry, aIndex) => {
			if (aIndex > 0) {
				return aEntry - aListEntry[aIndex - 1];
			}
			return null;
		}),
		null,
	) as number[];
}

export function solveDay9() {
	let parsedData = parseData(DAY9_DATA);
	const entryValues = map(parsedData, (aListEntry) => {
		let newDataList = aListEntry;
		let extrapolationArray: number[][] = [];
		extrapolationArray.push(aListEntry);

		while (!every(newDataList, (aDataPoint) => aDataPoint === 0)) {
			newDataList = getPattern(newDataList);
			extrapolationArray.push(newDataList);
		}

		let valueToAdd = 0;
		const extrapolationValues = map(extrapolationArray.reverse(), (aExtrapolationEntry, aIndex) => {
			// reverse for part 2
			const entry = aExtrapolationEntry.reverse();
			if (aIndex > 0) {
				// part 1 = +, part2 = -
				valueToAdd = last(entry)! - last(extrapolationArray[aIndex - 1])!;
			}
			entry.push(valueToAdd);
			return valueToAdd;
		});

		return last(extrapolationValues);
	});

	console.log('Part1/2', sum(entryValues));
}
