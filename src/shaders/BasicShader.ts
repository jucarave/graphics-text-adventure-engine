export const basicShader = {
  'vertexShader': `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;

    varying vec2 vTexCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelMatrix * vec4(aPosition, 1.0);
      vTexCoord = aTexCoord;
    }
  `,

  'fragmentShader': `
    precision mediump float;
    
    uniform sampler2D uTexture;

    varying vec2 vTexCoord;

    void main() {
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }
  `
};