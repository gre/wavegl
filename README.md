wavegl
======

Generate Audio in the GPU and stream to the Audio Card.

WebGL + Web Audio API.

JS Libraries:
- [gl-shader](https://npmjs.org/package/gl-shader)
- [lodash](https://npmjs.org/package/lodash)
- [React](https://npmjs.org/package/react)

Some code taken from [GLSL.io](https://glsl.io).

The idea
---

- We can **implement a DSP function in a GLSL Fragment**. A texture will package a buffer of DSPs calls.
- The DSP signal must be **encoded in a scanline direction**: colors, left-right, top-bottom,
- Then we can just use the buffer of the texture as an audio chunk:
We just have to **schedule this buffer with Web Audio API**.
- Then, we just do this **loop again each second** :-)

> A 105 x 105 image is enough to code 1 second of audio *(1-channel, 44100Hz, 8bit-samples)*.
Rendering a 105x105 image each second is nothing :-)

Proof of Concept
---

WebGL uses **GLSL language**: a C-like, but with high level types and math functions.

https://www.khronos.org/registry/webgl/specs/latest/1.0/#readpixels
```javascript
function readPixels (gl, width, height) {
  var pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels;
}
```

http://www.w3.org/TR/webaudio/
```javascript
var audioCtx = new AudioContext();
var playTime = audioCtx.currentTime;
var bufferSource = context.createBufferSource();
bufferSource.buffer = pixels;
bufferSource.start(time);
setInterval(function schedulingLoop () {
  if (endOfTheScheduledAudioIsSoon()) {
    scheduleNext();
  }
}, 100);
```
See also https://github.com/gre/zampling/blob/master/src/utils/AudioChunker.js

**Notes:**
- The GLSL code will have to encode the image in order that it respect the readPixels order:
RGBA, left to right, top to bottom. Then we can just plug this into the **Audio Card** !!
- Render one frame in the GPU is very fast.
- a texture of 105x105 is enough to generate 1 second of sound. (44100 samples – 105x105x4)


Then we can make a wrapper to only have to implement this:
```glsl
const float PI = acos(-1.0)
float dsp (float t) {
  return 0.1 * sin(2.0 * PI * t * 440); // Hello world of the audio
}
```

About "Functional Audio"
---

**"Functional Audio"** is a low level way to generate music,
quite different from **Web Audio API** paradigm (modular audio).

```scala
dsp: (t: Number) => (sample: Float)
```

> **`t`: absolute time in seconds**.

> **`sample`: value from -1.0 to 1.0**. Amplitude of the sound.

This function is called **44'100 times per second**!

It is:
- Generative audio.
- Low Level.
- Pure Math.

The team
---

- @dohzya
- @c4m
- @guyonvarch
- @gre

Bootstraped in Hackday @zengularity

License
---

AGPLv3

Build the project
---

First time:
```
npm install
```

Then:
```
npm run build
```

Then open `index.html`.

Watch loop for development:
---

```
npm run watch
```
