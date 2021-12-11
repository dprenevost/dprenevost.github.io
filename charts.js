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
      PANEL.append("h6").text([key + ": " + value]);
    });

  });
}

//Del 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels.slice(0, 10).reverse();
    var sampleValues = result.sample_values.slice(0, 10).reverse();
    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(sampleObj => "OTU " + sampleObj + " ").slice(0, 10).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      plot_bgcolor: "#e4e6e7",
      paper_bgcolor: "#9fa39e",
      font: {
        family: "Goudy Old Style Bold"
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //Del 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: bubbleValues,
      text: bubbleLabels,
      mode: 'markers',
      marker: {
        size: bubbleValues,
        color: bubbleValues,
        colorscale: 'Electric',
        type: 'heatmap'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      plot_bgcolor: "#e4e6e7",
      paper_bgcolor: "#9fa39e",
      xaxis: { title: "OTU ID" },
      font: {
        family: "Goudy Old Style Bold"
      }
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //Del 3
    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var gaugeResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var gaugeResult = gaugeResultArray[0];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeValue = parseFloat(gaugeResult.wfreq);
    console.log(gaugeValue);
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: gaugeValue,
        title: { text: "<b>Belly Button Washing Frequency</b> <br>Cleanings Per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], dtick: 1 },
          steps: [
            { range: [0, 1], color: "#a8adb2" },
            { range: [1, 2], color: "#979ba0" },
            { range: [2, 3], color: "#868a8e" },
            { range: [3, 4], color: "#75797c" },
            { range: [4, 5], color: "#64676a" },
            { range: [5, 6], color: "#545659" },
            { range: [6, 7], color: "#434547" },
            { range: [7, 8], color: "#323335" },
            { range: [8, 9], color: "#212223" },
            { range: [9, 10], color: "#101111" },
          ],
        }
      }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      plot_bgcolor: "#e4e6e7",
      paper_bgcolor: "#e4e6e7",
      font: {
        family: "Goudy Old Style Bold"
      },
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}