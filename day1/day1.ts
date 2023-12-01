import {DAY1_DATA, DAY1_DATA_DUMMY} from './data';
import {isNil, join, sum} from 'lodash';

const ReplacementStrings: any = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
};

function parseData(aData: string) {
    return aData.split('\n').map(aValue => aValue.replace(' ', ''));
}

export function solveDay1() {
    let parsedData = parseData(DAY1_DATA);

    let mappedNumberValues = parsedData.map(aData => {
        const firstDigit = aData.match(/(\d|one|two|three|four|five|six|seven|eight|nine)/);
        const lastDigit = aData.match(/.*(\d|one|two|three|four|five|six|seven|eight|nine).*/);
        let values = [];

        if(!isNil(firstDigit)) {
            values.push(firstDigit[1].replace(/one|two|three|four|five|six|seven|eight|nine/gi, function(aMatch) {
                return ReplacementStrings[aMatch];
            }));
        }

        if(!isNil(lastDigit)) {
            values.push(lastDigit[1].replace(/one|two|three|four|five|six|seven|eight|nine/gi, function(aMatch) {
                return ReplacementStrings[aMatch];
            }));
        }

        return parseInt(join(values, ''), 10)
    });

    console.log('FinalData: ', mappedNumberValues);
    console.log('Solution: ', sum(mappedNumberValues));
}