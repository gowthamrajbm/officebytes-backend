class Game {
    static calculateEntryFee(pricing) {
        if (pricing && typeof pricing == 'object') {
            return pricing['entry-fee'];
        }

        return 100;
    }
}

module.exports = Game;