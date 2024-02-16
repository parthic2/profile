const puppeteer = require('puppeteer');

const run = async () => {
    // open browser
    const browser = await puppeteer.launch();

    // open new tab
    const page = await browser.newPage();

    // enter url
    await page.goto(`https://www.linkedin.com/in/dev-saurabh-kumar`);

    // wait for navigation to complete
    await page.waitForNavigation({ withUntil: "networkidle0" });

    const textContent = await page.$$eval("h1.text-heading-xlarge inline t-24 v-align-middle break-words",
        (elements) => elements.map((element) => element.textContent)
    );

    console.log(textContent);

    // const textContent = await page.$$eval("span.top-card__subtitle-item",
    //     (element) => element.map((element) => element.textContent)
    // );

    // console.log(textContent);

    // close the browser
    await browser.close();
}

run();

// https://www.linkedin.com/developers/apps/verification/7ca3b9a8-5637-4b78-951e-ec2cfa46f677
