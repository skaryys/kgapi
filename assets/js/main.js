const axios = require("axios");
const vis = require("vis");

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    let firstItem = document.querySelector("#start").value;

    if (!window.nodes) {
        window.nodes = [];
    }
    if (!window.edges) {
        window.edges = [];
    }
    window.options = {
        interaction:{hover:true},
        manipulation:{enabled:true}
    };

    let querys = [];
    querys.push(firstItem);

    const makeNode = function(query) {
        axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
            params: {
                'query': query,
                'limit': 1,
                'indent': true,
                "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc"
            }
        }).then(function (response) {
            let item = response.data.itemListElement[0].result;
            let graphitem = {
                id: item["@id"],
                label: item.name,
                title:  JSON.stringify(item, null, 4)
            };
            let notpush = false;
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === graphitem.id) {
                    notpush = true;
                }
            }
            if (notpush === false) {
                nodes.push(graphitem);
            }

            axios.get("http://localhost:4000/nodes?q="+query, {
            }).then(function (response) {
                Array.prototype.forEach.call(response.data.nodes, function(el, i) {
                    let notpush = false;
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].id === el.id) {
                            notpush = true;
                        }
                    }
                    if (notpush === false) {
                        nodes.push(el);
                    }
                    let edgeitem = {
                        from: graphitem["id"],
                        to: el["id"],
                        label: response.data.relations[i]
                    };
                    edges.push(edgeitem);
                });

                setTimeout(function(){
                    window.nodesVis = new vis.DataSet(nodes);
                    window.edgesVis = new vis.DataSet(edges);

                    let data = {
                        nodes: nodesVis,
                        edges: edgesVis
                    };

                    console.log(data);

                    let container = document.querySelector('.network');
                    let network = new vis.Network(container, data, options);
                }, 3000);
                });
        }).catch(function (error) {
            console.log(error);
        });

        /*querys.shift();*/
        /*if (querys.length > 0) {
            makeNode(querys[0]);
        }*/
    };

    makeNode(querys[0]);

});

