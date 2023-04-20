function CanvasRenderer() {
  /** @type {HTMLCanvasElement} */
  this.gridCanvas = document.getElementById("grid-canvas");
  /** @type {CanvasRenderingContext2D} */
  this.gridCtx = this.gridCanvas.getContext("2d");

  /** @type {HTMLCanvasElement} */
  this.tileCanvas = document.getElementById("tile-canvas");
  /** @type {CanvasRenderingContext2D} */
  this.tileCtx = this.tileCanvas.getContext("2d");

  // $field-width: 500px;
  // $grid-spacing: 15px;
  // $grid-row-cells: 4;
  // $tile-size: ($field-width - $grid-spacing * ($grid-row-cells + 1)) / $grid-row-cells;
  // $tile-border-radius: 3px;
  this.fieldWidth = 500;
  this.gridSpacing = 15;
  this.gridRowCells = 4;
  this.tileSize =
    (this.fieldWidth - this.gridSpacing * (this.gridRowCells + 1)) /
    this.gridRowCells;
  this.tileBorderRadius = 3;

  /** @type {anime.AnimeTimelineInstance} */
  this.animeTimeLine = null;
}

CanvasRenderer.prototype.drawGrid = function () {
  const canvas = this.gridCanvas;
  const ctx = this.gridCtx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < this.gridRowCells; row++) {
    for (let col = 0; col < this.gridRowCells; col++) {
      const x = col * (this.tileSize + this.gridSpacing);
      const y = row * (this.tileSize + this.gridSpacing);

      ctx.fillStyle = tinycolor(CanvasTile.style.tileColor)
        .setAlpha(0.35)
        .toString();

      ctx.beginPath();
      ctx.roundRect(x, y, this.tileSize, this.tileSize, [
        this.tileBorderRadius,
      ]);
      ctx.fill();
    }
  }
};

/**
 *
 * @param {Tile} tile
 * @param {CanvasTile} canvasTile
 */
CanvasRenderer.prototype.drawTile = function (canvasTile) {
  var ctx = this.tileCtx;

  // 保存当前配置
  ctx.save();

  //

  if (canvasTile.opacity != 100) {
    ctx.globalAlpha = canvasTile.opacity / 100;
  }

  if (canvasTile.scale != 100) {
    var scale = canvasTile.scale / 100;
    var originX = canvasTile.x + this.tileSize / 2;
    var originY = canvasTile.y + this.tileSize / 2;

    ctx.translate(originX, originY);
    ctx.scale(scale, scale);
    ctx.translate(-originX, -originY);
  }

  ctx.fillStyle = canvasTile.backgroudColor;
  ctx.beginPath();
  ctx.roundRect(canvasTile.x, canvasTile.y, this.tileSize, this.tileSize, [
    this.tileBorderRadius,
  ]);
  ctx.fill();

  ctx.fillStyle = canvasTile.textColor;
  ctx.font = "bold " + canvasTile.textSize + 'px "ClearSans"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    canvasTile.tile.value,
    canvasTile.x + this.tileSize / 2,
    canvasTile.y + this.tileSize / 2
  );

  // 还原之前的配置
  ctx.restore();

  //   // set stroke & shadow to the same color
  //   ctx.strokeStyle = color;
  //   ctx.shadowColor = color;
  //   // set initial blur of 3px
  //   ctx.shadowBlur = 3;
  //   // repeatedly overdraw the blur to make it prominent
  //   for (var i = 0; i < repeats; i++) {
  //     // increase the size of blur
  //     ctx.shadowBlur += 0.25;
  //     // stroke the rect (which also draws its shadow)
  //     ctx.strokeRect(x, y, w, h);
  //   }
  //   // cancel shadowing by making the shadowColor transparent
  //   ctx.shadowColor = "rgba(0,0,0,0)";
  //   // restroke the interior of the rect for a more solid colored center
  //   ctx.lineWidth = 2;
  //   ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
};

CanvasRenderer.prototype.clearTiles = function () {
  this.tileCtx.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height);
};

CanvasRenderer.prototype.initAnimation = function () {
  var self = this;
  if (this.animeTimeLine) {
    this.animeTimeLine.pause();
    // 是否要释放内存？
  }
  // 动画时间线控制，注意不要自动播放
  this.animeTimeLine = anime.timeline({
    easing: "easeInOutSine",
    duration: 100,
    autoplay: false,
    /**
     * @param {anime.AnimeTimelineInstance} animation
     */
    update: function (animation) {
      //   console.log("progress: " + animation.progress);
      // children[0].animatables[0].target
      self.clearTiles();
      animation.children.forEach(
        /**
         * @param {anime.AnimeInstance} child
         */
        function (child) {
          self.drawTile(child.animatables[0].target);
        }
      );
    },
  });
};

/**
 *
 * @param {anime.AnimeAnimParams} animParams
 */
CanvasRenderer.prototype.addAnimation = function (animParams) {
  this.animeTimeLine.add(animParams, 0);
};

CanvasRenderer.prototype.playAnimation = function () {
  this.animeTimeLine.play();
};

/**
 *
 * @param {Tile} tile
 */
function CanvasTile(tile, tileSize, gridSpacing) {
  this.tile = tile;
  this.tileSize = tileSize;
  this.gridSpacing = gridSpacing;

  this.x = tile.x * (this.tileSize + this.gridSpacing);
  this.y = tile.y * (this.tileSize + this.gridSpacing);
  this.previousPosition = null;

  /** @type {string} 背景色 */
  this.backgroudColor = CanvasTile.calculateBackgroudColor(this.tile.value);
  /** @type {string} 文本颜色 */
  this.textColor = CanvasTile.calculateTextColor(this.tile.value);
  /** @type {textSize} 文本大小 */
  this.textSize = CanvasTile.calculateTextSize(this.tile.value);

  /** @type {number} 透明度 0-100 */
  this.opacity = 100;
  /** @type {number} 缩放 0-100 */
  this.scale = 100;
}
/**
 *
 * @param {x: number, y: number} position
 */
CanvasTile.prototype.setPreviousPosition = function (position) {
  var previousPosition = {
    x: position.x * (this.tileSize + this.gridSpacing),
    y: position.y * (this.tileSize + this.gridSpacing),
  };
  this.previousPosition = previousPosition;
};
// 一些样式参数
CanvasTile.style = {
  textColor: "#776E65",
  brightTextColor: "#f9f6f2",
  tileColor: "#eee4da",
  tileGoldColor: "#edc22e",
  // lighten(tileGoldColor, 15%)
  titleGoldGlowColor: "#f3d774",

  specialBackground: [
    null,
    null,
    "#f78e48",
    "#fc5e2e",
    "#ff3333",
    "#ff0000",
    null,
    null,
    null,
    null,
    null,
  ],
  brightColor: [
    false,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ],
};

CanvasTile.calculateBackgroudColor = function (value) {
  var exponentLimit = 11;
  var exponent = Math.log2(value);
  var specialBackground = CanvasTile.style.specialBackground[exponent - 1];
  var goldPercent = ((exponent - 1) / (exponentLimit - 1)) * 100;
  var mixedBackgroud = tinycolor
    .mix(
      tinycolor(CanvasTile.style.tileColor),
      tinycolor(CanvasTile.style.tileGoldColor),
      goldPercent
    )
    .toHexString();

  if (specialBackground != null) {
    mixedBackgroud = tinycolor
      .mix(tinycolor(mixedBackgroud), tinycolor(specialBackground), 55)
      .toHexString();
  }

  if (value > 2048) {
    mixedBackgroud = tinycolor
      .mix(tinycolor(CanvasTile.style.tileGoldColor), tinycolor("#333"), 95)
      .toHexString();
  }
  return mixedBackgroud;
};

CanvasTile.calculateTextColor = function (value) {
  var exponent = Math.log2(value);
  var brightColor = CanvasTile.style.brightColor[exponent - 1];
  var textColor = brightColor
    ? CanvasTile.style.brightTextColor
    : CanvasTile.style.textColor;
  if (value > 2048) {
    textColor = CanvasTile.style.brightTextColor;
  }
  return textColor;
};

CanvasTile.calculateTextSize = function (value) {
  var size = 55;
  if (value >= 100 && value < 1000) {
    size = 45;
  } else if (value >= 1000) {
    size = 35;
  }
  if (value > 2048) {
    size = 30;
  }
  return size;
};

CanvasAnime = {
  transitionSpeed: 100,
};

/**
 * @function 出现动画
 * @param {CanvasTile} canvasTile
 */
CanvasAnime.appear = function (canvasTile) {
  canvasTile.opacity = 0;
  canvasTile.scale = 0;
  /** keyframes(appear) {
    0% {
      opacity: 0;
      @include transform(scale(0));
    }

    100% {
      opacity: 1;
      @include transform(scale(1));
    }
      } */
  /* property name | duration | easing function | delay */
  /* animation: appear 200ms ease 100ms; */
  /* animation-fill-mode(backwards); anime 默认就是backwards */
  return {
    targets: canvasTile,
    opacity: [{ value: 0 }, { value: 100 }],
    scale: [{ value: 0 }, { value: 100 }],
    duration: 200,
    easing: "easeInOutSine",
    delay: 100,
  };
};

/**
 * @function 移动动画
 * @param {canvasTile} canvasTile
 * @returns {anime.AnimeAnimParams}
 */
CanvasAnime.move = function (canvasTile) {
  var startPosition = canvasTile.previousPosition;
  var endtPosition = { x: canvasTile.x, y: canvasTile.y };
  canvasTile.x = startPosition.x;
  canvasTile.y = startPosition.y;
  return {
    targets: canvasTile,
    x: [{ value: startPosition.x }, { value: endtPosition.x }],
    y: [{ value: startPosition.y }, { value: endtPosition.y }],
    duration: CanvasAnime.transitionSpeed,
    easing: "easeInOutSine",
  };
};

/**
 * @function 弹出动画
 * @param {canvasTile} canvasTile
 * @returns {anime.AnimeAnimParams}
 */
CanvasAnime.pop = function (canvasTile) {
  canvasTile.scale = 0;
  /** keyframes(appear) {
    0% {
      @include transform(scale(0));
    }

    50% {
      @include transform(scale(1.2));
    }

    100% {
      @include transform(scale(1));
    }
      } */
  /* property name | duration | easing function | delay */
  /* animation: pop 200ms ease 100ms; */
  /* animation-fill-mode(backwards); anime 默认就是backwards */
  return {
    targets: canvasTile,
    scale: [{ value: 0 }, { value: 120 }, { value: 100 }],
    duration: 200,
    easing: "easeInOutSine",
    delay: 100,
  };
};
