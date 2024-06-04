// game-of-life.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 10; // Adjust the size of each cell
const numRows = 40; // Number of rows
const numCols = 60; // Number of columns

canvas.width = cellSize * numCols;
canvas.height = cellSize * numRows;

// Initialize the grid (randomly set cells as alive or dead)
const grid = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => Math.random() > 0.7)
);

// Draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

// Calculate the number of live neighbors for a given cell
function countLivingNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Skip the current cell
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
                count += grid[newRow][newCol] ? 1 : 0;
            }
        }
    }
    return count;
}

// Update the grid based on Conway's Game of Life rules
function updateGrid() {
    const newGrid = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => false)
    );

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = grid[row][col];
            const numLivingNeighbors = countLivingNeighbors(row, col);

            if (cell) {
                if (numLivingNeighbors === 2 || numLivingNeighbors === 3) {
                    newGrid[row][col] = true; // Cell survives
                }
            } else {
                if (numLivingNeighbors === 3) {
                    newGrid[row][col] = true; // Cell becomes alive
                }
            }
        }
    }

    grid.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            grid[rowIndex][colIndex] = newGrid[rowIndex][colIndex];
        });
    });

    drawGrid();
}

// Set up the game loop
function gameLoop() {
    updateGrid();
    requestAnimationFrame(gameLoop);
}

// Add an event listener for mouse clicks
canvas.addEventListener('click', handleCellClick);

function handleCellClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the row and column based on mouse coordinates
    const clickedRow = Math.floor(mouseY / cellSize);
    const clickedCol = Math.floor(mouseX / cellSize);

    // Toggle the state of the clicked cell
    grid[clickedRow][clickedCol] = !grid[clickedRow][clickedCol];

    drawGrid(); // Redraw the grid
}

gameLoop();
