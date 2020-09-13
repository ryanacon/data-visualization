let margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let treemap = d3.tree()
  .size([height, width])

d3.csv("data.csv")

  .then(flatData => {
    flatData.forEach(d => {
      if (d.parent == "null") { d.parent = null };
    });
    let treeData = d3.stratify()
      .id(function (d) { return d.name; })
      .parentId(function (d) { return d.parent; })
      (flatData)

    treeData.each(function (d) {
      d.name = d.id
    })

    let nodes = d3.hierarchy(treeData, function (d) {
      return d.children;
    })

    nodes = treemap(nodes)

    let svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom),
      g = svg.append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    let link = g.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      });
    let node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", function (d) {
        return "node" +
          (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d) {
        console.log(d)
        return "translate(" + d.y + "," + d.x + ")";
      });

    node.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 6)
      .attr("fill","black")


    node.append("text")
      .attr("dy", "-1rem")
      .attr("x", function (d) { return d.children ? -13 : 13; })
      .style("text-anchor", function (d) {
        return d.children ? "end" : "start";
      })
      .text(function (d) { return d.data.name; });
  })

width