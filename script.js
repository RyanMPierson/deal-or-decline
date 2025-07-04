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
            updateGameMessage();
        } else if (gameState === 'eliminating' && cardsToEliminate > 0) {
            revealCard(card);
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
    }

    function endGame(tookDeal, dealValue = null) {
        if (gameState === 'end') return;
        gameState = 'end';

        dealerSection.classList.add('hidden');
        
        if (playerCard && playerCard.element) {
            revealCard(playerCard);
            if (tookDeal) {
                gameMessage.innerHTML = `You accepted the deal of ${formatCurrency(dealValue)}! <br> Your card had ${formatCurrency(playerCard.value)}.`;
            } else {
                // Reveal the last remaining card on the board for comparison
                const lastCard = cards.find(c => !c.eliminated);
                if (lastCard) {
                   revealCard(lastCard);
                }
                gameMessage.innerHTML = `You DECLINED! You won ${formatCurrency(playerCard.value)}!`;
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
    });
    
    // --- UPDATED LOGIC ---
    declineButton.addEventListener('click', () => {
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

    // --- Start the game ---
    initGame();
});