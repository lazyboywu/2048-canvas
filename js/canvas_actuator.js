function CanvasActuator() {
  HTMLActuator.call(this);

  this.canvasRenderer = new CanvasRenderer();
  this.canvasRenderer.drawGrid();

  var self = this;
}

// 将父函数的原型对象赋值给子函数的原型对象
CanvasActuator.prototype = Object.create(HTMLActuator.prototype);
CanvasActuator.prototype.constructor = CanvasActuator; // 修复子函数的构造函数指向

CanvasActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    // 添加完所有tile动画，动画开启
    self.canvasRenderer.playAnimation();

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }
  });
};

CanvasActuator.prototype.clearContainer = function (container) {
  if (container == this.tileContainer) {
    this.canvasRenderer.clearTiles();
    this.canvasRenderer.initAnimation();
  } else {
    HTMLActuator.prototype.clearContainer.call(this, container);
  }
};

/**
 *
 * @param {Tile} tile
 */
CanvasActuator.prototype.addTile = function (tile) {
  //   console.log(tile);
  var self = this;

  var canvasTile = new CanvasTile(
    tile,
    this.canvasRenderer.tileSize,
    this.canvasRenderer.gridSpacing
  );

  //   if (tile.previousPosition) {
  //     // Make sure that the tile gets rendered in the previous position first
  //     window.requestAnimationFrame(function () {
  //       classes[2] = self.positionClass({ x: tile.x, y: tile.y });
  //       self.applyClasses(wrapper, classes); // Update the position
  //     });
  //   } else if (tile.mergedFrom) {
  //     classes.push("tile-merged");
  //     this.applyClasses(wrapper, classes);

  //     // Render the tiles that merged
  //     tile.mergedFrom.forEach(function (merged) {
  //       self.addTile(merged);
  //     });
  //   } else {
  //     classes.push("tile-new");
  //     this.applyClasses(wrapper, classes);
  //   }

  //   // Add the inner part of the tile to the wrapper
  //   wrapper.appendChild(inner);

  //   // Put the tile on the board
  //   this.tileContainer.appendChild(wrapper);
  if (tile.previousPosition) {
    canvasTile.setPreviousPosition(tile.previousPosition);
    this.canvasRenderer.addAnimation(CanvasAnime.move(canvasTile), 0);
  } else if (tile.mergedFrom) {
    this.canvasRenderer.addAnimation(CanvasAnime.pop(canvasTile), 0);
  } else {
    this.canvasRenderer.addAnimation(CanvasAnime.appear(canvasTile), 0);
  }
};
