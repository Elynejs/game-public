// This is a discord bot written in javascript that let's you play a rpg-like game of versus-fighting
// This is my first ever attempt at programmation and I learned on the fly
// It particularly shows when you look at older part of the code
// This could be easily done in way less lines and time it took me to do it and I know it
// But nevertheless I'm rather proud of the level I was able to aquire in this short amount of time
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const token = require('./token.json');
const fc = require('./src/functions.js');
const gv = require('./src/variables.js');
const char = require('./characters.json');
const pastPlayers = require('./players.json');
client.login(token.token);
// Defining bot activity
// to the necessary command a user has to type to start a game.
client.on('ready', () => {
    client.user.setActivity('Type !register to start a game.');
    console.log('Bot has been launched without issues!');
});

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
                    msg.channel.send(fc.clean(evaled), { code: 'xl' });
                }
            } catch (err) {
                msg.channel.send(`\`ERROR\` \`\`\`xl\n${fc.clean(err)}\n\`\`\``);
            }
        } else {
            msg.channel.send('You don\'t have enough permission and shouldn\'t even be aware of the existence of this command you filthy bastard.');
        }
    }
    if (command === 'ad') {
        // check if user inputted command starts with 'ad' (for admin)
        // and if so then checks the args of the input to see if it matches with one of the coded admin commands
        if (msg.member.id === config.ownerID || config.adminID) {
            // command that displays an embedd command that shows every admin
            // commands and how to use them as well as what they do
            if (args[0] === 'help') {
                msg.channel.send({
                    embed: {
                        color: 16286691,
                        title: '__**List of all admin commands**__',
                        fields: [{
                            name: '**Leave guild**',
                            value: '```!ad gleave [Guild ID] => Makes the bot leave a guild specified by it\'s ID```',
                        },
                        {
                            name: '**Clear**',
                            value: '```!ad clear [Number] => Makes the bot deletes his own messages among the specified last number of messages```',
                        },
                        {
                            name: '**Character edit**',
                            value: '```!ad editchar [name][stat][value][player] => Allows you to edit the stats of a character, type !ad editchar help for more information```',
                        },
                        {
                            name: '**Game reset**',
                            value: '```!ad reset => Makes the bot reset the current game```',
                        },
                        {
                            name: '**Statistics**',
                            value: '```!ad math => Makes the bot display statistics about characters depending on their Tier ( + It\'s dyanamic!!)```',
                        }],
                    },
                }
                );
            } else if (args[0] === 'generate') {
                const generator = require('./src/characterBulkGenerator.js/index.js');
                if (!args[1]) {
                    msg.channel.send('Please input an amount of character to generate');
                } else {
                    generator(parseInt(args[1]));
                    msg.channel.send(`${args[1]} characters have been automatically generated and saved in charactersBulk.json`);
                }
            } else if (args[0] === 'math') {
                // One day, I woke up and said to myself "Math is cool, especially statistics".
                // So I decided to make a command that would display basics statistics math about the character stats of this game.
                // Decision I strongly regretted later on when I realised I had no idea what the fuck I am doing
                // So just, skip pass that command, don't ever try to read or debug it, you'll go crazy
                // This is worse than r/badcode
                // I warned you
                let i;
                const S = {
                    hp: [],
                    atk: [],
                    critMulti: [],
                    critChance: [],
                    def: [],
                    spd: [],
                    agi: [],
                    acr: [],
                    mag: [],
                    rgn: [],
                    charCount: 0,
                    noMagChar: 0,
                };
                const A = {
                    hp: [],
                    atk: [],
                    critMulti: [],
                    critChance: [],
                    def: [],
                    spd: [],
                    agi: [],
                    acr: [],
                    mag: [],
                    rgn: [],
                    charCount: 0,
                    noMagChar: 0,
                };
                const B = {
                    hp: [],
                    atk: [],
                    critMulti: [],
                    critChance: [],
                    def: [],
                    spd: [],
                    agi: [],
                    acr: [],
                    mag: [],
                    rgn: [],
                    charCount: 0,
                    noMagChar: 0,
                };
                const C = {
                    hp: [],
                    atk: [],
                    critMulti: [],
                    critChance: [],
                    def: [],
                    spd: [],
                    agi: [],
                    acr: [],
                    mag: [],
                    rgn: [],
                    charCount: 0,
                    noMagChar: 0,
                };
                const H = {
                    hp: [],
                    atk: [],
                    critMulti: [],
                    critChance: [],
                    def: [],
                    spd: [],
                    agi: [],
                    acr: [],
                    mag: [],
                    rgn: [],
                    charCount: 0,
                    noMagChar: 0,
                };
                for (i = 0; i < char.length; i++) {
                    if (char[i]['tier'] === 'S') {
                        fc.math(S, i, char);
                    } else if (char[i]['tier'] === 'A') {
                        fc.math(A, i, char);
                    } else if (char[i]['tier'] === 'B') {
                        fc.math(B, i, char);
                    } else if (char[i]['tier'] === 'C') {
                        fc.math(C, i, char);
                    } else if (char[i]['tier'] === 'H') {
                        fc.math(H, i, char);
                    } else {
                        console.log('Iterated character had an undefined tier, most likely test1 or test2');
                    }
                }
                msg.channel.send(`__**Stats for Tier S :**__ *${S.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + fc.average(S.hp) + '	' + 'Min HP : ' + Math.min(...S.hp) + '	' + 'Max HP : ' + Math.max(...S.hp) + '\n' +
'Average Attack          : ' + fc.average(S.atk) + '	' + 'Min Attack : ' + Math.min(...S.atk) + '	' + 'Max Attack : ' + Math.max(...S.atk) + '\n' +
'Average Crit Multi      : ' + fc.average(S.critMulti) + '	' + 'Min Crit Multi : ' + Math.min(...S.critMulti) + '	' + 'Max Crit Multi : ' + Math.max(...S.critMulti) + '\n' +
'Average Crit Chance     : ' + fc.average(S.critChance) + '	' + 'Min Crit Chance : ' + Math.min(...S.critChance) + '	' + 'Max Crit Chance : ' + Math.max(...S.critChance) + '\n' +
'Average Defense         : ' + fc.average(S.def) + '	' + 'Min Defense : ' + Math.min(...S.def) + '	' + 'Max Defense : ' + Math.max(...S.def) + '\n' +
'Average Speed           : ' + fc.average(S.spd) + '	' + 'Min Speed : ' + Math.min(...S.spd) + '	' + 'Max Speed : ' + Math.max(...S.spd) + '\n' +
'Average Agility         : ' + fc.average(S.agi) + '	' + 'Min Agility : ' + Math.min(...S.agi) + '	' + 'Max Agility : ' + Math.max(...S.agi) + '\n' +
'Average Accuracy        : ' + fc.average(S.acr) + '	' + 'Min Accuracy : ' + Math.min(...S.acr) + '	' + 'Max Accuracy : ' + Math.max(...S.acr) + '\n' +
'Average HP Regen        : ' + fc.average(S.rgn) + '	' + 'Min HP Regen : ' + Math.min(...S.rgn) + '	' + 'Max HP Regen : ' + Math.max(...S.rgn) + '\n' +
'Average Magic           : ' + fc.average(S.mag) + '	' + 'Min Magic : ' + Math.min(...S.mag) + '	' + 'Max Magic : ' + Math.max(...S.mag) + '\n' +
'```' + `\n*Note that ${S.noMagChar} out of ${S.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier A :**__ *${A.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + fc.average(A.hp) + '	' + 'Min HP : ' + Math.min(...A.hp) + '	' + 'Max HP : ' + Math.max(...A.hp) + '\n' +
'Average Attack          : ' + fc.average(A.atk) + '	' + 'Min Attack : ' + Math.min(...A.atk) + '	' + 'Max Attack : ' + Math.max(...A.atk) + '\n' +
'Average Crit Multi      : ' + fc.average(A.critMulti) + '	' + 'Min Crit Multi : ' + Math.min(...A.critMulti) + '	' + 'Max Crit Multi : ' + Math.max(...A.critMulti) + '\n' +
'Average Crit Chance     : ' + fc.average(A.critChance) + '	' + 'Min Crit Chance : ' + Math.min(...A.critChance) + '	' + 'Max Crit Chance : ' + Math.max(...A.critChance) + '\n' +
'Average Defense         : ' + fc.average(A.def) + '	' + 'Min Defense : ' + Math.min(...A.def) + '	' + 'Max Defense : ' + Math.max(...A.def) + '\n' +
'Average Speed           : ' + fc.average(A.spd) + '	' + 'Min Speed : ' + Math.min(...A.spd) + '	' + 'Max Speed : ' + Math.max(...A.spd) + '\n' +
'Average Agility         : ' + fc.average(A.agi) + '	' + 'Min Agility : ' + Math.min(...A.agi) + '	' + 'Max Agility : ' + Math.max(...A.agi) + '\n' +
'Average Accuracy        : ' + fc.average(A.acr) + '	' + 'Min Accuracy : ' + Math.min(...A.acr) + '	' + 'Max Accuracy : ' + Math.max(...A.acr) + '\n' +
'Average HP Regen        : ' + fc.average(A.rgn) + '	' + 'Min HP Regen : ' + Math.min(...A.rgn) + '	' + 'Max HP Regen : ' + Math.max(...A.rgn) + '\n' +
'Average Magic           : ' + fc.average(A.mag) + '	' + 'Min Magic : ' + Math.min(...A.mag) + '	' + 'Max Magic : ' + Math.max(...A.mag) + '\n' +
'```' + `\n*Note that ${A.noMagChar} out of ${A.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier B :**__ *${B.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + fc.average(B.hp) + '	' + 'Min HP : ' + Math.min(...B.hp) + '	' + 'Max HP : ' + Math.max(...B.hp) + '\n' +
'Average Attack          : ' + fc.average(B.atk) + '	' + 'Min Attack : ' + Math.min(...B.atk) + '	' + 'Max Attack : ' + Math.max(...B.atk) + '\n' +
'Average Crit Multi      : ' + fc.average(B.critMulti) + '	' + 'Min Crit Multi : ' + Math.min(...B.critMulti) + '	' + 'Max Crit Multi : ' + Math.max(...B.critMulti) + '\n' +
'Average Crit Chance     : ' + fc.average(B.critChance) + '	' + 'Min Crit Chance : ' + Math.min(...B.critChance) + '	' + 'Max Crit Chance : ' + Math.max(...B.critChance) + '\n' +
'Average Defense         : ' + fc.average(B.def) + '	' + 'Min Defense : ' + Math.min(...B.def) + '	' + 'Max Defense : ' + Math.max(...B.def) + '\n' +
'Average Speed           : ' + fc.average(B.spd) + '	' + 'Min Speed : ' + Math.min(...B.spd) + '	' + 'Max Speed : ' + Math.max(...B.spd) + '\n' +
'Average Agility         : ' + fc.average(B.agi) + '	' + 'Min Agility : ' + Math.min(...B.agi) + '	' + 'Max Agility : ' + Math.max(...B.agi) + '\n' +
'Average Accuracy        : ' + fc.average(B.acr) + '	' + 'Min Accuracy : ' + Math.min(...B.acr) + '	' + 'Max Accuracy : ' + Math.max(...B.acr) + '\n' +
'Average HP Regen        : ' + fc.average(B.rgn) + '	' + 'Min HP Regen : ' + Math.min(...B.rgn) + '	' + 'Max HP Regen : ' + Math.max(...B.rgn) + '\n' +
'Average Magic           : ' + fc.average(B.mag) + '	' + 'Min Magic : ' + Math.min(...B.mag) + '	' + 'Max Magic : ' + Math.max(...B.mag) + '\n' +
'```' + `\n*Note that ${B.noMagChar} out of ${B.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier C :**__ *${C.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + fc.average(C.hp) + '	' + 'Min HP : ' + Math.min(...C.hp) + '	' + 'Max HP : ' + Math.max(...C.hp) + '\n' +
'Average Attack          : ' + fc.average(C.atk) + '	' + 'Min Attack : ' + Math.min(...C.atk) + '	' + 'Max Attack : ' + Math.max(...C.atk) + '\n' +
'Average Crit Multi      : ' + fc.average(C.critMulti) + '	' + 'Min Crit Multi : ' + Math.min(...C.critMulti) + '	' + 'Max Crit Multi : ' + Math.max(...C.critMulti) + '\n' +
'Average Crit Chance     : ' + fc.average(C.critChance) + '	' + 'Min Crit Chance : ' + Math.min(...C.critChance) + '	' + 'Max Crit Chance : ' + Math.max(...C.critChance) + '\n' +
'Average Defense         : ' + fc.average(C.def) + '	' + 'Min Defense : ' + Math.min(...C.def) + '	' + 'Max Defense : ' + Math.max(...C.def) + '\n' +
'Average Speed           : ' + fc.average(C.spd) + '	' + 'Min Speed : ' + Math.min(...C.spd) + '	' + 'Max Speed : ' + Math.max(...C.spd) + '\n' +
'Average Agility         : ' + fc.average(C.agi) + '	' + 'Min Agility : ' + Math.min(...C.agi) + '	' + 'Max Agility : ' + Math.max(...C.agi) + '\n' +
'Average Accuracy        : ' + fc.average(C.acr) + '	' + 'Min Accuracy : ' + Math.min(...C.acr) + '	' + 'Max Accuracy : ' + Math.max(...C.acr) + '\n' +
'Average HP Regen        : ' + fc.average(C.rgn) + '	' + 'Min HP Regen : ' + Math.min(...C.rgn) + '	' + 'Max HP Regen : ' + Math.max(...C.rgn) + '\n' +
'Average Magic           : ' + fc.average(C.mag) + '	' + 'Min Magic : ' + Math.min(...C.mag) + '	' + 'Max Magic : ' + Math.max(...C.mag) + '\n' +
'```' + `\n*Note that ${C.noMagChar} out of ${C.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier H :**__ *${H.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + fc.average(H.hp) + '	' + 'Min HP : ' + Math.min(...H.hp) + '	' + 'Max HP : ' + Math.max(...H.hp) + '\n' +
'Average Attack          : ' + fc.average(H.atk) + '	' + 'Min Attack : ' + Math.min(...H.atk) + '	' + 'Max Attack : ' + Math.max(...H.atk) + '\n' +
'Average Crit Multi      : ' + fc.average(H.critMulti) + '	' + 'Min Crit Multi : ' + Math.min(...H.critMulti) + '	' + 'Max Crit Multi : ' + Math.max(...H.critMulti) + '\n' +
'Average Crit Chance     : ' + fc.average(H.critChance) + '	' + 'Min Crit Chance : ' + Math.min(...H.critChance) + '	' + 'Max Crit Chance : ' + Math.max(...H.critChance) + '\n' +
'Average Defense         : ' + fc.average(H.def) + '	' + 'Min Defense : ' + Math.min(...H.def) + '	' + 'Max Defense : ' + Math.max(...H.def) + '\n' +
'Average Speed           : ' + fc.average(H.spd) + '	' + 'Min Speed : ' + Math.min(...H.spd) + '	' + 'Max Speed : ' + Math.max(...H.spd) + '\n' +
'Average Agility         : ' + fc.average(H.agi) + '	' + 'Min Agility : ' + Math.min(...H.agi) + '	' + 'Max Agility : ' + Math.max(...H.agi) + '\n' +
'Average Accuracy        : ' + fc.average(H.acr) + '	' + 'Min Accuracy : ' + Math.min(...H.acr) + '	' + 'Max Accuracy : ' + Math.max(...H.acr) + '\n' +
'Average HP Regen        : ' + fc.average(H.rgn) + '	' + 'Min HP Regen : ' + Math.min(...H.rgn) + '	' + 'Max HP Regen : ' + Math.max(...H.rgn) + '\n' +
'Average Magic           : ' + fc.average(H.mag) + '	' + 'Min Magic : ' + Math.min(...H.mag) + '	' + 'Max Magic : ' + Math.max(...H.mag) + '\n' +
'```' + `\n*Note that ${H.noMagChar} out of ${H.charCount} characters had no magic and where left out of the average calculation.*`);
            } else if (args[0] === 'gleave') {
                if (msg.guild.id == args[1]) {
                    // this is just a bit of security measure to make sure the user knows what server he is going to leave
                    msg.guild.leave()
                        .then(g => console.log(`Left the guild ${g}`))
                        .catch(console.error);
                } else {
                    console.log('Guild ID didn\'t match with user inputed guild ID.');
                }
            } else if (args[0] === 'clear') {
                // clear bot's message on a channel
                const msglimit = args[1];
                if(msg.channel.type == 'text') {
                    msg.channel.fetchMessages({ limit: msglimit }).then(messages => {
                        const botMsg = messages.filter(author => author.author.bot);
                        if (botMsg.array().length > 1) {
                            msg.channel.bulkDelete(botMsg);
                        } else if (botMsg.array().length) {
                            botMsg[0].delete();
                        } else {
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
            } else if (args[0] === 'editchar') {
                // editing command for player.char
                const p = args[4];
                if (args[1] === 'help') {
                    msg.channel.send('Correct syntaxe is !editchar [name] [stat] [value] [player]');
                } else if (args.length > 3) {
                    let a;
                    for (a = 0; a < char.length; a++) {
                        if (args[1] === p.char[a].name.toLowerCase().trim().replace(/\s+/g, '')) {
                            console.log(`value found : ${p.char[a].name}`);
                            const char_value = parseInt(args[3]);
                            p.char[a][args[2]] = char_value;
                            msg.channel.send(`Admin changed the value of ${p.char[a].name}'s ${p.char[a][args[2]]} to ${char_value}`);
                            console.log(p.char[a]);
                        }
                    }
                } else {
                    msg.channel.send('Syntaxe Error, type !ad editchar help for more information.');
                }
            } else if (args[0] === 'reset') {
                fc.gameEnd(gv.player1, gv.player2, msg);
                console.log(gv);
            } else {
                msg.channel.send('It seems no command matches your input, please type "!ad help" to see the list of admin commands.');
            }
        } else {
            msg.channel.send('You lack permissions to use this command.');
        }
    }

    if (command === 'register') {
        // command for registering as a "player"
        if (gv.playerCount === 0) {
            msg.reply('is registered as player 1! Waiting for another player...');
            gv.playerCount = 1;
            gv.player1 = fc.isPlayerKnown(msg);
            console.log(gv.player1.id);
            console.log(pastPlayers);
        } else if (gv.playerCount === 1) {
            if (msg.member.id === gv.player1.id) {
                msg.reply('is already registered.');
            } else {
                msg.reply('is registered as player 2!');
                msg.channel.send('Type !start to start the game!\nYou can add a number after !start to customize how many character each player can choose. The default number is`1`');
                gv.playerCount = 2;
                gv.player2 = fc.isPlayerKnown(msg);
                console.log(gv.player2.id);
            }
        } else {
            msg.reply(' there is already two registered players.');
            // failsafe in case someone tries to register when a game is in session
        }
    } else if (command === 'start') {
        // starting the game
        if (gv.playerCount !== 2) {
            msg.channel.send('Not enough player registered yet. Please type !register.');
        } else if (args.length !== 0) {
            if (args[0] >= 5) {
                args[0] = 5;
            }
            fc.charAmount(args[0], msg);
        } else {
            msg.channel.send('An error occured! Please try again.');
        }
    } else if (command === 'list') {
        // list command
        msg.reply('https://imgur.com/mtzCunX');
    } else if (command === 'stats') {
        // stat command
        msg.reply('https://i.imgur.com/lY5H53N.jpg');
    } else if (command === 'actions') {
        // action command
        msg.reply('https://i.imgur.com/nuZbg4x.jpg');
    } else if (command === 'customchar') {
        const custChar = new Object();
        // const filter = () => true;
        msg.author.send('__**Welcome to the character creation screen**__\n' +
		'Be advised that any error you make will be `permanent` so be extra sure when inputting your values.\n' +
		'If you type anything other than the asked value then the creation will break\n');
        msg.author.send('So, let\'s begin, what\'s the tier of your character ?\n' +
		'*Available tiers are S, A, B, C, H, note that H is reserved for healers which this generator is not yet able to make since they require special bit of coding, you can contact me on discord Elyne#6997 and I\'ll create it for you.*');
        msg.author.send('What\'s the name of your character ?\n' +
		'*Note that you can only use alphanumerical characters, space and \'*');
        char.push(custChar);
    } else if (gv.gameStarting === true) {
        // character selection
        let i;
        for (i = 0; i < char.length; i++) {
            const name = char[i].name.toLowerCase().trim();
            if (command === name.replace(/\s+/g, '')) {
                if (msg.member.id === gv.player1.id) {
                    if (!gv.player1.choseChar) {
                        gv.player1.char.push(char[i]);
                        msg.reply(` chose ${char[i].name}`);
                        fc.reactSelection(gv.player1.char[gv.arp1], msg);
                        gv.arp1 += 1;
                        if (gv.player1.char.length === gv.player1.charAmount) {
                            msg.channel.send(`${gv.player1.username} chose all of their characters.`);
                            gv.player1.choseChar = true;
                            gv.arp1 = 0;
                        }
                    } else {
                        msg.reply(' already has enough characters.');
                    }
                } else if (msg.member.id === gv.player2.id) {
                    if (!gv.player2.choseChar) {
                        gv.player2.char.push(char[i]);
                        msg.reply(` chose ${char[i].name}`);
                        fc.reactSelection(gv.player2.char[gv.arp2], msg);
                        gv.arp2 += 1;
                        if (gv.player2.char.length === gv.player2.charAmount) {
                            msg.channel.send(`${gv.player2.username} chose all of their characters.`);
                            gv.player2.choseChar = true;
                            gv.arp2 = 0;
                        }
                    } else {
                        msg.reply(' already has enough characters.');
                    }
                } else {
                    msg.reply(' is not a registered player.');
                }
                break;
            }
        }
    }

    // initializing turnPhase value
    if (gv.player1.choseChar === true && gv.player2.choseChar === true && gv.gameStarting === true) {
        gv.gameStarting = false;
        gv.gamePhase = true;
        gv.turnPhase = true;
        gv.turn = 1;
        fc.reset_cd(gv.player1);
        fc.reset_cd(gv.player2);
        fc.passive(gv.player1, gv.player2, msg);
        fc.passive(gv.player2, gv.player1, msg);
        fc.eachPlayerCharList(gv.player1, gv.player2, msg, client);
        gv.player1.char[0].isActive = true;
        gv.player2.char[0].isActive = true;
        msg.channel.send(`Turn ${gv.turn} has started. Chose your character's action.`);
        msg.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: gv.player1.char[gv.player1.active].name,
                    icon_url: gv.player1.char[gv.player1.active].ico,
                },
                thumbnail: {
                    url: gv.player1.char[gv.player1.active].ico,
                },
                fields: [{
                    name: 'What should I do ?',
                    value: '*Choose by typing one of the commands below*',
                }],
                image: {
                    url: 'https://i.imgur.com/nuZbg4x.jpg',
                },
                timestamp: new Date(),
            },
        });
        msg.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: gv.player2.char[gv.player2.active].name,
                    icon_url: gv.player2.char[gv.player2.active].ico,
                },
                thumbnail: {
                    url: gv.player2.char[gv.player2.active].ico,
                },
                fields: [{
                    name: 'What should I do ?',
                    value: '*Choose by typing one of the commands below*',
                }],
                image: {
                    url: 'https://i.imgur.com/nuZbg4x.jpg',
                },
                timestamp: new Date(),
            },
        });
    }

    // turn phase of the combat phase
    if (gv.gamePhase === true && gv.turnPhase === true) {
        switch (command) {
        case'surrender':
            // triggers the function that ends the game for the
            // player that type the command !surrender
            if (msg.member.id === gv.player1.id) {
                fc.gameEnd(gv.player2, gv.player1, msg);
            } else if (msg.member.id === gv.player2.id) {
                fc.gameEnd(gv.player1, gv.player2, msg);
            } else {
                msg.reply(' you can\'t surrender since you are not a registered player');
            }
            break;
        case 'switch':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
                msg.delete();
                const c = args[0];
                if (args.length < 1) {
                    msg.channel.send('Syntaxe error. Please specify which character you would like to switch with your current character\n`example: \'!switch lyzan\'`');
                } else if (gv.player1.char[gv.player1.active].name === c) {
                    msg.channel.send('You can\'t switch to this character since it is already in play');
                } else {
                    let i;
                    for (i = 0; i < gv.player1.charAmount; i++) {
                        if (gv.player1.char[i].name.toLowerCase().trim().replace(/\s+/g, '') === c) {
                            if (gv.player1.char[i].isAlive === true) {
                                msg.channel.send('The character you tried to switch to is K.O, please try another one of your characters or choose another action.');
                                break;
                            } else {
                                gv.player1.char[gv.player1.active].isActive = false;
                                gv.player1.lastAliveChar = gv.player1.alive;
                                gv.player1.char[i].isActive = true;
                                gv.player1.alive = i;
                                gv.player1.choseAction = true;
                                gv.player1.action = 'changechar';
                                gv.actionAmount += 1;
                                msg.reply(` you switched ${gv.player1.char[gv.player1.active].name} to ${gv.player1.char[i].name}.`);
                                if (gv.actionAmount === 2) {
                                    fc.actionphase(gv.player1, gv.player2, msg, client);
                                } else {
                                    console.log(`actionAmount : ${gv.actionAmount}`);
                                    console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                                }
                                break;
                            }
                        } else {
                            console.log(`${gv.player1.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} was not character specified by ${gv.player1.username} the correct character is ${args[0]} continuing the search...`);
                        }
                    }
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                msg.delete();
                const c = args[0];
                if (args.length < 1) {
                    msg.channel.send('Syntaxe error. Please specify which character you would like to switch with your current character\n`example: \'!switch lyzan\'`');
                } else if (gv.player2.char[gv.player2.active].name === c) {
                    msg.channel.send('You can\'t switch to this character since it is already in play');
                } else {
                    let i;
                    for (i = 0; i < gv.player2.charAmount; i++) {
                        if (gv.player2.char[i].name.toLowerCase().trim().replace(/\s+/g, '') === c) {
                            if (gv.player2.char[i].hp <= 0) {
                                msg.channel.send('The character you tried to switch to is K.O, please try another one of your characters or choose another action.');
                                break;
                            } else {
                                gv.player2.char[gv.player2.active].isActive = false;
                                gv.player2.lastAliveChar = gv.player2.alive;
                                gv.player2.char[i].isActive = true;
                                gv.player2.alive = i;
                                gv.player2.choseAction = true;
                                gv.player2.action = 'changechar';
                                gv.actionAmount += 1;
                                msg.reply(` you switched ${gv.player2.char[gv.player2.active].name} to ${gv.player2.char[i].name}.`);
                                if (gv.actionAmount === 2) {
                                    fc.actionphase(gv.player2, gv.player2, msg, client);
                                } else {
                                    console.log(`actionAmount : ${gv.actionAmount}`);
                                    console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                                }
                                break;
                            }
                        } else {
                            console.log(`${gv.player2.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} was not the character specified by ${gv.player2.username} the correct character is ${args[0]} continuing the search...`);
                        }
                    }
                }
            } else {
                msg.reply(' you have already chosen an action or are an unregistered player.');
            }
            break;
        case 'attack':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
                msg.delete();
                gv.player1.choseAction = true;
                gv.player1.action = 'attack';
                gv.actionAmount += 1;
                msg.reply(' you chose an action that has been anonymized.');
                if (gv.actionAmount === 2) {
                    fc.actionphase(gv.player1, gv.player2, msg, client);
                } else {
                    console.log(`actionAmount : ${gv.actionAmount}`);
                    console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                msg.delete();
                gv.player2.choseAction = true;
                gv.player2.action = 'attack';
                gv.actionAmount += 1;
                msg.reply(' you chose an action that has been anonymized.');
                if (gv.actionAmount === 2) {
                    fc.actionphase(gv.player1, gv.player2, msg, client);
                } else {
                    console.log(`actionAmount : ${gv.actionAmount}`);
                    console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                }
            } else {
                console.log(`${msg.author.username} tried to play while not being registered as a player.`);
            }
            break;
        case 'defense':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false && gv.player2.choseAction === true) {
                msg.delete();
                if (gv.player2.action === 'attack') {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'defense';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send(`${gv.player2.username} did not choose a defendable action. Choose another action to take this turn.`);
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false && gv.player1.choseAction === true) {
                msg.delete();
                if (gv.player1.action === 'attack') {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'defense';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send(`${gv.player1.username} did not choose a defendable action. Choose another action to take this turn.`);
                }
            } else {
                msg.channel.send('You can\'t choose to defend if your opponent has not chosent an action yet.');
            }
            break;
        case 'magic':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
                msg.delete();
                if (gv.player1.char[gv.player1.active].mag === 0) {
                    msg.channel.send(`${gv.player1.char[gv.player1.active].name} can't cast magic. Please chose another action.`);
                } else if (gv.player1.char[gv.player1.active].magcd === 0) {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'magic';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then I\'m done');
                    }
                } else {
                    msg.reply(' can\'t use magic because it is still under cooldown.');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                msg.delete();
                if (gv.player2.char[gv.player2.active].mag === 0) {
                    msg.channel.send(`${gv.player2.char[gv.player2.active].name} can't cast magic. Please chose another action.`);
                } else if (gv.player2.char[gv.player2.active].magcd === 0) {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'magic';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.reply(' can\'t use magic because it is still under cooldown.');
                }
            } else {
                console.log(`${msg.author.username} tried to play while not being registered as a player.`);
            }
            break;
        case 'skill':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
                msg.delete();
                if (gv.player1.char[gv.player1.active].hasActiveSkill === true) {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'skill';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send('Your character doesn\'t have a special skill. Choose another action.');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                msg.delete();
                if (gv.player2.char[gv.player2.active].hasActiveSkill === true) {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'skill';
                    gv.actionAmount += 1;
                    msg.reply(' you chose an action that has been anonymized.');
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2, msg, client);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send('Your character doesn\'t have a special skill. Choose another action.');
                }
            } else {
                console.log(`${msg.author.username} tried to play while not being registered as a player.`);
            }
            break;
        }
    }
});
