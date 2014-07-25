float PI = acos(-1.0);
float sine(float t) {
  return sin(2.0 * PI * t * 440.0);
}
float playnote(vec3 adr, vec4 pstv, float t) {
  float t0 = pstv[2];
  float t1 = t0 + adr[0];
  float t2 = t1 + adr[1];
  float t3 = t0 + pstv[1];
  float t4 = t3 + adr[2];
  float p = pstv[0];
  float v = pstv[3];
  if (t < t0) return 0.;
  if (t < t1) return v * smoothstep(t0, t1, t);
  if (t < t2) return v * (p + smoothstep(t2, t1, t) * (1. - p));
  if (t < t3) return v * p;
  if (t < t4) return v * (p * smoothstep(t4, t3, t));
  return 0.;
}

vec2 addnote(vec3 instru, float note, vec3 sdp, vec2 cr, float t) {
  float c = cr[0] + sdp[0];
  float r = playnote(instru, vec4(sdp[2], sdp[1], c, note), t);
  return vec2(c+sdp[1], cr[1]+r);
}

float dsp(float t) {
                  /* attack, decay, release */
  vec3 piano = vec3(.01, .005, .1);
  float note1 = sine(t * 1.);
  float note2 = sine(t * (1. + 1./12.));
  float note3 = sine(t * (1. + 2./12.));

               /* current, result */
  vec2 env = vec2(0., 0.);

                                /* space, delay, power */
  env = addnote(piano, note1, vec3(0., .2, .5), env, t);
  env = addnote(piano, note1, vec3(.2, .2, .5), env, t);
  env = addnote(piano, note1, vec3(.2, .2, .5), env, t);
  env = addnote(piano, note2, vec3(.2, .4, .5), env, t);
  env = addnote(piano, note3, vec3(.3, .4, .5), env, t);
  env = addnote(piano, note2, vec3(.2, .4, .5), env, t);

  return env[1];
}
