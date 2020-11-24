// Use D3 fetch to read the JSON file
function buildMetaData(sampleid){
  d3.json("samples.json").then((importedData) => {
    // console.log(importedData);
    var data = importedData.metadata.filter(sample => sample.id == sampleid)[0]
    var panel=d3.select("#sample-metadata")
    // clear out old data
    panel.html("")
    Object.entries(data).forEach(([key,value]) => {
      panel.append("h6").text(key+": " + value)
    })

    // // build guage

var gaugeData = [
{
  domain: { x: [0, 1], y: [0, 1] },
  value: data.wfreq,
  title: { text: "Belly Button Washing Frequency" },
  type: "indicator",
  mode: "gauge+number+delta",
  delta: { reference: 9, increasing: {color: "green"} },
  gauge: {
    axis: { range: [0, 10]},
    steps: [
      { range: [0, 5], color: "floralwhite" },
      { range: [5, 8], color: "yellowgreen" },
      {range: [8,10], color: "darkseagreen"}
    ],
    threshold: {
      line: { color: "red", width: 4 },
      thickness: 0.75,
      value: 9
    }
  }
}
];
var layout = { width: 400, height: 500, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', gaugeData, layout);
  })
}
function buildPlot(sampleid){

  // The data from the JSON file is arbitrarily named importedData as the argument
d3.json("samples.json").then((importedData) => {
  // console.log(importedData);
  var data = importedData.samples.filter(sample => sample.id == sampleid)[0]
  var otu_ids = data.otu_ids
  var otu_labels = data.otu_labels
  var sample_values = data.sample_values


// Trace1 
var trace1 = {
  x: sample_values.slice(0,10).reverse(),
  y: otu_ids.slice(0,10).map(otu_id => "OTU " + otu_id).reverse(),
  text: otu_labels.slice(0,10).reverse(),
  type: "bar",
  orientation: "h"
};

// data
var trace1 = [trace1];

// Apply the group bar mode to the layout
var layout = {
  title: "Belly Button Diversity",
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("bar", trace1, layout);


var trace2 = {
  x: otu_ids,
  y: sample_values,
  mode: 'markers',
  text: otu_labels,
  marker: {
      color: otu_ids,
      size: sample_values,
      colorscale: "Earth"
  }
};

var trace2 =[trace2];
var layout = {
  title: "Otu ID",
  shadowlegend: false,
  height: 600,
  width: 1500
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("bubble", trace2, layout);



})

}

function init() {
  var dropdown=d3.select("#selDataset")
  d3.json("samples.json").then((importedData) => {
  var samples = importedData.names;
  samples.forEach(sample => {
    dropdown.append("option").text(sample).property("value", sample)
  })
  buildPlot(samples[0]);
  buildMetaData(samples[0]);
  })
 
}
function optionChanged( new_value){ 
  buildPlot(new_value)
  buildMetaData(new_value)
}
init();

