const gv = require('./variables.js');
const char = require('./characters.json');
const pastPlayers = require('./players.json');
const fs = require('fs');
const Player = require('./src/player.js');
const func = {
    // these three are placeholders, I plan on adding them as methods
    // inside the characters class later
    reactSelection: (selected_char, event) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            event.channel.send(`${selected_char.emoji} ${selected_char.reactSelection1}`);
        } else {
            event.channel.send(`${selected_char.emoji} ${selected_char.reactSelection2}`);
        }
    },
    reactKo: (p, event) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            event.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].reactKo1}`);
        } else {
            event.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].reactKo2}`);
        }
    },
    reactVictory: (p, event) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            event.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].reactVictory1}`);
        } else {
            event.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].reactVictory1}`);
        }
    },

    // function for status display of how many characters each players still has
    // it uses array with space as values that we later fill with the corresponding emote
    // we do that to prevent an error with the way embbed messages work
    // where if the value of a field is empty and/or not a string it doesn't display
    eachPlayerCharList: (p1, p2, event, client) => {
        let i;
        const p1emote = [' ', ' ', ' ', ' ', ' '];
        for (i = 0; i < p1.char.length; i++) {
            p1emote[i] = p1.char[i].isAlive ? p1.char[i].emoji : p1.char[i].emojiKo;
        }
        const p2emote = [' ', ' ', ' ', ' ', ' '];
        for (i = 0; i < p2.char.length; i++) {
            p2emote[i] = p2.char[i].isAlive ? p2.char[i].emoji : p2.char[i].emojiKo;
        }
        event.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                },
                fields: [{
                    name: `__**${p1.username}'s list of characters :**__    `,
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
    },

    // the defenseStack value is incremented each turn and starts at 2
    // so the only way for it to be inferior to 2 is if we set it to be
    // which we only do when a character defends himself
    // it is set to 2 so the defense multiplier returns to 2 only if we let
    // the defenseStack value increment back for a turn without using the
    // defense action.
    // if a character still uses a defense action multiple times in a row
    // it will work but will be 33% less effective (caping at 100%,
    // meaning you can't take more damage than normal if you spam defense)
    isDefenseStackReset: player => {
        if (player.defenseStack >= 2) {
            player.defenseMultiplier = 2;
        } else {
            player.defenseMultiplier -= (1 / 3);
            if (player.defenseMultiplier <= 1) {
                player.defenseMultiplier = 1;
            }
        }
    },

    // function that checks the value .isActive of each characters
    // since their normally is only one character with the value set to true
    // we set the active character to that value
    // this is probably useless but I'm too afraid to change how it works now
    // maybe later
    // TODO : figure out why this is useless and removing it if it really is
    whoIsActive: pl => {
        let i;
        for (i = 0; i < pl.char.length; i++) {
            if (pl.char[i].isActive === true) {
                pl.active = i;
                console.log(`${pl.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is active.`);
                break;
            } else {
                console.log(`${pl.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is not fighting.`);
            }
        }
    },

    // removes mentions in eval commands
    // (code from : https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md)
    clean: text => {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        } else {
            return text;
        }
    },

    // called after each actionPhase
    // this increments the turn value
    // and calls the newTurnPhase function
    addTurn: (event, client) => {
        gv.turn += 1;
        func.newTurnPhase(event, client);
    },

    // called at the beginning of a new turn
    // this checks if the current active player is one of those (hard coded maybe I'll do a better job later)
    // (who am I kidding I'm not paid for this) and runs the corresponding passive ability
    passive: (p1, p2, event) => {
        if (p1.char[p1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'pinky') {
            func.allOrNothing(p1.char[p1.active]);
        } else if (p1.char[p1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'ayddan') {
            func.crushingStrength(p2.char[p2.active]);
        } else if (p1.char[p1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'gold') {
            func.blackPoison(p2.char[p2.active]);
        } else if (p1.char[p1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'dyakko') {
            func.careTaker(p1, event);
        } else {
            console.log('No passive ability detected.');
        }
    },

    // called after a skill action during actionPhase
    // same as above, just checks the name and runs the function
    active: (p1, p2) => {
        if (p1.char[p1.active].name.toLowerCase() === 'snipefox') {
            func.snipe(p1.char[p1.active], p2.char[p2.active], p1);
        } else if (p1.char[p1.active].name.toLowerCase() === 'lyzan') {
            func.rage(p1.char[p1.active], p1);
        } else if (p1.char[p1.active].name.toLowerCase() === 'pinky') {
            func.explosion(p1.char[p1.active], p2, p1);
        } else if (p1.char[p1.active].name.toLowerCase() === 'may') {
            func.pill(p1.char[p1.active], p1);
        } else if (p1.char[p1.active].name.toLowerCase() === 'kairen') {
            func.ressurection(p1.char[p1.active], p2.char[p2.active], p1);
        } else {
            console.log('I fucked up\nA character without active skill managed to activate the function for active selection');
        }
    },

    // called at the beginning of a new turn if the cdIteration function
    // reached 0 for the skillTimer character value
    // same as those above, it hard checks what character it is and gives it the
    // base value of the characters.json file
    // I couldn't be bothered to clone the value (don't know how to)
    // or to create another value called 'baseAtk' or something for each buff skill
    // so I just did this
    removeActiveEffect: (p1, event) => {
        if (p1.char[p1.active].name.toLowerCase() === 'lyzan') {
            p1.char[p1.active].atk = char[12].atk;
            p1.char[p1.active].def = char[12].def;
            p1.char[p1.active].rgn = char[12].rgn;
            event.channel.send({
                embed: {
                    color: 16286691,
                    fields: [{
                        name: p1.char[p1.active].emote,
                        value: '${p1.char[p1.active].name} lost the effects of rage.',
                    }],
                },
            });
        } else if (p1.char[p1.active].name.toLowerCase() === 'may') {
            p1.char[p1.active].atk = char[15].atk;
            event.channel.send({
                embed: {
                    color: 16286691,
                    fields: [{
                        name: p1.char[p1.active].emote,
                        value: '${p1.char[p1.active].name} lost the effects of pill.',
                    }],
                },
            });
        }
    },

    // passive ability for gold
    // we check if the player has already received said passive
    // to prevent it from procing each turn
    // we also remove the predecessing passive abilities
    // although since it percentage based we don't set it exactly
    // as it was before but it's close enough
    // TODO : Should change that to be exactly the same value later (using a for loop and char[i]['name'] maybe)
    blackPoison: target => {
        // black poison => -50% to enemy RGN
        if (target.receivedPassiveFromGold === false) {
            if (target.receivedPassiveFromAyddan === true) {
                target.def += (target.def * (25 / 100));
                target.receivedPassiveFromAyddan = false;
            }
            target.rgn -= (target.rgn * (50 / 100));
            console.log('Black poison is in action.');
            target.receivedPassiveFromGold = true;
        } else {
            console.log('Cant activate passive since it has already proced.');
        }
    },

    // passive for ayddan
    // works exactly the same way as above
    crushingStrength: target => {
        // crushingStrength => -25% to enemy DEF
        if (target.receivedPassiveFromAyddan == false) {
            if (target.receivedPassiveFromGold === true) {
                target.rgn += (target.rgn * (50 / 100));
                target.receivedPassiveFromGold = false;
            }
            target.def -= (target.def * (25 / 100));
            console.log('Crushing strength is in action.');
            target.receivedPassiveFromAyddan = true;
        } else {
            console.log('Cant activate passive since it has already proced.');
        }
    },

    // active for snipefox
    // called during actionPhase
    // it just sets the current CD of the opponent to its cdMax
    snipe: (character, target, player) => {
        // snipe => activate the CD of the opponent MAG (CD:5)
        console.log('snipe working');
        target.magcd = target.magcdmax;
        character.skillCd = character.skillCdMax;
        player.messageDamage = `\`\`\`diff\n+ ${character.name} triggered ${target.name}'s magic cooldown!\`\`\``;
    },

    // active for lyzan
    rage: (character, player) => {
        // rage => ATK*5, DEF*2, RGN*3 for 2 turn (CD:10)
        console.log('rage working');
        character.atk *= 5;
        character.def *= 2;
        character.rgn *= 3;
        character.skillCd = character.skillCdMax;
        character.skillTimer = 3;
        player.messageDamage = `\`\`\`diff\n+ ${character.name} entered rage mod ! His attack, defense and regeneration is buffed for 2 turns.\`\`\``;
    },

    // active for pinky
    explosion: (char1, target, player) => {
        // explosion => MAG*2; cost 300HP
        console.log('explosion working');
        char1.hp -= 300;
        player.dmg = char1.mag * 2;
        target.hp -= player.dmg;
        player.messageDamage = `\`\`\`diff\n+ ${char1.name} dealt double his magic power of damage at the cost of 300 HP !\`\`\``;
    },

    // passive for pinky
    // just realised that this receivedPassive value
    // doesn't exist, and even if it did I forgot to change it afterwards
    // TODO : either remove it and not care or add it to each character to make it work
    allOrNothing: char1 => {
        // all or nothing => Atk*3 if hp < 30%
        if (char1.receivedPassive === false) {
            if (char1.hp < (char1.hpmax * (30 / 100))) {
                char1.atk *= 3;
            }
        } else {
            console.log('Cant activate passive since it has already proced.');
        }
    },

    // active for may
    pill: (character, player) => {
        console.log('pill working');
        // pill => ATK*3 for 3 turn (CD:6)
        character.atk *= 3;
        character.skillCd = character.skillCdMax;
        character.skillTimer = 4;
        player.messageDamage = `\`\`\`diff\n+ ${character.name} buffed her strength for 3 turns !\`\`\``;
    },

    // passive for dyakko
    careTaker: (player, event) => {
        // care taker => heal 10% of HP to every character in his team every turn while the character is alive and fighting
        let i;
        for (i = 0; i < player.char.length; i++) {
            player.char[i].hp *= (1 + (10 / 100));
            console.log(`Dyakko regenerated 10% of the maximum HP of ${player.char[i].name}`);
        }
        event.channel.send('Dyakko regenerated 10% of the maximum HP of all their team.');
    },

    // active for kairen
    ressurection: (character, target, player) => {
        // ressurection => heal a character to 100% HP (even if he is ko'ed) (CD:15)
        console.log('ressurection working');
        target.hp = target.hpmax;
        target.isAlive = true;
        character.skillCd = character.skillCdMax;
        player.messageDamage = `\`\`\`diff\n+ ${player.char[player.active].name} ressurected ${target.name} !\`\`\``;
    },

    // displays a resume of the events of a turn
    // called at the end of each turn
    // as this is an embbed message we have the same problem as with eachPlayerCharList()
    // which is we can't have an empty field or a field with something other than a string
    // so it uses message values that are either a blank space or the corresponding value
    // depending of the events of the turn
    // TODO : pretty sure messageBlock is useless
    status: (event, client) => {
        event.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                },
                fields: [{
                    name: `${gv.player1.char[gv.player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player2.char[gv.player2.active].emoji}`,
                    value: `${gv.player2.messageBlock} ${gv.player1.messageDamage} ${gv.player2.messageDodge}`,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player1.char[gv.player1.active].emoji}`,
                    value: `${gv.player1.messageBlock} ${gv.player2.messageDamage} ${gv.player1.messageDodge}`,
                },
                {
                    name: '**REGENERATION**',
                    value: `\`\`\`Diff\n+ ${gv.player1.char[gv.player1.active].name} has regenerated ${gv.player1.char[gv.player1.active].rgn} HP.\n+ ${gv.player2.char[gv.player2.active].name} has regenerated ${gv.player2.char[gv.player2.active].rgn} HP.\`\`\``,
                },
                {
                    name: `${gv.player1.char[gv.player1.active].emoji} **STATUS**`,
                    value: `\`\`\`ini\n[${gv.player1.char[gv.player1.active].name} has ${gv.player1.char[gv.player1.active].hp}/${gv.player1.char[gv.player1.active].hpmax} HP left!]\n[${gv.player1.char[gv.player1.active].name} Mag CD : ${gv.player1.char[gv.player1.active].magcd}/${gv.player1.char[gv.player1.active].magcdmax}]\`\`\``,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} **STATUS**`,
                    value: `\`\`\`ini\n[${gv.player2.char[gv.player2.active].name} has ${gv.player2.char[gv.player2.active].hp}/${gv.player2.char[gv.player2.active].hpmax} HP left!]\n[${gv.player2.char[gv.player2.active].name} Mag CD : ${gv.player2.char[gv.player2.active].magcd}/${gv.player2.char[gv.player2.active].magcdmax}]\`\`\``,
                },
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: 'Beginning new turn...',
                },
            },
        });
    },

    // called at the end of the game
    // same utility as the status function but without the regeneration part
    statusEnd: (event, client) => {
        event.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                },
                fields: [{
                    name: `${gv.player1.char[gv.player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player2.char[gv.player2.active].emoji}`,
                    value: `${gv.player2.messageBlock} ${gv.player1.messageDamage} ${gv.player2.messageDodge}`,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player1.char[gv.player1.active].emoji}`,
                    value: `${gv.player1.messageBlock} ${gv.player2.messageDamage} ${gv.player1.messageDodge}`,
                },
                {
                    name: `${gv.player1.char[gv.player1.active].emoji} **STATUS**`,
                    value: `\`\`\`ini\n[${gv.player1.char[gv.player1.active].name} has ${gv.player1.char[gv.player1.active].hp}/${gv.player1.char[gv.player1.active].hpmax} HP left!]\`\`\``,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} **STATUS**`,
                    value: `\`\`\`ini\n[${gv.player2.char[gv.player2.active].name} has ${gv.player2.char[gv.player2.active].hp}/${gv.player2.char[gv.player2.active].hpmax} HP left!]\`\`\``,
                },
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: 'Game has been reset.',
                },
            },
        });
    },

    // switch actions
    // called during actionPhase
    // this takes a character name as a user input and makes it the active character
    changechar: (player, char2) => {
        const char1 = player.char[player.lastAliveChar];
        player.messageDamage = `${player.username} switched ${char1.name} with ${char2.name}`;
    },

    // called after each action function inside the actionPhase
    // this prints the reactKo() message and set the value of the active character
    // to that of the futurChar set by the isGameOver() function
    characterDied: (player, event) => {
        event.channel.send({
            embed: {
                color: 16286691,
                fields: [{
                    name: `**${player.char[player.lastAliveChar].emoji} ${player.char[player.lastAliveChar].name}, got K.O.'ed.**`,
                    value: `Sending ${player.char[player.futurChar].name} ${player.char[player.futurChar].emoji}`,
                } ],
                timestamp: new Date(),
            },
        });
        func.reactKo(player, event);
        player.active = player.futurChar;
    },

    // mostly used for the display of the defenseStack value and the !ad math command
    // rounds the inputed value by using the Math.round() method
    // that rounds to the nearest integer to our value times 10^2
    // and then multiplying our value by 10^-2
    // exemple: we input 58.651234958, we multiply by 10^2
    // to get 5865.1234958, we use Math.round() to get 5865
    // and then multiply by 10^-2 to get 58.65
    // (code from : https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary)
    round: value => {
        return Number(Math.round(value + 'e2') + 'e-2');
    },

    // function for the defense action
    // it is called after a defense check inside the attack function
    // so we already know that the character is defending when calling it
    // so we just have to check wether the damage defended from is critical or not
    // for the end of turn status
    // to nerf the effect of defense we decrease the defenseMultiplier of the character each time it is used in a row
    // see isDefenseStackReset() function to know more about defenseStack
    defense: (player, target, char1, char2) => {
        if (char1.critChance > Math.floor(Math.random() * 100)) {
            player.dmg = (char1.atk * (1 - ((char2.def * target.defenseMultiplier) / 100))) * char1.critMulti;
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            player.messageDamage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${target.char[target.active].name} !\`\`\`**`);
        } else {
            player.dmg = char1.atk * (1 - ((char2.def * target.defenseMultiplier) / 100));
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            player.messageDamage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
        }
        target.defenseStack = 0;
    },

    attack: (player, target, char1, char2) => {
        if (target.action !== 'defense') {
            if (char1.critChance > Math.floor(Math.random() * 100)) {
                player.dmg = (char1.atk * (1 - (char2.def / 100))) * char1.critMulti;
                if (player.dmg < 0) {
                    player.dmg = 0;
                }
                console.log(player.dmg);
                player.messageDamage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${target.char[target.active].name} !\`\`\`**`);
            } else {
                player.dmg = char1.atk * (1 - (char2.def / 100));
                if (player.dmg < 0) {
                    player.dmg = 0;
                }
                console.log(player.dmg);
                player.messageDamage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
            }
            func.dodge(player, target, char2, char1);
            char2.hp -= Math.floor(player.dmg);
        } else {
            func.defense(player, target, char1, char2);
            player.messageBlock = (`${char2.name} multiplicated their defense for this turn by ${gv.round(target.defenseMultiplier)} and only took ${Math.floor(player.dmg)} damage.`);
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            char2.hp -= Math.floor(player.dmg);
        }
    },

    dodge: (player, target, char_1, char_2) => {
        if (player.action === 'attack') {
            if (char_1.dodgecd === 0) {
                let dodgeValue = 0;
                dodgeValue = (char_1.agi - char_2.acr) + 1;
                const diceroll = Math.floor(Math.random() * 10);
                if (diceroll <= 9) {
                    if (dodgeValue >= diceroll) {
                        target.totalDodges += 1;
                        player.dmg = 0;
                        char_1.dodgecd = gv.dodgecdMax;
                        player.messageDamage = ' ';
                        target.messageDodge = (`**${char_1.name} dodged ${char_2.name}'s attack.**`);
                    } else {
                        console.log(`${char_1.name} tried to dodge ${char_2.name}'s attack but failed.`);
                    }
                } else if (diceroll === 10) {
                    target.totalDodges += 1;
                    player.dmg = 0;
                    char_1.dodgecd = gv.dodgecdMax;
                    player.messageDamage = ' ';
                    target.messageDodge = (`${char_1.name} dodged ${char_2.name}'s attack.`);
                }
            } else {
                console.log(`${char_1.name} tried to dodge but couldn't because it is still under cooldown.`);
            }
        } else if (player.action === 'magic') {
            if (char_1.magDodgevalue > Math.floor(Math.random() * 100)) {
                player.dmg = 0;
                player.messageDamage = ' ';
                target.messageDodge = (`${char_1.name} dodged ${char_2.name}'s magic.`);
            } else {
                console.log(`${char_1.name} tried to dodge ${char_2.name}'s magic but failed.`);
            }
        }
    },

    magic: (player, target, char1, char2, event) => {
        if (char1.magcd === 0) {
            if (char2.tier === 'H') {
                if (char1.magCritChance > Math.floor(Math.random() * 100)) {
                    player.dmg = ((char1.mag * (1 - (char2.magdef / 100))) * char1.magCritMulti) * 5;
                    player.messageDamage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${target.char[target.active].name} !\`\`\`**`);
                    func.dodge(player, target, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                } else {
                    player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * 5;
                    player.messageDamage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
                    func.dodge(player, target, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                }
            } else if (char2.tier !== 'H') {
                if (char1.magCritChance > Math.floor(Math.random() * 100)) {
                    player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * char1.magCritMulti;
                    player.messageDamage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${target.char[target.active].name} !\`\`\`**`);
                    func.dodge(player, target, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                } else {
                    player.dmg = char1.mag * (1 - (char2.magdef / 100));
                    player.messageDamage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
                    func.dodge(player, target, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                }
            }
        } else {
            event.channel.send(`${char1.name} got his cd activated and can't use magic.`);
        }
    },

    gameEnd: (winner, looser, event) => {
        func.reactKo(looser, event);
        func.reactVictory(winner, event);
        event.channel.send(`**\`\`\`fix\nCongratulation to ${winner.username} !\nGAME IS OVER ! \`\`\`**`);
        gv.gamePhase = false;
        gv.turnPhase = false;
        gv.playerCount = 0;
        gv.actionAmount = 0;
        gv.p1CharDied = false;
        gv.p2CharDied = false;
        gv.arp1 = 0;
        gv.arp2 = 0;
        gv.player1.charAmount = 1;
        gv.player2.charAmount = 1;
        gv.player1.messageBlock = ' ';
        gv.player2.messageBlock = ' ';
        gv.player1.messageDamage = ' ';
        gv.player2.messageDamage = ' ';
        gv.player1.messageDodge = ' ';
        gv.player2.messageDodge = ' ';
        gv.player1.choseChar = false;
        gv.player2.choseChar = false;
        gv.player1.choseAction = false;
        gv.player2.choseAction = false;
        gv.player1.char = [];
        gv.player2.char = [];
        gv.player1.id = 0;
        gv.player2.id = 0;
        gv.player1.username = '';
        gv.player2.username = '';
        gv.player1.totalDamages += gv.player1.dmg;
        gv.player2.totalDamages += gv.player2.dmg;
        gv.player1.dmg = 0;
        gv.player2.dmg = 0;
        gv.player1.action = '';
        gv.player2.action = '';
        gv.player1.totalTurns += gv.turn;
        gv.player2.totalTurns += gv.turn;
        gv.turn = 1;
        gv.player1.gamesPlayed += 1;
        winner.gamesWon += 1;
        gv.player2.gamesPlayed += 1;
        looser.gamesLost += 1;
        let i;
        for (i = 0; i <= pastPlayers.length; i++) {
            if (gv.player1.id === pastPlayers[i].id) {
                pastPlayers[i] = gv.player1;
            } else if (gv.player2.id === pastPlayers[i].id) {
                pastPlayers[i] = gv.player2;
            } else {
                console.log('An unregistered player accessed this part which is supposed to be impossible.');
            }
        }
        event.channel.send('Game has been successfully reset and all your stats saved.');
    },

    // function for gameend
    isGameOver: (player, target, char1, event, client) => {
        if (char1.hp <= 0) {
            char1.hp = 0;
            char1.isAlive = false;
            if (target.id === gv.player1.id) {
                gv.p1CharDied = true;
            } else if (target.id === gv.player2.id) {
                gv.p2CharDied = true;
            } else {
                console.log('An unregistered character had one of his characters dying, good luck with fixing that shit');
            }
            let i;
            for (i = 0; i <= target.charAmount; i++) {
                if (target.char[i].hp > 0 && target.char[i].isAlive === true) {
                    console.log(`${target.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is alive, selecting it to be the next char.`);
                    console.log('Now we don\'t care even if another char is dead because if one is alive then the game can continue.');
                    target.lastAliveChar = target.char.indexOf(char1);
                    target.futurChar = i;
                    break;
                } else if (target.char[i].hp <= 0) {
                    if (i === (target.charAmount - 1)) {
                        console.log('No characters are alive anymore so we end the game.');
                        func.statusEnd(event, client);
                        func.gameEnd(player, target, event);
                        break;
                    } else {
                        console.log(`${target.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is K.O. but hey, at least the loop is not over amiright?`);
                    }
                }
            }
        } else {
            console.log(`${char1.name} is still alive.`);
        }
    },

    // function for cd reset
    resetCd: pl => {
        let i;
        for (i = 0; i < pl.char.length; i++) {
            pl.char[i].skillCd = 0;
            pl.char[i].magcd = 0;
            pl.char[i].dodgecd = 0;
        }
    },

    // function for cd iteration
    cdIteration: (pl, event) => {
        let i;
        for (i = 0; i < pl.char.length; i++) {
            if (pl.char[i].magcd > 0 && pl.char[i].magcdmax >= pl.char[i].magcd) {
                pl.char[i].magcd -= 1;
            }
            if (pl.char[i].dodgecd > 0 && gv.dodgecdMax >= pl.char[i].dodgecd) {
                pl.char[i].dodgecd -= 1;
            }
            if (pl.char[i].skillCd > 0 && pl.char[i].skillCdMax >= pl.char[i].skillCd) {
                pl.char[i].skillCd -= 1;
            }
            if (pl.char[i].skillTimer >= 0) {
                pl.char[i].skillTimer -= 1;
                if (pl.char[i].skillTimer < 0) {
                    pl.char[i].skillTimer = 0;
                }
                if (pl.char[i].skillTimer === 0 && pl.char[i].hasActiveSkill === true) {
                    func.removeActiveEffect(pl, event);
                }
            }
        }
    },

    actionPhaseActions: (p, t, event, client) => {
        if (p.action === 'changechar') {
            func.changechar(p, p.char[p.active], p.char[p.active]);
        } else if (p.action === 'attack') {
            p.totalAttacks += 1;
            func.attack(p, t, p.char[p.active], t.char[t.active]);
            func.isGameOver(p, t, t.char[t.active], event, client);
        } else if (p.action === 'magic') {
            p.totalMagics += 1;
            func.magic(p, t, p.char[p.active], t.char[t.active], event);
            func.isGameOver(p, t, t.char[t.active], event, client);
        } else if (p.action === 'skill') {
            p.totalSkills += 1;
            func.active(p, t);
        } else if (p.action === 'defense') {
            p.totalDefenses += 1;
            func.defense(p, t, p.char[p.active], t.char[t.active]);
        }
    },

    // function for action phase
    actionphase: (firstplayer, secondplayer, event, client) => {
        if (gv.actionAmount === 2) {
            func.whoIsActive(gv.player1);
            func.whoIsActive(gv.player2);
            if (firstplayer.char[firstplayer.active].spd > secondplayer.char[secondplayer.active].spd) {
                // player1.char is faster than player2.char so it's attack is done before
                const phase = async () => {
                    await func.actionPhaseActions(firstplayer, secondplayer, event, client);
                    await func.actionPhaseActions(secondplayer, firstplayer, event, client);
                    gv.player1.choseAction = false;
                    gv.player2.choseAction = false;
                    gv.turnPhase = false;
                    gv.actionAmount = 0;
                    await func.addTurn(event, client);
                };
                phase();
            } else if (firstplayer.char[firstplayer.active].spd < secondplayer.char[secondplayer.active].spd) {
                const phase = async () => {
                    await func.actionPhaseActions(secondplayer, firstplayer, event, client);
                    await func.actionPhaseActions(firstplayer, secondplayer, event, client);
                    gv.player1.choseAction = false;
                    gv.player2.choseAction = false;
                    gv.turnPhase = false;
                    gv.actionAmount = 0;
                    await func.addTurn(event, client);
                };
                phase();
            } else if (firstplayer.char[firstplayer.active].spd === secondplayer.char[secondplayer.active].spd) {
                if (Math.floor(Math.random() * 2) >= 1) {
                    const phase = async () => {
                        await func.actionPhaseActions(firstplayer, secondplayer, event, client);
                        await func.actionPhaseActions(secondplayer, firstplayer, event, client);
                        gv.player1.choseAction = false;
                        gv.player2.choseAction = false;
                        gv.turnPhase = false;
                        gv.actionAmount = 0;
                        await func.addTurn(event, client);
                    };
                    phase();
                } else {
                    const phase = async () => {
                        await func.actionPhaseActions(secondplayer, firstplayer, event, client);
                        await func.actionPhaseActions(firstplayer, secondplayer, event, client);
                        gv.player1.choseAction = false;
                        gv.player2.choseAction = false;
                        gv.turnPhase = false;
                        gv.actionAmount = 0;
                        await func.addTurn(event, client);
                    };
                    phase();
                }
            }
        } else {
            console.log('If I see this then I fucked up.');
        }
    },

    // function for regen
    regen: pl => {
        if (pl.char[pl.active].hp < pl.char[pl.active].hpmax) {
            pl.char[pl.active].hp += pl.char[pl.active].rgn;
            if (pl.char[pl.active].hp > pl.char[pl.active].hpmax) {
                pl.char[pl.active].hp = pl.char[pl.active].hpmax;
            }
        }
    },

    // function for resetting turn phase
    newTurnPhase: (event, client) => {
        // allowing combat regen and preventing it from going past max hp and deducing cd
        if (gv.gamePhase === true && gv.turnPhase === false) {
            func.regen(gv.player1);
            func.regen(gv.player2);
            func.cdIteration(gv.player1, event);
            func.cdIteration(gv.player2, event);
            func.passive(gv.player1, gv.player2, event);
            func.passive(gv.player2, gv.player1, event);
            func.status(event, client);
            func.eachPlayerCharList(gv.player1, gv.player2, event, client);
            if (gv.p1CharDied) {
                func.characterDied(gv.player1, event);
                gv.p1CharDied = false;
            }
            if (gv.p2CharDied) {
                func.characterDied(gv.player2, event);
                gv.p2CharDied = false;
            }
            gv.player1.totalDamages += gv.player1.dmg;
            gv.player2.totalDamages += gv.player2.dmg;
            gv.player1.dmg = 0;
            gv.player2.dmg = 0;
            gv.player1.messageBlock = ' ';
            gv.player2.messageBlock = ' ';
            gv.player1.messageDamage = ' ';
            gv.player2.messageDamage = ' ';
            gv.player1.messageDodge = ' ';
            gv.player2.messageDodge = ' ';
            gv.player1.defenseStack += 1;
            gv.player2.defenseStack += 1;
            func.isDefenseStackReset(gv.player1);
            func.isDefenseStackReset(gv.player2);
            event.channel.send(`\`\`\`diff\nTurn ${gv.turn} has started. Chose your character's action.\`\`\``);
            gv.turnPhase = true;
            event.channel.send({
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
            event.channel.send({
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
    },

    // this function is called at the !start command that initiates the game
    // it takes an argument from the user and gives its value to the
    // player.charAmount value that determines how many
    // characters a player can select
    // Note that we have to use parseInt to use the amount argument
    // because it is a user input and is by default a String
    // Finally it switches the gameStarting value to true
    // activating the character selection command to progress the game
    charAmount: (amount, event) => {
        gv.player1.charAmount = parseInt(amount);
        gv.player2.charAmount = parseInt(amount);
        event.channel.send(`Please choose ${amount} characters each.\nChoose your characters by typing "!*character_name*".\nYou can type !list to see the list of characters.`);
        gv.gameStarting = true;
    },

    // this function is supposed to be used inside a loop (see !ad math command inside index.js)
    // for each iteration 'i' this adds the values of the iterated character 'c'
    // inside the tier array to the corresponding key and count how many
    // characters were iterated.
    // for the mag key, as it is the only one that can be 0, this checks if it
    // already has a value inside the tier array, if yes then it check if the
    // iterated character has a mag value superior to 0.
    // As we don't want to calcul our average with the characters that has no mag value
    // we don't add the characters that have a mag value of 0 to the tier array
    // instead we increment the noMagChar value to count how many characters out of
    // the iterated characters had no mag and display it to the user
    math: (tier, i, c) => {
        tier.hp.push(c[i].hp);
        tier.atk.push(c[i].atk);
        tier.critMulti.push(c[i].critMulti);
        tier.critChance.push(c[i].critChance);
        tier.def.push(c[i].def);
        tier.spd.push(c[i].spd);
        tier.agi.push(c[i].agi);
        tier.acr.push(c[i].acr);
        tier.rgn.push(c[i].rgn);
        !tier.mag.length ? tier.mag[0] = c[i].mag : c[i].mag ? tier.mag.push(c[i].mag) : tier.noMagChar++;
        tier.charCount++;
    },

    // function that takes an array of number and returns their average
    // by using the .reduce() method to create a value equal to the sum of
    // all the value in the array
    // (code from : https://stackoverflow.com/questions/10359907/how-to-compute-the-sum-and-average-of-elements-in-an-array)
    // If the array is empty the function returns 0 to prevent it from being NaN
    // as the average is directly displayed in the !ad math command
    average: tier => {
        if (tier.length) {
            const sum = tier.reduce((previous, current) => current += previous);
            const avg = sum / tier.length;
            return func.round(avg);
        } else {
            return 0;
        }
    },

    // function that checks the discord ID of the event caller and checks if it is equal
    // to the ID of a player registered in players.json
    // If the ID is that of a registered player, it breaks the loop and returns the value
    // of the player object as it is registered in players.json
    // If the loop is at it's last iteration and the ID is still not found inside players.json
    // the function create a new Player object with the Player class with the event caller
    // ID and username and adds it to players.json
    isPlayerKnown: event => {
        let i;
        for(i = 0; i <= pastPlayers.length; i++) {
            if (pastPlayers.length) {
                if (!pastPlayers[i]) {
                    const p = new Player(event.member.id, event.author.username);
                    pastPlayers.push(p);
                    fs.writeFile('players.json', JSON.stringify(pastPlayers, undefined, 2), (err) => {
                        if (err) throw err;
                        console.log('Players has successfully been saved');
                    });
                    break;
                } else if (pastPlayers[i].id === event.member.id) {
                    break;
                } else if (pastPlayers.length === i) {
                    const p = new Player(event.member.id, event.author.username);
                    pastPlayers.push(p);
                    fs.writeFile('players.json', JSON.stringify(pastPlayers, undefined, 2), (err) => {
                        if (err) throw err;
                        console.log('Players has successfully been saved');
                    });
                    break;
                }
            } else {
                const p = new Player(event.member.id, event.author.username);
                pastPlayers.push(p);
                fs.writeFile('players.json', JSON.stringify(pastPlayers, undefined, 2), (err) => {
                    if (err) throw err;
                    console.log('Players has successfully been saved');
                });
                break;
            }
        }
        return pastPlayers[i];
    },
};

module.exports = func;