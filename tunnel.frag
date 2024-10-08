/* TunnelShader */
/* https://glslsandbox.com/e#109384.0 */

#version 460

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

out vec4 fragmentColor;

void main(void) {
    vec2 position = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy;
    float th = atan(position.y, position.x) / (2.0 * 3.1415926) + 0.5;
    float dd = length(position);
    float d = 0.25 / dd + time;

    vec3 uv = vec3(th + d, th - d, th + sin(d) * 0.1);
    float a = 0.5 + cos(uv.x * 3.1415926 * 2.0) * 0.5;
    float b = 0.5 + cos(uv.y * 3.1415926 * 2.0) * 0.5;
    float c = 0.5 + cos(uv.z * 3.1415926 * 6.0) * 0.5;
    vec3 color = mix(vec3(1.0, 1.8, 0.9), vec3(0.1, 0.1, 0.2), pow(a, 0.2)) * 0.75;
    color += mix(vec3(0.8, 0.9, 1.0), vec3(0.1, 0.1, 0.2), pow(b, 0.1)) * 0.75;
    color += mix(vec3(0.9, 0.8, 1.0), vec3(0.1, 0.2, 0.2), pow(c, 0.1)) * 0.75;
    fragmentColor = vec4(color * clamp(dd, 0.0, 9.0), 1.0);
}