const fs = require('fs');

// Import de puppeteer
const puppeteer = require("puppeteer")
const nbPage = 100
let count = 1
let data = []



const getData = async (browser, page, index) => {
    
    await page.goto('https://lesjoiesducode.fr/page/'+index)
    console.log("https://lesjoiesducode.fr/page/"+index);
    result = await page.evaluate(() =>

        [...document.querySelectorAll('.index-blog-post')].map(post => 
            [
                index,
                post.querySelector('h1').innerText,
                post.querySelector('.blog-post-content').querySelector('video') !== null ? 
                post.querySelector('.blog-post-content').querySelector('video').querySelector('object').getAttribute('data') :
                post.querySelector('.blog-post-content').querySelector('img').getAttribute('src')
            ]
        ),
    )
    

    result.forEach( async (element, i) =>{
        let statut;
        // let filename = element[1].split('/')[5];
        data.push(element)
    });

}

const scrap = async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    for (let index = 1; index <= nbPage; index++) {
        await getData(browser,page,index)  
    }

    browser.close()
    return data
}


scrap()
.then(value => {
 console.log(value)
 var myJSON = JSON.stringify(value);
 fs.writeFile('data.json', myJSON , function (err) {
    if (err) return console.log(err);
    console.log('data > data.txt');
  });
})
.catch(e => console.log(`error: ${e}`))

