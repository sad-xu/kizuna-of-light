/** 定时器 */
const timer = () => {};

/** 事件分发 */
const dispatch = () => {};

/** 随机数 线性同余方程 */
const lcg = () => {
  let s = 1;
  return () => {
    s = (1664525 * s + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

/** forceCenter */
const forceCenter = (x = 0, y = 0) => {
  let nodes = [];
  let strength = 1;

  function force() {
    let sx = 0;
    let sy = 0;

    nodes.forEach((node) => {
      sx += node.x;
      sy += node.y;
    });

    sx = (sx / nodes.length - x) * strength;
    sy = (sy / nodes.length - y) * strength;

    nodes.forEach((node) => {
      node.x -= sx;
      node.y -= sy;
    });
  }

  force.initialize = (v) => {
    nodes = v;
  };

  force.x = (v) => {
    if (v != undefined) {
      x = +v;
      return force;
    } else return x;
  };

  force.y = (v) => {
    if (v != undefined) {
      y = +v;
      return force;
    } else return x;
  };

  force.strength = (v) => {
    if (v != undefined) {
      strength = +v;
      return force;
    } else return strength;
  };

  return force;
};

/** forceSimulation */

export default {
  forceCenter,
};
