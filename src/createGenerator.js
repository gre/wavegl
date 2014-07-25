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

var createShader = require("gl-shader")

// Wrap the dsp function glsl code with wrapper to properly encode the audio samples buffer
function glslAudioWrapper (glslCodeWithDspFunction) {
  return '#ifdef GL_ES\nprecision highp int;precision highp float;\n#endif\n'+
    'uniform vec2 resolution;'+
    'uniform float bufferTime;'+
    'uniform float sampleRate;'+
    glslCodeWithDspFunction+
    'void main () {'+
      'float t = bufferTime + 4.*(gl_FragCoord.y * resolution.x + gl_FragCoord.x) / sampleRate;'+
      'vec4 r = vec4(dsp(t),dsp(t+1.0), dsp(t+2.0), dsp(t+3.0));'+ // rgba vector contains 4 samples
      'gl_FragColor = (r+1.0)/2.0;'+ // normalize to [ 0, 1 ] to get a color representation
    '}';
}

// Basic square vertex (2 triangles)
var VERT_SHADER = 'precision highp int;precision highp float;attribute vec2 position; void main() { gl_Position = vec4(2.0*position-1.0, 0.0, 1.0);}';
// Create a generator from a "webglcanvas", a sampleRate and a GLSL Code containing a dsp function
function createGenerator (webGLCanvas, sampleRate, glslCodeWithDspFunction) {
  var canvas = webGLCanvas.canvas;
  var gl = webGLCanvas.gl;
  var fragShader = glslAudioWrapper(glslCodeWithDspFunction);

  // Create and bind the shader
  var shader = createShader(gl, VERT_SHADER, fragShader);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  shader.attributes.position.pointer();
  shader.bind();
  
  // Sync the viewport size
  var w = canvas.width, h = canvas.height;
  gl.viewport(0, 0, w, h);
  shader.uniforms.resolution = new Float32Array([ w, h ]);
  shader.uniforms.sampleRate = sampleRate;
  var x1 = 0, x2 = w, y1 = 0, y2 = h;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]), gl.STATIC_DRAW);

  // Returns a generate function which returns the pixel buffer of the canvas from a given bufferTime
  function generate (bufferTime, optionalBuffer) {
    var buffer = optionalBuffer || new Uint8Array(w * h * 4);
    shader.uniforms.bufferTime = bufferTime / sampleRate;
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    return buffer;
  };
  generate.destroy = function () {
    shader.dispose();
  };
  return generate;
}

module.exports = createGenerator;
