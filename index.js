// importing librarie
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const token = require('./token.json');
client.login(token.token);

// Global variables
let testmod = false;
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
const char = [{
	tier: 'undefined',
	// template with max stat for debugging purposes
	name: 'test1',
	// name of the character
	hpmax: 9999,
	// vitality, when it falls to 0 the character is unusable
	hp: 9999,
	// hp stat for damage calculation
	atk: 200,
	// maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	crit_multi: 2,
	// multiplier of damage in case of Critical Hit
	crit_chance: 100,
	// chance for a physical attack to infllict Critical Hit
	def: 90,
	// damage points reduced from the attack function of the opponent
	spd: 6,
	// the character with the highest SPD will have his action executed first
	agi: 5,
	// determine how good the character is at dodging
	acr: 5,
	// will be deduced from your opponent agi stat if he does the dodge function
	int: 9999,
	// determines who wins a trap function
	mag: 1000,
	// used to determinate the damage of a magic attack, unaffected by defense
	magcd: 1,
	// number of turn to wait before using magic again
	magdef: 50,
	// defense stat for mag used by certain passive abilities
	mag_crit_chance: 100,
	// crit chance for mag used by certain passive abilities
	mag_crit_multi: 1.5,
	// crit multi for mag used by certain passive abilities
	mag_dodgevalue: 50,
	// chance to dodge mag used by certain passive abilities
	magcdmax: 1,
	// max cd stat for action calculation
	dodgecd: 2,
	// number of turn to wait before using dodge again
	rgn: 9999,
	// amount of hp the character regenerate at the end of each turn
	react_selection1: 'undefined',
	// sentence to display on selecting the character to show character's personality
	react_selection2: 'undefined',
	react_KO1: 'undefined',
	// sentence to display on character's KO
	react_KO2: 'undefined',
	react_victory1: 'undefined',
	// sentence to display on character's victory
	react_victory2: 'undefined',
	emoji: config.emote_undefined,
	emoji_ko: config.emote_undefined_ko,
	ico: config.ico_undefined,
	// emoji for the various characters reaction (discord emoji code found in config.json)
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'undefined',
	// template with max stat for debugging purposes
	name: 'test2',
	// name of the character
	hpmax: 9999,
	// vitality, when it falls to 0 the character is unusable
	hp: 9999,
	// hp stat for damage calculation
	atk: 200,
	// maximum potentiel damage points for the attack function, the defense from the opponent will be deduced from it
	crit_multi: 1,
	// multiplier of damage in case of Critical Hit
	crit_chance: 0,
	// chance for a physical attack to infllict Critical Hit
	def: 90,
	// damage points reduced from the attack function of the opponent
	spd: 5,
	// the character with the highest SPD will have his action executed first
	agi: 5,
	// determine how good the character is at dodging
	acr: 5,
	// will be deduced from your opponent agi stat if he does the dodge function
	int: 9999,
	// determines who wins a trap function
	mag: 1000,
	// used to determinate the damage of a magic attack, unaffected by defense
	magcd: 1,
	// number of turn to wait before using magic again
	magdef: 0,
	// defense stat for mag used by certain passive abilities
	mag_crit_chance: 0,
	// crit chance for mag used by certain passive abilities
	mag_crit_multi: 1,
	// crit multi for mag used by certain passive abilities
	mag_dodgevalue: 0,
	// chance to dodge mag used by certain passive abilities
	magcdmax: 1,
	// max cd stat for action calculation
	dodgecd: 2,
	// number of turn to wait before using dodge again
	rgn: 9999,
	// amount of hp the character regenerate at the end of each turn
	react_selection1: 'undefined',
	// sentence to display on selecting the character to show character's personality
	react_selection2: 'undefined',
	react_KO1: 'undefined',
	// sentence to display on character's KO
	react_KO2: 'undefined',
	react_victory1: 'undefined',
	// sentence to display on character's victory
	react_victory2: 'undefined',
	emoji: config.emote_undefined,
	emoji_ko: config.emote_undefined_ko,
	ico: config.ico_undefined,
	// emoji for the various characters reaction (discord emoji code found in config.json)
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'S',
	name: 'Seize',
	hpmax: 3600,
	hp: 3600,
	atk: 610,
	def: 35,
	crit_multi: 1.9,
	crit_chance: 20,
	spd: 9,
	agi: 12,
	acr: 7,
	int: 179,
	mag: 1600,
	magcd: 4,
	magdef: 0,
	mag_crit_chance: 10,
	mag_crit_multi: 1.9,
	mag_dodgevalue: 30,
	magcdmax: 4,
	dodgecd: 2,
	rgn: 110,
	react_selection1: 'Ready to play with any of you <3',
	react_selection2: 'Please don\'t be too boring...',
	react_KO1: 'Okay that\'s just too boring, I\'m leaving.',
	react_KO2: 'Aaaaaaah ! So fucking boring.',
	react_victory1: 'A rather expected outcome, duh.',
	react_victory2: 'YOU DON\'T SAY ?',
	emoji: config.emote_seize,
	emoji_ko: config.emote_seize_ko,
	ico: config.ico_seize,
	has_active_skill: false,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'S',
	name: 'Fusoku',
	hpmax: 4700,
	hp: 4700,
	atk: 870,
	crit_multi: 1.6,
	crit_chance: 30,
	def: 65,
	spd: 5,
	agi: 4,
	acr: 4,
	int: 85,
	mag: 0,
	magcd: 0,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 0,
	dodgecd: 2,
	rgn: 30,
	react_selection1: 'I will fight for you, with honor.',
	react_selection2: 'I will fight for you, with honor.',
	react_KO1: 'I\'m sorry... I can\'t continue...',
	react_KO2: 'I can\'t...',
	react_victory1: 'You fought well.',
	react_victory2: 'You\'ll do better next time.',
	emoji: config.emote_fusoku,
	emoji_ko: config.emote_fusoku_ko,
	ico: config.ico_fusoku,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'S',
	name: 'Leoppscaay',
	hpmax: 2400,
	hp: 2400,
	atk: 460,
	crit_multi: 1.2,
	crit_chance: 60,
	def: 40,
	spd: 6,
	agi: 5,
	acr: 4,
	int: 100,
	mag: 600,
	magcd: 2,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 2,
	dodgecd: 2,
	rgn: 80,
	react_selection1: 'Nhh... can I just go home ?',
	react_selection2: 'Nhh... can I just go home ?',
	react_KO1: 'I didn\'t even wanted to take part in that ti begin with...',
	react_KO2: 'It\'s over, leave me alone !',
	react_victory1: 'So can I leave now ?',
	react_victory2: 'So can I leave now ?',
	emoji: config.emote_leoppsccay,
	emoji_ko: config.emote_leoppsccay_ko,
	ico: config.ico_leoppscay,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'S',
	name: 'Gold',
	hpmax: 3900,
	hp: 3900,
	atk: 590,
	crit_multi: 1.3,
	crit_chance: 50,
	def: 50,
	spd: 6,
	agi: 3,
	acr: 5,
	int: 120,
	mag: 1900,
	magcd: 8,
	magdef: 30,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 8,
	dodgecd: 2,
	rgn: 35,
	react_selection1: '...',
	react_selection2: '...',
	react_KO1: '...!? How ?',
	react_KO2: '.....',
	react_victory1: '...Done.',
	react_victory2: '...',
	emoji: config.emote_gold,
	emoji_ko: config.emote_gold_ko,
	ico: config.ico_gold,
	has_active_skill: false,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
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
	magdef: 20,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 0,
	dodgecd: 2,
	rgn: 20,
	react_selection1: 'Guess you want to be in the winning team, uh ?',
	react_selection2: 'Ready to win that one as well~',
	react_KO1: 'What the hell... ?!',
	react_KO2: 'Seriously...?',
	react_victory1: 'Told ya~',
	react_victory2: 'It\'s not like you could do anything against it.',
	emoji: config.emote_ayddan,
	emoji_ko: config.emote_ayddan_ko,
	ico: config.ico_ayddan,
	has_active_skill: false,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Snipefox',
	hpmax: 1900,
	hp: 1900,
	atk: 450,
	crit_multi: 2.5,
	crit_chance: 30,
	def: 25,
	spd: 7,
	agi: 10,
	acr: 15,
	int: 130,
	mag: 1400,
	magcd: 5,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 5,
	dodgecd: 2,
	rgn: 10,
	react_selection1: 'Who\'s the target ?',
	react_selection2: 'Who\'s the target ?',
	react_KO1: 'I can\'t make it, I must retreat.',
	react_KO2: 'I can\'t make it, I must retreat.',
	react_victory1: 'Target neutralised.',
	react_victory2: 'Objective accomplished.',
	emoji: config.emote_snipefox,
	emoji_ko: config.emote_snipepfox_ko,
	ico: config.ico_snipefox,
	has_active_skill: true,
	has_passive_skill: false,
	skill_cd: 5,
	skill_cd_max: 5,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Yellow Strike',
	hpmax: 1500,
	hp: 1500,
	atk: 440,
	crit_multi: 1.7,
	crit_chance: 20,
	def: 60,
	spd: 10,
	agi: 15,
	acr: 6,
	int: 130,
	mag: 900,
	magcd: 4,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 4,
	dodgecd: 2,
	rgn: 10,
	react_selection1: 'I bet you\'re not even going to hit me ! You\'re all so slow !',
	react_selection2: 'Do you think you\'ll even be able to touch me ?!',
	react_KO1: 'I lost... my bet, damnit.',
	react_KO2: '...Almost...',
	react_victory1: 'Haha ! Told you !',
	react_victory2: 'See ?! I\'m so fast right ?!',
	emoji: config.emote_yellowstrike,
	emoji_ko: config.emote_yellowstrike_ko,
	ico: config.ico_yellowstrike,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Pinky',
	hpmax: 1000,
	hp: 1000,
	atk: 510,
	crit_multi: 2.5,
	crit_chance: 15,
	def: 20,
	spd: 7,
	agi: 3,
	acr: 6,
	int: 120,
	mag: 700,
	magcd: 3,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 3,
	dodgecd: 2,
	rgn: 0,
	react_selection1: 'Why did you choose me ... ?',
	react_selection2: 'Why did you choose me ... ?',
	react_KO1: '...Finally.',
	react_KO2: '...Finally.',
	react_victory1: 'Pathetic',
	react_victory2: 'Pathetic',
	emoji: config.emote_pinky,
	emoji_ko: config.emote_pinky_ko,
	ico: config.ico_pinky,
	has_active_skill: true,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Red Queen',
	hpmax: 2000,
	hp: 2000,
	atk: 310,
	crit_multi: 1.2,
	crit_chance: 30,
	def: 70,
	spd: 4,
	agi: 2,
	acr: 4,
	int: 120,
	mag: 300,
	magcd: 3,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 3,
	dodgecd: 2,
	rgn: 10,
	react_selection1: 'Who is even daring to fight the Queen ?!',
	react_selection2: 'Who is even daring to fight the Queen ?!',
	react_KO1: 'You\'re going to be punished... For that...',
	react_KO2: 'You\'re going to be punished... For that...',
	react_victory1: 'That\'s what you get for opposing the Queen.',
	react_victory2: 'That\'s what you get for opposing the Queen.',
	emoji: config.emote_redqueen,
	emoji_ko: config.emote_redqueen_ko,
	ico: config.ico_redqueen,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Kairo',
	hpmax: 2000,
	hp: 2000,
	atk: 750,
	crit_multi: 1.5,
	crit_chance: 20,
	def: 50,
	spd: 5,
	agi: 4,
	acr: 3,
	int: 75,
	mag: 0,
	magcd: 0,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 0,
	dodgecd: 2,
	rgn: 20,
	react_selection1: 'So you need me for a fight right ? Let\'s do that.',
	react_selection2: 'Let\'s go.',
	react_KO1: 'Fuck you !',
	react_KO2: 'Fuck you !',
	react_victory1: 'Easy !',
	react_victory2: 'Easy !',
	emoji: config.emote_kairo,
	emoji_ko: config.emote_kairo_ko,
	ico: config.ico_kairo,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'A',
	name: 'Lyzan',
	hpmax: 1500,
	hp: 1500,
	atk: 200,
	crit_multi: 5,
	crit_chance: 30,
	def: 30,
	spd: 6,
	agi: 7,
	acr: 5,
	int: 140,
	mag: 2100,
	magcd: 15,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 15,
	dodgecd: 2,
	rgn: 100,
	react_selection1: 'I\'m sorry but if you thought I was defenceless, I\'m going to have to disappoint you, bring it on !',
	react_selection2: 'You know I don\'t like to fight right ?!',
	react_KO1: 'I really need to... Upgrade that strength boost...',
	react_KO2: 'Ran out of energy too soon again...Fuck.',
	react_victory1: '... May I collect some blood sample while you\'re busy bleeding that mutch ?',
	react_victory2: 'Don\'t you piss me off again or that\'s your neck I\'ll break next time.',
	emoji: config.emote_lyzan,
	emoji_ko: config.emote_lyzan_ko,
	ico: config.ico_lyzan,
	has_active_skill: true,
	has_passive_skill: false,
	skill_cd: 10,
	skill_cd_max: 10,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'B',
	name: 'USaBi',
	hpmax: 900,
	hp: 900,
	atk: 240,
	crit_multi: 2,
	crit_chance: 20,
	def: 30,
	spd: 6,
	agi: 6,
	acr: 5,
	int: 90,
	mag: 500,
	magcd: 5,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 5,
	dodgecd: 2,
	rgn: 0,
	react_selection1: 'This again ?!',
	react_selection2: 'You really piss me off !',
	react_KO1: 'I\'m out of... Battery............. Disconnecting.',
	react_KO2: 'I\'m out of... Battery............. Disconnecting.',
	react_victory1: 'That\'s over now !',
	react_victory2: 'That\'s over now !',
	emoji: config.emote_usabi,
	emoji_ko: config.emote_usabi_ko,
	ico: config.ico_usabi,
	has_active_skill: false,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'B',
	name: 'Ell\'Fayrh',
	hpmax: 1000,
	hp: 1000,
	atk: 180,
	crit_multi: 3,
	crit_chance: 10,
	def: 85,
	spd: 3,
	agi: 2,
	acr: 9,
	int: 190,
	mag: 1500,
	magcd: 10,
	magdef: 60,
	mag_crit_chance: 30,
	mag_crit_multi: 1.5,
	mag_dodgevalue: 0,
	magcdmax: 10,
	dodgecd: 2,
	rgn: 0,
	react_selection1: 'Hhh... Another of those pointless fights, uh ?',
	react_selection2: 'Let\'s see if I can get some data from this fight at least...',
	react_KO1: 'Tsk... Of course this was going to end like this, I\'m not a fighter.',
	react_KO2: '...Thoses data are rather interesting...',
	react_victory1: 'Considering your capacity I don\'t even know why you picked a fight to begin with.',
	react_victory2: 'You\'re stronger, yet your strategy...Even less than mediocre. And you lost.',
	emoji: config.emote_ellfayrh,
	emoji_ko: config.emote_ellfayrh_ko,
	ico: config.ico_ellfayrh,
	has_active_skill: false,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
},
{
	tier: 'C',
	name: 'May',
	hpmax: 700,
	hp: 700,
	atk: 120,
	crit_multi: 1.1,
	crit_chance: 40,
	def: 20,
	spd: 7,
	agi: 6,
	acr: 6,
	int: 120,
	mag: 250,
	magcd: 3,
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 3,
	dodgecd: 2,
	rgn: 5,
	react_selection1: 'I\'m going to do the best I can !... Which is not much, but...',
	react_selection2: 'I\'m going to do the best I can !... Which is not much, but...',
	react_KO1: 'Nhh... I did the best I could, sorry.',
	react_KO2: 'I knew it... I can\'t win...',
	react_victory1: 'What ?! I won ? Really ?',
	react_victory2: 'WHAT ?! REALLY ?',
	emoji: config.emote_may,
	emoji_ko: config.emote_may_ko,
	ico: config.ico_may,
	has_active_skill: true,
	has_passive_skill: false,
	skill_cd: 6,
	skill_cd_max: 6,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
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
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 0,
	dodgecd: 2,
	rgn: 20,
	react_selection1: 'It\'s just a friendly fight so everyone calm down please... No need for anyone to get hurt.',
	react_selection2: 'It\'s just a friendly fight so everyone calm down please... No need for anyone to get hurt. ',
	react_KO1: 'This wasn\'t supposed... To be that violent !',
	react_KO2: 'This wasn\'t supposed... To be that violent !',
	react_victory1: 'Surrender yourself, there is no need for anyone to get hurt anymore, it\'s over.',
	react_victory2: 'Just surrend, there is no need for anyone to get hurt anymore, it\'s over.',
	emoji: config.emote_dyakkoo,
	emoji_ko: config.emote_dyakkoo_ko,
	ico: config.ico_dyakko,
	has_active_skill: false,
	has_passive_skill: true,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
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
	magdef: 0,
	mag_crit_chance: 0,
	mag_crit_multi: 1,
	mag_dodgevalue: 0,
	magcdmax: 0,
	dodgecd: 2,
	rgn: 0,
	react_selection1: 'I\'ll do my best, so please be kind.',
	react_selection2: 'I hope I\'ll be usefull...',
	react_KO1: 'Please... Help...',
	react_KO2: 'Please... Help...',
	react_victory1: 'I\'m happy I got to win !',
	react_victory2: 'That was a nice game, let\'s play again !',
	emoji: config.emote_kairen,
	emoji_ko: config.emote_kairen_ko,
	ico: config.ico_kairen,
	has_active_skill: true,
	has_passive_skill: false,
	skill_cd: 0,
	skill_cd_max: 0,
	skill_timer: 0,
	isActive: false,
	isAlive: true,
	receivedPassiveFromGold: false,
	receivedPassiveFromAyddan: false,
}];

// Defining bot activity
client.on('ready', () => {
	client.user.setActivity('Type !register to start a game.');
	console.log('Bot has been launched without issues!');
});

// functions for displaying characters gimmicks
function react_selection(selected_char) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${selected_char.emoji} ${selected_char.react_selection1}`);
	}
	else {
		client.channels.get(channelID).send(`${selected_char.emoji} ${selected_char.react_selection2}`);
	}
}

function react_KO(p) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO1}`);
	}
	else {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO2}`);
	}
}

function react_victory(p) {
	if (Math.floor(Math.random() * 2) >= 1) {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
	}
	else {
		client.channels.get(channelID).send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
	}
}

// function for status display of how many characters each players still has
function eachPlayerCharList(p1, p2) {
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
}

// function for action selector embed
function displayActionSelector(p) {
	client.channels.get(channelID).send({
		embed: {
			color: 16286691,
			author: {
				name: p.char[p.active].name,
				icon_url: p.char[p.active].ico,
			},
			thumbnail: {
				url: p.char[p.active].ico,
			},
			fields: [{
				name: 'What should I do ?',
				value: '*Choose by reacting to this message with the appropriate action*',
			},
			],
			timestamp: new Date(),
		},
	});
}

// function for player.defense_stack
function IsDefenseStackReset(player) {
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
}

// function for alive array char
function whoIsActive(pl) {
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
}

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
function addTurn() {
	turn += 1;
	NewTurnPhase();
}

// function for special abilities
function passive(player_1, player_2) {
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
}

function active(player_1, player_2) {
	if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'snipefox') {
		snipe(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'lyzan') {
		rage(player_1.char[player_1.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'pinky') {
		explosion(player_1.char[player_1.active], player_2, player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'may') {
		pill(player_1.char[player_1.active], player_1);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'kairen') {
		ressurection(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
	}
	else {
		console.log('I fucked up\nA character without active skill managed to activate the function for active selection');
	}
}

function remove_active_effect(player_1) {
	if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'lyzan') {
		player_1.char[player_1.active].atk = char[12].atk;
		player_1.char[player_1.active].def = char[12].def;
		player_1.char[player_1.active].rgn = char[12].rgn;
		client.channels.get(channelID).send(`${player_1.char[player_1.active].name} lost the effects of rage.`);
	}
	else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'may') {
		player_1.char[player_1.active].atk = char[15].atk;
		client.channels.get(channelID).send(`${player_1.char[player_1.active].name} lost the effects of pill.`);
	}
}
// passives for gold
function black_poison(target) {
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
}
// passive for ayddan
function crushing_strength(target) {
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
}
// active for snipefox
function snipe(player_1, target, player) {
	// snipe => activate the CD of the opponent MAG (CD:5)
	console.log('snipe working');
	target.magcd = target.magcdmax;
	player_1.skill_cd = player_1.skill_cd_max;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} triggered ${target.name}'s magic cooldown!\`\`\``;
}
// active for lyzan
function rage(player_1, player) {
	// rage => ATK*5, DEF*2, RGN*3 for 2 turn (CD:10)
	console.log('rage working');
	player_1.atk *= 5;
	player_1.def *= 2;
	player_1.rgn *= 3;
	player_1.skill_cd = player_1.skill_cd_max;
	player_1.skill_timer = 3;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} entered rage mod ! His attack, defense and regeneration is buffed for 2 turns.\`\`\``;
}
// active for pinky
function explosion(player_1, target, player) {
	// explosion => MAG*2; cost 300HP
	console.log('explosion working');
	player_1.hp -= 300;
	player.dmg = player_1.mag * 2;
	target.hp -= player.dmg;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} dealt double his magic power of damage at the cost of 300 HP !\`\`\``;
}
// passive for pinky
function all_or_nothing(char1) {
	// all or nothing => Atk*3 if hp < 30%
	if (char1.receivedPassive === false) {
		if (char1.hp < (char1.hpmax * (30 / 100))) {
			char1.atk *= 3;
		}
	}
	else {
		console.log('Cant activate passive since it has already proced.');
	}
}
// active for may
function pill(player_1, player) {
	console.log('pill working');
	// pill => ATK*3 for 3 turn (CD:6)
	player_1.atk *= 3;
	player_1.skill_cd = player_1.skill_cd_max;
	player_1.skill_timer = 4;
	player.message_damage = `\`\`\`diff\n+ ${player_1.name} buffed her strength for 3 turns !\`\`\``;
}
// passive for dyakko
function care_taker(player) {
	// care taker => heal 10% of HP to every character in his team every turn while the character is alive and fighting
	let i;
	for (i = 0; i < player.char.length; i++) {
		player.char[i].hp *= (1 + (10 / 100));
		console.log(`Dyakko regenerated 10% of the maximum HP of ${player.char[i].name}`);
	}
	client.channels.get(channelID).send('Dyakko regenerated 10% of the maximum HP of all their team.');
}
// active for kairen
function ressurection(player_1, target, player) {
	// ressurection => heal a character to 100% HP (even if he is ko'ed) (CD:15)
	console.log('ressurection working');
	target.hp = target.hpmax;
	target.isAlive = true;
	player_1.skill_cd = player_1.skill_cd_max;
	player.message_damage = `\`\`\`diff\n+ ${player.char[player.active].name} ressurected ${target.name} !\`\`\``;
}

// function for status display
function status() {
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
}

// function for status display when a character dies
function statusEnd() {
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
}

// functions for turn actions
function changechar(player, char2) {
	const char1 = player.char[player.lastAliveChar];
	console.log(`${player.username} switched ${char1.name} with ${char2.name}`);
	player.message_damage = `${player.username} switched ${char1.name} with ${char2.name}`;
}

// function for when a characters dies during a turn
function omgHeDead(player) {
	react_KO(player);
	client.channels.get(channelID).send(`${player.username}'s character, ${player.char[player.lastAliveChar].name}, got K.O.'ed. Sending ${player.char[player.futurChar].name}`);
	player.alive = player.futurChar;
}
// function to round numbers to 2 decimals
function round(value) {
	return Number(Math.round(value + 'e2') + 'e-2');
}

function attack(player, otherplayer, char1, char2) {
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
}

function dodge(player, otherplayer, char_1, char_2) {
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
}

function defense(player, otherplayer, char1, char2) {
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
}

function magic(player, otherplayer, char1, char2) {
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
}

function gameEnd(winner, looser) {
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
}

// function for gameend
function IsGameOver(player, otherplayer, char1) {
	if (testmod === false) {
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
	}
	else {
		client.channels.get(channelID).send('Test mode is ON. Characters can\'t die.');
	}
}

// function for cd reset
function reset_cd(pl) {
	let pf;
	for (pf = 0; pf < pl.char.length; pf++) {
		pl.char[pf].skill_cd = 0;
		pl.char[pf].magcd = 0;
		pl.char[pf].dodgecd = 0;
	}
}

// function for cd iteration
function cd_iteration(pl) {
	let cdi;
	for (cdi = 0; cdi < pl.char.length; cdi++) {
		if (pl.char[cdi].magcd > 0 && pl.char[cdi].magcdmax >= pl.char[cdi].magcd) {
			pl.char[cdi].magcd -= 1;
		}
		if (pl.char[cdi].dodgecd > 0 && dodgecdMax >= pl.char[cdi].dodgecd) {
			pl.char[cdi].dodgecd -= 1;
		}
		if (pl.char[cdi].skill_cd > 0 && pl.char[cdi].skill_cd_max >= pl.char[cdi].skill_cd) {
			pl.char[cdi].skill_cd -= 1;
		}
		if (pl.char[cdi].skill_timer >= 0) {
			pl.char[cdi].skill_timer -= 1;
			if (pl.char[cdi].skill_timer < 0) {
				pl.char[cdi].skill_timer = 0;
			}
			if (pl.char[cdi].skill_timer === 0 && pl.char[cdi].has_active_skill === true) {
				remove_active_effect(pl);
			}
		}
	}
}

// function for action phase
function actionphase(firstplayer, secondplayer) {
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
}

// function for regen
function regen(pl) {
	if (pl.char[pl.active].hp < pl.char[pl.active].hpmax) {
		pl.char[pl.active].hp += pl.char[pl.active].rgn;
		if (pl.char[pl.active].hp > pl.char[pl.active].hpmax) {
			pl.char[pl.active].hp = pl.char[pl.active].hpmax;
		}
	}
}

// function for resetting turn phase
function NewTurnPhase() {
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
		displayActionSelector(player1);
		displayActionSelector(player2);
	}
}

// function for char_amount
function charAmount(amount) {
	char_amount = amount;
	player1.charAmount = amount;
	player2.charAmount = amount;
	client.channels.get(channelID).send(`Please choose ${amount} characters each.\nChoose your characters by typing "!*character_name*".\nYou can type !list to see the list of characters.`);
	gameStarting = true;
}
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
			if (args[0] === 'gleave') {
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
			if (args[0] === 'clear') {
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
						console.log('Error while deleting files');
						console.log(err);
					});
				}
			}
			// log player1 object
			if (args[0] === 'p1') {
				console.log(player1);
			}
			// log player2 object
			if (args[0] === 'p2') {
				console.log(player2);
			}
			// check if player1 chose a playable character
			if (args[0] === 'c1') {
				console.log(player1.char);
			}
			// check if player2 chose a playable character
			else if (args[0] === 'c2') {
				console.log(player2.char);
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
			// command to toggle testmod (characters can't die)
			else if (args[0] === 'testmod') {
				if (testmod === false) {
					testmod = true;
					msg.channel.send('**```diff\n- TEST MODE HAS BEEN ACTIVATED. CHARACTERS CAN\'T DIE AND GAME WON\'T FINISH.```**');
				}
				else {
					testmod = false;
					msg.channel.send('**```diff\n- TEST MODE HAS BEEN DE-ACTIVATED. CHARACTERS CAN DIE AND GAME WILL FINISH.```**');
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
					msg.channel.send('Syntaxe Error, type !editchar help for more information.');
				}
			}
			// autostart a game with two predetermined discord account e.g. see config.json
			else if (args[0] === 'start') {
				player1.id = config.testID1;
				player1.username = config.usernameID1;
				player2.id = config.testID2;
				player2.username = config.usernameID2;
				playerCount = 2;
				gameStarting = true;
				player1.char.push(char[0]);
				player1.choseChar = true;
				player2.choseChar = true;
				player2.char.push(char[1]);
				msg.channel.send(`Fast started the game with ${config.usernameID1} as player1 with ${player1.char[player1.active].name} and ${config.usernameID2} as player2 with ${player2.char[player2.active].name}`);
			}
			// return true if gameStarting is true
			else if (args[0] === 'gamestarting') {
				msg.channel.send(`gameStarting : ${gameStarting}`);
			}
			// return actionAmount value
			else if (args[0] === 'actionamount') {
				msg.channel.send(`actionAmount : ${actionAmount}`);
			}
			// return true if turnPhase is true
			else if (args[0] === 'turnphase') {
				msg.channel.send(`turnPhase : ${turnPhase}`);
			}
			// gameEnd function test command
			else if (args[0] === 'reset') {
				gameEnd(player1, player2);
				console.log(player1);
				console.log(player2);
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
						if (player1.char.length == player1.charAmount) {
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
						if (player2.char.length == player2.charAmount) {
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
			.then((embedMessage) => {
				embedMessage.react('603772499431260196');
			})
			.then((embedMessage) => {
				embedMessage.react('603768004010049541');
			})
			.then((embedMessage) => {
				embedMessage.react('603769186463907845');
			})
			.then((embedMessage) => {
				embedMessage.react('603770838709305371');
			})
			.then((embedMessage) => {
				embedMessage.react('603767542846193712');
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
			.then((embedMessage) => {
				embedMessage.react('603772499431260196');
			})
			.then((embedMessage) => {
				embedMessage.react('603768004010049541');
			})
			.then((embedMessage) => {
				embedMessage.react('603769186463907845');
			})
			.then((embedMessage) => {
				embedMessage.react('603770838709305371');
			})
			.then((embedMessage) => {
				embedMessage.react('603767542846193712');
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
								if (actionAmount == 2) {
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
								if (actionAmount == 2) {
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
				if (actionAmount == 2) {
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
				if (actionAmount == 2) {
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
					if (actionAmount == 2) {
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
					if (actionAmount == 2) {
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
					if (actionAmount == 2) {
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
			else if (msg.member.id === player2.id && player2.choseAction === false) {
				if (player2.char[player2.active].mag === 0) {
					msg.channel.send(`${player2.char[player2.active].name} can't cast magic. Please chose another action.`);
				}
				else if (player2.char[player2.active].magcd === 0) {
					player2.choseAction = true;
					player2.action = 'magic';
					actionAmount += 1;
					if (actionAmount == 2) {
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
					if (actionAmount == 2) {
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
					if (actionAmount == 2) {
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
