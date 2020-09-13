


let svg = d3.select("body").append("svg")
    .attr("width", 900)
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

let treeStructure = d3.tree().size([650, 300]);
let information = treeStructure(dataStructura);

// conexiones
let connections = svg.append("g").selectAll("path")
    .data(information.links())
    .enter()
    .append("path")
    .attr("d", function (d) {
        return "M" + d.source.x + "," + d.source.y + " v 50 H" +//la v 50 indica un punto relativo
            d.target.x + " V" + d.target.y;
    })

// 
let rectangles = svg.append("g").selectAll("rect")
    .data(information.descendants());
// cuadrados
rectangles.enter().append("rect")
    .attr("x", function (d) { return d.x - 40; })
    .attr("y", function (d) { return d.y - 20; })



let names = svg.append("g").selectAll("text")
    .data(information.descendants());

names.enter().append("text").text(function (d) { return d.data.child; })
    .attr("x", function (d) { return d.x })
    .attr("y", function (d) { return d.y })






