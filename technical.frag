/* Technical */
/* https://glslsandbox.com/e#55422.7 */

#version 460

precision mediump float;

uniform float time;
uniform vec2 resolution;

out vec4 fragmentColor;

float rand(float n)
{
	float fl = floor(n);
	float fc = fract(n);
	return mix(fract(sin(fl)), fract(sin(fl + 1.0)), fc);
}

vec2 rand2(in vec2 p)
{
	return fract(
		vec2(
			sin(p.x * 1.32 + p.y * 54.077),
			cos(p.x * 91.32 + p.y * 9.077)
		)
	);
}

float voronoi(in vec2 v, in float e)
{
	vec2 p = floor(v);
	vec2 f = fract(v);
	
	vec2 res = vec2(8.0);
	
	for(int j = -1; j <= 1; ++j)
		for(int i = -1; i <= 1; ++i)
		{
			vec2 b = vec2(i, j);
			vec2 r = b - f + rand2(p + b);
			
			float d = max(abs(r.x), abs(r.y));
			
			if(d < res.x)
			{
				res.y = res.x;
				res.x = d;
			}
			
			else if(d < res.y)
			{
				res.y = d;
			}
		}
	
	vec2 c = sqrt(res);
	float dist = c.y - c.x;
	
	return 1.0 - smoothstep(0.0, e, dist);
}

mat2 rotate(in float a)
{
	return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main(void)
{
	vec2 uv =  gl_FragCoord.xy / resolution * 4.0 - 2.0;
	uv.y *= resolution.y / resolution.x;
	uv *= rotate(0.3);
	
	float value = 0.0;     
	float light = 0.0;
	
	float f = 1.0;
	float a = 0.7;
	
	
	for(int i = 0; i < 3; ++i)
	{
		float v1 = voronoi(uv * f + 1.0 + time * 0.2 , 0.1);
		v1 = pow(v1, 2.0);
		value += a * rand(v1 * 5.5 + 0.1);
		
		float v2 = voronoi(uv * f * 1.5 + 5.0 + time, 0.2) * 1.1;
		v2 = pow(v2, 5.0);
		light += pow(v1 * (0.5 * v2), 1.5);
		
		f *= 2.0;
		a *= 0.6;
	}
	
	vec3 color;
	color += vec3(1.0, 0.5, 1.0) * value;
	color += vec3(1.0, 0.5, 1.0) * light;
	
	fragmentColor = vec4(color, 1.0);
}