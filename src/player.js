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
        this.defenseStack = 2;
        this.defenseMultiplier = 2;
        this.messageDamage = ' ';
        this.messageDodge = ' ';
        this.messageBlock = ' ';
        this.gamesPlayed = 0;
        this.gamesWon = 0;
        this.gamesLost = 0;
        this.totalDamages = 0;
        this.totalTurns = 0;
        this.totalAttacks = 0;
        this.totalDefenses = 0;
        this.totalSkills = 0;
        this.totalMagics = 0;
        this.totalDodges = 0;
    }
};