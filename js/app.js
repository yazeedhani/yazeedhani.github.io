/************* GLOBAL VARIABLES *************/
const resetButton = document.getElementById('resetGame')
const newGameButton = document.getElementById('newGame')
const computer = document.getElementById('computer')
const multiplayer = document.getElementById('multiplayer')
const message = document.getElementById('message')
const player1Paragraph = document.getElementById('player1')
const opponentParagraph = document.getElementById('opponent')
const player1Score = document.getElementById('player1Score')
const player2Score = document.getElementById('player2Score')
const boardGame = document.getElementById('boardGame')
// Board game columns.
const column1 = [0, 6, 12, 18, 24]
const column2 = [1, 7, 13, 19, 25]
const column3 = [2, 8, 14, 20, 26]
const column4 = [3, 9, 15, 21, 27]
const column5 = [4, 10, 16, 22, 28]
const column6 = [5, 11, 17, 23, 29]
const winningCombinations = [
    [0,1,2,3], [1,2,3,4], [2,3,4,5], [6,7,8,9], [7,8,9,10], [8,9,10,11],
    [12,13,14,15], [13,14,15,16], [14,15,16,17], [18,19,20,21], [19,20,21,22], 
    [20,21,22,23], [24,25,26,27], [25,26,27,28], [26,27,28,29], [0,6,12,18], 
    [6,12,18,24], [1,7,13,19], [7,13,19,25], [2,8,14,20], [8,14,20,26], 
    [3,9,15,21], [9,15,21,27], [4,10,16,22], [10,16,22,28], [5,11,17,23], [11,17,23,29],
    [2,9,16,23], [1,8,15,22], [8,15,22,29], [0,7,14,21], [7,14,21,28], [6,13,20,27], 
    [18,13,8,3], [24,19,14,9], [19,14,9,4], [25,20,15,10], [20,15,10,5], [26,21,16,11]
]
// To keep track of how many rows are filled in each column
let rowsPlayedColumn1 = 0
let rowsPlayedColumn2 = 0
let rowsPlayedColumn3 = 0
let rowsPlayedColumn4 = 0
let rowsPlayedColumn5 = 0
let rowsPlayedColumn6 = 0
//To track if player one is the winner so computerMove() can terminate execution
let player1Winner = false

// Class to build player objects
class Player {
    constructor(name, tokenColor, isTurn)
    {
        this.name = name,
        this.tokenColor = tokenColor,
        this.isTurn = isTurn,
        this.score = 0
    }
}

// Players
const player1 = new Player('Player-1', 'red', true)
let opponent = null //decides who you play against

// Create the 30 Circle divs in div boardGame
for(let i = 6; i < 30; i++)
{
    const squareDiv = document.createElement('div')
    squareDiv.id = i
    squareDiv.classList.add('color', 'white')
    boardGame.appendChild(squareDiv)
}

/******************* FUNCTIONS ********************/
/*
    Reset game but keep current player mode. Erase scoreboard and create new one. Player points are set back to 0
    return -  no value returned
*/
const resetGame = () => {
    newGame()
    player1.score = 0
    player1Score.textContent = 0
    //maybe reset opponent to null again
    opponent.score = 0
    player2Score.textContent = 0
}

/*
   Create new game instance. Remove all red and yellow classes from divs and read the white class
   Re-add event listeners and reset rows played in each column to zero
   return - no value returned
*/
const newGame = () => {
    for(let i = 0; i < 30; i++)
    {
        if(document.getElementById(`${i}`).classList.contains('red'))
        {
            document.getElementById(`${i}`).classList.remove('red')
            document.getElementById(`${i}`).classList.add('white')
        }
        else if(document.getElementById(`${i}`).classList.contains('yellow'))
        {
            document.getElementById(`${i}`).classList.remove('yellow')
            document.getElementById(`${i}`).classList.add('white')
        }
    }
    addListeners()
    message.textContent = "Player-1's turn"
    player1.isTurn = true
    opponent.isTurn = false
    player1Winner = false
    rowsPlayedColumn1 = 0
    rowsPlayedColumn2 = 0
    rowsPlayedColumn3 = 0
    rowsPlayedColumn4 = 0
    rowsPlayedColumn5 = 0
    rowsPlayedColumn6 = 0
}

/*
   Adds the event listeners on the first row (circle) of each column
   return - no value returned
*/
const addListeners = () => {
    document.getElementById(`0`).addEventListener('click', column1EventHandler)
    document.getElementById(`1`).addEventListener('click', column2EventHandler)
    document.getElementById(`2`).addEventListener('click', column3EventHandler)
    document.getElementById(`3`).addEventListener('click', column4EventHandler)
    document.getElementById(`4`).addEventListener('click', column5EventHandler)
    document.getElementById(`5`).addEventListener('click', column6EventHandler)
}

/*
   Removes the event listeners on the first row (circle) of each column
   return - no value returned
*/
const removeListeners = () => {
    document.getElementById(`0`).removeEventListener('click', column1EventHandler)
    document.getElementById(`1`).removeEventListener('click', column2EventHandler)
    document.getElementById(`2`).removeEventListener('click', column3EventHandler)
    document.getElementById(`3`).removeEventListener('click', column4EventHandler)
    document.getElementById(`4`).removeEventListener('click', column5EventHandler)
    document.getElementById(`5`).removeEventListener('click', column6EventHandler)
}

/*
   Checks to see if there is a winner using by looping through the
   winnningCominations array. If there is a winner, remove the event listeners
   on the first circle in each column.
   parameter1 - winningCombinations: array containing all the winning combos
   parameter2 - player: an object that represents the player
   return - no value returned
*/
const checkWinner = (winningCombinations, player) => {
    for(let i = 0; i < winningCombinations.length; i++)
    {
        if(document.getElementById(`${winningCombinations[i][0]}`).classList.contains(`${player.tokenColor}`) 
        && document.getElementById(`${winningCombinations[i][1]}`).classList.contains(`${player.tokenColor}`) 
        && document.getElementById(`${winningCombinations[i][2]}`).classList.contains(`${player.tokenColor}`) 
        && document.getElementById(`${winningCombinations[i][3]}`).classList.contains(`${player.tokenColor}`))
        {
            message.textContent = `${player.name.toUpperCase()} WINS!`

            player.score++
            if(player.name === 'Player-1')
            {
                player1Winner = true
                player1Score.textContent = player.score
            }
            else
            {
                player2Score.textContent = player.score
            }
            // console.log(document.getElementById(`${winningCombinations[i][0]}`))
            // console.log(document.getElementById(`${winningCombinations[i][1]}`))
            // console.log(document.getElementById(`${winningCombinations[i][2]}`))
            // console.log(document.getElementById(`${winningCombinations[i][3]}`))
            player.isTurn = false
            opponent.isTurn = false
            removeListeners()
        }
    }
}

/*
   Drops token in the boardgame at the clicked column to place it in the correct row.
   Will check if each row in column is empty or has a token.
   If column is full, then stop function, else place token
   parameter1 - player1: player object that is executing this function when placing their token
   parameter2 - player2: player object to keep track of the other player's tokens in the column
   parameter3 - i: a counter to loop through the column
   parameter4 - placeToken: a setInveral function ID to stop the setInterval function when column is full
   return - no value returned
*/
const dropToken = (player1, opponent, i, placeToken, columnArray) => {
    //if i is 5, then this means the column is full with tokens and stop executing this function
    if(i === 5)
    {
        clearInterval(placeToken)
        // console.log('checking winner')
        checkWinner(winningCombinations, player1) // will calculate the winner once the token reaches the last emtpy circle
    }
    //checks the first circle(row) in the current column
    //set the circle's color to red or yellow
    else if(i === 0 && document.getElementById(`${columnArray[i]}`).classList.contains('white') && !document.getElementById(`${columnArray[i]}`).classList.contains(opponent.tokenColor))
    {
        document.getElementById(`${columnArray[i]}`).classList.remove('white')
        document.getElementById(`${columnArray[i]}`).classList.add(player1.tokenColor)
    }
    //checks the the rest of the circles (rows) in the current column
    // resets the previous circle to white and sets the current circle to red or yellow
    else if(document.getElementById(`${columnArray[i]}`).classList.contains('white') && !document.getElementById(`${columnArray[i]}`).classList.contains(opponent.tokenColor))
    {
        //set previous circle color back to white
        document.getElementById(`${columnArray[i - 1]}`).classList.remove(player1.tokenColor)
        document.getElementById(`${columnArray[i - 1]}`).classList.add('white')
        // set current circle color to red or yellow
        document.getElementById(`${columnArray[i]}`).classList.remove('white')
        document.getElementById(`${columnArray[i]}`).classList.add(player1.tokenColor)
    }
}

/*
   Counts the number of rows that have been played in each column. 
   This is used to track if the column is full so the event listener on the column can be removed
   parameter1 - colNumber: the specific column that was clicked represented by a number
   return - no value returned
*/
const checksRowsPlayedInColumn = (colNumber) => {
    if(colNumber === 'column1')
    {
        rowsPlayedColumn1++
    }
    else if(colNumber === 'column2')
    {
        rowsPlayedColumn2++
    }
    else if(colNumber === 'column3')
    {
        rowsPlayedColumn3++
    }
    else if(colNumber === 'column4')
    {
        rowsPlayedColumn4++
    }
    else if(colNumber === 'column5')
    {
        rowsPlayedColumn5++
    }
    else if(colNumber === 'column6')
    {
        rowsPlayedColumn6++
    }
}

/*
   Removes the event listener from a column once it is filled with tokens.
   parameter1 - colNumber: the specific column that was clicked represented by a number
   parameter2 - event: event object.
   parameter3 - eventHandler: the handler triggered by the click event.
   return - no value returned
*/
const removeColumnEventListener = (colNumber, event, eventHandler) => {
    if(rowsPlayedColumn1 === 5 && colNumber === 'column1')
    {
        event.target.removeEventListener('click', eventHandler)
    }
    if(rowsPlayedColumn2 === 5 && colNumber === 'column2')
    {
        event.target.removeEventListener('click', eventHandler)
    }
    if(rowsPlayedColumn3 === 5 && colNumber === 'column3')
    {
        event.target.removeEventListener('click', eventHandler)
    }
    if(rowsPlayedColumn4 === 5 && colNumber === 'column4')
    {
        event.target.removeEventListener('click', eventHandler)
    }
    if(rowsPlayedColumn5 === 5 && colNumber === 'column5')
    {
        event.target.removeEventListener('click', eventHandler)
    }
    if(rowsPlayedColumn6 === 5 && colNumber === 'column6')
    {
        event.target.removeEventListener('click', eventHandler)
    }
}

/*
   This function is executed by the player to place the token at the clicked column.
   setInterval() is used to check for a winner and drop the token at the right circle
   in the column by traversing through each circle first. Will also switch player turns
   after move is made.
   parameter1 - columnArray: array of indixes for each column in the grid.
   parameter2 - eventHandler: the handler triggered by the click event.
   parameter3 - event: the event object.
   parameter4 - colNumber: the column number the token was dropped in.
   return - no value returned
*/
const play = (columnArray, eventHandler, event, colNumber) => {
    let setIntervalCounter = 0 //keeps track setInterval to clear it at i = 5, meaning column is full.
    if(player1.isTurn)
    {
        // Will drop the token into new position every 1 millisecond until its reaches its the last empty circle on board.
        const placeToken = setInterval( () => {
            dropToken(player1, opponent, setIntervalCounter, placeToken, columnArray)
            setIntervalCounter++
        }, 100)
        // console.log('token dropped - Red')
        player1.isTurn = false
        opponent.isTurn = true
        message.textContent = "Player-2's turn"
        checksRowsPlayedInColumn(colNumber)
    }
    else if(opponent.isTurn) 
    {
        const placeToken = setInterval( () => {
            dropToken(opponent, player1, setIntervalCounter, placeToken, columnArray)
            setIntervalCounter++ 
        }, 100)
        // console.log('token dropped - Yellow')
        opponent.isTurn = false
        player1.isTurn = true
        message.textContent = "Player-1's turn"
        checksRowsPlayedInColumn(colNumber)
    }
    
    // If rowPlayedColumn# is 5, then remove the event listener from the column so it won't able to be clicked by a player
    removeColumnEventListener(colNumber, event, eventHandler)
    // console.log('row played: ', rowsPlayedColumn1, 'column played:', columnArray)
    // console.log('row played: ', rowsPlayedColumn2, 'column played:', columnArray)
    // console.log('row played: ', rowsPlayedColumn3, 'column played:', columnArray)
    // console.log('row played: ', rowsPlayedColumn4, 'column played:', columnArray)
    // console.log('row played: ', rowsPlayedColumn5, 'column played:', columnArray)
    // console.log('row played: ', rowsPlayedColumn6, 'column played:', columnArray)
}

/*
   Computer user to drop token at a random column
   parameter1 - column: array of indixes for each column in the grid.
   return - only return to terminate function execution if player1Winner is true
*/
const computerMove = () => {
    // console.log(player1Winner)
    // if player1 wins from previous turn, then terminate this function
    if(player1Winner)
    {
        return
    }
    let setIntervalCounter = 0
    // Randomly choose a column to insert token in
    const allColumns = [column1, column2, column3, column4, column5, column6]
    let compChoice = Math.floor(Math.random() * allColumns.length)
    let colNumber = `column${compChoice + 1}`
    // console.log('Computer column: ', colNumber)
    // console.log('token dropped - Yellow')
    const placeToken = setInterval( () => {
        dropToken(opponent, player1, setIntervalCounter, placeToken, allColumns[compChoice])
        setIntervalCounter++ 
    }, 100)
    checksRowsPlayedInColumn(colNumber)
    // console.log('row played 1: ', rowsPlayedColumn1, 'column played:', allColumns[compChoice])
    // console.log('row played 2: ', rowsPlayedColumn2, 'column played:', allColumns[compChoice])
    // console.log('row played 3: ', rowsPlayedColumn3, 'column played:', allColumns[compChoice])
    // console.log('row played 4: ', rowsPlayedColumn4, 'column played:', allColumns[compChoice])
    // console.log('row played 5: ', rowsPlayedColumn5, 'column played:', allColumns[compChoice])
    // console.log('row played 6: ', rowsPlayedColumn6, 'column played:', allColumns[compChoice])
}

/*
   Function to play versus the computer
   parameter1 - column: array of indices for each column in the grid.
   return - no value returned
*/
const playComputer = (columnArray, eventHandler, event, colNumber) => {
    // console.log(player1Winner)
    let setIntervalCounter = 0 //keeps track of setInterval to clear it at i = 5, meaning column is full.

    // Will drop the token into new position every 1 millisecond until its reaches its optimal position.
    const placeToken = setInterval( () => {
        dropToken(player1, opponent, setIntervalCounter, placeToken, columnArray)
        setIntervalCounter++
    }, 100)
    // console.log('token dropped - Red')
    // console.log(`Player 1 column: `, colNumber)
    checksRowsPlayedInColumn(colNumber)
    
    message.textContent = "Player-1's turn"
    // If rowPlayedColumn# is 5, then remove the event listener from the column so it won't able to be clicked by a player
    removeColumnEventListener(colNumber, event, eventHandler)
    // console.log('row played 1: ', rowsPlayedColumn1, 'column played:', columnArray)
    // console.log('row played 2: ', rowsPlayedColumn2, 'column played:', columnArray)
    // console.log('row played 3: ', rowsPlayedColumn3, 'column played:', columnArray)
    // console.log('row played 4: ', rowsPlayedColumn4, 'column played:', columnArray)
    // console.log('row played 5: ', rowsPlayedColumn5, 'column played:', columnArray)
    // console.log('row played 6: ', rowsPlayedColumn6, 'column played:', columnArray)
    setTimeout(computerMove, 1000) // The computer's turn to drop a token
}

// A play() or playComputer() function for each event handler for each
// column depending if computer or multiplayer is chosen
// playComputer() will be used if computer mode is selected
// play() will be used if multiplayer mode is selected
const column1EventHandler = (event) => {
    // console.log(column1EventHandler)
    if(opponent.name === 'Computer')
    {
        playComputer(column1, column1EventHandler, event, 'column1')
    }
    else
    {
        play(column1, column1EventHandler, event, 'column1')
    }
}
const column2EventHandler = (event) => {
    if(opponent.name === 'Computer')
    {
        playComputer(column2, column2EventHandler, event, 'column2')
    }
    else
    {
        play(column2, column2EventHandler, event, 'column2')
    }
}
const column3EventHandler = (event) => {
    if(opponent.name === 'Computer')
    {
        playComputer(column3, column3EventHandler, event, 'column3')
    }
    else
    {
        play(column3, column3EventHandler, event, 'column3')
    }
}
const column4EventHandler = (event) => {
    if(opponent.name === 'Computer')
    {
        playComputer(column4, column4EventHandler, event, 'column4')
    }
    else
    {
        play(column4, column4EventHandler, event, 'column4')
    }
}
const column5EventHandler = (event) => {
    if(opponent.name === 'Computer')
    {
        playComputer(column5, column5EventHandler, event, 'column5')
    }
    else
    {
        play(column5, column5EventHandler, event, 'column5')
    }
}
const column6EventHandler = (event) => {
    if(opponent.name === 'Computer')
    {
        playComputer(column6, column6EventHandler, event, 'column6')
    }
    else
    {
        play(column6, column6EventHandler, event, 'column6')
    }
}

/******************* EVENT LISTENERS ********************/
//FIRST COLUMN EVENT LISTENER
document.getElementById('0').addEventListener('click', column1EventHandler)

//SECOND COLUMN EVENT LISTENER
document.getElementById('1').addEventListener('click', column2EventHandler)

//THIRD COLUMN EVENT LISTENER
document.getElementById('2').addEventListener('click', column3EventHandler)

//FOURTH COLUMN EVENT LISTENER
document.getElementById('3').addEventListener('click', column4EventHandler)

//FIFTH COLUMN EVENT LISTENER
document.getElementById('4').addEventListener('click', column5EventHandler)

//SIXTH COLUMN EVENT LISTENER
document.getElementById('5').addEventListener('click', column6EventHandler)

// Reset game
resetButton.addEventListener('click', resetGame)

// New game
newGameButton.addEventListener('click', newGame)

// Multiplayer mode selected
multiplayer.addEventListener('click', () => {
    opponent = new Player('Player-2', 'yellow', false)
    // console.log(opponent)
    resetGame()
    //Displays scoreboard
    player1Paragraph.style.display = 'inline-block'
    player1Score.style.display = 'inline'
    opponentParagraph.style.display = 'inline-block'
    player2Score.style.display = 'inline'
    opponentParagraph.textContent = 'Player 2: '
    message.style.visibility = 'visible'
})

// Computer mode selected
computer.addEventListener('click', () => {
    opponent = new Player('Computer', 'yellow', false)
    // console.log(opponent)
    resetGame()
    //Displays scoreboard
    player1Paragraph.style.display = 'inline-block'
    player1Score.style.display = 'inline'
    opponentParagraph.style.display = 'inline-block'
    player2Score.style.display = 'inline'
    opponentParagraph.innerHTML = '<i class="fa-solid fa-robot"></i>:'
    message.style.visibility = 'visible'
})