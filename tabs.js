function setTabs() {

ge.getTab("drums.scd").tick = function(s) {
    let xp = 40;
    let yp = this.scroll.y * 9;
    let x = s * xp + 77;
    // let distu = parseInt(s.substring(2,3));
    // console.log(s.substring(2,3));
    for (let i = 0; i < 16; i++) {
        let x = i * xp + 77;
        paintStatic(this.name, x, 5, types[1][8], horizontal1);
        paintStatic(this.name, x, 431, types[1][8], horizontal1);
        paintStatic(this.name, x, 875, types[1][8], horizontal1);
        paintStatic(this.name, x, 1305, types[1][8], horizontal1);
        paintStatic(this.name, x, 244 * 9 + 35, types[1][8], horizontal1);
        paintStatic(this.name, x, 305 * 9 + 70, types[1][8], horizontal1);
    }
    paintStatic(this.name, x, 5, types[1][8], full);
    paintStatic(this.name, x, 431, types[1][8], full);
    paintStatic(this.name, x, 875, types[1][8], full);
    paintStatic(this.name, x, 1305, types[1][8], full);
    paintStatic(this.name, x, 244 * 9 + 35, types[1][8], full);
    paintStatic(this.name, x, 305 * 9 + 70, types[1][8], full);
};

ge.getTab("scra-lo-stacca.scd").tick = function(s) {
    // console.log("Tick!");
    ge.clearCanvas();
    let xp = 40;
    let yp = this.scroll.y * 9;
    let x = parseInt(s.substring(0,2)) * xp;
    // console.log(x);
    for (let i = 0; i < 16; i++) {
        let x = i * xp;
        paintStatic(this.name, 80 + x, 5, types[1][8], horizontal1);
    }
        paintStatic(this.name, 80 + x, 5, types[1][8], full);
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
    
    Flake = function() {
        this.x = Math.random() * 109*7;
        this.y = Math.random() * 25*9;
        this.sx = (Math.random()*2-1)*3+1;
        this.sy = (Math.random()*3)+1;
    }
    Flake.prototype.constrain = function() {
        if (this.x < 0) {this.x = 109*7}
        else if (this.x > 109*7) {x = 0};
        if (this.y > 25*9) {this.y = 0};
    }
    flakes = [];
    for (let i = 0; i<10000;i++) {flakes.push(new Flake)};
    
ge.getTab("tabs.js").display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    // let currentProgram = getProgram("pulsar-fog");
    // gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    // currentProgram = getProgram("new-flickering-dots-vert");
    // gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
    let currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    gl.useProgram(currentProgram);
    // ge.c2c(802,802+25);
    let cc = ge.getTab("tabs.js").canvas.data;
    ge.eraseCanvas("tabs.js", 0, 802+25, 109, 802+50);
    for (let i = 0; i < 2500*3;i++) {
        // let yphase = Math.floor((((drawCount+1e4)+(Math.tan(i)*1e1)) % (25*9))) + ((i*1e3) % (25*9));
        // let xphase = Math.floor(((drawCount+1e4)*Math.tan(i)*0.25) % (109*7)) + ((i*2.3e4) % (109*7));
    let f = flakes[i];
        f.x += f.sx * 0.25;
        f.y += f.sy * 0.5;
        f.constrain();
        // let x = Math.floor(Math.random() * 109*7);
       // let x = Math.floor(Math.random() * 109*7);
        // let y = Math.floor(Math.random() * 25*9);
        paintRaw(cc, 802+25, Math.floor(f.x), Math.floor(f.y));
    }
    ge.canvasToCanvasSubtract("sh-proto.js", 0, 0, 109, 0+25, "tabs.js", 0, 802+25);
    // ge.canvasToCanvasAdd("tabs.js", 0, 802+50, 109, 802+75, "tabs.js", 0, 802+25);
        ge.canvasToCanvasAdd("tabs.js", 0, 802, 109, 802+25, "tabs.js", 0, 802+25);
    for (let i = 5000; i < 5100;i++) {
        // let yphase = Math.floor((drawCount+(Math.tan(i)*1e1)) % (25*9)) + ((i*1e3) % (25*9));
        // let xphase = Math.floor((drawCount*Math.tan(i)*0.25) % (109*7)) + ((i*2.3e4) % (109*7));
        // let x = Math.floor(Math.random() * 109*7);
            let f = flakes[i];
        f.x += f.sx * 0.25;
        f.y += f.sy * 0.5;
        f.constrain();
        // let x = Math.floor(Math.random() * 109*7);
       // let x = Math.floor(Math.random() * 109*7);
        // let y = Math.floor(Math.random() * 25*9);
        let fx = Math.floor(f.x);
        let fy = Math.floor(f.y);
        // let y = Math.floor(Math.random() * 25*9);
        // paintRaw(cc, 802+25, xphase, yphase);
        // paintRaw(cc, 802+25, xphase, Math.min(yphase+2,25*9));
        // paintRaw(cc, 802+25, Math.min(xphase+2,109*7), yphase);
        paintRaw(cc, 802+25, Math.min(fx+3,109*7), Math.max(0,Math.min(fy,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+1,109*7), Math.max(0,Math.min(fy+1,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+3,109*7), Math.max(0,Math.min(fy+1,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+5,109*7), Math.max(0,Math.min(fy+1,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+2,109*7), Math.max(0,Math.min(fy+2,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+3,109*7), Math.max(0,Math.min(fy+2,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+4,109*7), Math.max(0,Math.min(fy+2,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+1,109*7), Math.max(0,Math.min(fy+3,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+3,109*7), Math.max(0,Math.min(fy+3,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+5,109*7), Math.max(0,Math.min(fy+3,25*9)));
        paintRaw(cc, 802+25, Math.min(fx+3,109*7), Math.max(0,Math.min(fy+4,25*9)));
        // paintRaw(cc, 802+25, Math.min(xphase+3,109*7), Math.min(yphase+5,25*9));
    }
    drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    // gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    // vbuffer = gl.createBuffer();
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

drawTerminalz = function(selectedProgram) {
    num = 0;
    vertices = [];
    colors = [];
    let c = ge.t.canvas.data;
    let cy = ge.t.scroll.y;
    for (let i = 0; i < 15; i++) {
        for (let j = 20; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    vertices.push(x / (109*7) * 2 - 1 + 0.1, -y/(25*9) * 2 * (0.9) + 1 + 0.05, 11, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    for (let i = 0; i < 15; i++) {
        for (let j = 20; j < 109; j++) {
            for (let k = 0; k < 63; k++) {
                if (c[cy+i] && c[cy+i][j] && c[cy+i][j][k]) {
                    let x = j * 7 + (k % 7);
                    let y = i * 9 + Math.floor(k / 7);
                    x += Math.sin(drawCount * 1 + y * 1) * 10;
                    vertices.push(x / (109*7) * 2 - 1 + 0.1, y/(25*9) * 2 * (0.9) - 1.15 + 0.05, 11, 1);
                    num++;
                    colors.push(0.65, 0.65, 0.65);
                }
            }
        }
    }
    // vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 + ny) * sc, 11 * sc, 1);
                            // num++;
                            // colors.push(0.65, 0.65, 0.65);   
    // logJavaScriptConsole(colors.length);
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.uniform1f(time, drawCount);
    gl.uniform1f(disturb, glitchDist);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, termVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
//  ----
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsCBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Get the attribute location
    var cols = gl.getAttribLocation(selectedProgram, "colors");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(cols, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(cols);
// ----------
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
    if (vt.recording || vt.playback) {
        vt.recordingFrame++;
    }
    if (vt.playback) {
        vt.play();
    }
}
}