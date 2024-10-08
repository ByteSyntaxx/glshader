/* Green Dots */
/* https://glslsandbox.com/e#70624.0 */

#version 460

precision mediump float;

uniform float time;
uniform vec2 resolution;

out vec4 fragmentColor;

void main(void) {
    float time = time;
    vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy) / resolution.y;

    float s = 0.;
    for (float p = 0.; p < 100.; p++) {
        #define R3P 1.22074408460575947536
        vec3 q = fract(.5 + p * vec3(1. / R3P, 1. / (R3P * R3P), 1. / (R3P * R3P * R3P)));
        float a = p * .001 + time * (.02 + q.z * .1);
        vec2 x = q.xy * mat2(sin(a * 2.1), sin(a * 4.13), sin(a * 8.13), sin(a * 4.18));
        float l = length(x - uv.xy);
        s += sin((l - q.z) * 10.) / (1. + max(0., l - .01) * 200.);
    }
    fragmentColor = mix(vec4(.0, .08, .1, 1), vec4(0, .5, .4, 1), max(0., (s * .9) + 0.1));
}