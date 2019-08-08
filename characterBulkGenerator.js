const fs = require('fs');

const Tiers = ['S', 'A', 'B', 'C', 'H'];
const Bulk = 10000;
const char = [];

const randInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

let i;
for (i = 0; i <= Bulk; i++) {
	const generatedChar = new Object();
	generatedChar.tier = Tiers[Math.floor(Math.random() * Tiers.length)];
	if (generatedChar.tier === 'S') {
		generatedChar.hp = randInt(2000, 6000);
		generatedChar.atk = randInt(500, 1000);
		generatedChar.critMulti = 1 + (Math.floor(Math.random() * 3));
		generatedChar.critChance = randInt(10, 80);
		generatedChar.def = randInt(35, 85);
		generatedChar.spd = randInt(3, 10);
		generatedChar.agi = randInt(2, 10);
		generatedChar.acr = randInt(3, 10);
		generatedChar.rgn = randInt(20, 200);
		generatedChar.mag = randInt(0, 2000);
	}
	else if (generatedChar.tier === 'A') {
		generatedChar.hp = randInt(1000, 2000);
		generatedChar.atk = randInt(200, 750);
		generatedChar.critMulti = 1 + (Math.floor(Math.random() * 5));
		generatedChar.critChance = randInt(15, 50);
		generatedChar.def = randInt(20, 70);
		generatedChar.spd = randInt(4, 10);
		generatedChar.agi = randInt(2, 10);
		generatedChar.acr = randInt(3, 10);
		generatedChar.rgn = randInt(0, 100);
		generatedChar.mag = randInt(0, 2000);
	}
	else if (generatedChar.tier === 'B') {
		generatedChar.hp = randInt(800, 1200);
		generatedChar.atk = randInt(180, 240);
		generatedChar.critMulti = 2 + (Math.floor(Math.random() * 2));
		generatedChar.critChance = randInt(10, 20);
		generatedChar.def = randInt(35, 85);
		generatedChar.spd = randInt(3, 6);
		generatedChar.agi = randInt(2, 6);
		generatedChar.acr = randInt(5, 9);
		generatedChar.rgn = randInt(0, 50);
		generatedChar.mag = randInt(0, 1500);
	}
	else if (generatedChar.tier === 'C') {
		generatedChar.hp = randInt(650, 900);
		generatedChar.atk = randInt(100, 150);
		generatedChar.critMulti = 1 + (Math.floor(Math.random()));
		generatedChar.critChance = randInt(20, 40);
		generatedChar.def = randInt(15, 35);
		generatedChar.spd = randInt(3, 7);
		generatedChar.agi = randInt(2, 6);
		generatedChar.acr = randInt(2, 6);
		generatedChar.rgn = randInt(0, 10);
		generatedChar.mag = randInt(0, 300);
	}
	else if (generatedChar.tier === 'H') {
		generatedChar.hp = randInt(600, 1500);
		generatedChar.atk = randInt(60, 100);
		generatedChar.critMulti = 1 + (Math.floor(Math.random()));
		generatedChar.critChance = randInt(0, 0);
		generatedChar.def = randInt(25, 90);
		generatedChar.spd = randInt(2, 5);
		generatedChar.agi = randInt(2, 5);
		generatedChar.acr = randInt(2, 5);
		generatedChar.rgn = randInt(0, 20);
		generatedChar.mag = randInt(0, 0);
	}
	else {
		console.log('nope, fucked it up');
	}
	char.push(generatedChar);
}


fs.writeFile('charactersBulk.json', JSON.stringify(char, undefined, 2), (err) => {
	if (err) throw err;
	console.log('Characters has successfully been saved');
});