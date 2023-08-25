const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON and process 
d3.json(url).then(function(data) {

  // Get references to elements needed
  const select = d3.select("#selDataset");
  const barChart = d3.select("#bar");
  const bubbleChart = d3.select("#bubble");
  const metadataDiv = d3.select("#sample-metadata");

  // fill dropdown 
  data.names.forEach(name => {
    select.append("option").text(name).attr("value", name);
  });

  // Update bar chart and bubble chart changes
  function updateCharts(selectedName) {
    const selectedSample = data.samples.find(sample => sample.id === selectedName);

    // Update Bar Chart
    const top10Data = selectedSample.otu_ids
      .slice(0, 10)
      .map((otuId, index) => ({
        otu_id: `OTU ${otuId}`,
        value: selectedSample.sample_values[index],
        label: selectedSample.otu_labels[index]
      }));
    
    const barTrace = {
      type: "bar",
      orientation: "h",
      x: top10Data.map(d => d.value),
      y: top10Data.map(d => d.otu_id),
      text: top10Data.map(d => d.label)
    };
    
    const barLayout = {
      title: `Top 10 OTUs for ${selectedName}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
    
    Plotly.newPlot("bar", [barTrace], barLayout);

    // Update Bubble Chart
    const bubbleTrace = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: "Viridis"
      }
    };

    const bubbleLayout = {
      title: `Bubble Chart for ${selectedName}`,
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  }

  // Initial chart display
  updateCharts(data.names[0]);
  
  // Update display based on dropdown choice
function updateMetadata(selectedName) {
  const selectedMetadata = data.metadata.find(meta => meta.id.toString() === selectedName);

  // Clear previous selection
  metadataDiv.html("");

  // Loop through the metadata 
  for (const [key, value] of Object.entries(selectedMetadata)) {
    metadataDiv.append("p").text(`${key}: ${value}`);
  }
}

// Initial metadata display
updateMetadata(data.names[0]);

// Listen for dropdown change and update all
select.on("change", function() {
  const selectedValue = d3.event.target.value;
  updateCharts(selectedValue);
  updateMetadata(selectedValue);
});

});

