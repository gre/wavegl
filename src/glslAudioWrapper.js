

module.exports = 
// Wrap the dsp function glsl code with wrapper to properly encode the audio samples buffer
function glslAudioWrapper (glslCodeWithDspFunction) {
  return '#ifdef GL_ES\nprecision highp int;precision highp float;\n#endif\n'+
    'uniform vec2 resolution;'+
    'uniform float bufferTime;'+
    'uniform float sampleRate;'+
    'uniform float channel;'+
    glslCodeWithDspFunction+
    'void main () {'+
      'float t = bufferTime + 4.*(gl_FragCoord.y * resolution.x + gl_FragCoord.x) / sampleRate;'+
      'vec4 r = vec4(dsp(t),dsp(t+1.0/sampleRate), dsp(t+2.0/sampleRate), dsp(t+3.0/sampleRate));'+ // rgba vector contains 4 samples
      'gl_FragColor = (r+1.0)/2.0;'+ // normalize to [ 0, 1 ] to get a color representation
    '}';
};
