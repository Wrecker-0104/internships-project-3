class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'pvp'; // 'pvp' or 'pva' (player vs AI)
        this.score = { X: 0, O: 0, draw: 0 };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.updateDisplay();
    }
    
    bindEvents() {
        // Game board clicks
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.handleCellClick(e.target);
            }
        });
        
        // Game mode buttons
        document.getElementById('player-vs-player').addEventListener('click', () => {
            this.setGameMode('pvp');
        });
        
        document.getElementById('player-vs-ai').addEventListener('click', () => {
            this.setGameMode('pva');
        });
        
        // Control buttons
        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('reset-score').addEventListener('click', () => {
            this.resetScore();
        });
    }
    
    handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index, this.currentPlayer);
        
        if (this.gameActive && this.gameMode === 'pva' && this.currentPlayer === 'O') {
            // AI turn
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        this.updateCell(index, player);
        
        if (this.checkWinner()) {
            this.endGame(`Player ${player} wins!`);
            this.score[player]++;
        } else if (this.checkDraw()) {
            this.endGame("It's a draw!");
            this.score.draw++;
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
        
        this.updateDisplay();
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.findBestMove();
        this.makeMove(bestMove, 'O');
    }
    
    findBestMove() {
        // Check if AI can win
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Check if AI needs to block player
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWinner()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // Take center if available
        if (this.board[4] === '') {
            return 4;
        }
        
        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(i => this.board[i] === '');
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }
        
        // Fallback to any available cell
        const availableCells = this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    
    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.highlightWinningCells(condition);
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    highlightWinningCells(winningCells) {
        winningCells.forEach(index => {
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add('winning-line');
        });
    }
    
    updateCell(index, player) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        cell.classList.add('disabled');
    }
    
    updateDisplay() {
        // Update current player display
        document.getElementById('current-player-display').textContent = this.currentPlayer;
        
        // Update score
        document.getElementById('score-x').textContent = this.score.X;
        document.getElementById('score-o').textContent = this.score.O;
        document.getElementById('score-draw').textContent = this.score.draw;
        
        // Update game status
        const statusElement = document.getElementById('game-status');
        if (!this.gameActive) {
            statusElement.classList.add('winner');
        } else {
            statusElement.classList.remove('winner', 'draw');
            if (this.gameMode === 'pva' && this.currentPlayer === 'O') {
                statusElement.textContent = 'AI is thinking...';
            } else {
                statusElement.textContent = '';
            }
        }
    }
    
    endGame(message) {
        this.gameActive = false;
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = message;
        
        if (message.includes('draw')) {
            statusElement.classList.add('draw');
        } else {
            statusElement.classList.add('winner');
        }
        
        // Disable all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('disabled');
        });
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Clear all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        // Clear game status
        const statusElement = document.getElementById('game-status');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
        
        this.updateDisplay();
    }
    
    resetScore() {
        this.score = { X: 0, O: 0, draw: 0 };
        this.updateDisplay();
    }
    
    setGameMode(mode) {
        this.gameMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (mode === 'pvp') {
            document.getElementById('player-vs-player').classList.add('active');
        } else {
            document.getElementById('player-vs-ai').classList.add('active');
        }
        
        this.resetGame();
        this.resetScore();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
