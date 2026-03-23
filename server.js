const express = require("express");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));
const cors = require("cors");
const cheerio = require("cheerio");

const app = express();

app.use(cors());

const CLIENT_ID = "GZhxwJOsgvNSSjUVwvjx";
const CLIENT_SECRET = "cEHCSrjzzP";

app.get("/naver-news", async (req,res)=>{

try{

const query = encodeURIComponent("방탄소년단 지민");

const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=95&sort=date`;

const response = await fetch(url,{
headers:{
"X-Naver-Client-Id": CLIENT_ID,
"X-Naver-Client-Secret": CLIENT_SECRET
}
});

const data = await response.json();

const newsWithImages = await Promise.all(
data.items.map(async (item)=>{

let image = "";

try{

const page = await fetch(item.link);
const html = await page.text();

const $ = cheerio.load(html);

image = $('meta[property="og:image"]').attr("content") || "";

}catch(e){
image = "";
}

return {
title: item.title,
link: item.link,
pubDate: item.pubDate,
image: image
};

})
);

res.json(newsWithImages);

}catch(err){

console.log(err);
res.status(500).json({error:"API error"});

}

});

app.listen(3000,()=>{
console.log("Server running: http://localhost:3000");
});
