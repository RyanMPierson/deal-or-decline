document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const grid = document.getElementById('card-grid');
    const playerCardArea = document.getElementById('player-card-area');
    const gameMessage = document.getElementById('game-message');
    const dealerSection = document.getElementById('dealer-section');
    const offerAmount = document.getElementById('offer-amount');
    const dealButton = document.getElementById('deal-button');
    const declineButton = document.getElementById('decline-button');
    const moneyBoard = document.getElementById('money-board');
    const musicToggle = document.getElementById('music-toggle');
    const sfxToggle = document.getElementById('sfx-toggle');

    // --- Sound Management ---
    const sounds = {
        cardFlip: document.getElementById('card-flip-sound'),
        cardSelect: document.getElementById('card-select-sound'),
        offer: document.getElementById('offer-sound'),
        deal: document.getElementById('deal-sound'),
        decline: document.getElementById('decline-sound'),
        win: document.getElementById('win-sound'),
        lose: document.getElementById('lose-sound'),
        background: document.getElementById('background-music')
    };

    let musicEnabled = true;
    let sfxEnabled = true;
    let fallbackSounds = null;
    let lastSoundPlayed = {};

    // Initialize fallback sounds
    if (window.FallbackSounds) {
        fallbackSounds = new FallbackSounds();
    }

    function playSound(soundName) {
        if (!sfxEnabled && soundName !== 'background') return;
        if (!musicEnabled && soundName === 'background') return;
        
        // Prevent playing the same sound too frequently
        const now = Date.now();
        if (lastSoundPlayed[soundName] && (now - lastSoundPlayed[soundName]) < 100) {
            return;
        }
        lastSoundPlayed[soundName] = now;
        
        const sound = sounds[soundName];
        
        // Check if audio file exists and has loaded content
        if (sound && sound.readyState >= 2 && sound.duration > 0) {
            // Audio file is loaded and has actual content
            sound.currentTime = 0;
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Audio file play failed, trying fallback:', e);
                    // Add a small delay before fallback to prevent overlap
                    setTimeout(() => playFallbackSound(soundName), 50);
                });
            }
        } else {
            // Audio file not available or not loaded, use fallback
            playFallbackSound(soundName);
        }
    }

    function playFallbackSound(soundName) {
        if (!fallbackSounds || soundName === 'background') return;
        
        // Check if we already played this sound recently to prevent overlaps
        const now = Date.now();
        if (lastSoundPlayed[soundName + '_fallback'] && (now - lastSoundPlayed[soundName + '_fallback']) < 200) {
            return;
        }
        lastSoundPlayed[soundName + '_fallback'] = now;
        
        switch(soundName) {
            case 'cardFlip':
                fallbackSounds.cardFlip();
                break;
            case 'cardSelect':
                fallbackSounds.cardSelect();
                break;
            case 'offer':
                fallbackSounds.offer();
                break;
            case 'deal':
                fallbackSounds.deal();
                break;
            case 'decline':
                fallbackSounds.decline();
                break;
            case 'win':
                fallbackSounds.win();
                break;
            case 'lose':
                fallbackSounds.lose();
                break;
        }
    }

    function toggleMusic() {
        musicEnabled = !musicEnabled;
        musicToggle.classList.toggle('muted', !musicEnabled);
        musicToggle.textContent = musicEnabled ? '🎵' : '🔇';
        
        if (musicEnabled) {
            playSound('background');
        } else {
            sounds.background.pause();
        }
    }

    function toggleSFX() {
        sfxEnabled = !sfxEnabled;
        sfxToggle.classList.toggle('muted', !sfxEnabled);
        sfxToggle.textContent = sfxEnabled ? '🔊' : '🔇';
    }

    // Set initial volume levels
    sounds.background.volume = 0.3;
    Object.keys(sounds).forEach(key => {
        if (key !== 'background') {
            sounds[key].volume = 0.7;
        }
    });

    // --- Game Configuration ---
    const amounts = [
        0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000,
        10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000
    ];
    // This array now correctly reflects the number of picks per round.
    const rounds = [6, 5, 4, 3, 2, 1, 1, 1, 1];
    const totalCards = amounts.length;

    // --- Game State ---
    let cards = [];
    let playerCard = null;
    let currentRound = 0;
    let cardsToEliminate = 0;
    let gameState = 'picking';

    function initGame() {
        gameState = 'picking';
        currentRound = 0;
        cardsToEliminate = rounds[currentRound];
        playerCard = null;
        
        dealerSection.classList.add('hidden');
        playerCardArea.innerHTML = '';
        grid.innerHTML = '';
        moneyBoard.innerHTML = '';
        
        // Start background music
        playSound('background');
        
        let shuffledAmounts = [...amounts];
        shuffle(shuffledAmounts);
        
        const sortedAmounts = [...amounts].sort((a, b) => a - b);
        sortedAmounts.forEach(amount => {
            const valueDiv = document.createElement('div');
            valueDiv.classList.add('money-value');
            valueDiv.dataset.value = amount;
            valueDiv.textContent = formatCurrency(amount);
            moneyBoard.appendChild(valueDiv);
        });

        cards = [];
        for (let i = 0; i < totalCards; i++) {
            const card = {
                id: i,
                value: shuffledAmounts[i],
                element: createCardElement(i),
                eliminated: false,
            };
            cards.push(card);
            grid.appendChild(card.element);
        }
        
        updateGameMessage();
    }

    function createCardElement(id) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.dataset.id = id;

        const inner = document.createElement('div');
        inner.classList.add('card-inner');

        const front = document.createElement('div');
        front.classList.add('card-front');
        front.textContent = id + 1;

        const back = document.createElement('div');
        back.classList.add('card-back');
        
        inner.appendChild(front);
        inner.appendChild(back);
        cardDiv.appendChild(inner);

        cardDiv.addEventListener('click', () => onCardClick(id));
        return cardDiv;
    }

    function revealCard(card) {
        card.eliminated = true;
        card.element.querySelector('.card-back').textContent = formatCurrency(card.value);
        card.element.classList.add('flipped', 'eliminated');
        
        // Play card flip sound
        playSound('cardFlip');
        
        const moneyValueDiv = moneyBoard.querySelector(`[data-value='${card.value}']`);
        if(moneyValueDiv) {
            moneyValueDiv.classList.add('eliminated');
        }
    }

    // --- UPDATED LOGIC ---
    function onCardClick(id) {
        const card = cards.find(c => c.id === id);
        if (!card || card.eliminated || (playerCard && playerCard.id === id)) return;

        if (gameState === 'picking') {
            playerCard = card;
            card.eliminated = true;
            playerCardArea.appendChild(card.element);
            gameState = 'eliminating';
            
            // Play card select sound
            playSound('cardSelect');
            
            updateGameMessage();
        } else if (gameState === 'eliminating' && cardsToEliminate > 0) {
            revealCard(card);
            playSound('cardFlip');
            cardsToEliminate--;
            // After a pick, if the round is over, always make an offer.
            // The decision to end the game is now handled by the "Decline" button logic.
            if (cardsToEliminate === 0) {
                gameState = 'offer';
                setTimeout(makeOffer, 1500);
            } else {
                updateGameMessage();
            }
        }
    }

    function makeOffer() {
        let remainingSum = 0;
        let remainingCount = 0;
        cards.forEach(c => {
            if (!c.eliminated) {
                remainingSum += c.value;
                remainingCount++;
            }
        });

        const average = remainingSum / remainingCount;
        const offer = Math.round(average * (currentRound * 0.12 + 0.2));

        offerAmount.textContent = formatCurrency(offer);
        gameMessage.textContent = "The Dealer offers you...";
        dealerSection.classList.remove('hidden');
        playSound('offer');
    }

    function endGame(tookDeal, dealValue = null) {
        if (gameState === 'end') return;
        gameState = 'end';

        dealerSection.classList.add('hidden');
        
        if (playerCard && playerCard.element) {
            revealCard(playerCard);
            if (tookDeal) {
                gameMessage.innerHTML = `You accepted the deal of ${formatCurrency(dealValue)}! <br> Your card had ${formatCurrency(playerCard.value)}.`;
                // Play win sound if deal was better than player's card, lose if not
                if (dealValue > playerCard.value) {
                    playSound('win');
                } else {
                    playSound('lose');
                }
            } else {
                // Reveal the last remaining card on the board for comparison
                const lastCard = cards.find(c => !c.eliminated);
                if (lastCard) {
                   revealCard(lastCard);
                }
                
                // Compare player's card to the final card and show appropriate message
                if (lastCard && playerCard.value > lastCard.value) {
                    gameMessage.innerHTML = `You DECLINED and WON! Your card (${formatCurrency(playerCard.value)}) beat the final card (${formatCurrency(lastCard.value)})!`;
                    playSound('win');
                } else if (lastCard) {
                    gameMessage.innerHTML = `You DECLINED but LOST! Your card (${formatCurrency(playerCard.value)}) was less than the final card (${formatCurrency(lastCard.value)}).`;
                    playSound('lose');
                } else {
                    // Fallback if no final card found
                    gameMessage.innerHTML = `You DECLINED! You won ${formatCurrency(playerCard.value)}!`;
                    playSound('win');
                }
            }
        } else {
             gameMessage.innerHTML = `Something went wrong! Please play again.`;
        }
        
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.marginTop = '20px';
        playAgainButton.addEventListener('click', initGame);
        gameMessage.appendChild(playAgainButton);
    }
    
    function updateGameMessage() {
        if (gameState === 'picking') {
            gameMessage.textContent = 'First, choose your lucky card.';
        } else if (gameState === 'eliminating') {
            gameMessage.textContent = `Now, open ${cardsToEliminate} card${cardsToEliminate > 1 ? 's' : ''}.`;
        }
    }
    
    function formatCurrency(amount) {
        if (typeof amount !== 'number') return '';
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Event Listeners ---
    dealButton.addEventListener('click', () => {
        const dealValue = parseFloat(offerAmount.textContent.replace(/[$,]/g, ''));
        endGame(true, dealValue);
        playSound('deal');
    });
    
    // --- UPDATED LOGIC ---
    declineButton.addEventListener('click', () => {
        playSound('decline');
        dealerSection.classList.add('hidden');
        
        // Check how many cards are left on the board (excluding player's card)
        const remainingOnBoard = cards.filter(c => !c.eliminated && c.id !== playerCard.id).length;

        // If the player declines the offer when only ONE card is left on the board, end the game.
        if (remainingOnBoard <= 1) {
            endGame(false);
        } else {
            // Otherwise, continue to the next round.
            currentRound++;
            cardsToEliminate = rounds[currentRound];
            gameState = 'eliminating';
            updateGameMessage();
        }
    });

    // --- Sound Control Event Listeners ---
    musicToggle.addEventListener('click', toggleMusic);
    sfxToggle.addEventListener('click', toggleSFX);

    // --- Start the game ---
    initGame();
});