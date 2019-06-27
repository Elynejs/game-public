/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const { Client, Attachment } = require('discord.js');
client.login(config.token);

// Miscallaneous variables
let dmg = 0;
let gamePhase = false;
let gameEnd = false;
let turnPhase = false;
let player1choseChar = false;
let player2choseChar = false;
let player1Char;
let player2Char;
let gameStarting = false;
let playerCount = 0;
const player1 = {
	id : 0,
	choseAction : false,
	username : '',
};
const player2 = {
	id : 0,
	choseAction : false,
	username : '',
};
const char = [{
	tier : 'S', // template with max stat for debugging purposes
	name : 'maxvalue', // name of the character
	hp : 5000, // vitality, when it falls to 0 the character is unusable
	atk : 500, // maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	def : 200, // damage points reduced from the attack function of the opponent
	spd : 10, // the character with the highest SPD will have his action executed first
	agi : 10, // determine how good the character is at dodging
	acr : 10, // will be deduced from your opponent agi stat if he does the dodge function
	int : 200, // determines who wins a trap function
	mag : 2000, // used to determinate the damage of a magic attack, unaffected by defense
	magCd : 20, // number of turn to wait before using magic again
	dodgeCd : 2, // number of turn to wait before using dodge again
	trapCd : 4, // number of turn to wait before using trap again
	rgn : 100, // amount of hp the character regenerate at the end of each turn
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
	magCd : 5,
	dodgeCd : 2,
	trapCd : 4,
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
				if (player1choseChar === true && player1Char.name === char[u].name) {
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
			let u = 0;
			for (; u < totalChar; u++) {
				if (player2choseChar === true && player2Char.name === char[u].name) {
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
			player2.id = config.testID2;
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
	// character selection
	if (gameStarting === true) {
		switch(command) {
		case'seize':
			if(msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[1];
					player1choseChar = true;
					msg.reply('chose Seize.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if(msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[2];
					player1choseChar = true;
					msg.reply('chose Fusoku.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[3];
					player1choseChar = true;
					msg.reply('chose Leoppscaay.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[4];
					player1choseChar = true;
					msg.reply('chose Gold.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[5];
					player1choseChar = true;
					msg.reply('chose Yellow Strike.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
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
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[7];
					player1choseChar = true;
					msg.reply('chose Red Queen.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[8];
					player1choseChar = true;
					msg.reply('chose Kairo.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[9];
					player1choseChar = true;
					msg.reply('chose Lyzan.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[10];
					player1choseChar = true;
					msg.reply('chose USaBi.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
				if (player1choseChar !== true) {
					player1Char = char[11];
					player1choseChar = true;
					msg.reply('chose Ell\'Fayrh.');
				}
				else {
					msg.reply('already chose a character.');
				}
			}
			else if (msg.author.id == player2.id) {
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
			if (msg.author.id == player1.id) {
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
			else if (msg.author.id == player2.id) {
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
	// defining turnPhase value
	if (player1choseChar === true && player2choseChar === true) {
		gameStarting = false;
		gamePhase = true;
		turnPhase = true;
		player1Char.magCd = 0;
		player2Char.magCd = 0;
		player1Char.dodgeCd = 0;
		player1Char.trapCd = 0;
		player2Char.dodgeCd = 0;
		player2Char.trapCd = 0;
	}
	// functions for turn actions
	function changechar(player, char1, char2) {
		msg.channel.send(player.username + 'switched' + char1 + 'for' + char2);
		console.log('WiP');
	}
	function attack(player, char1, char2) {
		dmg = char1.atk - char2.def;
		msg.channel.send(player.username + ' ordered ' + char1 + ' to attack ' + char2 + ' dealing ' + dmg + ' ammount of damage.');
	}
	function dodge(player, char1, char2) {
		if (char1.dodgeCd === 0) {
			let dodgeValue = 0;
			dodgeValue = char1.agi - char2.acr;
			let procChance = 0;
			procChance = Math.floor(Math.random() * 6) + dodgeValue;
			if (procChance >= 6) {
				dmg = (char1.atk - char2.def) / 2;
				char2.hp = char2.hp - dmg;
			}
			else {
				msg.channel.send(player.username + 'failed the trap.');
			}
		}
		else {
			msg.channel.send(player.username + 'can\'t dodge because it is still under cooldown.');
		}
	}
	function trap(player, char1, char2) {
		if (char1.trapCd === 0) {
			if (Math.floor(Math.random() * 2) <= 1) {
				dmg = ((char1.int * 2) - char2.int) * 3;
			}
			else {
				msg.channel.send(player.username + 'failed the trap.');
			}
		}
		else {
			msg.channel.send(player.username + 'can\'t use a trap because it is still under cooldown.');
		}
	}
	function defense(player, char1, char2) {
		// isdhfds
	}
	function magic(player, char1, char2) {
		// waiting for trap & dodge to be finished to do this funcntion
	}
	// beginning turnPhase
	if (gamePhase === true && gameEnd !== true) {
		let i;
		for (i = 1; gameEnd !== true; i++) {
			if (player1.char.hp <= 0) {
				const winner = player2;
				gameEnd = true;
				playerCount = 0;
				gamePhase = false;
				turnPhase = false;
				msg.channel.send('Game is over ! Congratulation to ' + winner + ' !');
			}
			else if (player2.char.hp <= 0) {
				const winner = player1;
				gameEnd = true;
				playerCount = 0;
				gamePhase = false;
				turnPhase = false;
				msg.channel.send('Game is over ! Congratulation to ' + winner + ' !');
			}
			else {
				msg.channel.send('turn' + ' ' + i + ' ' + 'has started. Chose your character\'s action.');
				switch(command) {
				case 'switch':
					if (msg.member.id === player1.id) {
						changechar(player1, player1Char, command.args[0]);
					}
					else if (msg.member.id === player2.id) {
						changechar(player2, player2Char, command.args[0]);
					}
					else {
						console.log(msg.member.username + 'tried to play while not being registered as a player.');
					}
					break;
				case 'attack':
					if (msg.member.id === player1.id) {
						attack(player1, player1Char, player2Char);
					}
					else if (msg.member.id === player2.id) {
						attack(player2, player2Char, player1Char);
					}
					else {
						console.log(msg.member.username + 'tried to play while not being registered as a player.');
					}
					break;
				case 'dodge':
					if (msg.member.id === player1.id) {
						dodge(player1, player1Char, player2Char);
					}
					else if (msg.member.id === player2.id) {
						dodge(player2, player2Char, player1Char);
					}
					else {
						console.log(msg.member.username + 'tried to play while not being registered as a player.');
					}
				}
			}
		}
	}
});
