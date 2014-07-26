float PI = acos(-1.0);

float dsp (float t) {
  return mix(0.2, 0.4, channel)*sin(2.0 * PI * t * (100.*t+440.)) +
         mix(0.3, 0.2, channel)*sin(2.5 * PI * t * (t * 110.));
}

