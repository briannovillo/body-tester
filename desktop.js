const fetch = require('node-fetch');
const cheerio = require('cheerio');

const devices = [
    {type: "desktop", text: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36"},
    {type: "desktop", text: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"},
    {type: "desktop", text: "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36"},
    {type: "desktop", text: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9"},
    {type: "desktop", text: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1"},
];

const randomNumber = Math.floor(Math.random() * devices.length);
const randomDevice = devices[randomNumber];

const url = 'http://localhost:8302/salud?'+Date.now();

fetch(url, {
        method: 'GET',
        headers: {
            'User-Agent': randomDevice.text
        },
    })
    .then(res => res.text())
    .then(body => {
        console.log("\x1b[0m Se hizo el request a", url, "con el device:", randomDevice.text);

        const $ = cheerio.load(body);

        const headerClasses = $('header').attr('class');
        const footerClasses = $('footer').attr('class');
        const linkedCss = $('link[type="text/css"]').toArray().map(tag => tag.attribs.href);

        const consoleColorEval = (bool) => bool ? "\x1b[32m" : "\x1b[31m";

        const headerIsOk = headerClasses.indexOf(randomDevice.type) > -1;
        const footerIsOk = footerClasses.indexOf(randomDevice.type) > -1;
        const cssIsOk = linkedCss.filter(css => css.indexOf(randomDevice.type) > -1).length;

        console.log(consoleColorEval(headerIsOk), "El tag <header> resultante tiene las clases", headerClasses);
        console.log(consoleColorEval(footerIsOk), "El tag <footer> resultante tiene las clases", footerClasses);
        console.log(consoleColorEval(cssIsOk), "Los tag <link> de css apuntan a", linkedCss);

    })
    .catch((err) => console.error(err));
