const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const data = require('./locations.json');

function parseRelativeTime(datePostedValue) {
  const now = new Date();
  let date;

  if (datePostedValue.endsWith('hoursago')) {
    const hours = parseInt(datePostedValue);
    date = new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (datePostedValue.endsWith('minutesago')) {
    const minutes = parseInt(datePostedValue);
    date = new Date(now.getTime() - minutes * 60 * 1000);
  } else if (datePostedValue === 'Yesterday') {
    date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    date.setHours(0, 0, 0, 0);
  } else {
    let parts = datePostedValue.split("/");
    let formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
    let dateObject = new Date(formattedDate);
    date = dateObject;
  }

  return date.toLocaleString();
}

async function KijijiParser(province, city, subCity) {
  var urlKijiji = ""
  if (subCity == "") {
    urlKijiji = `https://www.kijiji.ca/b-canada/c34l0${data[province][city].id}`;
  } else {
    urlKijiji = `https://www.kijiji.ca/b-canada/c34l0${data[province][city][subCity].id}`;
  }

  console.log(urlKijiji)
  console.log("before axios");

  return new Promise((resolve, reject) => {
    axios.get(urlKijiji)
      .then((response) => {

        console.log("going here");
        const html = response.data;
        const $ = cheerio.load(html);
        const divs = $('div[data-listing-id]').toArray();
        const kijijiData = [];
        divs.forEach((div) => {

          const kijiji = {}

          const priceDiv = $(div).find('div.price');
          kijiji.price = priceDiv.text().trim();
          const desc = $(div).find('div.description');
          kijiji.description = desc.text().trim();

          const url = $(div).find('a.title ').attr('href');
          let appendString = 'https://www.kijiji.ca' + url;
          kijiji.url = appendString;

          const titlediv = $(div).find('div.title');
          const title = titlediv.text().trim();
          kijiji.title = title;

          const imgSrc = $(div).find('div.image img').attr('data-src');
          //const imgSrc4 = imgSrc.replace('200-jpg','400-jpg')       //changing image size for 200X to 400X(to get better picture)
          kijiji.img = imgSrc;  

          const datePosted = $(div).find('div.location').find('span.date-posted');
          const datePostedValue = datePosted.text().replace(/\s+|<+/g, '');
          kijiji.datePosted = parseRelativeTime(datePostedValue);

          kijiji.host = "kijiji";

          kijijiData.push(kijiji)
        });
        kijijiData = JSON.stringify(kijijiData, null, 2);
        // fs.writeFile("kijiji_listings.json", JSON.stringify(kijijiData, null, 2), (err) => {
        //   if (err) {
        //     console.error(err);
        //     reject(err);
        //   } else {
        //     console.log("Data written to file successfully in kijiji_listings.json!");
        //     resolve(kijijiData);
        //   }
        // });

        //Code to get page navigation 
        const paginationDiv = $('div.pagination');
        const kijiji_navigation = [];
        paginationDiv.find('a').each((i, elem) => {
          const href = $(elem).attr('href');
          kijiji_navigation.push(href);
        });
        // fs.writeFile('kijiji_navigation.json', JSON.stringify(kijiji_navigation), (err) => {
        //   if (err) {
        //     console.error(err);
        //   } else {
        //     console.log('kijiji_navigation.json written successfully');
        //   }
        // });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}


module.exports = KijijiParser;