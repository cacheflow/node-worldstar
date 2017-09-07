const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')
const request = require('request')

request('http://www.worldstarhiphop.com/videos/video.php?v=wshhuEi723eo7GE9i204', (err, res) => {
	const $ = cheerio.load(res.body)
	let vid = $('video').children()
	let foundVideoSrc; 
	for(var key in vid) {
		let keyIsInt = Number.isInteger(parseInt(key))
		if(keyIsInt && vid[key].attribs['type'] === 'video/mp4') {
			foundVideoSrc = vid[key].attribs['src']
		}
	}
	const file = fs.createWriteStream("another.mp4")
	http.get(foundVideoSrc, function(response) {
  	response.pipe(file);
	});
})