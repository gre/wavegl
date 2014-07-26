float PI = 3.14159;

/**
 * dsp: time => sample
 * t: the absolute time in seconds
 * returned value: a sample in [ -1, 1 ] range.
 */
float dsp (float t) {
  return sin(2.0 * PI * t * 440.0); // The most fundamental sound: a sine wave at 440 Hz
}

// Notes:
// DSP (Digital signal processing) is the atomic function of the sound. 
// Here, it is called 44100 times per second.
