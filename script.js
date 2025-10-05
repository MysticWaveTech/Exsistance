const field = document.getElementById('toyobiField');
const GRID = 8;
const nodes = [];

// Optional: auto-timer cycle
const ENFORCE_DURATION_MS = 30000; // 30 seconds
const REST_DURATION_MS = 5000;     // 5 seconds pause

// --- Hidden taut pressure (conceptual from template/json) ---
const tautPressureTemplate = document.getElementById('tautPressureTemplate');
const internetPressure = JSON.parse(document.getElementById('internetPressure').textContent || '{"intensity":1}');

// --- Deterministic micro-node creation ---
function createNode(depth = 0, maxDepth = 2, parentIndex = 0) {
  const node = document.createElement('div');
  node.className = 'node';

  // Set initial deterministic rotation
  const rx = (parentIndex * 13 + depth * 19) % 360;
  const ry = (parentIndex * 17 + depth * 23) % 360;
  const rz = (parentIndex * 19 + depth * 29) % 360;
  node.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

  // Recursive micro-nodes
  if (depth < maxDepth) {
    const microCount = 2 + (depth % 2); // deterministic count
    for (let i = 0; i < microCount; i++) {
      const micro = createNode(depth + 1, maxDepth, i + parentIndex);
      micro.style.width = `${50 / (depth + 1)}%`;
      micro.style.height = `${50 / (depth + 1)}%`;
      micro.style.position = 'absolute';
      micro.style.top = `${25 / (depth + 1)}%`;
      micro.style.left = `${25 / (depth + 1)}%`;
      node.appendChild(micro);
    }
  }

  return node;
}

// --- Initialize main grid ---
for (let i = 0; i < GRID * GRID; i++) {
  const node = createNode(0, 2, i);
  field.appendChild(node);
  nodes.push(node);
}

// --- Deterministic, straightened enforcement ---
function enforceChiralityDeterministic() {
  const start = Date.now();

  function tick() {
    const elapsed = Date.now() - start;

    if (elapsed < ENFORCE_DURATION_MS) {
      nodes.forEach((node, idx) => {
        const allNodes = [node, ...node.querySelectorAll('.node')];
        allNodes.forEach((n, subIdx) => {
          const depth = n.closest('.node') ? 1 : 0;

          // Deterministic angles based on indices and depth
          const rx = (idx * 13 + subIdx * 7 + depth * 19) % 360;
          const ry = (idx * 17 + subIdx * 11 + depth * 23) % 360;
          const rz = (idx * 19 + subIdx * 13 + depth * 29) % 360;

          n.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
        });
      });

      requestAnimationFrame(tick);
    } else {
      // Pause, then restart cycle
      setTimeout(enforceChiralityDeterministic, REST_DURATION_MS);
    }
  }

  tick();
}

// --- Start enforcement cycle ---
enforceChiralityDeterministic();

// --- Optional: log status for monitoring ---
setInterval(() => {
  console.log("Toyobi field enforcing deterministic chirality at", new Date().toISOString());
}, 5000);
