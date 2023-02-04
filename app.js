const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();

app.set('view engine');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    axios.get("https://devfolio.co/hackathons")
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const hackathons = [];
        $('.fkNYgN').each(function(i, elem) {
            const hackthon = {title: "", date: "", link: "", theme: ""};
            hackthon.title = $(this).find('.huEips').find('.ioktqm').text();
            hackthon.link = $(this).find('.huEips').find('.hizpov').attr('href');
            hackthon.theme = $(this).find('.ePSKUe').find('.cvGvxa').children('p').text();
            hackthon.date = $(this).find('.ieoaQR').find('.bGdHSt').slice(0, 1).text() + " - " + $(this).find('.ieoaQR').find('.bGdHSt').slice(1, 2).text() + " - " + $(this).find('.ieoaQR').find('.bGdHSt').slice(2, 3).text();
            if(hackathons.find(hack => hack.title === hackthon.title) === undefined) {
                hackathons.push(hackthon);
            }
        });
        fs.writeFile('hackathons.json', JSON.stringify(hackathons, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the hackathons.json file');
        }
        );
        res.send('Check your console!')
    })
    .catch(console.error);
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
