float PI = acos(-1.0);
float sine(float f, float t) {
  return sin(2. * PI * t * f);
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

float note(float n) {
 return pow(2.0, (n-49.0)/12.0) * 440.0;
}

vec2 addnote(vec3 instru, float n, vec3 sdp, vec2 cr, float t) {
  float c = cr[0] + sdp[0];
  float r = playnote(instru, vec4(sdp[2], sdp[1], c, n), t);
  return vec2(c+sdp[1], cr[1]+r);
}

float dsp(float t) {
  vec3 piano = vec3(.01, .005, .1); /* attack, decay, release */
  // vec2 env = vec2(0., 0.); /* current, result */
                                            /* space, delay, power */
  // env = addnote(piano, sine(note(53.), t), vec3(.2, .1, .5), env, t);
  // env = addnote(piano, sine(note(53.), t), vec3(.1, .1, .5), env, t);
  // env = addnote(piano, sine(note(53.), t), vec3(.2, .1, .5), env, t);
  // env = addnote(piano, sine(note(51.), t), vec3(.2, .1, .5), env, t);
  // env = addnote(piano, sine(note(53.), t), vec3(.5, .1, .5), env, t);
  // env = addnote(piano, sine(note(55.), t), vec3(.5, .1, .5), env, t);
  // env = addnote(piano, sine(note(48.), t), vec3(.10, .1, .5), env, t);

  // env = addnote(piano, sine(note(51.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(48.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(46.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(49.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(50.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(50.), t), vec3(.5, .05, .5), env, t);
  // env = addnote(piano, sine(note(49.), t), vec3(.2, .05, .5), env, t);

  // return env[1];

  return (
    playnote(piano, vec4(.7, .1, 2., sine(note(53.), t)), t)
  + playnote(piano, vec4(.7, .1, 2.2, sine(note(53.), t)), t)
  + playnote(piano, vec4(.7, .15, 2.5, sine(note(53.), t)), t)
  + playnote(piano, vec4(.5, .1, 2.8, sine(note(51.), t)), t)
  + playnote(piano, vec4(.5, .1, 3., sine(note(53.), t)), t)
  + playnote(piano, vec4(.5, .1, 3.4, sine(note(55.), t)), t)
  + playnote(piano, vec4(1., .1, 4.1, sine(note(49.), t)), t)

  + playnote(piano, vec4(.5, .1, 4.7, sine(note(51.), t)), t)
  + playnote(piano, vec4(.5, .1, 5.2, sine(note(48.), t)), t)
  + playnote(piano, vec4(.5, .1, 5.5, sine(note(46.), t)), t)
  + playnote(piano, vec4(.5, .05, 6., sine(note(49.), t)), t)
  + playnote(piano, vec4(.5, .05, 6.3, sine(note(50.), t)), t)
  + playnote(piano, vec4(.5, .05, 6.6, sine(note(50.), t)), t)
  + playnote(piano, vec4(.5, .05, 6.8, sine(note(49.), t)), t)

  // + playnote(piano, vec4(.5, .05, 7., sine(note(48.), t)), t)
  // + playnote(piano, vec4(.5, .05, 7.2, sine(note(53.), t)), t)
  // + playnote(piano, vec4(.5, .05, 7.4, sine(note(55.), t)), t)
  // + playnote(piano, vec4(.5, .05, 7.6, sine(note(56.), t)), t)
  // + playnote(piano, vec4(.5, .05, 7.8, sine(note(54.), t)), t)
  // + playnote(piano, vec4(.5, .05, 8., sine(note(55.), t)), t)

  );

}
