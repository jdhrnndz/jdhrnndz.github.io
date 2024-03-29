window.onload = () => {
  const w = window,
  d = document,
  e = d.documentElement,
  body = d3.select("body");
  windowWidth = w.innerWidth || e.clientWidth || body.clientWidth,
  windowHeight = w.innerHeight || e.clientHeight || body.clientHeight;

  // Event Listeners
  window.addEventListener('mousemove', (event) => {
    console.info('Mouse moved' + event.offsetX + ' ' + event.offsetY);
  }, true);

  // Config Values
  const GRADIENT = d3.interpolateRgb("#bce876", "#328173");
  const COLOR_SCALE = d3.scaleSequential((t) => d3.rgb(GRADIENT(t))).domain([0, windowWidth]);
  const SCREEN_AREA = windowWidth * windowHeight;
  const MIN_LINK_THRESHOLD = SCREEN_AREA * 0.001; // in pixels
  const MAX_LINK_THRESHOLD = SCREEN_AREA * 0.01; // in pixels
  const OPACITY_SCALE = d3.scaleLinear().domain([MIN_LINK_THRESHOLD, MAX_LINK_THRESHOLD]).range([1, 0.2]);
  const FULL_CIRCLE = 2 * Math.PI;
  const NODE_COUNT = Math.max(50, Math.min(150, Math.round(SCREEN_AREA / 10000)));
  let MOVE_SPEED = 0.025;
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
    let size = d3.randomUniform(3, 5)();
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
    xVelocity = xVelocity * size * MOVE_SPEED;
    yVelocity = yVelocity * size * MOVE_SPEED;

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
    context.lineWidth = 0.5;
    let dist = (destination.cy - source.cy) ** 2 + (destination.cx - source.cx) ** 2;
    if (MIN_LINK_THRESHOLD < dist && dist < MAX_LINK_THRESHOLD) {
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

  const buttons = document.getElementsByTagName("button");
  const banner = document.getElementsByClassName("banner")[0];

  for (let i=0; i<buttons.length; i++) {
    buttons.item(i).addEventListener("click", () => { banner.classList += " element-exit" });
  }
};