import {
  populateSetupControllerLists
} from "./Setup.js";

import {
  init
} from "./init.js";
import {
  updateGraph
} from "./Graph.js";


window.addEventListener("DOMContentLoaded", () => {
  // Hide control elements till we are connected
  document.getElementById("DescriptorsContent").style.display = "none";
  document.getElementById("SetupController").style.visibility = "hidden";
  document.getElementById("AudioController").style.visibility = "hidden";
  ////////////////////////
  // First connect
  var connectButton = document.getElementById("connectButton");
  connectButton.onclick = function() {
    //////////////////////
    // Open the WebSocket connection and register event handlers.
    var ip = document.getElementById("ip").value;
    if (!ip) {
      ip = "localhost";
    }
    var port = document.getElementById("port").value;
    if (!port) {
      port = "8001";
    }
    var url = "ws://" + ip + ":" + port;
    console.log("Connecting to " + url);
    const socket = new WebSocket(url);
    socket.onerror = function(error) {
      alert(`[-] Could not connect to the Raspi server: ${error.message}`);
    };
    socket.onopen = function(e) {
      console.log("[+] Connection established to the Raspi server");
      init(socket);
    };
    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[ ] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[-] Connection died');
      }
      alert("Disconnected from the Raspberry Pi, reload this page and try again");
    };
    socket.onmessage = function(event) {
      // console.log(`[ ] Data received from server: ${event.data}`);
      var data = JSON.parse(event.data)

      // var msg_type = document.createElement('td');
      // msg_type.appendChild(document.createTextNode(data.msg_type));
      // message.appendChild(msg_type);
      // var type = document.createElement('td');
      // type.appendChild(document.createTextNode(data.type));
      // message.appendChild(type);
      // var state = document.createElement('td');
      // state.appendChild(document.createTextNode(data.state));
      // message.appendChild(state);

      // Logging
      var consoleList = document.getElementById("console");
      var message = document.createElement('li');
      message.appendChild(document.createTextNode(event.data));

      if (data.msg_type != "none" & data.msg_type != "graph" & data.msg_type != "models_audio_samples_info") {
        consoleList.appendChild(message);
      }
      var msgNbr = consoleList.getElementsByTagName("li").length
      if (msgNbr > 20) {
        consoleList.removeChild(consoleList.firstElementChild);
      }

      if (data.msg_type == "models_audio_samples_info") {
        populateSetupControllerLists(data, socket);
      } else if (data.msg_type == "graph") {
        updateGraph(data);
      }
    };
  };
});