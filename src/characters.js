module.exports = class Characters {
    constructor(tier, name, hp, atk, critMulti, critChance, def, spd, agi, acr, mag, magcd, rgn) {
        this.tier = tier;
        this.name = name;
        this.hpmax = hp;
        this.hp = hp;
        this.atk = atk;
        this.critMulti = critMulti;
        this.critChance = critChance;
        this.def = def;
        this.spd = spd;
        this.agi = agi;
        this.acr = acr;
        this.int = 140;
        this.mag = mag;
        this.magcd = magcd;
        this.magdef = 0;
        this.magCritChance = 0;
        this.magCritMulti = 1;
        this.magDodgevalue = 0;
        this.magcdmax = magcd;
        this.dodgecd = 2;
        this.rgn = rgn;
        this.reactSelection = ['undefined'];
        this.reactKo = ['undefined'];
        this.reactVictory = ['undefined'];
        this.emoji = '<:undefined:597308733026205706>';
        this.emojiKo = '<:undefined_KO:605139762084315137>';
        this.ico = 'https://i.imgur.com/7jVkvUT.png';
        this.hasActiveSkill = false;
        this.hasPassiveSkill = false;
        this.skillCd = 0;
        this.skillCdMax = 0;
        this.skillTimer = 0;
        this.isActive = false;
        this.isAlive = true;
        this.receivedPassiveFromGold = false;
        this.receivedPassiveFromAyddan = false;
    }

    reactSelection() {
        return `${this.emoji} ${this.reactSelection[Math.floor(Math.random() * this.reactSelection.length)]}`;
    }

    reactKo() {
        return `${this.emoji} ${this.reactKo[Math.floor(Math.random() * this.reactKo.length)]}`;
    }

    reactVictory() {
        return `${this.emoji} ${this.reactVictory[Math.floor(Math.random() * this.reactVictory.length)]}`;
    }
};
