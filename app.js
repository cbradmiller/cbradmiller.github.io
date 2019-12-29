var samples;

d3.json("samples.json").then((data) => {
    samples = data;

    var dropDown = d3.select('#selDataset')
        .classed("custom-select", true);

    var options = dropDown
        .selectAll('option')
        .data(data.names)
        .enter()
        .append('option')
        .text(function (d) { return d; });

});


function optionChanged(sampleID) {
    
    var filter1 = samples.metadata.filter(function (d) {
        if ((parseInt(d.id) === parseInt(sampleID))) {
            return d;
        }
    });

    filter1.forEach((d) => {
        console.log(d);
       
        var demographicInfo = d3.select('#sample-metadata');
        demographicInfo.selectAll("table").remove();
      
        var tableData = demographicInfo
            .append('table')
       
        var tableSamples = tableData
            .append('tbody');
        
        Object.entries(d).forEach(([key, value]) => {
            var row = tableSamples.append("tr");
            var cell = row.append("td").text(key);
            var cell = row.append("td").text(value);
        });
    });

  
    filter2 = samples.samples.filter(function (x) {
        if ((parseInt(x.id) === parseInt(sampleID))) {
            return x;
        }
    });

    filter2.forEach((x) => {

        
        var bbsv = x.sample_values.slice(0);
        var bboid = x.otu_ids.slice(0);
        var bbol = x.otu_labels.slice(0);

      
        var list = [];
        for (var j = 0; j < bboid.length; j++)
            list.push({ 'bbsv': bbsv[j], 'bboid': bboid[j], 'bbol': bbol[j] });
        
  
        list.sort(function(a, b) {
            return ((a.bbsv > b.bbsv) ? -1 : ((a.bbsv == bbsv.name) ? 0 : 1));
        });

     
        for (var k = 0; k < list.length; k++) {
            bbsv[k] = list[k].bbsv;
            bboid[k] = `id:${list[k].bboid.toString()}`;
            bbol[k] = list[k].bbol;
        }

    
        var bbol = bbol.slice(0, 10);

        for (var i = 0; i < bbol.length; i++) {
            bbol[i] = bbol[i].replace(/;/g, '<br>');
        }
        var trace1 = {
            type: 'bar',
            marker:{
                color: 'royalblue'
            },
            x: bbsv.slice(0, 10).reverse(),
            y: bboid.slice(0, 10).reverse(),
            hovertext: bbol,
            orientation: 'h' 
        };

        var data = [trace1];

        var layout1 = {
            title: "<b>Most Prominent OTUs</b>",
        }
        
        Plotly.newPlot('bar', data, layout1);

    
        var bubble_color=x.otu_ids;
        bubble_color = bubble_color.map(function(val){return val;});

        var trace2 = {
            x: x.otu_ids,
            y: x.sample_values,
            mode: 'markers',
            text: x.otu_labels,
            marker: {
                size: x.sample_values,
                color: bubble_color,
                colorscale: "Rainbow"
            }
        };

        var data = [trace2];

        var layout2 = {
            title: "<b>Belly Button Biodiversity</b>",
            xaxis: {
                title: {
                  text: 'OTU ID'}}
        };

        Plotly.newPlot('bubble', data, layout2);

      
        });

}

