let margin = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 40
}

let width = 400
let height = 200


//loading data y ordenamiento
let rowData = d3.csv("alphabet.csv", ({
    letter,
    frequency
}) => ({
    name: letter,
    value: +frequency
}))
rowData.then(data => {
    // Definiciones de Escalas y Ejes
    x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top])

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())

    //renderizado de grafico

    const svg = d3.select("body").append("svg")
        .attr("viewBox", [0, 0, width, height]);

    const bar = svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .style("mix-blend-mode", "multiply")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    const gx = svg.append("g")
        .call(xAxis);

    const gy = svg.append("g")
        .call(yAxis);

    //function de actualizacion

    function update(order) {

        x.domain(order.map(d => d.name));

        const t = svg.transition()
            .duration(750);

        bar.data(data, d => d.name)
            .order()
            .transition(t)
            .delay((d, i) => i * 20)
            .attr("x", d => x(d.name));

        gx.transition(t)
            .call(xAxis)
            .selectAll(".tick")
            .delay((d, i) => i * 20);
    }

    // comportameinto del html
    let form = document.getElementById("formOrder")
    form.addEventListener("change", function (event) {
        event.preventDefault()
        let orderSelectedOption = event.target.options[event.target.selectedIndex].value
        let order
        if (orderSelectedOption === "al") {
            order = data.sort((a, b) => a.name.localeCompare(b.name))
            update(order)
        } else if (orderSelectedOption === "fa") {
            order = data.sort((a, b) => a.value - b.value)
            update(order)
        } else if (orderSelectedOption === "fd") {
            order = data.sort((a, b) => b.value - a.value)
            update(order)
        }

    })

})