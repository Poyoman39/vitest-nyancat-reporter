const NyanRenderer = require('./NyanRenderer');
const helpers = require('./helpers');

const write = (string) => process.stdout.write(string);
const { cursor } = helpers;

function NyanReporter() {
  const nyanRenderer = new NyanRenderer();
  const packsById = {};
  // let ctx;
  // let files;

  const rendererParams = {
    numPassedTests: 0,
    numFailedTests: 0,
    numPendingTests: 0,
    numTotalTests: 0,
    startTime: 0,
    failedPacks: [],
  };

  // onInit?(ctx: Vitest): void
  this.onInit = () => {
    // ctx = _ctx;

    rendererParams.startTime = Date.now();

    cursor.CR();
    cursor.hide();

    nyanRenderer.draw(rendererParams);
  };

  // onPathsCollected?: (paths?: string[]) => Awaitable<void>
  // this.onPathsCollected = (paths) => {
  //   console.log({ paths });
  // };

  // onCollected?: (files?: File[]) => Awaitable<void>
  this.onCollected = () => {
    // files = _files;
  };

  // onFinished?: (files?: File[], errors?: unknown[]) => Awaitable<void>
  this.onFinished = () => {
    nyanRenderer.draw(rendererParams);
    cursor.show();
    for (let i = 0; i < this.numberOfLines; i += 1) {
      write('\n');
    }

    rendererParams.failedPacks = Object.entries(packsById)
      .filter(([, pack]) => (
        pack.state === 'fail'
      ));

    helpers.epilogue(rendererParams);

    helpers.printFailureMessages(rendererParams);
  };

  // onTaskUpdate?: (packs: TaskResultPack[]) => Awaitable<void>
  this.onTaskUpdate = (packs) => {
    rendererParams.numPassedTests = 0;
    rendererParams.numFailedTests = 0;
    rendererParams.numPendingTests = 0;
    rendererParams.numTotalTests = 0;

    packs.forEach(([packId, pack]) => {
      packsById[packId] = pack;
    });

    Object.entries(packsById).forEach(([, pack]) => {
      if (pack.state === 'pass') {
        rendererParams.numPassedTests += 1;
      } else if (pack.state === 'fail') {
        rendererParams.numFailedTests += 1;
      } else if (['run'].includes(pack.state)) {
        rendererParams.numPendingTests += 1;
      }

      rendererParams.numTotalTests += 1;
    });

    nyanRenderer.draw(rendererParams);
  };

  // onTestRemoved?: (trigger?: string) => Awaitable<void>
  // onWatcherStart?: (files?: File[], errors?: unknown[]) => Awaitable<void>
  // onWatcherRerun?: (files: string[], trigger?: string) => Awaitable<void>

  // onServerRestart?: (reason?: string) => Awaitable<void>

  // onUserConsoleLog?: (log: UserConsoleLog) => Awaitable<void>

  // onProcessTimeout?: () => Awaitable<void>
}

module.exports = NyanReporter;
