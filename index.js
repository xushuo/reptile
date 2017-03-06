/**
 * Created by Administrator on 2017/3/6.
 */
var cheerio = require('cheerio');
var superagent = require('superagent-charset');
var iconv = require('iconv-lite');
var request = require('superagent');
var fs = require('fs');
var file='topten.js';
var url = 'http://bbs.byr.cn/rss/topten';
var toptens = [];//初始化json数组
superagent(request);
request.get(url) //获取网页内容
    .charset('gb2312') //转码-gb2312格式转成utf-8
    .end(function(err,res){
        //常规的错误处理
        if(err){
            return next(err);
        }
        var $ = cheerio.load(res.text,{
            xmlMode:true //由于从rss里读取xml，所以这一步一定要用
        });
        var d =new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate());//取得爬取的日期
        var topten ={ //设定爬取的json数组
            date:date,
            info:[]
        };
        //具体爬取内容，主要都是cheeio操作
        $('item').each(function(i,el){
            i+=1;
            topten.info.push({
                topno:i,
                title:$(this).find('title').text(),
                author:$(this).find('author').text(),
                pubDate:$(this).find('pubDate').text(),
                boardName:$(this).find('guid').text().replace(/http:\/\/bbs.byr.cn\/article\//,'').replace(/\/\d+/,'').trim(),
                link:$(this).find('link').text(),
                content:$(this).find('description').text()
            });
        });
        toptens.unshift({topten:topten});//从原有的json数据之前追加json数据
        var json = JSON.stringify(toptens);//从json格式解析
        fs.writeFile(file,json,'utf-8',function(err){
            if(err){
                throw err
            }else {
                console.log('JSON写入成功\r\n'+json);
            }
        })
    })