import {
  createDescriptorContent
} from "./Descriptors.js";

import {
  createGraph
} from "./Graph.js";


function init(socket) {
  // As we're now connected, show all the control options
  // and remove the networking options
  document.getElementById("NetworkController").style.display = "none";
  document.getElementById("SetupController").style.visibility = "visible";
  document.getElementById("AudioController").style.visibility = "visible";
  document.getElementById("DescriptorsContent").style.display = "flex";
  //////////////////////////////////////////////////
  // Add Audio Controls networking callbacks
  // Play / Pause button
  var play_button = document.getElementById("play_button")
  play_button.onclick = function(event) {
    var event = {
      type: "play",
      state: play_button.checked
    }
    socket.send(JSON.stringify(event));
  }
  // Record button
  document.getElementById("record_button").onclick = function(event) {
    var event = {
      type: "record",
      state: true
    }
    socket.send(JSON.stringify(event));
  }
  // Playback button
  document.getElementById("playback_button").onclick = function(event) {
    var event = {
      type: "playback",
      state: true
    }
    socket.send(JSON.stringify(event));
  }
  // Output volume
  var outputVolumeSlider = document.getElementById("outputVolume");
  outputVolumeSlider.onchange = function(event) {
    var event = {
      type: "output_volume",
      state: outputVolumeSlider.value
    }
    socket.send(JSON.stringify(event));
  }
  // Play samples
  var button = document.getElementById("play_original");
  button.onclick = function(event) {
    var event = {
      type: "play_sample",
      state: "original"
    }
    socket.send(JSON.stringify(event));
  }
  button = document.getElementById("play_external");
  button.onclick = function(event) {
    var event = {
      type: "play_sample",
      state: "external"
    }
    socket.send(JSON.stringify(event));
  }

  var content = document.getElementById("DescriptorsContent");
  const descriptors = ["Centroid", "RMS", "Bandwidth", "Sharpness", "Booming"];
  const descsColors = ["#50fa7b", "#8be9fd", "#ffb86c", "#ff79c6", "#f1fa8c"];
  const descriptorsDescriptions = [
    "Sound brightness",
    "Average loudness",
    "Frequencies width",
    "% of high frequency content",
    "Booming Index"
  ]
  for (var i = 0; i < descriptors.length; i++) {
    content.insertBefore(
      createDescriptorContent(
        descriptors[i],
        descriptorsDescriptions[i],
        socket
      ),
      document.getElementById("consoleWrapper")
    );
  }
  for (var i = 0; i < descriptors.length; i++) {
    createGraph(descriptors[i], descsColors[i]);
  }

  // createGraph(socket);
  // Set console and Graph the same height and width as the descriptors
  // var descsHeight = window.getComputedStyle(document.getElementsByClassName("sectionContent")[4], null);
  // descsHeight = descsHeight.getPropertyValue("height");
  // var descsWidth = window.getComputedStyle(document.getElementsByClassName("sectionContent")[4], null);
  // descsWidth = descsWidth.getPropertyValue("width");
  // descsWidth = descsWidth.slice(0, 3);
  // descsWidth = parseInt(descsWidth);
  //
  // var consoleWrapper = document.getElementById("consoleWrapper").lastElementChild;
  // consoleWrapper.setAttribute(
  //   "style",
  //   "width: " + descsWidth + "px;"
  //   // "height:" + descsHeight + "; width: " + descsWidth + "px;"
  // );
}

export {
  init
};