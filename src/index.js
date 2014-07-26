/*
 * This file is part of wavegl: https://github.com/gre/wavegl
 *
 * Copyright 2014 Zengularity
 *
 * wavegl is free software: you can redistribute it and/or modify
 * it under the terms of the AFFERO GNU General Public License as published by
 * the Free Software Foundation.
 *
 * wavegl is distributed "AS-IS" AND WITHOUT ANY WARRANTY OF ANY KIND,
 * INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY,
 * NON-INFRINGEMENT, OR FITNESS FOR A PARTICULAR PURPOSE. See
 * the AFFERO GNU General Public License for the complete license terms.
 *
 * You should have received a copy of the AFFERO GNU General Public License
 * along with wavegl.  If not, see <http://www.gnu.org/licenses/agpl-3.0.html>
 */

var React = window.React = require("react");
var _ = require("lodash");
var UI = require("./ui");
var createGenerator = require("./createGenerator");
var createWebGLCanvas = require("./createWebGLCanvas");
var examples = require("./examples");
var url = require("url").parse(window.location.href, true);
var AudioContext = window.AudioContext || window.webkitAudioContext;

var BUFFER_WIDTH = 128;
var BUFFER_HEIGHT = 64;

(function main (){
  var audioContext = new AudioContext();
  var destination = audioContext.createGain(); // The entry node of the GLSL output.
  var compressor = audioContext.createDynamicsCompressor(); // Protect the output sound card with a compressor
  var finalGain = audioContext.createGain(); // Reduce the final destination gain
  finalGain.gain.value = 0.6;
  destination.connect(compressor);
  compressor.connect(finalGain);
  finalGain.connect(audioContext.destination);

  var currentSound = url.query.example || "hello_world";
  var initialGlsl = examples[currentSound];

  var webGLCanvas = createWebGLCanvas(BUFFER_WIDTH, BUFFER_HEIGHT);
  var generator;
  try {
    generator = createGenerator(webGLCanvas, audioContext.sampleRate, initialGlsl);
  }
  catch (e) {
    console.error(e);
  }

  ////// STATES
  var buffers = [];
  var absoluteBufferTime = 0; // The current farest computed time we was able to bufferize
  var absoluteAudioTime = 0; // The web audio API absolute time which corresponds to the absoluteBufferTime
  //////

  function onGlslChange (glsl) {
    buffers.forEach(function (buffer) {
      if (buffer) buffer.destroy();
    });
    buffers = [];
    if (generator) generator.destroy();
    generator = createGenerator(webGLCanvas, audioContext.sampleRate, glsl);
    absoluteAudioTime = audioContext.currentTime;
    absoluteBufferTime = Math.floor(absoluteAudioTime * audioContext.sampleRate);
    setTimeout(scheduleNext, 0);
  }

  function onGlslFailed () {

  }

  var appNode = document.getElementById("app");
  function render (currentTime) {
    var width = 800;
    var height = window.innerHeight;
    React.renderComponent(UI({
      currentSound: currentSound,
      width: width,
      height: height,
      buffers: buffers,
      bufferWidth: webGLCanvas.canvas.width,
      bufferHeight: webGLCanvas.canvas.height,
      onGlslChange: onGlslChange,
      onGlslFailed: onGlslFailed,
      initialGlsl: initialGlsl,
      currentTime: currentTime||0
    }), appNode);
  }

  function schedule (bufferTime, audioTime) {
    // Render + schedule next chunk
    var bufferSource = audioContext.createBufferSource();
    bufferSource.connect(destination);
    var pixelBuffer = generator(bufferTime, 0);
    var audioBuffer = audioContext.createBuffer(2, pixelBuffer.length, audioContext.sampleRate);
    audioBuffer.getChannelData(0).set(pixelBuffer);
    generator(bufferTime, 1, pixelBuffer); // reuse the same buffer
    audioBuffer.getChannelData(1).set(pixelBuffer);
    bufferSource.buffer = audioBuffer;
    bufferSource.start(audioTime);
    
    var item = {
      data: pixelBuffer,
      width: BUFFER_WIDTH,
      height: BUFFER_HEIGHT,
      bufferTime: bufferTime,
      destroy: function () {
        bufferSource.disconnect(destination);
      }
    };
    buffers.push(item);

    return {
      nextBuffer: bufferTime + pixelBuffer.length,
      nextAudioTime: audioTime + audioBuffer.duration
    };
  }

  function scheduleNext () {
    var res = schedule(absoluteBufferTime, absoluteAudioTime);
    absoluteBufferTime = res.nextBuffer;
    absoluteAudioTime = res.nextAudioTime;
  }

  var refreshRate = 0.1;
  var scheduleAdvance = 8;
  (function updateLoop () {
    // Clean outdated buffers
    buffers = _.filter(buffers, function (buffer) {
      if (buffer.bufferTime + buffer.data.length < Math.floor(audioContext.currentTime * audioContext.sampleRate)) {
        buffer.destroy();
        return false;
      }
      return true;
    });

    if (generator && audioContext.currentTime + scheduleAdvance > absoluteAudioTime) {
      scheduleNext();
    }

    setTimeout(updateLoop, 1000*refreshRate);
  }());

  (function renderLoop () {
    render(Math.floor(audioContext.currentTime * audioContext.sampleRate));
    window.requestAnimationFrame(renderLoop);
  }());

}());

