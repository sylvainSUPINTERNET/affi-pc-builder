import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readline from 'readline';
import { waitForEnter } from './utils';



( async () => {

    puppeteer.use(StealthPlugin());

    const chromeExecPath = `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`;

    const browser = await puppeteer.launch({executablePath: chromeExecPath, headless: false}); // headless: "new"
        
    const page = await browser.newPage();

    // Without this header for some reason google will not let you enter the password and detect browser as insecure
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
    });


    await page.goto('https://www.amazon.com/');

    await waitForEnter(); // should see on browser captcha ... + need to login manually with OTP for 2FA ( marketing account ) 

    console.log("Continue ...")

    const input = await page.$('#twotabsearchtextbox')
    await input?.type('RTX 4080')

    const searchButton = await page.$('#nav-search-submit-button')
    await searchButton?.click()
 

    // document.querySelector('#amzn-ss-text-shortlink-textarea').innerHTML

    // document.querySelector('#amzn-ss-text-link > span > strong > a').click()


    // document.querySelectorAll('.sg-col-inner') ( 4 to 20 )

    // 1 sur 2 = lien de la page produit
    // document.querySelectorAll('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');

    // when click on link : to get image 
    // document.querySelector('img[data-a-image-name=landingImage]')
})()