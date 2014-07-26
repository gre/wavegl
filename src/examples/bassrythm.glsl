float PI = acos(-1.0);
float dsp(float t) {
  return sin(2.0 * PI * t *floor(mod(t, 2.0) + pow(2.0, floor(mod(t*2.0, 2.0))))) + (
    mix(0.8, 0.4, channel) * sin(2.0 * PI * t * (220.0)) +
    mix(0.2, 0.6, channel) * sin(2.0 * PI * t * (440.0/(1.0+floor(pow(2.0, 0.5*mod(t/4.0, 4.0))))))
  );
}
