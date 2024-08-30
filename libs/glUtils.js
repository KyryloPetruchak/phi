(function (global) {

	// === HELPER FUNCTIONS START ===
	const isShaderSafe = (gl, obj) => {
		try {
			return gl.isShader(obj);
		}
		catch (e) {
			return false;
		}
	}

	const getShader = (gl, type, source) => {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		// Possible parameters: gl.SHADER_TYPE, gl.DELETE_STATUS, gl.COMPILE_STATUS
		const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		const log = gl.getShaderInfoLog(shader);
		console.log(`Shader ${type}. COMPILE_STATUS: ${compileStatus}. Log: ${log}`);

		if (!compileStatus) {
			gl.deleteShader(shader);
			return null;
		}
		else
			return shader;
	}

	const createProgram = (gl, vertexShader, fragmentShader) => {
		if (isShaderSafe(gl, vertexShader) == false || isShaderSafe(gl, fragmentShader) == false) {
			console.log("Failed to create a program. One or both of the parameters is/are not shaders.");
			return null;
		}

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
		let log = gl.getProgramInfoLog(program);
		console.log(`Program. LINK_STATUS: ${linkStatus}. Log: ${log}`);

		if (!linkStatus) {
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return null;
		}

		//const shaders = gl.getAttachedShaders(program);
		//gl.getShaderSource(shader); // return source code of a shader

		//gl.isShader(vertexShader); // return true or exception (if parameter is not shader);
		//gl.isProgram(program); 

		gl.validateProgram(program);
		var validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
		log = gl.getProgramInfoLog(program);
		console.log(`Program. VALIDATE_STATUS: ${validateStatus}. Log: ${log}`);

		if (!validateStatus) {
			gl.deleteProgram(program);
			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);
			return null;
		}
		else
			return program;
	};
	// === HELPER FUNCTIONS END ===

	const checkWebGL = (canvas) => {
		const contexts = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl"];
		var gl;
		for (const context of contexts) {
			try {
				gl = canvas.getContext(context);
			}
			catch (e) { }

			if (gl)
				break;
		}

		if (!gl)
			alert("WebGL not available in your browser.");

		return gl;
	};

	const initShaders = (gl, vshader_source, fshader_source) => {
		const vertexShader = getShader(gl, gl.VERTEX_SHADER, vshader_source);
		const fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fshader_source);
		const program = createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);

		return program;
	};

	const resize = (gl) => {
		gl.canvas.width = window.innerWidth;
		gl.canvas.height = window.innerHeight;
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}

	const glUtils = {
		VERSION: "0.0.2",
		checkWebGL: checkWebGL,
		initShaders: initShaders,
		resize: resize
	};

	global.glUtils = glUtils;
}(window || this))