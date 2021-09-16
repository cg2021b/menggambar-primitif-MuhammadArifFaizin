const gl_type_constants = {
  POINTS: 0x0000,
  LINES: 0x0001,
  LINE_LOOP: 0x0002,
  LINE_STRIP: 0x0003,
  TRIANGLES: 0x0004,
  TRIANGLE_STRIP: 0x0005,
  TRIANGLE_FAN: 0x0006,
};

const ThreeVertices = [-0.5, 0.5, -0.5, -0.5, 0.5, -0.5];
const SixVertices = [
  -0.7, -0.1, -0.3, 0.6, -0.3, -0.3, 0.2, 0.6, 0.3, -0.3, 0.7, 0.6,
];

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  gl.deleteProgram(program);
};

const renderProgram = (gl, vertexCodeId, fragmentCodeId) => {
  // definisi shader
  const vertexShaderCode = document.getElementById(vertexCodeId).text;
  const fragmentShaderCode = document.getElementById(fragmentCodeId).text;

  // membuat shader
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderCode
  );

  // link shader ke program
  const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

  return shaderProgram;
};

const arrayVerticesRendering = ({
  canvasId,
  vertexCodeId,
  fragmentCodeId,
  gl_type,
  draw_first = 0,
  draw_count,
  vertices,
}) => {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext("webgl");

  // simpan titik ke dalam buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  const shaderProgram = renderProgram(gl, vertexCodeId, fragmentCodeId);

  // menggunakan bind untuk menggambar
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const aPosition = gl.getAttribLocation(shaderProgram, "a_position");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  // bersihkan canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // gambar titik
  gl.drawArrays(gl_type, draw_first, draw_count);
};

const points = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.POINTS,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const lineStrip = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.LINE_STRIP,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const lineLoop = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.LINE_LOOP,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const lines = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.LINE_LOOP,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const triangles = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.TRIANGLES,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const triangleStrip = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.TRIANGLE_STRIP,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const triangleFan = (
  vertices,
  verticeCount,
  canvasId,
  vertexCodeId,
  fragmentCodeId
) => {
  arrayVerticesRendering({
    canvasId: canvasId,
    vertexCodeId: vertexCodeId,
    fragmentCodeId: fragmentCodeId,
    gl_type: gl_type_constants.TRIANGLE_FAN,
    draw_count: verticeCount,
    vertices: vertices,
  });
};

const tryYourOwn = () => {
  const verticeState = document.getElementById("verticeState");
  const typeState = document.getElementById("typeState");

  const stateValVertice = verticeState.value;
  const stateValType = typeState.value;

  let vertice = [];
  let countNode = 0;

  if (stateValVertice == "three") {
    vertice = ThreeVertices;
    countNode = 3;
  } else if (stateValVertice == "six") {
    vertice = SixVertices;
    countNode = 6;
  }

  if (stateValType == "points") {
    points(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "lineStrip") {
    lineStrip(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "lineLoop") {
    lineLoop(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "lines") {
    lines(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "triangles") {
    triangles(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "triangleStrip") {
    triangleStrip(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  } else if (stateValType == "triangleFan") {
    triangleFan(
      vertice,
      countNode,
      "tryYourOwn",
      "vertexShaderCodeTryYourOwn",
      "fragmentShaderCodeTryYourOwn"
    );
  }
};

function main() {
  points(
    SixVertices,
    6,
    "canvThreeDots",
    "vertexShaderCodeThreeDots",
    "fragmentShaderCodeThreeDots"
  );
  lineStrip(
    SixVertices,
    6,
    "canvLineStrip",
    "vertexShaderCodeLineStrip",
    "fragmentShaderCodeLineStrip"
  );
  lineLoop(
    SixVertices,
    6,
    "canvLineLoop",
    "vertexShaderCodeLineLoop",
    "fragmentShaderCodeLineLoop"
  );
  lines(
    SixVertices,
    6,
    "canvLines",
    "vertexShaderCodeLines",
    "fragmentShaderCodeLines"
  );
  triangles(
    SixVertices,
    6,
    "canvTriangles",
    "vertexShaderCodeTriangles",
    "fragmentShaderCodeTriangles"
  );
  triangleStrip(
    SixVertices,
    6,
    "canvTriangleStrip",
    "vertexShaderCodeTriangleStrip",
    "fragmentShaderCodeTriangleStrip"
  );
  triangleFan(
    SixVertices,
    6,
    "canvTriangleFan",
    "vertexShaderCodeTriangleFan",
    "fragmentShaderCodeTriangleFan"
  );

  tryYourOwn();

  const verticeState = document.getElementById("verticeState");
  const typeState = document.getElementById("typeState");

  const verticeStatus = document.querySelectorAll(
    'input[type=radio][name="optVertices"]'
  );

  const typeStatus = document.querySelectorAll(
    'input[type=radio][name="optTypes"]'
  );

  verticeStatus.forEach((verticeItem) => {
    verticeItem.addEventListener("change", (event) => {
      const verticesVal = event.target.value;
      verticeState.value = verticesVal;

      tryYourOwn();
    });
  });

  typeStatus.forEach((typeItem) => {
    typeItem.addEventListener("change", (event) => {
      const typesVal = event.target.value;
      typeState.value = typesVal;

      tryYourOwn();
    });
  });
}
