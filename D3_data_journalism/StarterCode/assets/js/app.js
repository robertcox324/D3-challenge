// @TODO: YOUR CODE HERE!


//create a scatter plot of two data variables represented with circle elements (smokers vs age, etc. some crap like that)
//pull data from data.csv using d3.csv function
//make it look like the scatter plot image 4 (with state abbreviations in the circles). Plot points representing each state on the two attributes selected
//put axes and lables to the left and bottom
//open html using vscode

//the div to append to is <div id="scatter">, so var svg = d3.select("#scatter")

// var svgWidth = 960;
// var svgHeight = 500;
//one of the requirements is that the x and y scales are spread out enough for the data not to overlap
//but doing that makes the svg so huge you have to zoom out a lot... if that's really needed, here's the svg width and height to use
//AND EVEN USING THESE VA AND NM STILL OVERLAP A TINY BIT BECAUSE THEIR NUMBERS ARE NEAR IDENTICAL
var svgWidth = 1920;
var svgHeight = 1000;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g") //append g element to group svg shapes together
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data
d3.csv("assets/data/data.csv").then(function(stateData) {
    //data to choose from: poverty, age, income, healthcare (high/low), obesity (high/low), smokes (high/low)
    //let's do obesity and smoking

    //cast the data as numbers rather than strings
    stateData.forEach(function(data){
        data.obesity = +data.obesity
        data.smokes = +data.smokes
    })

    //scale functions
    var xLinearScale = d3.scaleLinear() //obesity will be along x
        // .domain([20, d3.max(stateData, d => d.obesity)])
        .domain([24, d3.max(stateData, d => d.obesity)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        // .domain([5, d3.max(stateData, d => d.smokes)]) //so smoking will be along y
        .domain([8, d3.max(stateData, d => d.smokes)])
        .range([height, 0]);

    //axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to the chart group created earlier...
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);

    //create the points on the scatter plot, for this excercise that will be circles with the states' abbreviations on them
    //IMPORTANT- figure out how to put the abbreviation on that shit

    var circlesAndText = chartGroup.selectAll("g")
        .data(stateData)
    
    var circlesAndTextEnter = circlesAndText.enter()
        .append("g")

    var circle = circlesAndTextEnter.append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15") //set radius
        .attr("fill", "cyan") //fill color
    
    circlesAndTextEnter.append("text")
        // .attr("dx", function(d){return -20})
        .attr("dx", d => xLinearScale(d.obesity))
        .attr("dy", d => yLinearScale(d.smokes) + 5) //didn't quite center right without a little nudge
        // .attr("x","50%") //this isn't following the circle at all... it's based on the svg object...
        // .attr("y","50%")
        .attr("text-anchor","middle")
        .attr("fill","white")
        .attr("font-family", "arial")
        // .attr("stroke-width","1px")
        // .attr("stroke","#000000")
        .text(function(d){return d.abbr})
    // var circlesGroup = chartGroup.selectAll("circle")
    // .data(stateData) //since we state our data here, we can use d.(something)
    // .enter()
    // .append("circle")
    // .attr("cx", d => xLinearScale(d.obesity))
    // .attr("cy", d => yLinearScale(d.smokes))
    // .attr("r", "15") //set radius
    // .attr("fill", "cyan") //fill color

    // .append("text") //puts text inside the circle...
    // .attr("text-anchor","middle")
    // .attr("stroke-width", "2px")
    // .attr("stroke", "#ffffff")
    // .text(function(d){return d.abbr})

    //.append("text")
    //.attr("text", d => d.abbr) not an attribute, it's the text itself... hm

    //this gets the text there, but not on center...
    // var textGroup = chartGroup.selectAll("text") //this places all the text after all the circles...
    // .data(stateData)
    // .enter()
    // .append("text")
    // .attr("dx", d => xLinearScale(d.obesity))
    // .attr("dy", d => yLinearScale(d.smokes))
    // .text(function(d){return d.abbr})

    //     .attr("text-anchor","middle")
    //     .attr("stroke-width", "2px")
    //     .attr("stroke", "#ffffff")
    //     .text(function(d){return d.abbr})
         // circlesGroup.append("text") //append text to our circlesgroup
    // chartGroup.append("text")
        // .attr("dx", function(d){return 30})
    //attribute for text?
    // .attr("opacity", ".5");

    //Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Obesity Rate: ${d.obesity}%<br>Smokers: ${d.smokes}%`);
      });

    //Create tooltip in the chart
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
    circlesAndTextEnter.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    //label the axes
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height /1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (percentage of population)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 3}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity rate (percentage of population)");
});