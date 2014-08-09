/**
 * This is a complete example of what can be done with WaveGL.
 * It has been written a few hours during the initial hackday.
 */

float PI = acos(-1.0);
float bpm = 126.0;
float bps = bpm / 60.;

// From a MIDI note, returns the frequency
float noteToFreq (float n) {
  return pow(2.0, (n-49.0)/12.0) * 440.0;
}

// Implementation of an ADSR envelope. Fundamental of electronic music.
// See http://en.wikipedia.org/wiki/ADSR_envelope#ADSR_envelope
/*
  adsr parameters:

 - tabs: the absolute current time
 - env: the envelope: vec4(attack, decay, sustain, release)
 - start: the time position where you want to make the envelope start
 - duration: the duration of the note (the duration your finger is pressed on the note)
*/
float adsr(float tabs, vec4 env, float start, float duration) {
  float t = tabs - start;
  float sustain = env[2];
  float t1 = env[0];
  float t2 = t1 + env[1];
  float t3 = max(t2, duration);
  float t4 = t3 + env[3];
  if (t < 0.0 || t > t4) {
    return 0.0;
  }
  else if(t <= t1) {
    return smoothstep(0.0, t1, t);
  } else if(t <= t2) {
    float f = smoothstep(t2, t1, t);
    return sustain + f * (1.0 - sustain);
  } else if(t <= t3) {
    return sustain;
  } else {
    return sustain * smoothstep(t4, t3, t);
  }
}

// This is a way to get random in GLSL. We will use it for the hithat
float rand(float co){
  return fract(sin(dot(vec2(co),vec2(12.9898,78.233))) * 43758.5453);
}

// Sine synth
float sine(float t, float x){
  return sin(2.0 * PI * t * x);
}

// Used to saturate a sound
float sat(float t, float amp) {
  return max(-amp, min(t, amp));
}

// Triangle synth
float tri(float t, float x) {
  return abs(1.0 - mod((2.0 * t * x), 2.0)) * 2.0 - 1.0;
}

// Saw synth
float saw(float t, float x) {
  return fract(2.0 * t * x) * 2.0 - 1.0;
}

// Beat
float beat (float t, float s, float f) {
  // Beat is made out of a triangle synth which suddently drops from a frequency f to 0.0.
  t = min(t, s);
  float r = tri(t, f * smoothstep(2.0*s, 0.0, t));
  return r;
}

// The general synth of used for the melody
float synth (float t, float f) {
  t += mix(0.2, 0.6, channel) * sin(t * 2.0) / f;
  return 0.3 * tri(t, f / 2.0) +
         sat(0.8 * sine(t, f / 4.0 + 0.2), 0.2) +
         0.2 * saw(t, f / 4.0) +
         0.2 * saw(t, f / 4.0 + mix(0.3, 0.2, channel));
}

// the SweetDream melody
float sweetDreamSynth (float t) {
  // C2 C2 C3 C4 d3 d4 C3 C4 g2 g2 g3 C4 G2 G2 G3 C4
  int notes[16];
  notes[0]=24;
  notes[1]=24;
  notes[2]=36;
  notes[3]=48;
  notes[4]=39;
  notes[5]=51;
  notes[6]=36;
  notes[7]=48;
  notes[8]=32;
  notes[9]=32;
  notes[10]=44;
  notes[11]=48;
  notes[12]=31;
  notes[13]=31;
  notes[14]=46;
  notes[15]=48;

  float m = mod(t * bps * 2.0, 16.0);
  float fr = fract(m);
  int section = int(floor(m));
  float sound = 0.0;
  // Adds up all notes together to avoid ticks and allows overlaps
  for (int i=0; i<16; ++i) {
    // Multiply a synth with an envelope and you have one note :-)
    sound += synth(t, (mod(t * bps * 2.0, 32.0) > 16.0 ? 1.0 : 2.0) * noteToFreq(float(notes[i]))) * adsr(m, vec4(0.1, 0.2, 0.7, 0.8), float(i), 0.6);
  }
  // Additive audio <3
  return sound;
}

float dsp(float t) {
  float nobeatsfreq = 6.0;
  return (
    // Sometimes in the song, we stop the beat for a better ambiant
    mod(t * bps * 2.0, nobeatsfreq * 16.0)/16.0 < nobeatsfreq-2.0 ?
    // beat:
    0.6 * beat(mod(t * bps, 2.0), 0.2, 60.0) * mix(0.6, 1.0, channel) +
    // hit hat:
    0.3 * adsr(mod(t * bps, 2.0), vec4(0.02, 0.05, 0.7, 1.0), 1.0, 0.1) * rand(t) * mix(0.8, 1.0, channel) : 0.0
  ) +
    // melody
    0.4 * sweetDreamSynth(t) * mix(1.0, 0.8, channel);
}

