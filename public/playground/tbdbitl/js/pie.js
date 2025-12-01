/* Data */

var csv = [];
var rowNum = 0; 
var dataset = []; // Data organized by instrument and count
var dataset2 = []; // Data organized by instrumentId and rowNum
var totalInstruments = 0;

/* Adapted from animated donut chart with labels, legends and tooltips: http://bl.ocks.org/juan-cb/1984c7f2b446fffeedde */

var width = $("#instruments-pie").width(),
    height = $("#instruments-pie").height(),
	radius = Math.min(width, height) / 2;

var svg = d3.select("#instruments-pie").append("svg").append("g");
svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labelName");
svg.append("g").attr("class", "labelValue");
svg.append("g").attr("class", "lines");

var width2 = 460,
	height2 = 450;

var svg2 = d3.select("#instruments-chart").append("svg")
	.attr("width", width2)
	.attr("height", height2);

var pie = d3.pie().sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

var div = d3.select("#instruments-pie").append("div");
div.style("display", "none");
svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
svg.append("text").attr("id", "row-text").attr("text-anchor", "middle");

var colorRange = d3.schemeCategory20;
var color = d3.scaleOrdinal(colorRange);

d3.csv("./data/instruments.csv", function( data ) {
	csv = data;
	getNextRow(dataset, dataset2, data);
});

var tip = d3.tip().attr('class', 'd3-tip').html(function(d, i) { return "<span class=\"instrument instrument-"+i+"\"></span>"+d.data.value + " " + (d.data.label)+" ("+Math.floor((d.data.value/totalInstruments)*100)+"%)"; });

var tip2 = d3.tip().attr('class', 'd3-tip').html(function(d) { 
	var alt = (d.colId > 11) ? "<br>(Alternate)" : "<br>";
	return "<span class=\"instrument instrument-"+d.instrument+"\"></span>" + d.row + " row: " + dataset[d.instrument]["label"] + alt;
}).offset([-10,0]);

svg.call(tip);
svg2.call(tip2);

function change(data, data2) {
	tip.hide();
	/* ------- Circle graph ------ */
	var circles = svg2.selectAll("circle")
		.data(data2);
	circles.enter()
		.append("circle")
		.style("stroke", function(d, i){ return d3.schemeCategory20[d.instrument] })
		.style("fill", function(d, i){ return d3.schemeCategory20[d.instrument] })
		.attr("r", 8)
		.attr("cx", function(d, i) { 
			var extra = (d.colId > 11) ? 10 : 0;
			return 25 + (d.colId * 24) + extra; 
		})
		.attr("cy", function(d, i) { return 20 + (d.rowId * 26); })
		.on('mouseover', tip2.show)
		.on('mouseout', tip2.hide);
	circles.exit().remove();
	
	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });
    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice")
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
    slice.transition().duration(1000).attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
            return arc(interpolate(t));
		};
	})
    slice.exit().remove();

    /* ------- TEXT LABELS -------*/
    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });
    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value+"");
        });
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }
    text.transition().duration(1000).attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.label+": "+d.value+"");
        });
    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });
    polyline.enter()
        .append("polyline");
    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });
	polyline.exit().remove();
}

/* Triggers */
$(".fa-arrow-right.instrument-arrow").on("click", function (e) {
	getNextRow(dataset, dataset2, csv);
});
$(".fa-arrow-left.instrument-arrow").on("click", function (e) {
	removeLastRow(dataset, dataset2, csv);
});

/*
$("body").keydown(function(e) {
	if (e.keyCode == 39) { // Right
		getNextRow(dataset, dataset2, csv);
	} else if (e.keyCode == 37) { // Left
		removeLastRow(dataset, dataset2, csv);
	}
});
*/
/* Data manipulation functions */

function getNextRow(dataset, dataset2, csv) { // Get next band row of instruments and add to dataset
	var row = "";
	if (rowNum < csv.length) {
		row = csv[rowNum]["row"];
		while (rowNum < csv.length) {
			if (csv[rowNum]["row"] != row) { // New row, end here.
				break;
			}
			addToDataset(dataset, dataset2, csv[rowNum]["label"], csv[rowNum]["value"], csv[rowNum]["row"]);
			rowNum++;
		}
	}
	change(dataset, dataset2);
	change(dataset, dataset2);
	if (row != "") {
		var t = (row == "A") ? ("Row: A") : ("Rows: A-"+row);
		$('#row-text').fadeOut("fast", function(){
			$("#row-text").html('');
			d3.select("#row-text").append('tspan').attr('x',0).attr('dy',0).text(t);
			d3.select("#row-text").append('tspan').attr('x',0).attr('dy',20).text(totalInstruments+" musicians");
			$("#row-text").fadeIn("fast");
		});
	}
	return row;
}

function removeLastRow() {
	if (rowNum >= 1 && rowNum <= csv.length) {
		rowNum--;
		var row = csv[rowNum]["row"];
		while (rowNum >= 0) {
			if (csv[rowNum]["row"] != row) { // New row, end here.
				row = csv[rowNum]["row"];
				break;
			}
			addToDataset(dataset, dataset2, csv[rowNum]["label"], csv[rowNum]["value"] * -1, csv[rowNum]["row"]);
			rowNum--;
		}
		rowNum++;
		change(dataset, dataset2);
		change(dataset, dataset2);
		if (row != "A" && row != "") {
			var t = (row == "A") ? ("Row: A") : ("Rows: A-"+row);
			$('#row-text').fadeOut("fast", function(){
				$("#row-text").html('');
				d3.select("#row-text").append('tspan').attr('x',0).attr('dy',5).text(t);
				d3.select("#row-text").append('tspan').attr('x',0).attr('dy',20).text(totalInstruments+" musicians");
				$("#row-text").fadeIn("fast");
			});
		} else {
			$('#row-text').html('');		
		}
		return row;
	} else {
		$('#row-text').html('');
	}
}

function addToDataset(dataset, dataset2, label, value, row) { // Add/remove instrument to dataset or increment proper category
	var instrumentId = 0; 
	var done = 0;
	for (var i = 0; i < dataset.length; i++) { // Add to dataset1
		if (dataset[i]["label"] == label) {
			var newVal = parseInt(dataset[i]["value"]) + parseInt(value);
			totalInstruments += parseInt(value);
			if (newVal > 0) {
				dataset[i]["value"] = newVal;
			} else {
				dataset.splice(i, 1);
			}
			done = 1;
			break;
		}
		instrumentId++;
	}
	if (!done) {
		dataset.push({"label": label, "value": value});
		totalInstruments += parseInt(value);
	}
	
	if (parseInt(value) > 0) { // Positive, push instrument and rows
		var rowId = 0; // Get row number (A=1, B=2, etc.)
		if (dataset2.length > 0) {
			 if (row == dataset2[dataset2.length-1]["row"]) { // same row
				rowId = dataset2[dataset2.length-1]["rowId"];
			 } else { // new row
				 rowId = dataset2[dataset2.length-1]["rowId"] + 1;
			 }
		}
		var colId = (dataset2.length > 0 && row == dataset2[dataset2.length-1]["row"]) ? 
					(dataset2[dataset2.length-1]["colId"] + 1) : 0;
		for (var j = 0; j < value; j++) {
			dataset2.push({"instrument": instrumentId, "row": row, "rowId": rowId, "colId": colId});
			colId++;
		}
	} else { // Negative, have to pop out last instruments
		for (var j = 0; j > parseInt(value); j--) {
			dataset2.pop();
		}
	}
	return 1;
}