import {isNil} from 'lodash';
import {DAY10_DATA, DAY10_DATA_DUMMY_A, DAY10_DATA_DUMMY_B, DAY10_DATA_DUMMY_C} from './data';

let s: {x: number; y: number};

const Direction = {
	N: 0,
	S: 1,
	E: 2,
	W: 3,
};

const directions = [
	{x: 0, y: -1},
	{x: 0, y: 1},
	{x: 1, y: 0},
	{x: -1, y: 0},
];

interface Tile {
	value: string;
	links: number[];
	distance: number | undefined;
}

function getLinks(aValue: string) {
	switch (aValue) {
		case '|':
			return [Direction.S, Direction.N];
		case '-':
			return [Direction.W, Direction.E];
		case 'L':
			return [Direction.N, Direction.E];
		case 'J':
			return [Direction.N, Direction.W];
		case '7':
			return [Direction.S, Direction.W];
		case 'F':
			return [Direction.S, Direction.E];
	}
	return [];
}

function parseData(aData: string): Tile[][] {
	const data = aData.split('\n').map((aLine, aY) =>
		aLine.split('').map((aValue, aX) => {
			if (aValue == 'S') s = {x: aX, y: aY};
			return {
				value: aValue,
				links: getLinks(aValue),
				distance: undefined,
			} as Tile;
		}),
	);

	return data;
}

export function solveDay10() {
	let map = parseData(DAY10_DATA);

	let possibleConnections = [];

	if (s.x > 0 && map[s.y][s.x - 1].links.includes(Direction.E)) {
		possibleConnections.push(Direction.W);
	}
	if (s.x < map[0].length - 1 && map[s.y][s.x + 1].links.includes(Direction.W)) {
		possibleConnections.push(Direction.E);
	}
	if (s.y > 0 && map[s.y - 1][s.x].links.includes(Direction.S)) {
		possibleConnections.push(Direction.N);
	}
	if (s.y < map.length - 1 && map[s.y + 1][s.x].links.includes(Direction.N)) {
		possibleConnections.push(Direction.S);
	}

	map[s.y][s.x].links = possibleConnections;

	let stack = [];
	stack.push({p: s, distance: 0});

	while (stack.length) {
		let stackShift = stack.shift()!;
		if (map[stackShift.p.y][stackShift.p.x].distance === undefined || map[stackShift.p.y][stackShift.p.x].distance! > stackShift.distance) {
			map[stackShift.p.y][stackShift.p.x].distance = stackShift.distance;
			map[stackShift.p.y][stackShift.p.x].links.forEach((aLink) => {
				stack.push({
					p: {x: stackShift.p.x + directions[aLink].x, y: stackShift.p.y + directions[aLink].y},
					distance: stackShift.distance + 1,
				});
			});
		}
	}

	console.log('Part 1:', Math.max(...map.flat().map((p) => (p.distance === undefined ? 0 : p.distance))));

	//Part 2:
	let maze = Array(map.length * 3);
	let mazeDist = Array(map.length * 3);

	map.forEach((aRow, aY) =>
		aRow.forEach((aValue, aX) => {
			let submap = [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0],
			];

			if (aValue.distance === undefined) {
				submap[1][1] = 2;
			} else {
				submap[1][1] = 1;
				aValue.links.forEach((aDirection) => {
					submap[1 + directions[aDirection].y][1 + directions[aDirection].x] = 1;
				});
			}

			for (let i = 0; i <= 2; i++) {
				if (maze[aY * 3 + i] === undefined) {
					maze[aY * 3 + i] = Array(map[0].length * 3);
					mazeDist[aY * 3 + i] = Array(map[0].length * 3);
				}

				for (let j = 0; j <= 2; j++) {
					maze[aY * 3 + i][aX * 3 + j] = submap[i][j];
				}
			}
		}),
	);

	stack = [];

	for (let x = 0; x < map[0].length; x++) {
		if (map[0][x].distance === undefined) {
			stack.push({p: {x: x * 3, y: 0}, distance: 0});
		}

		if (map[map.length - 1][x].distance === undefined) {
			stack.push({p: {x: x * 3, y: (map.length - 1) * 3}, distance: 0});
		}
	}

	for (let y = 1; y < map.length - 1; y++) {
		if (map[y][0].distance === undefined) {
			stack.push({p: {x: 0, y: y * 3}, distance: 0});
		}
		if (map[y][map[0].length - 1].distance === undefined) {
			stack.push({p: {x: (map[0].length - 1) * 3, y: y * 3}, distance: 0});
		}
	}

	while (stack.length) {
		let stackShift = stack.shift();
		if (!isNil(stackShift)) {
			if (
				maze[stackShift.p.y] !== undefined &&
				maze[stackShift.p.y][stackShift.p.x] !== undefined &&
				maze[stackShift.p.y][stackShift.p.x] !== 1 &&
				mazeDist[stackShift.p.y][stackShift.p.x] === undefined &&
				(mazeDist[stackShift.p.y][stackShift.p.x] === undefined || mazeDist[stackShift.p.y][stackShift.p.x] > stackShift.distance)
			) {
				mazeDist[stackShift.p.y][stackShift.p.x] = stackShift.distance;
				directions.forEach((d) =>
					stack.push({
						p: {x: stackShift!.p.x + d.x, y: stackShift!.p.y + d.y},
						distance: stackShift!.distance + 1,
					}),
				);
			}
		}
	}

	let sum = 0;

	map.forEach((aRow, aY) =>
		aRow.forEach((aValue, aX) => {
			if (aValue.distance === undefined && mazeDist[aY * 3][aX * 3] === undefined) {
				sum++;
			}
		}),
	);

	console.log('Part 2: ', sum);
}
