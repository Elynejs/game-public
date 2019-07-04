/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.login(config.token);

// Miscallaneous variables
let actionAmount = 0;
let turn = 1;
let gamePhase = false;
let turnPhase = false;
let player1choseChar = false;
let player2choseChar = false;
let gameStarting = false;
let playerCount = 0;
const dodgecdMax = 2;
const trapcdMax = 2;
const player1 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : '',
};
const player2 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : '',
};
const char = [{
	tier : 'S', // template with max stat for debugging purposes
	name : 'maxvalue', // name of the character
	hpmax : 5000, // vitality, when it falls to 0 the character is unusable
	hpremaining : 5000, // hp stat for damage calculation
	atk : 500, // maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	def : 100, // damage points reduced from the attack function of the opponent
	spd : 10, // the character with the highest SPD will have his action executed first
	agi : 10, // determine how good the character is at dodging
	acr : 10, // will be deduced from your opponent agi stat if he does the dodge function
	int : 200, // determines who wins a trap function
	mag : 2000, // used to determinate the damage of a magic attack, unaffected by defense
	magcd : 20, // number of turn to wait before using magic again
	magcdmax : 20, // max cd stat for action calculation
	dodgecd : 2, // number of turn to wait before using dodge again
	trapcd : 4, // number of turn to wait before using trap again
	rgn : 100, // amount of hp the character regenerate at the end of each turn
},
{
	tier : 'S',
	name : 'seize',
	hpmax : 3000,
	hpremaining : 3000,
	atk : 360,
	def : 35,
	spd : 9,
	agi : 9,
	acr : 8,
	int: 179,
	mag : 1500,
	magcd : 5,
	magcdmax : 5,
	dodgecd : 2,
	trapcd : 4,
	rgn : 90,
},
{
	tier : 'S',
	name : 'fusoku',
	hpmax : 4000,
	hpremaining : 4000,
	atk : 470,
	def : 65,
	spd : 5,
	agi : 4,
	acr : 4,
	int : 85,
	mag : 0,
	magcd : 0,
	magcdmax : 0,
	dodgecd : 2,
	trapcd : 4,
	rgn : 50,
},
{
	tier : 'S',
	name : 'leoppscaay',
	hpmax : 2500,
	hpremaining : 2500,
	atk : 310,
	def : 40,
	spd : 6,
	agi : 5,
	acr : 4,
	int : 100,
	mag : 500,
	magcd : 2,
	magcdmax: 2,
	dodgecd : 2,
	trapcd : 4,
	rgn : 70,
},
{
	tier : 'S',
	name : 'gold',
	hpmax : 3500,
	hpremaining : 3500,
	atk : 350,
	def : 55,
	spd : 6,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 1900,
	magcd : 10,
	magcdmax: 10,
	dodgecd : 2,
	trapcd : 4,
	rgn : 50,
},
{
	tier : 'A',
	name : 'yellow Strike',
	hpmax : 1500,
	hpremaining : 1500,
	atk : 320,
	def : 30,
	spd : 10,
	agi : 8,
	acr : 6,
	int : 130,
	mag : 800,
	magcd : 5,
	magcdmax: 5,
	dodgecd : 2,
	trapcd : 4,
	rgn : 10,
},
{
	tier : 'A',
	name : 'pinky',
	hpmax : 1000,
	hpremaining : 1000,
	atk : 330,
	def : 20,
	spd : 7,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 600,
	magcd : 3,
	magcdmax: 3,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
},
{
	tier : 'A',
	name : 'red queen',
	hpmax : 2000,
	hpremaining : 2000,
	atk : 260,
	def : 95,
	spd : 4,
	agi : 2,
	acr : 4,
	int : 120,
	mag : 300,
	magcd : 3,
	magcdmax: 3,
	dodgecd : 2,
	trapcd : 4,
	rgn : 10,
},
{
	tier : 'A',
	name : 'kairo',
	hpmax : 2000,
	hpremaining : 2000,
	atk : 400,
	def : 55,
	spd : 5,
	agi : 4,
	acr : 3,
	int : 75,
	mag : 0,
	magcd : 0,
	magcdmax: 0,
	dodgecd : 2,
	trapcd : 4,
	rgn : 20,
},
{
	tier : 'A',
	name : 'lyzan',
	hpmax : 1500,
	hpremaining : 1500,
	atk : 270,
	def : 35,
	spd : 7,
	agi : 7,
	acr : 6,
	int : 140,
	mag : 1800,
	magcd : 15,
	magcdmax: 15,
	dodgecd : 2,
	trapcd : 4,
	rgn : 100,
},
{
	tier : 'B',
	name : 'usabi',
	hpmax : 900,
	hpremaining : 900,
	atk : 260,
	def : 35,
	spd : 6,
	agi : 6,
	acr : 5,
	int : 90,
	mag : 400,
	magcd : 5,
	magcdmax: 5,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
},
{
	tier : 'B',
	name : 'ell\'fayrh',
	hpmax : 1000,
	hpremaining : 1000,
	atk : 250,
	def : 100,
	spd : 3,
	agi : 2,
	acr : 9,
	int : 190,
	mag : 1400,
	magcd : 10,
	magcdmax: 10,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
},
{
	tier : 'B',
	name : 'may',
	hpmax : 700,
	hpremaining : 700,
	atk : 260,
	def : 20,
	spd : 7,
	agi : 6,
	acr : 6,
	int : 120,
	mag : 150,
	magcd : 3,
	magcdmax: 3,
	dodgecd : 2,
	trapcd : 4,
	rgn : 5,
}];
const totalChar = char.length;

// Defining bot activity
client.on('ready', () => {
	client.user.setActivity('the game', { type: 'Playing' });
	console.log('Ready!');
});

function gameEnd(winner) {
	client.channels.get(config.channelID).send('Game is over ! Congratulation to ' + winner + ' !');
	gamePhase = false;
	turnPhase = false;
	playerCount = 0;
	actionAmount = 0;
	player1.choseAction = false;
	player2.choseAction = false;
	player1.char.hpremaining = player1.char.hpmax;
	player2.char.hpremaining = player2.char.hpmax;
	player1.char = {};
	player2.char = {};
	player1.id = 0;
	player2.id = 0;
	player1.username = '';
	player2.username = '';
	player1.dmg = 0;
	player2.dmg = 0;
	player1.action = '';
	player2.action = '';
	turn = 1;
	console.log(player1);
	console.log(player2);
}

// functions for turn actions
function changechar(player, char1, char2) {
	client.channels.get(config.channelID).send(player.username + ' switched ' + char1.name + ' for ' + char2.name);
	console.log('WiP');
}

function attack(player, char1, char2) {
	player.dmg = char1.atk * (1 - (char2.def / 100));
	char2.hpremaining = char2.hpremaining - player.dmg;
	client.channels.get(config.channelID).send(player.username + ' ordered ' + char1.name + ' to attack ' + char2.name + ' dealing ' + player.dmg + ' ammount of damage.');
}
function dodge(player, char1, char2) {
	if (char1.dodgecd === 0) {
		let dodgeValue = 0;
		dodgeValue = char1.agi - char2.acr;
		let procChance = 0;
		procChance = Math.floor(Math.random() * 6) + dodgeValue;
		if (procChance >= 6) {
			player.dmg = (char1.atk - char2.def) / 2;
			char2.hpremaining = char2.hpremaining - player.dmg;
		}
		else {
			client.channels.get(config.channelID).send(player.username + 'failed the dodge.');
		}
	}
	else {
		client.channels.get(config.channelID).send(player.username + 'can\'t dodge because it is still under cooldown.');
	}
}
function trap(player, char1, char2) {
	if (char1.trapcd === 0) {
		if (Math.floor(Math.random() * 2) <= 1) {
			player.dmg = ((char1.int * 2) - char2.int) * 3;
			char2.hpremaining = char2.hpremaining - player.dmg;
		}
		else {
			client.channels.get(config.channelID).send(player.username + 'failed the trap.');
		}
	}
	else {
		client.channels.get(config.channelID).send(player.username + 'can\'t use a trap because it is still under cooldown.');
	}
}
function defense(player, char1, char2) {
	player.dmg = player.dmg / 2; // WiP don't even ask me about that shit
	client.channels.get(config.channelID).send(char1.name + ' succesfully blocked the attack of ' + char2.name);
}
function magic(player, char1, char2) {
	if (char1.magcd === 0) {
		player.dmg = char1.mag;
		char2.hpremaining = char2.hpremaining - player.dmg;
	}
	else {
		client.channels.get(config.channelID).send(player + ' can\'t use magic because it is still under cooldown.');
	}
}

// function for passing from one turn to another
function addTurn() {
	turn = turn + 1;
	NewTurnPhase();
}

// function for gameend
function IsGameOver(player, char1) {
	if (char1.hpremaining <= 0) {
		gameEnd(player.username);
	}
	else {
		console.log(char1 + ' is still alive.');
	}
}

// function for action phase
function actionphase(player, char1, char2) {
	if (actionAmount === 2) {
		console.log('succesfully reached action aknowledgement');
		if (char1.spd > char2.spd) { // player1.char is faster than player2.char so it's attack is done before
			console.log('succesfully reached speed detection');
			if (player.action === 'changechar') {
				// WiP
				changechar(player1, player1.char, client.content.shift().args[0]);
				changechar(player2, player2.char, client.content.shift().args[0]);
			}
			else if (player.action === 'attack') {
				attack(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				attack(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'trap') {
				dodge(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				dodge(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'dodge') {
				trap(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				trap(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'defense') {
				defense(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				defense(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'magic') {
				magic(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				magic(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			player1.dmg = 0;
			player2.dmg = 0;
			actionAmount = 0;
			addTurn();
		}
		else if (player1.char.spd < player2.char.spd) {
			console.log('succesfully reached speed detection');
			if (player.action === 'changechar') {
				changechar(player1, player1.char, client.content.shift().args[0]);
				changechar(player2, player2.char, client.content.shift().args[0]);
			}
			else if (player.action === 'attack') {
				attack(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				attack(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'trap') {
				dodge(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				dodge(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'dodge') {
				trap(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				trap(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'defense') {
				defense(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				defense(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			else if (player.action === 'magic') {
				magic(player1, player1.char, player2.char);
				IsGameOver(player1, player2.char);
				magic(player2, player2.char, player1.char);
				IsGameOver(player2, player1.char);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			player1.dmg = 0;
			player2.dmg = 0;
			actionAmount = 0;
			addTurn();
		}
		else if (player1.char.spd === player2.char.spd) {
			if (Math.floor(Math.random() * 2) >= 1) {
				console.log('succesfully reached speed detection');
				if (player.action === 'changechar') {
					changechar(player1, player1.char, client.content.shift().args[0]);
					changechar(player2, player2.char, client.content.shift().args[0]);
				}
				else if (player.action === 'attack') {
					attack(player1, player1.char, player2.char);
					IsGameOver(player1, player2.char);
					attack(player2, player2.char, player1.char);
					IsGameOver(player2, player1.char);
				}
				else if (player.action === 'trap') {
					dodge(player1, player1.char, player2.char);
					IsGameOver(player1, player2.char);
					dodge(player2, player2.char, player1.char);
					IsGameOver(player2, player1.char);
				}
				else if (player.action === 'dodge') {
					trap(player1, player1.char, player2.char);
					IsGameOver(player1, player2.char);
					trap(player2, player2.char, player1.char);
					IsGameOver(player2, player1.char);
				}
				else if (player.action === 'defense') {
					defense(player1, player1.char, player2.char);
					IsGameOver(player1, player2.char);
					defense(player2, player2.char, player1.char);
					IsGameOver(player2, player1.char);
				}
				else if (player.action === 'magic') {
					magic(player1, player1.char, player2.char);
					IsGameOver(player1, player2.char);
					magic(player2, player2.char, player1.char);
					IsGameOver(player2, player1.char);
				}
				player1.choseAction = false;
				player2.choseAction = false;
				turnPhase = false;
				player1.dmg = 0;
				player2.dmg = 0;
				actionAmount = 0;
				addTurn();
			}
		}
	}
	else {
		console.log('actionAmount : ' + actionAmount);
		console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then there is a problem somewhere');
	}
}

// function for resetting turn phase
function NewTurnPhase() {
	// allowing combat regen and preventing it from going past max hp and deducing cd
	if (gamePhase === true && turnPhase === false) {
		client.channels.get(config.channelID).send('Turn' + ' ' + turn + ' ' + 'has started. Chose your character\'s action.');
		if (player1.char.hpremaining < player1.char.hpmax) {
			player1.char.hpremaining = player1.char.hpremaining + player1.char.rgn;
			if (player1.char.hpremaining > player1.char.hpmax) {
				player1.char.hpremaining = player1.char.hpmax;
			}
		}
		else if (player2.char.hpremaining < player2.char.hpmax) {
			player2.char.hpremaining = player2.char.hpremaining + player2.char.rgn;
			if (player2.char.hpremaining > player2.char.hpmax) {
				player2.char.hpremaining = player2.char.hpmax;
			}
		}
		if (player1.char.magcd > 0 && player1.char.magcdmax >= player1.char.magcd) {
			player1.char.magcd = player1.char.magcd - 1;
		}
		if (player2.char.magcd > 0 && player2.char.magcdmax >= player2.char.magcd) {
			player2.char.magcd = player2.char.magcd - 1;
		}
		if (player1.char.dodgecd > 0 && dodgecdMax >= player1.char.dodgecd) {
			player1.char.dodgecd = player1.char.dodgecd - 1;
		}
		if (player2.char.dodgecd > 0 && dodgecdMax >= player2.char.dodgecd) {
			player2.char.dodgecd = player2.char.dodgecd - 1;
		}
		if (player1.char.trapcd > 0 && trapcdMax >= player1.char.trapcd) {
			player1.char.trapcd = player1.char.trapcd - 1;
		}
		if (player2.char.trapcd > 0 && trapcdMax >= player2.char.trapcd) {
			player2.char.trapcd = player2.char.trapcd - 1;
		}
		turnPhase = true;
	}
}

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
			player1.username = msg.member.username;
			player1.id = msg.member.id;
			console.log(player1.id);
		}
		else if (playerCount === 1) {
			if (msg.member.id === player1.id) {
				msg.reply('is already registered.');
			}
			else {
				msg.reply('is registered as player 2! Type !start to start the game!');
				playerCount = 2;
				player2.username = msg.member.username;
				player2.id = msg.member.id;
				console.log(player2.id);
			}
		}
		else{
			msg.reply('there is already two registered players.');
			// failsafe in case someone tries to register when a game is in session
		}
	}
	// check if player1 chose a playable character
	if (command === 'testchar1') {
		if (msg.member.id === config.ownerID) {
			let u = 0;
			for (; u < totalChar; u++) {
				if (player1choseChar === true && player1.char.name === char[u].name) {
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
	// check if player2 chose a playable character
	if (command === 'testchar2') {
		if (msg.member.id === config.ownerID) {
			let u;
			for (u === 0 ; u < totalChar; u++) {
				if (player2choseChar === true && player2.char.name === char[u].name) {
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
	// editing command for player1.char
	if (command === 'editchar') {
		if (msg.member.id === config.ownerID) {
			if (args[0] === 'help') {
				msg.channel.send('Correct syntaxe is !editchar [name of the character] [stat you want to modify] [new value to stat] --- Please be aware that any change to any stat is definitive, use with caution');
			}
			else if (args.length === 3) {
				let a;
				for (a = 0; a < totalChar; a++) {
					if (args[0] === char[a].name) {
						console.log('value found : ' + char[a].name);
						let stat = Object.keys(char[a]);
						for (stat in args[1]) {
							console.log('value found : ' + args[1]);
							char[a].args[1] = args[2];
							msg.channel.send('Admin changed the value of ' + char[a].name + '\' ' + args[1] + ' to ' + args[2]);
						}
					}
				}
			}
			else {
				msg.channel.send('Syntaxe Error, type !editchar help for more information.');
			}
		}
	}
	// autostart a game with two predetermined discord account e.g. see config.json
	if (command === 'faststart') {
		if (msg.member.id === config.ownerID) {
			player1.id = config.testID1;
			player1.username = config.usernameID1;
			player2.id = config.testID2;
			player2.username = config.usernameID2;
			playerCount = 2;
			gameStarting = true;
			player1.char = char[2];
			player1choseChar = true;
			player2choseChar = true;
			player2.char = char[12];
			msg.channel.send('fast started the game with ' + config.usernameID1 + ' as player1 with ' + player1.char.name + ' and ' + config.usernameID2 + ' as player2 with ' + player2.char.name);
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	// return true if gameStarting is true
	if (command === 'testgamestarting') {
		if (msg.member.id === config.ownerID) {
			if(gameStarting === true) {
				console.log('true');
			}
			else {
				console.log('false');
			}
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	// return actionAmount value
	if (command === 'testactionamount') {
		if (msg.member.id === config.ownerID) {
			console.log('actionAmount : ' + actionAmount);
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	// return true if turnPhase is true
	if (command === 'testturnphase') {
		if (msg.member.id === config.ownerID) {
			if (turnPhase === true) {
				console.log('true');
			}
			else {
				console.log('false');
			}
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
		msg.reply('https://imgur.com/a98rwvW');
	}
	// gameEnd function test command
	if (command === 'gameend' && config.ownerID === msg.member.id) {
		gameEnd(player1.username);
		console.log(player1);
		console.log(player2);
	}
	// test player1
	if (command === 'testplayer1') {
		console.log(player1);
	}
	// test player2
	if (command === 'testplayer2') {
		console.log(player2);
	}
	// character selection
	if (gameStarting === true) {
		switch(command) {
		case'seize':
			if(msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[1];
					player1choseChar = true;
					msg.reply('chose Seize.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if(msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[1];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[2];
					player1choseChar = true;
					msg.reply('chose Fusoku.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[2];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[3];
					player1choseChar = true;
					msg.reply('chose Leoppscaay.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[3];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[4];
					player1choseChar = true;
					msg.reply('chose Gold.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[4];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[5];
					player1choseChar = true;
					msg.reply('chose Yellow Strike.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[5];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[6];
					player1choseChar = true;
					msg.reply('chose Pinky.');
					console.log(player1);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[6];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[7];
					player1choseChar = true;
					msg.reply('chose Red Queen.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[7];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[8];
					player1choseChar = true;
					msg.reply('chose Kairo.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[8];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[9];
					player1choseChar = true;
					msg.reply('chose Lyzan.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[9];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[10];
					player1choseChar = true;
					msg.reply('chose USaBi.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[10];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[11];
					player1choseChar = true;
					msg.reply('chose Ell\'Fayrh.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[11];
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1.char = char[12];
					player1choseChar = true;
					msg.reply('chose May.');
					console.log(player1);
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
				if (player2choseChar !== true) {
					player2.char = char[12];
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
	// defining turnPhase value
	if (player1choseChar === true && player2choseChar === true && gameStarting === true) {
		gameStarting = false;
		gamePhase = true;
		turnPhase = true;
		turn = 1;
		player1.char.magcd = 0;
		player2.char.magcd = 0;
		player1.char.dodgecd = 0;
		player1.char.trapcd = 0;
		player2.char.dodgecd = 0;
		player2.char.trapcd = 0;
		msg.channel.send('Turn' + ' ' + turn + ' ' + 'has started. Chose your character\'s action.');
	}

	// turn phase of the combat phase
	if (gamePhase === true && turnPhase === true) {
		switch(command) {
		case 'switch': // number in actions array = 0
			if (msg.member.id === player1.id) {
				player1.choseAction = true;
				player1.action = 'changechar';
				actionAmount = actionAmount + 1;
				actionphase(player1, player1.char, player2.char);
			}
			else if (msg.member.id === player2.id) {
				player2.choseAction = true;
				player2.action = 'changechar';
				actionAmount = actionAmount + 1;
				actionphase(player2, player1.char, player2.char);
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'attack': // number in array = 1
			if (msg.member.id === player1.id) {
				player1.choseAction = true;
				player1.action = 'attack';
				actionAmount = actionAmount + 1;
				actionphase(player1, player1.char, player2.char);
			}
			else if (msg.member.id === player2.id) {
				player2.choseAction = true;
				player2.action = 'attack';
				actionAmount = actionAmount + 1;
				actionphase(player2, player1.char, player2.char);
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'dodge': // number in array = 2
			if (msg.member.id === player1.id) {
				if (player1.char.dodgecd === 0) {
					player1.choseAction = true;
					player1.action = 'dodge';
					actionAmount = actionAmount + 1;
					actionphase(player1, player1.char, player2.char);
				}
				else {
					msg.channel.send(player1.username + ' can\'t dodge yet. Chose another option.');
				}
			}
			else if (msg.member.id === player2.id) {
				if (player2.char.dodgecd === 0) {
					player2.choseAction = true;
					player2.action = 'dodge';
					actionAmount = actionAmount + 1;
					actionphase(player2, player1.char, player2.char);
				}
				else {
					msg.channel.send(player1.username + ' can\'t dodge yet. Chose another option.');
				}
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'trap': // number in array = 3
			if (msg.member.id === player1.id) {
				if (player1.char.trapcd === 0) {
					player1.choseAction = true;
					player1.action = 'trap';
					actionAmount = actionAmount + 1;
					actionphase(player1, player1.char, player2.char);
				}
				else {
					msg.channel.send(player1.username + ' can\'t use trap yet. Chose another option.');
				}
			}
			else if (msg.member.id === player2.id) {
				if (player2.char.trapcd === 0) {
					player2.choseAction = true;
					player2.action = 'trap';
					actionAmount = actionAmount + 1;
					actionphase(player2, player1.char, player2.char);
				}
				else {
					msg.channel.send(player1.username + ' can\'t use trap yet. Chose another option.');
				}
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'defense': // number in array = 4
			if (msg.member.id === player1.id) {
				player1.choseAction = true;
				player1.action = 'defense';
				actionAmount = actionAmount + 1;
				actionphase(player1, player1.char, player2.char);
			}
			else if (msg.member.id === player2.id) {
				player2.choseAction = true;
				player2.action = 'defense';
				actionAmount = actionAmount + 1;
				actionphase(player2, player1.char, player2.char);
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'magic': // number in array = 5
			if (msg.member.id === player1.id) {
				player1.choseAction = true;
				player1.action = 'magic';
				actionAmount = actionAmount + 1;
				actionphase(player1, player1.char, player2.char);
			}
			else if (msg.member.id === player2.id) {
				player2.choseAction = true;
				player2.action = 'magic';
				actionAmount = actionAmount + 1;
				actionphase(player2, player1.char, player2.char);
			}
			else {
				console.log(msg.member.username + 'tried to play while not being registered as a player.');
			}
			break;
		}
	}
});
