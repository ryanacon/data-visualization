


let svg = d3.select("body").append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .append("g").attr("transform", "translate(50,50)");

let data = [{ "child": "John", "parent": "" },
{ "child": "Fernando", "parent": "Kevin" },
{ "child": "Kevin", "parent": "John" },
{ "child": "Raul", "parent": "John" },
{ "child": "Alberto", "parent": "Federico" },
{ "child": "Federico", "parent": "John" },
{ "child": "Leonardo", "parent": "Kevin" },
{ "child": "Pedro", "parent": "John" },
];

let dataStructura = d3.stratify()
    .id(function (d) { return d.child; })
    .parentId(function (d) { return d.parent; })
    (data);

let treeStructure = d3.tree().size([500, 300]);
let information = treeStructure(dataStructura);

let circles = svg.append("g").selectAll("circle")
    .data(information.descendants());


// circulos que usan la información de descendientes
circles.enter().append("circle")
    .attr("cx", function (d) { return d.x })
    .attr("cy", function (d) { return d.y })
    .attr("r", 5)

// conexiones
let connections = svg.append("g").selectAll("path")
    .data(information.links())
    .enter()
    .append("path")
    .attr("d", function (d) {
        return "M" + d.source.x + "," + d.source.y + "C " +
            d.source.x + "," + (d.source.y + d.target.y) / 2 + " " +
            d.target.x + ", " + (d.source.y + d.target.y) / 2 + " " +
            d.target.x + "," + d.target.y;
    })

let names = svg.append("g").selectAll("text")
    .data(information.descendants());

names.enter().append("text").text(function (d) { return d.data.child; })
    .attr("x", function (d) { return d.x + 7 })
    .attr("y", function (d) { return d.y + 4 })




