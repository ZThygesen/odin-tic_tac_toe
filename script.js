const Player = (letter) => {
    this.letter = letter;

    const getLetter = () => {
        return letter;
    };

    return { getLetter };
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

    return {
        createBoard,
        updateBoard,
        setMessage,
        setSquare,
        clearBoard
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

const gameFlow = (() => {
    const playerX = Player('X');
    const playerO = Player('O');

    let round = 1;
    let currPlayer = playerX;
    let gameOver = false;

    displayController.createBoard();

    const makeMove = (square) => {
        if (occupied(square) || gameOver) { return; }

        gameBoard.setSquare(square, currPlayer.getLetter());
        displayController.updateBoard();

        if (playerWon()) {
            displayController.setMessage(`Player ${currPlayer.getLetter()} wins!`);
        } else if (round === 9) {
            gameOver = true;
            displayController.setMessage(`Tie!`);
        }
        else {
            currPlayer = (round % 2 === 0) ? playerX : playerO;
            round++;
            displayController.setMessage(`Player ${currPlayer.getLetter()}'s turn`);
        }

    };

    const occupied = (index) => {
        return gameBoard.getSquare(index) === 'X' || gameBoard.getSquare(index) === 'O';
    };

    const playerWon = () => {
        const win = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < win.length; i++) {
            if (gameOver) { break; }
            for (let j = 0; j < win[i].length; j++) {
                if (gameBoard.getSquare(win[i][j]) === currPlayer.getLetter()) {
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
        currPlayer = playerX;
        gameOver = false;
        displayController.setMessage('Player X\'s turn');
    };

    return {
        makeMove,
        restart
    };
    
})();
