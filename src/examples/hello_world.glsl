float PI = acos(-1.0);
float dsp (float t) {
  return sin(2.0 * PI * t * 440.0);
 // 'return sin(2.0 * PI * t * (100.*t+440.)) + sin(2.5 * PI * t * (t * 110.));'+
}

