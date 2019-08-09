const axios = require("axios");
const vis = require("vis");

document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    let firstItem = document.querySelector("#start").value;

    window.nodes = [];
    window.edges = [];
    window.options = {
        interaction:{hover:true}
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
            nodes.push(graphitem);

            axios.get("http://localhost:4000/nodes?q="+query, {
            }).then(function (response) {
                Array.prototype.forEach.call(response.data.nodes, function(el, i) {
                    nodes.push(el);
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
