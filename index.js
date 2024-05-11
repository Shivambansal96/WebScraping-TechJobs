

const fs = require('node:fs')
const xlsx = require('xlsx');
const puppeteer = require('puppeteer');

async function getWebPageData() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './tmp'
    })

    let result = [];

    const page = await browser.newPage();   
    await page.goto('https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch', { waitUntil: 'networkidle2' })
    
    try {
    

            await page.waitForSelector('.styles_jlc__main__VdwtF'); 

            result = await page.evaluate(() => {
    
            const jobTitle = Array.from(document.querySelectorAll('a.title'), element => element.textContent.trim());

            const companyNames = Array.from(document.querySelectorAll('.mw-25'), element => element.textContent.trim());

            const companyLocation = Array.from(document.querySelectorAll('.locWdth'), element => element.textContent.trim());  

            const companyRatings = Array.from(document.querySelectorAll('.main-2'), element => element.textContent.trim());  

            const companyReviews = Array.from(document.querySelectorAll('.review'), element => element.textContent.trim());  

            const companyExpReq = Array.from(document.querySelectorAll('.expwdth'), element => element.textContent.trim());  

            // const companyRole = Array.from(document.querySelectorAll('.job-desc'), element => element.textContent.trim());            

            const jobs = jobTitle.map((title, index) => ({
                Title: title,
                Company_Name: companyNames[index],
                Company_Location: companyLocation[index],
                // companyRole: companyRole[index],
                Company_Ratings: companyRatings[index],
                Company_Reviews: companyReviews[index],
                Company_Experience_Request: companyExpReq[index],

            }));
            
            return jobs;
            
        });
        
        console.log(result);

        
    } catch (error) {
        console.error('Error during actions on the page:', error);
    }

    
    
    const workbook = xlsx.utils.book_new();
    
    const worksheet = xlsx.utils.json_to_sheet(result);
    
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Job Data');
    xlsx.writeFileSync(workbook, 'NaurkiDotCom Data.xlsx');
    
    await browser.close();
}

getWebPageData();






    // try {
    
    //         // (.np-leader)   class name of the container of table...   main content in <tbody></tbody>  class="st-table__head" = headers

    // await page.waitForSelector('a.title'); 

    //         const result = await page.evaluate(() => {
    //         // example: extract some data, such as text content
    
    //         const jobTitle = Array.from(document.querySelectorAll('a.title'), element => element.textContent.trim());
            
    //         return jobTitle;
            
    //     });
        
    //     console.log(result);

        
    // } catch (error) {
    //     console.error('Error during actions on the page:', error);
    // }