/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { Client, Attachment } = require('discord.js');
client.login(config.token);

// Miscallaneous variables
let player1HasChar = false;
let player2HasChar = false;
let player1Char;
let player2Char;
let gameStarting = false;
let playerCount = 0;
let player1;
let player2;
const c0 = {
	tier : 'template', // template with max stat for debugging purposes
	name : 'ricardo milos',
	hp : 5000,
	atk : 500,
	def : 200,
	spd : 10,
	agi : 10,
	acr : 10,
	int : 200,
	mag : 2000,
	cd : 20,
	rgn : 100,
};
const c1 = {
	tier : 'S',
	name : 'Seize',
	hp : 3000,
	atk : 360,
	def : 70,
	spd : 9,
	agi : 9,
	acr : 8,
	int: 179,
	mag : 1500,
	cd : 5,
	rgn : 90,
};
const c2 = {
	tier : 'S',
	name : 'Fusoku',
	hp : 4000,
	atk : 470,
	def : 130,
	spd : 5,
	agi : 4,
	acr : 4,
	int : 85,
	mag : 0,
	cd : 0,
	rgn : 50,
};
const c3 = {
	tier : 'S',
	name : 'Leoppscaay',
	hp : 2500,
	atk : 310,
	def : 80,
	spd : 6,
	agi : 5,
	acr : 4,
	int : 100,
	mag : 500,
	cd : 2,
	rgn : 70,
};
const c4 = {
	tier : 'S',
	name : 'Gold',
	hp : 3500,
	atk : 350,
	def : 110,
	spd : 6,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 1900,
	cd : 10,
	rgn : 50,
};
const c5 = {
	tier : 'A',
	name : 'Yellow Strike',
	hp : 1500,
	atk : 320,
	def : 60,
	spd : 10,
	agi : 8,
	acr : 6,
	int : 130,
	mag : 800,
	cd : 5,
	rgn : 10,
};
const c6 = {
	tier : 'A',
	name : 'Pinky',
	hp : 1000,
	atk : 330,
	def : 40,
	spd : 7,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 600,
	cd : 3,
	rgn : 0,
};
const c7 = {
	tier : 'A',
	name : 'Red Queen',
	hp : 2000,
	atk : 260,
	def : 190,
	spd : 4,
	agi : 2,
	acr : 4,
	int : 120,
	mag : 300,
	cd : 3,
	rgn : 10,
};
const c8 = {
	tier : 'A',
	name : 'Kairo',
	hp : 2000,
	atk : 400,
	def : 110,
	spd : 5,
	agi : 4,
	acr : 3,
	int : 75,
	mag : 0,
	cd : 0,
	rgn : 20,
};
const c9 = {
	tier : 'A',
	name : 'Lyzan',
	hp : 1500,
	atk : 270,
	def : 70,
	spd : 7,
	agi : 7,
	acr : 6,
	int : 140,
	mag : 1800,
	cd : 15,
	rgn : 100,
};
const c10 = {
	tier : 'B',
	name : 'USaBi',
	hp : 900,
	atk : 260,
	def : 70,
	spd : 6,
	agi : 6,
	acr : 5,
	int : 90,
	mag : 400,
	cd : 5,
	rgn : 0,
};
const c11 = {
	tier : 'B',
	name : 'Ell\'Fayrh',
	hp : 1000,
	atk : 250,
	def : 200,
	spd : 3,
	agi : 2,
	acr : 9,
	int : 190,
	mag : 1400,
	cd : 10,
	rgn : 0,
};
const c12 = {
	tier : 'B',
	name : 'May',
	hp : 700,
	atk : 260,
	def : 40,
	spd : 7,
	agi : 6,
	acr : 6,
	int : 120,
	mag : 150,
	cd : 3,
	rgn : 5,
};

// Defining bot activity
client.on('ready', () => {
	client.user.setActivity('the game', { type: 'Playing' });
	console.log('Ready!');
});

// commands
client.on('message', msg => {
	if (msg.author.bot) return; // won't react to bots
	if (msg.content.indexOf(config.prefix) !== 0) return; // won't react to "!" alone
	// destructuring
	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command === 'register') {
	// command for registering as a "player"
		if (playerCount === 0) {
			msg.reply('is registered as player 1! Waiting for another player...');
			playerCount = 1;
			msg.author.id = player1;
			return player1;
		}
		else if (playerCount === 1) {
			if (msg.author.id === player1) {
				msg.reply(' is already registered.');
			}
			else {
				msg.reply('is registered as player 2! Type !start to start the game!');
				playerCount = 2;
				msg.author.id = player2;
				return player2;
			}
		}
		else{
			msg.reply('there is already two registered players.');
			// failsafe in case someone tries to register when a game is in session
		}
	}
	// template for admin command
	if (command === 'admin') {
		if (msg.author.id == config.ownerID) {
			msg.reply('placeholder : template for admin command');
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	// starting the game
	if (command === 'start') {
		if (playerCount !== 2) {
			msg.channel.send('Not enough player registered yet. Please type !register.');
		}
		else {
			msg.channel.send('choose a character by typing "!" + your character');
			gameStarting = true;
		}
	}
	// character selection
	if (gameStarting === true) {
		switch(command) {
		case'seize':
			if(msg.author.id == player1) {
				player1Char = c1;
				player1HasChar = true;
				msg.reply('chose Seize.');
			}
			else if(msg.author.id == player2) {
				player2Char = c1;
				player2HasChar = true;
				msg.reply('chose Seize.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'fusoku':
			if (msg.author.id == player1) {
				player1Char = c2;
				player1HasChar = true;
				msg.reply('chose Fusoku.');
			}
			else if (msg.author.id == player2) {
				player2Char = c2;
				player2HasChar = true;
				msg.reply('chose Fusoku.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'leoppscaay':
			if (msg.author.id == player1) {
				player1Char = c3;
				player1HasChar = true;
				msg.reply('chose Leoppscaay.');
			}
			else if (msg.author.id == player2) {
				player2Char = c3;
				player2HasChar = true;
				msg.reply('chose Leoppscaay.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'gold':
			if (msg.author.id == player1) {
				player1Char = c4;
				player1HasChar = true;
				msg.reply('chose Gold.');
			}
			else if (msg.author.id == player2) {
				player2Char = c4;
				player2HasChar = true;
				msg.reply('chose Gold.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'yellowstrike':
			if (msg.author.id == player1) {
				player1Char = c5;
				player1HasChar = true;
				msg.reply('chose Yellow Strike.');
			}
			else if (msg.author.id == player2) {
				player2Char = c5;
				player2HasChar = true;
				msg.reply('chose Yellow Strike.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'pinky': // best char btw kappa
			if (msg.author.id == player1) {
				player1Char = c6;
				player1HasChar = true;
				msg.reply('chose Pinky.');
			}
			else if (msg.author.id == player2) {
				player2Char = c6;
				player2HasChar = true;
				msg.reply('chose Pinky.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'redqueen':
			if (msg.author.id == player1) {
				player1Char = c7;
				player1HasChar = true;
				msg.reply('chose Red Queen.');
			}
			else if (msg.author.id == player2) {
				player2Char = c7;
				player2HasChar = true;
				msg.reply('chose Red Queen.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'kairo':
			if (msg.author.id == player1) {
				player1Char = c8;
				player1HasChar = true;
				msg.reply('chose Kairo.');
			}
			else if (msg.author.id == player2) {
				player2Char = c8;
				player2HasChar = true;
				msg.reply('chose Kairo.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'lyzan':
			if (msg.author.id == player1) {
				player1Char = c9;
				player1HasChar = true;
				msg.reply('chose Lyzan.');
			}
			else if (msg.author.id == player2) {
				player2Char = c9;
				player2HasChar = true;
				msg.reply('chose Lyzan.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'usabi':
			if (msg.author.id == player1) {
				player1Char = c10;
				player1HasChar = true;
				msg.reply('chose USaBi.');
			}
			else if (msg.author.id == player2) {
				player2Char = c10;
				player2HasChar = true;
				msg.reply('chose USaBi.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'ellfayrh':
			if (msg.author.id == player1) {
				player1Char = c11;
				player1HasChar = true;
				msg.reply('chose Ell\'Fayrh.');
			}
			else if (msg.author.id == player2) {
				player2Char = c11;
				player2HasChar = true;
				msg.reply('chose Ell\'Fayrh.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'may':
			if (msg.author.id == player1) {
				player1Char = c12;
				player1HasChar = true;
				msg.reply('chose May.');
			}
			else if (msg.author.id == player2) {
				player2Char = c12;
				player2HasChar = true;
				msg.reply('chose May.');
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		}
	}
});
