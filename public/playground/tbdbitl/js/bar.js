var csv = [];

d3.csv("./data/years.csv", function( data ) {
	var total = 242;
	csv = data;

// TODO: Clean this logic up
var chart = document.getElementById("years-chart"), // Horizontal bar chart from https://codepen.io/pyche/pen/`
	axisMargin = 20,
	margin = 20,
	valueMargin = 4,
	width = chart.offsetWidth,
	height = chart.offsetHeight,
	barHeight = (height-axisMargin-margin*2)* 0.5/csv.length,
	barPadding = (height-axisMargin-margin*2)*0.5/csv.length,
	bar, svg, scale, xAxis, labelWidth = 0;

max = d3.max(csv.map(function(i){ 
	return i["count"];
}));

svg = d3.select(chart)
	.append("svg")
	.attr("width", width)
	.attr("height", height);

bar = svg.selectAll("g")
	.data(csv)
	.enter()
	.append("g");

bar.attr("class", "bar")
	.attr("cx",0)
	.attr("transform", function(d, i) { 
	 return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
	});

var tip = d3.tip().attr('class', 'd3-tip').html(function(d, i) { 
	return d["count"] + " " + d["year"] + " years (" + Math.floor((d["count"]/total)*100) + "%)"; 
});
	
bar.append("text")
	.attr("class", "label")
	.attr("y", barHeight / 2)
	.attr("dy", ".35em") //vertical align middle
	.text(function(d){
	return d["year"];
	}).each(function() {
	labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
	});

scale = d3.scaleLinear()
	.domain([0, max])
	.range([0, width - margin*2 - labelWidth]);

xAxis = d3.axisBottom()
	.scale(scale);
	
bar.append("rect")
	.attr("transform", "translate("+(labelWidth+5)+", 0)")
	.attr("height", barHeight)
	.attr("width", function(d){
	return scale(d["count"]);
	})
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide);;

bar.append("text")
	.attr("class", "value")
	.attr("y", barHeight / 2)
	.attr("dx", -valueMargin + labelWidth) //margin right
	.attr("dy", ".35em") //vertical align middle
	.attr("text-anchor", "end")
	.text(function(d){
		return d["count"];
	})
 .attr("x", function(d){
	var width = this.getBBox().width;
	return Math.max(width + valueMargin, scale(d["count"]))});;

bar.call(tip);

});