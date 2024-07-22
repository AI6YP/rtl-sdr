'use strict';

const shaderer = (kind, src) => gl => {
  const vShader = gl.createShader(gl[kind]);
  gl.shaderSource(vShader, src);
  gl.compileShader(vShader);
  return vShader;
};

const vertexShaderScalar = shaderer('VERTEX_SHADER', `\
#version 300 es
in uvec2 pos;
out vec4 v_color;
uniform vec4 color;
uniform vec2 scale;
uniform vec2 offset;
void main() {
  v_color = color;
  gl_Position = vec4(
    float(pos.x) * scale.x + offset.x,
    float(pos.y) * scale.y + offset.y,
    1,
    1
  );
}
`);

const fragmentShader = shaderer('FRAGMENT_SHADER', `\
#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 myOutputColor;
void main() {
  myOutputColor = v_color;
}
`);

const initProgramScalar = gl => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShaderScalar(gl));
  gl.attachShader(program, fragmentShader(gl));
  gl.linkProgram(program);

  const res = {
    program,
    pos: gl.getAttribLocation(program, 'pos'),
    scale: gl.getUniformLocation(program, 'scale'),
    offset: gl.getUniformLocation(program, 'offset'),
    color: gl.getUniformLocation(program, 'color')
  };
  gl.vertexAttribIPointer(
    res.pos,
    2, // number of conponents (x, y, z)
    gl.UNSIGNED_INT, // UNSIGNED_BYTE, UNSIGNED_SHORT, // 16bit
    0, // stride
    0 // offset
  );
  gl.useProgram(program);
  gl.enableVertexAttribArray(res.pos);

  return res;
};

const mountWaveGl = (root) => {
  const canvas = document.createElement('canvas');
  root.append(canvas);
  canvas.width = 1024;
  canvas.height = 1024;
  canvas.style['background-color'] = '#000';
  const glProps = {premultipliedAlpha: false, alpha: true, antialias: true, depth: false};
  const gl = canvas.getContext('webgl2', glProps);
  gl.lineWidth(3);
  const ps1 = initProgramScalar(gl);

  let aReq;
  return (waves) => {
    if (aReq !== undefined) {
      cancelAnimationFrame(aReq);
    }
    aReq = window.requestAnimationFrame(() => {
      const w = root.offsetWidth|0;
      const h = root.offsetHeight|0;
      // console.log(w, h);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      waves.map((lane, i) => {
        const vertices = lane.wave;
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.vertexAttribIPointer(
          ps1.pos,
          2, // number of conponents (x, y, z)
          gl.UNSIGNED_INT, // UNSIGNED_SHORT, // 16bit
          0 /* stride */, 0 /* offset */
        );
        gl.enableVertexAttribArray(ps1.pos);
        gl.uniform2f(ps1.scale, 2 / 16384, 1 / 1024);
        gl.uniform2f(ps1.offset, -1, (1 - i) * .5 );
        gl.uniform4fv(ps1.color, lane.color);
        gl.drawArrays(
          gl.LINE_STRIP, // mode
          0, // first
          vertices.length / 2 // count
        );
      });
    });
  };
};

module.exports = mountWaveGl;
/* eslint-env browser */
