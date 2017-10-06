(() => {
  const w = window,
  d = document,
  e = d.documentElement,
  body = d3.select("body");
  windowWidth = w.innerWidth || e.clientWidth || body.clientWidth,
  windowHeight = w.innerHeight|| e.clientHeight || body.clientHeight;

  // Config Values
  const GRADIENT = d3.interpolateRgb("#77c9d4", "#015249");
  const COLOR_SCALE = d3.scaleSequential((t) => d3.rgb(GRADIENT(t))).domain([0, windowWidth]);
  const LINK_THRESHOLD = 100 ** 2; // in pixels
  const OPACITY_SCALE = d3.scaleLinear().domain([0, LINK_THRESHOLD]).range([1, 0.2]);
  const FULL_CIRCLE = 2 * Math.PI;
  const SCREEN_AREA = windowWidth * windowHeight;
  const NODE_COUNT = Math.max(50, Math.min(150, Math.round(SCREEN_AREA / 10000)));
  const canvas = document.getElementsByTagName("canvas")[0];
  const context = canvas.getContext("2d");

  // Set canvas properties
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.width = windowWidth;
  canvas.height = windowHeight;

  // Utils
  const generateNode = (i) => {
    let size = d3.randomUniform(2, 3)();
    let cx = d3.randomUniform(1 + size, windowWidth - size)();
    let cy = d3.randomUniform(1 + size, windowHeight - size)();
    let xVelocity;
    let yVelocity;
    // Randomize slope grade, i.e. [0, 100]
    yVelocity = Math.round(d3.randomUniform(1, 100)()) * 0.01;
    // Compute velocity using circle formula; quadrant randomized by multiplying -1 to 1 or 2
    xVelocity = Math.pow(-1, Math.round(d3.randomUniform(1, 2)())) * Math.sqrt(1 - yVelocity ** 2);
    yVelocity = Math.pow(-1, Math.round(d3.randomUniform(1, 2)())) * Math.sqrt(1 - xVelocity ** 2);
    // Apply mass ¯\_(ツ)_/¯
    xVelocity = xVelocity * size * 0.2;
    yVelocity = yVelocity * size * 0.2;

    return {
      cx, cy, size,
      color: COLOR_SCALE(cx),
      xVelocity, yVelocity,
    };
  }

  const drawNodes = (context, node) => {
    context.fillStyle = node.color;
    context.beginPath();
    context.arc(node.cx, node.cy, node.size, 0, FULL_CIRCLE);
    context.fill();
  }

  const drawLinks = (context, source, destination) => {
    let dist = (destination.cy - source.cy) ** 2 + (destination.cx - source.cx) ** 2;
    if (dist < LINK_THRESHOLD) {
      let color = source.color;
      color.opacity = OPACITY_SCALE(dist);
      context.strokeStyle = color;
      context.beginPath();
      context.moveTo(source.cx, source.cy);
      context.lineTo(destination.cx, destination.cy);
      context.stroke(); 
    }
  }

  // Create nodes
  const nodeData = d3.range(NODE_COUNT).map(generateNode);

  d3.timer((elapsed) => {
    // Faster than resetting canvas' width and height
    context.clearRect(0, 0, windowWidth, windowHeight);
    
    for (let i=0; i < NODE_COUNT; i++) {
      // Apply movement to all nodes using x/yVelocity
      nodeData[i].cy += nodeData[i].yVelocity;
      if (nodeData[i].cy < 0 || windowHeight < nodeData[i].cy) {
        nodeData[i].yVelocity *= -1; 
      }

      nodeData[i].cx += nodeData[i].xVelocity
      if (nodeData[i].cx < 0 || windowWidth < nodeData[i].cx) {
        nodeData[i].xVelocity *= -1;
      }

      nodeData[i].color = COLOR_SCALE(nodeData[i].cx);

      drawNodes(context, nodeData[i]);

      for (let j=i+1; j < NODE_COUNT; j++) {
        drawLinks(context, nodeData[i], nodeData[j]);
      }
    }
  });
})();

document.getElementsByClassName("banner")[0].addEventListener("mouseover", () => {
  document.getElementsByTagName("canvas")[0].classList.add("blur");
});

document.getElementsByClassName("banner")[0].addEventListener("mouseout", () => {
  document.getElementsByTagName("canvas")[0].classList.remove("blur");
});

document.getElementsByClassName("banner")[0].addEventListener("click", () => {
  if (document.getElementsByTagName("body")[0].classList.contains("dark")) {
    document.getElementsByTagName("body")[0].classList.remove("dark");
  }
  else {
    document.getElementsByTagName("body")[0].classList.add("dark");
  }
});