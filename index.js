'use strict';

let assert = require('assert');
let co = require('co');

let NRFSecure = require('./nrf-secure');
let GarageDoor = require('./garage-door-ctl');

function *main() {
  let door = new GarageDoor();

  let secretArg = process.argv[2];

  assert(secretArg, 'Missing secret key');

  let secret = secretArg.split(',').map(v => {
    return parseInt(v, 16);
  });

  yield door.connect(new NRFSecure({
    spiDev: '/dev/spidev0.0',
    ce: 22,
    irq: 25,
    tx: 0x65646f4e31,
    rx: 0x65646f4e32
  }, new Buffer(secret)));


  while (true) {
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    yield door.monitor();
  }
}

co(main).catch(err => {
  console.error(err);
});
