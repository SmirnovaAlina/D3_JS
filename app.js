var svgWidth = 850;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 // Initial Params
var chosenXAxis = "poverty";


// function used for updating x-scale var upon click on axis label

function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(hairData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip

function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    var label = "Age:";
  }
  else {
    var label = "Income:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
  }
  


d3.csv("data.csv").then(function(data) {
  data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.age = +data.age
  });


  var xLinearScale = xScale(data, chosenXAxis);

// Step 2: Create scale functions
// var xLinearScale = d3.scaleLinear()
//   .domain([8, d3.max(data, d => d.poverty)])
//   .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

// Step 3: Create axis functions
    // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// chartGroup.append("g")
//   .attr("transform", `translate(0, ${height})`)
//   .call(bottomAxis);


  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

// Step 5: Create Circles
    // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");

  circleLabels
    .attr("x", function(d) {
      return xLinearScale(d[chosenXAxis]);
    })
    .attr("y", function(d) {
      return yLinearScale(d.healthcare);
    })
    .text(function(d) {
      return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

  var povityLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var Agelabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");
  
  var incomelabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") 
    .classed("inactive", true)
    .text("Household incime (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Helthcare(%)");

  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  // labelsGroup.selectAll("text")
  //   .on("click", function() {
  //     // get value of selection
  //     var value = d3.select(this).attr("value");
  //     if (value !== chosenXAxis) {

  //       // replaces chosenXAxis with value
  //       chosenXAxis = value;

  //       console.log(chosenXAxis)

  //       // functions here found above csv import
  //       // updates x scale for new data
  //       xLinearScale = xScale(data, chosenXAxis);

  //       // updates x axis with transition
  //       xAxis = renderAxes(xLinearScale, xAxis);

  //       // updates circles with new x values
  //       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

  //       // updates tooltips with new info
  //       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  //       // changes classes to change bold text
  //       if (chosenXAxis === "povety") {
  //         povityLabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //         Agelabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         incomelabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //       }
  //       else if (chosenXAxis === "age"){
  //         povityLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         Agelabel
  //           .classed("active", true)
  //           .classed("inactive", false);
  //         incomelabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //       }
  //       else {
  //         povityLabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         Agelabel
  //           .classed("active", false)
  //           .classed("inactive", true);
  //         incomelabel
  //           .classed("active", true)
  //           .classed("inactive", false);

  //       }

        
  //     }
  //   });


});

