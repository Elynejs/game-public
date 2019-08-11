// This is a discord bot written in javascript that let's you play a rpg-like game of versus-fighting
// This is my first ever attempt at programmation and I learned on the fly
// It particularly shows when you look at older part of the code
// This could be easily done in way less lines and time it took me to do it and I know it
// But nevertheless I'm rather proud of the level I was able to aquire in this short amount of time
// importing librarie
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const token = require('./token.json');
const fc = require('./functions.js');
client.login(token.token);

/*
--------------------------------------
THIS ARE THE OBJECT FOR BOTH THE PLAYERS AND THE CHARACTERS
--------------------------------------
*/
let channelID = config.channelID;
const globalVariable = {
    actionAmount: 0,
    turn: 1,
    gamePhase: false,
    turnPhase: false,
    gameStarting: false,
    playerCount: 0,
    char_amount: 1,
    arp1: 0,
    arp2: 0,
    p1CharDied: false,
    p2CharDied: false,
    dodgecdMax: 2,
    player1: {
        id: 0,
        active: 0,
        futurChar: 0,
        lastAliveChar: 0,
        charAmount: gv.char_amount,
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
    },
    player2: {
        id: 0,
        active: 0,
        futurChar: 0,
        lastAliveChar: 0,
        charAmount: gv.char_amount,
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
    },
    char: require('./characters.json'),
    // char: require('./charactersBulk.json'),
};
module.exports = { globalVariable };
const gv = globalVariable;
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
                        },
                        {
                            name: '**Statistics**',
                            value: '```!ad math => Makes the bot display statistics about characters depending on their Tier ( + It\'s dyanamic!!)```',
                        }],
                    },
                }
                );
            } else if (args[0] === 'generate') {
                const generator = require('./characterBulkGenerator.js');
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
                    hp: 0,
                    hpMin: 0,
                    hpMax: 0,
                    atk: 0,
                    atkMin: 0,
                    atkMax: 0,
                    critMulti: 0,
                    critMultiMin: 0,
                    critMultiMax: 0,
                    critChance: 0,
                    critChanceMin: 0,
                    critChanceMax: 0,
                    def: 0,
                    defMin: 0,
                    defMax: 0,
                    spd: 0,
                    spdMin: 0,
                    spdMax: 0,
                    agi: 0,
                    agiMin: 0,
                    agiMax: 0,
                    acr: 0,
                    acrMin: 0,
                    acrMax: 0,
                    mag: 0,
                    magMin: 0,
                    magMax: 0,
                    rgn: 0,
                    rgnMin: 0,
                    rgnMax: 0,
                    charCount: 0,
                    noMagChar: 0,
                };
                const A = {
                    hp: 0,
                    hpMin: 0,
                    hpMax: 0,
                    atk: 0,
                    atkMin: 0,
                    atkMax: 0,
                    critMulti: 0,
                    critMultiMin: 0,
                    critMultiMax: 0,
                    critChance: 0,
                    critChanceMin: 0,
                    critChanceMax: 0,
                    def: 0,
                    defMin: 0,
                    defMax: 0,
                    spd: 0,
                    spdMin: 0,
                    spdMax: 0,
                    agi: 0,
                    agiMin: 0,
                    agiMax: 0,
                    acr: 0,
                    acrMin: 0,
                    acrMax: 0,
                    mag: 0,
                    magMin: 0,
                    magMax: 0,
                    rgn: 0,
                    rgnMin: 0,
                    rgnMax: 0,
                    charCount: 0,
                    noMagChar: 0,
                };
                const B = {
                    hp: 0,
                    hpMin: 0,
                    hpMax: 0,
                    atk: 0,
                    atkMin: 0,
                    atkMax: 0,
                    critMulti: 0,
                    critMultiMin: 0,
                    critMultiMax: 0,
                    critChance: 0,
                    critChanceMin: 0,
                    critChanceMax: 0,
                    def: 0,
                    defMin: 0,
                    defMax: 0,
                    spd: 0,
                    spdMin: 0,
                    spdMax: 0,
                    agi: 0,
                    agiMin: 0,
                    agiMax: 0,
                    acr: 0,
                    acrMin: 0,
                    acrMax: 0,
                    mag: 0,
                    magMin: 0,
                    magMax: 0,
                    rgn: 0,
                    rgnMin: 0,
                    rgnMax: 0,
                    charCount: 0,
                    noMagChar: 0,
                };
                const C = {
                    hp: 0,
                    hpMin: 0,
                    hpMax: 0,
                    atk: 0,
                    atkMin: 0,
                    atkMax: 0,
                    critMulti: 0,
                    critMultiMin: 0,
                    critMultiMax: 0,
                    critChance: 0,
                    critChanceMin: 0,
                    critChanceMax: 0,
                    def: 0,
                    defMin: 0,
                    defMax: 0,
                    spd: 0,
                    spdMin: 0,
                    spdMax: 0,
                    agi: 0,
                    agiMin: 0,
                    agiMax: 0,
                    acr: 0,
                    acrMin: 0,
                    acrMax: 0,
                    mag: 0,
                    magMin: 0,
                    magMax: 0,
                    rgn: 0,
                    rgnMin: 0,
                    rgnMax: 0,
                    charCount: 0,
                    noMagChar: 0,
                };
                const H = {
                    hp: 0,
                    hpMin: 0,
                    hpMax: 0,
                    atk: 0,
                    atkMin: 0,
                    atkMax: 0,
                    critMulti: 0,
                    critMultiMin: 0,
                    critMultiMax: 0,
                    critChance: 0,
                    critChanceMin: 0,
                    critChanceMax: 0,
                    def: 0,
                    defMin: 0,
                    defMax: 0,
                    spd: 0,
                    spdMin: 0,
                    spdMax: 0,
                    agi: 0,
                    agiMin: 0,
                    agiMax: 0,
                    acr: 0,
                    acrMin: 0,
                    acrMax: 0,
                    mag: 0,
                    magMin: 0,
                    magMax: 0,
                    rgn: 0,
                    rgnMin: 0,
                    rgnMax: 0,
                    charCount: 0,
                    noMagChar: 0,
                };
                for (i = 0; i < gv.char.length; i++) {
                    if (gv.char[i]['tier'] === 'S') {
                        S.hp += gv.char[i].hp;
                        S.atk += gv.char[i].atk;
                        S.critMulti += gv.char[i].critMulti;
                        S.critChance += gv.char[i].critChance;
                        S.def += gv.char[i].def;
                        S.spd += gv.char[i].spd;
                        S.agi += gv.char[i].agi;
                        S.acr += gv.char[i].acr;
                        S.rgn += gv.char[i].rgn;
                        if (gv.char[i].mag !== 0) {
                            S.mag += gv.char[i].mag;
                        } else {
                            S.noMagChar++;
                        }
                        if (S.charCount === 0) {
                            S.hpMax = gv.char[i].hp;
                            S.hpMin = gv.char[i].hp;
                            S.atkMin = gv.char[i].atk;
                            S.atkMax = gv.char[i].atk;
                            S.critMultiMax = gv.char[i].critMulti;
                            S.critMultiMin = gv.char[i].critMulti;
                            S.critChanceMin = gv.char[i].critChance;
                            S.critChanceMax = gv.char[i].critChance;
                            S.defMin = gv.char[i].def;
                            S.defMax = gv.char[i].def;
                            S.spdMin = gv.char[i].spd;
                            S.spdMax = gv.char[i].spd;
                            S.agiMin = gv.char[i].agi;
                            S.agiMax = gv.char[i].agi;
                            S.acrMin = gv.char[i].acr;
                            S.acrMax = gv.char[i].acr;
                            S.rgnMin = gv.char[i].rgn;
                            S.rgnMax = gv.char[i].rgn;
                        }
                        if (S.charCount > 0) {
                            if (gv.char[i].hp > S.hpMax) {
                                S.hpMax = gv.char[i].hp;
                            } else if (gv.char[i].hp < S.hpMin) {
                                S.hpMin = gv.char[i].hp;
                            }
                            if (gv.char[i].atk > S.atkMax) {
                                S.atkMax = gv.char[i].atk;
                            } else if (gv.char[i].atk < S.atkMin) {
                                S.atkMin = gv.char[i].atk;
                            }
                            if (gv.char[i].critMulti > S.critMultiMax) {
                                S.critMultiMax = gv.char[i].critMulti;
                            } else if (gv.char[i].critMulti < S.critMultiMin) {
                                S.critMultiMin = gv.char[i].critMulti;
                            }
                            if (gv.char[i].critChance > S.critChanceMax) {
                                S.critChanceMax = gv.char[i].critChance;
                            } else if (gv.char[i].critChance < S.critChanceMin) {
                                S.critChanceMin = gv.char[i].critChance;
                            }
                            if (gv.char[i].def > S.defMax) {
                                S.defMax = gv.char[i].def;
                            } else if (gv.char[i].def < S.defMin) {
                                S.defMin = gv.char[i].def;
                            }
                            if (gv.char[i].spd > S.spdMax) {
                                S.spdMax = gv.char[i].spd;
                            } else if (gv.char[i].spd < S.spdMin) {
                                S.spdMin = gv.char[i].spd;
                            }
                            if (gv.char[i].agi > S.agiMax) {
                                S.agiMax = gv.char[i].agi;
                            } else if (gv.char[i].agi < S.agiMin) {
                                S.agiMin = gv.char[i].agi;
                            }
                            if (gv.char[i].acr > S.acrMax) {
                                S.acrMax = gv.char[i].acr;
                            } else if (gv.char[i].acr < S.acrMin) {
                                S.acrMin = gv.char[i].acr;
                            }
                            if (gv.char[i].rgn > S.rgnMax) {
                                S.rgnMax = gv.char[i].rgn;
                            } else if (gv.char[i].rgn < S.rgnMin) {
                                S.rgnMin = gv.char[i].rgn;
                            }
                            if (gv.char[i].mag > S.magMax) {
                                S.magMax = gv.char[i].mag;
                            } else if (gv.char[i].mag < S.magMin) {
                                S.magMin = gv.char[i].mag;
                            }
                        }
                        S.charCount++;
                    } else if (gv.char[i]['tier'] === 'A') {
                        A.hp += gv.char[i].hp;
                        A.atk += gv.char[i].atk;
                        A.critMulti += gv.char[i].critMulti;
                        A.critChance += gv.char[i].critChance;
                        A.def += gv.char[i].def;
                        A.spd += gv.char[i].spd;
                        A.agi += gv.char[i].agi;
                        A.acr += gv.char[i].acr;
                        A.rgn += gv.char[i].rgn;
                        if (gv.char[i].mag !== 0) {
                            A.mag += gv.char[i].mag;
                        } else {
                            A.noMagChar++;
                        }
                        if (A.charCount === 0) {
                            A.hpMax = gv.char[i].hp;
                            A.hpMin = gv.char[i].hp;
                            A.atkMin = gv.char[i].atk;
                            A.atkMax = gv.char[i].atk;
                            A.critMultiMax = gv.char[i].critMulti;
                            A.critMultiMin = gv.char[i].critMulti;
                            A.critChanceMin = gv.char[i].critChance;
                            A.critChanceMax = gv.char[i].critChance;
                            A.defMin = gv.char[i].def;
                            A.defMax = gv.char[i].def;
                            A.spdMin = gv.char[i].spd;
                            A.spdMax = gv.char[i].spd;
                            A.agiMin = gv.char[i].agi;
                            A.agiMax = gv.char[i].agi;
                            A.acrMin = gv.char[i].acr;
                            A.acrMax = gv.char[i].acr;
                            A.rgnMin = gv.char[i].rgn;
                            A.rgnMax = gv.char[i].rgn;
                        }
                        if (A.charCount > 0) {
                            if (gv.char[i].hp > A.hpMax) {
                                A.hpMax = gv.char[i].hp;
                            } else if (gv.char[i].hp < A.hpMin) {
                                A.hpMin = gv.char[i].hp;
                            }
                            if (gv.char[i].atk > A.atkMax) {
                                A.atkMax = gv.char[i].atk;
                            } else if (gv.char[i].atk < A.atkMin) {
                                A.atkMin = gv.char[i].atk;
                            }
                            if (gv.char[i].critMulti > A.critMultiMax) {
                                A.critMultiMax = gv.char[i].critMulti;
                            } else if (gv.char[i].critMulti < A.critMultiMin) {
                                A.critMultiMin = gv.char[i].critMulti;
                            }
                            if (gv.char[i].critChance > A.critChanceMax) {
                                A.critChanceMax = gv.char[i].critChance;
                            } else if (gv.char[i].critChance < A.critChanceMin) {
                                A.critChanceMin = gv.char[i].critChance;
                            }
                            if (gv.char[i].def > A.defMax) {
                                A.defMax = gv.char[i].def;
                            } else if (gv.char[i].def < A.defMin) {
                                A.defMin = gv.char[i].def;
                            }
                            if (gv.char[i].spd > A.spdMax) {
                                A.spdMax = gv.char[i].spd;
                            } else if (gv.char[i].spd < A.spdMin) {
                                A.spdMin = gv.char[i].spd;
                            }
                            if (gv.char[i].agi > A.agiMax) {
                                A.agiMax = gv.char[i].agi;
                            } else if (gv.char[i].agi < A.agiMin) {
                                A.agiMin = gv.char[i].agi;
                            }
                            if (gv.char[i].acr > A.acrMax) {
                                A.acrMax = gv.char[i].acr;
                            } else if (gv.char[i].acr < A.acrMin) {
                                A.acrMin = gv.char[i].acr;
                            }
                            if (gv.char[i].rgn > A.rgnMax) {
                                A.rgnMax = gv.char[i].rgn;
                            } else if (gv.char[i].rgn < A.rgnMin) {
                                A.rgnMin = gv.char[i].rgn;
                            }
                            if (gv.char[i].mag > A.magMax) {
                                A.magMax = gv.char[i].mag;
                            } else if (gv.char[i].mag < A.magMin) {
                                A.magMin = gv.char[i].mag;
                            }
                        }
                        A.charCount++;
                    } else if (gv.char[i]['tier'] === 'B') {
                        B.hp += gv.char[i].hp;
                        B.atk += gv.char[i].atk;
                        B.critMulti += gv.char[i].critMulti;
                        B.critChance += gv.char[i].critChance;
                        B.def += gv.char[i].def;
                        B.spd += gv.char[i].spd;
                        B.agi += gv.char[i].agi;
                        B.acr += gv.char[i].acr;
                        B.rgn += gv.char[i].rgn;
                        if (gv.char[i].mag !== 0) {
                            B.mag += gv.char[i].mag;
                        } else {
                            B.noMagChar++;
                        }
                        if (B.charCount === 0) {
                            B.hpMax = gv.char[i].hp;
                            B.hpMin = gv.char[i].hp;
                            B.atkMin = gv.char[i].atk;
                            B.atkMax = gv.char[i].atk;
                            B.critMultiMax = gv.char[i].critMulti;
                            B.critMultiMin = gv.char[i].critMulti;
                            B.critChanceMin = gv.char[i].critChance;
                            B.critChanceMax = gv.char[i].critChance;
                            B.defMin = gv.char[i].def;
                            B.defMax = gv.char[i].def;
                            B.spdMin = gv.char[i].spd;
                            B.spdMax = gv.char[i].spd;
                            B.agiMin = gv.char[i].agi;
                            B.agiMax = gv.char[i].agi;
                            B.acrMin = gv.char[i].acr;
                            B.acrMax = gv.char[i].acr;
                            B.rgnMin = gv.char[i].rgn;
                            B.rgnMax = gv.char[i].rgn;
                            B.magMin = gv.char[i].mag;
                            B.magMax = gv.char[i].mag;
                        }
                        if (B.charCount > 0) {
                            if (gv.char[i].hp > B.hpMax) {
                                B.hpMax = gv.char[i].hp;
                            } else if (gv.char[i].hp < B.hpMin) {
                                B.hpMin = gv.char[i].hp;
                            }
                            if (gv.char[i].atk > B.atkMax) {
                                B.atkMax = gv.char[i].atk;
                            } else if (gv.char[i].atk < B.atkMin) {
                                B.atkMin = gv.char[i].atk;
                            }
                            if (gv.char[i].critMulti > B.critMultiMax) {
                                B.critMultiMax = gv.char[i].critMulti;
                            } else if (gv.char[i].critMulti < B.critMultiMin) {
                                B.critMultiMin = gv.char[i].critMulti;
                            }
                            if (gv.char[i].critChance > B.critChanceMax) {
                                B.critChanceMax = gv.char[i].critChance;
                            } else if (gv.char[i].critChance < B.critChanceMin) {
                                B.critChanceMin = gv.char[i].critChance;
                            }
                            if (gv.char[i].def > B.defMax) {
                                B.defMax = gv.char[i].def;
                            } else if (gv.char[i].def < B.defMin) {
                                B.defMin = gv.char[i].def;
                            }
                            if (gv.char[i].spd > B.spdMax) {
                                B.spdMax = gv.char[i].spd;
                            } else if (gv.char[i].spd < B.spdMin) {
                                B.spdMin = gv.char[i].spd;
                            }
                            if (gv.char[i].agi > B.agiMax) {
                                B.agiMax = gv.char[i].agi;
                            } else if (gv.char[i].agi < B.agiMin) {
                                B.agiMin = gv.char[i].agi;
                            }
                            if (gv.char[i].acr > B.acrMax) {
                                B.acrMax = gv.char[i].acr;
                            } else if (gv.char[i].acr < B.acrMin) {
                                B.acrMin = gv.char[i].acr;
                            }
                            if (gv.char[i].rgn > B.rgnMax) {
                                B.rgnMax = gv.char[i].rgn;
                            } else if (gv.char[i].rgn < B.rgnMin) {
                                B.rgnMin = gv.char[i].rgn;
                            }
                            if (gv.char[i].mag > B.magMax) {
                                B.magMax = gv.char[i].mag;
                            } else if (gv.char[i].mag < B.magMin) {
                                B.magMin = gv.char[i].mag;
                            }
                        }
                        B.charCount++;
                    } else if (gv.char[i]['tier'] === 'C') {
                        C.hp += gv.char[i].hp;
                        C.atk += gv.char[i].atk;
                        C.critMulti += gv.char[i].critMulti;
                        C.critChance += gv.char[i].critChance;
                        C.def += gv.char[i].def;
                        C.spd += gv.char[i].spd;
                        C.agi += gv.char[i].agi;
                        C.acr += gv.char[i].acr;
                        C.rgn += gv.char[i].rgn;
                        if (gv.char[i].mag !== 0) {
                            C.mag += gv.char[i].mag;
                        } else {
                            C.noMagChar++;
                        }
                        if (C.charCount === 0) {
                            C.hpMax = gv.char[i].hp;
                            C.hpMin = gv.char[i].hp;
                            C.atkMin = gv.char[i].atk;
                            C.atkMax = gv.char[i].atk;
                            C.critMultiMax = gv.char[i].critMulti;
                            C.critMultiMin = gv.char[i].critMulti;
                            C.critChanceMin = gv.char[i].critChance;
                            C.critChanceMax = gv.char[i].critChance;
                            C.defMin = gv.char[i].def;
                            C.defMax = gv.char[i].def;
                            C.spdMin = gv.char[i].spd;
                            C.spdMax = gv.char[i].spd;
                            C.agiMin = gv.char[i].agi;
                            C.agiMax = gv.char[i].agi;
                            C.acrMin = gv.char[i].acr;
                            C.acrMax = gv.char[i].acr;
                            C.rgnMin = gv.char[i].rgn;
                            C.rgnMax = gv.char[i].rgn;
                            C.magMin = gv.char[i].mag;
                            C.magMax = gv.char[i].mag;
                        }
                        if (C.charCount > 0) {
                            if (gv.char[i].hp > C.hpMax) {
                                C.hpMax = gv.char[i].hp;
                            } else if (gv.char[i].hp < C.hpMin) {
                                C.hpMin = gv.char[i].hp;
                            }
                            if (gv.char[i].atk > C.atkMax) {
                                C.atkMax = gv.char[i].atk;
                            } else if (gv.char[i].atk < C.atkMin) {
                                C.atkMin = gv.char[i].atk;
                            }
                            if (gv.char[i].critMulti > C.critMultiMax) {
                                C.critMultiMax = gv.char[i].critMulti;
                            } else if (gv.char[i].critMulti < C.critMultiMin) {
                                C.critMultiMin = gv.char[i].critMulti;
                            }
                            if (gv.char[i].critChance > C.critChanceMax) {
                                C.critChanceMax = gv.char[i].critChance;
                            } else if (gv.char[i].critChance < C.critChanceMin) {
                                C.critChanceMin = gv.char[i].critChance;
                            }
                            if (gv.char[i].def > C.defMax) {
                                C.defMax = gv.char[i].def;
                            } else if (gv.char[i].def < C.defMin) {
                                C.defMin = gv.char[i].def;
                            }
                            if (gv.char[i].spd > C.spdMax) {
                                C.spdMax = gv.char[i].spd;
                            } else if (gv.char[i].spd < C.spdMin) {
                                C.spdMin = gv.char[i].spd;
                            }
                            if (gv.char[i].agi > C.agiMax) {
                                C.agiMax = gv.char[i].agi;
                            } else if (gv.char[i].agi < C.agiMin) {
                                C.agiMin = gv.char[i].agi;
                            }
                            if (gv.char[i].acr > C.acrMax) {
                                C.acrMax = gv.char[i].acr;
                            } else if (gv.char[i].acr < C.acrMin) {
                                C.acrMin = gv.char[i].acr;
                            }
                            if (gv.char[i].rgn > C.rgnMax) {
                                C.rgnMax = gv.char[i].rgn;
                            } else if (gv.char[i].rgn < C.rgnMin) {
                                C.rgnMin = gv.char[i].rgn;
                            }
                            if (gv.char[i].mag > C.magMax) {
                                C.magMax = gv.char[i].mag;
                            } else if (gv.char[i].mag < C.magMin) {
                                C.magMin = gv.char[i].mag;
                            }
                        }
                        C.charCount++;
                    } else if (gv.char[i]['tier'] === 'H') {
                        H.hp += gv.char[i].hp;
                        H.atk += gv.char[i].atk;
                        H.critMulti += gv.char[i].critMulti;
                        H.critChance += gv.char[i].critChance;
                        H.def += gv.char[i].def;
                        H.spd += gv.char[i].spd;
                        H.agi += gv.char[i].agi;
                        H.acr += gv.char[i].acr;
                        H.rgn += gv.char[i].rgn;
                        if (gv.char[i].mag !== 0) {
                            H.mag += gv.char[i].mag;
                        } else {
                            H.noMagChar++;
                        }
                        if (H.charCount === 0) {
                            H.hpMax = gv.char[i].hp;
                            H.hpMin = gv.char[i].hp;
                            H.atkMin = gv.char[i].atk;
                            H.atkMax = gv.char[i].atk;
                            H.critMultiMax = gv.char[i].critMulti;
                            H.critMultiMin = gv.char[i].critMulti;
                            H.critChanceMin = gv.char[i].critChance;
                            H.critChanceMax = gv.char[i].critChance;
                            H.defMin = gv.char[i].def;
                            H.defMax = gv.char[i].def;
                            H.spdMin = gv.char[i].spd;
                            H.spdMax = gv.char[i].spd;
                            H.agiMin = gv.char[i].agi;
                            H.agiMax = gv.char[i].agi;
                            H.acrMin = gv.char[i].acr;
                            H.acrMax = gv.char[i].acr;
                            H.rgnMin = gv.char[i].rgn;
                            H.rgnMax = gv.char[i].rgn;
                        }
                        if (H.charCount > 0) {
                            if (gv.char[i].hp > H.hpMax) {
                                H.hpMax = gv.char[i].hp;
                            } else if (gv.char[i].hp < H.hpMin) {
                                H.hpMin = gv.char[i].hp;
                            }
                            if (gv.char[i].atk > H.atkMax) {
                                H.atkMax = gv.char[i].atk;
                            } else if (gv.char[i].atk < H.atkMin) {
                                H.atkMin = gv.char[i].atk;
                            }
                            if (gv.char[i].critMulti > H.critMultiMax) {
                                H.critMultiMax = gv.char[i].critMulti;
                            } else if (gv.char[i].critMulti < H.critMultiMin) {
                                H.critMultiMin = gv.char[i].critMulti;
                            }
                            if (gv.char[i].critChance > H.critChanceMax) {
                                H.critChanceMax = gv.char[i].critChance;
                            } else if (gv.char[i].critChance < H.critChanceMin) {
                                H.critChanceMin = gv.char[i].critChance;
                            }
                            if (gv.char[i].def > H.defMax) {
                                H.defMax = gv.char[i].def;
                            } else if (gv.char[i].def < H.defMin) {
                                H.defMin = gv.char[i].def;
                            }
                            if (gv.char[i].spd > H.spdMax) {
                                H.spdMax = gv.char[i].spd;
                            } else if (gv.char[i].spd < H.spdMin) {
                                H.spdMin = gv.char[i].spd;
                            }
                            if (gv.char[i].agi > H.agiMax) {
                                H.agiMax = gv.char[i].agi;
                            } else if (gv.char[i].agi < H.agiMin) {
                                H.agiMin = gv.char[i].agi;
                            }
                            if (gv.char[i].acr > H.acrMax) {
                                H.acrMax = gv.char[i].acr;
                            } else if (gv.char[i].acr < H.acrMin) {
                                H.acrMin = gv.char[i].acr;
                            }
                            if (gv.char[i].rgn > H.rgnMax) {
                                H.rgnMax = gv.char[i].rgn;
                            } else if (gv.char[i].rgn < H.rgnMin) {
                                H.rgnMin = gv.char[i].rgn;
                            }
                            if (gv.char[i].mag > H.magMax) {
                                H.magMax = gv.char[i].mag;
                            } else if (gv.char[i].mag < H.magMin) {
                                H.magMin = gv.char[i].mag;
                            }
                        }
                        H.charCount++;
                    } else {
                        console.log('Iterated character had an undefined tier, most likely test1 or test2');
                    }
                }
                const Stats = [
                    {
                        // This is stats for S tier characters
                        hpAvg: fc.round((S.hp / S.charCount)), hpMin: fc.round(S.hpMin), hpMax: fc.round(S.hpMax),
                        atkAvg: fc.round((S.atk / S.charCount)), atkMin: fc.round(S.atkMin), atkMax: fc.round(S.atkMax),
                        critMultiAvg: fc.round((S.critMulti / S.charCount)), critMultiMin: fc.round(S.critMultiMin), critMultiMax: fc.round(S.critMultiMax),
                        critChanceAvg: fc.round((S.critChance / S.charCount)), critChanceMin: fc.round(S.critChanceMin), critChanceMax: fc.round(S.critChanceMax),
                        defAvg: fc.round((S.def / S.charCount)), defMin: fc.round(S.defMin), defMax: fc.round(S.defMax),
                        spdAvg: fc.round((S.spd / S.charCount)), spdMin: fc.round(S.spdMin), spdMax: fc.round(S.spdMax),
                        agiAvg: fc.round((S.agi / S.charCount)), agiMin: fc.round(S.agiMin), agiMax: fc.round(S.agiMax),
                        acrAvg: fc.round((S.acr / S.charCount)), acrMin: fc.round(S.acrMin), acrMax: fc.round(S.acrMax),
                        rgnAvg: fc.round((S.rgn / S.charCount)), rgnMin: fc.round(S.rgnMin), rgnMax: fc.round(S.rgnMax),
                        magAvg: fc.round((S.mag / (S.charCount - S.noMagChar))) || 0, magMin: fc.round(S.magMin), magMax: fc.round(S.magMax),
                    },
                    {
                        // Stats for A tier characters
                        hpAvg: fc.round((A.hp / A.charCount)), hpMin: fc.round(A.hpMin), hpMax: fc.round(A.hpMax),
                        atkAvg: fc.round((A.atk / A.charCount)), atkMin: fc.round(A.atkMin), atkMax: fc.round(A.atkMax),
                        critMultiAvg: fc.round((A.critMulti / A.charCount)), critMultiMin: fc.round(A.critMultiMin), critMultiMax: fc.round(A.critMultiMax),
                        critChanceAvg: fc.round((A.critChance / A.charCount)), critChanceMin: fc.round(A.critChanceMin), critChanceMax: fc.round(A.critChanceMax),
                        defAvg: fc.round((A.def / A.charCount)), defMin: fc.round(A.defMin), defMax: fc.round(A.defMax),
                        spdAvg: fc.round((A.spd / A.charCount)), spdMin: fc.round(A.spdMin), spdMax: fc.round(A.spdMax),
                        agiAvg: fc.round((A.agi / A.charCount)), agiMin: fc.round(A.agiMin), agiMax: fc.round(A.agiMax),
                        acrAvg: fc.round((A.acr / A.charCount)), acrMin: fc.round(A.acrMin), acrMax: fc.round(A.acrMax),
                        rgnAvg: fc.round((A.rgn / A.charCount)), rgnMin: fc.round(A.rgnMin), rgnMax: fc.round(A.rgnMax),
                        magAvg: fc.round((A.mag / (A.charCount - A.noMagChar))) || 0, magMin: fc.round(A.magMin), magMax: fc.round(A.magMax),
                    },
                    {
                        // Stats for B tier characters
                        hpAvg: fc.round((B.hp / B.charCount)), hpMin: fc.round(B.hpMin), hpMax: fc.round(B.hpMax),
                        atkAvg: fc.round((B.atk / B.charCount)), atkMin: fc.round(B.atkMin), atkMax: fc.round(B.atkMax),
                        critMultiAvg: fc.round((B.critMulti / B.charCount)), critMultiMin: fc.round(B.critMultiMin), critMultiMax: fc.round(B.critMultiMax),
                        critChanceAvg: fc.round((B.critChance / B.charCount)), critChanceMin: fc.round(B.critChanceMin), critChanceMax: fc.round(B.critChanceMax),
                        defAvg: fc.round((B.def / B.charCount)), defMin: fc.round(B.defMin), defMax: fc.round(B.defMax),
                        spdAvg: fc.round((B.spd / B.charCount)), spdMin: fc.round(B.spdMin), spdMax: fc.round(B.spdMax),
                        agiAvg: fc.round((B.agi / B.charCount)), agiMin: fc.round(B.agiMin), agiMax: fc.round(B.agiMax),
                        acrAvg: fc.round((B.acr / B.charCount)), acrMin: fc.round(B.acrMin), acrMax: fc.round(B.acrMax),
                        rgnAvg: fc.round((B.rgn / B.charCount)), rgnMin: fc.round(B.rgnMin), rgnMax: fc.round(B.rgnMax),
                        magAvg: fc.round((B.mag / (B.charCount - B.noMagChar))) || 0, magMin: fc.round(B.magMin), magMax: fc.round(B.magMax),
                    },
                    {
                        // Stats for C tier characters
                        hpAvg: fc.round((C.hp / C.charCount)), hpMin: fc.round(C.hpMin), hpMax: fc.round(C.hpMax),
                        atkAvg: fc.round((C.atk / C.charCount)), atkMin: fc.round(C.atkMin), atkMax: fc.round(C.atkMax),
                        critMultiAvg: fc.round((C.critMulti / C.charCount)), critMultiMin: fc.round(C.critMultiMin), critMultiMax: fc.round(C.critMultiMax),
                        critChanceAvg: fc.round((C.critChance / C.charCount)), critChanceMin: fc.round(C.critChanceMin), critChanceMax: fc.round(C.critChanceMax),
                        defAvg: fc.round((C.def / C.charCount)), defMin: fc.round(C.defMin), defMax: fc.round(C.defMax),
                        spdAvg: fc.round((C.spd / C.charCount)), spdMin: fc.round(C.spdMin), spdMax: fc.round(C.spdMax),
                        agiAvg: fc.round((C.agi / C.charCount)), agiMin: fc.round(C.agiMin), agiMax: fc.round(C.agiMax),
                        acrAvg: fc.round((C.acr / C.charCount)), acrMin: fc.round(C.acrMin), acrMax: fc.round(C.acrMax),
                        rgnAvg: fc.round((C.rgn / C.charCount)), rgnMin: fc.round(C.rgnMin), rgnMax: fc.round(C.rgnMax),
                        magAvg: fc.round((C.mag / (C.charCount - C.noMagChar))) || 0, magMin: fc.round(C.magMin), magMax: fc.round(C.magMax),
                    },
                    {
                        // Stats for H tier characters
                        hpAvg: fc.round((H.hp / H.charCount)), hpMin: fc.round(H.hpMin), hpMax: fc.round(H.hpMax),
                        atkAvg: fc.round((H.atk / H.charCount)), atkMin: fc.round(H.atkMin), atkMax: fc.round(H.atkMax),
                        critMultiAvg: fc.round((H.critMulti / H.charCount)), critMultiMin: fc.round(H.critMultiMin), critMultiMax: fc.round(H.critMultiMax),
                        critChanceAvg: fc.round((H.critChance / H.charCount)), critChanceMin: fc.round(H.critChanceMin), critChanceMax: fc.round(H.critChanceMax),
                        defAvg: fc.round((H.def / H.charCount)), defMin: fc.round(H.defMin), defMax: fc.round(H.defMax),
                        spdAvg: fc.round((H.spd / H.charCount)), spdMin: fc.round(H.spdMin), spdMax: fc.round(H.spdMax),
                        agiAvg: fc.round((H.agi / H.charCount)), agiMin: fc.round(H.agiMin), agiMax: fc.round(H.agiMax),
                        acrAvg: fc.round((H.acr / H.charCount)), acrMin: fc.round(H.acrMin), acrMax: fc.round(H.acrMax),
                        rgnAvg: fc.round((H.rgn / H.charCount)), rgnMin: fc.round(H.rgnMin), rgnMax: fc.round(H.rgnMax),
                        magAvg: fc.round((H.mag / (H.charCount - H.noMagChar))) || 0, magMin: fc.round(H.magMin), magMax: fc.round(H.magMax),
                    }];
                msg.channel.send(`__**Stats for Tier S :**__ *${S.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + Stats[0].hpAvg + '	' + 'Min HP : ' + Stats[0].hpMin + '	' + 'Max HP : ' + Stats[0].hpMax + '\n' +
'Average Attack          : ' + Stats[0].atkAvg + '	' + 'Min Attack : ' + Stats[0].atkMin + '	' + 'Max Attack : ' + Stats[0].atkMax + '\n' +
'Average Crit Multi      : ' + Stats[0].critMultiAvg + '	' + 'Min Crit Multi : ' + Stats[0].critMultiMin + '	' + 'Max Crit Multi : ' + Stats[0].critMultiMax + '\n' +
'Average Crit Chance     : ' + Stats[0].critChanceAvg + '	' + 'Min Crit Chance : ' + Stats[0].critChanceMin + '	' + 'Max Crit Chance : ' + Stats[0].critChanceMax + '\n' +
'Average Defense         : ' + Stats[0].defAvg + '	' + 'Min Defense : ' + Stats[0].defMin + '	' + 'Max Defense : ' + Stats[0].defMax + '\n' +
'Average Speed           : ' + Stats[0].spdAvg + '	' + 'Min Speed : ' + Stats[0].spdMin + '	' + 'Max Speed : ' + Stats[0].spdMax + '\n' +
'Average Agility         : ' + Stats[0].agiAvg + '	' + 'Min Agility : ' + Stats[0].agiMin + '	' + 'Max Agility : ' + Stats[0].agiMax + '\n' +
'Average Accuracy        : ' + Stats[0].acrAvg + '	' + 'Min Accuracy : ' + Stats[0].acrMin + '	' + 'Max Accuracy : ' + Stats[0].acrMax + '\n' +
'Average HP Regen        : ' + Stats[0].rgnAvg + '	' + 'Min HP Regen : ' + Stats[0].rgnMin + '	' + 'Max HP Regen : ' + Stats[0].rgnMax + '\n' +
'Average Magic           : ' + Stats[0].magAvg + '	' + 'Min Magic : ' + Stats[0].magMin + '	' + 'Max Magic : ' + Stats[0].magMax + '\n' +
'```' + `\n*Note that ${S.noMagChar} out of ${S.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier A :**__ *${A.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + Stats[1].hpAvg + '	' + 'Min HP : ' + Stats[1].hpMin + '	' + 'Max HP : ' + Stats[1].hpMax + '\n' +
'Average Attack          : ' + Stats[1].atkAvg + '	' + 'Min Attack : ' + Stats[1].atkMin + '	' + 'Max Attack : ' + Stats[1].atkMax + '\n' +
'Average Crit Multi      : ' + Stats[1].critMultiAvg + '	' + 'Min Crit Multi : ' + Stats[1].critMultiMin + '	' + 'Max Crit Multi : ' + Stats[1].critMultiMax + '\n' +
'Average Crit Chance     : ' + Stats[1].critChanceAvg + '	' + 'Min Crit Chance : ' + Stats[1].critChanceMin + '	' + 'Max Crit Chance : ' + Stats[1].critChanceMax + '\n' +
'Average Defense         : ' + Stats[1].defAvg + '	' + 'Min Defense : ' + Stats[1].defMin + '	' + 'Max Defense : ' + Stats[1].defMax + '\n' +
'Average Speed           : ' + Stats[1].spdAvg + '	' + 'Min Speed : ' + Stats[1].spdMin + '	' + 'Max Speed : ' + Stats[1].spdMax + '\n' +
'Average Agility         : ' + Stats[1].agiAvg + '	' + 'Min Agility : ' + Stats[1].agiMin + '	' + 'Max Agility : ' + Stats[1].agiMax + '\n' +
'Average Accuracy        : ' + Stats[1].acrAvg + '	' + 'Min Accuracy : ' + Stats[1].acrMin + '	' + 'Max Accuracy : ' + Stats[1].acrMax + '\n' +
'Average HP Regen        : ' + Stats[1].rgnAvg + '	' + 'Min HP Regen : ' + Stats[1].rgnMin + '	' + 'Max HP Regen : ' + Stats[1].rgnMax + '\n' +
'Average Magic           : ' + Stats[1].magAvg + '	' + 'Min Magic : ' + Stats[1].magMin + '	' + 'Max Magic : ' + Stats[1].magMax + '\n' +
'```' + `\n*Note that ${A.noMagChar} out of ${A.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier B :**__ *${B.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + Stats[2].hpAvg + '	' + 'Min HP : ' + Stats[2].hpMin + '	' + 'Max HP : ' + Stats[2].hpMax + '\n' +
'Average Attack          : ' + Stats[2].atkAvg + '	' + 'Min Attack : ' + Stats[2].atkMin + '	' + 'Max Attack : ' + Stats[2].atkMax + '\n' +
'Average Crit Multi      : ' + Stats[2].critMultiAvg + '	' + 'Min Crit Multi : ' + Stats[2].critMultiMin + '	' + 'Max Crit Multi : ' + Stats[2].critMultiMax + '\n' +
'Average Crit Chance     : ' + Stats[2].critChanceAvg + '	' + 'Min Crit Chance : ' + Stats[2].critChanceMin + '	' + 'Max Crit Chance : ' + Stats[2].critChanceMax + '\n' +
'Average Defense         : ' + Stats[2].defAvg + '	' + 'Min Defense : ' + Stats[2].defMin + '	' + 'Max Defense : ' + Stats[2].defMax + '\n' +
'Average Speed           : ' + Stats[2].spdAvg + '	' + 'Min Speed : ' + Stats[2].spdMin + '	' + 'Max Speed : ' + Stats[2].spdMax + '\n' +
'Average Agility         : ' + Stats[2].agiAvg + '	' + 'Min Agility : ' + Stats[2].agiMin + '	' + 'Max Agility : ' + Stats[2].agiMax + '\n' +
'Average Accuracy        : ' + Stats[2].acrAvg + '	' + 'Min Accuracy : ' + Stats[2].acrMin + '	' + 'Max Accuracy : ' + Stats[2].acrMax + '\n' +
'Average HP Regen        : ' + Stats[2].rgnAvg + '	' + 'Min HP Regen : ' + Stats[2].rgnMin + '	' + 'Max HP Regen : ' + Stats[2].rgnMax + '\n' +
'Average Magic           : ' + Stats[2].magAvg + '	' + 'Min Magic : ' + Stats[2].magMin + '	' + 'Max Magic : ' + Stats[2].magMax + '\n' +
'```' + `\n*Note that ${B.noMagChar} out of ${B.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier C :**__ *${C.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + Stats[3].hpAvg + '	' + 'Min HP : ' + Stats[3].hpMin + '	' + 'Max HP : ' + Stats[3].hpMax + '\n' +
'Average Attack          : ' + Stats[3].atkAvg + '	' + 'Min Attack : ' + Stats[3].atkMin + '	' + 'Max Attack : ' + Stats[3].atkMax + '\n' +
'Average Crit Multi      : ' + Stats[3].critMultiAvg + '	' + 'Min Crit Multi : ' + Stats[3].critMultiMin + '	' + 'Max Crit Multi : ' + Stats[3].critMultiMax + '\n' +
'Average Crit Chance     : ' + Stats[3].critChanceAvg + '	' + 'Min Crit Chance : ' + Stats[3].critChanceMin + '	' + 'Max Crit Chance : ' + Stats[3].critChanceMax + '\n' +
'Average Defense         : ' + Stats[3].defAvg + '	' + 'Min Defense : ' + Stats[3].defMin + '	' + 'Max Defense : ' + Stats[3].defMax + '\n' +
'Average Speed           : ' + Stats[3].spdAvg + '	' + 'Min Speed : ' + Stats[3].spdMin + '	' + 'Max Speed : ' + Stats[3].spdMax + '\n' +
'Average Agility         : ' + Stats[3].agiAvg + '	' + 'Min Agility : ' + Stats[3].agiMin + '	' + 'Max Agility : ' + Stats[3].agiMax + '\n' +
'Average Accuracy        : ' + Stats[3].acrAvg + '	' + 'Min Accuracy : ' + Stats[3].acrMin + '	' + 'Max Accuracy : ' + Stats[3].acrMax + '\n' +
'Average HP Regen        : ' + Stats[3].rgnAvg + '	' + 'Min HP Regen : ' + Stats[3].rgnMin + '	' + 'Max HP Regen : ' + Stats[3].rgnMax + '\n' +
'Average Magic           : ' + Stats[3].magAvg + '	' + 'Min Magic : ' + Stats[3].magMin + '	' + 'Max Magic : ' + Stats[3].magMax + '\n' +
'```' + `\n*Note that ${C.noMagChar} out of ${C.charCount} characters had no magic and where left out of the average calculation.*`);
                msg.channel.send(`__**Stats for Tier H :**__ *${H.charCount} characters iterated*\n` + '```python\n' +
'Average HP              : ' + Stats[4].hpAvg + '	' + 'Min HP : ' + Stats[4].hpMin + '	' + 'Max HP : ' + Stats[4].hpMax + '\n' +
'Average Attack          : ' + Stats[4].atkAvg + '	' + 'Min Attack : ' + Stats[4].atkMin + '	' + 'Max Attack : ' + Stats[4].atkMax + '\n' +
'Average Crit Multi      : ' + Stats[4].critMultiAvg + '	' + 'Min Crit Multi : ' + Stats[4].critMultiMin + '	' + 'Max Crit Multi : ' + Stats[4].critMultiMax + '\n' +
'Average Crit Chance     : ' + Stats[4].critChanceAvg + '	' + 'Min Crit Chance : ' + Stats[4].critChanceMin + '	' + 'Max Crit Chance : ' + Stats[4].critChanceMax + '\n' +
'Average Defense         : ' + Stats[4].defAvg + '	' + 'Min Defense : ' + Stats[4].defMin + '	' + 'Max Defense : ' + Stats[4].defMax + '\n' +
'Average Speed           : ' + Stats[4].spdAvg + '	' + 'Min Speed : ' + Stats[4].spdMin + '	' + 'Max Speed : ' + Stats[4].spdMax + '\n' +
'Average Agility         : ' + Stats[4].agiAvg + '	' + 'Min Agility : ' + Stats[4].agiMin + '	' + 'Max Agility : ' + Stats[4].agiMax + '\n' +
'Average Accuracy        : ' + Stats[4].acrAvg + '	' + 'Min Accuracy : ' + Stats[4].acrMin + '	' + 'Max Accuracy : ' + Stats[4].acrMax + '\n' +
'Average HP Regen        : ' + Stats[4].rgnAvg + '	' + 'Min HP Regen : ' + Stats[4].rgnMin + '	' + 'Max HP Regen : ' + Stats[4].rgnMax + '\n' +
'Average Magic           : ' + Stats[4].magAvg + '	' + 'Min Magic : ' + Stats[4].magMin + '	' + 'Max Magic : ' + Stats[4].magMax + '\n' +
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
            } else if (args[0] === 'editchan') {
                // command to edit channel
                if (args[1] !== channelID) {
                    channelID = args[1];
                    msg.channel.send(`Admin changed the default channel to ${args[1]}`);
                } else {
                    msg.channel.send(`Default channel ID is already set to ${args[1]}`);
                }
            } else if (args[0] === 'editchar') {
                // editing command for player.char
                const p = args[4];
                if (args[1] === 'help') {
                    msg.channel.send('Correct syntaxe is !editchar [name] [stat] [value] [player]');
                } else if (args.length > 3) {
                    let a;
                    for (a = 0; a < p.char.length; a++) {
                        if (args[1] === p.char[a].name.toLowerCase().trim().replace(/\s+/g, '')) {
                            console.log(`value found : ${p.char[a].name}`);
                            const char_value = parseInt(args[3]);
                            gv.char[a][args[2]] = char_value;
                            msg.channel.send(`Admin changed the value of ${p.char[a].name}'s ${args[2]} to ${args[3]}`);
                            console.log(gv.char[a]);
                        }
                    }
                } else {
                    msg.channel.send('Syntaxe Error, type !ad editchar help for more information.');
                }
            } else if (args[0] === 'start') {
                // autostart a game with two predetermined discord account e.g. see config.json
                gv.player1.id = config.testID1;
                gv.player1.username = config.usernameID1;
                gv.player2.id = config.testID2;
                gv.player2.username = config.usernameID2;
                gv.playerCount = 2;
                gv.char_amount = 2;
                gv.gameStarting = true;
                gv.player1.charAmount = 2;
                gv.player1.char.push(gv.char[0]);
                gv.player1.char.push(gv.char[1]);
                gv.player1.choseChar = true;
                gv.player2.charAmount = 2;
                gv.player2.char.push(gv.char[0]);
                gv.player2.char.push(gv.char[1]);
                gv.player2.choseChar = true;
                msg.channel.send('Fast started the game.');
            } else if (args[0] === 'reset') {
                fc.gameEnd(gv.player1, gv.player2);
                console.log(gv.player1);
                console.log(gv.player2);
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
            gv.player1.username = msg.author.username;
            gv.player1.id = msg.member.id;
            console.log(gv.player1.id);
        } else if (gv.playerCount === 1) {
            if (msg.member.id === gv.player1.id) {
                msg.reply('is already registered.');
            } else {
                msg.reply('is registered as player 2!');
                msg.channel.send('Type !start to start the game!\nYou can add a number after !start to customize how many character each player can choose. The default number is`1`');
                gv.playerCount = 2;
                gv.player2.username = msg.author.username;
                gv.player2.id = msg.member.id;
                console.log(gv.player2.id);
            }
        } else {
            msg.reply('there is already two registered players.');
            // failsafe in case someone tries to register when a game is in session
        }
    } else if (command === 'surrender') {
        // surrender command
        if (msg.member.id === gv.player1.id) {
            fc.gameEnd(gv.player2, gv.player1);
        } else if (msg.member.id === gv.player2.id) {
            fc.gameEnd(gv.player1, gv.player2);
        } else {
            msg.reply(' you can\'t surrender since you are not a registered player');
        }
    } else if (command === 'start') {
        // starting the game
        if (gv.playerCount !== 2) {
            msg.channel.send('Not enough player registered yet. Please type !register.');
        } else if (args.length !== 0) {
            if (args[0] >= 5) {
                args[0] = 5;
            }
            fc.charAmount(args[0]);
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
        const Tiers = ['S', 'A', 'B', 'C', 'H'];
        const custChar = new Object();
        const creation = async () => {
            // const filter = () => true;
            const firstMsg = await msg.author.send('__**Welcome to the character creation screen**__\n' +
			'Be advised that any error you make will be `permanent` so be extra sure when inputting your values.\n' +
			'If you type anything other than the asked value then the creation will break\n' +
			'Also note that you only have 10 minutes to type your response or the bot will consider that you somehow got transported into a wormhole and cancel the creation.');
            await msg.author.send('So, let\'s begin, what\'s the tier of your character ?\n' +
		'*Available tiers are S, A, B, C, H, note that H is reserved for healers which this generator is not yet able to make since they require special bit of coding, you can contact me on discord Elyne#6997 and I\'ll create it for you.*')
                .then(() => {
                    firstMsg.channel.awaitMessages(response1 => Tiers.includes(response1), {
                        max: 1,
                        time: 60000000,
                        errors: ['time'],
                    })
                        .then((collected1) => {
                            custChar.tier = collected1;
                            msg.author.send(`Your character is of tier ${collected1}`);
                            console.log(custChar);
                        })
                        .catch(() => {
                            msg.author.send('The 10 minutes time limit has passed.');
                        });
                });
            await msg.author.send('What\'s the name of your character ?\n' +
		'*Note that you can only use alphanumerical characters, space and \'*')
                .then(() => {
                    firstMsg.channel.awaitMessages(response2 => typeof response2 === String, {
                        max: 1,
                        time: 60000000,
                        errors: ['time'],
                    })
                        .then((collected2) => {
                            custChar.name = collected2;
                            msg.author.send(`Your character's name is ${collected2}`);
                            console.log(custChar);
                        })
                        .catch(() => {
                            msg.author.send('The 10 minutes time limit has passed.');
                        });
                });
            await gv.char.push(custChar);
        };
        creation();
    }
    // character selection
    if (gv.gameStarting === true) {
        let i;
        for (i = 0; i < gv.char.length; i++) {
            const name = gv.char[i].name.toLowerCase().trim();
            if (command === name.replace(/\s+/g, '')) {
                if (msg.member.id == gv.player1.id) {
                    if (!gv.player1.choseChar) {
                        gv.player1.char.push(gv.char[i]);
                        msg.reply(` chose ${gv.char[i].name}`);
                        fc.react_selection(gv.player1.char[gv.arp1], msg);
                        gv.arp1 += 1;
                        if (gv.player1.char.length === gv.player1.charAmount) {
                            msg.channel.send(`${gv.player1.username} chose all of their characters.`);
                            gv.player1.choseChar = true;
                            gv.arp1 = 0;
                        }
                    } else {
                        msg.reply(' already has enough characters.');
                    }
                } else if (msg.member.id == gv.player2.id) {
                    if (!gv.player2.choseChar) {
                        gv.player2.char.push(gv.char[i]);
                        msg.reply(` chose ${gv.char[i].name}`);
                        fc.react_selection(gv.player2.char[gv.arp2], msg);
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

    // defining turnPhase value
    if (gv.player1.choseChar === true && gv.player2.choseChar === true && gv.gameStarting === true) {
        gv.gameStarting = false;
        gv.gamePhase = true;
        gv.turnPhase = true;
        gv.turn = 1;
        fc.reset_cd(gv.player1);
        fc.reset_cd(gv.player2);
        fc.passive(gv.player1, gv.player2);
        fc.passive(gv.player2, gv.player1);
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
                    url: 'https: //i.imgur.com/nuZbg4x.jpg',
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
                    url: 'https: //i.imgur.com/nuZbg4x.jpg',
                },
                timestamp: new Date(),
            },
        });
    }

    // turn phase of the combat phase
    if (gv.gamePhase === true && gv.turnPhase === true) {
        switch (command) {
        case 'switch':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
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
                                if (gv.actionAmount === 2) {
                                    fc.actionphase(gv.player1, gv.player2);
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
                                if (gv.actionAmount === 2) {
                                    fc.actionphase(gv.player2, gv.player2);
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
                msg.reply(' you have already choosen an action or are an unregistered player.');
            }
            break;
        case 'attack':
            if (msg.member.id === gv.player1.id && gv.player1.choseAction === false) {
                gv.player1.choseAction = true;
                gv.player1.action = 'attack';
                gv.actionAmount += 1;
                if (gv.actionAmount === 2) {
                    fc.actionphase(gv.player1, gv.player2);
                } else {
                    console.log(`actionAmount : ${gv.actionAmount}`);
                    console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                gv.player2.choseAction = true;
                gv.player2.action = 'attack';
                gv.actionAmount += 1;
                if (gv.actionAmount === 2) {
                    fc.actionphase(gv.player1, gv.player2);
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
                if (gv.player2.action === 'attack') {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'defense';
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send(`${gv.player2.username} did not choose a defendable action. Choose another action to take this turn.`);
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false && gv.player1.choseAction === true) {
                if (gv.player1.action === 'attack') {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'defense';
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
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
                if (gv.player1.char[gv.player1.active].mag === 0) {
                    msg.channel.send(`${gv.player1.char[gv.player1.active].name} can't cast magic. Please chose another action.`);
                } else if (gv.player1.char[gv.player1.active].magcd === 0) {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'magic';
                    msg.reply(`${gv.player1.username} chose to use magic this turn.`);
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then I\'m done');
                    }
                } else {
                    msg.reply(' can\'t use magic because it is still under cooldown.');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                if (gv.player2.char[gv.player2.active].mag === 0) {
                    msg.channel.send(`${gv.player2.char[gv.player2.active].name} can't cast magic. Please chose another action.`);
                } else if (gv.player2.char[gv.player2.active].magcd === 0) {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'magic';
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
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
                if (gv.player1.char[gv.player1.active].has_active_skill === true) {
                    gv.player1.choseAction = true;
                    gv.player1.action = 'skill';
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
                    } else {
                        console.log(`actionAmount : ${gv.actionAmount}`);
                        console.log('If actionAmount is lower than 2, then this message is normal, if it is egal or higher than 2 then i done fucked up');
                    }
                } else {
                    msg.channel.send('Your character doesn\'t have a special skill. Choose another action.');
                }
            } else if (msg.member.id === gv.player2.id && gv.player2.choseAction === false) {
                if (gv.player2.char[gv.player2.active].has_active_skill === true) {
                    gv.player2.choseAction = true;
                    gv.player2.action = 'skill';
                    gv.actionAmount += 1;
                    if (gv.actionAmount === 2) {
                        fc.actionphase(gv.player1, gv.player2);
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

/* client.on('disconnect', () => {
	const fs = require('fs');
	fs.writeFile('characters.json', JSON.stringify(gv.char, undefined, 2), (err) => {
		if (err) throw err;
		console.log('Characters has successfully been saved');
	});
});*/