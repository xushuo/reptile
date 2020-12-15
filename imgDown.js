/**
 * Created by Administrator on 2017/3/6.
 */
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var preUrl = 'http://jandan.net/ooxx/';
var dirName = 'jiandan';
var url1to9 = [
    'MjAyMDEyMTQtMQ',
    'MjAyMDEyMTQtMg',
    'MjAyMDEyMTQtMw',
    'MjAyMDEyMTQtNA',
    'MjAyMDEyMTQtNQ',
    'MjAyMDEyMTQtNg',
    'MjAyMDEyMTQtNw',
    'MjAyMDEyMTQtOA',
    'MjAyMDEyMTQtOQ',
]
//除最后一位
var urlPro = [
    'MjAyMDEyMTQtMT', //10
    'MjAyMDEyMTQtMj',  //20
    'MjAyMDEyMTQtMz',  //30
    'MjAyMDEyMTQtND', //40
    'MjAyMDEyMTQtNT',  //50
    'MjAyMDEyMTQtNj',  //60
    'MjAyMDEyMTQtNz',  //70
    'MjAyMDEyMTQtOD',  //80
    'MjAyMDEyMTQtOT'  //90
]
// 最后一位数 0-9
var urlProAfter = [
    'A', 'E', 'I', 'M', 'Q', 'U', 'Y', 'C', 'G', 'K'
]

function page1(){
    //0-9页
    for(let i = 0, len = url1to9.length; i < len; i++){
        setTimeout(function(){
            console.log('--------------' + (i + 1) + '------------------');
            request(preUrl + url1to9[i], function(error, response, body){
                if(!error && response.statusCode == 200){
                    fs.exists('./imgs/' + dirName + '/1-9/', function(exists){
                        if(!exists){
                            fs.mkdirSync('./imgs/' + dirName + '/1-9/')
                        }
                        cheerioData(body, '1-9');
                    })
                }
            });
        }, 60000 * i)
    }
}

function pages(){
    //10-99页
    let count = 0
    for(let i = 0, len1 = urlPro.length; i < 9; i++){
        for(let j = 0, len2 = urlProAfter.length; j < len2; j++){
            setTimeout(function(){
                console.log('--------------' + (i + 1) + j + '------------------');
                request(preUrl + urlPro[i] + urlProAfter[j], function(error, response, body){
                    if(!error && response.statusCode == 200){
                        fs.exists('./imgs/' + dirName + '/' + (i + 1) + '0-' + (i + 1) + '9' + '/', function(exists){
                            if(!exists){
                                fs.mkdirSync('./imgs/' + dirName + '/' + (i + 1) + '0-' + (i + 1) + '9' + '/')
                            }
                            cheerioData(body, (i + 1) + '0-' + (i + 1) + '9' + '/');
                        })
                    }
                });
            }, 100000 * count)
            count++
        }
    }
}


function cheerioData(data, dirSubName){
    let $ = cheerio.load(data);
    let imgs = $('.text p a').toArray();
    for(let i = 0; i < imgs.length; i++){
        let imgsrc = imgs[i].attribs.href;
        //    console.log(imgsrc);
        let fileName = path.basename(imgsrc);
        request.get("http:" + imgsrc).pipe(fs.createWriteStream('./imgs/' + dirName + '/' + dirSubName + '/' + fileName)).on('close', function(){
            console.log(dirName + '/' + fileName + ' finish-------------' + dirSubName + '：' + (i + 1) + '/' + imgs.length);
        });
    }
}


fs.exists('./imgs/' + dirName + '/', function(exists){
    if(!exists){
        fs.mkdirSync('./imgs/' + dirName + '/')
    }
    //执行爬取
    pages()
})



