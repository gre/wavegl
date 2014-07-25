
float PI = acos(-1.0);

float noteToFreq (float n) {
  return pow(2.0, (n-49.0)/12.0) * 440.0;
}

float adsr(float tabs, vec4 env, float start, float duration) {
  float t = tabs - start;
  float sustain = env[2];
  float t1 = env[0];
  float t2 = t1 + env[1];
  float t3 = t2 + duration;
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

float sat (float t, float amp) {
  return max(-amp, min(t, amp));
}

float sine(float t, float freq) {
  return sin(2.0 * PI * t * freq);
}
float dsp(float t) {
  return adsr(t, vec4(0.1, 0.2, 0.7, 0.9), 0.1, 0.4) * sine(t, 440.);
}

/*
float square (float t, float freq) {
  return sine(t, freq) < 0.0 ? -1.0 : 1.0;
}
float dsp (float t) {
  return adsr(t, vec4(0.2, 0.1, 0.7, 1.0), 1.0, 0.5) * sine(t, 110.0 * floor(pow(2.0, mod(t * 2.0, 3.0))));
}
*/
