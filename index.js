/*
This is a discord bot written in javascript that let's you play a rpg-like game of versus-fighting
This is my first ever attempt at programmation and I learned on the fly
It particularly shows when you look at older part of the code
This could be easily done in way less lines and time it took me to do it and I know it
But nevertheless I'm rather proud of the level I was able to aquire in this short amount of time
*/
// importing librarie
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs'); // eslint-disable-line
const config = require('./config.json');
const token = require('./token.json');
client.login(token.token);

// Global variables
let channelID = config.channelID;
let actionAmount = 0;
let turn = 1;
let gamePhase = false;
let turnPhase = false;
let gameStarting = false;
let playerCount = 0;
let char_amount = 1;
let arp1 = 0;
// number of char in the array of player1
let arp2 = 0;
// same for player2
let p1CharDied = false;
let p2CharDied = false;
const dodgecdMax = 2;

/*
--------------------------------------
THIS ARE THE OBJECT FOR BOTH THE PLAYERS AND THE CHARACTERS
--------------------------------------
*/
const player1 = {
	id: 0,
	active: 0,
	futurChar: 0,
	lastAliveChar: 0,
	charAmount: char_amount,
	choseChar: false,
	choseAction: false,
	username: '',
	dmg: 0,
	char: [],
	action: '',
	defense_stack: 2,
	defense_multiplier: 2,
	message_damage: ' ',
	message_dodge: ' ',
	message_block: ' ',
};
const player2 = {
	id: 0,
	active: 0,
	futurChar: 0,
	lastAliveChar: 0,
	charAmount: char_amount,
	choseChar: false,
	choseAction: false,
	username: '',
	dmg: 0,
	char: [],
	action: '',
	defense_stack: 2,
	defense_multiplier: 2,
	message_damage: ' ',
	message_dodge: ' ',
	message_block: ' ',
};
const char = require('./characters.json');
/*
---------------------------------------------
---------------------------------------------
END OF THE OBJECTS FOR PLAYERS AND CHARACTERS
---------------------------------------------
---------------------------------------------
*/

// Defining bot activity
client.on('ready', () => {
	client.user.setActivity('Type !register to start a game.');
	console.log('Bot has been launched without issues!');
});

/*
---------------------------------------------------
---------------------------------------------------
BEGINING OF FUNCTIONS DEFINITION
---------------------------------------------------
---------------------------------------------------
*/

// functions for displaying characters gimmicks
const react_selection = selected_char => {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${selected_char.emoji} ${selected_char.react_selection1}`);
	}
	else {
		client.channels.get(channelID).send(`${selected_char.emoji} ${selected_char.react_selection2}`);
	}
};

const react_KO = p => {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO1}`);
	}
	else {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO2}`);
	}
};

const react_victory = p => {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
	}
	else {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
	}
};

// function for status display of how many characters each players still has
const eachPlayerCharList = (p1, p2) => {
	let i;
	const p1emote = [' ', ' ', ' ', ' ', ' '];
	for (i = 0; i < p1.char.length; i++) {
		p1emote[i] = p1.char[i].isAlive ? p1.char[i].emoji : p1.char[i].emoji_ko;
	}
	const p2emote = [' ', ' ', ' ', ' ', ' '];
	for (i = 0; i < p2.char.length; i++) {
		p2emote[i] = p2.char[i].isAlive ? p2.char[i].emoji : p2.char[i].emoji_ko;
	}
	client.channels.get(channelID).send({
		embed: {
			color: 16286691,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			fields: [{
				name: `__**${p1.username}'s list of characters :**__`,
				value: p1emote[0] + p1emote[1] + p1emote[2] + p1emote[3] + p1emote[4],
				inline: true,
			},
			{
				name: `__**${p2.username}'s list of characters :**__`,
				value: p2emote[0] + p2emote[1] + p2emote[2] + p2emote[3] + p2emote[4],
				inline: true,
			},
			],
			timestamp: new Date(),
		},
	});
};

// function for player.defense_stack
const IsDefenseStackReset = player => {
	if (player.defense_stack >= 2) {
		player.defense_multiplier = 2;
	}
	else {
		player.defense_multiplier -= (1 / 3);
		if (player.defense_multiplier <= 1) {
			player.defense_multiplier = 1;
		}
		console.log(player.defense_multiplier);
	}
};

// function for alive array char
const whoIsActive = pl => {
	let i;
	for (i = 0; i < pl.char.length; i++) {
		if (pl.char[i].isActive === true) {
			pl.active = i;
			console.log(`${pl.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is active.`);
			break;
		}
		else {
			console.log(`${pl.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is not fighting.`);
		}
	}
};

// function for eval
const clean = text => {
	if (typeof (text) === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	}
	else {
		return text;
	}
};

// function for passing from one turn to another
const addTurn = () => {
	turn += 1;
	NewTurnPhase();
};

// function for special abilities
const passive = (player_1, player_2) => {
	if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'pinky') {
		all_or_nothing(player_1.char[player_1.active]);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'ayddan') {
		crushing_strength(player_2.char[player_2.active]);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'gold') {
		black_poison(player_2.char[player_2.active]);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'dyakko') {
		care_taker(player_1);
	}
	else {
		console.log('No passive ability detected.');
	}
};

const active = (player_1, player_2) => {
	if (player_1.char[player_1.active].name.toLowerCase() === 'snipefox') {
		snipe(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase() === 'lyzan') {
		rage(player_1.char[player_1.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase() === 'pinky') {
		explosion(player_1.char[player_1.active], player_2, player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase() === 'may') {
		pill(player_1.char[player_1.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase() === 'kairen') {
		ressurection(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
	}
	else {
		console.log('I fucked up\nA character without active skill managed to activate the function for active selection');
	}
};

const remove_active_effect = player_1 => {
	if (player_1.char[player_1.active].name.toLowerCase() === 'lyzan') {
		player_1.char[player_1.active].atk = char[12].atk;
		player_1.char[player_1.active].def = char[12].def;
		player_1.char[player_1.active].rgn = char[12].rgn;
		client.channels.get(channelID).send({
			embed: {
				color: 16286691,
				fields: [{
					name: player_1.char[player_1.active].emote,
					value: '${player_1.char[player_1.active].name} lost the effects of rage.',
				}],
			},
		});
	}
	else if (player_1.char[player_1.active].name.toLowerCase() === 'may') {
		player_1.char[player_1.active].atk = char[15].atk;
		client.channels.get(channelID).send({
			embed: {
				color: 16286691,
				fields: [{
					name: player_1.char[player_1.active].emote,
					value: '${player_1.char[player_1.active].name} lost the effects of pill.',
				}],
			},
		});
	}
};

// passives for gold
const black_poison = target => {
	// black poison => -50% to enemy RGN
	if (target.receivedPassiveFromGold === false) {
		if (target.receivedPassiveFromAyddan === true) {
			target.def += (target.def * (25 / 100));
			target.receivedPassiveFromAyddan = false;
		}
		target.rgn -= (target.rgn * (50 / 100));
		console.log('Black poison is in action.');
		target.receivedPassiveFromGold = true;
	}
	else {
		console.log('Cant activate passive since it has already proced.');
	}
};

// passive for ayddan
const crushing_strength = target => {
	// crushing_strength => -25% to enemy DEF
	if (target.receivedPassiveFromAyddan == false) {
		if (target.receivedPassiveFromGold === true) {
			target.rgn += (target.rgn * (50 / 100));
			target.receivedPassiveFromGold = false;
		}
		target.def -= (target.def * (25 / 100));
		console.log('Crushing strength is in action.');
		target.receivedPassiveFromAyddan = true;
	}
	else {
		console.log('Cant activate passive since it has already proced.');
	}
};

// active for snipefox
const snipe = (player_1, target, player) => {
	// snipe => activate the CD of the opponent MAG (CD:5)
	console.log('snipe working');
	target.magcd = target.magcdmax;
	player_1.skill_cd = player_1.skill_cd_max;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} triggered ${target.name}'s magic cooldown!\`\`\``;
};

// active for lyzan
const rage = (player_1, player) => {
	// rage => ATK*5, DEF*2, RGN*3 for 2 turn (CD:10)
	console.log('rage working');
	player_1.atk *= 5;
	player_1.def *= 2;
	player_1.rgn *= 3;
	player_1.skill_cd = player_1.skill_cd_max;
	player_1.skill_timer = 3;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} entered rage mod ! His attack, defense and regeneration is buffed for 2 turns.\`\`\``;
};

// active for pinky
const explosion = (player_1, target, player) => {
	// explosion => MAG*2; cost 300HP
	console.log('explosion working');
	player_1.hp -= 300;
	player.dmg = player_1.mag * 2;
	target.hp -= player.dmg;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} dealt double his magic power of damage at the cost of 300 HP !\`\`\``;
};

// passive for pinky
const all_or_nothing = (char1) => {
	// all or nothing => Atk*3 if hp < 30%
	if (char1.receivedPassive === false) {
		if (char1.hp < (char1.hpmax * (30 / 100))) {
			char1.atk *= 3;
		}
	}
	else {
		console.log('Cant activate passive since it has already proced.');
	}
};

// active for may
const pill = (player_1, player) => {
	console.log('pill working');
	// pill => ATK*3 for 3 turn (CD:6)
	player_1.atk *= 3;
	player_1.skill_cd = player_1.skill_cd_max;
	player_1.skill_timer = 4;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} buffed her strength for 3 turns !\`\`\``;
};

// passive for dyakko
const care_taker = player => {
	// care taker => heal 10% of HP to every character in his team every turn while the character is alive and fighting
	let i;
	for (i = 0; i < player.char.length; i++) {
		player.char[i].hp *= (1 + (10 / 100));
		console.log(`Dyakko regenerated 10% of the maximum HP of ${player.char[i].name}`);
	}
	client.channels.get(channelID).send('Dyakko regenerated 10% of the maximum HP of all their team.');
};

// active for kairen
const ressurection = (player_1, target, player) => {
	// ressurection => heal a character to 100% HP (even if he is ko'ed) (CD:15)
	console.log('ressurection working');
	target.hp = target.hpmax;
	target.isAlive = true;
	player_1.skill_cd = player_1.skill_cd_max;
	player.message_damage = `\`\`\`diff\n+ ${player.char[player.active].name} ressurected ${target.name} !\`\`\``;
};

// function for status display
const status = () => {
	client.channels.get(channelID).send({
		embed: {
			color: 16286691,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			fields: [{
				name: `${player1.char[player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${player2.char[player2.active].emoji}`,
				value: `${player2.message_block} ${player1.message_damage} ${player2.message_dodge}`,
			},
			{
				name: `${player2.char[player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${player1.char[player1.active].emoji}`,
				value: `${player1.message_block} ${player2.message_damage} ${player1.message_dodge}`,
			},
			{
				name: '**REGENERATION**',
				value: `\`\`\`Diff\n+ ${player1.char[player1.active].name} has regenerated ${player1.char[player1.active].rgn} HP.\n+ ${player2.char[player2.active].name} has regenerated ${player2.char[player2.active].rgn} HP.\`\`\``,
			},
			{
				name: `${player1.char[player1.active].emoji} **STATUS**`,
				value: `\`\`\`ini\n[${player1.char[player1.active].name} has ${player1.char[player1.active].hp}/${player1.char[player1.active].hpmax} HP left!]\n[${player1.char[player1.active].name} Mag CD : ${player1.char[player1.active].magcd}/${player1.char[player1.active].magcdmax}]\`\`\``,
			},
			{
				name: `${player2.char[player2.active].emoji} **STATUS**`,
				value: `\`\`\`ini\n[${player2.char[player2.active].name} has ${player2.char[player2.active].hp}/${player2.char[player2.active].hpmax} HP left!]\n[${player2.char[player2.active].name} Mag CD : ${player2.char[player2.active].magcd}/${player2.char[player2.active].magcdmax}]\`\`\``,
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: 'Beginning new turn...',
			},
		},
	});
};

// function for status display when a character dies
const statusEnd = () => {
	client.channels.get(channelID).send({
		embed: {
			color: 16286691,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			fields: [{
				name: `${player1.char[player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${player2.char[player2.active].emoji}`,
				value: `${player2.message_block} ${player1.message_damage} ${player2.message_dodge}`,
			},
			{
				name: `${player2.char[player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${player1.char[player1.active].emoji}`,
				value: `${player1.message_block} ${player2.message_damage} ${player1.message_dodge}`,
			},
			{
				name: `${player1.char[player1.active].emoji} **STATUS**`,
				value: `\`\`\`ini\n[${player1.char[player1.active].name} has ${player1.char[player1.active].hp}/${player1.char[player1.active].hpmax} HP left!]\`\`\``,
			},
			{
				name: `${player2.char[player2.active].emoji} **STATUS**`,
				value: `\`\`\`ini\n[${player2.char[player2.active].name} has ${player2.char[player2.active].hp}/${player2.char[player2.active].hpmax} HP left!]\`\`\``,
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: 'Game has been reset.',
			},
		},
	});
};

// functions for turn actions
const changechar = (player, char2) => {
	const char1 = player.char[player.lastAliveChar];
	console.log(`${player.username} switched ${char1.name} with ${char2.name}`);
	player.message_damage = `${player.username} switched ${char1.name} with ${char2.name}`;
};

// function for when a characters dies during a turn
const omgHeDead = player => {
	react_KO(player);
	client.channels.get(channelID).send({
		embed: {
			color: 16286691,
			fields: [{
				name: `**${player.char[player.lastAliveChar].emoji} ${player.char[player.lastAliveChar].name}, got K.O.'ed.**`,
				value: `Sending ${player.char[player.futurChar].name} ${player.char[player.futurChar].emoji}`,
			},
			],
			timestamp: new Date(),
		},
	});
	player.active = player.futurChar;
};

// function to round numbers to 2 decimals
const round = value => {
	return Number(Math.round(value + 'e2') + 'e-2');
};

const attack = (player, otherplayer, char1, char2) => {
	if (otherplayer.action !== 'defense') {
		if (char1.crit_chance > Math.floor(Math.random() * 100)) {
			player.dmg = (char1.atk * (1 - (char2.def / 100))) * char1.crit_multi;
			if (player.dmg < 0) {
				player.dmg = 0;
			}
			console.log(player.dmg);
			player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
		}
		else {
			player.dmg = char1.atk * (1 - (char2.def / 100));
			if (player.dmg < 0) {
				player.dmg = 0;
			}
			console.log(player.dmg);
			player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
		}
		dodge(player, otherplayer, char2, char1);
		char2.hp -= Math.floor(player.dmg);
	}
	else {
		defense(player, otherplayer, char1, char2);
		player.message_block = (`${char2.name} multiplicated their defense for this turn by ${round(otherplayer.defense_multiplier)} and only took ${Math.floor(player.dmg)} damage.`);
		if (player.dmg < 0) {
			player.dmg = 0;
		}
		char2.hp -= Math.floor(player.dmg);
	}
};

const dodge = (player, otherplayer, char_1, char_2) => {
	if (player.action === 'attack') {
		if (char_1.dodgecd === 0) {
			let dodgeValue = 0;
			dodgeValue = (char_1.agi - char_2.acr) + 1;
			const diceroll = Math.floor(Math.random() * 10);
			if (diceroll <= 9) {
				if (dodgeValue >= diceroll) {
					player.dmg = 0;
					char_1.dodgecd = dodgecdMax;
					player.message_damage = ' ';
					otherplayer.message_dodge = (`**${char_1.name} dodged ${char_2.name}'s attack.**`);
				}
				else {
					console.log(`${char_1.name} tried to dodge ${char_2.name}'s attack but failed.`);
				}
			}
			else if (diceroll === 10) {
				player.dmg = 0;
				char_1.dodgecd = dodgecdMax;
				player.message_damage = ' ';
				otherplayer.message_dodge = (`${char_1.name} dodged ${char_2.name}'s attack.`);
			}
		}
		else {
			console.log(`${char_1.name} tried to dodge but couldn't because it is still under cooldown.`);
		}
	}
	else if (player.action === 'magic') {
		if (char_1.mag_dodgevalue > Math.floor(Math.random() * 100)) {
			player.dmg = 0;
			player.message_damage = ' ';
			otherplayer.message_dodge = (`${char_1.name} dodged ${char_2.name}'s magic.`);
		}
		else {
			console.log(`${char_1.name} tried to dodge ${char_2.name}'s magic but failed.`);
		}
	}
};

const defense = (player, otherplayer, char1, char2) => {
	if (char1.crit_chance > Math.floor(Math.random() * 100)) {
		player.dmg = (char1.atk * (1 - ((char2.def * otherplayer.defense_multiplier) / 100))) * char1.crit_multi;
		console.log(player.dmg);
		if (player.dmg < 0) {
			player.dmg = 0;
		}
		player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
	}
	else {
		player.dmg = char1.atk * (1 - ((char2.def * otherplayer.defense_multiplier) / 100));
		console.log(player.dmg);
		if (player.dmg < 0) {
			player.dmg = 0;
		}
		player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
	}
	otherplayer.defense_stack = 0;
};

const magic = (player, otherplayer, char1, char2) => {
	if (char1.magcd === 0) {
		if (char2.tier === 'H') {
			if (char1.mag_crit_chance > Math.floor(Math.random() * 100)) {
				player.dmg = ((char1.mag * (1 - (char2.magdef / 100))) * char1.mag_crit_multi) * 5;
				player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
				dodge(player, otherplayer, char2, char1);
				char2.hp -= Math.floor(player.dmg);
				console.log(player.dmg);
				player.char[player.active].magcd = player.char[player.active].magcdmax;
			}
			else {
				player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * 5;
				player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
				dodge(player, otherplayer, char2, char1);
				char2.hp -= Math.floor(player.dmg);
				console.log(player.dmg);
				player.char[player.active].magcd = player.char[player.active].magcdmax;
			}
		}
		else if (char2.tier !== 'H') {
			if (char1.mag_crit_chance > Math.floor(Math.random() * 100)) {
				player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * char1.mag_crit_multi;
				player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
				dodge(player, otherplayer, char2, char1);
				char2.hp -= Math.floor(player.dmg);
				console.log(player.dmg);
				player.char[player.active].magcd = player.char[player.active].magcdmax;
			}
			else {
				player.dmg = char1.mag * (1 - (char2.magdef / 100));
				player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
				dodge(player, otherplayer, char2, char1);
				char2.hp -= Math.floor(player.dmg);
				console.log(player.dmg);
				player.char[player.active].magcd = player.char[player.active].magcdmax;
			}
		}
	}
	else {
		client.channels.get(channelID).send(`${char1.name} got his cd activated and can't use magic.`);
	}
};

const gameEnd = (winner, looser) => {
	react_KO(looser);
	react_victory(winner);
	client.channels.get(channelID).send(`**\`\`\`fix\nCongratulation to ${winner.username} !\nGAME IS OVER ! \`\`\`**`);
	gamePhase = false;
	turnPhase = false;
	playerCount = 0;
	char_amount = 1;
	actionAmount = 0;
	p1CharDied = false;
	p2CharDied = false;
	arp1 = 0;
	arp2 = 0;
	player1.charAmount = 1;
	player2.charAmount = 1;
	player1.message_block = ' ';
	player2.message_block = ' ';
	player1.message_damage = ' ';
	player2.message_damage = ' ';
	player1.message_dodge = ' ';
	player2.message_dodge = ' ';
	player1.choseChar = false;
	player2.choseChar = false;
	player1.choseAction = false;
	player2.choseAction = false;
	player1.char = [];
	player2.char = [];
	player1.id = 0;
	player2.id = 0;
	player1.username = '';
	player2.username = '';
	player1.dmg = 0;
	player2.dmg = 0;
	player1.action = '';
	player2.action = '';
	turn = 1;
};

// function for gameend
const IsGameOver = (player, otherplayer, char1) => {
	if (char1.hp <= 0) {
		char1.hp = 0;
		char1.isAlive = false;
		if (otherplayer.id === player1.id) {
			p1CharDied = true;
		}
		else if (otherplayer.id === player2.id) {
			p2CharDied = true;
		}
		else {
			console.log('An unregistered character had one of his characters dying, good luck with fixing that shit');
		}
		let i;
		for (i = 0; i <= otherplayer.charAmount; i++) {
			if (otherplayer.char[i].hp > 0 && otherplayer.char[i].isAlive === true) {
				console.log(`${otherplayer.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is alive, selecting it to be the next char.`);
				console.log('Now we don\'t care even if another char is dead because if one is alive then the game can continue.');
				otherplayer.lastAliveChar = otherplayer.char.indexOf(char1);
				otherplayer.futurChar = i;
				break;
			}
			else if (otherplayer.char[i].hp <= 0) {
				if (i === (otherplayer.charAmount - 1)) {
					console.log('No characters are alive anymore so we end the game.');
					statusEnd();
					gameEnd(player, otherplayer);
					break;
				}
				else {
					console.log(`${otherplayer.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is K.O. but hey, at least the loop is not over amiright?`);
				}
			}
		}
	}
	else {
		console.log(`${char1.name} is still alive.`);
	}
};

// function for cd reset
const reset_cd = pl => {
	let i;
	for (i = 0; i < pl.char.length; i++) {
		pl.char[i].skill_cd = 0;
		pl.char[i].magcd = 0;
		pl.char[i].dodgecd = 0;
	}
};

// function for cd iteration
const cd_iteration = pl => {
	let i;
	for (i = 0; i < pl.char.length; i++) {
		if (pl.char[i].magcd > 0 && pl.char[i].magcdmax >= pl.char[i].magcd) {
			pl.char[i].magcd -= 1;
		}
		if (pl.char[i].dodgecd > 0 && dodgecdMax >= pl.char[i].dodgecd) {
			pl.char[i].dodgecd -= 1;
		}
		if (pl.char[i].skill_cd > 0 && pl.char[i].skill_cd_max >= pl.char[i].skill_cd) {
			pl.char[i].skill_cd -= 1;
		}
		if (pl.char[i].skill_timer >= 0) {
			pl.char[i].skill_timer -= 1;
			if (pl.char[i].skill_timer < 0) {
				pl.char[i].skill_timer = 0;
			}
			if (pl.char[i].skill_timer === 0 && pl.char[i].has_active_skill === true) {
				remove_active_effect(pl);
			}
		}
	}
};

// function for action phase
const actionphase = (firstplayer, secondplayer) => {
	if (actionAmount === 2) {
		whoIsActive(player1);
		whoIsActive(player2);
		if (firstplayer.char[firstplayer.active].spd > secondplayer.char[secondplayer.active].spd) {
			// player1.char is faster than player2.char so it's attack is done before
			if (firstplayer.action === 'changechar') {
				changechar(player1, player1.char[player1.active], player1.char[player1.active]);
			}
			if (firstplayer.action === 'attack') {
				attack(player1, player2, player1.char[player1.active], player2.char[player2.active]);
				IsGameOver(player1, player2, player2.char[player2.active]);
			}
			if (firstplayer.action === 'magic') {
				magic(player1, player2, player1.char[player1.active], player2.char[player2.active]);
				IsGameOver(player1, player2, player2.char[player2.active]);
			}
			if (firstplayer.action === 'skill') {
				active(player1, player2);
			}
			if (secondplayer.action === 'changechar') {
				changechar(player2, player2.char[player2.active], player2.char[player2.active]);
			}
			if (secondplayer.action === 'attack') {
				attack(player2, player1, player2.char[player2.active], player1.char[player1.active]);
				IsGameOver(player2, player1, player1.char[player1.active]);
			}
			if (secondplayer.action === 'magic') {
				magic(player2, player1, player2.char[player2.active], player1.char[player1.active]);
				IsGameOver(player2, player1, player1.char[player1.active]);
			}
			if (secondplayer.action === 'skill') {
				active(player2, player1);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			actionAmount = 0;
			addTurn();
		}
		else if (firstplayer.char[firstplayer.active].spd < secondplayer.char[secondplayer.active].spd) {
			if (secondplayer.action === 'changechar') {
				changechar(player2, player2.char[player2.active], player1.char[player1.active]);
			}
			if (secondplayer.action === 'attack') {
				attack(player2, player1, player2.char[player2.active], player1.char[player1.active]);
				IsGameOver(player2, player1, player1.char[player1.active]);
			}
			if (secondplayer.action === 'magic') {
				magic(player2, player1, player2.char[player2.active], player1.char[player1.active]);
				IsGameOver(player2, player1, player1.char[player1.active]);
			}
			if (secondplayer.action === 'skill') {
				active(player2, player1);
			}
			if (firstplayer.action === 'changechar') {
				changechar(player1, player1.char[player1.active], player1.char[player1.active]);
			}
			if (firstplayer.action === 'attack') {
				attack(player1, player2, player1.char[player1.active], player2.char[player2.active]);
				IsGameOver(player1, player2, player2.char[player2.active]);
			}
			if (firstplayer.action === 'magic') {
				magic(player1, player2, player1.char[player1.active], player2.char[player2.active]);
				IsGameOver(player1, player2, player2.char[player2.active]);
			}
			if (firstplayer.action === 'skill') {
				active(player1, player2);
			}
			player1.choseAction = false;
			player2.choseAction = false;
			turnPhase = false;
			actionAmount = 0;
			addTurn();
		}
		else if (firstplayer.char[firstplayer.active].spd === secondplayer.char[secondplayer.active].spd) {
			if (Math.floor(Math.random() * 2) >= 1) {
				console.log('succesfully reached speed detection');
				if (firstplayer.action === 'changechar') {
					changechar(player1, player1.char[player1.active], player1.char[player1.active]);
				}
				if (firstplayer.action === 'attack') {
					attack(player1, player2, player1.char[player1.active], player2.char[player2.active]);
					IsGameOver(player1, player2, player2.char[player2.active]);
				}
				if (firstplayer.action === 'magic') {
					magic(player1, player2, player1.char[player1.active], player2.char[player2.active]);
					IsGameOver(player1, player2, player2.char[player2.active]);
				}
				if (firstplayer.action === 'skill') {
					active(player1, player2);
				}
				if (secondplayer.action === 'changechar') {
					changechar(player2, player2.char[player2.active], player1.char[player1.active]);
				}
				if (secondplayer.action === 'attack') {
					attack(player2, player1, player2.char[player2.active], player1.char[player1.active]);
					IsGameOver(player2, player1, player1.char[player1.active]);
				}
				if (secondplayer.action === 'magic') {
					magic(player2, player1, player2.char[player2.active], player1.char[player1.active]);
					IsGameOver(player2, player1, player1.char[player1.active]);
				}
				if (secondplayer.action === 'skill') {
					active(player2, player1);
				}
				player1.choseAction = false;
				player2.choseAction = false;
				turnPhase = false;
				actionAmount = 0;
				addTurn();
			}
			else {
				if (secondplayer.action === 'changechar') {
					changechar(player2, player2.char[player2.active], player1.char[player1.active]);
				}
				if (secondplayer.action === 'attack') {
					attack(player2, player1, player2.char[player2.active], player1.char[player1.active]);
					IsGameOver(player2, player1, player1.char[player1.active]);
				}
				if (secondplayer.action === 'magic') {
					magic(player2, player1, player2.char[player2.active], player1.char[player1.active]);
					IsGameOver(player2, player1, player1.char[player1.active]);
				}
				if (secondplayer.action === 'skill') {
					active(player2, player1);
				}
				if (firstplayer.action === 'changechar') {
					changechar(player1, player1.char[player1.active], player1.char[player1.active]);
				}
				if (firstplayer.action === 'attack') {
					attack(player1, player2, player1.char[player1.active], player2.char[player2.active]);
					IsGameOver(player1, player2, player2.char[player2.active]);
				}
				if (firstplayer.action === 'magic') {
					magic(player1, player2, player1.char[player1.active], player2.char[player2.active]);
					IsGameOver(player1, player2, player2.char[player2.active]);
				}
				if (firstplayer.action === 'skill') {
					active(player1, player2);
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
		console.log('If I see this then I fucked up.');
	}
};

// function for regen
const regen = pl => {
	if (pl.char[pl.active].hp < pl.char[pl.active].hpmax) {
		pl.char[pl.active].hp += pl.char[pl.active].rgn;
		if (pl.char[pl.active].hp > pl.char[pl.active].hpmax) {
			pl.char[pl.active].hp = pl.char[pl.active].hpmax;
		}
	}
};

// function for resetting turn phase
const NewTurnPhase = () => {
	// allowing combat regen and preventing it from going past max hp and deducing cd
	if (gamePhase === true && turnPhase === false) {
		eachPlayerCharList(player1, player2);
		if (p1CharDied) {
			omgHeDead(player1);
			p1CharDied = false;
		}
		if (p2CharDied) {
			omgHeDead(player2);
			p2CharDied = false;
		}
		regen(player1);
		regen(player2);
		cd_iteration(player1);
		cd_iteration(player2);
		passive(player1, player2);
		passive(player2, player1);
		status();
		player1.dmg = 0;
		player2.dmg = 0;
		player1.message_block = ' ';
		player2.message_block = ' ';
		player1.message_damage = ' ';
		player2.message_damage = ' ';
		player1.message_dodge = ' ';
		player2.message_dodge = ' ';
		player1.defense_stack += 1;
		player2.defense_stack += 1;
		IsDefenseStackReset(player1);
		IsDefenseStackReset(player2);
		client.channels.get(channelID).send(`\`\`\`diff\nTurn ${turn} has started. Chose your character's action.\`\`\``);
		turnPhase = true;
		client.channels.get(channelID).send({
			embed: {
				color: 16286691,
				author: {
					name: player1.char[player1.active].name,
					icon_url: player1.char[player1.active].ico,
				},
				thumbnail: {
					url: player1.char[player1.active].ico,
				},
				fields: [{
					name: 'What should I do ?',
					value: '*Choose by reacting to this message with the appropriate action*',
				}],
				timestamp: new Date(),
			},
		})
			.then(async (p1Selector) => {
				await p1Selector.react('603772499431260196'),
				await p1Selector.react('603768004010049541'),
				await p1Selector.react('603769186463907845'),
				await p1Selector.react('603770838709305371'),
				await p1Selector.react('603767542846193712');
			})
			.catch(console.error);
		client.channels.get(channelID).send({
			embed: {
				color: 16286691,
				author: {
					name: player2.char[player2.active].name,
					icon_url: player2.char[player2.active].ico,
				},
				thumbnail: {
					url: player2.char[player2.active].ico,
				},
				fields: [{
					name: 'What should I do ?',
					value: '*Choose by reacting to this message with the appropriate action*',
				}],
				timestamp: new Date(),
			},
		})
			.then(async (p2Selector) => {
				await p2Selector.react('603772499431260196'),
				await p2Selector.react('603768004010049541'),
				await p2Selector.react('603769186463907845'),
				await p2Selector.react('603770838709305371'),
				await p2Selector.react('603767542846193712');
			})
			.catch(console.error);
	}
};

// function for char_amount
const charAmount = amount => {
	char_amount = amount;
	player1.charAmount = amount;
	player2.charAmount = amount;
	client.channels.get(channelID).send(`Please choose ${amount} characters each.\nChoose your characters by typing "!*character_name*".\nYou can type !list to see the list of characters.`);
	gameStarting = true;
};

/*
--------------------------------------------
END OF FUNCTIONS DEFINITION
--------------------------------------------
*/

/*
--------------------------------------------
--------------------------------------------
BEGINING OF MESSAGE EVENT HANDLER
--------------------------------------------
--------------------------------------------
*/

// commands
client.on('message', msg => {
	if (msg.author.bot) return;
	// won't react to bots
	if (msg.content.indexOf(config.prefix) !== 0) return;
	// return if '!' is not the first letter
	// destructuring
	const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	// Admin commands
	if (command === 'eval') {
		if (msg.member.id === config.ownerID) {
			// eval command
			try {
				const code = args.join(' ');
				let evaled = eval(code);
				if (typeof evaled !== 'string') {
					evaled = require('util').inspect(evaled);
					msg.channel.send(clean(evaled), { code: 'xl' });
				}
			}
			catch (err) {
				msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			}
		}
		else {
			msg.channel.send('You don\'t have enough permission and shouldn\'t even be aware of the existence of this command you filthy bastard.');
		}
	}
	if (command === 'ad') {
		if (msg.member.id === config.ownerID || config.adminID) {
		// leave a specific guild
			if (args[0] === 'help') {
				msg.channel.send({
					embed: {
						color: 16286691,
						description: '__**List of all admin commands**__',
						fields: [{
							name: '**Leave guild**',
							value: '```!ad gleave [Guild ID] => Makes the bot leave a guild specified by it\'s ID```',
						},
						{
							name: '**Clear**',
							value: '```!ad clear [Number] => Makes the bot deletes his own messages among the specified last number of messages```',
						},
						{
							name: '**Channel edit**',
							value: '```!ad editchan [Channel ID] => Makes the bot change his default channel ID```',
						},
						{
							name: '**Character edit**',
							value: '```!ad editchar [name][stat][value][player] => Allows you to edit the stats of a character, type !ad editchar help for more information```',
						},
						{
							name: '**Debug start**',
							value: '```!ad start => Makes the bot start a game with default players and characters (set in config.json) !!!DEBUG ONLY!!!```',
						},
						{
							name: '**Game reset**',
							value: '```!ad reset => Makes the bot reset the current game```',
						}],
					},
				}
				);
			}
			/* else if (args[0] === 'saveChar') {
				fs.writeFile('characters.json', JSON.stringify(char, undefined, 2), (err) => {
					if (err) throw err;
					console.log('Characters has successfully been saved');
				});
			}*/
			else if (args[0] === 'gleave') {
				if (msg.guild.id == args[1]) {
				// this is just a bit of security measure to make sure the user knows what server he is going to leave
					msg.guild.leave()
						.then(g => console.log(`Left the guild ${g}`))
						.catch(console.error);
				}
				else {
					console.log('Guild ID didn\'t match with user inputed guild ID.');
				}
			}
			// clear bot's message on a channel
			else if (args[0] === 'clear') {
				const msglimit = args[1];
				if(msg.channel.type == 'text') {
					msg.channel.fetchMessages({ limit: msglimit }).then(messages => {
						const botMsg = messages.filter(author => author.author.bot);
						if (botMsg.array().length > 1) {
							msg.channel.bulkDelete(botMsg);
						}
						else if (botMsg.array().length) {
							botMsg[0].delete();
						}
						else {
							msg.delete();
							console.log('Nothing to delete');
						}
						const messagesDeleted = botMsg.array().length;

						// Logging amount of messages deleted
						console.log(`Deletion of messages successful. Amount of messages deleted : ${messagesDeleted}`);
					}).catch(err => {
						console.log('Error while deleting files', err);
					});
				}
			}
			// command to edit channel
			else if (args[0] === 'editchan') {
				if (args[1] !== channelID) {
					channelID = args[1];
					msg.channel.send(`Admin changed the default channel to ${args[1]}`);
				}
				else {
					msg.channel.send(`Default channel ID is already set to ${args[1]}`);
				}
			}
			// editing command for player.char
			else if (args[0] === 'editchar') {
				const p = args[4];
				if (args[1] === 'help') {
					msg.channel.send('Correct syntaxe is !editchar [name] [stat] [value] [player]');
				}
				else if (args.length > 3) {
					let a;
					for (a = 0; a < p.char.length; a++) {
						if (args[1] === p.char[a].name.toLowerCase().trim().replace(/\s+/g, '')) {
							console.log(`value found : ${p.char[a].name}`);
							const char_value = parseInt(args[3]);
							char[a][args[2]] = char_value;
							msg.channel.send(`Admin changed the value of ${p.char[a].name}'s ${args[2]} to ${args[3]}`);
							console.log(char[a]);
						}
					}
				}
				else {
					msg.channel.send('Syntaxe Error, type !ad editchar help for more information.');
				}
			}
			// autostart a game with two predetermined discord account e.g. see config.json
			else if (args[0] === 'start') {
				player1.id = config.testID1;
				player1.username = config.usernameID1;
				player2.id = config.testID2;
				player2.username = config.usernameID2;
				playerCount = 2;
				char_amount = 2;
				gameStarting = true;
				player1.charAmount = 2;
				player1.char.push(char[0]);
				player1.char.push(char[1]);
				player1.choseChar = true;
				player2.charAmount = 2;
				player2.char.push(char[0]);
				player2.char.push(char[1]);
				player2.choseChar = true;
				msg.channel.send('Fast started the game.');
			}
			// gameEnd function test command
			else if (args[0] === 'reset') {
				gameEnd(player1, player2);
				console.log(player1);
				console.log(player2);
			}
			else {
				msg.channel.send('It seems no command matches your input, please type "!ad help" to see the list of admin commands.');
			}
		}
		else {
			msg.channel.send('You lack permissions to use this command.');
		}
	}

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
				msg.reply('is registered as player 2!');
				msg.channel.send('Type !start to start the game!\nYou can add a number after !start to customize how many character each player can choose. The default number is`1`');
				playerCount = 2;
				player2.username = msg.author.username;
				player2.id = msg.member.id;
				console.log(player2.id);
			}
		}
		else {
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
			msg.reply(' you can\'t surrender since you are not a registered player');
		}
	}

	// starting the game
	if (command === 'start') {
		if (playerCount !== 2) {
			msg.channel.send('Not enough player registered yet. Please type !register.');
		}
		else if (args.length !== 0) {
			if (args[0] >= 5) {
				args[0] = 5;
			}
			charAmount(args[0]);
		}
		else {
			msg.channel.send('An error occured! Please try again.');
		}
	}

	// list command
	if (command === 'list') {
		msg.reply('https://imgur.com/mtzCunX');
	}

	// stat command
	if (command === 'stats') {
		msg.reply('https://i.imgur.com/lY5H53N.jpg');
	}

	// action command
	if (command === 'actions') {
		msg.reply('https://i.imgur.com/nuZbg4x.jpg');
	}
	// character selection
	if (gameStarting === true) {
		let i;
		for (i = 0; i < char.length; i++) {
			const name = char[i].name.toLowerCase().trim();
			if (command === name.replace(/\s+/g, '')) {
				if (msg.member.id == player1.id) {
					if (!player1.choseChar) {
						player1.char.push(char[i]);
						msg.reply(` chose ${char[i].name}`);
						react_selection(player1.char[arp1]);
						arp1 += 1;
						if (player1.char.length === player1.charAmount) {
							msg.channel.send(`${player1.username} chose all of their characters.`);
							player1.choseChar = true;
							arp1 = 0;
						}
					}
					else {
						msg.reply(' already has enough characters.');
					}
				}
				else if (msg.member.id == player2.id) {
					if (!player2.choseChar) {
						player2.char.push(char[i]);
						msg.reply(` chose ${char[i].name}`);
						react_selection(player2.char[arp2]);
						arp2 += 1;
						if (player2.char.length === player2.charAmount) {
							msg.channel.send(`${player2.username} chose all of their characters.`);
							player2.choseChar = true;
							arp2 = 0;
						}
					}
					else {
						msg.reply(' already has enough characters.');
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
	if (player1.choseChar === true && player2.choseChar === true && gameStarting === true) {
		gameStarting = false;
		gamePhase = true;
		turnPhase = true;
		turn = 1;
		reset_cd(player1);
		reset_cd(player2);
		passive(player1, player2);
		passive(player2, player1);
		player1.char[0].isActive = true;
		player2.char[0].isActive = true;
		msg.channel.send(`Turn ${turn} has started. Chose your character's action.`);
		msg.channel.send({
			embed: {
				color: 16286691,
				author: {
					name: player1.char[player1.active].name,
					icon_url: player1.char[player1.active].ico,
				},
				thumbnail: {
					url: player1.char[player1.active].ico,
				},
				fields: [{
					name: 'What should I do ?',
					value: '*Choose by reacting to this message with the appropriate action*',
				}],
				timestamp: new Date(),
			},
		})
			.then(async (p1Selector) => {
				await p1Selector.react('603772499431260196'),
				await p1Selector.react('603768004010049541'),
				await p1Selector.react('603769186463907845'),
				await p1Selector.react('603770838709305371'),
				await p1Selector.react('603767542846193712');
			})
			.catch(console.error);
		msg.channel.send({
			embed: {
				color: 16286691,
				author: {
					name: player2.char[player2.active].name,
					icon_url: player2.char[player2.active].ico,
				},
				thumbnail: {
					url: player2.char[player2.active].ico,
				},
				fields: [{
					name: 'What should I do ?',
					value: '*Choose by reacting to this message with the appropriate action*',
				}],
				timestamp: new Date(),
			},
		})
			.then(async (p2Selector) => {
				await p2Selector.react('603772499431260196'),
				await p2Selector.react('603768004010049541'),
				await p2Selector.react('603769186463907845'),
				await p2Selector.react('603770838709305371'),
				await p2Selector.react('603767542846193712');
			})
			.catch(console.error);
	}

	// turn phase of the combat phase
	if (gamePhase === true && turnPhase === true) {
		switch (command) {
		case 'switch':
			if (msg.member.id === player1.id && player1.choseAction === false) {
				const c = args[0];
				if (args.length < 1) {
					msg.channel.send('Syntaxe error. Please specify which character you would like to switch with your current character\n`example: \'!switch lyzan\'`');
				}
				else if (player1.char[player1.active].name === c) {
					msg.channel.send('You can\'t switch to this character since it is already in play');
				}
				else {
					let i;
					for (i = 0; i < player1.charAmount; i++) {
						if (player1.char[i].name.toLowerCase().trim().replace(/\s+/g, '') === c) {
							if (player1.char[i].isAlive === true) {
								msg.channel.send('The character you tried to switch to is K.O, please try another one of your characters or choose another action.');
								break;
							}
							else {
								player1.char[player1.active].isActive = false;
								player1.lastAliveChar = player1.alive;
								player1.char[i].isActive = true;
								player1.alive = i;
								player1.choseAction = true;
								player1.action = 'changechar';
								actionAmount += 1;
								if (actionAmount === 2) {
									actionphase(player1, player2);
								}
								else {
									console.log(`actionAmount : ${actionAmount}`);
									console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
								}
								break;
							}
						}
						else {
							console.log(`${player1.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} was not character specified by ${player1.username} the correct character is ${args[0]} continuing the search...`);
						}
					}
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				const c = args[0];
				if (args.length < 1) {
					msg.channel.send('Syntaxe error. Please specify which character you would like to switch with your current character\n`example: \'!switch lyzan\'`');
				}
				else if (player2.char[player2.active].name === c) {
					msg.channel.send('You can\'t switch to this character since it is already in play');
				}
				else {
					let i;
					for (i = 0; i < player2.charAmount; i++) {
						if (player2.char[i].name.toLowerCase().trim().replace(/\s+/g, '') === c) {
							if (player2.char[i].hp <= 0) {
								msg.channel.send('The character you tried to switch to is K.O, please try another one of your characters or choose another action.');
								break;
							}
							else {
								player2.char[player2.active].isActive = false;
								player2.lastAliveChar = player2.alive;
								player2.char[i].isActive = true;
								player2.alive = i;
								player2.choseAction = true;
								player2.action = 'changechar';
								actionAmount += 1;
								if (actionAmount === 2) {
									actionphase(player2, player2);
								}
								else {
									console.log(`actionAmount : ${actionAmount}`);
									console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
								}
								break;
							}
						}
						else {
							console.log(`${player2.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} was not the character specified by ${player2.username} the correct character is ${args[0]} continuing the search...`);
						}
					}
				}
			}
			else {
				msg.reply(' you have already choosen an action or are an unregistered player.');
			}
			break;
		case 'attack':
			if (msg.member.id === player1.id && player1.choseAction === false) {
				player1.choseAction = true;
				player1.action = 'attack';
				actionAmount += 1;
				if (actionAmount === 2) {
					actionphase(player1, player2);
				}
				else {
					console.log(`actionAmount : ${actionAmount}`);
					console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				player2.choseAction = true;
				player2.action = 'attack';
				actionAmount += 1;
				if (actionAmount === 2) {
					actionphase(player1, player2);
				}
				else {
					console.log(`actionAmount : ${actionAmount}`);
					console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
				}
			}
			else {
				console.log(`${msg.author.username} tried to play while not being registered as a player.`);
			}
			break;
		case 'defense':
			if (msg.member.id === player1.id && player1.choseAction === false && player2.choseAction === true) {
				if (player2.action === 'attack') {
					player1.choseAction = true;
					player1.action = 'defense';
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
					}
				}
				else {
					msg.channel.send(`${player2.username} did not choose a defendable action. Choose another action to take this turn.`);
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false && player1.choseAction === true) {
				if (player1.action === 'attack') {
					player2.choseAction = true;
					player2.action = 'defense';
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
					}
				}
				else {
					msg.channel.send(`${player1.username} did not choose a defendable action. Choose another action to take this turn.`);
				}
			}
			else {
				msg.channel.send('You can\'t choose to defend if your opponent has not chosent an action yet.');
			}
			break;
		case 'magic':
			if (msg.member.id === player1.id && player1.choseAction === false) {
				if (player1.char[player1.active].mag === 0) {
					msg.channel.send(`${player1.char[player1.active].name} can't cast magic. Please chose another action.`);
				}
				else if (player1.char[player1.active].magcd === 0) {
					player1.choseAction = true;
					player1.action = 'magic';
					msg.reply(`${player1.username} chose to use magic this turn.`);
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then I\'m done');
					}
				}
				else {
					msg.reply(' can\'t use magic because it is still under cooldown.');
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				if (player2.char[player2.active].mag === 0) {
					msg.channel.send(`${player2.char[player2.active].name} can't cast magic. Please chose another action.`);
				}
				else if (player2.char[player2.active].magcd === 0) {
					player2.choseAction = true;
					player2.action = 'magic';
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
					}
				}
				else {
					msg.reply(' can\'t use magic because it is still under cooldown.');
				}
			}
			else {
				console.log(`${msg.author.username} tried to play while not being registered as a player.`);
			}
			break;
		case 'skill':
			if (msg.member.id === player1.id && player1.choseAction === false) {
				if (player1.char[player1.active].has_active_skill === true) {
					player1.choseAction = true;
					player1.action = 'skill';
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
					}
				}
				else {
					msg.channel.send('Your character doesn\'t have a special skill. Choose another action.');
				}
			}
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				if (player2.char[player2.active].has_active_skill === true) {
					player2.choseAction = true;
					player2.action = 'skill';
					actionAmount += 1;
					if (actionAmount === 2) {
						actionphase(player1, player2);
					}
					else {
						console.log(`actionAmount : ${actionAmount}`);
						console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
					}
				}
				else {
					msg.channel.send('Your character doesn\'t have a special skill. Choose another action.');
				}
			}
			else {
				console.log(`${msg.author.username} tried to play while not being registered as a player.`);
			}
			break;
		}
	}
});
