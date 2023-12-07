import {DAY7_DATA, DAY7_DATA_DUMMY} from './data';
import {concat, countBy, filter, groupBy, includes, join, map, multiply, reduce, times, values, zip} from 'lodash';

enum HandValue {
	FIVE_OF_A_KIND = 6,
	FOUR_OF_A_KIND = 5,
	FULL_HOUSE = 4,
	THREE_OF_A_KIND = 3,
	TWO_PAIR = 2,
	ONE_PAIR = 1,
	HIGH_CARD = 0,
}

interface GameHand {
	hand: string;
	bid: number;
	handValue: number;
}

const CARD_VALUES = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse();
const CARD_VALUES_WITH_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

function getCardStringScore(aCardString: string) {
	return CARD_VALUES.indexOf(aCardString) + 1;
}

function getCardStringScoreWithJoker(aCardString: string) {
	return CARD_VALUES_WITH_JOKER.indexOf(aCardString) + 1;
}

function getHandValue(aHand: number[]): number {
	if (includes(aHand, 5)) {
		return HandValue.FIVE_OF_A_KIND;
	} else if (includes(aHand, 4)) {
		return HandValue.FOUR_OF_A_KIND;
	} else if (includes(aHand, 3) && includes(aHand, 2)) {
		return HandValue.FULL_HOUSE;
	} else if (includes(aHand, 3)) {
		return HandValue.THREE_OF_A_KIND;
	} else if (countBy(aHand)[2] === 2) {
		return HandValue.TWO_PAIR;
	} else if (includes(aHand, 2)) {
		return HandValue.ONE_PAIR;
	}

	return HandValue.HIGH_CARD;
}

function getHandValueWithJokers(aHand: number[], aJokerCount: number): number {
	const jokers = aJokerCount ? aJokerCount : 0;
	if (aHand.length === 1 || jokers === 5) {
		return HandValue.FIVE_OF_A_KIND;
	} else if (aHand.length === 2 && aHand[0] + jokers === 4) {
		return HandValue.FOUR_OF_A_KIND;
	} else if (aHand.length === 2 && aHand[0] + jokers === 3) {
		return HandValue.FULL_HOUSE;
	} else if (aHand.length === 3 && aHand[0] + jokers === 3) {
		return HandValue.THREE_OF_A_KIND;
	} else if (aHand.length === 3 && aHand[1] + jokers === 2) {
		return HandValue.TWO_PAIR;
	} else if (aHand.length === 4) {
		return HandValue.ONE_PAIR;
	}

	return HandValue.HIGH_CARD;
}

function parseData(aData: string): GameHand[] {
	const data = aData
		.split('\n')
		.map((aValue) => aValue.split(' '))
		.map((aCardEntry) => {
			const hand = aCardEntry[0];
			const bid = parseInt(aCardEntry[1], 10);

			//part1:
			// const mappedHand = map(countBy(aCardEntry[0]), (aCount) => aCount);
			// const handValue = getHandValue(mappedHand);

			//part2:

			const mappedHandPart2 = map(countBy(aCardEntry[0].replace(/J/g, '')), (aCount) => aCount);
			const handValue = getHandValueWithJokers(
				mappedHandPart2.sort((a, b) => b - a),
				countBy(aCardEntry[0])['J'],
			);

			return {
				hand,
				bid,
				handValue,
			};
		});

	return data;
}

export function solveDay7() {
	let parsedData = parseData(DAY7_DATA);

	console.log('parsedData: ', parsedData);

	const partTwo = true;

	const mappedHandsValues = parsedData
		.sort((a, b) => {
			let handValueDifference = a.handValue - b.handValue;

			if (handValueDifference === 0) {
				let cardsValueDifference = 0;

				for (let cardIndex = 0; cardIndex < a.hand.length && cardsValueDifference === 0; cardIndex++) {
					//part1:
					// cardsValueDifference = getCardStringScore(a.hand[cardIndex]) - getCardStringScore(b.hand[cardIndex]);
					//part2:
					cardsValueDifference = getCardStringScoreWithJoker(a.hand[cardIndex]) - getCardStringScoreWithJoker(b.hand[cardIndex]);
				}

				return cardsValueDifference;
			}

			return handValueDifference;
		})
		.reduce((aSum, aHand, aIndex) => {
			return aSum + aHand.bid * (aIndex + 1);
		}, 0);

	console.log('part1/2: ', mappedHandsValues);
}
