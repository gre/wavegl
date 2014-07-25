float PI = acos(-1.0);

float bpm = 126.0;


float bps = bpm / 60.;

float noteToFreq (float n) {
  return pow(2.0, (n-49.0)/12.0) * 440.0;
}

float sweetDreamFreq (float t) {
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
  notes[14]=43;
  notes[15]=48;

  int section = int(mod(t * bps, 16.0));
  for (int i=0; i<16; ++i) {
    if (i==section) {
      return noteToFreq(float(notes[i]));
    }
  }
}

float sat (float t, float amp) {
  return max(-amp, min(t, amp));
}

float synth (float t, float f) {
  return 0. * sin(2.0 * PI * t * 2.0) + 
    sat(0.6 * sin(2.0 * PI * t * f), 0.55);
}

float dsp(float t) {
return synth(t, sweetDreamFreq(t));
}
