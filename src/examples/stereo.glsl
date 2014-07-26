float PI = 3.14159;

float dsp (float t) {
  return sin(t + 0.2 * PI * channel) * (
    mix(0.3, 0.8, channel) * abs(sin(2.0 * PI * t * 55.0))+
    mix(0.3, 0.2, channel) * sin(2.0 * PI * t * 440.0)
  );
}

/**
 This GLSL code is wrapped into a fragment GLSL code which does the encoding 
 and also which provides some uniforms.

Here we used:

 uniform float channel;

 expose the current rendered channel:
 - 0.0 for left
 - 1.0 for right
 - ... potentially more :-)
 */

