const helpers = require('./helpers');

const { color, window } = helpers;

const write = (string) => process.stdout.write(string);

/**
 * Generate rainbow colors
 *
 * @return {Array}
 */
const generateColors = () => {
  const colors = new Array(6);
  for (let i = 0; i < 6 * 7; i += 1) {
    const pi3 = Math.floor(Math.PI / 3);
    const n = i * (1.0 / 6);
    const r = Math.floor(3 * Math.sin(n) + 3);
    const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors[i] = 36 * r + 6 * g + b + 16;
  }

  return colors;
};

function NyanRenderer() {
  const nyanCatWidth = 11;
  const width = window.width * 0.75 || 0;

  this.colorIndex = 0;
  this.numberOfLines = 4;
  this.rainbowColors = generateColors();
  this.scoreboardWidth = 5;
  this.tick = 0;
  this.trajectories = [[], [], [], []];
  this.trajectoryWidthMax = width - nyanCatWidth;

  const rainbowify = (str) => {
    if (!helpers.useColors) {
      return str;
    }

    const _color = this.rainbowColors[
      this.colorIndex % this.rainbowColors.length
    ];
    this.colorIndex += 1;

    return `\u001b[38;5;${_color}m${str}\u001b[0m`;
  };

  /**
   * Append the rainbow.
   *
   * @param {string} str
   * @return {string}
   */
  const appendRainbow = () => {
    const segment = this.tick ? '_' : '-';
    const rainbowified = rainbowify(segment);

    for (let index = 0; index < this.numberOfLines; index += 1) {
      const trajectory = this.trajectories[index];
      if (trajectory.length >= this.trajectoryWidthMax) {
        trajectory.shift();
      }

      trajectory.push(rainbowified);
    }
  };

  /**
   * Move cursor up `n`
   *
   * @param {number} n
   */
  const cursorUp = (n) => {
    write(`\u001b[${n}A`);
  };

  const face = (results) => {
    if (results.numFailedTests) {
      return '( x .x)';
    }

    if (results.numPendingTests) {
      return '( o .o)';
    }

    if (results.numPassedTests) {
      return '( ^ .^)';
    }

    return '( - .-)';
  };

  /**
   * Draw the Nyan Cat
   */
  const drawNyanCat = (results) => {
    const self = this;
    const startWidth = this.scoreboardWidth + this.trajectories[0].length;
    const dist = `\u001b[${startWidth}C`;
    let padding = '';

    write(dist);
    write('_,------,');
    write('\n');

    write(dist);
    padding = self.tick ? '  ' : '   ';
    write(`_|${padding}/\\_/\\ `);
    write('\n');

    write(dist);
    padding = self.tick ? '_' : '__';
    const tail = self.tick ? '~' : '^';
    write(`${tail}|${padding}${face(results)} `);
    write('\n');

    write(dist);
    padding = self.tick ? ' ' : '  ';
    write(`${padding}""  "" `);
    write('\n');

    cursorUp(this.numberOfLines);
  };

  // /**
  //  * Move cursor down `n`
  //  */
  // const cursorDown = (n) => {
  //   write(`\u001b[${n}B`);
  // };

  /**
   * Draws the type of stat along with a color
   */
  const drawType = (type, n) => {
    write(' ');
    write(color(type, n));
    write('\n');
  };

  const drawScoreboard = ({
    numPassedTests,
    numFailedTests,
    numPendingTests,
    numTotalTests,
  }) => {
    drawType('total tests', numTotalTests || 0);
    drawType('green', numPassedTests || 0);
    drawType('fail', numFailedTests || 0);
    drawType('pending', numPendingTests || 0);

    cursorUp(this.numberOfLines);
  };

  /**
   * Draw the rainbow
   */
  const drawRainbow = () => {
    this.trajectories.forEach((line) => {
      write(`\u001b[${this.scoreboardWidth}C`);
      write(line.join(''));
      write('\n');
    });

    cursorUp(this.numberOfLines);
  };

  /**
   * Main draw function to draw the output of the reporter
   */
  this.draw = (results = {}) => {
    appendRainbow();
    drawScoreboard(results);
    drawRainbow();
    drawNyanCat(results);

    this.tick = !this.tick;
  };
}

module.exports = NyanRenderer;
