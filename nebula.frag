/* Nebula */
/* https://glslsandbox.com/e#48330.0 */

#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define iterations 1
#define formuparam2 1.00

#define volsteps 15
#define stepsize 0.7

#define zoom 1.900
#define tile   0.850
#define speed2  0.210

#define brightness 0.5
#define darkmatter 0.400
#define distfading 0.560
#define saturation 0.400


#define transverseSpeed 0.5
#define cloud 0.25


float field(in vec3 p) {
    float strength = 4. + .07 * log(1.e-1 + fract(sin(time) * 5555.0));
    float accum = 0.5;
    float prev = 0.5;
    float tw = 0.5;


    for (int i = 0; i < 6; ++i)
    {
        float mag = dot(p, p);
        p = abs(p) / mag + vec3(-.5, -.8 + 0.1 * sin(time * 0.2 + 2.0), -1.1 + 0.3 * cos(time * 0.15));
        float w = exp(-float(i) / 7.);
        accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
        tw += w;
        prev = mag;
    }
    return max(0., 5. * accum / tw - .7);
}



void main() {

    vec2 uv2 = 2. * gl_FragCoord.xy / resolution.xy - 1.;
    vec2 uvs = uv2 * resolution.xy / max(resolution.x, resolution.y);
    float time2 = time * 1.9;
    float speed = speed2;
    speed = 0.00005 * cos(time2 * 0.02 + 3.1415926 / 4.0);
    float formuparam = formuparam2;
    vec2 uv = uvs;
    float v2 = 1.0;
    vec3 dir = vec3(uv * zoom, 0.25);
    vec3 from = vec3(0.0, 0.0, 0.0);


    from.x -= 0.5 * (-0.5);
    from.y -= 0.5 * (-0.5);


    vec3 forward = vec3(0., 0., 1.);


    from.x += transverseSpeed * (1.0) * cos(0.00001 * time) + 0.00000001 * time;
    from.y += transverseSpeed * (1.0) * sin(0.00001 * time) + 0.00000001 * time;
    from.z += 0.003 * time;


    //zoom
    float zooom = (time2 - 1.) * speed;
    from += forward * zooom;
    float sampleShift = mod(zooom, stepsize);

    float zoffset = -sampleShift;
    sampleShift /= stepsize; // make from 0 to 1

    //volumetric rendering
    float s = 0.15;
    float s3 = s + stepsize / 5.0;
    vec3 v = vec3(0.5);
    float t3 = 0.0;
    vec3 backCol2 = vec3(1, 0, 0);

    for (int r = 0; r < volsteps; r++) {
        vec3 p2 = from + (s + zoffset) * dir;// + vec3(0.,0.,zoffset);
        vec3 p3 = (from + (s3 + zoffset) * dir) * (0.2 / zoom);// + vec3(0.,0.,zoffset);

        p2 = abs(vec3(tile) - mod(p2, vec3(tile * 2.))); // tiling fold
        p3 = abs(vec3(tile) - mod(p3, vec3(tile * 2.))); // tiling fold

        t3 = field(p3);

        float pa, a = pa = 0.;
    for (int i = 0; i< iterations; i++){
    p2 = abs(p2) / dot(p2, p2) - formuparam; // the magic formula
    float D = abs(length(p2) - pa); // absolute sum of average change

    if (i > 2){
    a += i > 7 ? min(12., D): D;
    }
    pa = length(p2);
    }


    a*=a * a;

    float s1 = s+ zoffset;
    float fade = pow(distfading,max(0., float(r) - sampleShift));
    v+=fade;

    // fade out samples as they approach the camera
    if (r == 0)
    fade *= (1. - (sampleShift));
    // fade in samples as they approach from the distance
    if (r == volsteps - 1 )
    fade *= sampleShift;
    v+=vec3(s1, s1 * s1, s1 * s1 * s1* s1) * a * brightness * fade; // coloring based on distance
    backCol2 += mix(.4, 1., v2) * vec3(0.20 * t3 * t3 * t3, 0.4 * t3 * t3, t3 * 0.7) * fade;
    s+=stepsize;
    s3 += stepsize;

    }


    backCol2 *= cloud;
    backCol2.r *= 0.35;
    backCol2.g *= 0.55;
    backCol2.b *= 0.75;

    vec4 forCol2 = vec4(v * .01, 1.);
    gl_FragColor = vec4(backCol2, 1.0);

}
