import { timer } from './timer.js';

/** 事件分发 */
const dispatch = (events) => {
  const _ = {};
  events.forEach((k) => {
    _[k] = [];
  });

  function fn() {}

  fn._ = _;

  fn.get = (type, name) => {
    const target = type.find((item) => item.name === name);
    if (target) return target.value;
  };

  // 去除同名回调，增加新回调
  fn.set = (type, name, callback) => {
    const i = type.findIndex((v) => v.name === name);
    if (i != -1) {
      type.splice(i, 1);
    }
    if (callback != null) {
      type.push({ name: name, value: callback });
    }
    return type;
  };

  fn.parseTypenames = (typenames) => {
    return typenames
      .trim()
      .split(/^|\s+/)
      .map(function (t) {
        var name = '',
          i = t.indexOf('.');
        if (i >= 0) (name = t.slice(i + 1)), (t = t.slice(0, i));
        return { type: t, name: name };
      });
  };

  fn.on = (typename, callback) => {
    var _ = this._,
      T = parseTypenames(typename + ''),
      t,
      i = -1,
      n = T.length;

    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      }
      return;
    }

    while (++i < n) {
      if ((t = (typename = T[i]).type)) {
        _[t] = set(_[t], typename.name, callback);
      } else if (callback == null) {
        for (t in _) {
          _[t] = set(_[t], typename.name, null);
        }
      }
    }
    return this;
  };

  fn.call = (type, that) => {
    if ((n = arguments.length - 2) > 0) {
      for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    }
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  };

  return fn;
};

/** 随机数 线性同余方程 */
const lcg = () => {
  let s = 1;
  return () => {
    s = (1664525 * s + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

/** forceSimulation */
const forceSimulation = (nodes = []) => {
  let alpha = 1;
  let alphaMin = 0.001;
  //衰减系数
  let alphaDecay = 1 - Math.pow(alphaMin, 1 / 300);
  let alphaTarget = 0;
  let velocityDecay = 0.6;
  const forces = new Map();
  const stepper = timer(step);
  const event = dispatch(['tick', 'end']);
  const random = lcg();

  function step() {
    tick();
    event.call('tick', simulation);
    console.log(333, alpha, alphaMin);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call('end', simulation);
    }
  }

  //每次迭代
  function tick(iterations = 1) {
    for (let i = 0; i < iterations; i++) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach((f) => f(alpha));
      nodes.forEach((node) => {
        if (node.fx == null) {
          node.vx *= velocityDecay;
          node.x += node.vx;
        } else {
          node.x = node.fx;
          node.vx = 0;
        }
        if (node.fy == null) {
          node.vy *= velocityDecay;
          node.y += node.vy;
        } else {
          node.y = node.fy;
          node.vy = 0;
        }
      });
    }
    return simulation;
  }

  //设置力
  const initializeForce = (f) => {
    if (f.initialize) f.initialize(nodes, random);
    return f;
  };

  //初始化节点
  const initNodes = () => {
    nodes.forEach((node, i) => {
      node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;
      if (node.x == undefined || node.y == undefined) {
        const radius = 10 * Math.sqrt(0.5 + i);
        const angle = i * Math.PI * (3 - Math.sqrt(5));
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (node.vx == undefined || node.vy == undefined) {
        node.vx = 0;
        node.vy = 0;
      }
    });
  };

  initNodes();

  const simulation = {
    alpha: (v) => {
      if (v != undefined) {
        alpha = v;
      }
    },
    alphaMin: (v) => {
      if (v != undefined) {
        alphaMin = v;
      }
    },
    alphaDecay: (v) => {
      if (v != undefined) {
        alphaDecay = v;
      }
    },
    alphaTarget: (v) => {
      if (v != undefined) {
        alphaTarget = v;
      }
    },
    velocityDecay: (v) => {
      if (v != undefined) {
        velocityDecay = 1 - v;
      }
    },
    tick: tick,
    restart: () => {
      stepper.restart(step);
      return simulation;
    },
    stop: () => {
      stepper.stop();
      return simulation;
    },
    nodes: (list = []) => {
      if (list.length) {
        nodes = list;
        initNodes();
        forces.forEach((f) => initializeForce(f));
      }
      return nodes;
    },
    randomSource: (v) => {
      if (v != undefined) {
        random = v;
        forces.forEach((f) => initializeForce(f));
      }
    },
    force: (name, v) => {
      forces.set(name, initializeForce(v));
      return simulation;
    },
    //获取最近的节点
    find: (x, y, radius = Infinity) => {
      let dx;
      let dy;
      let d2;
      let r2 = radius * radius;
      let closest;
      nodes.forEach((node) => {
        dx = x - node.x;
        dy = y - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          closest = node;
          r2 = d2;
        }
      });
      return closest;
    },
    on: (name, v) => {
      event.on(name, v);
    },
  };
  return simulation;
};

/** forceX */
const forceX = (x = 0) => {
  let strength = () => 0.1;
  let nodes = [];
  let xz = [];
  let strengths = [];

  if (typeof x !== 'function') {
    const v = x;
    x = () => v;
  }

  function force(alpha) {
    nodes.forEach((node, i) => {
      node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    });
  }

  function initialize() {
    if (!nodes) return;
    const len = nodes.length;
    strengths = new Array(len);
    xz = new Array(len);
    nodes.forEach((node, i) => {
      xz[i] = x(node, i, nodes);
      strengths[i] = isNaN(xz[i]) ? 0 : strength(node, i, nodes);
    });
  }

  force.initialize = (v = []) => {
    nodes = v;
    initialize();
  };

  force.strength = (v) => {
    if (v != undefined) {
      strength = typeof v === 'function' ? v : () => v;
      initialize();
      return force;
    } else return strength;
  };

  force.x = (v) => {
    if (v != undefined) {
      x = typeof v === 'function' ? v : () => v;
      initialize();
      return force;
    } else return x;
  };

  return force;
};

/** forceY */
const forceY = (y) => {
  let strength = () => 0.1;
  let nodes = [];
  let yz = [];
  let strengths = [];

  if (typeof y !== 'function') {
    const v = y;
    y = () => v;
  }

  function force(alpha) {
    nodes.forEach((node, i) => {
      node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    });
  }

  function initialize() {
    if (!nodes) return;
    const len = nodes.length;
    strengths = new Array(len);
    yz = new Array(len);
    nodes.forEach((node, i) => {
      yz[i] = y(node, i, nodes);
      strengths[i] = isNaN(yz[i]) ? 0 : strength(node, i, nodes);
    });
  }

  force.initialize = (v = []) => {
    nodes = v;
    initialize();
  };

  force.strength = (v) => {
    if (v != undefined) {
      strength = typeof v === 'function' ? v : () => v;
      initialize();
      return force;
    } else return strength;
  };

  force.y = (v) => {
    if (v != undefined) {
      y = typeof v === 'function' ? v : () => v;
      initialize();
      return force;
    } else return y;
  };

  return force;
};

/** forceCenter 中心力 */
const forceCenter = (x = 0, y = 0) => {
  let nodes = [];
  let strength = 1;

  //力模拟
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

// /** forceCollide 碰撞力 */
// const forceCollide = (radius = 1) => {
//   let nodes = [];
//   let radii;
//   let random;
//   let strength = 1;
//   let iterations = 1;

//   function force() {
//     let tree;
//     let xi;
//     let yi;
//     let ri;
//     let ri2;

//     for (let i = 0; i < iterations; i++) {
//       tree = quadtree(nodes, x, y).visitAfter(prepare);
//       nodes.forEach((node) => {
//         ri = radii[node.index];
//         ri2 = ri * ri;
//         xi = node.x + node.vx;
//         yi = node.y + node.vy;
//         tree.visit(apply);
//       });
//     }

//     function apply(quad, x0, y0, x1, y1) {
//       let data = quad.data;
//       let rj = quad.r;
//       let r = ri + rj;
//       if (data) {
//         if (data.index > node.index) {
//           let x = xi - data.x - data.vx;
//           let y = yi - data.y - data.vy;
//           let l = x * x + y * y;
//           if (l < r * r) {
//             if (x === 0) {
//               x = jiggle(random);
//               l += x * x;
//             }
//             if (y === 0) {
//               y = jiggle(random);
//               l += y * y;
//             }
//             l = ((r - (l = Math.sqrt(l))) / l) * strength;
//             node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
//             node.vy += (y *= l) * r;
//             data.vx -= x * (r = 1 - r);
//             data.vy -= y * r;
//           }
//         }
//         return;
//       }
//       return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
//     }
//   }

//   function jiggle(randomFn) {
//     return (randomFn() - 0.5) * 1e-6;
//   }

//   function prepare(quad) {
//     if (quad.data) return (quad.r = radii[quad.data.index]);
//     quad.r = 0;
//     for (let i = 0; i < 4; ++i) {
//       if (quad[i] && quad[i].r > quad.r) {
//         quad.r = quad[i].r;
//       }
//     }
//   }

//   function initialize() {
//     radii = [];
//     nodes.forEach((node, i) => {
//       radii[node.index] = +radius(node, i, nodes);
//     });
//   }

//   force.initialize = (_nodes, _random) => {
//     nodes = _nodes;
//     random = _random;
//     initialize();
//   };

//   force.iterations = function (v) {
//     if (v != undefined) {
//       iterations = v;
//       return force;
//     } else return iterations;
//   };

//   force.strength = function (v) {
//     if (v != undefined) {
//       strength = v;
//       return force;
//     } else return strength;
//   };

//   force.radius = (v) => {
//     if (v != undefined) {
//       radius = v;
//       initialize();
//       return force;
//     } else return radius;
//   };

//   return force;
// };

// /** quad tree */
// function quadtree(nodes, x, y) {
//   const tree = new Quadtree(x, y, NaN, NaN, NaN, NaN);
//   if (nodes) {
//     tree.addAll(nodes);
//   }
//   return tree;
// }

// function Quadtree(x, y, x0, y0, x1, y1) {
//   this._x = x;
//   this._y = y;
//   this._x0 = x0;
//   this._y0 = y0;
//   this._x1 = x1;
//   this._y1 = y1;
//   this._root = undefined;
// }

// Quadtree.prototype.visitAfter = (cb) => {
//   const quads = [];
//   const next = [];
//   // const q;
// };

export default {
  forceSimulation,
  forceCenter,
  forceX,
  forceY,
  // forceCollide,
};
