import React from "react";
import PropTypes from 'prop-types';

import '../../styles/charts/screen_time_chart';

export class ScreenTimeChart extends React.PureComponent {
  constructor(props){
      super(props)
      this.createChart = this.createChart.bind(this)
   }
   componentDidMount() {
      this.createChart()
   }
   componentDidUpdate() {
      this.createChart()
   }

  createChart() {
    if (!this.props.movie) {
      return null;
    }

    const node = this.node;
    const jsonMod = this.props.movie.char_metadata;
    const arr_entries = Object.entries(jsonMod);
    let entries = [];

    for (let actors in arr_entries) {
        entries.push([arr_entries[actors][0], arr_entries[actors][1]["screen_time"]]);
    };

    const categories = ["Screen Time"];
    const categoryColors = ["darkorange"];

    // length is 2
    const len = Object.keys(jsonMod).length;

    const svgWidth = 500;
    const svgHeight = 500;

    const svg = d3.select(node)
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "bar");

    const maxOffset = 0.9 * 400; // 360
    const yScale = d3.scaleLinear().domain([0, 1]).range([0, maxOffset]);
    let pushX = 120;
    const pushY = 180;
    const interBarSpace = 30;
    const barWidth = 20;
    let ctr = 0;
    const flag = 0;

    // plot bars
    const yMax = d3.max(entries, (d, i) => { return d[1]; });

    // data join
    let bars = svg.selectAll("#rect")
      .data(entries)
      .enter();

    const div = d3.select(".screen-time-chart").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // tool tip
    bars.append("rect")
      .attr("width", barWidth)
      .attr("height", (d, i) => {return yScale(entries[i][1]); })
      .attr("x", (d, i) => { return pushX + interBarSpace * i; })
      .attr("y", (d, i) => { return pushY + yScale(yMax) - yScale(entries[i][1]); })
      .attr("fill", categoryColors[ctr])
      .on("mouseover", function(d) {
          var rect = d3.select(this)._groups[0][0]
          var rectX = Number(rect.attributes["x"].nodeValue);
          var rectY = Number(rect.attributes["y"].nodeValue);
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(Math.round(Number(d[1] * 100) * 100) / 100 + "%")
            .style("left", rectX + "px")
            .style("top", rectY - 10 + "px");
      })
      .on("mouseout", d => {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    pushX += barWidth;
    ctr++;

    // x-axis titles
    pushX = 120;

    bars
      .append("text")
      .text( (d, i) => { return entries[i][0]; } )
      .attr("x", (d, i) => { return pushX + interBarSpace * i + 15; })
      .attr("y", (d, i) => { return pushY + yScale(yMax) - yScale(entries[i][1]) - 5; })
      .attr("transform", (d, i) => {
          var x = pushX + interBarSpace * i + 15;
          var y = pushY + yScale(yMax) - yScale(entries[i][1]) - 5;
          return "rotate(-90," + x + "," + y + ")";
      })
      .attr("fill", "black")
      .style("font-size", 14);

    // legend
    const pushTextX = 120;
    const pushTextY = 180;
    const legendBarSize = 10;

    categories.forEach((d, ind) => {
      bars
        .append("text")
        .text( d => { return categories[ind]; } )
        .attr("x", d => { return pushTextX + interBarSpace * (entries.length + 1); })
        .attr("y", d => { return pushTextY + 20 * ind; })
        .attr("fill", "black")
        .style("font-size", 14);

      bars
        .append("rect")
        .attr("width", legendBarSize)
        .attr("height", legendBarSize)
        .attr("x", d => { return pushTextX + interBarSpace * (entries.length + 1) - 15; })
        .attr("y", d => { return pushTextY + 20 * ind - 10; })
        .attr("fill", d => {return categoryColors[ind]; })
        .style("font-size", 14);
    });
  }

  render() {
    return (
      <div className="screen-time-chart">
        <svg ref={node => this.node = node} />
      </div>
    );
  }
}

ScreenTimeChart.propTypes = {
  movie: PropTypes.object,
};
