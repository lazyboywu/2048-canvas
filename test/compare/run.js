var size = 4;

/**
 *
 * @param {HTMLActuator | CanvasActuator} actuator
 */
function rendGrid(actuator) {
  var grid = new Grid(4);
  for (var i = 0; i < 12; i++) {
    var v = Math.pow(2, i + 1);
    var x = i % 4;
    var y = Math.floor(i / 4);

    var tile = new Tile({ x: x, y: y }, v);
    grid.insertTile(tile);
  }
  actuator.actuate(grid, { score: 0, bestScore: 0 });
}

/**
 *
 * @param {HTMLActuator | CanvasActuator} actuator
 */
function moveTile(actuator) {
  var grid = new Grid(4);
  var tile = new Tile({ x: 2, y: 0 }, 4);
  grid.insertTile(tile);
  var cell = { x: 2, y: 3 };
  tile.savePosition();
  tile.updatePosition(cell);
  actuator.actuate(grid, { score: 0, bestScore: 0 });
}

/**
 *
 * @param {HTMLActuator | CanvasActuator} actuator
 */
function mergeTile(actuator) {
  var grid = new Grid(4);
  // tile1 和 tile2 合并，tile1消失，tile2值变大
  var tile1 = new Tile({ x: 1, y: 3 }, 4);
  grid.insertTile(tile1);
  var tile2 = new Tile({ x: 1, y: 0 }, 4);
  grid.insertTile(tile2);

  // 合并前
  actuator.actuate(grid, { score: 0, bestScore: 0 });

  var tile2Position = { x: tile2.x, y: tile2.y };
  var merged = new Tile(tile2Position, tile2.value * 2);
  merged.mergedFrom = [tile1, tile2];

  // 合并后
  setTimeout(function () {
    grid.insertTile(merged);
    grid.removeTile(tile1);

    tile1.updatePosition(tile2Position);
    actuator.actuate(grid, { score: 0, bestScore: 0 });
  }, 2000);
}

var actuator =
  typeof CanvasActuator !== "undefined"
    ? new CanvasActuator()
    : new HTMLActuator();

document.addEventListener("DOMContentLoaded", () => {
  // rendGrid(actuator);
  // moveTile(actuator);
  mergeTile(actuator);
});
