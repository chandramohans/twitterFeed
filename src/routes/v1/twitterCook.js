const mongoose = require('mongoose');
const Queue = require('bee-queue');
const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi(
    {
    appKey: process.env.twitterappKey,
    appSecret: process.env.twitterappSecret,
    accessToken: process.env.twitteraccessToken,
    accessSecret: process.env.twitteraccessSecret,
     
}
//process.env.twitterbearerToken
);

const options = {
    redis: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
}

const taskQueue = new Queue('task', options);

taskQueue.process(function (job, done) {
 //   let qty = 3; //job.data.qty;
 //   let completedTask = 0;
    let hashtag = job.data.hashtag;
 //   client.v2.singleTweet('1460323737035677698', {
        // 'tweet.fields': [
        //     'organic_metrics',
        //  ],
    console.log("your task under progress : " + hashtag);
   // job.reportProgress(50);
   // console.log(job.reportProgress()    )
    client.v2.search(query=hashtag
     ).then((val) => {
        processResponseData("Chandra", ("query=" + hashtag), val)
 //       console.log(val)
        job.reportProgress(100);
        return done();
    }).catch((err) => {
        console.log(err)
    })
    
});

const tweetSchema = new mongoose.Schema({
    userid:String,
    feedDate:Date,
    query : String,
    feed : String,
    }
); 

const tweetFeed = mongoose.model('tweetFeed', tweetSchema);

function processResponseData(userid,  query, data) {
    var userid = userid;
    var query = query;
    var feed = JSON.stringify(data);
    feedDate = new Date;
    const tweetToDB = new tweetFeed({userid, feedDate, query, feed});  
   
//    console.log(parsedTweet);
//    var parsedTweet = JSON.parse(tweet);
    // parsedTweet = "{" + " \"data\":" +"[" +"{" + 
    //            " \"id\":"+" \"1527615855114088448\","+
    //            " \"text\": " +" \"Come join us! Looking for small #productionhouses and " + 
    //            "#freelancers in #Bangalore @hiverhq #creative https://t.co/OQKlx5ENmG\"" +
    //         "}]}";
    
    tweetFeed.create(tweetToDB, function (err, doc) {
        if (err) { 
            console.log(err);
        } else {
            console.log("Tweet feed stored in mongodb")
        }
    });
}