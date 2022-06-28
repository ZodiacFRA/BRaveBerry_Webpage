function populateSetupControllerLists(data, socket) {
  var models = data.models;
  var modelsList = document.getElementById("modelSelector");
  if (models.length > 0) {
    modelsList.remove(0);
    for (var i = 0; i < models.length; i++) {
      var option = new Option(models[i], models[i]);
      modelsList.appendChild(option);
    }
    modelsList[0].selected = "selected";
  }

  var audioSamplesCategories = data.audio_samples;
  // For Original sample
  var originalSampleList = document.getElementById("originalSampleSelector");

  for (let audioSamplesCategory in audioSamplesCategories) {
    var separator = new Option("----- " + audioSamplesCategory);
    separator.setAttribute("disabled", "");
    originalSampleList.appendChild(separator);
    var values = audioSamplesCategories[audioSamplesCategory];
    for (var i = 0; i < values.length; i++) {
      var option = new Option(values[i], values[i]);
      originalSampleList.appendChild(option);
    }
  }
  if (originalSampleList.length == 0) {
    var option = new Option("No audio samples found");
    option.setAttribute("disabled", "");
    originalSampleList.appendChild(option);
  }
  originalSampleList[1].selected = "selected";
  // For External sample
  var externalSampleList = document.getElementById("externalSampleSelector");

  for (let audioSamplesCategory in audioSamplesCategories) {
    var separator = new Option("----- " + audioSamplesCategory);
    separator.setAttribute("disabled", "");
    externalSampleList.appendChild(separator);
    var values = audioSamplesCategories[audioSamplesCategory];
    for (var i = 0; i < values.length; i++) {
      var option = new Option(values[i], values[i]);
      externalSampleList.appendChild(option);
    }
  }
  if (externalSampleList.length == 0) {
    var option = new Option("No audio samples found");
    option.setAttribute("disabled", "");
    externalSampleList.appendChild(option);
  }
  externalSampleList[1].selected = "selected";

  var updateButton = document.getElementById("change_model_sample");
  updateButton.onclick = function() {
    var event = {
      type: "model",
      state: modelsList.value,
    };
    socket.send(JSON.stringify(event));
    event = {
      type: "original_sample",
      state: originalSampleList.value,
    };
    socket.send(JSON.stringify(event));
    event = {
      type: "external_sample",
      state: externalSampleList.value,
    };
    socket.send(JSON.stringify(event));
  }
}

export {
  populateSetupControllerLists
};