const gv = require('./globalVariable.js');
const char = require('./characters.json');

const func = {
    // functions for displaying characters gimmicks on selection of character
    react_selection: (selected_char, client) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            client.channel.send(`${selected_char.emoji} ${selected_char.react_selection1}`);
        } else {
            client.channel.send(`${selected_char.emoji} ${selected_char.react_selection2}`);
        }
    },

    // function for displaying character gimmick on death of character
    react_KO: (p, client) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            client.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO1}`);
        } else {
            client.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].react_KO2}`);
        }
    },

    // function for displaying character gimmick on character victory
    react_victory: (p, client) => {
        if (Math.floor(Math.random() * 2) >= 1) {
            client.channel.send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
        } else {
            client.channels.send(`${p.char[p.active].emoji} ${p.char[p.active].react_victory1}`);
        }
    },

    // function for status display of how many characters each players still has
    eachPlayerCharList: (p1, p2, client) => {
        let i;
        const p1emote = [' ', ' ', ' ', ' ', ' '];
        for (i = 0; i < p1.char.length; i++) {
            p1emote[i] = p1.char[i].isAlive ? p1.char[i].emoji : p1.char[i].emoji_ko;
        }
        const p2emote = [' ', ' ', ' ', ' ', ' '];
        for (i = 0; i < p2.char.length; i++) {
            p2emote[i] = p2.char[i].isAlive ? p2.char[i].emoji : p2.char[i].emoji_ko;
        }
        client.channel.send({
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
    },

    // function for player.defense_stack
    IsDefenseStackReset: player => {
        if (player.defense_stack >= 2) {
            player.defense_multiplier = 2;
        } else {
            player.defense_multiplier -= (1 / 3);
            if (player.defense_multiplier <= 1) {
                player.defense_multiplier = 1;
            }
            console.log(player.defense_multiplier);
        }
    },

    // function for alive array char
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

    // function for eval
    clean: text => {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        } else {
            return text;
        }
    },

    // function for passing from one turn to another
    addTurn: client => {
        gv.turn += 1;
        func.NewTurnPhase(client);
    },

    // function for special abilities
    passive: (player_1, player_2, client) => {
        if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'pinky') {
            func.all_or_nothing(player_1.char[player_1.active]);
        } else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'ayddan') {
            func.crushing_strength(player_2.char[player_2.active]);
        } else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'gold') {
            func.black_poison(player_2.char[player_2.active]);
        } else if (player_1.char[player_1.active].name.toLowerCase().trim().replace(/\s+/g, '') === 'dyakko') {
            func.care_taker(player_1, client);
        } else {
            console.log('No passive ability detected.');
        }
    },

    active: (player_1, player_2) => {
        if (player_1.char[player_1.active].name.toLowerCase() === 'snipefox') {
            func.snipe(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
        } else if (player_1.char[player_1.active].name.toLowerCase() === 'lyzan') {
            func.rage(player_1.char[player_1.active], player_1);
        } else if (player_1.char[player_1.active].name.toLowerCase() === 'pinky') {
            func.explosion(player_1.char[player_1.active], player_2, player_1);
        } else if (player_1.char[player_1.active].name.toLowerCase() === 'may') {
            func.pill(player_1.char[player_1.active], player_1);
        } else if (player_1.char[player_1.active].name.toLowerCase() === 'kairen') {
            func.ressurection(player_1.char[player_1.active], player_2.char[player_2.active], player_1);
        } else {
            console.log('I fucked up\nA character without active skill managed to activate the function for active selection');
        }
    },

    remove_active_effect: (player_1, client) => {
        if (player_1.char[player_1.active].name.toLowerCase() === 'lyzan') {
            player_1.char[player_1.active].atk = char[12].atk;
            player_1.char[player_1.active].def = char[12].def;
            player_1.char[player_1.active].rgn = char[12].rgn;
            client.channel.send({
                embed: {
                    color: 16286691,
                    fields: [{
                        name: player_1.char[player_1.active].emote,
                        value: '${player_1.char[player_1.active].name} lost the effects of rage.',
                    }],
                },
            });
        } else if (player_1.char[player_1.active].name.toLowerCase() === 'may') {
            player_1.char[player_1.active].atk = char[15].atk;
            client.channel.send({
                embed: {
                    color: 16286691,
                    fields: [{
                        name: player_1.char[player_1.active].emote,
                        value: '${player_1.char[player_1.active].name} lost the effects of pill.',
                    }],
                },
            });
        }
    },

    // passives for gold
    black_poison: target => {
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
    crushing_strength: target => {
        // crushing_strength => -25% to enemy DEF
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
    snipe: (player_1, target, player) => {
        // snipe => activate the CD of the opponent MAG (CD:5)
        console.log('snipe working');
        target.magcd = target.magcdmax;
        player_1.skill_cd = player_1.skill_cd_max;
        player.message_damage = `\`\`\`diff\n+ ${player_1.name} triggered ${target.name}'s magic cooldown!\`\`\``;
    },

    // active for lyzan
    rage: (player_1, player) => {
        // rage => ATK*5, DEF*2, RGN*3 for 2 turn (CD:10)
        console.log('rage working');
        player_1.atk *= 5;
        player_1.def *= 2;
        player_1.rgn *= 3;
        player_1.skill_cd = player_1.skill_cd_max;
        player_1.skill_timer = 3;
        player.message_damage = `\`\`\`diff\n+ ${player_1.name} entered rage mod ! His attack, defense and regeneration is buffed for 2 turns.\`\`\``;
    },

    // active for pinky
    explosion: (player_1, target, player) => {
        // explosion => MAG*2; cost 300HP
        console.log('explosion working');
        player_1.hp -= 300;
        player.dmg = player_1.mag * 2;
        target.hp -= player.dmg;
        player.message_damage = `\`\`\`diff\n+ ${player_1.name} dealt double his magic power of damage at the cost of 300 HP !\`\`\``;
    },

    // passive for pinky
    all_or_nothing: char1 => {
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
    pill: (player_1, player) => {
        console.log('pill working');
        // pill => ATK*3 for 3 turn (CD:6)
        player_1.atk *= 3;
        player_1.skill_cd = player_1.skill_cd_max;
        player_1.skill_timer = 4;
        player.message_damage = `\`\`\`diff\n+ ${player_1.name} buffed her strength for 3 turns !\`\`\``;
    },

    // passive for dyakko
    care_taker: (player, client) => {
        // care taker => heal 10% of HP to every character in his team every turn while the character is alive and fighting
        let i;
        for (i = 0; i < player.char.length; i++) {
            player.char[i].hp *= (1 + (10 / 100));
            console.log(`Dyakko regenerated 10% of the maximum HP of ${player.char[i].name}`);
        }
        client.channel.send('Dyakko regenerated 10% of the maximum HP of all their team.');
    },

    // active for kairen
    ressurection: (player_1, target, player) => {
        // ressurection => heal a character to 100% HP (even if he is ko'ed) (CD:15)
        console.log('ressurection working');
        target.hp = target.hpmax;
        target.isAlive = true;
        player_1.skill_cd = player_1.skill_cd_max;
        player.message_damage = `\`\`\`diff\n+ ${player.char[player.active].name} ressurected ${target.name} !\`\`\``;
    },

    // function for status display
    status: client => {
        client.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                },
                fields: [{
                    name: `${gv.player1.char[gv.player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player2.char[gv.player2.active].emoji}`,
                    value: `${gv.player2.message_block} ${gv.player1.message_damage} ${gv.player2.message_dodge}`,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player1.char[gv.player1.active].emoji}`,
                    value: `${gv.player1.message_block} ${gv.player2.message_damage} ${gv.player1.message_dodge}`,
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

    // function for status display when a character dies
    statusEnd: client => {
        client.channel.send({
            embed: {
                color: 16286691,
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL,
                },
                fields: [{
                    name: `${gv.player1.char[gv.player1.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player2.char[gv.player2.active].emoji}`,
                    value: `${gv.player2.message_block} ${gv.player1.message_damage} ${gv.player2.message_dodge}`,
                },
                {
                    name: `${gv.player2.char[gv.player2.active].emoji} :crossed_swords: **DAMAGE** :arrow_right: ${gv.player1.char[gv.player1.active].emoji}`,
                    value: `${gv.player1.message_block} ${gv.player2.message_damage} ${gv.player1.message_dodge}`,
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

    // functions for turn actions
    changechar: (player, char2) => {
        const char1 = player.char[player.lastAliveChar];
        console.log(`${player.username} switched ${char1.name} with ${char2.name}`);
        player.message_damage = `${player.username} switched ${char1.name} with ${char2.name}`;
    },

    // function for when a characters dies during a turn
    omgHeDead: (player, client) => {
        func.react_KO(player, client);
        client.channel.send({
            embed: {
                color: 16286691,
                fields: [{
                    name: `**${player.char[player.lastAliveChar].emoji} ${player.char[player.lastAliveChar].name}, got K.O.'ed.**`,
                    value: `Sending ${player.char[player.futurChar].name} ${player.char[player.futurChar].emoji}`,
                } ],
                timestamp: new Date(),
            },
        });
        player.active = player.futurChar;
    },

    // function to round numbers to 2 decimals
    round: value => {
        return Number(Math.round(value + 'e2') + 'e-2');
    },

    defense: (player, otherplayer, char1, char2) => {
        if (char1.critChance > Math.floor(Math.random() * 100)) {
            player.dmg = (char1.atk * (1 - ((char2.def * otherplayer.defense_multiplier) / 100))) * char1.critMulti;
            console.log(player.dmg);
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
        } else {
            player.dmg = char1.atk * (1 - ((char2.def * otherplayer.defense_multiplier) / 100));
            console.log(player.dmg);
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
        }
        otherplayer.defense_stack = 0;
    },

    attack: (player, otherplayer, char1, char2) => {
        if (otherplayer.action !== 'defense') {
            if (char1.critChance > Math.floor(Math.random() * 100)) {
                player.dmg = (char1.atk * (1 - (char2.def / 100))) * char1.critMulti;
                if (player.dmg < 0) {
                    player.dmg = 0;
                }
                console.log(player.dmg);
                player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
            } else {
                player.dmg = char1.atk * (1 - (char2.def / 100));
                if (player.dmg < 0) {
                    player.dmg = 0;
                }
                console.log(player.dmg);
                player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
            }
            func.dodge(player, otherplayer, char2, char1);
            char2.hp -= Math.floor(player.dmg);
        } else {
            func.defense(player, otherplayer, char1, char2);
            player.message_block = (`${char2.name} multiplicated their defense for this turn by ${gv.round(otherplayer.defense_multiplier)} and only took ${Math.floor(player.dmg)} damage.`);
            if (player.dmg < 0) {
                player.dmg = 0;
            }
            char2.hp -= Math.floor(player.dmg);
        }
    },

    dodge: (player, otherplayer, char_1, char_2) => {
        if (player.action === 'attack') {
            if (char_1.dodgecd === 0) {
                let dodgeValue = 0;
                dodgeValue = (char_1.agi - char_2.acr) + 1;
                const diceroll = Math.floor(Math.random() * 10);
                if (diceroll <= 9) {
                    if (dodgeValue >= diceroll) {
                        player.dmg = 0;
                        char_1.dodgecd = gv.dodgecdMax;
                        player.message_damage = ' ';
                        otherplayer.message_dodge = (`**${char_1.name} dodged ${char_2.name}'s attack.**`);
                    } else {
                        console.log(`${char_1.name} tried to dodge ${char_2.name}'s attack but failed.`);
                    }
                } else if (diceroll === 10) {
                    player.dmg = 0;
                    char_1.dodgecd = gv.dodgecdMax;
                    player.message_damage = ' ';
                    otherplayer.message_dodge = (`${char_1.name} dodged ${char_2.name}'s attack.`);
                }
            } else {
                console.log(`${char_1.name} tried to dodge but couldn't because it is still under cooldown.`);
            }
        } else if (player.action === 'magic') {
            if (char_1.mag_dodgevalue > Math.floor(Math.random() * 100)) {
                player.dmg = 0;
                player.message_damage = ' ';
                otherplayer.message_dodge = (`${char_1.name} dodged ${char_2.name}'s magic.`);
            } else {
                console.log(`${char_1.name} tried to dodge ${char_2.name}'s magic but failed.`);
            }
        }
    },

    magic: (player, otherplayer, char1, char2, client) => {
        if (char1.magcd === 0) {
            if (char2.tier === 'H') {
                if (char1.mag_critChance > Math.floor(Math.random() * 100)) {
                    player.dmg = ((char1.mag * (1 - (char2.magdef / 100))) * char1.mag_critMulti) * 5;
                    player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
                    func.dodge(player, otherplayer, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                } else {
                    player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * 5;
                    player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
                    func.dodge(player, otherplayer, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                }
            } else if (char2.tier !== 'H') {
                if (char1.mag_critChance > Math.floor(Math.random() * 100)) {
                    player.dmg = (char1.mag * (1 - (char2.magdef / 100))) * char1.mag_critMulti;
                    player.message_damage = (`**\`\`\`diff\n- Critical Hit ! ${player.char[player.active].name} inflicts ${Math.floor(player.dmg)} damages to ${otherplayer.char[otherplayer.active].name} !\`\`\`**`);
                    func.dodge(player, otherplayer, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                } else {
                    player.dmg = char1.mag * (1 - (char2.magdef / 100));
                    player.message_damage = (`\`\`\`diff\n- ${char1.name} inflicts ${Math.floor(player.dmg)} damages to ${char2.name} !\`\`\``);
                    func.dodge(player, otherplayer, char2, char1);
                    char2.hp -= Math.floor(player.dmg);
                    console.log(player.dmg);
                    player.char[player.active].magcd = player.char[player.active].magcdmax;
                }
            }
        } else {
            client.channel.send(`${char1.name} got his cd activated and can't use magic.`);
        }
    },

    gameEnd: (winner, looser, client) => {
        func.react_KO(looser, client);
        func.react_victory(winner, client);
        client.channel.send(`**\`\`\`fix\nCongratulation to ${winner.username} !\nGAME IS OVER ! \`\`\`**`);
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
        gv.player1.message_block = ' ';
        gv.player2.message_block = ' ';
        gv.player1.message_damage = ' ';
        gv.player2.message_damage = ' ';
        gv.player1.message_dodge = ' ';
        gv.player2.message_dodge = ' ';
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
        gv.player1.dmg = 0;
        gv.player2.dmg = 0;
        gv.player1.action = '';
        gv.player2.action = '';
        gv.turn = 1;
    },

    // function for gameend
    isGameOver: (player, otherplayer, char1, client) => {
        if (char1.hp <= 0) {
            char1.hp = 0;
            char1.isAlive = false;
            if (otherplayer.id === gv.player1.id) {
                gv.p1CharDied = true;
            } else if (otherplayer.id === gv.player2.id) {
                gv.p2CharDied = true;
            } else {
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
                } else if (otherplayer.char[i].hp <= 0) {
                    if (i === (otherplayer.charAmount - 1)) {
                        console.log('No characters are alive anymore so we end the game.');
                        func.statusEnd(client);
                        func.gameEnd(player, otherplayer, client);
                        break;
                    } else {
                        console.log(`${otherplayer.char[i].name.toLowerCase().trim().replace(/\s+/g, '')} is K.O. but hey, at least the loop is not over amiright?`);
                    }
                }
            }
        } else {
            console.log(`${char1.name} is still alive.`);
        }
    },

    // function for cd reset
    reset_cd: pl => {
        let i;
        for (i = 0; i < pl.char.length; i++) {
            pl.char[i].skill_cd = 0;
            pl.char[i].magcd = 0;
            pl.char[i].dodgecd = 0;
        }
    },

    // function for cd iteration
    cd_iteration: (pl, client) => {
        let i;
        for (i = 0; i < pl.char.length; i++) {
            if (pl.char[i].magcd > 0 && pl.char[i].magcdmax >= pl.char[i].magcd) {
                pl.char[i].magcd -= 1;
            }
            if (pl.char[i].dodgecd > 0 && gv.dodgecdMax >= pl.char[i].dodgecd) {
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
                    func.remove_active_effect(pl, client);
                }
            }
        }
    },

    // function for action phase
    actionphase: (firstplayer, secondplayer, client) => {
        if (gv.actionAmount === 2) {
            func.whoIsActive(gv.player1);
            func.whoIsActive(gv.player2);
            if (firstplayer.char[firstplayer.active].spd > secondplayer.char[secondplayer.active].spd) {
                // player1.char is faster than player2.char so it's attack is done before
                if (firstplayer.action === 'changechar') {
                    func.changechar(gv.player1, gv.player1.char[gv.player1.active], gv.player1.char[gv.player1.active]);
                }
                if (firstplayer.action === 'attack') {
                    func.attack(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active]);
                    func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                }
                if (firstplayer.action === 'magic') {
                    func.magic(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active], client);
                    func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                }
                if (firstplayer.action === 'skill') {
                    func.active(gv.player1, gv.player2);
                }
                if (secondplayer.action === 'changechar') {
                    func.changechar(gv.player2, gv.player2.char[gv.player2.active], gv.player2.char[gv.player2.active]);
                }
                if (secondplayer.action === 'attack') {
                    func.attack(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                    func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                }
                if (secondplayer.action === 'magic') {
                    func.magic(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active], client);
                    func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                }
                if (secondplayer.action === 'skill') {
                    func.active(gv.player2, gv.player1);
                }
                gv.player1.choseAction = false;
                gv.player2.choseAction = false;
                gv.turnPhase = false;
                gv.actionAmount = 0;
                func.addTurn(client);
            } else if (firstplayer.char[firstplayer.active].spd < secondplayer.char[secondplayer.active].spd) {
                if (secondplayer.action === 'changechar') {
                    func.changechar(gv.player2, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                }
                if (secondplayer.action === 'attack') {
                    func.attack(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                    func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                }
                if (secondplayer.action === 'magic') {
                    func.magic(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active], client);
                    func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                }
                if (secondplayer.action === 'skill') {
                    func.active(gv.player2, gv.player1);
                }
                if (firstplayer.action === 'changechar') {
                    func.changechar(gv.player1, gv.player1.char[gv.player1.active], gv.player1.char[gv.player1.active]);
                }
                if (firstplayer.action === 'attack') {
                    func.attack(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active]);
                    func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                }
                if (firstplayer.action === 'magic') {
                    func.magic(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active], client);
                    func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                }
                if (firstplayer.action === 'skill') {
                    func.active(gv.player1, gv.player2);
                }
                gv.player1.choseAction = false;
                gv.player2.choseAction = false;
                gv.turnPhase = false;
                gv.actionAmount = 0;
                func.addTurn(client);
            } else if (firstplayer.char[firstplayer.active].spd === secondplayer.char[secondplayer.active].spd) {
                if (Math.floor(Math.random() * 2) >= 1) {
                    console.log('succesfully reached speed detection');
                    if (firstplayer.action === 'changechar') {
                        func.changechar(gv.player1, gv.player1.char[gv.player1.active], gv.player1.char[gv.player1.active]);
                    }
                    if (firstplayer.action === 'attack') {
                        func.attack(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active]);
                        func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                    }
                    if (firstplayer.action === 'magic') {
                        func.magic(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active], client);
                        func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                    }
                    if (firstplayer.action === 'skill') {
                        func.active(gv.player1, gv.player2);
                    }
                    if (secondplayer.action === 'changechar') {
                        func.changechar(gv.player2, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                    }
                    if (secondplayer.action === 'attack') {
                        func.attack(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                        func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                    }
                    if (secondplayer.action === 'magic') {
                        func.magic(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active], client);
                        func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                    }
                    if (secondplayer.action === 'skill') {
                        func.active(gv.player2, gv.player1);
                    }
                    gv.player1.choseAction = false;
                    gv.player2.choseAction = false;
                    gv.turnPhase = false;
                    gv.actionAmount = 0;
                    func.addTurn(client);
                } else {
                    if (secondplayer.action === 'changechar') {
                        func.changechar(gv.player2, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                    }
                    if (secondplayer.action === 'attack') {
                        func.attack(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active]);
                        func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                    }
                    if (secondplayer.action === 'magic') {
                        func.magic(gv.player2, gv.player1, gv.player2.char[gv.player2.active], gv.player1.char[gv.player1.active], client);
                        func.isGameOver(gv.player2, gv.player1, gv.player1.char[gv.player1.active], client);
                    }
                    if (secondplayer.action === 'skill') {
                        func.active(gv.player2, gv.player1);
                    }
                    if (firstplayer.action === 'changechar') {
                        func.changechar(gv.player1, gv.player1.char[gv.player1.active], gv.player1.char[gv.player1.active]);
                    }
                    if (firstplayer.action === 'attack') {
                        func.attack(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active]);
                        func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                    }
                    if (firstplayer.action === 'magic') {
                        func.magic(gv.player1, gv.player2, gv.player1.char[gv.player1.active], gv.player2.char[gv.player2.active], client);
                        func.isGameOver(gv.player1, gv.player2, gv.player2.char[gv.player2.active], client);
                    }
                    if (firstplayer.action === 'skill') {
                        func.active(gv.player1, gv.player2);
                    }
                    gv.player1.choseAction = false;
                    gv.player2.choseAction = false;
                    gv.turnPhase = false;
                    gv.actionAmount = 0;
                    func.addTurn(client);
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
    NewTurnPhase: client => {
        // allowing combat regen and preventing it from going past max hp and deducing cd
        if (gv.gamePhase === true && gv.turnPhase === false) {
            func.eachPlayerCharList(gv.player1, gv.player2, client);
            if (gv.p1CharDied) {
                func.omgHeDead(gv.player1, client);
                gv.p1CharDied = false;
            }
            if (gv.p2CharDied) {
                func.omgHeDead(gv.player2, client);
                gv.p2CharDied = false;
            }
            func.regen(gv.player1);
            func.regen(gv.player2);
            func.cd_iteration(gv.player1, client);
            func.cd_iteration(gv.player2, client);
            func.passive(gv.player1, gv.player2, client);
            func.passive(gv.player2, gv.player1, client);
            func.status(client);
            gv.player1.dmg = 0;
            gv.player2.dmg = 0;
            gv.player1.message_block = ' ';
            gv.player2.message_block = ' ';
            gv.player1.message_damage = ' ';
            gv.player2.message_damage = ' ';
            gv.player1.message_dodge = ' ';
            gv.player2.message_dodge = ' ';
            gv.player1.defense_stack += 1;
            gv.player2.defense_stack += 1;
            func.IsDefenseStackReset(gv.player1);
            func.IsDefenseStackReset(gv.player2);
            client.channel.send(`\`\`\`diff\nTurn ${gv.turn} has started. Chose your character's action.\`\`\``);
            gv.turnPhase = true;
            client.channel.send({
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
            client.channel.send({
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
    },

    // function for char amount
    charAmount: (amount, client) => {
        gv.player1.charAmount = amount;
        gv.player2.charAmount = amount;
        client.channel.send(`Please choose ${amount} characters each.\nChoose your characters by typing "!*character_name*".\nYou can type !list to see the list of characters.`);
        gv.gameStarting = true;
    },
};

module.exports = func;