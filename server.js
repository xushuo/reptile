/**
 * Created by Administrator on 2017/3/3.
 * 爬虫小测
 * 爬取豆瓣电影指定电影页的相应信息（例如，导演名，电影名，主演名，时长，类型，评分，人数等等）。
 */
var cheerio = require('cheerio');
var request = require('sync-request');
var fs = require('fs');
var file = 'movie.text';
var url = 'https://movie.douban.com/subject/25765735/';
var html = '';
html = request('GET',url).getBody().toString();
//console.log(html);
var IMDBLink='';
handleDB(html);
function handleDB(html){
    var $ = cheerio.load(html);
    var info = $("#info");
    //获得电影名
    var movieName = $("#content>h1>span").filter(function(i, el){
        return $(this).attr('property') === 'v:itemreviewed';
    }).text();
    //获取影片导演名
    var directories = '- 导演: ' + $("#info span a").filter(function(i, el){
            return $(this).attr('rel') === 'v:directedBy';
        }).text();
    //获取影片演员
    var starName = '- 主演: ';
    $('.actor .attrs a').each(function(i, el){
        starName += $(this).text() + '/';
    })
    //获取片长
    var runTime = '- 片长: ' + $("#info span").filter(function(i, el){
            return $(this).attr('property') === 'v:runtime';
        }).text();
    //获取影片类型
    var kind = $("#info span").filter(function(i, el){
        return $(this).attr("property") === 'v:genre';
    }).text();
    //处理影片类型数据
    var klength = kind.length;
    var kinds = '- 影 片类型: ';
    for(i=0;i<klength;i+=2){
        kinds+=kind.slice(i,i+2)+'/';
    }
    //获取电影评分和电影评分人数
    //豆瓣
    var DBScore = $('.ll.rating_num').text();
    var DBVotes = $('a.rating_people>span').text().replace(/\B(?=(\d{3})+$)/g,',');
    var DB = '- 豆 瓣评分: ' + DBScore + '/10' + '('+DBVotes+'人评价)';
    //IMDBLink
    IMDBLink = $("#info span").filter(function(i,el){
        return $(this).text()==='IMDb链接:'
    }).next().attr('href');
    var data = movieName +'\r\n'+directories +'\r\n'+starName+'\r\n'+runTime+'\r\n'+kinds+'\r\n'+DB+'\r\n';
    // 输出文件
    fs.appendFile(file,data,'utf-8',function(error){
        if(error){
            throw error;
        }else {
            console.log('大体信息写入完毕\r\n'+data);
            var link = request('GET',IMDBLink).getBody().toString();
            handleIMDB(link);
        }
    })
}
function handleIMDB(link){
    var $ = cheerio.load(link);
    //获取IMDB评分
    var IMDBSore = $('.ratingValue span').filter(function(i,el){
        return $(this).attr('itemprop')==='ratingValue';
    }).text();
    //获取IMDB评分人数
    var IMDBVotes = $('.small').filter(function(i,el){
        return $(this).attr('itemprop')==='ratingCount';
    }).text();
    //字符串拼接
    var IMDB = '- IMDB评分: '+IMDBSore +'/10('+IMDBVotes+'人评价)\r\n';
    //输出文件
    fs.appendFile(file,IMDB,'utf-8',function(error){
        if(error){
            throw error
        }else {
            console.log('IMDB信息写入成功\r\n'+IMDB);
        };
    });
}