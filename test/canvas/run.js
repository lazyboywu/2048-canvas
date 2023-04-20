var size = 4;

/**
 *
 * @param {CanvasActuator} actuator
 */
function drawTile(actuator) {
  var tile = new Tile({ x: 0, y: 1 }, 1024);
  var canvasTile = new CanvasTile(
    tile,
    actuator.canvasRenderer.tileSize,
    actuator.canvasRenderer.gridSpacing
  );
  // canvasTile.opacity = 100;
  // canvasTile.scale = 80;
  actuator.canvasRenderer.drawTile(canvasTile);
}

/**
 *
 * @param {CanvasActuator} actuator
 */
function runAnimationAppare(actuator) {
  var tile = new Tile({ x: 0, y: 2 }, 8);
  var canvasTile = new CanvasTile(
    tile,
    actuator.canvasRenderer.tileSize,
    actuator.canvasRenderer.gridSpacing
  );

  var appearAnimParams = CanvasAnime.appear(canvasTile);
  appearAnimParams.update = function (animation) {
    actuator.canvasRenderer.clearTiles();
    console.log("progress: " + animation.progress);
    var newCanvasTile = animation.animatables[0].target;
    console.log("opacity: " + newCanvasTile.opacity);
    console.log("scale: " + newCanvasTile.scale);
    actuator.canvasRenderer.drawTile(newCanvasTile);
  };

  anime(appearAnimParams);
}

/**
 *
 * @param {CanvasActuator} actuator
 */
function runAnimationMove(actuator) {
  var tile = new Tile({ x: 2, y: 0 }, 4);
  var canvasTile = new CanvasTile(
    tile,
    actuator.canvasRenderer.tileSize,
    actuator.canvasRenderer.gridSpacing
  );
  canvasTile.setPreviousPosition({ x: 2, y: 3 });

  var moveAnimParams = CanvasAnime.move(canvasTile);
  moveAnimParams.update = function (animation) {
    actuator.canvasRenderer.clearTiles();
    // console.log("progress: " + animation.progress);
    var newCanvasTile = animation.animatables[0].target;
    // console.log("x: " + newCanvasTile.x);
    // console.log("y: " + newCanvasTile.y);
    actuator.canvasRenderer.drawTile(newCanvasTile);
  };
  anime(moveAnimParams);
}

/**
 *
 * @param {CanvasActuator} actuator
 */
function runAnimationPop(actuator) {
  var tile = new Tile({ x: 1, y: 1 }, 128);
  var canvasTile = new CanvasTile(
    tile,
    actuator.canvasRenderer.tileSize,
    actuator.canvasRenderer.gridSpacing
  );

  var appearAnimParams = CanvasAnime.pop(canvasTile);
  appearAnimParams.update = function (animation) {
    actuator.canvasRenderer.clearTiles();
    console.log("progress: " + animation.progress);
    var newCanvasTile = animation.animatables[0].target;
    console.log("scale: " + newCanvasTile.scale);
    actuator.canvasRenderer.drawTile(newCanvasTile);
  };

  anime(appearAnimParams);
}

var actuator =
  typeof CanvasActuator !== "undefined"
    ? new CanvasActuator()
    : new HTMLActuator();

document.addEventListener("DOMContentLoaded", () => {
  drawTile(actuator);
  //   runAnimationAppare(actuator);
  // runAnimationMove(actuator);
  // runAnimationPop(actuator);
});
