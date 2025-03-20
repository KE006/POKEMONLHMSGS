// Game state
const gameState = {
    playerPokemon: null,
    enemyPokemon: null,
    isBattleActive: false,
    playerTurn: true,
    battleLog: [],
    caughtPokemon: [],
    expToNextLevel: {
        // Experience needed for each level (follows a curve similar to Pokémon games)
        1: 0, 2: 15, 3: 37, 4: 70, 5: 115, 6: 169, 7: 231, 8: 305, 
        9: 384, 10: 474, 11: 569, 12: 672, 13: 781, 14: 897, 15: 1018
    },
    playerExp: 0,
    pokemonTeam: [], // Array to store the player's team
    hasFaintedPokemon: false,
    gameMode: null, // 'wild' or 'tournament'
    tournamentProgress: {
        defeatedTrainers: [],
        badges: 0,
        currentOpponent: null
    }
};

// DOM elements
const elements = {
    playerName: document.getElementById('player-name'),
    playerLevel: document.getElementById('player-level'),
    playerCurrentHp: document.getElementById('player-current-hp'),
    playerMaxHp: document.getElementById('player-max-hp'),
    playerHpBar: document.getElementById('player-hp-bar'),
    playerSprite: document.getElementById('player-sprite'),
    
    enemyName: document.getElementById('enemy-name'),
    enemyLevel: document.getElementById('enemy-level'),
    enemyCurrentHp: document.getElementById('enemy-current-hp'),
    enemyMaxHp: document.getElementById('enemy-max-hp'),
    enemyHpBar: document.getElementById('enemy-hp-bar'),
    enemySprite: document.getElementById('enemy-sprite'),
    
    battleMessage: document.getElementById('battle-message'),
    
    attackBtn: document.getElementById('attack-btn'),
    specialBtn: document.getElementById('special-btn'),
    healBtn: document.getElementById('heal-btn'),
    catchBtn: document.getElementById('catch-btn'),
    pokeball: document.getElementById('pokeball'),
    attackEffect: document.getElementById('attack-effect'),
    battleScene: document.querySelector('.battle-scene'),
    movesMenu: document.getElementById('moves-menu'),
    backButton: document.getElementById('back-button'),
    battleOverlay: document.getElementById('battle-overlay'),
    victoryEffects: document.getElementById('victory-effects'),
    starterSelection: document.getElementById('starter-selection'),
    starterOptions: document.querySelectorAll('.starter-option'),
    playerExpBar: document.getElementById('player-exp-bar'),
    inventoryPanel: document.getElementById('inventory-panel'),
    pokemonTeam: document.getElementById('pokemon-team'),
    closeInventory: document.getElementById('close-inventory'),
    inventoryBtn: document.getElementById('inventory-btn'),
    gameContainer: document.querySelector('.game-container'),
    startPanel: document.getElementById('start-panel'),
    startGameBtn: document.getElementById('start-game-btn'),
    battleResults: document.createElement('div'),
    nextButton: document.createElement('button'),
    spaceHint: document.createElement('div')
};

// Update the sound system with more reliable sources
const sounds = {
    // Use short, reliable sound files from GitHub
    battleStart: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    attack: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    hit: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    superEffective: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    notEffective: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    victory: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    catch: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    catchSuccess: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    catchFail: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    levelUp: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    menuOpen: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    shiny: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    healing: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3'),
    faint: new Audio('https://raw.githubusercontent.com/101arrowz/fomantic-ui-assets/master/sounds/click.mp3')
};

// Add dialogue queue and state
const dialogueSystem = {
    messageQueue: [],
    isTyping: false,
    typingSpeed: 30,
    waitForInput: false
};

// Add type effectiveness chart
const typeEffectiveness = {
    normal: {
        rock: 0.5,
        ghost: 0,
        steel: 0.5
    },
    fire: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 2,
        bug: 2,
        rock: 0.5,
        dragon: 0.5,
        steel: 2
    },
    water: {
        fire: 2,
        water: 0.5,
        grass: 0.5,
        ground: 2,
        rock: 2,
        dragon: 0.5
    },
    electric: {
        water: 2,
        electric: 0.5,
        grass: 0.5,
        ground: 0,
        flying: 2,
        dragon: 0.5
    },
    grass: {
        fire: 0.5,
        water: 2,
        grass: 0.5,
        poison: 0.5,
        ground: 2,
        flying: 0.5,
        bug: 0.5,
        rock: 2,
        dragon: 0.5,
        steel: 0.5
    },
    ice: {
        fire: 0.5,
        water: 0.5,
        grass: 2,
        ice: 0.5,
        ground: 2,
        flying: 2,
        dragon: 2,
        steel: 0.5
    },
    fighting: {
        normal: 2,
        ice: 2,
        poison: 0.5,
        flying: 0.5,
        psychic: 0.5,
        bug: 0.5,
        rock: 2,
        ghost: 0,
        dark: 2,
        steel: 2,
        fairy: 0.5
    },
    poison: {
        grass: 2,
        poison: 0.5,
        ground: 0.5,
        rock: 0.5,
        ghost: 0.5,
        steel: 0,
        fairy: 2
    },
    ground: {
        fire: 2,
        electric: 2,
        grass: 0.5,
        poison: 2,
        flying: 0,
        bug: 0.5,
        rock: 2,
        steel: 2
    },
    flying: {
        electric: 0.5,
        grass: 2,
        fighting: 2,
        bug: 2,
        rock: 0.5,
        steel: 0.5
    },
    psychic: {
        fighting: 2,
        poison: 2,
        psychic: 0.5,
        dark: 0,
        steel: 0.5
    },
    bug: {
        fire: 0.5,
        grass: 2,
        fighting: 0.5,
        poison: 0.5,
        flying: 0.5,
        psychic: 2,
        ghost: 0.5,
        dark: 2,
        steel: 0.5,
        fairy: 0.5
    },
    rock: {
        fire: 2,
        ice: 2,
        fighting: 0.5,
        ground: 0.5,
        flying: 2,
        bug: 2,
        steel: 0.5
    },
    ghost: {
        normal: 0,
        psychic: 2,
        ghost: 2,
        dark: 0.5
    },
    dragon: {
        dragon: 2,
        steel: 0.5,
        fairy: 0
    },
    dark: {
        fighting: 0.5,
        psychic: 2,
        ghost: 2,
        dark: 0.5,
        fairy: 0.5
    },
    steel: {
        fire: 0.5,
        water: 0.5,
        electric: 0.5,
        ice: 2,
        rock: 2,
        steel: 0.5,
        fairy: 2
    },
    fairy: {
        fire: 0.5,
        fighting: 2,
        poison: 0.5,
        dragon: 2,
        dark: 2,
        steel: 0.5
    }
};

// Improve the playSound function to better handle errors
function playSound(sound) {
    try {
        // Only try to play if the sound exists and is loaded
        if (sound && sound.readyState >= 2) {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.log("Audio play failed:", error);
                // Silent fail
            });
        } else {
            // If sound isn't loaded, try to load it first
            sound.addEventListener('canplaythrough', () => {
                sound.play().catch(e => console.log("Audio play failed after loading:", e));
            }, { once: true });
        }
    } catch (e) {
        console.log("Error playing sound:", e);
    }
}

// Initialize the game
function initGame() {
    // Create all starter Pokémon
    const squirtle = createPokemon('squirtle', 5);
    const pikachu = createPokemon('pikachu', 5);
    const charmander = createPokemon('charmander', 5);
    
    // Add them to the team
    gameState.pokemonTeam = [squirtle, pikachu, charmander];
    
    // Set the first Pokémon as active
    gameState.playerPokemon = gameState.pokemonTeam[0];
    
    // Hide starter selection and show game
    elements.starterSelection.style.display = 'none';
    elements.gameContainer.style.display = 'flex';
    
    // Add event listeners for battle actions
    elements.attackBtn.addEventListener('click', showMovesMenu);
    elements.specialBtn.addEventListener('click', () => handlePlayerAction('special'));
    elements.healBtn.addEventListener('click', () => handlePlayerAction('heal'));
    elements.catchBtn.addEventListener('click', () => handlePlayerAction('catch'));
    elements.backButton.addEventListener('click', hideMovesMenu);
    
    // Add event listeners for inventory
    elements.inventoryBtn.addEventListener('click', toggleInventory);
    elements.closeInventory.addEventListener('click', toggleInventory);
    
    // Add keyboard shortcut for inventory (press 'e')
    document.addEventListener('keydown', (e) => {
        if (e.key === 'e' || e.key === 'E') {
            toggleInventory();
        }
    });
    
    // Add space key handler to advance dialogue
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (dialogueSystem.isTyping) {
                // Skip typing animation
                const currentMessage = dialogueSystem.messageQueue[0];
                elements.battleMessage.textContent = currentMessage.text;
                dialogueSystem.isTyping = false;
                return;
            }
            
            // Only advance if we're waiting for input
            if (dialogueSystem.waitForInput && dialogueSystem.messageQueue.length > 0) {
                dialogueSystem.messageQueue.shift();
                showNextMessage();
            }
        }
    });
    
    // Add space key hint
    elements.spaceHint.className = 'key-hint space-hint';
    elements.spaceHint.textContent = 'Press SPACE to continue dialogue';
    document.body.appendChild(elements.spaceHint);
    
    // Add the next button to the battle text area
    const battleText = document.querySelector('.battle-text');
    battleText.appendChild(elements.nextButton);
    
    // Start the appropriate game mode
    if (gameState.gameMode === 'tournament') {
        showTournamentPanel();
    } else {
        startWildBattle();
    }
}

// Function to toggle the inventory panel
function toggleInventory() {
    const inventoryPanel = elements.inventoryPanel;
    
    if (inventoryPanel.style.display === 'block') {
        // Close inventory
        inventoryPanel.style.display = 'none';
    } else {
        // Open inventory
        inventoryPanel.style.display = 'block';
        
        // Clear existing team display
        elements.pokemonTeam.innerHTML = '';
        
        // Check if we're in a battle with a fainted Pokémon
        const isSwitchingFainted = gameState.hasFaintedPokemon;
        
        // Display each Pokémon in the team
        gameState.pokemonTeam.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon-card';
            
            // Add disabled class if Pokémon has fainted
            if (pokemon.currentHp <= 0) {
                pokemonCard.classList.add('fainted');
            }
            
            // Ensure sprite URL is valid
            const spriteUrl = pokemon.sprite || 
                             `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.name)}.png`;
            
            pokemonCard.innerHTML = `
                <img src="${spriteUrl}" alt="${pokemon.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <div class="pokemon-info">
                    <div class="name-level">
                        <span>${pokemon.name}</span>
                        <span>Lv.${pokemon.level}</span>
                    </div>
                    <div class="hp-bar">
                        <div class="hp-fill" style="width: ${(pokemon.currentHp / pokemon.maxHp) * 100}%"></div>
                    </div>
                    <div class="hp-text">
                        HP: ${pokemon.currentHp}/${pokemon.maxHp}
                    </div>
                    <div class="type-badge ${pokemon.type}">${pokemon.type}</div>
                </div>
            `;
            
            // Add click event only if Pokémon has HP and isn't already active
            if (pokemon.currentHp > 0 && pokemon !== gameState.playerPokemon) {
                pokemonCard.addEventListener('click', () => {
                    // Switch to this Pokémon
                    switchPokemon(pokemon);
                    
                    // Close inventory
                    inventoryPanel.style.display = 'none';
                    
                    // If we're switching due to a fainted Pokémon in battle
                    if (isSwitchingFainted && gameState.isBattleActive) {
                        gameState.hasFaintedPokemon = false;
                        
                        // Enemy gets a free attack after switch
                        setTimeout(() => {
                            handleEnemyTurn();
                        }, 1500);
                    }
                });
            } else if (pokemon === gameState.playerPokemon) {
                pokemonCard.classList.add('active');
            }
            
            elements.pokemonTeam.appendChild(pokemonCard);
        });
    }
}

// Add a function to switch the active Pokémon
function switchPokemon(newPokemon) {
    // Update the active Pokémon
    gameState.playerPokemon = newPokemon;
    
    // Update the UI
    updateBattleUI();
    
    // Show switch message
    queueMessage(`Go, ${newPokemon.name}!`);
    
    // Play switch sound
    playSound(sounds.menuOpen);
}

// Function to update the team UI in the inventory
function updateTeamUI() {
    // Clear existing team UI
    elements.pokemonTeam.innerHTML = '';
    
    // Add each Pokémon to the team UI
    gameState.pokemonTeam.forEach((pokemon, index) => {
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'team-pokemon';
        
        if (pokemon === gameState.playerPokemon) {
            pokemonElement.classList.add('active');
        }
        
        const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
        
        pokemonElement.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.name)}.png" alt="${pokemon.name}">
            <div class="team-pokemon-info">
                <div class="team-pokemon-name">${pokemon.name}</div>
                <div class="team-pokemon-level">Lv.${pokemon.level}</div>
                <div class="team-pokemon-hp">HP: ${pokemon.currentHp}/${pokemon.maxHp}</div>
                <div class="team-pokemon-hp-bar">
                    <div class="team-pokemon-hp-fill" style="width: ${hpPercentage}%; background-color: ${getHpColor(hpPercentage)}"></div>
                </div>
            </div>
        `;
        
        // Add click event to switch active Pokémon
        pokemonElement.addEventListener('click', () => {
            switchActivePokemon(index);
        });
        
        elements.pokemonTeam.appendChild(pokemonElement);
    });
}

// Function to switch the active Pokémon
function switchActivePokemon(index) {
    if (!gameState.isBattleActive || !gameState.playerTurn) {
        elements.battleMessage.textContent = "You can't switch Pokémon right now!";
        return;
    }
    
    const newActivePokemon = gameState.pokemonTeam[index];
    
    // Don't switch if it's the same Pokémon or if it's fainted
    if (newActivePokemon === gameState.playerPokemon || newActivePokemon.isFainted()) {
        return;
    }
    
    // Switch the active Pokémon
    gameState.playerPokemon = newActivePokemon;
    
    // Update the UI
    updateBattleUI();
    updateTeamUI();
    
    // Close the inventory
    elements.inventoryPanel.style.display = 'none';
    
    // Show switch message
    elements.battleMessage.textContent = `Go, ${gameState.playerPokemon.name}!`;
    
    // End player's turn
    gameState.playerTurn = false;
    
    // Enemy's turn after a delay
    setTimeout(() => {
        enemyTurn();
    }, 1500);
}

// Helper function to get HP color based on percentage
function getHpColor(percentage) {
    if (percentage > 50) {
        return '#4CAF50'; // Green
    } else if (percentage > 20) {
        return '#FFC107'; // Yellow
    } else {
        return '#F44336'; // Red
    }
}

// Start a battle with a wild Pokémon
function startWildBattle() {
    // Create a wild Pokémon
    gameState.enemyPokemon = createWildPokemon(
        Math.max(1, gameState.playerPokemon.level - 2),
        gameState.playerPokemon.level + 2
    );
    
    // 1/512 chance of being shiny
    const isShiny = Math.random() < 0.002;
    if (isShiny) {
        gameState.enemyPokemon.isShiny = true;
        playSound(sounds.shiny);
        
        // Create sparkle effect
        createSparkles();
    }
    
    // Play battle start sound
    playSound(sounds.battleStart);
    
    // Reset battle state
    gameState.isBattleActive = true;
    gameState.playerTurn = true;
    
    // Make sure enemy sprite is visible and reset its animation
    elements.enemySprite.style.display = 'block';
    elements.enemySprite.style.animation = '';
    
    // Update the sprite source for the new Pokémon (use shiny sprite if shiny)
    const spriteNumber = getPokemonId(gameState.enemyPokemon.name);
    elements.enemySprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isShiny ? 'shiny/' : ''}${spriteNumber}.png`;
    
    // Update the UI
    updateBattleUI();
    
    // Show special message for shiny Pokémon
    if (isShiny) {
        queueMessage(`Oh my! A shiny ${gameState.enemyPokemon.name} appeared!`, null, true);
    } else {
        queueMessage(`A wild ${gameState.enemyPokemon.name} appeared!`, null, true);
    }
    queueMessage(`What will ${gameState.playerPokemon.name} do?`);
}

// Add sparkle effect function
function createSparkles() {
    const battleScene = elements.battleScene;
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        battleScene.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), 3000);
    }
}

// Update the battle UI
function updateBattleUI() {
    if (!gameState.isBattleActive) return;
    
    // Update player Pokémon info
    if (elements.playerName) elements.playerName.textContent = gameState.playerPokemon.name;
    if (elements.playerLevel) elements.playerLevel.textContent = `Lv.${gameState.playerPokemon.level}`;
    
    // Ensure HP values are numbers
    const playerCurrentHp = Number(gameState.playerPokemon.currentHp) || 0;
    const playerMaxHp = Number(gameState.playerPokemon.maxHp) || 1;
    
    if (elements.playerCurrentHp) elements.playerCurrentHp.textContent = playerCurrentHp;
    if (elements.playerMaxHp) elements.playerMaxHp.textContent = playerMaxHp;
    
    // Update player HP bar
    if (elements.playerHpBar) {
        const playerHpPercent = (playerCurrentHp / playerMaxHp) * 100;
        elements.playerHpBar.style.width = `${playerHpPercent}%`;
        
        // Change color based on HP percentage
        if (playerHpPercent < 20) {
            elements.playerHpBar.style.backgroundColor = '#ff4444';
        } else if (playerHpPercent < 50) {
            elements.playerHpBar.style.backgroundColor = '#ffaa33';
        } else {
            elements.playerHpBar.style.backgroundColor = '#44cc44';
        }
    }
    
    // Update enemy Pokémon info
    if (elements.enemyName) elements.enemyName.textContent = gameState.enemyPokemon.name;
    if (elements.enemyLevel) elements.enemyLevel.textContent = `Lv.${gameState.enemyPokemon.level}`;
    
    // Ensure HP values are numbers
    const enemyCurrentHp = Number(gameState.enemyPokemon.currentHp) || 0;
    const enemyMaxHp = Number(gameState.enemyPokemon.maxHp) || 1;
    
    if (elements.enemyCurrentHp) elements.enemyCurrentHp.textContent = enemyCurrentHp;
    if (elements.enemyMaxHp) elements.enemyMaxHp.textContent = enemyMaxHp;
    
    // Update enemy HP bar
    if (elements.enemyHpBar) {
        const enemyHpPercent = (enemyCurrentHp / enemyMaxHp) * 100;
        elements.enemyHpBar.style.width = `${enemyHpPercent}%`;
        
        // Change color based on HP percentage
        if (enemyHpPercent < 20) {
            elements.enemyHpBar.style.backgroundColor = '#ff4444';
        } else if (enemyHpPercent < 50) {
            elements.enemyHpBar.style.backgroundColor = '#ffaa33';
        } else {
            elements.enemyHpBar.style.backgroundColor = '#44cc44';
        }
    }
    
    // Update player sprite with fallback
    if (elements.playerSprite) {
        const backSprite = gameState.playerPokemon.backSprite || 
                          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${getPokemonId(gameState.playerPokemon.name)}.png`;
        elements.playerSprite.src = backSprite;
        elements.playerSprite.alt = gameState.playerPokemon.name;
        
        // Add error handler for sprite loading
        elements.playerSprite.onerror = function() {
            this.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
        };
    }
    
    // Update enemy sprite with fallback
    if (elements.enemySprite) {
        const frontSprite = gameState.enemyPokemon.sprite || 
                           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(gameState.enemyPokemon.name)}.png`;
        elements.enemySprite.src = frontSprite;
        elements.enemySprite.alt = gameState.enemyPokemon.name;
        
        // Add error handler for sprite loading
        elements.enemySprite.onerror = function() {
            this.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
        };
    }
}

// Get Pokémon ID from name for sprite URLs
function getPokemonId(name) {
    // Check if we have the ID in the pokemonData
    const pokemonKey = Object.keys(pokemonData).find(key => 
        pokemonData[key].name.toLowerCase() === name.toLowerCase()
    );
    
    if (pokemonKey && pokemonData[pokemonKey].id) {
        return pokemonData[pokemonKey].id;
    }
    
    // Fallback IDs for common starters
    const fallbackIds = {
        'bulbasaur': 1,
        'charmander': 4,
        'squirtle': 7,
        'pikachu': 25,
        'eevee': 133
    };
    
    return fallbackIds[name.toLowerCase()] || 1; // Default to Bulbasaur if unknown
}

// Show the moves menu
function showMovesMenu() {
    // Clear existing move buttons
    const moveButtons = elements.movesMenu.querySelectorAll('.move-button');
    moveButtons.forEach(button => button.remove());
    
    // Add a button for each move
    gameState.playerPokemon.moves.forEach((move, index) => {
        const moveButton = document.createElement('div');
        moveButton.className = `move-button type-${move.type}`;
        moveButton.innerHTML = `
            <span class="move-name">${move.name}</span>
            <span class="move-type type-${move.type}">${move.type.toUpperCase()}</span>
            <span class="move-power">Power: ${move.power}</span>
        `;
        moveButton.addEventListener('click', () => {
            handlePlayerAction('attack', index);
            hideMovesMenu();
        });
        
        // Insert before the back button
        elements.movesMenu.insertBefore(moveButton, elements.backButton);
    });
    
    // Show the menu
    elements.movesMenu.classList.add('active');
}

// Hide the moves menu
function hideMovesMenu() {
    elements.movesMenu.classList.remove('active');
}

// Handle player action
function handlePlayerAction(action, moveIndex = 0) {
    if (!gameState.isBattleActive || !gameState.playerTurn) return;
    
    const { playerPokemon, enemyPokemon } = gameState;
    
    // Set player turn to false to prevent multiple actions
    gameState.playerTurn = false;
    
    switch (action) {
        case 'attack':
            // Use the specified move
            const attackResult = calculateDamage(
                playerPokemon, 
                enemyPokemon, 
                playerPokemon.moves[moveIndex].type, 
                playerPokemon.moves[moveIndex].power
            );
            
            queueMessage(`${playerPokemon.name} used ${playerPokemon.moves[moveIndex].name}!`, null, true);
            
            // Apply damage
            enemyPokemon.currentHp -= attackResult.damage;
            if (enemyPokemon.currentHp < 0) enemyPokemon.currentHp = 0;
            
            // Show effectiveness message
            if (attackResult.effectiveness > 1) {
                queueMessage("It's super effective!");
                playSound(sounds.superEffective);
            } else if (attackResult.effectiveness < 1 && attackResult.effectiveness > 0) {
                queueMessage("It's not very effective...");
                playSound(sounds.notEffective);
            } else if (attackResult.effectiveness === 0) {
                queueMessage("It has no effect...");
                playSound(sounds.notEffective);
            } else {
                playSound(sounds.hit);
            }
            
            // Show attack animation
            showAttackAnimation(playerPokemon.moves[moveIndex].type);
            
            // Update the UI
            updateBattleUI();
            
            // Check if enemy fainted
            if (enemyPokemon.currentHp <= 0) {
                queueMessage(`${enemyPokemon.name} fainted!`);
                endBattle(true);
            } else {
                // Enemy's turn
                gameState.playerTurn = false;
                
                // Enemy attacks after a delay
                setTimeout(() => {
                    handleEnemyTurn();
                }, 1500);
            }
            break;
            
        case 'heal':
            // Heal the Pokémon
            const healAmount = Math.floor(playerPokemon.maxHp * 0.3);
            const oldHp = playerPokemon.currentHp;
            playerPokemon.heal(healAmount);
            
            queueMessage(`${playerPokemon.name} restored some HP!`);
            
            // Add heal animation
            elements.playerSprite.style.animation = 'heal-effect 1s';
            
            setTimeout(() => {
                elements.playerSprite.style.animation = '';
                updateBattleUI();
                
                if (oldHp === playerPokemon.maxHp) {
                    queueMessage("But it had no effect!");
                }
                
                setTimeout(() => {
                    enemyTurn();
                }, 1500);
            }, 1000);
            break;
            
        case 'catch':
            // Try to catch the wild Pokémon
            // Improve catch rate formula - lower HP and status effects increase chance
            const hpPercentage = enemyPokemon.currentHp / enemyPokemon.maxHp;
            const catchChance = Math.max(0.1, Math.min(0.9, (1 - hpPercentage) * 1.5));
            
            queueMessage("Throwing a Poké Ball...");
            
            // Show and animate the pokeball
            animatePokeball(
                elements.playerSprite.getBoundingClientRect(),
                elements.enemySprite.getBoundingClientRect(),
                catchChance
            );
            break;
    }
}

// Update the calculateDamage function to use type effectiveness
function calculateDamage(attacker, defender, moveType, power) {
    // Base damage calculation
    const attackStat = attacker.attack;
    const defenseStat = defender.defense;
    const levelFactor = attacker.level * 0.4 + 2;
    
    // Calculate base damage
    let damage = ((levelFactor * attackStat * power) / (defenseStat * 50)) + 2;
    
    // Apply random factor (85-100%)
    damage *= (85 + Math.random() * 15) / 100;
    
    // Apply STAB (Same Type Attack Bonus)
    if (attacker.type === moveType || (attacker.secondaryType && attacker.secondaryType === moveType)) {
        damage *= 1.5;
    }
    
    // Apply type effectiveness
    let effectiveness = 1;
    
    // Check primary type
    if (typeEffectiveness[moveType] && typeEffectiveness[moveType][defender.type]) {
        effectiveness *= typeEffectiveness[moveType][defender.type];
    }
    
    // Check secondary type if it exists
    if (defender.secondaryType && typeEffectiveness[moveType] && typeEffectiveness[moveType][defender.secondaryType]) {
        effectiveness *= typeEffectiveness[moveType][defender.secondaryType];
    }
    
    damage *= effectiveness;
    
    // Return both the damage and effectiveness for message display
    return {
        damage: Math.floor(damage),
        effectiveness: effectiveness
    };
}

// Update the showAttackAnimation function to show different animations based on move type
function showAttackAnimation(moveType) {
    // Set the animation based on move type
    let animationClass = 'attack-animation';
    
    switch(moveType) {
        case 'fire':
            animationClass = 'fire-attack';
            break;
        case 'water':
            animationClass = 'water-attack';
            break;
        case 'electric':
            animationClass = 'electric-attack';
            break;
        case 'grass':
            animationClass = 'grass-attack';
            break;
        case 'ice':
            animationClass = 'ice-attack';
            break;
        case 'fighting':
            animationClass = 'fighting-attack';
            break;
        case 'poison':
            animationClass = 'poison-attack';
            break;
        case 'ground':
            animationClass = 'ground-attack';
            break;
        case 'psychic':
            animationClass = 'psychic-attack';
            break;
        // Add more types as needed
    }
    
    // Apply the animation to the battle overlay
    elements.battleOverlay.className = `battle-overlay ${animationClass}`;
    elements.battleOverlay.style.display = 'block';
    
    // Remove the animation after it completes
    setTimeout(() => {
        elements.battleOverlay.style.display = 'none';
        elements.battleOverlay.className = 'battle-overlay';
    }, 1000);
}

// Improve the animatePokeball function with dots animation
function animatePokeball(sourceRect, targetRect, catchChance) {
    const pokeball = elements.pokeball;
    const battleSceneRect = elements.battleScene.getBoundingClientRect();
    
    // Position the pokeball at the player's position
    const sourceX = sourceRect.left - battleSceneRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top - battleSceneRect.top + sourceRect.height / 2;
    const targetX = targetRect.left - battleSceneRect.left + targetRect.width / 2;
    const targetY = targetRect.top - battleSceneRect.top + targetRect.height / 2;
    
    pokeball.style.left = `${sourceX - 25}px`;
    pokeball.style.top = `${sourceY - 25}px`;
    pokeball.style.display = 'block';
    
    // Create dots for the catch animation
    const catchDots = document.createElement('div');
    catchDots.className = 'catch-dots';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'catch-dot';
        catchDots.appendChild(dot);
    }
    
    pokeball.appendChild(catchDots);
    
    // Animate the pokeball to the target
    const arcHeight = 100; // Height of the arc
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let step = 0;
    const throwInterval = setInterval(() => {
        step++;
        const progress = step / steps;
        const currentX = sourceX + (targetX - sourceX) * progress;
        // Add an arc to the y movement
        const currentY = sourceY + (targetY - sourceY) * progress - Math.sin(progress * Math.PI) * arcHeight;
        
        pokeball.style.left = `${currentX - 25}px`;
        pokeball.style.top = `${currentY - 25}px`;
        
        if (step >= steps) {
            clearInterval(throwInterval);
            
            // Start the catch animation
            pokeball.style.animation = 'pokeball-shake 1s 3';
            
            // Hide the enemy pokemon during catch attempt
            elements.enemySprite.style.display = 'none';
            
            // Show the dots animation
            catchDots.style.opacity = '1';
            
            // Animate the dots
            const dots = catchDots.querySelectorAll('.catch-dot');
            dots.forEach((dot, index) => {
                dot.style.animation = `dot-blink 1s ${index * 0.3}s infinite`;
            });
            
            // Determine if catch is successful after a delay
            setTimeout(() => {
                pokeball.style.animation = '';
                catchDots.style.opacity = '0';
                
                // Remove the dot animations
                dots.forEach(dot => {
                    dot.style.animation = '';
                });
                
                // Generate a random number between 0 and 1
                const catchRoll = Math.random();
                console.log(`Catch chance: ${catchChance}, Roll: ${catchRoll}`);
                
                if (catchRoll < catchChance) {
                    // Successful catch
                    throwPokeball(catchChance);
                } else {
                    // Failed catch
                    queueMessage("Oh no! The Pokémon broke free!");
                    
                    // Show the enemy pokemon again
                    elements.enemySprite.style.display = 'block';
                    elements.enemySprite.style.animation = 'special-attack 0.3s';
                    
                    setTimeout(() => {
                        // Remove the dots
                        pokeball.removeChild(catchDots);
                        pokeball.style.display = 'none';
                        elements.enemySprite.style.animation = '';
                        enemyTurn();
                    }, 1500);
                }
            }, 3000);
        }
    }, stepDuration);
}

// Enemy turn
function enemyTurn() {
    if (!gameState.isBattleActive) return;
    
    const { playerPokemon, enemyPokemon } = gameState;
    
    // Choose a random move
    const moveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
    const attackResult = calculateDamage(
        enemyPokemon, 
        playerPokemon, 
        enemyPokemon.moves[moveIndex].type, 
        enemyPokemon.moves[moveIndex].power
    );
    
    queueMessage(`Wild ${enemyPokemon.name} used ${enemyPokemon.moves[moveIndex].name}!`, null, true);
    
    // Apply damage
    playerPokemon.currentHp -= attackResult.damage;
    if (playerPokemon.currentHp < 0) playerPokemon.currentHp = 0;
    
    // Show effectiveness message
    if (attackResult.effectiveness > 1) {
        queueMessage("It's super effective!");
        playSound(sounds.superEffective);
    } else if (attackResult.effectiveness < 1 && attackResult.effectiveness > 0) {
        queueMessage("It's not very effective...");
        playSound(sounds.notEffective);
    } else if (attackResult.effectiveness === 0) {
        queueMessage("It has no effect...");
        playSound(sounds.notEffective);
    } else {
        playSound(sounds.hit);
    }
    
    // Show attack animation
    showAttackAnimation(enemyPokemon.moves[moveIndex].type);
    
    // Update the UI
    updateBattleUI();
    
    // Check if player fainted
    if (playerPokemon.currentHp <= 0) {
        queueMessage(`${playerPokemon.name} fainted!`);
        
        // Check if player has other Pokémon that can battle
        const hasAlivePokemon = gameState.pokemonTeam.some(pokemon => 
            pokemon !== playerPokemon && pokemon.currentHp > 0
        );
        
        if (hasAlivePokemon) {
            // Prompt to switch Pokémon
            queueMessage("Choose another Pokémon!", () => {
                toggleInventory();
            });
        } else {
            // All Pokémon fainted, battle lost
            endBattle(false);
        }
    } else {
        // Player's turn
        gameState.playerTurn = true;
        queueMessage(`What will ${playerPokemon.name} do?`);
    }
}

// End battle
function endBattle(victory) {
    gameState.isBattleActive = false;
    
    // Clean up the battle field
    elements.pokeball.style.display = 'none';
    elements.pokeball.innerHTML = '';
    elements.pokeball.style.animation = '';
    elements.attackEffect.style.display = 'none';
    
    // Don't hide enemy sprite here, it will be handled in startWildBattle
    
    if (victory) {
        if (gameState.gameMode === 'tournament' && gameState.tournamentProgress.currentOpponent) {
            // Check if the trainer has more Pokémon
            const opponent = gameState.tournamentProgress.currentOpponent;
            opponent.currentPokemonIndex++;
            
            if (opponent.currentPokemonIndex < opponent.pokemon.length) {
                // Trainer has more Pokémon, continue the battle
                gameState.enemyPokemon = opponent.pokemon[opponent.currentPokemonIndex];
                
                // Show next Pokémon message
                queueMessage(`${opponent.name} sends out ${gameState.enemyPokemon.name}!`, null, true);
                
                // Reset battle state
                gameState.isBattleActive = true;
                gameState.playerTurn = true;
                
                // Make sure enemy sprite is visible
                elements.enemySprite.style.display = 'block';
                elements.enemySprite.style.animation = '';
                
                // Update the sprite source
                elements.enemySprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(gameState.enemyPokemon.name)}.png`;
                
                // Update the UI
                updateBattleUI();
                
                return; // Don't continue with normal end battle flow
            } else {
                // Trainer is defeated
                const trainerId = opponent.id;
                
                // Add to defeated trainers if not already defeated
                if (!gameState.tournamentProgress.defeatedTrainers.includes(trainerId)) {
                    gameState.tournamentProgress.defeatedTrainers.push(trainerId);
                    gameState.tournamentProgress.badges++;
                    
                    // Show victory message
                    queueMessage(`You defeated ${opponent.name}!`, null, true);
                    queueMessage(`You earned the ${getBadgeName(trainerId)} Badge!`);
                    
                    // Give bonus experience for defeating a gym leader
                    const bonusExp = 100 * gameState.tournamentProgress.badges;
                    queueMessage(`Your Pokémon gained ${bonusExp} bonus experience!`);
                    
                    // Apply bonus exp to all team Pokémon
                    gameState.pokemonTeam.forEach(pokemon => {
                        pokemon.experience += bonusExp;
                        checkForLevelUp(pokemon);
                    });
                }
                
                // Reset current opponent
                gameState.tournamentProgress.currentOpponent = null;
                
                // Show tournament panel after a delay
                setTimeout(() => {
                    showTournamentPanel();
                }, 3000);
            }
        } else {
            // Store the initial stats for comparison
            const initialLevel = gameState.playerPokemon.level;
            const initialAttack = gameState.playerPokemon.attack;
            const initialDefense = gameState.playerPokemon.defense;
            const initialSpeed = gameState.playerPokemon.speed;
            const initialMaxHp = gameState.playerPokemon.maxHp;
            
            // Gain experience and possibly level up
            const expGained = Math.floor(gameState.enemyPokemon.level * 10 * (1 + Math.random() * 0.5));
            
            // Show the victory animation
            showVictoryAnimation();
            playSound(sounds.victory);
            
            // Show victory message
            queueMessage(`${gameState.playerPokemon.name} defeated ${gameState.enemyPokemon.name}!`);
            
            // Add experience
            setTimeout(() => {
                // Add experience points
                gameState.playerPokemon.experience += expGained;
                
                // Check if leveled up
                if (gameState.playerPokemon.experience >= getExpForNextLevel(gameState.playerPokemon.level)) {
                    // Level up
                    gameState.playerPokemon.level++;
                    
                    // Increase stats
                    gameState.playerPokemon.attack += Math.floor(2 + Math.random() * 3);
                    gameState.playerPokemon.defense += Math.floor(1 + Math.random() * 3);
                    gameState.playerPokemon.speed += Math.floor(1 + Math.random() * 2);
                    gameState.playerPokemon.maxHp += Math.floor(3 + Math.random() * 5);
                    gameState.playerPokemon.currentHp += Math.floor(3 + Math.random() * 5);
                    
                    // Play level up sound
                    playSound(sounds.levelUp);
                    
                    // Show level up message
                    queueMessage(`${gameState.playerPokemon.name} grew to level ${gameState.playerPokemon.level}!`);
                    
                    // Check for new moves
                    checkForNewMove(gameState.playerPokemon);
                    
                    // Show battle results
                    setTimeout(() => {
                        showBattleResults(
                            gameState.playerPokemon,
                            expGained,
                            initialLevel,
                            initialAttack,
                            initialDefense,
                            initialSpeed,
                            initialMaxHp
                        );
                    }, 2000);
                } else {
                    // Just show experience gain
                    queueMessage(`${gameState.playerPokemon.name} gained ${expGained} experience points!`);
                    
                    // Check if any Pokémon have fainted and ask about Pokémon Center
                    checkForFaintedPokemon();
                }
            }, 2000);
        }
    } else {
        queueMessage("You lost the battle!");
        
        if (gameState.gameMode === 'tournament') {
            // Reset current opponent
            gameState.tournamentProgress.currentOpponent = null;
            
            // Show message about returning to tournament
            queueMessage("Returning to the Pokémon League...", () => {
                setTimeout(() => {
                    showTournamentPanel();
                }, 2000);
            });
        } else {
            // Always offer to go to the Pokémon Center after a loss
            setTimeout(() => {
                offerPokemonCenter("Your Pokémon are weakened. Would you like to visit the Pokémon Center?");
            }, 2000);
        }
    }
}

// Function to check for fainted Pokémon and offer Pokémon Center
function checkForFaintedPokemon() {
    const hasFainted = gameState.pokemonTeam.some(pokemon => pokemon.currentHp <= 0);
    const lowHealth = gameState.pokemonTeam.some(pokemon => 
        pokemon.currentHp > 0 && pokemon.currentHp < pokemon.maxHp * 0.3
    );
    
    if (hasFainted) {
        gameState.hasFaintedPokemon = true;
        offerPokemonCenter("Some of your Pokémon have fainted. Would you like to visit the Pokémon Center?");
    } else if (lowHealth) {
        offerPokemonCenter("Some of your Pokémon are low on health. Would you like to visit the Pokémon Center?");
    } else {
        // Continue with normal flow if no Pokémon fainted or low on health
        queueMessage("Looking for another wild Pokémon...", () => {
            setTimeout(() => {
                startWildBattle();
            }, 1000);
        });
    }
}

// Function to offer Pokémon Center with Yes/No choice
function offerPokemonCenter(message) {
    // Create a choice dialog
    const choiceDialog = document.createElement('div');
    choiceDialog.className = 'choice-dialog';
    choiceDialog.innerHTML = `
        <p>${message}</p>
        <div class="choice-buttons">
            <button id="yes-btn">Yes</button>
            <button id="no-btn">No</button>
        </div>
    `;
    
    document.body.appendChild(choiceDialog);
    
    // Add event listeners to buttons
    document.getElementById('yes-btn').addEventListener('click', () => {
        document.body.removeChild(choiceDialog);
        showPokemonCenter();
    });
    
    document.getElementById('no-btn').addEventListener('click', () => {
        document.body.removeChild(choiceDialog);
        queueMessage("Looking for another wild Pokémon...", () => {
            setTimeout(() => {
                startWildBattle();
            }, 1000);
        });
    });
}

// Add a function to show the fainting animation
function showFaintAnimation(pokemonElement, callback) {
    pokemonElement.style.animation = 'faint 1.5s forwards';
    
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

// Add a function to show the victory animation
function showVictoryAnimation() {
    // Make the player's Pokémon do a victory animation
    elements.playerSprite.style.animation = 'victory-jump 0.8s 3, victory-glow 2.4s';
    
    // Create stars and confetti
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            // Create a star
            const star = document.createElement('div');
            star.className = 'victory-star';
            
            // Random position around the player's Pokémon
            const playerRect = elements.playerSprite.getBoundingClientRect();
            const battleSceneRect = elements.battleScene.getBoundingClientRect();
            
            const centerX = playerRect.left - battleSceneRect.left + playerRect.width / 2;
            const centerY = playerRect.top - battleSceneRect.top + playerRect.height / 2;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            
            const starX = centerX + Math.cos(angle) * distance;
            const starY = centerY + Math.sin(angle) * distance;
            
            star.style.left = `${starX - 10}px`;
            star.style.top = `${starY - 10}px`;
            star.style.opacity = '0';
            
            elements.battleScene.appendChild(star);
            
            // Animate the star
            setTimeout(() => {
                star.style.transition = 'all 0.5s ease-out';
                star.style.opacity = '1';
                star.style.transform = 'scale(1.5)';
                
                setTimeout(() => {
                    star.style.opacity = '0';
                    star.style.transform = 'scale(0.5)';
                    
                    setTimeout(() => {
                        elements.battleScene.removeChild(star);
                    }, 500);
                }, 1000);
            }, 10);
            
            // Create confetti
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random color
            const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random position at the top
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '0';
            confetti.style.opacity = '1';
            
            elements.battleScene.appendChild(confetti);
            
            // Animate the confetti falling
            const fallDuration = 2000 + Math.random() * 2000;
            const swayAmount = 50 + Math.random() * 100;
            const startX = parseFloat(confetti.style.left);
            
            const fallSteps = 100;
            const fallStepDuration = fallDuration / fallSteps;
            let fallStep = 0;
            
            const fallInterval = setInterval(() => {
                fallStep++;
                const progress = fallStep / fallSteps;
                
                // Sway side to side as it falls
                const newX = startX + Math.sin(progress * Math.PI * 4) * swayAmount;
                const newY = progress * 100;
                
                confetti.style.left = `${newX}%`;
                confetti.style.top = `${newY}%`;
                confetti.style.transform = `rotate(${progress * 720}deg)`;
                
                if (fallStep >= fallSteps) {
                    clearInterval(fallInterval);
                    confetti.style.opacity = '0';
                    
                    setTimeout(() => {
                        elements.battleScene.removeChild(confetti);
                    }, 500);
                }
            }, fallStepDuration);
        }, i * 100);
    }
}

// Add a function to gain experience
function gainExperience(pokemon, expAmount) {
    if (pokemon.level >= 100) return; // Max level cap
    
    // Calculate base exp gain (higher level enemies give more exp)
    const levelDifference = gameState.enemyPokemon.level - pokemon.level;
    const expMultiplier = Math.max(1, 1 + (levelDifference * 0.1));
    const totalExp = Math.floor(expAmount * expMultiplier);
    
    pokemon.experience += totalExp;
    
    // Store initial stats for comparison
    const initialLevel = pokemon.level;
    const initialStats = {
        hp: pokemon.maxHp,
        attack: pokemon.attack,
        defense: pokemon.defense,
        speed: pokemon.speed
    };
    
    // Check for level ups
    let levelsGained = 0;
    while (pokemon.experience >= getExpForNextLevel(pokemon.level)) {
        levelUp(pokemon);
        levelsGained++;
    }
    
    // If leveled up, show level up sequence
    if (levelsGained > 0) {
        playSound(sounds.levelUp);
        
        // Show level up messages
        queueMessage(`${pokemon.name} grew to level ${pokemon.level}!`, null, true);
        
        // Show stat increases
        const statGains = {
            hp: pokemon.maxHp - initialStats.hp,
            attack: pokemon.attack - initialStats.attack,
            defense: pokemon.defense - initialStats.defense,
            speed: pokemon.speed - initialStats.speed
        };
        
        Object.entries(statGains).forEach(([stat, gain]) => {
            if (gain > 0) {
                queueMessage(`${stat.toUpperCase()} increased by ${gain}!`);
            }
        });
        
        // Check for new moves
        checkForNewMoves(pokemon);
    }
    
    return totalExp;
}

// Add a function to level up the player's Pokémon
function levelUp(pokemon) {
    pokemon.level++;
    
    // Calculate stat increases (using Pokémon-like formulas)
    const statGains = calculateStatGains(pokemon);
    
    // Apply stat increases
    pokemon.maxHp += statGains.hp;
    pokemon.currentHp += statGains.hp;
    pokemon.attack += statGains.attack;
    pokemon.defense += statGains.defense;
    pokemon.speed += statGains.speed;
}

function calculateStatGains(pokemon) {
    // Base stat growth values (can be adjusted for balance)
    const baseGrowth = {
        hp: 2,
        attack: 1,
        defense: 1,
        speed: 1
    };
    
    // Add some randomness to stat gains
    return {
        hp: baseGrowth.hp + Math.floor(Math.random() * 3),
        attack: baseGrowth.attack + Math.floor(Math.random() * 2),
        defense: baseGrowth.defense + Math.floor(Math.random() * 2),
        speed: baseGrowth.speed + Math.floor(Math.random() * 2)
    };
}

function getExpForNextLevel(currentLevel) {
    return gameState.expToNextLevel[currentLevel + 1] || Infinity;
}

function checkForNewMoves(pokemon) {
    const pokemonData = window.pokemonData[pokemon.name.toLowerCase()];
    if (!pokemonData || !pokemonData.learnableMoves) return;
    
    // Check each learnable move
    pokemonData.learnableMoves.forEach(move => {
        // Random chance to learn new move at level up
        if (Math.random() < 0.3) { // 30% chance to learn a new move
            if (pokemon.moves.length < 4) {
                // If less than 4 moves, just add the new move
                pokemon.moves.push(move);
                queueMessage(`${pokemon.name} learned ${move.name}!`);
            } else {
                // If 4 moves, ask to forget an old move
                const oldMove = pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
                pokemon.moves[pokemon.moves.indexOf(oldMove)] = move;
                queueMessage(`${pokemon.name} forgot ${oldMove.name} and learned ${move.name}!`);
            }
        }
    });
}

// Add a function to show battle results
function showBattleResults(pokemon, expGained, initialLevel, initialAttack, initialDefense, initialSpeed, initialMaxHp) {
    // Calculate stat increases
    const levelIncrease = pokemon.level - initialLevel;
    const attackIncrease = pokemon.attack - initialAttack;
    const defenseIncrease = pokemon.defense - initialDefense;
    const speedIncrease = pokemon.speed - initialSpeed;
    const hpIncrease = pokemon.maxHp - initialMaxHp;
    
    // Queue the result messages with required input for achievements
    queueMessage(`${pokemon.name} gained ${expGained} experience points!`, null, true);
    
    if (levelIncrease > 0) {
        queueMessage(`${pokemon.name} grew to level ${pokemon.level}!`, null, true);
        if (attackIncrease > 0) queueMessage(`Attack increased by ${attackIncrease}!`);
        if (defenseIncrease > 0) queueMessage(`Defense increased by ${defenseIncrease}!`);
        if (speedIncrease > 0) queueMessage(`Speed increased by ${speedIncrease}!`);
        if (hpIncrease > 0) queueMessage(`HP increased by ${hpIncrease}!`);
    }
    
    queueMessage("Looking for another wild Pokémon...", () => {
        setTimeout(() => {
            startWildBattle();
        }, 1000);
    });
}

// Update the handleCatchAction function to add caught Pokémon to the team
function handleCatchAction() {
    // Set player turn to false to prevent multiple actions
    gameState.playerTurn = false;
    
    // Calculate catch chance
    const catchChance = calculateCatchChance(gameState.enemyPokemon);
    
    // Show the pokeball animation
    throwPokeball(catchChance);
}

// Update the throwPokeball function to properly handle the caught Pokémon and clean up the battle field
function throwPokeball(catchChance) {
    const pokeball = elements.pokeball;
    pokeball.style.display = 'block';
    pokeball.style.animation = 'throw-ball 1s forwards';
    
    // Add the catching animation dots
    const catchDots = document.createElement('div');
    catchDots.className = 'catch-dots';
    pokeball.appendChild(catchDots);
    
    // Hide the enemy Pokémon
    elements.enemySprite.style.display = 'none';
    
    setTimeout(() => {
        const isCaught = Math.random() < catchChance;
        
        if (isCaught) {
            playSound(sounds.catchSuccess);
            
            // Create a new instance of the caught Pokémon with correct moves
            const caughtPokemon = createPokemon(
                gameState.enemyPokemon.name,
                gameState.enemyPokemon.level
            );
            
            // Ensure the caught Pokémon has the correct moves from pokemonData
            const pokemonInfo = pokemonData[caughtPokemon.name.toLowerCase()];
            if (pokemonInfo && pokemonInfo.moves) {
                caughtPokemon.moves = [...pokemonInfo.moves]; // Create a copy of the moves array
            }
            
            // Add the caught Pokémon to the team if there's room
            if (gameState.pokemonTeam.length < 6) {
                gameState.pokemonTeam.push(caughtPokemon);
                queueMessage(`Gotcha! ${caughtPokemon.name} was caught!`, null, true);
                queueMessage(`${caughtPokemon.name} was added to your team!`);
                updateTeamUI();
            } else {
                gameState.caughtPokemon.push(caughtPokemon);
                queueMessage(`Gotcha! ${caughtPokemon.name} was caught!`, null, true);
                queueMessage(`${caughtPokemon.name} was sent to storage!`);
            }
            
            // Clean up the battle field
            setTimeout(() => {
                // Remove the pokeball and dots
                pokeball.innerHTML = '';
                pokeball.style.display = 'none';
                pokeball.style.animation = '';
                
                // Hide the enemy Pokémon sprite
                elements.enemySprite.style.display = 'none';
                
                endBattle(true);
            }, 1500);
        } else {
            // Failed catch
            playSound(sounds.catchFail);
            queueMessage("Oh no! The Pokémon broke free!");
            
            // Show the enemy pokemon again
            elements.enemySprite.style.display = 'block';
            elements.enemySprite.style.animation = 'special-attack 0.3s';
            
            setTimeout(() => {
                // Clean up the pokeball
                pokeball.innerHTML = '';
                pokeball.style.display = 'none';
                pokeball.style.animation = '';
                elements.enemySprite.style.animation = '';
                
                enemyTurn();
            }, 1500);
        }
    }, 3000);
}

// Update the DOMContentLoaded event listener
window.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for game mode selection
    document.getElementById('wild-mode').addEventListener('click', () => {
        gameState.gameMode = 'wild';
        startGame();
    });
    
    document.getElementById('tournament-mode').addEventListener('click', () => {
        gameState.gameMode = 'tournament';
        startGame();
    });

    // Add event listeners for dialogue system
    elements.nextButton.addEventListener('click', () => {
        if (dialogueSystem.isTyping) {
            // Skip typing animation if clicking during typing
            const currentMessage = dialogueSystem.messageQueue[0];
            elements.battleMessage.textContent = currentMessage.text;
            dialogueSystem.isTyping = false;
            return;
        }
        
        // Remove current message and show next
        dialogueSystem.messageQueue.shift();
        showNextMessage();
    });
});

// Function to show text with typing animation
function showTypingText(text, callback) {
    dialogueSystem.isTyping = true;
    const messageElement = elements.battleMessage;
    let currentChar = 0;
    messageElement.textContent = '';
    
    // Add cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    messageElement.appendChild(cursor);
    
    function typeNextChar() {
        if (currentChar < text.length) {
            messageElement.textContent = text.slice(0, currentChar + 1);
            messageElement.appendChild(cursor);
            currentChar++;
            setTimeout(typeNextChar, dialogueSystem.typingSpeed);
        } else {
            dialogueSystem.isTyping = false;
            cursor.remove();
            if (callback) callback();
        }
    }
    
    typeNextChar();
}

// Function to add message to queue
function queueMessage(text, callback = null, requireInput = false) {
    dialogueSystem.messageQueue.push({ text, callback, requireInput });
    if (dialogueSystem.messageQueue.length === 1 && !dialogueSystem.isTyping) {
        showNextMessage();
    }
}

// Function to show next message in queue
function showNextMessage() {
    if (dialogueSystem.messageQueue.length === 0) return;
    
    const { text, callback, requireInput } = dialogueSystem.messageQueue[0];
    dialogueSystem.waitForInput = requireInput;
    
    showTypingText(text, () => {
        if (requireInput) {
            // Show space hint only for messages that need input
            elements.spaceHint.style.display = 'block';
        } else {
            // Auto-advance after a delay for other messages
            elements.spaceHint.style.display = 'none';
            setTimeout(() => {
                dialogueSystem.messageQueue.shift();
                showNextMessage();
            }, 1500); // Wait 1.5 seconds before showing next message
        }
    });
    
    if (callback) callback();
}

// Create a function to show the Pokémon Center
function showPokemonCenter() {
    // Create the Pokémon Center panel
    const pokemonCenter = document.createElement('div');
    pokemonCenter.className = 'pokemon-center';
    pokemonCenter.innerHTML = `
        <div class="pokemon-center-content">
            <h2>Pokémon Center</h2>
            <p>Welcome to the Pokémon Center! Would you like to heal your Pokémon?</p>
            <div class="healing-machine">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heal-ball.png" class="healing-ball">
                <div class="healing-slots">
                    ${Array(6).fill().map((_, i) => 
                        `<div class="healing-slot" data-index="${i}"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="center-buttons">
                <button id="heal-team-btn">Heal Team</button>
                <button id="continue-adventure-btn">Continue Adventure</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(pokemonCenter);
    
    // Add event listeners to the buttons
    const healTeamBtn = document.getElementById('heal-team-btn');
    const continueAdventureBtn = document.getElementById('continue-adventure-btn');
    
    healTeamBtn.addEventListener('click', () => {
        healTeam(pokemonCenter);
    });
    
    continueAdventureBtn.addEventListener('click', () => {
        document.body.removeChild(pokemonCenter);
        startWildBattle();
    });
    
    // Display fainted Pokémon in the healing slots
    updateHealingSlots();
}

// Function to update the healing slots with fainted Pokémon
function updateHealingSlots() {
    const healingSlots = document.querySelectorAll('.healing-slot');
    
    // Clear all slots first
    healingSlots.forEach(slot => {
        slot.innerHTML = '';
    });
    
    // Add fainted Pokémon to slots
    gameState.pokemonTeam.forEach((pokemon, index) => {
        if (pokemon.currentHp <= 0) {
            const slot = document.querySelector(`.healing-slot[data-index="${index}"]`);
            if (slot) {
                slot.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.name)}.png" alt="${pokemon.name}">
                    <div class="pokemon-name">${pokemon.name}</div>
                `;
                slot.classList.add('fainted');
            }
        }
    });
}

// Function to heal the team with animation
function healTeam(pokemonCenter) {
    const healingMachine = pokemonCenter.querySelector('.healing-machine');
    const healingBall = pokemonCenter.querySelector('.healing-ball');
    
    // Start healing animation
    healingMachine.classList.add('healing');
    playSound(sounds.healing);
    
    // Animate the healing ball
    healingBall.style.animation = 'pulse 1.5s infinite';
    
    // Show healing message
    const healingMessage = document.createElement('div');
    healingMessage.className = 'healing-message';
    healingMessage.textContent = 'Healing your Pokémon...';
    pokemonCenter.querySelector('.pokemon-center-content').appendChild(healingMessage);
    
    // Disable buttons during healing
    const buttons = pokemonCenter.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    
    // Heal all Pokémon after animation
    setTimeout(() => {
        gameState.pokemonTeam.forEach(pokemon => {
            pokemon.currentHp = pokemon.maxHp;
        });
        
        // Update healing message
        healingMessage.textContent = 'Your Pokémon have been fully healed!';
        
        // Stop animation
        healingBall.style.animation = '';
        healingMachine.classList.remove('healing');
        
        // Re-enable buttons
        buttons.forEach(btn => btn.disabled = false);
        
        // Update healing slots (all Pokémon should be healed now)
        updateHealingSlots();
        
        // Reset fainted flag
        gameState.hasFaintedPokemon = false;
        
        // Add a continue button
        const continueBtn = document.createElement('button');
        continueBtn.textContent = 'Continue';
        continueBtn.className = 'continue-btn';
        continueBtn.addEventListener('click', () => {
            document.body.removeChild(pokemonCenter);
            startWildBattle();
        });
        
        healingMessage.appendChild(document.createElement('br'));
        healingMessage.appendChild(continueBtn);
    }, 3000);
}

// Function to show the tournament panel
function showTournamentPanel() {
    // Create the tournament panel
    const tournamentPanel = document.createElement('div');
    tournamentPanel.className = 'tournament-panel';
    tournamentPanel.innerHTML = `
        <div class="tournament-content">
            <div class="tournament-header">
                <h2>Pokémon League Tournament</h2>
                <p>Defeat trainers to earn badges and level up your Pokémon!</p>
            </div>
            <div class="tournament-trainers">
                ${generateTrainerCards()}
            </div>
            <div class="badge-collection">
                ${generateBadges()}
            </div>
            <div class="tournament-buttons">
                <button id="exit-tournament-btn">Exit Tournament</button>
                <button id="wild-training-btn">Wild Training</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(tournamentPanel);
    
    // Add event listeners to buttons
    document.getElementById('exit-tournament-btn').addEventListener('click', () => {
        document.body.removeChild(tournamentPanel);
        gameState.gameMode = 'wild';
        startWildBattle();
    });
    
    document.getElementById('wild-training-btn').addEventListener('click', () => {
        document.body.removeChild(tournamentPanel);
        startWildBattle();
    });
    
    // Add event listeners to trainer cards
    document.querySelectorAll('.trainer-card:not(.locked)').forEach(card => {
        card.addEventListener('click', () => {
            const trainerId = card.getAttribute('data-trainer-id');
            startTrainerBattle(trainerId);
            document.body.removeChild(tournamentPanel);
        });
    });
}

// Function to generate trainer cards HTML
function generateTrainerCards() {
    const trainers = [
        { 
            id: 'brock', 
            name: 'Brock', 
            type: 'Rock', 
            sprite: 'https://i.imgur.com/8JbdIrk.png', 
            pokemon: ['geodude', 'onix'] 
        },
        { 
            id: 'misty', 
            name: 'Misty', 
            type: 'Water', 
            sprite: 'https://i.imgur.com/UIMPQEY.png', 
            pokemon: ['staryu', 'starmie'] 
        },
        { 
            id: 'surge', 
            name: 'Lt. Surge', 
            type: 'Electric', 
            sprite: 'https://i.imgur.com/7NZVPn0.png', 
            pokemon: ['voltorb', 'pikachu', 'raichu'] 
        },
        { 
            id: 'erika', 
            name: 'Erika', 
            type: 'Grass', 
            sprite: 'https://i.imgur.com/IYbIXXs.png', 
            pokemon: ['victreebel', 'tangela', 'vileplume'] 
        },
        { 
            id: 'koga', 
            name: 'Koga', 
            type: 'Poison', 
            sprite: 'https://i.imgur.com/jvBJ0XA.png', 
            pokemon: ['koffing', 'muk', 'weezing'] 
        },
        { 
            id: 'sabrina', 
            name: 'Sabrina', 
            type: 'Psychic', 
            sprite: 'https://i.imgur.com/Kx5TsQS.png', 
            pokemon: ['kadabra', 'mr-mime', 'alakazam'] 
        },
        { 
            id: 'blaine', 
            name: 'Blaine', 
            type: 'Fire', 
            sprite: 'https://i.imgur.com/8yQYrpZ.png', 
            pokemon: ['growlithe', 'ponyta', 'rapidash', 'arcanine'] 
        },
        { 
            id: 'giovanni', 
            name: 'Giovanni', 
            type: 'Ground', 
            sprite: 'https://i.imgur.com/YLhIUL3.png', 
            pokemon: ['rhyhorn', 'dugtrio', 'nidoqueen', 'nidoking'] 
        }
    ];
    
    return trainers.map((trainer, index) => {
        const isDefeated = gameState.tournamentProgress.defeatedTrainers.includes(trainer.id);
        const isLocked = index > gameState.tournamentProgress.badges && index > 0;
        
        return `
            <div class="trainer-card ${isDefeated ? 'defeated' : ''} ${isLocked ? 'locked' : ''}" data-trainer-id="${trainer.id}">
                <img src="${trainer.sprite}" alt="${trainer.name}">
                <h3>${trainer.name}</h3>
                <div class="trainer-type">${trainer.type} Type</div>
                <div class="trainer-pokemon">
                    ${trainer.pokemon.map(p => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(p)}.png" alt="${p}">`).join('')}
                </div>
                ${isDefeated ? '<div class="defeated-badge">✓</div>' : ''}
            </div>
        `;
    }).join('');
}

// Function to generate badges HTML with working badge images
function generateBadges() {
    const badges = [
        { name: 'Boulder Badge', image: 'https://archives.bulbagarden.net/media/upload/d/dd/Boulder_Badge.png' },
        { name: 'Cascade Badge', image: 'https://archives.bulbagarden.net/media/upload/9/9c/Cascade_Badge.png' },
        { name: 'Thunder Badge', image: 'https://archives.bulbagarden.net/media/upload/a/a6/Thunder_Badge.png' },
        { name: 'Rainbow Badge', image: 'https://archives.bulbagarden.net/media/upload/b/b5/Rainbow_Badge.png' },
        { name: 'Soul Badge', image: 'https://archives.bulbagarden.net/media/upload/7/7d/Soul_Badge.png' },
        { name: 'Marsh Badge', image: 'https://archives.bulbagarden.net/media/upload/6/6b/Marsh_Badge.png' },
        { name: 'Volcano Badge', image: 'https://archives.bulbagarden.net/media/upload/1/11/Volcano_Badge.png' },
        { name: 'Earth Badge', image: 'https://archives.bulbagarden.net/media/upload/7/78/Earth_Badge.png' }
    ];
    
    return badges.map((badge, index) => {
        const isEarned = index < gameState.tournamentProgress.badges;
        return `
            <div class="badge ${isEarned ? 'earned' : ''}" title="${badge.name}">
                <img src="${badge.image}" alt="${badge.name}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="badge-label">${badge.name.split(' ')[0]}</span>
            </div>
        `;
    }).join('');
}

// Function to start a trainer battle - add all trainers
function startTrainerBattle(trainerId) {
    const trainers = {
        'brock': { name: 'Brock', pokemon: [createPokemon('geodude', 12), createPokemon('onix', 14)] },
        'misty': { name: 'Misty', pokemon: [createPokemon('staryu', 18), createPokemon('starmie', 21)] },
        'surge': { name: 'Lt. Surge', pokemon: [createPokemon('voltorb', 21), createPokemon('pikachu', 18), createPokemon('raichu', 24)] },
        'erika': { name: 'Erika', pokemon: [createPokemon('victreebel', 29), createPokemon('tangela', 24), createPokemon('vileplume', 29)] },
        'koga': { name: 'Koga', pokemon: [createPokemon('koffing', 37), createPokemon('muk', 39), createPokemon('weezing', 43)] },
        'sabrina': { name: 'Sabrina', pokemon: [createPokemon('kadabra', 38), createPokemon('mr-mime', 37), createPokemon('alakazam', 43)] },
        'blaine': { name: 'Blaine', pokemon: [createPokemon('growlithe', 42), createPokemon('ponyta', 40), createPokemon('rapidash', 42), createPokemon('arcanine', 47)] },
        'giovanni': { name: 'Giovanni', pokemon: [createPokemon('rhyhorn', 45), createPokemon('dugtrio', 42), createPokemon('nidoqueen', 44), createPokemon('nidoking', 50)] }
    };
    
    const trainer = trainers[trainerId];
    gameState.tournamentProgress.currentOpponent = {
        id: trainerId,
        name: trainer.name,
        pokemon: [...trainer.pokemon],
        currentPokemonIndex: 0
    };
    
    // Set the enemy Pokémon to the first Pokémon in the trainer's team
    gameState.enemyPokemon = trainer.pokemon[0];
    
    // Start the battle
    gameState.isBattleActive = true;
    gameState.playerTurn = true;
    
    // Make sure enemy sprite is visible
    elements.enemySprite.style.display = 'block';
    elements.enemySprite.style.animation = '';
    
    // Update the sprite source
    elements.enemySprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(gameState.enemyPokemon.name)}.png`;
    
    // Update the UI
    updateBattleUI();
    
    // Show battle start message
    queueMessage(`Trainer ${trainer.name} wants to battle!`, null, true);
    queueMessage(`${trainer.name} sent out ${gameState.enemyPokemon.name}!`);
    queueMessage(`What will ${gameState.playerPokemon.name} do?`);
}

// Helper function to get badge name
function getBadgeName(trainerId) {
    const badgeNames = {
        'brock': 'Boulder',
        'misty': 'Cascade',
        'surge': 'Thunder',
        'erika': 'Rainbow',
        'koga': 'Soul',
        'sabrina': 'Marsh',
        'blaine': 'Volcano',
        'giovanni': 'Earth'
    };
    
    return badgeNames[trainerId] || 'Unknown';
}

// Update the startGame function
function startGame() {
    // Hide start panel
    elements.startPanel.style.display = 'none';
    
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'flex';
    
    // Simulate loading time
    setTimeout(() => {
        // Fade out loading screen
        loadingScreen.style.opacity = 0;
        
        // Remove loading screen after fade out
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Initialize the game
            initGame();
        }, 1000);
    }, 2000);
}

// Add the missing handleEnemyTurn function
function handleEnemyTurn() {
    if (!gameState.isBattleActive) return;
    
    // Select a random move
    const moveIndex = Math.floor(Math.random() * gameState.enemyPokemon.moves.length);
    const move = gameState.enemyPokemon.moves[moveIndex];
    
    // Show attack message
    queueMessage(`${gameState.enemyPokemon.name} used ${move.name}!`, null, true);
    
    // Calculate damage with type effectiveness
    const damageResult = calculateDamage(
        gameState.enemyPokemon, 
        gameState.playerPokemon, 
        move.type, 
        move.power
    );
    
    // Apply damage
    gameState.playerPokemon.currentHp -= damageResult.damage;
    if (gameState.playerPokemon.currentHp < 0) gameState.playerPokemon.currentHp = 0;
    
    // Show effectiveness message
    if (damageResult.effectiveness > 1) {
        queueMessage("It's super effective!");
        playSound(sounds.superEffective);
    } else if (damageResult.effectiveness < 1 && damageResult.effectiveness > 0) {
        queueMessage("It's not very effective...");
        playSound(sounds.notEffective);
    } else if (damageResult.effectiveness === 0) {
        queueMessage("It has no effect...");
        playSound(sounds.notEffective);
    } else {
        playSound(sounds.hit);
    }
    
    // Show attack animation
    showAttackAnimation(move.type);
    
    // Update the UI
    updateBattleUI();
    
    // Check if player fainted
    if (gameState.playerPokemon.currentHp <= 0) {
        queueMessage(`${gameState.playerPokemon.name} fainted!`);
        
        // Show fainting animation on the correct element
        showFaintingAnimation(elements.playerSprite, () => {
            // Check if player has other Pokémon that can battle
            const hasAlivePokemon = gameState.pokemonTeam.some(pokemon => 
                pokemon !== gameState.playerPokemon && pokemon.currentHp > 0
            );
            
            if (hasAlivePokemon) {
                // Prompt to switch Pokémon
                queueMessage("Choose another Pokémon!", () => {
                    toggleInventory();
                });
            } else {
                // All Pokémon fainted, battle lost
                endBattle(false);
            }
        });
    } else {
        // Player's turn
        gameState.playerTurn = true;
        queueMessage(`What will ${gameState.playerPokemon.name} do?`);
    }
}

// Fix the showFaintingAnimation function
function showFaintingAnimation(pokemonElement, callback) {
    // Make sure we have a valid element
    if (!pokemonElement) {
        console.error("Missing pokemon element for animation");
        if (callback) callback();
        return;
    }
    
    // Reset any existing animation
    pokemonElement.style.animation = 'none';
    
    // Force a reflow to ensure the animation restart
    void pokemonElement.offsetWidth;
    
    // Add the fainting animation class
    pokemonElement.style.animation = 'faint 1.5s forwards';
    
    // Play fainting sound
    playSound(sounds.faint);
    
    console.log("Applying faint animation to:", pokemonElement);
    
    // Execute callback after animation completes
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

// Update handlePlayerTurn to include fainting animation
function handlePlayerTurn(moveIndex) {
    if (!gameState.isBattleActive || !gameState.playerTurn) return;
    
    // Get the selected move
    const move = gameState.playerPokemon.moves[moveIndex];
    
    // Show attack message
    queueMessage(`${gameState.playerPokemon.name} used ${move.name}!`, null, true);
    
    // Calculate damage with type effectiveness
    const damageResult = calculateDamage(
        gameState.playerPokemon, 
        gameState.enemyPokemon, 
        move.type, 
        move.power
    );
    
    // Apply damage
    gameState.enemyPokemon.currentHp -= damageResult.damage;
    if (gameState.enemyPokemon.currentHp < 0) gameState.enemyPokemon.currentHp = 0;
    
    // Show effectiveness message
    if (damageResult.effectiveness > 1) {
        queueMessage("It's super effective!");
        playSound(sounds.superEffective);
    } else if (damageResult.effectiveness < 1 && damageResult.effectiveness > 0) {
        queueMessage("It's not very effective...");
        playSound(sounds.notEffective);
    } else if (damageResult.effectiveness === 0) {
        queueMessage("It has no effect...");
        playSound(sounds.notEffective);
    } else {
        playSound(sounds.hit);
    }
    
    // Show attack animation
    showAttackAnimation(move.type);
    
    // Update the UI
    updateBattleUI();
    
    // Check if enemy fainted
    if (gameState.enemyPokemon.currentHp <= 0) {
        queueMessage(`${gameState.enemyPokemon.name} fainted!`);
        
        // Get the enemy sprite element directly
        const enemySprite = document.getElementById('enemy-sprite');
        console.log("Enemy sprite element:", enemySprite);
        
        // Show fainting animation
        showFaintingAnimation(enemySprite, () => {
            // Add a delay before ending the battle
            setTimeout(() => {
                endBattle(true);
            }, 500);
        });
    } else {
        // Enemy's turn
        gameState.playerTurn = false;
        
        // Enemy attacks after a delay
        setTimeout(() => {
            handleEnemyTurn();
        }, 1500);
    }
}

// Update handleEnemyTurn to include fainting animation
function handleEnemyTurn() {
    if (!gameState.isBattleActive) return;
    
    // Select a random move
    const moveIndex = Math.floor(Math.random() * gameState.enemyPokemon.moves.length);
    const move = gameState.enemyPokemon.moves[moveIndex];
    
    // Show attack message
    queueMessage(`${gameState.enemyPokemon.name} used ${move.name}!`, null, true);
    
    // Calculate damage with type effectiveness
    const damageResult = calculateDamage(
        gameState.enemyPokemon, 
        gameState.playerPokemon, 
        move.type, 
        move.power
    );
    
    // Apply damage
    gameState.playerPokemon.currentHp -= damageResult.damage;
    if (gameState.playerPokemon.currentHp < 0) gameState.playerPokemon.currentHp = 0;
    
    // Show effectiveness message
    if (damageResult.effectiveness > 1) {
        queueMessage("It's super effective!");
        playSound(sounds.superEffective);
    } else if (damageResult.effectiveness < 1 && damageResult.effectiveness > 0) {
        queueMessage("It's not very effective...");
        playSound(sounds.notEffective);
    } else if (damageResult.effectiveness === 0) {
        queueMessage("It has no effect...");
        playSound(sounds.notEffective);
    } else {
        playSound(sounds.hit);
    }
    
    // Show attack animation
    showAttackAnimation(move.type);
    
    // Update the UI
    updateBattleUI();
    
    // Check if player fainted
    if (gameState.playerPokemon.currentHp <= 0) {
        queueMessage(`${gameState.playerPokemon.name} fainted!`);
        
        // Show fainting animation
        showFaintingAnimation(elements.enemySprite, () => {
            // Check if player has other Pokémon that can battle
            const hasAlivePokemon = gameState.pokemonTeam.some(pokemon => 
                pokemon !== gameState.playerPokemon && pokemon.currentHp > 0
            );
            
            if (hasAlivePokemon) {
                // Prompt to switch Pokémon
                queueMessage("Choose another Pokémon!", () => {
                    toggleInventory();
                });
            } else {
                // All Pokémon fainted, battle lost
                endBattle(false);
            }
        });
    } else {
        // Player's turn
        gameState.playerTurn = true;
        queueMessage(`What will ${gameState.playerPokemon.name} do?`);
    }
}

// Update the createPokemon function to start at level 10
function createPokemon(name, level = 10) {
    // Get the base Pokémon data
    const baseData = pokemonData[name];
    if (!baseData) return null;
    
    // Ensure baseHp, baseAttack, and baseDefense exist with default values if missing
    const baseHp = baseData.baseHp || 50;
    const baseAttack = baseData.baseAttack || 45;
    const baseDefense = baseData.baseDefense || 45;
    
    // Calculate stats based on level (simplified formula)
    const hp = Math.floor((baseHp * level) / 50) + level + 10;
    const attack = Math.floor((baseAttack * level) / 50) + 5;
    const defense = Math.floor((baseDefense * level) / 50) + 5;
    
    // Create the Pokémon object
    const pokemon = {
        name: baseData.name,
        level: level,
        type: baseData.type,
        maxHp: hp,
        currentHp: hp,
        attack: attack,
        defense: defense,
        sprite: baseData.sprite,
        backSprite: baseData.backSprite || baseData.sprite, // Fallback if backSprite is missing
        moves: baseData.moves || [
            { name: "Tackle", type: "normal", power: 40 },
            { name: "Growl", type: "normal", power: 0 }
        ],
        evolution: baseData.evolution,
        evolutionLevel: baseData.evolutionLevel,
        isShiny: Math.random() < 0.01 // 1% chance of being shiny
    };
    
    // If it's shiny, use the shiny sprite if available
    if (pokemon.isShiny && baseData.shinySprite) {
        pokemon.sprite = baseData.shinySprite;
    }
    
    return pokemon;
}

// Add a direct CSS animation to the HTML
function addFaintingStyles() {
    // Create a style element if it doesn't exist
    let styleElement = document.getElementById('dynamic-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-styles';
        document.head.appendChild(styleElement);
    }
    
    // Add the faint animation CSS
    styleElement.textContent = `
        @keyframes faint {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            20% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(30px);
                opacity: 0.7;
            }
            100% {
                transform: translateY(60px);
                opacity: 0;
            }
        }
        
        .faint-animation {
            animation: faint 1.5s forwards !important;
        }
    `;
}

// Update the showFaintingAnimation function to use a class instead of inline style
function showFaintingAnimation(pokemonElement, callback) {
    // Make sure we have a valid element
    if (!pokemonElement) {
        console.error("Missing pokemon element for animation");
        if (callback) callback();
        return;
    }
    
    console.log("Applying faint animation to:", pokemonElement);
    
    // Ensure the faint animation styles are added
    addFaintingStyles();
    
    // Remove any existing animation classes
    pokemonElement.classList.remove('faint-animation');
    
    // Force a reflow
    void pokemonElement.offsetWidth;
    
    // Add the animation class
    pokemonElement.classList.add('faint-animation');
    
    // Play fainting sound
    playSound(sounds.faint);
    
    // Execute callback after animation completes
    setTimeout(() => {
        if (callback) callback();
    }, 1500);
}

// Add tournament trainers and badges data with reliable image sources
const tournamentData = {
    trainers: [
        {
            name: "Brock",
            title: "Rock-Solid Trainer",
            sprite: "https://archives.bulbagarden.net/media/upload/6/65/Spr_FRLG_Brock.png",
            badge: {
                name: "Boulder Badge",
                image: "https://archives.bulbagarden.net/media/upload/d/dd/Boulder_Badge.png"
            },
            team: [
                { name: "Geodude", level: 12 },
                { name: "Onix", level: 14 }
            ],
            quote: "I'm Brock! I'm an expert on Rock-type Pokémon!"
        },
        {
            name: "Misty",
            title: "The Tomboyish Mermaid",
            sprite: "https://archives.bulbagarden.net/media/upload/b/b8/Spr_FRLG_Misty.png",
            badge: {
                name: "Cascade Badge",
                image: "https://archives.bulbagarden.net/media/upload/9/9c/Cascade_Badge.png"
            },
            team: [
                { name: "Staryu", level: 18 },
                { name: "Starmie", level: 21 }
            ],
            quote: "I'm Misty! My Water Pokémon will wash you away!"
        },
        {
            name: "Lt. Surge",
            title: "The Lightning American",
            sprite: "https://archives.bulbagarden.net/media/upload/3/3b/Spr_FRLG_Lt_Surge.png",
            badge: {
                name: "Thunder Badge",
                image: "https://archives.bulbagarden.net/media/upload/a/a6/Thunder_Badge.png"
            },
            team: [
                { name: "Voltorb", level: 21 },
                { name: "Pikachu", level: 18 },
                { name: "Raichu", level: 24 }
            ],
            quote: "I'm Lt. Surge! My Electric Pokémon saved me during the war!"
        },
        {
            name: "Erika",
            title: "The Nature-Loving Princess",
            sprite: "https://archives.bulbagarden.net/media/upload/0/0f/Spr_FRLG_Erika.png",
            badge: {
                name: "Rainbow Badge",
                image: "https://archives.bulbagarden.net/media/upload/b/b5/Rainbow_Badge.png"
            },
            team: [
                { name: "Victreebel", level: 29 },
                { name: "Tangela", level: 24 },
                { name: "Vileplume", level: 29 }
            ],
            quote: "I am Erika of Celadon City Gym. I teach the art of flower arranging and use Grass-type Pokémon."
        },
        {
            name: "Koga",
            title: "The Poisonous Ninja Master",
            sprite: "https://archives.bulbagarden.net/media/upload/f/f9/Spr_FRLG_Koga.png",
            badge: {
                name: "Soul Badge",
                image: "https://archives.bulbagarden.net/media/upload/7/7d/Soul_Badge.png"
            },
            team: [
                { name: "Koffing", level: 37 },
                { name: "Muk", level: 39 },
                { name: "Koffing", level: 37 },
                { name: "Weezing", level: 43 }
            ],
            quote: "I am Koga of Fuchsia Gym! I am a ninja master and use Poison-type Pokémon!"
        },
        {
            name: "Sabrina",
            title: "The Master of Psychic Pokémon",
            sprite: "https://archives.bulbagarden.net/media/upload/9/9d/Spr_FRLG_Sabrina.png",
            badge: {
                name: "Marsh Badge",
                image: "https://archives.bulbagarden.net/media/upload/6/6b/Marsh_Badge.png"
            },
            team: [
                { name: "Kadabra", level: 38 },
                { name: "Mr. Mime", level: 37 },
                { name: "Venomoth", level: 38 },
                { name: "Alakazam", level: 43 }
            ],
            quote: "I'm Sabrina! I have had psychic powers since I was a child."
        },
        {
            name: "Blaine",
            title: "The Hotheaded Quiz Master",
            sprite: "https://archives.bulbagarden.net/media/upload/0/0b/Spr_FRLG_Blaine.png",
            badge: {
                name: "Volcano Badge",
                image: "https://archives.bulbagarden.net/media/upload/1/11/Volcano_Badge.png"
            },
            team: [
                { name: "Growlithe", level: 42 },
                { name: "Ponyta", level: 40 },
                { name: "Rapidash", level: 42 },
                { name: "Arcanine", level: 47 }
            ],
            quote: "I am Blaine! I am the leader of Cinnabar Gym! My fiery Pokémon will incinerate all challengers!"
        },
        {
            name: "Giovanni",
            title: "The Self-Proclaimed Strongest Trainer",
            sprite: "https://archives.bulbagarden.net/media/upload/c/c5/Spr_FRLG_Giovanni.png",
            badge: {
                name: "Earth Badge",
                image: "https://archives.bulbagarden.net/media/upload/7/78/Earth_Badge.png"
            },
            team: [
                { name: "Rhyhorn", level: 45 },
                { name: "Dugtrio", level: 42 },
                { name: "Nidoqueen", level: 44 },
                { name: "Nidoking", level: 45 },
                { name: "Rhydon", level: 50 }
            ],
            quote: "I am Giovanni, the leader of Team Rocket and the Viridian City Gym Leader!"
        }
    ]
};

// Update the trainer card in the updateTournamentPanel function
function updateTournamentPanel() {
    const tournamentPanel = document.getElementById('tournament-panel');
    if (!tournamentPanel) return;
    
    // Get the next trainer to battle
    const nextTrainerIndex = gameState.tournamentProgress.badges;
    const nextTrainer = tournamentData.trainers[nextTrainerIndex];
    
    // If all trainers are defeated, show victory screen
    if (!nextTrainer) {
        tournamentPanel.innerHTML = `
            <div class="tournament-complete">
                <h2>Congratulations!</h2>
                <p>You have defeated all gym leaders and earned all badges!</p>
                <div class="badge-collection">
                    ${generateBadges()}
                </div>
                <button id="restart-tournament" class="btn">Restart Tournament</button>
            </div>
        `;
        
        document.getElementById('restart-tournament').addEventListener('click', () => {
            gameState.tournamentProgress.badges = 0;
            gameState.tournamentProgress.defeatedTrainers = [];
            updateTournamentPanel();
        });
        
        return;
    }
    
    // Show the next trainer and badges
    tournamentPanel.innerHTML = `
        <div class="tournament-info">
            <h2>Pokémon League Challenge</h2>
            <p>Defeat all 8 gym leaders to become a Pokémon Master!</p>
            
            <div class="badge-collection">
                ${generateBadges()}
            </div>
            
            <div class="next-battle">
                <h3>Next Challenge:</h3>
                <div class="trainer-card">
                    <img src="${nextTrainer.sprite}" alt="${nextTrainer.name}" class="trainer-sprite" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                    <div class="trainer-info">
                        <h4>${nextTrainer.name}</h4>
                        <p>${nextTrainer.title}</p>
                        <p class="trainer-quote">"${nextTrainer.quote}"</p>
                        <button id="challenge-trainer" class="btn">Challenge</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to the challenge button
    document.getElementById('challenge-trainer').addEventListener('click', () => {
        startTrainerBattle(nextTrainer);
    });
} 