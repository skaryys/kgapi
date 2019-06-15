const express = require("express");
const rp = require('request-promise');
const puppeteer = require("puppeteer");
const devices = require('puppeteer/DeviceDescriptors');
const axios = require("axios");
const app = express();
const device = devices["Pixel 2 XL"];

var port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Server running on port 3000");
});

app.get("/",(req, res, next) => {
    res.json({});
});

app.get("/nodes1", (req, res, next) => {
    let searchstring = req.param("q");
    let url = 'https://www.google.com/search?q='+searchstring;

    (async () => {
        try {
            let results = {"nodes":[]};
            let browser = await puppeteer.launch({ headless: true });
            let page = await browser.newPage();
            await page.goto(url);
            await page.waitFor(".knowledge-panel");
            let kpp = await page.evaluate(() => Array.from( document.querySelectorAll('.knowledge-panel .kno-fv a[data-ved]'), element => element.textContent));
            async function processArray(array) {
                for (const link of array) {
                    console.log(link);
                    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                        params: {
                            'query': link,
                            'limit': 1,
                            'indent': true,
                            "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                            "languages": "cs"
                        }
                    }).then(function (response) {
                        if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                            let item = response.data.itemListElement[0].result;
                            if (item.name !== 'undefined' && item.name) {
                                let graphitem = {
                                    id: item["@id"],
                                    label: item.name,
                                    title: JSON.stringify(item, null, 4)
                                };
                                results["nodes"].push(graphitem);
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
            await processArray(kpp);
            await browser.close();
            await res.json(results);
        } catch (err) {
            console.log(error(err));
            await browser.close();
            console.log(error("Browser Closed"));
        }
        })();
});

app.get("/nodes2", (req, res, next) => {
    let searchstring = req.param("q");
    let url = 'https://www.google.com/search?q='+searchstring;

    (async () => {
        try {
            let results = {"nodes":[]};
            let browser = await puppeteer.launch({ headless: true });
            let page = await browser.newPage();
            await page.goto(url);
            await page.waitFor(".knowledge-panel");
            let kpp_2 = await page.evaluate(() => Array.from( document.querySelectorAll('.knowledge-panel .kno-fb-ctx[data-rentity^="/"]'), element => element.getAttribute("data-rentity")));
            async function processArray2(array) {
                for (const link of array) {
                    console.log(link);
                    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                        params: {
                            'ids': link,
                            'limit': 1,
                            'indent': true,
                            "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                            "languages": "cs"
                        }
                    }).then(function (response) {
                        if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                            let item = response.data.itemListElement[0].result;
                            if (item.name !== 'undefined' && item.name) {
                                let graphitem = {
                                    id: item["@id"],
                                    label: item.name,
                                    title: JSON.stringify(item, null, 4)
                                };
                                results["nodes"].push(graphitem);
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
            await processArray2(kpp_2);
            await browser.close();
            await res.json(results);
        } catch (err) {
            console.log(error(err));
            await browser.close();
            console.log(error("Browser Closed"));
        }
    })();
});

app.get("/nodes3", (req, res, next) => {
    let searchstring = req.param("q");
    let url = 'https://www.google.com/search?q='+searchstring;

    (async () => {
        try {
            let results = {"nodes":[]};
            let browser = await puppeteer.launch({ headless: true });
            let page = await browser.newPage();
            await page.goto(url);
            await page.waitFor(".knowledge-panel");
            async function processArray(array) {
                for (const link of array) {
                    console.log(link);
                    await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                        params: {
                            'query': link,
                            'limit': 1,
                            'indent': true,
                            "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
                            "languages": "cs"
                        }
                    }).then(function (response) {
                        if (typeof response.data.itemListElement[0] !== 'undefined' && response.data.itemListElement[0]) {
                            let item = response.data.itemListElement[0].result;
                            if (item.name !== 'undefined' && item.name) {
                                let graphitem = {
                                    id: item["@id"],
                                    label: item.name,
                                    title: JSON.stringify(item, null, 4)
                                };
                                results["nodes"].push(graphitem);
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
            let kpp_3 = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel .kno-fb-ctx[data-rentity=""] > a'), element => element.getAttribute("title")));
            await processArray(kpp_3);
            await browser.close();
            await res.json(results);
        } catch (err) {
            console.log(error(err));
            await browser.close();
            console.log(error("Browser Closed"));
        }
    })();
});