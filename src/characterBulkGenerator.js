module.exports = function(amount) {
    const Characters = require('./character.js');
    const fs = require('fs');
    const Tiers = ['S', 'A', 'B', 'C', 'H'];
    const char = [];
    const randInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    for (let i = 0; i <= amount; i++) {
        const generatedChar = new Characters(
            Tiers[Math.floor(Math.random() * Tiers.length)],
            'placeholder',
            randInt(2000, 6000),
            randInt(500, 1000),
            1 + (Math.floor(Math.random() * 3)),
            randInt(10, 80),
            randInt(35, 85),
            randInt(3, 10),
            randInt(3, 10),
            randInt(3, 10),
            randInt(0, 2000),
            randInt(2, 15),
            randInt(20, 200),
            'Elyne',
        );
        char.push(generatedChar);
    }
    fs.writeFile('charactersBulk.json', JSON.stringify(char, undefined, 2), (err) => {
        if (err) throw err;
        console.log('Characters has successfully been saved');
    });
};