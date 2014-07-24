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

var React = require("react");
var UI = require("./ui");
var url = require("url").parse(window.location.href, true);
var createGenerator = require("./createGenerator");
var createWebGLCanvas = require("./createWebGLCanvas");
var examples = require("./examples");
var AudioContext = window.AudioContext || window.webkitAudioContext;

(function basicPoC (){
  var audioContext = new AudioContext();
  var destination = audioContext.createGain(); // The entry node of the GLSL output.
  var filter = audioContext.createBiquadFilter(); // a filter to remove out that noise due to imprecision in GLSL
  filter.type = "notch";
  filter.frequency.value = 11050;
  filter.Q.value = 1.0;
  var compressor = audioContext.createDynamicsCompressor(); // Protect the output sound card with a compressor
  var finalGain = audioContext.createGain(); // Reduce the final destination gain
  finalGain.gain.value = 0.1;
  destination.connect(filter);
  filter.connect(compressor);
  compressor.connect(finalGain);
  finalGain.connect(audioContext.destination);

  var initialGlsl = examples[url.query.example] || examples.hello_world;

  var webGLCanvas = createWebGLCanvas(128, 128);
  var generator = createGenerator(webGLCanvas, audioContext.sampleRate, initialGlsl);

  function onGlslChange (glsl) {
    generator.destroy();
    generator = createGenerator(webGLCanvas, audioContext.sampleRate, glsl);
  }

  function onGlslFailed () {

  }

  function render (currentBuffer) {
    React.renderComponent(UI({
      buffer: currentBuffer,
      bufferWidth: webGLCanvas.canvas.width,
      bufferHeight: webGLCanvas.canvas.height,
      onGlslChange: onGlslChange,
      onGlslFailed: onGlslFailed,
      initialGlsl: initialGlsl
    }), document.body);
  }

  var absoluteBufferTime = 0;
  var nextBufferTime = 0;
  var refreshRate = 0.1;
  var scheduleAdvance = 0.2;
  function schedulingLoop () {
    while (audioContext.currentTime + scheduleAdvance > nextBufferTime) {
      // Render + schedule next chunk
      var bufferSource = audioContext.createBufferSource();
      bufferSource.connect(destination); // FIXME: .disconnect() should be called when audio chunk is finished
      var pixelBuffer = generator(absoluteBufferTime);
      var audioBuffer = audioContext.createBuffer(1, pixelBuffer.length, audioContext.sampleRate);
      audioBuffer.getChannelData(0).set(pixelBuffer);
      bufferSource.buffer = audioBuffer;
      bufferSource.start(nextBufferTime);
      nextBufferTime += audioBuffer.duration;
      absoluteBufferTime += pixelBuffer.length;
      render(pixelBuffer);
    }
    setTimeout(schedulingLoop, 1000*refreshRate);
  }
  schedulingLoop();
  render();
}());

