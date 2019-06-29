/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.login(config.token);

// Miscallaneous variables
let turn = 1;
let gamePhase = false;
let turnPhase = false;
let player1choseChar = false;
let player2choseChar = false;
let gameStarting = false;
let playerCount = 0;
const dodgeCdMax = 2;
const trapCdMax = 2;
const player1 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : {},
};
const player2 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : {},
};
const char = [{
	tier : 'S', // template with max stat for debugging purposes
	name : 'maxvalue', // name of the character
	hpMax : 5000, // vitality, when it falls to 0 the character is unusable
	hpRemaining : 5000, // hp stat for damage calculation
	atk : 500, // maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	def : 200, // damage points reduced from the attack function of the opponent
	spd : 10, // the character with the highest SPD will have his action executed first
	agi : 10, // determine how good the character is at dodging
	acr : 10, // will be deduced from your opponent agi stat if he does the dodge function
	int : 200, // determines who wins a trap function
	mag : 2000, // used to determinate the damage of a magic attack, unaffected by defense
	magCd : 20, // number of turn to wait before using magic again
	magCdMax : 20, // max cd stat for action calculation
	dodgeCd : 2, // number of turn to wait before using dodge again
	trapCd : 4, // number of turn to wait before using trap again
	rgn : 100, // amount of hp the character regenerate at the end of each turn
},
{
	tier : 'S',
	name : 'Seize',
	hp : 3000,
	hpRemaining : 3000,
	atk : 360,
	def : 70,
	spd : 9,
	agi : 9,
	acr : 8,
	int: 179,
	mag : 1500,
	magCd : 5,
	magCdMax : 5,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 90,
},
{
	tier : 'S',
	name : 'Fusoku',
	hp : 4000,
	hpRemaining : 4000,
	atk : 470,
	def : 130,
	spd : 5,
	agi : 4,
	acr : 4,
	int : 85,
	mag : 0,
	magCd : 0,
	magCdMax : 0,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 50,
},
{
	tier : 'S',
	name : 'Leoppscaay',
	hp : 2500,
	hpRemaining : 2500,
	atk : 310,
	def : 80,
	spd : 6,
	agi : 5,
	acr : 4,
	int : 100,
	mag : 500,
	magCd : 2,
	magCdMax: 2,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 70,
},
{
	tier : 'S',
	name : 'Gold',
	hp : 3500,
	hpRemaining : 3500,
	atk : 350,
	def : 110,
	spd : 6,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 1900,
	magCd : 10,
	magCdMax: 10,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 50,
},
{
	tier : 'A',
	name : 'Yellow Strike',
	hp : 1500,
	hpRemaining : 1500,
	atk : 320,
	def : 60,
	spd : 10,
	agi : 8,
	acr : 6,
	int : 130,
	mag : 800,
	magCd : 5,
	magCdMax: 5,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 10,
},
{
	tier : 'A',
	name : 'Pinky',
	hp : 1000,
	hpRemaining : 1000,
	atk : 330,
	def : 40,
	spd : 7,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 600,
	magCd : 3,
	magCdMax: 3,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 0,
},
{
	tier : 'A',
	name : 'Red Queen',
	hp : 2000,
	hpRemaining : 2000,
	atk : 260,
	def : 190,
	spd : 4,
	agi : 2,
	acr : 4,
	int : 120,
	mag : 300,
	magCd : 3,
	magCdMax: 3,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 10,
},
{
	tier : 'A',
	name : 'Kairo',
	hp : 2000,
	hpRemaining : 2000,
	atk : 400,
	def : 110,
	spd : 5,
	agi : 4,
	acr : 3,
	int : 75,
	mag : 0,
	magCd : 0,
	magCdMax: 0,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 20,
},
{
	tier : 'A',
	name : 'Lyzan',
	hp : 1500,
	hpRemaining : 1500,
	atk : 270,
	def : 70,
	spd : 7,
	agi : 7,
	acr : 6,
	int : 140,
	mag : 1800,
	magCd : 15,
	magCdMax: 15,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 100,
},
{
	tier : 'B',
	name : 'USaBi',
	hp : 900,
	hpRemaining : 900,
	atk : 260,
	def : 70,
	spd : 6,
	agi : 6,
	acr : 5,
	int : 90,
	mag : 400,
	magCd : 5,
	magCdMax: 5,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 0,
},
{
	tier : 'B',
	name : 'Ell\'Fayrh',
	hp : 1000,
	hpRemaining : 1000,
	atk : 250,
	def : 200,
	spd : 3,
	agi : 2,
	acr : 9,
	int : 190,
	mag : 1400,
	magCd : 10,
	magCdMax: 10,
	dodgeCd : 2,
	trapCd : 4,
	rgn : 0,
},
{
	tier : 'B',
	name : 'May',
	hp : 700,
	hpRemaining : 700,
	atk : 260,
	def : 40,
	spd : 7,
	agi : 6,
	acr : 6,
	int : 120,
	mag : 150,
	magCd : 3,
	magCdMax: 3,
	dodgeCd : 2,
	trapCd : 4,
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
	// autostart a game with elynejs and elyne3
	if (command === 'faststart') {
		if (msg.member.id === config.ownerID) {
			player1.id = config.testID1;
			player1.username = config.usernameID1;
			player2.id = config.testID2;
			player2.username = config.usernameID2;
			playerCount = 2;
			gameStarting = true;
			console.log('fast started the game with elynejs as player1 and elyne3 as player2.');
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}
	// return true if gameStarting is true
	if (command === 'testgameStarting') {
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
	// return true if turnPhase is true
	if (command === 'testturnPhase') {
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
		msg.reply('https://imgur.com/bpUnnMl');
	}
	// gameEnd function test command
	if (command === 'gameEnd') {
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
		player1.char.magCd = 0;
		player2.char.magCd = 0;
		player1.char.dodgeCd = 0;
		player1.char.trapCd = 0;
		player2.char.dodgeCd = 0;
		player2.char.trapCd = 0;
		msg.channel.send('Turn' + ' ' + turn + ' ' + 'has started. Chose your character\'s action.');
	}
	// functions for turn actions
	function changechar(player, char1, char2) {
		msg.channel.send(player.username + ' switched ' + char1.name + ' for ' + char2.name);
		console.log('WiP');
	}
	function attack(player, char1, char2) {
		player.dmg = char1.atk - char2.def;
		msg.channel.send(player.username + ' ordered ' + char1.name + ' to attack ' + char2.name + ' dealing ' + player.dmg + ' ammount of damage.');
	}
	function dodge(player, char1, char2) {
		if (char1.dodgeCd === 0) {
			let dodgeValue = 0;
			dodgeValue = char1.agi - char2.acr;
			let procChance = 0;
			procChance = Math.floor(Math.random() * 6) + dodgeValue;
			if (procChance >= 6) {
				player.dmg = (char1.atk - char2.def) / 2;
				char2.hpRemaining = char2.hpRemaining - player.dmg;
			}
			else {
				msg.channel.send(player.username + 'failed the dodge.');
			}
		}
		else {
			msg.channel.send(player.username + 'can\'t dodge because it is still under cooldown.');
		}
	}
	function trap(player, char1, char2) {
		if (char1.trapCd === 0) {
			if (Math.floor(Math.random() * 2) <= 1) {
				player.dmg = ((char1.int * 2) - char2.int) * 3;
				char2.hpRemaining = char2.hpRemaining - player.dmg;
			}
			else {
				msg.channel.send(player.username + 'failed the trap.');
			}
		}
		else {
			msg.channel.send(player.username + 'can\'t use a trap because it is still under cooldown.');
		}
	}
	function defense(player, attacker, char1, char2) {
		attacker.dmg = attacker.dmg / 2;
	}
	function magic(player, char1, char2) {
		if (char1.magCd === 0) {
			player.dmg = char1.mag;
			char2.hpRemaining = char2.hpRemaining - player.dmg;
		}
		else {
			msg.channel.send(player + ' can\'t use magic because it is still under cooldown.');
		}
	}
	function addTurn() {
		turn = turn + 1;
	}
	function gameEnd(winner) {
		msg.channel.send('Game is over ! Congratulation to ' + winner + ' !');
		gamePhase = false;
		turnPhase = false;
		playerCount = 0;
		player1.choseAction = false;
		player2.choseAction = false;
		player1.char.hpRemaining = player1.char.hpMax;
		player2.char.hpRemaining = player2.char.hpMax;
		player1.char = {};
		player2.char = {};
		player1.id = 0;
		player2.id = 0;
		player1.username = '';
		player2.username = '';
		player1.dmg = 0;
		player2.dmg = 0;
		player1.action = {};
		player2.action = {};
		turn = 1;
	}
	// beginning of the combat phase
	// allowing combat regen and preventing it from going past max hp and deducing cd
	if (gamePhase === true && turnPhase === false) {
		msg.channel.send('Turn' + ' ' + turn + ' ' + 'has started. Chose your character\'s action.');
		player1.char.hpRemaining = player1.char.hpRemaining + player1.char.rgn;
		if (player1.char.hpRemaining >= player1.char.hpMax) {
			player1.char.hpRemaining = player1.char.hpMax;
		}
		player2.char.hpRemaining = player2.char.hpRemaining + player2.char.rgn;
		if (player2.char.hpRemaining >= player2.char.hpMax) {
			player2.char.hpRemaining = player2.char.hpMax;
		}
		if (player1.char.magCd > 0 && player1.char.magCdMax >= player1.char.magCd) {
			player1.char.magCd = player1.char.magCd - 1;
		}
		if (player2.char.magCd > 0 && player2.char.magCdMax >= player2.char.magCd) {
			player2.char.magCd = player2.char.magCd - 1;
		}
		if (player1.char.dodgeCd > 0 && dodgeCdMax >= player1.char.dodgeCd) {
			player1.char.dodgeCd = player1.char.dodgeCd - 1;
		}
		if (player2.char.dodgeCd > 0 && dodgeCdMax >= player2.char.dodgeCd) {
			player2.char.dodgeCd = player2.char.dodgeCd - 1;
		}
		if (player1.char.trapCd > 0 && trapCdMax >= player1.char.trapCd) {
			player1.char.trapCd = player1.char.trapCd - 1;
		}
		if (player2.char.trapCd > 0 && trapCdMax >= player2.char.trapCd) {
			player2.char.trapCd = player2.char.trapCd - 1;
		}
		turnPhase = true;
	}
	// turn phase of the combat phase
	if (gamePhase === true && turnPhase === true) {
		if (player1.char.hpRemaining <= 0) {
			gameEnd(player2.username);
		}
		else if (player2.char.hpRemaining <= 0) {
			gameEnd(player1.username);
		}
		else {
			switch(command) {
			case 'switch':
				if (msg.member.id === player1.id) {
					player1.choseAction = true;
					player1.action = changechar(player1, player1.char, command.args[0]);
				}
				else if (msg.member.id === player2.id) {
					player2.choseAction = true;
					player2.action = changechar(player2, player2.char, command.args[0]);
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			case 'attack':
				if (msg.member.id === player1.id) {
					player1.choseAction = true;
					player1.action = attack(player1, player1.char, player2.char);
				}
				else if (msg.member.id === player2.id) {
					player2.choseAction = true;
					player2.action = attack(player2, player2.char, player1.char);
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			case 'dodge':
				if (msg.member.id === player1.id) {
					if (player1.char.dodgeCd === 0) {
						player1.choseAction = true;
						player1.action = dodge(player1, player1.char, player2.char);
					}
					else {
						msg.channel.send(player1.username + ' can\'t dodge yet.');
					}
				}
				else if (msg.member.id === player2.id) {
					if (player2.char.dodgeCd === 0) {
						player2.choseAction = true;
						player2.action = dodge(player2, player2.char, player1.char);
					}
					else {
						msg.channel.send(player1.username + ' can\'t dodge yet.');
					}
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			case 'trap':
				if (msg.member.id === player1.id) {
					if (player1.char.trapCd === 0) {
						player1.choseAction = true;
						player1.action = trap(player1, player1.char, player2.char);
					}
					else {
						msg.channel.send(player1.username + ' can\'t use trap yet.');
					}
				}
				else if (msg.member.id === player2.id) {
					if (player2.char.trapCd === 0) {
						player2.choseAction = true;
						player2.action = trap(player2, player2.char, player1.char);
					}
					else {
						msg.channel.send(player1.username + ' can\'t use trap yet.');
					}
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			case 'defense':
				if (msg.member.id === player1.id) {
					player1.choseAction = true;
					player1.action = defense(player1, player2, player1.char, player2.char);
				}
				else if (msg.member.id === player2.id) {
					player2.choseAction = true;
					player2.action = defense(player2, player1, player2.char, player1.char);
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			case 'magic':
				if (msg.member.id === player1.id) {
					player1.choseAction = true;
					player1.action = magic(player1, player1.char, player2.char);
				}
				else if (msg.member.id === player2.id) {
					player2.choseAction = true;
					player2.action = magic(player2, player2.char, player1.char);
				}
				else {
					console.log(msg.member.username + 'tried to play while not being registered as a player.');
				}
				break;
			}
		}
	}
	if (player1.choseAction === true && player2.choseAction === true) {
		if (player1.char.spd > player2.char.spd) {
			player1.action;
			player2.action;
			addTurn();
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			player1.dmg = 0;
			player2.dmg = 0;
		}
		else if (player1.char.spd < player2.char.spd) {
			player2.action;
			player1.action;
			addTurn();
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			player1.dmg = 0;
			player2.dmg = 0;
		}
		else if (player1.char.spd === player2.char.spd) {
			if (Math.floor(Math.random() * 2) >= 1) {
				player1.action;
				player2.action;
				addTurn();
				player1.choseAction = false;
				player2.choseAction = false;
				turnPhase = false;
				player1.dmg = 0;
				player2.dmg = 0;
			}
			else {
				player2.action;
				player1.action;
				addTurn();
				player1.choseAction = false;
				player2.choseAction = false;
				turnPhase = false;
				player1.dmg = 0;
				player2.dmg = 0;
			}
		}
	}
});
