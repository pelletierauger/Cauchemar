function setTabs() {

ge.getTab("toms-acc-cb.scd").tick = function(s) {
    // console.log("Tick!");
    ge.clearCanvas();
    let xp = 40;
    let yp = this.scroll.y * 9;
    let x = parseInt(s.substring(0,2)) * xp;
    // console.log(x);
    for (let i = 0; i < 16; i++) {
        let x = i * xp;
        paintStatic(this.name, 80 + x, 10 + yp, types[1][8], horizontal1);
    }
        paintStatic(this.name, 80 + x, 10 + yp, types[1][8], full);
};

    
    ge.getTab("dots.js").display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
    if (ge.t && ge.t.name == "dots.js") {
        // ge.eraseCanvas("sh.js", 0, 0, 109, 25);
        // scdDisplay();
        // let arr = [0, 1, 2, 1];
        // let fra = 146 + 25 * arr[(Math.floor(drawCount * 0.2 * 0.1) % 4)];
        // console.log(fra);
        // ge.canvasToCanvas("dots.js", 0, fra, 109, fra + 25, "dots.js", 0, 219);
        // ge.paintOther("dots.js", (75 - (fra - 146) - 2) * -1);
        // ge.canvasToCanvasAdd("sketch.js", 0, 0, 109, 25, "sh.js", 0, 0);
        let l = Math.sin(drawCount * 0.025) * 0.5 + 0.5;
        // ge.xFadeCanvases("dots.js", 0, 146, 109, 146 + 25, "dots.js", 0, 196 - 0, "dots.js", 0, 433, l);
        // ge.clearCanvas();
        ge.eraseCanvas("dots.js", 0, 0, 109, 25);
        // for (let i = 0; i < 300; i++) {
        //     let x = Math.floor(Math.cos(i + drawCount * 0.000125 * i) * i * 0.9) + 370;
        //     let y = Math.floor(Math.sin(i + drawCount * 0.000125 * i) * i * 0.5) + 110; 
        //     paintStatic(ge.t.name, x, y, ge.activeBrush, patterns[Math.floor(i * 0.1 * (Math.sin(drawCount * 0.1) * 0.5 + 0.5)) % 6]);
        // }
        let prevY = 0;
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 150; i++) {
                // let x = Math.floor(Math.cos(i + drawCount * 0.000125 * i) * i * 0.9) + 370;
                // let y = Math.floor(Math.sin(i + drawCount * 0.000125 * i) * i * 0.5) + 110; 
                let a = map(j, 0, 20, 0.2, 1.2);
                let x = i * 2.5 * 2;
                let y = Math.floor((openSimplex.noise2D(drawCount * 1e-2 + j * 0.25, x * 0.5e-2 + drawCount * -1e-2)*0.5+0.5) * -500 * a) + 300;
                y += Math.floor((openSimplex.noise2D(drawCount * 1e-1, x + 1000) * 0.5 + 0.5) * 10);
                let p = (y < prevY) ? patterns[Math.floor(a*12) % 8] : patterns[0];
                let v = (j == 9) ? 0 : 1;
                if (y < 24 * 9) {
                    paintStatic("dots.js", x, y, ge.activeBrush, p, v);
                }
                prevY = y;
            }
        }
        ge.canvasToCanvasSubtract("sh2.js", 10, 0, 80, 0 + 25, "dots.js", 10, 0);
        ge.canvasToCanvasAdd("sketch.js", 41, 0, 62, 0 + 25, "dots.js", 41, 0);
    }
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    gl.useProgram(currentProgram);
    drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};


celine = ge.makeBlurredArray("sh3.js", 0, 61, 109, 61 + 25);
nina = ge.makeBlurredArray("sh3.js", 0, 782, 109, 782 + 25)

ge.getTab("sh3.js").display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    gl.useProgram(currentProgram);
    let l = openSimplex.noise2D(drawCount * 5e-2, drawCount * 5e-2 + 1e3)* 0.5 + 0.5;
    let l2 = openSimplex.noise2D(drawCount * 5e-2 + 1e4, drawCount * 5e-2 + 1e5)* 0.5 + 0.5;
    ge.xFadeWithZeroes("sh3.js", 0, 61, 109, 61 + 25,"sh3.js", 0, 61 + 25, l, celine)
    ge.xFadeWithZeroesAdd("sh3.js", 0, 782, 109, 782 + 25,"sh3.js", 0, 61 + 25, l2, nina)
    drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};






}