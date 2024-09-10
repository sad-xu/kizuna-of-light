import ff from './force.js';

const { forceCenter, forceSimulation } = ff;

function assertNodeEqual(actual, expected, delta = 1e-6) {
  const flag =
    actual.index == expected.index &&
    Math.abs(actual.x - expected.x) < delta &&
    Math.abs(actual.vx - expected.vx) < delta &&
    Math.abs(actual.y - expected.y) < delta &&
    Math.abs(actual.vy - expected.vy) < delta &&
    !(Math.abs(actual.fx - expected.fx) > delta) &&
    !(Math.abs(actual.fy - expected.fy) > delta);
  if (flag) {
    console.log('Pass!');
  } else {
    console.log('Err! ', actual, expected);
  }
}

function assert(flag) {
  if (flag) {
    console.log('Pass!');
  } else {
    console.log('Err!');
  }
}
assert.strictEqual = (a, b) => {
  if (a === b) {
    console.log('Pass!');
  } else {
    console.log('Err! ', a, b);
  }
};
assert.deepStrictEqual = (a, b) => {
  if (Object.keys(b).every((k) => a[k] === b[k])) {
    console.log('Pass!');
  } else {
    console.log('Err! ', a, b);
  }
};

function it(title, fn) {
  console.log(title);
  fn();
}

////////////////////

const testForce = () => {
  it('forceCenter repositions nodes', () => {
    const center = forceCenter(0, 0);
    const f = forceSimulation().force('center', center).stop();
    const a = { x: 100, y: 0 },
      b = { x: 200, y: 0 },
      c = { x: 300, y: 0 };
    f.nodes([a, b, c]);
    f.tick();
    assertNodeEqual(a, { index: 0, x: -100, y: 0, vy: 0, vx: 0 });
    assertNodeEqual(b, { index: 1, x: 0, y: 0, vy: 0, vx: 0 });
    assertNodeEqual(c, { index: 2, x: 100, y: 0, vy: 0, vx: 0 });
  });
};

testForce();
