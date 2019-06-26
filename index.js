/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { Client, Attachment } = require('discord.js');
client.login(config.token);

// Miscallaneous variables
let i = 0;
let turnPhase = false;
let player1choseChar = false;
let player2choseChar = false;
let player1Char;
let player2Char;
let gameStarting = false;
let playerCount = 0;
let player1;
let player2;
const char = [{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
},
{
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
}];
const totalChar = char.length;

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
			player1 = msg.member.id;
			console.log(player1);
		}
		else if (playerCount === 1) {
			if (msg.member.id === player1) {
				msg.reply(' is already registered.');
			}
			else {
				msg.reply('is registered as player 2! Type !start to start the game!');
				playerCount = 2;
				player2 = msg.member.id;
				console.log(player2);
			}
		}
		else{
			msg.reply('there is already two registered players.');
			// failsafe in case someone tries to register when a game is in session
		}
	}
	// template for admin command
	if (command === 'testchar1') {
		if (msg.member.id === config.ownerID) {
			for (; i < totalChar; i++) {
				if (player1choseChar === true && player1Char.name === char[i].name) {
					console.log('player1 chose a recognized character.');
				}
				else {
					console.log('player1 chose an unrecognized character or the object is not working properly.');
				}
			}
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	if (command === 'testchar2') {
		if (msg.member.id === config.ownerID) {
			for (; i < totalChar; i++) {
				if (player2choseChar === true && player2Char.name === char[i].name) {
					console.log('player2 chose a recognized character.');
				}
				else {
					console.log('player2 chose an unrecognized character or the object is not working properly.');
				}
			}
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	if (command === 'faststart') {
		if (msg.member.id === config.ownerID) {
			player1 = config.testID1;
			player2 = config.testID2;
			playerCount = 2;
			gameStarting = true;
			console.log('fast started the game with elynejs as player1 and elyne3 as player2.');
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	if (command === 'testgameStarting') {
		if (msg.member.id === config.ownerID) {
			console.log(gameStarting);
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
			msg.channel.send('choose a character by typing "!" + your character. You can type !list to see the list of characters.');
			gameStarting = true;
		}
	}
	// list command
	if (command === 'list') {
		msg.reply('https://imgur.com/xndU0DE');
	}
	// character selection
	if (gameStarting === true) {
		switch(command) {
		case'seize':
			if(msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[1];
					player1choseChar = true;
					msg.reply('chose Seize.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if(msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[1];
					player2choseChar = true;
					msg.reply('chose Seize.');
				}
				else{
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'fusoku':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[2];
					player1choseChar = true;
					msg.reply('chose Fusoku.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[2];
					player2choseChar = true;
					msg.reply('chose Fusoku.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'leoppscaay':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[3];
					player1choseChar = true;
					msg.reply('chose Leoppscaay.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[3];
					player2choseChar = true;
					msg.reply('chose Leoppscaay.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'gold':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[4];
					player1choseChar = true;
					msg.reply('chose Gold.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[4];
					player2choseChar = true;
					msg.reply('chose Gold.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'yellowstrike':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[5];
					player1choseChar = true;
					msg.reply('chose Yellow Strike.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[5];
					player2choseChar = true;
					msg.reply('chose Yellow Strike.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'pinky': // best char btw kappa
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[6];
					player1choseChar = true;
					msg.reply('chose Pinky.');
					console.log(player1);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[6];
					player2choseChar = true;
					msg.reply('chose Pinky.');
					console.log(player2);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'redqueen':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[7];
					player1choseChar = true;
					msg.reply('chose Red Queen.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[7];
					player2choseChar = true;
					msg.reply('chose Red Queen.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'kairo':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[8];
					player1choseChar = true;
					msg.reply('chose Kairo.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[8];
					player2choseChar = true;
					msg.reply('chose Kairo.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'lyzan':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[9];
					player1choseChar = true;
					msg.reply('chose Lyzan.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[9];
					player2choseChar = true;
					msg.reply('chose Lyzan.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'usabi':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[10];
					player1choseChar = true;
					msg.reply('chose USaBi.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[10];
					player2choseChar = true;
					msg.reply('chose USaBi.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'ellfayrh':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[11];
					player1choseChar = true;
					msg.reply('chose Ell\'Fayrh.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[11];
					player2choseChar = true;
					msg.reply('chose Ell\'Fayrh.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		case 'may':
			if (msg.author.id == player1) {
				if (player1choseChar !== true) {
					player1Char = char[12];
					player1choseChar = true;
					msg.reply('chose May.');
					console.log(player1);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2) {
				if (player2choseChar !== true) {
					player2Char = char[12];
					player2choseChar = true;
					msg.reply('chose May.');
					console.log(player2);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else {
				msg.reply('is not a registered player.');
			}
			break;
		}
	}
});

if (player1choseChar === true && player2choseChar === true) {
	gameStarting = false;
	turnPhase = true;
}
