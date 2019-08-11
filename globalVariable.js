const globalVariable = {
    actionAmount: 0,
    turn: 1,
    gamePhase: false,
    turnPhase: false,
    gameStarting: false,
    playerCount: 0,
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
        charAmount: 1,
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
        charAmount: 1,
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