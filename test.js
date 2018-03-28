const assert = require('assert');
const chai = require('chai')
const expect = chai.expect
const should = require('chai').should();
const mocha = require('mocha')
const chaiStream = require('chai-stream');
chai.use(chaiStream);
const nodeWorldstar = require('./dist/index.js')
const path = require('path');
const fs = require('fs')

describe('nodeWorldstar function', function() {

  it('should throw an error when a user passes an invalid url', function() {
    let err = "Not a valid url."
    let func = nodeWorldstar("//https://dsxassadsds")
    let arr = nodeWorldstar(["//https://dsxassadsds"])
    arr.then(res => res).catch(e => expect(e).to.throw(Error, err))
    func.then(res => res).catch(e => expect(e).to.throw(Error, err))
  })

  it('should save the video file locally', function() {
    let stream = nodeWorldstar("https://worldstarhiphop.com/videos/video.php?v=wshhElYoXNmm1rNR0h33")
    let fPath = path.resolve('./Steph & Ayesha Curry Cook On Ellen! | Video .mp4')
    let isCreated = fs.existsSync(fPath, (res) => res)
    return expect(isCreated).to.be.equal(true)
  });
})
 