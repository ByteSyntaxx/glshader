/* Aurora */
/* https://glslsandbox.com/e#108577.0 */

#version 460

precision mediump float;

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

out vec4 fragmentColor;

float hash(float n) {
    return fract(sin(n) * 78757.5757 + cos(n) * 71767.8727);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash(i.x + hash(i.y)), hash(i.x + 1.0 + hash(i.y)), u.x),
               mix(hash(i.x + hash(i.y + 1.0)), hash(i.x + 1.0 + hash(i.y + 1.0)), u.x), u.y);
}

vec3 auroraLayer(vec2 uv, float speed, float intensity, vec3 color) {
    float t = time * speed;
    vec2 scaleXY = vec2(2.0, 2.0);
    vec2 movement = vec2(2.0, -2.0);
    vec2 p = uv * scaleXY + t * movement;
    float n = noise(p + noise(color.xy + p + t));
    float aurora = smoothstep(0.0, 0.1, n - uv.y) * (1.0 - smoothstep(0.0, 0.5, n - uv.y));

    return aurora * intensity * color;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.x *= resolution.x / resolution.y;

    vec3 color = vec3(0.0);

    color += auroraLayer(uv, 0.05, 0.3, vec3(0.0, 0.2, 0.3));
    color += auroraLayer(uv, 0.1, 0.4, vec3(0.1, 0.5, 0.9));
    color += auroraLayer(uv, 0.15, 0.3, vec3(0.2, 0.1, 0.8));
    color += auroraLayer(uv, 0.07, 0.2, vec3(0.2, 0.1, 0.6));

    vec3 skyColor1 = vec3(0.2, 0.0, 0.4);
    vec3 skyColor2 = vec3(0.15, 0.2, 0.35);
    // Add a gradient to simulate the night sky
    color += skyColor2 * (1.0 - smoothstep(0.0, 2.0, uv.y));
    color += skyColor1 * (1.0 - smoothstep(0.0, 1.0, uv.y));

    fragmentColor = vec4(color, 2.0);
}