import {
  getLfoControls,
} from "./LFO.js";

function getRadio(descriptor, name, socket, isSelected = false) {
  var mainDiv = document.createElement("div");
  var inputDiv = document.createElement("input");
  var id = name.toLowerCase();
  inputDiv.setAttribute("type", "radio");
  inputDiv.setAttribute("id", id);
  inputDiv.setAttribute("value", id);
  // Same name for all radioButtons of this descriptor
  inputDiv.setAttribute("name", descriptor.toLowerCase() + "_input_source");

  var labelDiv = document.createElement("label");
  labelDiv.setAttribute("for", id);
  labelDiv.appendChild(document.createTextNode(name));

  mainDiv.appendChild(inputDiv);
  mainDiv.appendChild(labelDiv);

  if (isSelected) {
    inputDiv.setAttribute("checked", true);
  }
  inputDiv.onchange = function() {
    var event = {
      type: descriptor.toLowerCase() + "_input_source",
      state: inputDiv.value
    }
    socket.send(JSON.stringify(event));
  }
  return mainDiv;
}

function getInputSource(descriptor, socket) {
  var fieldset = document.createElement("fieldset");
  fieldset.classList.add('flexRow');

  var legend = document.createElement("legend");
  legend.appendChild(document.createTextNode("Audio input selection"));
  fieldset.appendChild(legend);
  fieldset.appendChild(getRadio(descriptor, "Original", socket, true));
  fieldset.appendChild(getRadio(descriptor, "External", socket));
  fieldset.appendChild(getRadio(descriptor, "None", socket));
  return fieldset;
}


function createDescriptorContent(descriptor, description, socket) {
  var content = document.createElement("div");
  content.classList.add('DescriptorsController');
  // Title (Top)
  var title = document.createElement("h2");
  title.classList.add('sectionTitle');
  title.appendChild(document.createTextNode(descriptor));

  var sectionContent = document.createElement("div");
  sectionContent.classList.add('sectionContent');

  // var descriptionDiv = document.createElement("p");
  // descriptionDiv.classList.add('descriptions');
  // descriptionDiv.appendChild(document.createTextNode(description));
  // sectionContent.appendChild(descriptionDiv);
  var graph = document.createElement("canvas");
  graph.setAttribute("id", descriptor + "_canvas");
  sectionContent.appendChild(graph);
  // sectionContent.appendChild(createGraph(descriptor));

  sectionContent.appendChild(getInputSource(descriptor, socket));

  // Modulation activation
  var lfo_activation = document.createElement("div");
  var inputDiv = document.createElement("input");
  inputDiv.setAttribute("type", "checkbox");
  inputDiv.onclick = function() {
    var event = {
      type: descriptor.toLowerCase() + "_modulation_activated",
      state: inputDiv.checked
    }
    socket.send(JSON.stringify(event));

    console.log(inputDiv.checked);
    var id = descriptor + "_lfo_controls ";
    var all = document.querySelectorAll(
      "#" + id + "select, #" +
      id + "input");
    for (let el of all) {
      el.disabled = !inputDiv.checked;
    }

  }
  lfo_activation.appendChild(inputDiv);
  lfo_activation.appendChild(document.createTextNode("Enable modulation"));
  sectionContent.appendChild(lfo_activation);
  // Waveform selection (Left)
  sectionContent.appendChild(getLfoControls(descriptor, description, socket));
  // Needed to disable the LFO controls at start
  var id = descriptor + "_lfo_controls ";
  var all = sectionContent.querySelectorAll(
    "#" + id + "select, #" +
    id + "input");
  for (let el of all) {
    el.disabled = true;
  }

  content.append(title);
  content.append(sectionContent);
  return content;
}

export {
  createDescriptorContent
};