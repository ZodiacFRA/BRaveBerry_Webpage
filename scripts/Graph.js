function createGraph(descriptor, color = "#f8f8f2") {
  const ctx = document.getElementById(descriptor + '_canvas');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "testLabel",
        data: [],
        fill: false,
        borderColor: color,
        tension: 0.1,
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false //this will remove only the label
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
            zeroLineColor: '#6272a4'
          }
        }],
        yAxes: [{
          ticks: {
            min: -1,
            max: 1,
            display: false //this will remove only the label
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
            zeroLineColor: '#6272a4'
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      elements: {
        point: {
          radius: 0
        }
      }
    }
  });
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
}

function updateGraph(data) {
  const descriptors = ["centroid", "rms", "bandwidth", "sharpness", "booming"];
  const chartHandle = Chart.instances[descriptors.indexOf(data.descriptor)];
  var dataLength = chartHandle.data.datasets[0].data.length;
  for (var i = 0; i < dataLength; i++) {
    removeData(chartHandle);
  }
  for (var i = 0; i < data.data.length; i++) {
    addData(chartHandle, i.toString(), data.data[i]);
  }
  chartHandle.update()
}

export {
  createGraph,
  updateGraph,
};