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
      cx,
      cy,
      size,
      color: COLOR_SCALE(cx),
      xVelocity,
      yVelocity,
    };
  }

  const computeLinks = (nodeData) => {
    const linkData = [];

    let nodeDataClone = [].concat(nodeData);
    nodeData.forEach(item => {
      nodeDataClone.forEach(item2 => {
        let dist = (item2.cy - item.cy) ** 2 + (item2.cx - item.cx) ** 2;
        if (dist < LINK_THRESHOLD) {
          linkData.push({
            x1: item.cx,
            y1: item.cy,
            x2: item2.cx,
            y2: item2.cy,
            distance: dist,
          });
        }
      });
      nodeDataClone.shift();
    });

    return linkData;
  }

  // Define canvas
  const sketch = body.append("custom:sketch")
    .attr("width", windowWidth)
    .attr("height", windowHeight)
    .call(animate);

  // Create nodes
  const nodeData = d3.range(NODE_COUNT).map(generateNode);
  const nodes = sketch.selectAll("circle")
    .data(nodeData)
    .enter()
    .append("custom:circle")
    .attr("r", node => node.size);

  // Create links
  let linkData = computeLinks(nodeData);
  const links = sketch.selectAll("line")
    .data(linkData)
    .enter()
    .append("custom:line");

  function animate(selection) {
    selection.each(function() {
      const root = this,
        canvas = root.parentNode.appendChild(document.createElement("canvas")),
        context = canvas.getContext("2d");
      
      // Set canvas properties
      canvas.style.position = "absolute";
      canvas.style.top = root.offsetTop + "px";
      canvas.style.left = root.offsetLeft + "px";
      canvas.width = root.getAttribute("width");
      canvas.height = root.getAttribute("height");
      
      d3.timer((elapsed) => {
        let nodeDataClone = [].concat(nodeData);
        linkData = [];
        
        nodeData.forEach(node => {
          // Apply movement to all nodes using x/yVelocity
          let yPosition = node.cy + node.yVelocity;
          if (yPosition < 0 || windowHeight < yPosition) {
            node.yVelocity *= -1; 
          }
          node.cy += node.yVelocity;
    
          let xPosition = node.cx + node.xVelocity;
          if (xPosition < 0 || windowWidth < xPosition) {
            node.xVelocity *= -1;
          }
          node.cx += node.xVelocity;
    
          node.color = COLOR_SCALE(node.cx);

          // Compute links
          nodeDataClone.forEach(node2 => {
            let dist = (node2.cy - node.cy) ** 2 + (node2.cx - node.cx) ** 2;
            if (dist < LINK_THRESHOLD) {
              linkData.push({
                x1: node.cx,
                y1: node.cy,
                x2: node2.cx,
                y2: node2.cy,
                distance: dist,
              });
            }
          });
          nodeDataClone.shift();

          return node;
        });

        // Create links as lines in svg
        links.data(linkData)
          .attr('stroke', link => {
            let color = COLOR_SCALE(link.x1);
            color.opacity = OPACITY_SCALE(link.distance);
            return color;
          })
          .attr('x1', link => link.x1)
          .attr('y1', link => link.y1)
          .attr('x2', link => link.x2)
          .attr('y2', link => link.y2)
          .exit().remove();
        
        // Create nodes as circles in svg
        nodes.data(nodeData)          
          .attr("cx", node => node.cx)
          .attr("cy", node => node.cy)
          .attr("fill", node => node.color);
          
        // Faster than resetting canvas' width and height
        context.clearRect(0, 0, windowWidth, windowHeight);

        // Goes through all the elements to render in the canvas
        for (var element = root.firstChild; element; element = element.nextSibling) {
          switch (element.tagName) {
            case "CIRCLE":
              context.fillStyle = element.getAttribute("fill");
              context.beginPath();
              context.arc(element.getAttribute("cx"), element.getAttribute("cy"), element.getAttribute("r"), 0, FULL_CIRCLE);
              context.fill();
              break;
            case "LINE":
              context.strokeStyle = element.getAttribute("stroke");
              context.beginPath();
              context.moveTo(element.getAttribute("x1"), element.getAttribute("y1"));
              context.lineTo(element.getAttribute("x2"), element.getAttribute("y2"));
              context.stroke();
              break;
          }
        }
      });
    });
  }
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