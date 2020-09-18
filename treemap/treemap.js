d3.json("flare-2.json", function (error, data) {

    if (error) throw error

    width = 954
    height = 954
    format = d3.format(",d")
    color = d3.scaleOrdinal(d3.schemeCategory10)

    const treemap = data => d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))

    const root = treemap(data);



    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");

    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

    leaf.append("rect")
        .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
        .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
        .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);


})