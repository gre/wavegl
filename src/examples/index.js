
var fs = require("fs");

module.exports = {
  hello_world: fs.readFileSync(__dirname+"/hello_world.glsl", 'utf8'),
  stereo: fs.readFileSync(__dirname+"/stereo.glsl", 'utf8'),
  sweet_dream: fs.readFileSync(__dirname+"/sweet_dream.glsl", 'utf8'),
  bassrythm: fs.readFileSync(__dirname+"/bassrythm.glsl", 'utf8'),
  subwah: fs.readFileSync(__dirname+"/subwah.glsl", 'utf8'),
  evo: fs.readFileSync(__dirname+"/evo.glsl", 'utf8'),
  mario: fs.readFileSync(__dirname+"/mario.glsl", 'utf8')
};
