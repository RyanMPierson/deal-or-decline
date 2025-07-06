# Sound Files for Deal or Decline Game

This game now includes sound effects! To complete the audio experience, you'll need to add the following sound files to the `sounds/` directory:

## Required Sound Files:

### 1. Card Flip Sound (`card-flip.mp3` or `card-flip.wav`)
- **Description**: A quick card flipping/turning sound
- **When played**: When a card is revealed/eliminated
- **Suggestion**: A crisp paper flip or card snap sound (0.5-1 second)

### 2. Card Select Sound (`card-select.mp3` or `card-select.wav`)
- **Description**: A confirmation sound for selecting the player's lucky card
- **When played**: When the player chooses their initial card
- **Suggestion**: A gentle "ding" or positive chime (0.5-1 second)

### 3. Offer Sound (`offer.mp3` or `offer.wav`)
- **Description**: Dramatic sound when the dealer makes an offer
- **When played**: When the dealer's offer appears
- **Suggestion**: Drum roll or suspenseful musical sting (1-2 seconds)

### 4. Deal Sound (`deal.mp3` or `deal.wav`)
- **Description**: Sound for accepting the dealer's offer
- **When played**: When the player clicks "DEAL"
- **Suggestion**: Cash register or "cha-ching" sound (1-2 seconds)

### 5. Decline Sound (`decline.mp3` or `decline.wav`)
- **Description**: Sound for declining the dealer's offer
- **When played**: When the player clicks "DECLINE"
- **Suggestion**: A firm "no" or rejection sound (0.5-1 second)

### 6. Win Sound (`win.mp3` or `win.wav`)
- **Description**: Celebratory sound for good outcomes
- **When played**: When you make a smart decision (accept a good deal OR decline and your card beats the final card)
- **Suggestion**: Victory fanfare or celebration music (2-3 seconds)

### 7. Lose Sound (`lose.mp3` or `lose.wav`)
- **Description**: Sound for poor outcomes  
- **When played**: When you make a bad decision (accept a bad deal OR decline and your card loses to the final card)
- **Suggestion**: "Aww" or disappointed sound (1-2 seconds)

### 8. Background Music (`background.mp3` or `background.wav`)
- **Description**: Ambient background music for the game
- **When played**: Continuously during gameplay (loops)
- **Suggestion**: Suspenseful, game show-style music (30+ seconds, seamless loop)

## Sound Controls:

The game includes two sound control buttons:
- **🎵** - Toggle background music on/off
- **🔊** - Toggle sound effects on/off

## Where to Find Sounds:

You can find free game sounds at:
- **Freesound.org** (requires free account)
- **Zapsplat.com** (requires free account)
- **OpenGameArt.org**
- **BBC Sound Effects Library**

Or create your own using:
- **Audacity** (free audio editor)
- **Online tone generators** for simple beeps/chimes

## File Format Notes:

- Both MP3 and WAV formats are supported
- Keep file sizes reasonable (under 1MB each for sound effects)
- Background music can be larger but should still be web-optimized
- Make sure sounds are normalized to prevent volume spikes

## Technical Notes:

- The game automatically detects if audio files are available and properly loaded
- If audio files fail to play (due to browser policies or missing files), synthesized fallback sounds are used
- Sound overlap prevention ensures only one instance of each sound plays at a time
- The system gracefully handles browser autoplay restrictions

The game will work without these files, but adding them will greatly enhance the player experience!
