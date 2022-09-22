function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedIdSamples = samplesArray.filter(data => data.id == sample);
    console.log(selectedIdSamples);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedIdSamples[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_Ids = firstSample.otu_ids;
    var otu_Labels = firstSample.otu_lables;
    var sample_Values = firstSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_Ids.slice(0,10).map(id => "OTU" + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_Values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: 'h',
      width: 0.6
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Culters Found",
      yaxis: {
        tickmode: "array",
        tickvals:[0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        showarrow: false
      }]
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});
// 1. Create the trace for the bubble chart.
  var bubbleData = [{
    x: otu_Ids,
    y: sample_Values,
    text: otu_Labels,
    mode: 'markers',
    markers: {
      size: sample_Values,
      color: otu_Ids,
    }
  }];
  console.log(bubbleData);
// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title: 'Bacteria Cultures Per Sample',
  showlegend: false,
  xaxis: {title: "OTU ID", automargin: true},
  yaxis: {automargin: true},
  hovermode: "closest"
};
// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true}); 
// 1. Create a variable that filters the metadata array for the object with the desired sample number.
var metadata_Id = data.metadata.filter(data => data.id == sample);
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    
    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   var washingFreq = +metadata_Id[0].wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: washingFreq,
        title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,10]},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }]
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 450, margin: {t: 0, b: 0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
