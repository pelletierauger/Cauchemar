newFlickering.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
void main(void) {
        gl_Position = vec4(coordinates.x - 1., coordinates.y - 1., 0.0, 1.);
        // gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
            // gl_Position.xy *= 2.;
        float n = noise(gl_Position.xy);
        // gl_Position.y += tan(n * 100. * 1e2 + alph) * 0.0009 * 2.;
        // gl_Position.x += tan(alph * 1e4) * 10.5;
    // gl_Position.xy += vec2(cos(n * 1.), sin(n * 1.)) * 0.1;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = (9. + coordinates.z / ((6.0 + alph) * 0.25)) * alph * 2.5;
        // float vig = (roundedRectangle(gl_Position.xy, vec2(0.0, 0.0), vec2(0.905, 0.87) * 0.99, 0.05, 0.5) + 0.0);
        float vig = (roundedRectangle(myposition, vec2(0.0, 0.0), vec2(1.95, 1.9) * 0.5, 0.001, 0.05));
        gl_PointSize *= vig;                // cols = mix(cols, cols * floor(vig), 1.);
    // gl_PointSize *= floor(vig) * resolution * 2.;
            // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
newFlickering.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // vec2 uv = gl_PointCoord.xy / vec2(1600, 1600);
        // float d = length(uv - center);
        // vec2 pos = myposition;
        vec2 uv = gl_FragCoord.xy / vec2(2560, 1600);
        // uv.x = uv.x + 1.0;
        uv = uv * 2.0;
        uv = uv + 0.5;
        // uv = uv * 1.0;
        float ALPHA = 0.75;
        vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
                float dist_squared = dot(pos, pos);
        float alpha;
        if (dist_squared < 0.25) {
            alpha = ALPHA;
        } else {
            alpha = 0.0;
        }
        alpha = smoothstep(0.015 / (0.9 + alph), 0.000125, dist_squared) * 0.49;
        float rando = rand(pos);
        // gl_FragColor = vec4(1.0, (1.0 - dist_squared * 40.) * 0.6, 0.0, alpha + ((0.12 - dist_squared) * 4.) - (rando * 0.2));
        gl_FragColor = vec4(1.0, 0.2 - dist_squared, 0.0 + alpha * 120., ((3. - dist_squared * 24.0 * (0.25 + alph) - (rando * 4.1)) * 0.045 + alpha)) * 1.25;
        // gl_FragColor = vec4(1.0);
        gl_FragColor.rgb *= 0.25;
        
        
    }
    // endGLSL
`;
newFlickering.init();