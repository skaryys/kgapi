const express = require("express");
const rp = require('request-promise');
const puppeteer = require("puppeteer");
const devices = require('puppeteer/DeviceDescriptors');
const axios = require("axios");
const cors = require("cors");
const app = express();
const device = devices["Pixel 2 XL"];

const server = app.listen(4000, () => {
    console.log("Server running on port 4000");
});
server.timeout = 0;
app.use(cors());

app.get("/nodes", (req, res, next) => {
    let searchstring = req.param("q");
    let url = 'https://www.google.com/search?q='+searchstring;

    (async () => {
        try {
            let results = {"nodes":[]};
            let browser = await puppeteer.launch({ headless: true, defaultViewport: null});
            let page = await browser.newPage();
            await page.goto(url);
            await page.waitFor(".knowledge-panel");
            let kpp = await page.evaluate(() => Array.from( document.querySelectorAll('.knowledge-panel .kno-fv a[data-ved]'), element => element.getAttribute("href")));
            async function processArray(array) {
                for (const link of array) {
                    let browser_processArray = await puppeteer.launch({ headless: true, defaultViewport: null});
                    let page_processArray = await browser_processArray.newPage();
                    await page_processArray.goto("https://google.com"+link);
                    await page_processArray.waitFor(".knowledge-panel");
                    let kgid = await page_processArray.evaluate(() => Array.from(document.querySelectorAll(".kno-ftr [data-async-context]"), element => element.getAttribute("data-async-context")));
                    let i = 0;
                    for (const first of kgid) {
                        if (i === 0) {
                            let regex = /(?<=card_id:)(.*)(?=;entry_point)/;
                            let match_first = regex.exec(first);
                            let match_id = match_first[1].toString().replace("%2F", "/");
                            let match_id2 = match_id.replace("%2F", "/");
                            console.log(match_id2);
                            await axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
                                params: {
                                    'ids': match_id2,
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
                            i++;
                        }
                    }
                }
            }
            await processArray(kpp);
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
            let kpp_3 = await page.evaluate(() => Array.from(document.querySelectorAll('.knowledge-panel .kno-fb-ctx[data-rentity=""] > a'), element => element.getAttribute("href")));
            await processArray(kpp_3);
            await browser.close();
            await res.json(results);
        } catch (err) {
            console.log(err);
            await browser.close();
            console.log(error("Browser Closed"));
        }
        })();
});