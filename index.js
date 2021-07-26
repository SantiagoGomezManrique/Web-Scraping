const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs')
const finalData = [];
request('https://en.wikipedia.org/wiki/List_of_largest_energy_companies',
    (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            $('#mw-content-text > div.mw-parser-output > table > tbody > tr').each((index, element) => {
                const tds = $(element).find("td");
                const companyName = $(tds[1]).children('a').text();
                const actionName = $(tds[1]).children('small').text();
                const country = $(tds[2]).children('a').text();
                const companyLink = "https://en.wikipedia.org/wiki/" + companyName;
                var year = foundedYear(companyLink);

                if (companyName != "") {
                    const register = { companyName, actionName, country, companyLink, year }
                    finalData.push(register);
                }
            });

            //console.log(finalData);

            let data = JSON.stringify(finalData);
            fs.writeFileSync('information.json', data);
            console.log("Archivo creado bajo el nombre de: information.json")
        }
    });

function foundedYear(link) {
    var year = "";
    request(link,
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                year = $('#mw-content-text > div.mw-parser-output > table.infobox.vcard > tbody > tr').each((index, element) => {
                    if ($(element).find("th").text() === "Founded") {
                        //console.log($(element).find("td").text());
                        return $(element).find("td").text()
                    }
                });

            }
        });

    return year;
}