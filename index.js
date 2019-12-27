const request = require('request');
let domain = 'https://rsvpgallery.com/';
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('SHOPIFY Monitor Ready');
    sendItem();
});
client.login('NjU5ODQ1MzM2NjU5MTMyNDE2.XgUO5w.IbthuJejK0Mp1nH7l83uhY4UaEw');


function sendItem() {
    // Set the headers
    var headers = {
        'User-Agent':       'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        'Content-Type':     'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
    }
    // Configure the request
    var options = {
        url: domain + 'products.json',
        method: 'GET',
        headers: headers,
    }
    request(options, function(err, res, body) {
        if(!err && res.statusCode == 200) {
            let parsed = JSON.parse(body);
            let vars = [];
            var obj = {
                products: [],
            };
            for(x in parsed.products) {
                obj.products.push({title: parsed.products[x].title, url: domain + 'products/' + parsed.products[x].handle, variants: parsed.products[x]['variants'], image: parsed.products[x]['images'][0]['src'], price: parsed.products[x]['variants'][0]['price'] });
            }
            fs.writeFile('products.json', JSON.stringify(obj, null, 4), function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('PRODUCTS SAVED');
                }
            });
            const sendItem = new Discord.RichEmbed()
            .setColor('#7CFC00')
            .setDescription("[" + obj.products[0]["title"] + "]" + "(" + obj.products[0]["url"] + ")" )
            .addField('Site:', domain, true)
            .addField('Price:', obj.products[0]["price"], true)
            .setThumbnail(obj.products[0["image"])
            .setTimestamp()
            for ( x in parsed.products[x].variants) {
                sendItem.addField(parsed.products[x]['variants'][0]['title'], true);
            }
            client.channels.get('626192948467466261').send(sendItem);
        } else {
            console.log(err);
        }
    });
}


