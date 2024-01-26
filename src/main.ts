import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readline from 'readline';
import { waitForEnter } from './utils';


let timeout = (milliseconds: number) => new Promise(r => setTimeout(r, milliseconds));


( async () => {

    puppeteer.use(StealthPlugin());

    //chrome --remote-debugging-port=9222 
    // will use current profile / instance of chrome ( so no setup operation required login etc ... )
    const browser = await puppeteer.connect({browserURL:" http://127.0.0.1:9222", defaultViewport:null})

    const page = await browser.newPage();

    // Without this header for some reason google will not let you enter the password and detect browser as insecure
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
    });


    await page.goto('https://www.amazon.com/');

    // typing in search bar
    const input = await page.$('#twotabsearchtextbox')
    await input?.type('RTX 4080')

    // search
    const searchButton = await page.$('#nav-search-submit-button')
    await searchButton?.click()    
    
    // Set to best seller the filter
    await page.waitForSelector('#s-result-sort-select');
    await page.select('#s-result-sort-select', 'exact-aware-popularity-rank');

    // get list item 
    await page.waitForSelector('.s-main-slot.s-result-list.s-search-results.sg-row');
    await page.waitForSelector('div[data-asin]:not([data-asin=""])');
    const items = await page.$$('div[data-asin]:not([data-asin=""])');
    
    // create link of link from list of items ( 1 on 2 is the link of the product the 2 is price)
    let links = await page.$$('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
    let hrefs = await Promise.all(
        links.map(async (link) => {
            return page.evaluate(el => el.href, link);
        })
    );
    

    let count = 0;
    const THRESHOLD_ITEM=3;
    let itemsAnalyzed:{ "name": string, "image":string, "affiliationLink": string }[] = [];
    console.log("Links to visit: ", Math.floor((hrefs.length / 2)), " keep only ", THRESHOLD_ITEM);

    let i=0;
    // do not use forEach, will use 1 generator / 1 method. So not working as you think
    for (const href of hrefs) {

        if ( count === THRESHOLD_ITEM) {
            break;
        }

        i++;
        console.log(i);
        if ( i%2 !== 0 ) {
            await page.goto(href);
            await page.waitForSelector('#productTitle');
            const name = await page.$eval('#productTitle', (el) => el.innerHTML) as string;
            await page.waitForSelector('img[data-a-image-name=landingImage]');
            const image = await page.$eval('img[data-a-image-name=landingImage]', (el) => el.getAttribute('src')) as string;
            await page.waitForSelector('#amzn-ss-text-link > span > strong > a');
            const links2 = await page.$$('a[title="Text"]');
            await links2[0].click();
            await page.waitForSelector('#amzn-ss-text-shortlink-textarea');
            const affiliationLink = await page.$eval('#amzn-ss-text-shortlink-textarea', (el) => el.innerHTML) as string;
            console.log("\n");
            await timeout(5000);
            console.log("Name : ", name);
            console.log("Image : ", image);
            console.log("Affiliation Link : ", affiliationLink);
            console.log("\n");
            count++;
            itemsAnalyzed = [...itemsAnalyzed, {
                name,
                image,
                affiliationLink
            }];
        }
    }
    

})()