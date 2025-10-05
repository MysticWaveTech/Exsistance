const field = document.getElementById('toyobiField');
const GRID = 8;
const nodes = [];

// Fetch hidden “internet pressure” (simulated)
const internetPressure = JSON.parse(document.getElementById('internetPressure').textContent);
console.log("Taut pressure sourced from internet:", internetPressure.source);

// --- Create recursive micro-node for complete chirality ---
function createNode(depth = 0, maxDepth = 2) {
  const node = document.createElement('div');
  node.className = 'node';

  const rx = Math.random() * 360;
  const ry = Math.random() * 360;
  const rz = Math.random() * 360;
  node.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;

  if (depth < maxDepth) {
    const microCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < microCount; i++) {
      const micro = createNode(depth + 1, maxDepth);
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

// --- Initialize grid ---
for (let i = 0; i < GRID * GRID; i++) {
  const node = createNode();
  field.appendChild(node);
  nodes.push(node);
}

// --- Recursive self-correcting “taut pressure” from hidden/internet source ---
function enforceChirality() {
  nodes.forEach(node => {
    const allNodes = [node, ...node.querySelectorAll('.node')];
    allNodes.forEach(n => {
      const transform = n.style.transform;
      const angles = transform.match(/-?\d+\.?\d*/g).map(Number);

      // Micro perturbations amplified by internet pressure intensity
      angles[0] += (Math.random() - 0.5) * 1.5 * internetPressure.intensity;
      angles[1] += (Math.random() - 0.5) * 1.5 * internetPressure.intensity;
      angles[2] += (Math.random() - 0.5) * 1.5 * internetPressure.intensity;

      n.style.transform = `rotateX(${angles[0]}deg) rotateY(${angles[1]}deg) rotateZ(${angles[2]}deg)`;
    });
  });

  requestAnimationFrame(enforceChirality);
}

// Start enforcement
enforceChirality();