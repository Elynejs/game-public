module.exports = class Player {
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.active = 0;
        this.futurChar = 0;
        this.lastAliveChar = 0;
        this.charAmount = 1;
        this.choseChar = false;
        this.choseAction = false;
        this.dmg = 0;
        this.char = [];
        this.action = '';
        this.defense_stack = 2;
        this.defense_multiplier = 2;
        this.message_damage = ' ';
        this.message_dodge = ' ';
        this.message_block = ' ';
    }
};