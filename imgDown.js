/**
 * Created by Administrator on 2017/3/6.
 */
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var url = 'http://jandan.net/ooxx/page-1319';
request(url,function(error,response,body){
    if(!error&&response.statusCode ==200){
        cheerioData(body);
    }
});
function cheerioData(data){
    var $ = cheerio.load(data);
    var imgs = $('.text img').toArray();
    for(i=0;i<imgs.length;i++){
        var imgsrc = imgs[i].attribs.src;
        console.log(imgsrc);
        var fileName = path.basename(imgsrc);
        request.get("http:"+imgsrc).pipe(fs.createWriteStream('./img/'+fileName)).on('close',function(){
            console.log(fileName + ' done');
        });
    }
}