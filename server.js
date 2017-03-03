/**
 * Created by Administrator on 2017/3/3.
 * 爬虫小测
 * 爬取豆瓣电影指定电影页的相应信息（例如，导演名，电影名，主演名，时长，类型，评分，人数等等）。
 */
var cheerio = require('cheerio');
var request = require('sync-request');
var fs = require('fs');
var url = 'http://movie.douban.com/subject/25724855/';
var html = '';
html = request('GET',url).getBody().toString();
//console.log(html);
handleDB(html);
function handleDB(html){
    var $= cheerio.load(html);
    var info = $("#info");
    //获得电影名
    var movieName = $("#content>h1>span").filter(function(i,el){
        return $(this).attr('property') ==='v:itemreviewed';
    }).text();
    //获取影片导演名
    var directories = '- 导演: ' + $("#info span a").filter(function(i,el){
            return $(this).attr('rel') === 'v:directedBy';
        }).text();
    console.log(movieName+directories);
    //获取影片演员
    var starName = '- 主演: ';
    $('.actor .attrs a').each(function(i,el){
        starName += $(this).text()+'/';
    })
    //获取片长
    var runTime = '- 片长: '+$("#info span").filter(function(i,el){
            return $(this).attr('property')==='v:runtime';
        }).text();
    //获取影片类型
    var kind = $("#info span").filter(function(i,el){
        return $(this).attr("property")==='v:genre';
    }).text();

}