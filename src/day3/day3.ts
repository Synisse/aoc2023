import {DAY3_DATA, DAY3_DATA_DUMMY} from './data';
import {compact, flattenDeep, includes, reduce, repeat, sum, times, without} from 'lodash';

function parseData(aData: string) {
	return aData.split('\n').map((aValue) => aValue.replace(' ', ''));
}

interface ListEntry {
	value: number | string;
	row: number;
	start: number;
	length: number;
}

function mapInputToPositionData(aArray: (RegExpMatchArray | null)[], aInput: string[], aIsCharaterData: boolean) {
	return aArray.map((aNumbersOfRow, aIndex) => {
		let stringToSearch = aInput[aIndex];
		const numberData = aNumbersOfRow?.map((aEntryValue: string) => {
			const partNumber: ListEntry = {
				value: aIsCharaterData ? aEntryValue : parseInt(aEntryValue, 10),
				row: aIndex,
				start: stringToSearch.indexOf(aEntryValue),
				length: aEntryValue.length,
			};

			// cleanup string to prepare it for duplicate entries
			if (!aIsCharaterData) {
				const dotString = repeat('.', aEntryValue.length);
				stringToSearch = stringToSearch.replace(new RegExp(aEntryValue), dotString);
			} else {
				stringToSearch = stringToSearch.replace(aEntryValue, '.');
			}

			return partNumber;
		});

		return numberData;
	});
}

export function solveDay3() {
	let parsedData = parseData(DAY3_DATA);
	let numbersOfRow = parsedData.map((aRow) => aRow.match(/\d+/g));
	let charactersOfRow = parsedData.map((aRow) => aRow.match(/[^0-9.]+/g));

	const rowData = mapInputToPositionData(numbersOfRow, parsedData, false);
	const characterData = mapInputToPositionData(charactersOfRow, parsedData, true);

	const flattenedNumberData = flattenDeep(compact(rowData));
	const flattenedCharacterData = flattenDeep(compact(characterData));

	// part 1
	const valuesWithNeighbors = flattenedNumberData.map((aNumber) => {
		// check if there is a adjecent row entry in characters
		const possibleNeighbors = flattenedCharacterData.filter(
			(aCharacterEntry) => aCharacterEntry.row <= aNumber.row + 1 && aCharacterEntry.row >= aNumber.row - 1,
		);

		const actualNeighbors = possibleNeighbors.map(
			(aPossibleNeighbor) => aPossibleNeighbor.start >= aNumber.start - 1 && aPossibleNeighbor.start <= aNumber.start + aNumber.length,
		);

		return includes(actualNeighbors, true) ? aNumber.value : 0;
	});

	// part 2
	const gearNeighbors = flattenedCharacterData.map((aCharacterEntry) => {
		if (aCharacterEntry.value === '*') {
			const possibleNeighbors = flattenedNumberData.filter(
				(aNumberEntry) => aNumberEntry.row <= aCharacterEntry.row + 1 && aNumberEntry.row >= aCharacterEntry.row - 1,
			);

			const actualNeighbors = possibleNeighbors.map((aPossibleNeighbor) => {
				const valueRange = times(aPossibleNeighbor.length, (aValue) => aValue + aPossibleNeighbor.start);

				const validNumberDigit = valueRange.map((aValue) => {
					return aValue >= aCharacterEntry.start - 1 && aValue <= aCharacterEntry.start + 1;
				});

				return includes(validNumberDigit, true) ? aPossibleNeighbor.value : 0;
			});

			return without(actualNeighbors, 0).length > 1
				? reduce(actualNeighbors, (aProduct: number, aValue: number) => aProduct * (aValue > 0 ? aValue : 1), 1)
				: 0;
		}

		return 0;
	});

	console.log('solve part 1: ', sum(valuesWithNeighbors));
	console.log('solve part 2: ', sum(gearNeighbors));
}
