/**
 * Created by Administrator on 2017/3/6.
 */
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
var preUrl = 'http://m.dishuge.com/book/7223/';
//凡人修仙传仙界篇 6-1412  \r\n
var dirName = '凡人修仙传仙界篇';

function txts(){
    let count = 0
    for(let i = 6; i < 1413; i++){
        for(let j = 1; j < 4; j++){
            setTimeout(() => {
                console.log(`=====第【${i}_${j}】开始写入=====`)
                request(preUrl + i + '_' + j + '.html', function(error, response, body){
                    if(!error && response.statusCode == 200){
                        if(j == 1){
                            cheerioData(body, i + '_' + j, true);
                        } else {
                            cheerioData(body, i + '_' + j, false);
                        }

                    }
                });
            }, 3000 * count)
            count++
        }

    }
}

function loadPage(url, section, page, first){
    console.log(`++++++第【${section}_${page}】章准备写入+++++++`)
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            let $ = cheerio.load(body, {decodeEntities : false});
            let txtsPro = $('#mycontent').html();
            //章节的第1页就去掉 '(第1/3页)'，
            //章节的第2-3页就去掉整个标题，
            if(first){
                txtsPro = txtsPro.replace(/\u0028\u7b2c\u0031\u002f\u0033\u9875\u0029/, '')
            } else {
                txtsPro = txtsPro.replace(/<p>.+[\u9875]\)<\/p>/, '')
            }
            txtsPro = txtsPro.replace(/<p><\/p>/g, '').replace(/<p>/g, '\n').replace(/<\/p>/g, '').replace(/&nbsp;|（本章未完，请点击下一页继续阅读）/g, ' ')
            fs.appendFileSync('./txts/' + dirName + '.txt', txtsPro, 'utf8')
            console.log(`-------------第【${section}_${page}】章已经写入完成------------`)
            if(page == 1){
                page++
                first = false
            } else if(page == 2){
                page++
            } else {
                page = 1
                first = true
                section++
            }
            if(page<1413){
                loadPage(preUrl + section + '_' + page + '.html', section, page, first)
            }
        }
    });
}

loadPage(preUrl + '883_1.html', 883, 1, true)

function cheerioData(data, index, first){
    let $ = cheerio.load(data, {decodeEntities : false});
    let txts = $('#mycontent').html();
    //章节的第1页就去掉 '(第1/3页)'，
    //章节的第2-3页就去掉整个标题，
    let txtsPro = txts
    if(first){
        txtsPro = txtsPro.replace(/\u0028\u7b2c\u0031\u002f\u0033\u9875\u0029/, '')
    } else {
        txtsPro = txtsPro.replace(/<p>.+[\u9875]\)<\/p>/, '')
    }
    txtsPro = txtsPro.replace(/<p><\/p>/g, '').replace(/<p>/g, '\n').replace(/<\/p>/g, '').replace(/&nbsp;|（本章未完，请点击下一页继续阅读）/g, ' ')
    fs.appendFile('./txts/' + dirName + '.txt', txtsPro, 'utf8', function(err){
        if(err){
            return console.log(err);
        }
        console.log(`-------------第【${index}】章已经写入完成--------`);
    });
}

//txts()

/*
request(preUrl + '9_1.html', function(error, response, body){
    if(!error && response.statusCode == 200){
            cheerioData(body, '9_1', true);
    }
});
*/

