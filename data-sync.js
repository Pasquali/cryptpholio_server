const https = require("https");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Snfc123!',
    database:'cryptpholio'
});

var fullCoinList;
var FullCoinListImages;
getFullCoinList();

function getFullCoinList() {
    https.get('https://api.coinmarketcap.com/v1/ticker/?limit=1000', res => {
        res.setEncoding("utf8");
        fullCoinList = "";
        res.on("data", data => {
            fullCoinList += data; 
        })
        res.on("end", () => {
            fullCoinList = JSON.parse(fullCoinList);
        })
    });
}
getFullCoinListImages = https.get('https://min-api.cryptocompare.com/data/all/coinlist', res => {
    res.setEncoding("utf8");
    FullCoinListImages = "";
    res.on("data", data => {
        FullCoinListImages += data; 
    })
    res.on("end", () => {
        FullCoinListImages = JSON.parse(FullCoinListImages);
    })  
})

coin = setInterval( function() {
    fullCoinList.forEach(coin => {
        if (FullCoinListImages.Data[coin.symbol] != undefined && FullCoinListImages.Data[coin.symbol].ImageUrl != undefined) {
            var ImageUrl = FullCoinListImages.Data[coin.symbol].ImageUrl;
        } else {
            var ImageUrl = 'womp womp'; 
        }
        const coins = `UPDATE coin_prices SET
                btc_price = ${coin.price_btc}, 
                usd_price = ${coin.price_usd}, 
                rank = ${coin.rank},
                market_cap_usd = ${coin.market_cap_usd}
                WHERE symbol = '${coin.symbol}';`;
        connection.query(coins, function (err, result) {
            if (err) {
                console.log(err);
            }
            if(result != undefined && result.affectedRows === 0 && coin.symbol != '') {
                query = `INSERT INTO coin_prices(
                    symbol, 
                    btc_price, 
                    usd_price, 
                    rank,
                    market_cap_usd,
                    name,
                    image_url)
                VALUES(
                    '${coin.symbol}', 
                    ${coin.price_btc}, 
                    ${coin.price_usd}, 
                    ${coin.rank},
                    ${coin.market_cap_usd},
                    "${coin.name}",
                    "${ImageUrl}");`;
                connection.query(query, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            });
        })
        getFullCoinList();
            // next();
}, 10000);

module.exports = coin;