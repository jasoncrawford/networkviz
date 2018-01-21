function networkViz() {
  let svg = d3.select("svg");
  let width = +svg.attr("width");
  let height = +svg.attr("height");

  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("cocomac_fv91_connectivity.json", (error, data) => {
    if (error) return console.error('error loading data', error);

    console.log('read data', data);

    let vertices = d3.keys(data);
    console.log('vertices', vertices);

    let nodes = vertices.map(v => ({id: v}));
    let links = [];
    vertices.forEach(v => {
      edgeMap = data[v];
      d3.keys(edgeMap).forEach(other => {
        if (v === other) return;  // skip self-edges
        if (edgeMap[other] === 1) links.push({source: v, target: other});
      })
    })

    console.log('nodes', nodes);
    console.log('links', links);

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", 1);

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", 5)

    node.append("title")
      .text(d => d.id);

    simulation
      .nodes(nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(links);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  })
}
