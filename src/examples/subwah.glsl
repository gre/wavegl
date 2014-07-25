float PI = acos(-1.0);
float tau = 2.0 * PI;


float sub(float wave, float mul, float t){
  return sin(wave * mul + tau * t);
}

float sine(float x, float t){
  return sin(tau * t * x);
}

float tri(float x, float t){
  return abs(1.0 - mod((2.0 * t * x), 2.0)) * 2.0 - 1.0;
}


float dsp(float t){
  float n = 44000.0 / 341.5;

  float bass_osc =
    0.8 * tri(n/3.0, t)
  + 0.05 * sine(n*2.0, t)
  ;

  float lfo = sine(0.18, t);
  float lfo_mul = sine(0.04, t);
  float bass_sub =
    0.8 * sub(bass_osc, 2.0 + ((1.0 + lfo) * (2.0 + (1.0 + lfo_mul) * 12.0) ), t)
  + 0.7 * sine(n, t)
  ;

  return 0.4 * bass_sub;
}