// M = moveto
// L = lineto
// H = horizontal lineto
// V = vertical lineto
// C = curveto
// S = smooth curveto
// Q = quadratic Bézier curve
// T = smooth quadratic Bézier curveto
// A = elliptical Arc
// Z = closepath
function getSVG(pathPoints, viewbox = "0 0 100 100", animationPoints = null) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "75px");
  svg.setAttribute("height", "auto");
  svg.setAttribute("viewBox", viewbox);
  svg.setAttribute("style", "stroke-width: 2px;");
  const path = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  path.setAttribute("d", pathPoints);

  if (animationPoints) {
    const animation = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate",
    );
    animation.setAttribute("attributeName", "d");
    animation.setAttribute("dur", "40s");
    animation.setAttribute("repeatCount", "indefinite");
    animation.setAttribute("values", animationPoints);
    path.appendChild(animation)
  }

  path.setAttribute("stroke", "white");
  path.setAttribute("fill", "transparent");
  svg.appendChild(path);
  return svg;
}

function getRandomSvgPath() {
  var res = "M 0 50 C "
  for (var x = 0; x < 200; x += 10) {
    res += x;
    res += " ";
    res += Math.floor(Math.random() * 100);
    res += ", "
  }
  res += "200 50";
  return res;
}

function getLfoRadioInput(descriptor, socket, name, svg, isSelected = false) {
  var mainDiv = document.createElement("div");
  mainDiv.classList.add('flexRow');
  var inputDiv = document.createElement("input");
  var id = name.toLowerCase();
  inputDiv.setAttribute("type", "radio");
  inputDiv.setAttribute("id", id);
  inputDiv.setAttribute("value", id);
  // Same name for all radioButtons of this descriptor
  inputDiv.setAttribute("name", descriptor + "_lfo_choice");
  if (isSelected) {
    inputDiv.setAttribute("checked", true);
  }
  inputDiv.onchange = function() {
    var event = {
      type: descriptor.toLowerCase() + "_lfo_waveform",
      state: inputDiv.value
    }
    socket.send(JSON.stringify(event));
  }
  mainDiv.appendChild(inputDiv);
  mainDiv.appendChild(svg);
  return mainDiv;
}

function getWaveformChoice(descriptor, socket) {
  var fieldset = document.createElement("fieldset");
  var legend = document.createElement("legend");
  legend.appendChild(document.createTextNode("Waveform"));
  fieldset.appendChild(legend);
  fieldset.appendChild(getLfoRadioInput(
    descriptor,
    socket,
    "Sine",
    getSVG("M 0 50 C 50 -10, 50 -10, 100 50 S 150 110, 200 50", "-1 -1 202 102"),
    true
  ));
  fieldset.appendChild(getLfoRadioInput(
    descriptor,
    socket,
    "Square",
    getSVG("M 0 50 V 0 0 H 100 0 M 100 0 V 100 100 H 200 100 M 200 100 V 200 50", "-1 -1 202 102"),
  ));
  fieldset.appendChild(getLfoRadioInput(
    descriptor,
    socket,
    "Saw",
    getSVG("M0 50 L 50 0 L 150 100 L 200 50", "-1 -1 202 102"),
  ));
  var start = getRandomSvgPath();
  var res = "";
  for (var i = 0; i < 5; i++) {
    res = res + "; " + getRandomSvgPath();
  }
  res = start + res + "; " + start;
  console.log(res);
  fieldset.appendChild(getLfoRadioInput(
    descriptor,
    socket,
    "Noise",
    getSVG(start, "-1 -1 202 102", res),
  ));
  return fieldset;
}

function getSlider(descriptor, socket, label, id, min, max, value) {
  var mainDiv = document.createElement("div");
  var labelDiv = document.createElement("p");
  labelDiv.appendChild(document.createTextNode(label));
  var slider = document.createElement('input');
  slider.id = id;
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.step = 1;
  slider.onchange = function(event) {
    var event = {
      type: descriptor.toLowerCase() + "_" + id,
      state: slider.value
    }
    socket.send(JSON.stringify(event));
  }
  mainDiv.appendChild(labelDiv);
  mainDiv.appendChild(slider);
  return mainDiv;
}

function getLfoControls(descriptor, description, socket) {
  var lfoControls = document.createElement("div");
  lfoControls.classList.add('flexRow');
  lfoControls.setAttribute("id", descriptor + "_lfo_controls");
  lfoControls.appendChild(getWaveformChoice(descriptor, socket));
  // LFO controls sliders
  var sliders = document.createElement("div");
  sliders.classList.add('sliders');
  sliders.appendChild(getSlider(
    descriptor,
    socket,
    "Lfo Speed",
    "lfo_speed",
    0, 100, 50
  ));
  sliders.appendChild(getSlider(
    descriptor,
    socket,
    "Lfo Amplitude",
    "lfo_amplitude",
    0, 100, 50
  ));
  sliders.appendChild(getSlider(
    descriptor,
    socket,
    "Lfo Bias",
    "lfo_bias",
    0, 100, 50
  ));
  // Merge everything and return
  lfoControls.appendChild(sliders);
  return lfoControls;
}

export {
  getLfoControls,
};