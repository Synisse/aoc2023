import {DAY3_DATA, DAY3_DATA_DUMMY} from './data';
import {compact, find, findIndex, flatten, flattenDeep, includes, isUndefined, maxBy, repeat, sum, sumBy, without} from 'lodash';

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
	console.log('parsedData: ', parsedData);

	let numbersOfRow = parsedData.map((aRow) => aRow.match(/\d+/g));
	let charactersOfRow = parsedData.map((aRow) => aRow.match(/[^0-9.]+/g));

	const rowData = mapInputToPositionData(numbersOfRow, parsedData, false);
	const characterData = mapInputToPositionData(charactersOfRow, parsedData, true);

	const flattenedNumberData = flattenDeep(compact(rowData));
	const flattenedCharacterData = flattenDeep(compact(characterData));

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

	// console.log('parsedData 1: ', flattenedNumberData);
	// console.log('parsedData 1: ', flattenedCharacterData);
	console.log('parsedData 1: ', sum(valuesWithNeighbors));
}
