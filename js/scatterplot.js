window.addEventListener('DOMContentLoaded', function() {

  var w = 600;
  var h = 400;
  var dataSet = []
  var pointList = d3.select("#point-list");
  var x = d3.select('#x')
  var y = d3.select('#y')
  var r = d3.select('#r')
  var color = d3.select('#color')

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

  d3.selectAll('input[type="button"]').on('click', function() {
    var newData;
    if (this.value === 'Plot') {
      newData = { 
        x: +this.x.value, 
        y: +this.y.value,
        r: +this.r.value,
        color: this.color.value
      };
    } else {
      newData = {
        x: getRandom(-100, 100, 0.1),
        y: getRandom(-100, 100, 0.1),
        r: getRandom(0, 25, 0.1),
        color: getRandomHex()
      };
    }
    dataSet.push(newData);
    draw(dataSet, svg);
    updateList(pointList, newData);
  });

  function draw(data, el) {
    // create scales
    var xmin = d3.min(data, d => d.x);
    var xmax = d3.max(data, d => d.x);
    var ymin = d3.min(data, d => d.y);
    var ymax = d3.max(data, d => d.y);
    var xScale = d3.scaleLinear()
                   .domain([xmin, xmax])
                   .range([0, w])
    var yScale = d3.scaleLinear()
                   .domain([ymin, ymax])
                   .range([h,0]) 
    var circles = el.selectAll('circle')
                    .data(data);

    // update existing circles
    circles
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => d.r)
      .attr('fill', d => d.color)

    // draw new circle
    circles
      .enter()
      .append('circle')
      .transition()
      .duration(750)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => d.r)
      .attr('fill', d => d.color)

    // TODO: remove old circles
    
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
    var removeButton = "<span class='glyphicon glyphicon-remove pull-right'></span>"
    list
      .append('li')
      .classed('list-group-item', true)
      .html(`x: ${data.x}, y: ${data.y}, r: ${data.r}, color: ${data.color} ${removeButton}`)
  }

});