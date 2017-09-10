const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')
const request = require('request')
const ytdl = require('ytdl-core');
const YOUTUBE_URL = `https://www.youtube.com/watch?v=`


let arr = ['http://www.worldstarhiphop.com/videos/video.php?v=wshh3xxPMf0cS17Csd3s', 
'http://www.worldstarhiphop.com/videos/video.php?v=wshhwrHyvi8uMFw3E576'].forEach((url) => {
	request(url, (err, res) => {
		const $ = cheerio.load(res.body)
		let vidSrc = $('source')
		let iframeEl = $('iframe')
		if(vidSrc.length === 0) {
			downloadYoutubeVideo(iframeEl, $('title').text() || $('h1').text())
		}
		if(vidSrc.length > 0) {
			downloadWorldstarHipVideo(vidSrc, $('title').text() || $('h1').text())
		}
	})
})


function downloadWorldstarHipVideo(sourceEl, title) {
	let sourceElLength = sourceEl.length
	let worldStarUrl;
	for(var i = 0; i < sourceElLength; i++) {
		if(sourceEl[i].attribs['type'] === 'video/mp4') {
			const {src} = sourceEl[i].attribs
			worldStarUrl = src
		} 
	}
	const file = fs.createWriteStream(`${title}.mp4`)
	http.get(worldStarUrl, function(response) {
  	response.pipe(file);
	});
	file.on('close', (err) => {
		console.log(`Done downloading ${title} video`)
	})
}

function downloadYoutubeVideo(iFrameEl, title) {
	let iFrameLength = iFrameEl.length
	let youtubeId;
	for(var i = 0; i < iFrameLength; i++) {
		if(iFrameEl[i].attribs['src'].includes('youtube')) {
			youtubeId = iFrameEl[0].attribs['src'].replace(/(?:http:\/\/www.youtube.com\/embed\/)/, "").split("?")[0]
		}
	}
	const file = fs.createWriteStream(`${title}.mp4`)
	ytdl(`${YOUTUBE_URL}${youtubeId}`, { 
		filter: function(format) { return format.container === 'mp4'; } })
		.pipe(file);
		file.on('close', (err) => {
			console.log(`Done downloading ${title} video`)
		})
}