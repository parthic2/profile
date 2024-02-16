const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/', (req, res) => {
    res.send({ message: "Running..." });
});

app.get('/:id', (req, res) => {
    const { id } = req.params;

    getFollowers = async () => {
        let { followers, connections } = await run(id);
        console.log(followers, connections);
        res.send({
            followers,
            connections
        });
    };
    getFollowers();
});

app.listen(4000, () =>
    console.log("Example app listening on port 4000!")
);

async function run(id) {
    // open browser
    const browser = await puppeteer.launch();

    // open new tab
    const page = await browser.newPage();

    // // Set a longer navigation timeout (e.g., 60 seconds)
    // await page.setDefaultNavigationTimeout(60000);

    // enter url
    await page.goto(`https://www.linkedin.com/in/dev-saurabh-kumar`);

    // wait for navigation to complete
    await page.waitForNavigation({ withUntil: "networkidle0" });

    // Take a screen shot after load and save it as example.png
    try {
        const textContent = await page.$$eval("span.top-card__subtitle-item",
            (element) => element.map((element) => element.textContent));

        let followers = textContent[0].split("\n")[1].trim();
        let connections = textContent[1].trim();

        // close the browser
        await browser.close();

        return { followers, connections };
    } catch (e) {
        console.log("error loading");
        // close the browser
        await browser.close();
        return { followers, connections };
    }
}