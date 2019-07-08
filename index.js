/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inline-comments */
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.login(config.token);

// Miscallaneous variables
let defense_stack = 0;
let defense_multiplier = 2;
let actionAmount = 0;
let turn = 1;
let gamePhase = false;
let turnPhase = false;
let player1choseChar = false;
let player2choseChar = false;
let gameStarting = false;
let playerCount = 0;
const dodgecdMax = 2;
const trapcdMax = 4;
const player1 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : '',
	message_damage : '',
	message_dodge : '',
	message_block : '',
};
const player2 = {
	id : 0,
	choseAction : false,
	username : '',
	dmg : 0,
	char : {},
	action : '',
	message_damage : '',
	message_dodge: '',
	message_block: '',
};
const char = [{
	tier : 'undefined', // template with max stat for debugging purposes
	name : 'undefined', // name of the character
	hpmax : 9999, // vitality, when it falls to 0 the character is unusable
	hp : 9999, // hp stat for damage calculation
	atk : 9999, // maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	crit_multi : 9999, // multiplier of damage in case of critical damage
	crit_chance : 9999, // chance for a physical attack to infllict critical damage
	def : 9999, // damage points reduced from the attack function of the opponent
	spd : 9999, // the character with the highest SPD will have his action executed first
	agi : 9999, // determine how good the character is at dodging
	acr : 9999, // will be deduced from your opponent agi stat if he does the dodge function
	int : 9999, // determines who wins a trap function
	mag : 9999, // used to determinate the damage of a magic attack, unaffected by defense
	magcd : 9999, // number of turn to wait before using magic again
	magcdmax : 9999, // max cd stat for action calculation
	dodgecd : 2, // number of turn to wait before using dodge again
	trapcd : 4, // number of turn to wait before using trap again
	rgn : 9999, // amount of hp the character regenerate at the end of each turn
	react_selection1 : 'undefined', // sentence to display on selecting the character to show character's personality
	react_selection2 : 'undefined',
	react_KO1 : 'undefined', // sentence to display on character's KO
	react_KO2 : 'undefined',
	react_victory1 : 'undefined', // sentence to display on character's victory
	react_victory2 : 'undefined',
	emoji : config.emote_undefined,
},
{
	tier : 'S',
	name : 'Seize',
	hpmax : 3600,
	hp : 3600,
	atk : 610,
	def : 35,
	crit_multi : 1.9,
	crit_chance : 20,
	spd : 9,
	agi : 12,
	acr : 7,
	int: 179,
	mag : 1600,
	magcd : 4,
	magcdmax : 4,
	dodgecd : 2,
	trapcd : 4,
	rgn : 110,
	react_selection1 : 'Ready to play with any of you <3',
	react_selection2 : 'Please don\'t be too boring...',
	react_KO1 : 'Okay that\'s just too boring, I\'m leaving.',
	react_KO2 : 'Aaaaaaah ! So fucking boring.',
	react_victory1 : 'A rather expected outcome, duh.',
	react_victory2 : 'YOU DON\'T SAY ?',
	emoji : config.emote_seize,
},
{
	tier : 'S',
	name : 'Fusoku',
	hpmax : 4700,
	hp : 4700,
	atk : 870,
	crit_multi : 1.6,
	crit_chance : 30,
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
	rgn : 30,
	react_selection1 : 'I will fight for you, with honor.',
	react_selection2 : 'I will fight for you, with honor.',
	react_KO1 : 'I\'m sorry... I can\'t continue...',
	react_KO2 : 'I can\'t...',
	react_victory1 : 'You fought well.',
	react_victory2 : 'You\'ll do better next time.',
	emoji: config.emote_fusoku,
},
{
	tier : 'S',
	name : 'Leoppscaay',
	hpmax : 2400,
	hp : 2400,
	atk : 460,
	crit_multi : 1.2,
	crit_chance : 60,
	def : 40,
	spd : 6,
	agi : 5,
	acr : 4,
	int : 100,
	mag : 600,
	magcd : 2,
	magcdmax: 2,
	dodgecd : 2,
	trapcd : 4,
	rgn : 80,
	react_selection1 : 'Nhh... can I just go home ?',
	react_selection2 : 'Nhh... can I just go home ?',
	react_KO1 : 'I didn\'t even wanted to take part in that ti begin with...',
	react_KO2 : 'It\'s over, leave me alone !',
	react_victory1 : 'So can I leave now ?',
	react_victory2 : 'So can I leave now ?',
	emoji: config.emote_leoppsccay,
},
{
	tier : 'S',
	name : 'Gold',
	hpmax : 3900,
	hp : 3900,
	atk : 590,
	crit_multi : 1.3,
	crit_chance : 50,
	def : 50,
	spd : 6,
	agi : 3,
	acr : 5,
	int : 120,
	mag : 1900,
	magcd : 8,
	magcdmax: 8,
	dodgecd : 2,
	trapcd : 4,
	rgn : 35,
	react_selection1 : '...',
	react_selection2 : '...',
	react_KO1 : '...!? How ?',
	react_KO2 : '.....',
	react_victory1 : '...Done.',
	react_victory2 : '...',
	emoji: config.emote_gold,
},
{
	tier: 'S',
	name: 'Ayddan',
	hpmax: 5000,
	hp: 5000,
	atk: 900,
	crit_multi: 2,
	crit_chance: 10,
	def: 60,
	spd: 3,
	agi: 2,
	acr: 3,
	int: 110,
	mag: 0,
	magcd: 0,
	magcdmax: 0,
	dodgecd: 2,
	trapcd: 4,
	rgn: 20,
	react_selection1: 'Guess you want to be in the winning team, uh ?',
	react_selection2: 'Ready to win that one as well~',
	react_KO1: 'What the hell... ?!',
	react_KO2: 'Seriously...?',
	react_victory1: 'Told ya~',
	react_victory2: 'It\'s not like you could do anything against it.',
	emoji : config.emote_ayddan,
},
{
	tier : 'A',
	name : 'Snipefox',
	hpmax : 1900,
	hp : 1900,
	atk : 450,
	crit_multi : 2.5,
	crit_chance : 30,
	def : 25,
	spd : 7,
	agi : 10,
	acr : 15,
	int : 130,
	mag : 1400,
	magcd : 5,
	magcdmax : 5,
	dodgecd : 2,
	trapcd : 4,
	rgn : 10,
	react_selection1 : 'Who\'s the target ?',
	react_selection2 : 'Who\'s the target ?',
	react_KO1 : 'I can\'t make it, I must retreat.',
	react_KO2 : 'I can\'t make it, I must retreat.',
	react_victory1 : 'Target neutralised.',
	react_victory2 : 'Objective accomplished.',
	emoji : config.emote_snipefox,
},
{
	tier : 'A',
	name : 'Yellow Strike',
	hpmax : 1500,
	hp : 1500,
	atk : 440,
	crit_multi : 1.7,
	crit_chance : 20,
	def : 60,
	spd : 10,
	agi : 15,
	acr : 6,
	int : 130,
	mag : 900,
	magcd : 4,
	magcdmax: 4,
	dodgecd : 2,
	trapcd : 4,
	rgn : 10,
	react_selection1 : 'I bet you\'re not even going to hit me ! You\'re all so slow !',
	react_selection2 : 'Do you think you\'ll even be able to touch me ?!',
	react_KO1 : 'I lost... my bet, damnit.',
	react_KO2 : '...Almost...',
	react_victory1 : 'Haha ! Told you !',
	react_victory2 : 'See ?! I\'m so fast right ?!',
	emoji: config.emote_yellowstrike,
},
{
	tier : 'A',
	name : 'Pinky',
	hpmax : 1000,
	hp : 1000,
	atk : 510,
	crit_multi : 2.5,
	crit_chance : 15,
	def : 20,
	spd : 7,
	agi : 3,
	acr : 6,
	int : 120,
	mag : 700,
	magcd : 3,
	magcdmax: 3,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
	react_selection1 : 'Why did you choose me ... ?',
	react_selection2 : 'Why did you choose me ... ?',
	react_KO1 : '...Finally.',
	react_KO2 : '...Finally.',
	react_victory1 : 'Pathetic',
	react_victory2 : 'Pathetic',
	emoji: config.emote_pinky,
},
{
	tier : 'A',
	name : 'Red Queen',
	hpmax : 2000,
	hp : 2000,
	atk : 310,
	crit_multi : 1.2,
	crit_chance : 30,
	def : 70,
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
	react_selection1 : 'Who is even daring to fight the Queen ?!',
	react_selection2 : 'Who is even daring to fight the Queen ?!',
	react_KO1 : 'You\'re going to be punished... For that...',
	react_KO2 : 'You\'re going to be punished... For that...',
	react_victory1 : 'That\'s what you get for opposing the Queen.',
	react_victory2 : 'That\'s what you get for opposing the Queen.',
	emoji: config.emote_redqueen,
},
{
	tier : 'A',
	name : 'Kairo',
	hpmax : 2000,
	hp : 2000,
	atk : 750,
	crit_multi : 1.5,
	crit_chance : 20,
	def : 50,
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
	react_selection1 : 'So you need me for a fight right ? Let\'s do that.',
	react_selection2 : 'Let\'s go.',
	react_KO1 : 'Fuck you !',
	react_KO2 : 'Fuck you !',
	react_victory1 : 'Easy !',
	react_victory2 : 'Easy !',
	emoji: config.emote_kairo,
},
{
	tier : 'A',
	name : 'Lyzan',
	hpmax : 1500,
	hp : 1500,
	atk : 200,
	crit_multi : 5,
	crit_chance : 30,
	def : 30,
	spd : 6,
	agi : 7,
	acr : 5,
	int : 140,
	mag : 2100,
	magcd : 15,
	magcdmax: 15,
	dodgecd : 2,
	trapcd : 4,
	rgn : 100,
	react_selection1 : 'I\'m sorry but if you thought I was defenceless, I\'m going to have to disappoint you, bring it on !',
	react_selection2 : 'You know I don\'t like to fight right ?!',
	react_KO1 : 'I really need to... Upgrade that strength boost...',
	react_KO2 : 'Ran out of energy too soon again...Fuck.',
	react_victory1 : '... May I collect some blood sample while you\'re busy bleeding that mutch ?',
	react_victory2 : 'Don\'t you piss me off again or that\'s your neck I\'ll break next time.',
	emoji: config.emote_lyzan,
},
{
	tier : 'B',
	name : 'USaBi',
	hpmax : 900,
	hp : 900,
	atk : 240,
	crit_multi : 2,
	crit_chance : 20,
	def : 30,
	spd : 6,
	agi : 6,
	acr : 5,
	int : 90,
	mag : 500,
	magcd : 5,
	magcdmax: 5,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
	react_selection1 : 'This again ?!',
	react_selection2 : 'You really piss me off !',
	react_KO1 : 'I\'m out of... Battery............. Disconnecting.',
	react_KO2 : 'I\'m out of... Battery............. Disconnecting.',
	react_victory1 : 'That\'s over now !',
	react_victory2 : 'That\'s over now !',
	emoji: config.emote_usabi,
},
{
	tier : 'B',
	name : 'Ell\'Fayrh',
	hpmax : 1000,
	hp : 1000,
	atk : 180,
	crit_multi : 3,
	crit_chance : 10,
	def : 85,
	spd : 3,
	agi : 2,
	acr : 9,
	int : 190,
	mag : 1500,
	magcd : 10,
	magcdmax: 10,
	dodgecd : 2,
	trapcd : 4,
	rgn : 0,
	react_selection1 : 'Hhh... Another of those pointless fights, uh ?',
	react_selection2 : 'Let\'s see if I can get some data from this fight at least...',
	react_KO1 : 'Tsk... Of course this was going to end like this, I\'m not a fighter.',
	react_KO2 : '...Thoses data are rather interesting...',
	react_victory1 : 'Considering your capacity I don\'t even know why you picked a fight to being with.',
	react_victory2 : 'You\'re stronger, yet your strategy...Even less than mediocre. And you lost.',
	emoji: config.emote_ellfayrh,
},
{
	tier : 'C',
	name : 'May',
	hpmax : 700,
	hp : 700,
	atk : 120,
	crit_multi : 1.1,
	crit_chance : 40,
	def : 20,
	spd : 7,
	agi : 6,
	acr : 6,
	int : 120,
	mag : 250,
	magcd : 3,
	magcdmax: 3,
	dodgecd : 2,
	trapcd : 4,
	rgn : 5,
	react_selection1 : 'I\'m going to do the best I can !... Which is not much, but...',
	react_selection2 : 'I\'m going to do the best I can !... Which is not much, but...',
	react_KO1 : 'Nhh... I did the best I could, sorry.',
	react_KO2 : 'I knew it... I can\'t win...',
	react_victory1 : 'What ?! I won ? Really ?',
	react_victory2 : 'WHAT ?! REALLY ?',
	emoji: config.emote_may,
},
{
	tier: 'H',
	name: 'Dyakkoo',
	hpmax: 1300,
	hp: 1300,
	atk: 100,
	crit_multi: 1,
	crit_chance: 0,
	def: 90,
	spd: 2,
	agi: 4,
	acr: 3,
	int: 115,
	mag: 0,
	magcd: 0,
	magcdmax: 0,
	dodgecd: 2,
	trapcd: 4,
	rgn: 20,
	react_selection1 : 'It\'s just a friendly fight so everyone calm down please... No need for anyone to get hurt.',
	react_selection2 : 'It\'s just a friendly fight so everyone calm down please... No need for anyone to get hurt. ',
	react_KO1 : 'This wasn\'t supposed... To be that violent !',
	react_KO2 : 'This wasn\'t supposed... To be that violent !',
	react_victory1 : 'Surrender yourself, there is no need for anyone to get hurt anymore, it\'s over.',
	react_victory2 : 'Just surrend, there is no need for anyone to get hurt anymore, it\'s over.',
	emoji : config.emote_dyakkoo,
},
{
	tier: 'H',
	name: 'Kairen',
	hpmax: 600,
	hp: 600,
	atk: 70,
	crit_multi: 1,
	crit_chance: 0,
	def: 25,
	spd: 5,
	agi: 7,
	acr: 4,
	int: 100,
	mag: 0,
	magcd: 0,
	magcdmax: 0,
	dodgecd: 2,
	trapcd: 4,
	rgn: 0,
	react_selection1: 'I\'ll do my best, so please be kind.',
	react_selection2: 'I hope I\'ll be usefull...',
	react_KO1: 'Please... Help...',
	react_KO2: 'Please... Help...',
	react_victory1: 'I\'m happy I got to win !',
	react_victory2: 'That was a nice game, let\'s play again !',
	emoji: config.emote_kairen,
}];
const totalChar = char.length;

// Defining bot activity
client.on('ready', () => {
	client.user.setActivity('Type !register to start a game.');
	console.log('Ready!');
});

// functions for displaying characters gimmicks
function react_selection(player) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_selection1);
	}
	else {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_selection2);
	}
}

function react_KO(player) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_KO1);
	}
	else {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_KO2);
	}
}

function react_victory(player) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_victory1);
	}
	else {
		client.channels.get(config.channelID).send(player.char.emoji + ' ' + player.char.react_victory2);
	}
}

// function for defense_stack
function IsDefenseStackReset() {
	if (defense_stack >= 2) {
		defense_multiplier = 2;
	}
	else {
		defense_multiplier = defense_multiplier - (1 / 3);
	}
}
// function for passing from one turn to another
function addTurn() {
	defense_stack = defense_stack + 1;
	turn = turn + 1;
	NewTurnPhase();
}

// function for status display (finally)
function status() {
	client.channels.get(config.channelID).send({
		embed: {
			color: 16286691,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			fields: [{
				name: player1.char.emoji + ' :crossed_swords:' + ' **DAMAGE** ' + ':arrow_right: ' + player2.char.emoji,
				value: player2.message_block + player1.message_damage + player2.message_dodge,
			},
			{
				name: player2.char.emoji + ' :crossed_swords:' + ' **DAMAGE** ' + ':arrow_right: ' + player1.char.emoji,
				value: player1.message_block + player2.message_damage + player1.message_dodge,
			},
			{
				name: '**REGENERATION**',
				value: '\`\`\`Diff\n+ ' + player1.char.name + ' has regenerated ' + player1.char.rgn + ' HP.\n+ ' + player2.char.name + ' has regenerated ' + player2.char.rgn + ' HP.\`\`\`',
			},
			{
				name: player1.char.emoji + ' **STATUS**',
				value: '\`\`\`ini\n[' + player1.char.name + ' has ' + player1.char.hp + '/' + player1.char.hpmax + ' HP left!]\n[' + player1.char.name + ' Mag CD : ' + player1.char.magcd + '/' + player1.char.magcdmax + ']\`\`\`',
			},
			{
				name: player2.char.emoji + ' **STATUS**',
				value: '\`\`\`ini\n[' + player2.char.name + ' has ' + player2.char.hp + '/' + player2.char.hpmax + ' HP left!]\n[' + player2.char.name + ' Mag CD : ' + player2.char.magcd + '/' + player2.char.magcdmax + ']\`\`\`',
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: 'Beginning new turn...',
			},
		},
	});
}

// functions for turn actions
function changechar(player, char1, char2) {
	client.channels.get(config.channelID).send(player.username + ' switched ' + char1.name + ' for ' + char2.name);
	console.log('WiP');
}

function attack(player, otherplayer, char1, char2) {
	if (otherplayer.action !== 'defense') {
		if (char1.crit_chance > Math.floor(Math.random() * 100)) {
			player.dmg = (char1.atk * (1 - (char2.def / 100))) * char1.crit_multi;
			player.message_damage = ('\`\`\`diff\n- ' + 'Critical Damage !' + ' ' + player.char.name + ' inflicts ' + Math.floor(player.dmg) + ' damages to ' + otherplayer.char.name + ' !\`\`\`');
		}
		else {
			player.dmg = char1.atk * (1 - (char2.def / 100));
			player.message_damage = ('\`\`\`diff\n- ' + char1.name + ' inflicts ' + Math.floor(player.dmg) + ' damages to ' + char2.name + ' !\`\`\`');
		}
		dodge(player, otherplayer, char2, char1);
		if (player.dmg < 0) {
			player.dmg = 0;
		}
		char2.hp = char2.hp - Math.floor(player.dmg);
	}
	else {
		defense(player, char1, char2);
		otherplayer.message_block = ('\`\`\`diff\n- ' + char2.name + ' multiplicated their defense for this turn by ' + Math.floor(defense_multiplier) + '\`\`\`');
		if (player.dmg < 0) {
			player.dmg = 0;
		}
		char2.hp = char2.hp - Math.floor(player.dmg);
	}
}

function dodge(player, otherplayer, char_1, char_2) {
	if (char_1.dodgecd === 0) {
		let dodgeValue = 0;
		dodgeValue = (char_1.agi - char_2.acr) + 1;
		const diceroll = Math.floor(Math.random() * 10);
		if (diceroll <= 9) {
			if (dodgeValue >= diceroll) {
				player.dmg = 0;
				char_1.dodgecd = dodgecdMax;
				player.message_damage = '';
				otherplayer.message_dodge = (char_1.name + ' dodged ' + char_2.name + '\'s attack.');
			}
			else {
				console.log(char_1.name + ' tried to dodge ' + char_2.name + '\'s attack but failed.');
			}
		}
		else if (diceroll === 10) {
			player.dmg = 0;
			char_1.dodgecd = dodgecdMax;
			player.message_damage = '';
			otherplayer.message_dodge = (char_1.name + ' dodged ' + char_2.name + '\'s attack.');
		}
	}
	else {
		console.log(char_1.name + ' tried to dodge but couldn\'t because it is still under cooldown.');
	}
}

function defense(player, char1, char2) {
	if (char1.crit_chance > Math.floor(Math.random() * 100)) {
		player.dmg = (char1.atk / (1 - ((char2.def * defense_multiplier) / 100)) * char1.crit_multi);
	}
	else {
		player.dmg = char1.atk * (1 - ((char2.def * defense_multiplier) / 100));
	}
	defense_stack = 0;
}

function magic(player, char1, char2) {
	if (char2.tier === 'H') {
		player.dmg = char1.mag * 5;
		player.message_damage = ('\`\`\`diff\n- ' + char1.name + ' inflicts ' + Math.floor(player.dmg) + ' damages to ' + char2.name + ' !\`\`\`');
		char2.hp = char2.hp - Math.floor(player.dmg);
		player.char.magcd = player.char.magcdmax;
	}
	else {
		player.dmg = char1.mag;
		player.message_damage = ('\`\`\`diff\n- ' + char1.name + ' inflicts ' + Math.floor(player.dmg) + ' damages to ' + char2.name + ' !\`\`\`');
		char2.hp = char2.hp - Math.floor(player.dmg);
		player.char.magcd = player.char.magcdmax;
	}
}

function gameEnd(winner, looser) {
	react_KO(looser);
	react_victory(winner);
	client.channels.get(config.channelID).send('**\`\`\`fix\nCongratulation to ' + winner.username + ' !\nGAME IS OVER ! \`\`\`**');
	gamePhase = false;
	turnPhase = false;
	playerCount = 0;
	actionAmount = 0;
	player1.message_block = '';
	player2.message_block = '';
	player1.message_damage = '';
	player2.message_damage = '';
	player1.message_dodge = '';
	player2.message_dodge = '';
	player1choseChar = false;
	player2choseChar = false;
	player1.choseAction = false;
	player2.choseAction = false;
	player1.char.hp = player1.char.hpmax;
	player2.char.hp = player2.char.hpmax;
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

// function for gameend
function IsGameOver(player, otherplayer, char1) {
	if (char1.hp <= 0) {
		gameEnd(player, otherplayer);
	}
	else {
		console.log(char1.name + ' is still alive.');
	}
}

// function for action phase
function actionphase(firstplayer, secondplayer) {
	if (actionAmount === 2) {
		if (firstplayer.char.spd > secondplayer.char.spd) { // player1.char is faster than player2.char so it's attack is done before
			if (firstplayer.action === 'changechar') {
				// WiP
				changechar(player1, player1.char, client.content.shift().args[0]);
			}
			if (firstplayer.action === 'attack') {
				attack(player1, player2, player1.char, player2.char);
				IsGameOver(player1, player2, player2.char);
			}
			if (firstplayer.action === 'magic') {
				magic(player1, player1.char, player2.char);
				IsGameOver(player1, player2, player2.char);
			}
			if (secondplayer.action === 'changechar') {
				changechar(player2, player2.char, client.content.shift().args[0]);
			}
			if (secondplayer.action === 'attack') {
				attack(player2, player1, player2.char, player1.char);
				IsGameOver(player2, player1, player1.char);
			}
			if (secondplayer.action === 'magic') {
				magic(player2, player2.char, player1.char);
				IsGameOver(player2, player1, player1.char);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			actionAmount = 0;
			addTurn();
		}
		else if (firstplayer.char.spd < secondplayer.char.spd) {
			console.log('succesfully reached speed detection');
			if (secondplayer.action === 'changechar') {
				changechar(player2, player2.char, client.content.shift().args[0]);
			}
			if (secondplayer.action === 'attack') {
				attack(player2, player1, player2.char, player1.char);
				IsGameOver(player2, player1, player1.char);
			}
			if (secondplayer.action === 'magic') {
				magic(player2, player2.char, player1.char);
				IsGameOver(player2, player1, player1.char);
			}
			if (firstplayer.action === 'changechar') {
				// WiP
				changechar(player1, player1.char, client.content.shift().args[0]);
			}
			if (firstplayer.action === 'attack') {
				attack(player1, player2, player1.char, player2.char);
				IsGameOver(player1, player2, player2.char);
			}
			if (firstplayer.action === 'magic') {
				magic(player1, player1.char, player2.char);
				IsGameOver(player1, player2, player2.char);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			actionAmount = 0;
			addTurn();
		}
		else if (firstplayer.char.spd === secondplayer.char.spd) {
			if (Math.floor(Math.random() * 2) >= 1) {
				console.log('succesfully reached speed detection');
				if (firstplayer.action === 'changechar') {
					// WiP
					changechar(player1, player1.char, client.content.shift().args[0]);
				}
				if (firstplayer.action === 'attack') {
					attack(player1, player2, player1.char, player2.char);
					IsGameOver(player1, player2, player2.char);
				}
				if (firstplayer.action === 'magic') {
					magic(player1, player1.char, player2.char);
					IsGameOver(player1, player2, player2.char);
				}
				if (secondplayer.action === 'changechar') {
					changechar(player2, player2.char, client.content.shift().args[0]);
				}
				if (secondplayer.action === 'attack') {
					attack(player2, player1, player2.char, player1.char);
					IsGameOver(player2, player1, player1.char);
				}
				if (secondplayer.action === 'magic') {
					magic(player2, player2.char, player1.char);
					IsGameOver(player2, player1, player1.char);
				}
				player1.choseAction = false;
				player2.choseAction = false;
				turnPhase = false;
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

// function for regen
function regen(player) {
	if (player.char.hp < player.char.hpmax) {
		player.char.hp = player.char.hp + player.char.rgn;
		if (player.char.hp > player.char.hpmax) {
			player.char.hp = player.char.hpmax;
		}
	}
}

// function for resetting turn phase
function NewTurnPhase() {
	// allowing combat regen and preventing it from going past max hp and deducing cd
	if (gamePhase === true && turnPhase === false) {
		regen(player1);
		regen(player2);
		status();
		player1.dmg = 0;
		player2.dmg = 0;
		player1.message_block = '';
		player2.message_block = '';
		player1.message_damage = '';
		player2.message_damage = '';
		player1.message_dodge = '';
		player2.message_dodge = '';
		IsDefenseStackReset();
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
		client.channels.get(config.channelID).send('\`\`\`diff\nTurn' + ' ' + turn + ' ' + 'has started. Chose your character\'s action.\`\`\`');
		turnPhase = true;
	}
}

// commands
client.on('message', msg => {
	if (msg.author.bot) return; // won't react to bots
	if (msg.content.indexOf(config.prefix) !== 0) return; // array starts after the actual command
	// destructuring
	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command === 'register') {
	// command for registering as a "player"
		if (playerCount === 0) {
			msg.reply('is registered as player 1! Waiting for another player...');
			playerCount = 1;
			player1.username = msg.author.username;
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
				player2.username = msg.author.username;
				player2.id = msg.member.id;
				console.log(player2.id);
			}
		}
		else{
			msg.reply('there is already two registered players.');
			// failsafe in case someone tries to register when a game is in session
		}
	}
	// surrender command
	if (command === 'surrender') {
		if (msg.member.id === player1.id) {
			gameEnd(player2, player1);
		}
		else if (msg.member.id === player2.id) {
			gameEnd(player1, player2);
		}
		else {
			msg.replpy(' you can\'t surrender since you are not a registered player');
		}
	}
	// check if player1 chose a playable character
	if (command === 'testchar1') {
		if (msg.member.id === config.ownerID) {
			let u;
			for (u in char) {
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
			for (u in char) {
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
				msg.channel.send('Correct syntaxe is !editchar [name] [stat] [value]');
			}
			else if (args.length === 3) {
				let a;
				for (a = 0; a < totalChar; a++) {
					if (args[0] === char[a].name.toLowerCase()) {
						console.log('value found : ' + char[a].name);
						let stat = Object.keys(char[a]);
						for (stat in args[1]) {
							console.log('value found : ' + args[1]);
							char[a][args[1]] = args[2];
							msg.channel.send('Admin changed the value of ' + char[a].name + '\'s ' + args[1] + ' to ' + args[2]);
							break;
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
			player1.char = char[1];
			player1choseChar = true;
			player2choseChar = true;
			player2.char = char[4];
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
		msg.reply('https://imgur.com/mtzCunX');
	}
	// gameEnd function test command
	if (command === 'gameend' && config.ownerID === msg.member.id) {
		gameEnd(player1);
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
		let i;
		for (i = 0; i < totalChar; i++) {
			if (command === char[i].name.toLowerCase()) {
				if (msg.member.id == player1.id) {
					if (player1choseChar !== true) {
						player1.char = char[i];
						player1choseChar = true;
						msg.reply(' chose ' + player1.char.name);
						react_selection(player1);
					}
					else {
						msg.reply(' already chose a character.');
					}
				}
				else if (msg.member.id == player2.id) {
					if (player2choseChar !== true) {
						player2.char = char[i];
						player2choseChar = true;
						msg.reply(' chose ' + player2.char.name);
						react_selection(player2);
					}
					else {
						msg.reply(' already chose a character.');
					}
				}
				else {
					msg.reply(' is not a registered player.');
				}
				break;
			}
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
			if (msg.member.id === player1.id && player1.choseAction === false) {
				player1.choseAction = true;
				player1.action = 'changechar';
				actionAmount = actionAmount + 1;
				actionphase(player1, player2);
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				player2.choseAction = true;
				player2.action = 'changechar';
				actionAmount = actionAmount + 1;
				actionphase(player1, player2);
			}
			else {
				console.log(msg.author.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'attack': // number in array = 1
			if (msg.member.id === player1.id && player1.choseAction === false) {
				player1.choseAction = true;
				player1.action = 'attack';
				actionAmount = actionAmount + 1;
				actionphase(player1, player2);
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				player2.choseAction = true;
				player2.action = 'attack';
				actionAmount = actionAmount + 1;
				actionphase(player1, player2);
			}
			else {
				console.log(msg.author.username + 'tried to play while not being registered as a player.');
			}
			break;
		case 'defense': // number in array = 4
			if (msg.member.id === player1.id && player1.choseAction === false && player2.choseAction === true) {
				if (player2.action === 'attack') {
					player1.choseAction = true;
					player1.action = 'defense';
					actionAmount = actionAmount + 1;
					actionphase(player1, player2);
				}
				else {
					msg.channel.send(player2.username + ' did not choose a defendable action. Choose another action to take this turn.');
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false && player1.choseAction === true) {
				if (player1.action === 'attack') {
					player2.choseAction = true;
					player2.action = 'defense';
					actionAmount = actionAmount + 1;
					actionphase(player1, player2);
				}
				else {
					msg.channel.send(player1.username + ' did not choose a defendable action. Choose another action to take this turn.');
				}
			}
			else {
				msg.channel.send('You can\'t choose to defend if your opponent has not chosent an action yet.');
			}
			break;
		case 'magic': // number in array = 5
			if (msg.member.id === player1.id && player1.choseAction === false) {
				if (player1.char.mag === 0) {
					msg.channel.send(player1.char.name + ' can\'t cast magic. Please chose another action.');
				}
				else if (player1.char.magcd === 0) {
					player1.choseAction = true;
					player1.action = 'magic';
					actionAmount = actionAmount + 1;
					actionphase(player1, player2);
				}
				else {
					msg.reply(' can\'t use magic because it is still under cooldown.');
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				if (player2.char.mag === 0) {
					msg.channel.send(player2.char.name + ' can\'t cast magic. Please chose another action.');
				}
				if (player2.char.magcd === 0) {
					player2.choseAction = true;
					player2.action = 'magic';
					actionAmount = actionAmount + 1;
					actionphase(player1, player2);
				}
				else {
					msg.reply(' can\'t use magic because it is still under cooldown.');
				}
			}
			else {
				console.log(msg.author.username + ' tried to play while not being registered as a player.');
			}
			break;
		}
	}
});
