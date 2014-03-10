
/**
 * Created by Mortoni on 06/03/14.
 */
var FeedParser = require('feedparser')
    , request = require('request')
    , http = require('http')
    , async = require('async');

var db = require("./dblogger");
var udp = require('udp');

var client = udp.createSocket("udp4");
var VizIP = "172.20.249.146";
var VizPort = 6101;


var feedURL = "http://feed.scribblelive.com/rss.aspx?Id=470798&Token=cc310fdb-4bca-464a-b919-10ffa0589171&c=1670";

feedURL = "http://singletrackworld.com/forum/rss/";

feedURL = "http://feeds.bbci.co.uk/news/politics/rss.xml";

var feedMeta;
var episodes = [];
var running = true;

function processMessage(item, doneCallback)
{
 //   console.log(pubDate.getHours() + ":" + pubDate.getMinutes() + ": " + title);
    console.log(item.title);
    return doneCallback(null);
}

 // async.forever {


var getNextBlock = function(done){
    http.get(feedURL, function(res) {
        res.pipe(new FeedParser({}))
            .on('error', function(error){
                // TODO: Tell the user we just had a melt-down
                console.log(error);
            })

            .on('meta', function(meta){
                // Store the metadata for later use
                feedMeta = meta;
            })

            .on('readable', function(){
                var stream = this, item;

                while (item = stream.read()){
                    // Each 'readable' event will contain 1 article
                    // Add the article to the list of episodes
                    var ep = {
                        'title': item.title,
                        'mediaUrl': item.link,
                        'pubDate': item.pubDate
                    };
                    episodes.push(ep);
                }

                async.map(episodes, processMessage, function(err){
                    console.log("\n\nFinished!");
                });
            })

            .on('end', function(){
                console.log("\n\n\n\nEnd of feed block....");
                /*
                var result = {
                    'feedName': feedMeta.title,
                    'feedArtist': feedMeta['itunes:author']['#'],
                    'website': feedMeta.link,
                    'albumArt': {
                        'url': feedMeta.image.url,
                        'width': parseInt(feedMeta['rss:image']['width']['#']),
                        'height': parseInt(feedMeta['rss:image']['height']['#'])
                    },
                    'episodes': episodes
                };

            */

        });
    });
    setImmediate(done);
 }

async.forever(getNextBlock, function(err){
    console.log("Block....!");
});






/*
var req = request(feedURL)
    , feedparser = new FeedParser();

req.on('error', function (error) {
    // handle any request errors
});
req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
});

feedparser.on('error', function(error) {
    // always handle errors
    console.log(error);
});
feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;

    while (item = stream.read()) {
        console.log(item.pubDate.getHours() + ":" + item.pubDate.getMinutes() + ": " + item.title);

        //     db.messages.save({type: "pist", date: item.pubDate, message: item.title}, function(err, saved) {
        //         if( err || !saved ) console.log("Message not saved: " + item.pubDate);
        //    });


    }
    var message = new Buffer('0 RENDERER*MAP SET_STRING_ELEMENT pist Alphabetti2 and Fours\0');
*/
//    client.send(message, 0, message.length, VizPort, VizIP, function(err, bytes) {
//        console.log(err);
//        client.close();
//    });

/**
 * Created by Sony laptop on 07/03/14.
 */
