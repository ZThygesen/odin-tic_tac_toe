const Player = (name, letter) => {
    this.name = name;
    this.letter = letter;
    let score = 0;

    const getName = () => {
        return name;
    };

    const getLetter = () => {
        return letter;
    };

    const win = () => {
        score++;
    }

    const getScore = () => {
        return score;
    }

    return { getName, getLetter, win, getScore };
};

const displayController = (() => {
    const docBoard = document.querySelector('.board');
    const createBoard = () => {
        for (let i = 0; i < 9; i++) {
            let square = document.createElement('div');
            square.className = `square ${i}`;
            square.addEventListener('click', (e) => { gameFlow.makeMove(e.target.classList[1]); });
            docBoard.appendChild(square);
        }
    };

    const updateBoard = () => {
        for (let i = 0; i < 9; i++) {
            const square = document.getElementsByClassName(`square ${i}`);
            square[0].textContent = gameBoard.getSquare(i);
        }
    };

    const message = document.querySelector('.message');
    const setMessage = (msg) => {
        message.textContent = msg;
    };

    const setSquare = (square, letter) => {
        square.textContent = letter;
    };

    const restart = document.querySelector('.restart');
    restart.addEventListener('click', () => gameFlow.restart());

    const clearBoard = () => {
        for (let i = 0; i < 9; i++) {
            gameBoard.setSquare(i, '');
        }

        updateBoard();
    };

    const name1 = document.querySelector('.left > .player');
    const score1 = document.querySelector('.left > .player-score');
    const name2 = document.querySelector('.right > .player');
    const score2 = document.querySelector('.right > .player-score');
    const updateScore = (playerOne, playerTwo) => {
        name1.textContent = playerOne.getName();
        score1.textContent = playerOne.getScore();
        name2.textContent = playerTwo.getName();
        score2.textContent = playerTwo.getScore();
    };

    return {
        createBoard,
        updateBoard,
        setMessage,
        setSquare,
        clearBoard,
        updateScore
    };
})();

const gameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const setSquare = (index, letter) => {
        board[index] = letter;
    }

    const getSquare = (index) => {
        return board[index];
    }

    return {
        setSquare,
        getSquare
    };
})();

const changeMode = (() => {
    let mode;
    const modeSelect = document.querySelector('#mode');
    modeSelect.addEventListener('change', (e) => {
        switch (e.target.value) {
            case ('computer'):
                mode = 0;
                break;
            case ('two-player'):
                mode = 1;
                break;
            case ('unbeatable'):
                mode = 2;
                break;
        }
        gameFlow.changeMode(mode);
    });

    const getMode = () => {
        return mode;
    }
    
    return {
        getMode
    }
})();

const gameFlow = (() => {
    let playerOne = Player('You', 'X');
    let playerTwo = Player('Computer', 'O');

    let round = 1;
    let currPlayer = playerOne;
    let gameOver = false;
    let gameMode = 0;

    let availableSpaces = [];

    displayController.createBoard();

    const makeMove = (square) => {
        if (occupied(square) || gameOver) { return; }

        gameBoard.setSquare(square, currPlayer.getLetter());
        displayController.updateBoard();

        for (let i = 0; i < 9; i++) {
            if (gameBoard.getSquare(i) === '') { availableSpaces.push(i); }
        }

        console.log(availableSpaces);

        switch (gameMode) {
            case (0):
                playerVsComputer();
                break;
            case (1):
                playerVsPlayer();
                break;
            case (2):
                unbeatable();
                break;
        }

        availableSpaces = [];
    };

    const occupied = (index) => {
        return gameBoard.getSquare(index) === 'X' || gameBoard.getSquare(index) === 'O';
    };

    const possibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const playerWon = () => {
        for (let i = 0; i < possibilities.length; i++) {
            if (gameOver) { 
                currPlayer.win();
                displayController.updateScore(playerOne, playerTwo);
                break; 
            }
            for (let j = 0; j < possibilities[i].length; j++) {
                if (gameBoard.getSquare(possibilities[i][j]) === currPlayer.getLetter()) {
                    gameOver = true;
                    continue;
                }
                else {
                    gameOver = false; 
                    break; 
                }
            }
        }
        return gameOver;
    };

    const restart = () => {
        displayController.clearBoard();
        round = 1;
        currPlayer = playerOne;
        gameOver = false;

        if (gameMode === 1) {
            displayController.setMessage(`${currPlayer.getName()}'s turn`);
        } else {  
            displayController.setMessage('You vs Computer');
        }
    };

    const modal = document.querySelector('.modal');
    const submit = document.querySelector('#submit');
    const inputOne = document.querySelector('#player-one');
    const inputTwo = document.querySelector('#player-two');
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        updatePlayers(inputOne.value, inputTwo.value);
        modal.style.display = 'none';
        inputOne.value = '';
        inputTwo.value = '';
        displayController.setMessage(`${currPlayer.getName()}'s turn`);
    });
    const close = document.querySelector('#close');
    close.addEventListener('click', () => { 
        modal.style.display = 'none';
        updatePlayers('X', 'O');
        displayController.setMessage(`${currPlayer.getName()}'s turn`);
    });

    const changeMode = (mode) => {
        gameMode = mode;
        restart();
        switch (gameMode) {
            case(0):
                updatePlayers('You', 'Computer');
                break;
            case(1):
                modal.style.display = 'block';
                displayController.setMessage('Awaiting player names');
                break;
            case(2):
                updatePlayers('You', 'Computer');
                break;
        }
    };

    const updatePlayers = (name1, name2) => {
        playerOne = Player(name1, 'X');
        playerTwo = Player(name2, 'O');
        currPlayer = playerOne;
        displayController.updateScore(playerOne, playerTwo);
    }

    const playerVsComputer = () => {
        if (playerWon()) {
            displayController.setMessage(`${currPlayer.getName() === 'You' ? 'You win!' : 'Computer wins!'}`);
        } else if (round === 9) {
            gameOver = true;
            displayController.setMessage(`Tie!`);
        }
        else {
            currPlayer = (round % 2 === 0) ? playerOne : playerTwo;
            round++;
            computerPlay();
        }
    };

    const playerVsPlayer = () => {
        if (playerWon()) {
            displayController.setMessage(`${currPlayer.getName()} wins!`);
        } else if (round === 9) {
            gameOver = true;
            displayController.setMessage(`Tie!`);
        }
        else {
            currPlayer = (round % 2 === 0) ? playerOne : playerTwo;
            round++;
            displayController.setMessage(`${currPlayer.getName()}'s turn`);
        }
    };

    const unbeatable = () => {
        if (playerWon()) {
            displayController.setMessage(`${currPlayer.getName() === 'You' ? 'You win!' : 'Computer wins!'}`);
        } else if (round === 9) {
            gameOver = true;
            displayController.setMessage(`Tie!`);
        }
        else {
            currPlayer = (round % 2 === 0) ? playerOne : playerTwo;
            round++;
            computerPlay();
        }
    };

    const computerPlay = () => {
        if (gameMode === 0) {
            let play = Math.floor(Math.random() * availableSpaces.length);
            gameBoard.setSquare(availableSpaces[play], currPlayer.getLetter());
            displayController.updateBoard();
            if (playerWon()) {
                displayController.setMessage(`${currPlayer.getName()} wins!`);
            } else if (round === 9) {
                gameOver = true;
                displayController.setMessage(`Tie!`);
            } else {
                currPlayer = (round % 2 === 0) ? playerOne : playerTwo;
                round++;
                displayController.setMessage('You vs Computer');
            }
        } else {
            if (canWin()) {}
            else if (canLose()) {}
            else if (availableSpaces.includes(4)) {
                gameBoard.setSquare(4, currPlayer.getLetter());
                displayController.updateBoard();
            } else if ((gameBoard.getSquare(0) === 'X' && gameBoard.getSquare(8) === 'X') || (gameBoard.getSquare(2) === 'X' && gameBoard.getSquare(6) === 'X')) {
                if (availableSpaces.includes(1)) {
                    gameBoard.setSquare(1, currPlayer.getLetter());
                    displayController.updateBoard();
                } else if (availableSpaces.includes(3)) {
                    gameBoard.setSquare(3, currPlayer.getLetter());
                    displayController.updateBoard();
                } else if (availableSpaces.includes(5)) {
                    gameBoard.setSquare(5, currPlayer.getLetter());
                    displayController.updateBoard();
                } else if (availableSpaces.includes(7)) {
                    gameBoard.setSquare(7, currPlayer.getLetter());
                    displayController.updateBoard();
                }
            } 
            else if (availableSpaces.includes(0)) {
                gameBoard.setSquare(0, currPlayer.getLetter());
                displayController.updateBoard();
            } else if (availableSpaces.includes(2)) {
                gameBoard.setSquare(2, currPlayer.getLetter());
                displayController.updateBoard();
            } else if (availableSpaces.includes(6)) {
                gameBoard.setSquare(6, currPlayer.getLetter());
                displayController.updateBoard();
            } else if (availableSpaces.includes(8)) {
                gameBoard.setSquare(8, currPlayer.getLetter());
                displayController.updateBoard();
            } else {
                let play = Math.floor(Math.random() * availableSpaces.length);
                gameBoard.setSquare(availableSpaces[play], currPlayer.getLetter());
                displayController.updateBoard();
            }

            if (playerWon()) {
                displayController.setMessage(`${currPlayer.getName()} wins!`);
            } else if (round === 9) {
                gameOver = true;
                displayController.setMessage(`Tie!`);
            } else {
                currPlayer = (round % 2 === 0) ? playerOne : playerTwo;
                round++;
                displayController.setMessage('You vs Computer');
            }
        }
    };

    const canLose = () => {
        for (let i = 0; i < possibilities.length; i++) {
            let xCount = 0;
            let oCount = 0;
            for (let j = 0; j < possibilities[i].length; j++) {
                if (gameBoard.getSquare(possibilities[i][j]) === 'X') {
                    xCount++;
                }
                if (gameBoard.getSquare(possibilities[i][j]) === 'O') {
                    oCount++;
                }
            }
            if (xCount === 2 && oCount === 0) {
                for (let k = 0; k < possibilities[i].length; k++) {
                    if (availableSpaces.includes(possibilities[i][k])) {
                        gameBoard.setSquare(possibilities[i][k], currPlayer.getLetter());
                        displayController.updateBoard();
                    }
                }
                return true;
            }
        }
        return false;
    };

    const canWin = () => {
        console.log('here');
        for (let i = 0; i < possibilities.length; i++) {
            let xCount = 0;
            let oCount = 0;
            for (let j = 0; j < possibilities[i].length; j++) {
                if (gameBoard.getSquare(possibilities[i][j]) === 'X') {
                    xCount++;
                }
                if (gameBoard.getSquare(possibilities[i][j]) === 'O') {
                    oCount++;
                }
            }
            console.log(xCount, oCount);
            if (oCount === 2 && xCount === 0) {
                for (let k = 0; k < possibilities[i].length; k++) {
                    if (availableSpaces.includes(possibilities[i][k])) {
                        gameBoard.setSquare(possibilities[i][k], currPlayer.getLetter());
                        displayController.updateBoard();
                    }
                }
                return true;
            }
        }
        return false;
    };


    return {
        makeMove,
        restart,
        changeMode
    };
    
})();
