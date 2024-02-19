const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const blockSize = 30;
const width = canvas.width;
const height = canvas.height;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
let piece, grid;

const shapes={
  T: [
    [1, 1, 1],
    [0, 1, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  L: [
    [1, 1],
    [1, 0],
    [1, 0]
  ],
  J: [
    [1, 1],
    [0, 1],
    [0, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  I: [
    [1],
    [1],
    [1],
    [1]
  ]
}

const colors = {
  T: 'purple',
  O: 'yellow',
  L: 'orange',
  J: 'blue',
  S: 'green',
  Z: 'red',
  I: 'cyan'
};

function randomIndex(){
  const keys = Object.keys(shapes); // ['T', 'O', 'L', 'J', 'S', 'Z', 'I']
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

class Piece{
  constructor(x, y, shape, blockSize, ctx, color){
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.ctx = ctx;
    this.blockSize = blockSize;
    this.color = color;
  }
  draw(){
    this.ctx.fillStyle = colors[this.shape];
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0){
          this.ctx.fillStyle = this.color;
          this.ctx.strokeStyle = 'black';
          this.ctx.fillRect((this.x + x)*this.blockSize, (this.y + y)*this.blockSize, this.blockSize, this.blockSize);
          this.ctx.strokeRect((this.x + x)*this.blockSize, (this.y + y)*this.blockSize, this.blockSize, this.blockSize);
          this.ctx.fill();
          this.ctx.stroke();
        }
      });
    });
  }
  rotate(){
    const rotatedShape = this.shape[1].map((val, index) =>
      this.shape.map(row => row[index])
    );
    this.shape = rotatedShape.reverse();
  }
  collideWithBottom() {
    return this.y + this.shape.length >= heightInBlocks;
  }
  collideWithPiece(grid) {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x] !== 0 && (grid[this.y + y] && grid[this.y + y][this.x + x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }
}

class Grid {
  constructor(width, height, blockSize, ctx) {
    this.width = width;
    this.height = height;
    this.blockSize = blockSize;
    this.ctx = ctx;
    this.grid = Array(height).fill().map(() => Array(width).fill(0)); // Create a 2D array filled with zeros
  }

  createGrid() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.ctx.strokeRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
        this.ctx.fillStyle = this.grid[i][j] || 'rgba(0, 0, 0, 0.5)'; // Use the color in the grid if it exists, otherwise use a default color
        this.ctx.fillRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }
  // addPiece(piece) {
  //   piece.shape.forEach((row, y) => {
  //     row.forEach((value, x) => {
  //       if (value > 0) {
  //         this.grid[piece.y + y][piece.x + x] = 1; // Update the grid with 1 instead of the color of the piece
  //       }
  //     });
  //   });
  // }
  addPiece(piece) {
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[piece.y + y][piece.x + x] = piece.color; // Update the grid with the color of the piece
        }
      });
    });
  }
}
function selectPiece(){
  grid = new Grid(20, 20, blockSize, ctx);
  grid.createGrid();
  const randomPiece=randomIndex()
  piece = new Piece(Math.floor(widthInBlocks/2), 0, shapes[randomPiece], blockSize, ctx, colors[randomPiece]);
  piece.draw();
  setInterval(() => {
    piece.y++;
    if (piece.collideWithBottom() || piece.collideWithPiece(grid.grid)) {
      piece.y--; // Move the piece back up
      grid.addPiece(piece); // Add the piece to the grid when it collides with the bottom or another piece
      piece = new Piece(Math.floor(widthInBlocks / 2), 0, shapes[randomIndex()], blockSize, ctx, colors[randomIndex()]);
    }
    ctx.clearRect(0, 0, width, height);
    grid.createGrid();
    piece.draw();
  }, 1000);
  
  // setInterval(() => {
  //   if (piece.collideWithBottom() || piece.collideWithPiece(grid.grid)) {
  //     grid.addPiece(piece); // Add the piece to the grid when it collides with the bottom or another piece
  //     piece = new Piece(Math.floor(widthInBlocks / 2), 0, shapes[randomIndex()], blockSize, ctx, colors[randomIndex()]);
  //   } else {
  //     piece.y++;
  //   }
  //   ctx.clearRect(0, 0, width, height);
  //   grid.createGrid();
  //   piece.draw();
  // }, 1000);

  // setInterval(() => {
  //   if (piece.collideWithBottom()) {
  //     grid.addPiece(piece); // Add the piece to the grid when it collides with the bottom
  //     piece = new Piece(Math.floor(widthInBlocks / 2), 0, shapes[randomIndex()], blockSize, ctx, colors[randomIndex()]);
  //   } else {
  //     piece.y++;
  //   }
  //   ctx.clearRect(0, 0, width, height);
  //   grid.createGrid();
  //   piece.draw();
  // }, 1000);
}
window.addEventListener('keydown', (e) => {
  ctx.clearRect(0, 0, width, height);
  grid.createGrid();
  switch(e.key){
    case 'r':
      piece.rotate();
      piece.draw();
      break;
  };
});
selectPiece();