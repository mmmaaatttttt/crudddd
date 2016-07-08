window.addEventListener('DOMContentLoaded', function() {

  var w = 600;
  var h = 400;
  var margin = 25;
  var dataSet = [];
  var pointList = d3.select("#point-list");
  var x = d3.select('#x').node();
  var y = d3.select('#y').node();
  var r = d3.select('#r').node();
  var color = d3.select('#color').node();

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

  initializeGraph(svg, margin);

  d3.selectAll('input[type="button"]').on('click', function() {
    var newData;
    if (this.value === 'Plot') {
      newData = { 
        x: +x.value, 
        y: +y.value,
        r: +r.value,
        color: color.value
      };
    } else {
      newData = {
        x: getRandom(-100, 100, 0.1),
        y: getRandom(-100, 100, 0.1),
        r: getRandom(1, 25, 0.1),
        color: getRandomHex()
      };
    }
    dataSet.push(newData);
    draw(dataSet, svg, margin);
    updateList(pointList, newData);
  });

  function draw(data, el, margin) {
    // create scales
    var xmin = data.length === 1 ? data[0].x - 1 : d3.min(data, d => d.x);
    var xmax = data.length === 1 ? data[0].x + 1 : d3.max(data, d => d.x);
    var ymin = data.length === 1 ? data[0].y - 1 : d3.min(data, d => d.y);
    var ymax = data.length === 1 ? data[0].y + 1 : d3.max(data, d => d.y);
    var xScale = d3.scaleLinear()
                   .domain([xmin, xmax])
                   .range([margin, el.attr('width') - margin])
    var yScale = d3.scaleLinear()
                   .domain([ymin, ymax])
                   .range([el.attr('height') - margin,margin]) 
    var xAxis = d3.axisTop(xScale);
    var yAxis = d3.axisRight(yScale);

    // update axes
    el.select('.xaxis')
      .transition(750)
      .call(xAxis)

    el.select('.yaxis')
      .transition(750)
      .call(yAxis)

    var circles = el.selectAll('circle')
                    .data(data);
    // update existing circles
    circles
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => d.r)
      .attr('fill', d => d.color);

    // draw new circle (if necessary)
    circles
      .enter()
      .append('circle')
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => d.r)
      .attr('fill', d => d.color);
    
  }

  pointList.on('click', function() {
    if (d3.select(d3.event.target).classed('glyphicon-remove')) {
      console.log("DELETE!");
    }
  });

  function initializeGraph(el, margin) {
    var xScale = d3.scaleLinear()
                   .domain([-1, 1])
                   .range([margin, el.attr('width')-margin])
    var yScale = d3.scaleLinear()
                   .domain([-1, 1])
                   .range([el.attr('height')-margin,margin]) 
    var xAxis = d3.axisTop(xScale);
    var yAxis = d3.axisRight(yScale);

    el.append('g').attr('transform', `translate(0,${el.attr('height')-1})`)
                  .attr('class', 'xaxis')
                  .call(xAxis);
    el.append('g').attr('class', 'yaxis')
                  .call(yAxis);
  }

  function getRandom(min, max, step) {
    num = (max - min) * Math.random() + min;
    return Math.round(num / step) / (1 / step);
  }

  function getRandomHex() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function updateList(list, data) {
    list
      .append('li')
      .classed('list-group-item', true)
      .html(`x: ${data.x}, y: ${data.y}, r: ${data.r}, color: ${data.color}`)
  }

});