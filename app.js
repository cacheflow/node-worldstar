const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio')
const req = require('request')
const request = require('request-promise')
const ytdl = require('ytdl-core');

const getVideoFromIframe = (iframe) => {
	for(let key in iframe) {
		if(iframe[key].hasOwnProperty('attribs')) {
			const {attribs} = iframe[key]
			if(attribs.src.includes('youtube')) {
				return attribs.src.replace(/embed/, 'watch')
			}
		}
	}
}

const validVideoFmts = (fmt) =>  ["mov", "mpeg4", "mp4", "avi", "wmv", "mpegps", "flv", "3gpp", "webm"]

async function downloadVideo(videoUrl) {
	try {
		const urlRegex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
		const containsWorldStar = videoUrl.includes('worldstarhiphop');
		const validUrl = urlRegex.test(videoUrl) 
		const isString = typeof videoUrl === 'string' && videoUrl.constructor === String
		if(validUrl && containsWorldStar && isString) {
			const data = await request(videoUrl)
			const $ = cheerio.load(data)
			const video = $('source')
			const iframe = $('iframe')
			const title = $('title').text()
			const videoSrc = video.attr('src') !== undefined ? video.attr('src') : getVideoFromIframe(iframe)
			const videoExtension = videoSrc.split('.').pop()
			let setVideoExtension = validVideoFmts(videoSrc).includes(videoExtension) ? videoExtension : 'mp4'
			const file = fs.createWriteStream(`${title}.${setVideoExtension}`)
			if (videoSrc.includes('youtube')) {
				ytdl(videoSrc).pipe(file)
			}
			else {
				req
  			.get(videoSrc)
  			.on('error', ((err) => { 
  				throw new Error(err)
  			}))
  			.pipe(file)
			}
			file.on('finish', () => console.log(`Finish downloading ${title}`))
		}
		else {
			throw new Error('Not a valid url.')
		}
	}
	catch(e) {
		return e
	}

}
const nodeWorldstar = downloadVideo
module.exports = nodeWorldstar
