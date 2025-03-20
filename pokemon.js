// Basic Pokémon class
class Pokemon {
    constructor(name, type, level, hp, attack, defense, speed, moves) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.maxHp = hp;
        this.currentHp = hp;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.moves = moves;
        this.isWild = false;
        this.experience = 0;
    }

    attackPokemon(target, moveIndex) {
        const move = this.moves[moveIndex];
        const damage = this.calculateDamage(move, target);
        
        target.takeDamage(damage);
        
        return {
            moveName: move.name,
            damage: damage,
            effectiveness: this.getTypeEffectiveness(move.type, target.type)
        };
    }
    
    calculateDamage(move, target) {
        // Simple damage formula
        const typeEffectiveness = this.getTypeEffectiveness(move.type, target.type);
        const randomFactor = Math.random() * (1.15 - 0.85) + 0.85;
        
        let damage = Math.floor(
            ((2 * this.level / 5 + 2) * move.power * (this.attack / target.defense) / 50 + 2) 
            * typeEffectiveness * randomFactor
        );
        
        return Math.max(1, damage);
    }
    
    getTypeEffectiveness(moveType, targetType) {
        const typeChart = {
            normal: { rock: 0.5, ghost: 0 },
            fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5 },
            water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
            electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
            grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5 },
            ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2 },
            fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0 },
            poison: { grass: 2, poison: 0.5, ground: 0.5, bug: 2, rock: 0.5, ghost: 0.5 },
            ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2 },
            flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5 },
            psychic: { fighting: 2, poison: 2, psychic: 0.5 },
            bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 2, flying: 0.5, psychic: 2 },
            rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2 },
            ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2 },
            dragon: { dragon: 2 }
        };
        
        if (!typeChart[moveType] || !typeChart[moveType][targetType]) {
            return 1; // Neutral effectiveness
        }
        
        return typeChart[moveType][targetType];
    }
    
    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
        return this.currentHp;
    }
    
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
        return this.currentHp;
    }
    
    isFainted() {
        return this.currentHp <= 0;
    }
}

// Define some moves
const moves = {
    tackle: { name: "Tackle", type: "normal", power: 40, accuracy: 100 },
    scratch: { name: "Scratch", type: "normal", power: 40, accuracy: 100 },
    ember: { name: "Ember", type: "fire", power: 40, accuracy: 100 },
    waterGun: { name: "Water Gun", type: "water", power: 40, accuracy: 100 },
    vineWhip: { name: "Vine Whip", type: "grass", power: 45, accuracy: 100 },
    thunderShock: { name: "Thunder Shock", type: "electric", power: 40, accuracy: 100 },
    quickAttack: { name: "Quick Attack", type: "normal", power: 40, accuracy: 100 },
    bubble: { name: "Bubble", type: "water", power: 40, accuracy: 100 },
    razorLeaf: { name: "Razor Leaf", type: "grass", power: 55, accuracy: 95 },
    flamethrower: { name: "Flamethrower", type: "fire", power: 90, accuracy: 100 },
    hydroPump: { name: "Hydro Pump", type: "water", power: 110, accuracy: 80 },
    solarBeam: { name: "Solar Beam", type: "grass", power: 120, accuracy: 100 },
    thunder: { name: "Thunder", type: "electric", power: 110, accuracy: 70 },
    bodySlam: { name: "Body Slam", type: "normal", power: 85, accuracy: 100 },
    surf: { name: "Surf", type: "water", power: 90, accuracy: 100 },
    iceBeam: { name: "Ice Beam", type: "ice", power: 90, accuracy: 100 },
    blizzard: { name: "Blizzard", type: "ice", power: 110, accuracy: 70 },
    psychic: { name: "Psychic", type: "psychic", power: 90, accuracy: 100 },
    earthquake: { name: "Earthquake", type: "ground", power: 100, accuracy: 100 },
    rockSlide: { name: "Rock Slide", type: "rock", power: 75, accuracy: 90 },
    fireBlast: { name: "Fire Blast", type: "fire", power: 120, accuracy: 85 },
    hydroCannon: { name: "Hydro Cannon", type: "water", power: 150, accuracy: 90 },
    frenzyPlant: { name: "Frenzy Plant", type: "grass", power: 150, accuracy: 90 },
    voltTackle: { name: "Volt Tackle", type: "electric", power: 120, accuracy: 100 },
    shadowBall: { name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100 },
    dragonClaw: { name: "Dragon Claw", type: "dragon", power: 80, accuracy: 100 },
    ironTail: { name: "Iron Tail", type: "steel", power: 100, accuracy: 75 },
    aerialAce: { name: "Aerial Ace", type: "flying", power: 60, accuracy: 100 },
    bugBuzz: { name: "Bug Buzz", type: "bug", power: 90, accuracy: 100 },
    poisonJab: { name: "Poison Jab", type: "poison", power: 80, accuracy: 100 },
    rockTomb: { name: "Rock Tomb", type: "rock", power: 60, accuracy: 95 },
    darkPulse: { name: "Dark Pulse", type: "dark", power: 80, accuracy: 100 },
    fairyWind: { name: "Fairy Wind", type: "fairy", power: 40, accuracy: 100 },
    moonblast: { name: "Moonblast", type: "fairy", power: 95, accuracy: 100 },
    dragonPulse: { name: "Dragon Pulse", type: "dragon", power: 85, accuracy: 100 },
    thunderbolt: { name: "Thunderbolt", type: "electric", power: 90, accuracy: 100 },
    flameCharge: { name: "Flame Charge", type: "fire", power: 50, accuracy: 100 },
    aquaJet: { name: "Aqua Jet", type: "water", power: 40, accuracy: 100 },
    leafBlade: { name: "Leaf Blade", type: "grass", power: 90, accuracy: 100 },
    bite: { name: "Bite", type: "dark", power: 60, accuracy: 100 },
    crunch: { name: "Crunch", type: "dark", power: 80, accuracy: 100 },
    swift: { name: "Swift", type: "normal", power: 60, accuracy: 100 },
    absorb: { name: "Absorb", type: "grass", power: 20, accuracy: 100 },
    sleepPowder: { name: "Sleep Powder", type: "grass", power: 0, accuracy: 75 },
    moonlight: { name: "Moonlight", type: "fairy", power: 0, accuracy: 100 },
    sludgeBomb: { name: "Sludge Bomb", type: "poison", power: 90, accuracy: 100 },
    gigaDrain: { name: "Giga Drain", type: "grass", power: 75, accuracy: 100 },
    sludge: { name: "Sludge", type: "poison", power: 65, accuracy: 100 },
    knockOff: { name: "Knock Off", type: "dark", power: 65, accuracy: 100 },
    sonicBoom: { name: "Sonic Boom", type: "normal", power: 20, accuracy: 90 },
    flashCannon: { name: "Flash Cannon", type: "steel", power: 80, accuracy: 100 },
    mirrorShot: { name: "Mirror Shot", type: "steel", power: 65, accuracy: 85 },
    discharge: { name: "Discharge", type: "electric", power: 80, accuracy: 100 },
    thunderPunch: { name: "Thunder Punch", type: "electric", power: 75, accuracy: 100 },
    icePunch: { name: "Ice Punch", type: "ice", power: 75, accuracy: 100 },
    focusBlast: { name: "Focus Blast", type: "fighting", power: 120, accuracy: 70 },
    teleport: { name: "Teleport", type: "psychic", power: 0, accuracy: 100 },
    confusion: { name: "Confusion", type: "psychic", power: 50, accuracy: 100 },
    calmmind: { name: "Calm Mind", type: "psychic", power: 0, accuracy: 100 },
    energyBall: { name: "Energy Ball", type: "grass", power: 90, accuracy: 100 },
    dazzlingGleam: { name: "Dazzling Gleam", type: "fairy", power: 80, accuracy: 100 },
    pound: { name: "Pound", type: "normal", power: 40, accuracy: 100 },
    hypnosis: { name: "Hypnosis", type: "psychic", power: 0, accuracy: 60 },
    firePunch: { name: "Fire Punch", type: "fire", power: 75, accuracy: 100 },
    earthPower: { name: "Earth Power", type: "ground", power: 90, accuracy: 100 },
    poisonPowder: { name: "Poison Powder", type: "poison", power: 0, accuracy: 75 },
    stunSpore: { name: "Stun Spore", type: "grass", power: 0, accuracy: 75 },
    growth: { name: "Growth", type: "normal", power: 0, accuracy: 100 },
    leechSeed: { name: "Leech Seed", type: "grass", power: 0, accuracy: 90 },
    waterPulse: { name: "Water Pulse", type: "water", power: 60, accuracy: 100 },
    bubbleBeam: { name: "Bubble Beam", type: "water", power: 65, accuracy: 100 },
    electroBall: { name: "Electro Ball", type: "electric", power: 60, accuracy: 100 },
    spark: { name: "Spark", type: "electric", power: 65, accuracy: 100 },
    flameBurst: { name: "Flame Burst", type: "fire", power: 70, accuracy: 100 },
    heatWave: { name: "Heat Wave", type: "fire", power: 95, accuracy: 90 },
    magicalLeaf: { name: "Magical Leaf", type: "grass", power: 60, accuracy: 100 },
    seedBomb: { name: "Seed Bomb", type: "grass", power: 80, accuracy: 100 },
    psybeam: { name: "Psybeam", type: "psychic", power: 65, accuracy: 100 },
    zenHeadbutt: { name: "Zen Headbutt", type: "psychic", power: 80, accuracy: 90 },
    rockThrow: { name: "Rock Throw", type: "rock", power: 50, accuracy: 90 },
    ancientPower: { name: "Ancient Power", type: "rock", power: 60, accuracy: 100 },
    wingAttack: { name: "Wing Attack", type: "flying", power: 60, accuracy: 100 },
    airSlash: { name: "Air Slash", type: "flying", power: 75, accuracy: 95 },
    mudShot: { name: "Mud Shot", type: "ground", power: 55, accuracy: 95 },
    mudBomb: { name: "Mud Bomb", type: "ground", power: 65, accuracy: 85 },
    bugBite: { name: "Bug Bite", type: "bug", power: 60, accuracy: 100 },
    xScissor: { name: "X-Scissor", type: "bug", power: 80, accuracy: 100 },
    dragonBreath: { name: "Dragon Breath", type: "dragon", power: 60, accuracy: 100 },
    dragonRage: { name: "Dragon Rage", type: "dragon", power: 40, accuracy: 100 },
    metalClaw: { name: "Metal Claw", type: "steel", power: 50, accuracy: 95 },
    steelWing: { name: "Steel Wing", type: "steel", power: 70, accuracy: 90 },
    foulPlay: { name: "Foul Play", type: "dark", power: 95, accuracy: 100 },
    snarl: { name: "Snarl", type: "dark", power: 55, accuracy: 95 },
    playRough: { name: "Play Rough", type: "fairy", power: 90, accuracy: 90 },
    drainingKiss: { name: "Draining Kiss", type: "fairy", power: 50, accuracy: 100 },
    lick: { name: "Lick", type: "ghost", power: 30, accuracy: 100 },
    dreamEater: { name: "Dream Eater", type: "psychic", power: 100, accuracy: 100 },
    explosion: { name: "Explosion", type: "normal", power: 250, accuracy: 100 },
    lastResort: { name: "Last Resort", type: "normal", power: 140, accuracy: 100 }
};

// Define some starter Pokémon with more moves
const pokemonData = {
    bulbasaur: {
        id: 1,
        name: "Bulbasaur",
        type: "grass",
        baseHp: 45,
        baseAttack: 49,
        baseDefense: 49,
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        backSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
        moves: [moves.tackle, moves.vineWhip, moves.razorLeaf, moves.solarBeam],
        learnableMoves: [moves.bodySlam, moves.leafBlade, moves.poisonJab, moves.frenzyPlant],
        evolution: "ivysaur",
        evolutionLevel: 16
    },
    charmander: {
        id: 4,
        name: "Charmander",
        type: "fire",
        baseStats: { hp: 39, attack: 52, defense: 43, speed: 65 },
        moves: [moves.scratch, moves.ember, moves.flamethrower, moves.bodySlam],
        learnableMoves: [moves.fireBlast, moves.dragonClaw, moves.flameCharge, moves.ironTail]
    },
    squirtle: {
        id: 7,
        name: "Squirtle",
        type: "water",
        baseStats: { hp: 44, attack: 48, defense: 65, speed: 43 },
        moves: [moves.tackle, moves.waterGun, moves.bubble, moves.surf],
        learnableMoves: [moves.iceBeam, moves.hydroCannon, moves.aquaJet, moves.ironTail]
    },
    pikachu: {
        id: 25,
        name: "Pikachu",
        type: "electric",
        baseStats: { hp: 35, attack: 55, defense: 40, speed: 90 },
        moves: [moves.quickAttack, moves.thunderShock, moves.bodySlam, moves.thunder],
        learnableMoves: [moves.voltTackle, moves.ironTail, moves.thunderbolt, moves.surf]
    },
    growlithe: {
        id: 58,
        name: "Growlithe",
        type: "fire",
        baseStats: { hp: 55, attack: 70, defense: 45, speed: 60 },
        moves: [moves.bite, moves.ember, moves.flameCharge, moves.bodySlam],
        learnableMoves: [moves.flamethrower, moves.fireBlast, moves.ironTail, moves.crunch]
    },
    vulpix: {
        id: 37,
        name: "Vulpix",
        type: "fire",
        baseStats: { hp: 38, attack: 41, defense: 40, speed: 65 },
        moves: [moves.quickAttack, moves.ember, moves.flamethrower, moves.darkPulse],
        learnableMoves: [moves.fireBlast, moves.energyBall, moves.shadowBall, moves.ironTail]
    },
    staryu: {
        id: 120,
        name: "Staryu",
        type: "water",
        baseStats: { hp: 30, attack: 45, defense: 55, speed: 85 },
        moves: [moves.tackle, moves.waterGun, moves.swift, moves.psychic],
        learnableMoves: [moves.hydroPump, moves.iceBeam, moves.thunderbolt, moves.surf]
    },
    poliwag: {
        id: 60,
        name: "Poliwag",
        type: "water",
        baseStats: { hp: 40, attack: 50, defense: 40, speed: 90 },
        moves: [moves.bubble, moves.waterGun, moves.bodySlam, moves.iceBeam],
        learnableMoves: [moves.hydroPump, moves.surf, moves.psychic, moves.earthPower]
    },
    oddish: {
        id: 43,
        name: "Oddish",
        type: "grass",
        baseStats: { hp: 45, attack: 50, defense: 55, speed: 30 },
        moves: [moves.absorb, moves.razorLeaf, moves.sleepPowder, moves.moonlight],
        learnableMoves: [moves.solarBeam, moves.sludgeBomb, moves.moonblast, moves.gigaDrain]
    },
    bellsprout: {
        id: 69,
        name: "Bellsprout",
        type: "grass",
        baseStats: { hp: 50, attack: 75, defense: 35, speed: 40 },
        moves: [moves.vineWhip, moves.razorLeaf, moves.sleepPowder, moves.sludge],
        learnableMoves: [moves.solarBeam, moves.sludgeBomb, moves.knockOff, moves.gigaDrain]
    },
    magnemite: {
        id: 81,
        name: "Magnemite",
        type: "electric",
        baseStats: { hp: 25, attack: 35, defense: 70, speed: 45 },
        moves: [moves.tackle, moves.thunderShock, moves.sonicBoom, moves.thunderbolt],
        learnableMoves: [moves.thunder, moves.flashCannon, moves.mirrorShot, moves.discharge]
    },
    electabuzz: {
        id: 125,
        name: "Electabuzz",
        type: "electric",
        baseStats: { hp: 65, attack: 83, defense: 57, speed: 105 },
        moves: [moves.quickAttack, moves.thunderPunch, moves.thunderbolt, moves.icePunch],
        learnableMoves: [moves.thunder, moves.focusBlast, moves.psychic, moves.voltTackle]
    },
    abra: {
        id: 63,
        name: "Abra",
        type: "psychic",
        baseStats: { hp: 25, attack: 20, defense: 15, speed: 90 },
        moves: [moves.teleport, moves.confusion, moves.psychic, moves.shadowBall],
        learnableMoves: [moves.calmmind, moves.energyBall, moves.dazzlingGleam, moves.focusBlast]
    },
    drowzee: {
        id: 96,
        name: "Drowzee",
        type: "psychic",
        baseStats: { hp: 60, attack: 48, defense: 45, speed: 42 },
        moves: [moves.pound, moves.confusion, moves.hypnosis, moves.psychic],
        learnableMoves: [moves.shadowBall, moves.thunderPunch, moves.icePunch, moves.firePunch]
    },
    jigglypuff: {
        id: 39,
        name: "Jigglypuff",
        type: "fairy",
        baseStats: { hp: 115, attack: 45, defense: 20, speed: 20 },
        moves: [moves.pound, moves.bodySlam, moves.fairyWind, moves.moonblast],
        learnableMoves: [moves.playRough, moves.drainingKiss, moves.psychic, moves.iceBeam]
    },
    geodude: {
        id: 74,
        name: "Geodude",
        type: "rock",
        baseStats: { hp: 40, attack: 80, defense: 100, speed: 20 },
        moves: [moves.tackle, moves.rockThrow, moves.rockSlide, moves.earthquake],
        learnableMoves: [moves.ancientPower, moves.rockTomb, moves.earthPower, moves.explosion]
    },
    gastly: {
        id: 92,
        name: "Gastly",
        type: "ghost",
        baseStats: { hp: 30, attack: 35, defense: 30, speed: 80 },
        moves: [moves.lick, moves.shadowBall, moves.darkPulse, moves.sludgeBomb],
        learnableMoves: [moves.hypnosis, moves.dreamEater, moves.psychic, moves.thunderbolt]
    },
    eevee: {
        id: 133,
        name: "Eevee",
        type: "normal",
        baseStats: { hp: 55, attack: 55, defense: 50, speed: 55 },
        moves: [moves.tackle, moves.quickAttack, moves.bite, moves.bodySlam],
        learnableMoves: [moves.swift, moves.shadowBall, moves.ironTail, moves.lastResort]
    }
};

// Function to create a Pokémon instance
function createPokemon(pokemonName, level) {
    const pokemon = pokemonData[pokemonName.toLowerCase()];
    if (!pokemon) return null;
    
    // Calculate stats based on level
    const hp = Math.floor((pokemon.baseStats.hp * 2 * level) / 100 + level + 10);
    const attack = Math.floor((pokemon.baseStats.attack * 2 * level) / 100 + 5);
    const defense = Math.floor((pokemon.baseStats.defense * 2 * level) / 100 + 5);
    const speed = Math.floor((pokemon.baseStats.speed * 2 * level) / 100 + 5);
    
    return new Pokemon(
        pokemon.name,
        pokemon.type,
        level,
        hp,
        attack,
        defense,
        speed,
        pokemon.moves
    );
}

// Function to create a random wild Pokémon
function createWildPokemon(minLevel = 2, maxLevel = 5) {
    const pokemonNames = Object.keys(pokemonData);
    const randomPokemon = pokemonNames[Math.floor(Math.random() * pokemonNames.length)];
    const level = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    
    const pokemon = createPokemon(randomPokemon, level);
    pokemon.isWild = true;
    
    return pokemon;
} 