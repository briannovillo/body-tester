const fetch = require('node-fetch');
const cheerio = require('cheerio');

const devices = [
    {type: "mobile", text: "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Mobile Safari/537.36"},
    {type: "mobile", text: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"},
    {type: "mobile", text: "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"},
    {type: "mobile", text: "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"},
    {type: "mobile", text: "Mozilla/5.0 (Linux; Android 7.0; SM-A310F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36 OPR/42.7.2246.114996"},
    {type: "mobile", text: "Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0"}
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
