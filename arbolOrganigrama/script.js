var margin = {
        top: 10,
        right: 90,
        bottom: 30,
        left: 90
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// treeData = ({
//     "name": "Top Level",
//     "children": [{
//             "name": "Level 2: A",
//             "children": [{
//                     "name": "Son of A"
//                 },
//                 {
//                     "name": "Daughter of A"
//                 }
//             ]
//         },
//         {
//             "name": "Level 2: B"
//         }
//     ]
// })


let dataNew = [{ "child": "John", "parent": "" },
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
    (dataNew);


// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg");
svg
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" +
        margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

let treeData = treemap(dataStructura)

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function (d) {
    return d.children;
});
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 180
    });

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
        .data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function (d) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function (d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function (d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function (d) {
           return d.data.data.child
        });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node)
        .attr("fill", "#fff")
        .attr("stroke", "steelblue")
        .attr("stroke-width", "3px;")
        .style('font', '12px sans-serif')


    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function (d) {
            return d.id;
        });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function (d) {
            var o = {
                x: source.x0,
                y: source.y0
            }
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", "2px")

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function (d) {
            return diagonal(d, d.parent)
        });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function (d) {
            var o = {
                x: source.x,
                y: source.y
            }
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        const path = `M ${d.x},${d.y} v 50 H ${s.x} V ${s.y}`

        return path
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}