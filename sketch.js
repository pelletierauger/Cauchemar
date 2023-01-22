let looping = false;
let grimoire = false;
let tabsLoaded = false;
let gr;
let mode = 0;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "/Volumes/Volumina/frames/grimoire/bouleaux-ora/bouleaux";
let JSONs = [];
let maxFrames = Infinity;
let gl;
let time;
let positive = true;
let intensity;
let drawCount = 0;
let exportCount = 0;
let drawIncrement = 1;
let vertexBuffer;
let fvertices = [];
const openSimplex = openSimplexNoise(10);
let mS = 1;
let amountOfScratches = 3;
let fluctuation = 1;
let namedPrograms = {};

// a shader variable
let texcoordShader;
let dotsVBuf, termVBuf, dotsCBuf, bgVBuf;
let texture, texture2, framebuf, framebuf2;
let vb;
let nx, ny;
fvertices = [];
for (let i = 0; i < 1000000; i++) {
    fvertices.push(i);
}
fvertices = new Float32Array(fvertices);

let resolutionScalar = 1;
let resolutionBG;

let fmouse = [0, 0];
let pmouse = [0, 0];
let smouse = [0, 0];


// ------------------------------------------------------------
// Grimoire Animate
// ------------------------------------------------------------

var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;
var animationStart;
var framesRendered = 0;
var framesOfASecond = 0;
var secondStart, secondFrames;
var fps = 24;
var envirLooping = false;


startAnimating = function() {
    fpsInterval = 1000 / fps;
    then = Date.now();
    animationStart = Date.now();
    secondStart = Date.now();
    startTime = then;
    framesRendered = 0;
    envirLooping = true;
    animate();
}

function queryFrameRate() {
    let timeElapsed = Date.now() - animationStart;
    let seconds = timeElapsed / 1000;
    logJavaScriptConsole(framesRendered / seconds);
    // logJavaScriptConsole(timeElapsed);
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

function animate() {

    // request another frame
    if (envirLooping) {

        requestAnimationFrame(animate);


        // calc elapsed time since last loop

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);
            // Put your drawing code here
            draw();
            framesRendered++;
            framesOfASecond++;
            if (framesOfASecond == fps) {
                secondFrames = fps / ((Date.now() - secondStart) * 0.001);
                // logJavaScriptConsole(secondFrames);
                framesOfASecond = 0;
                secondStart = Date.now();
            }
        }
    }
}

// ------------------------------------------------------------


function setup() {
    socket = io.connect('http://localhost:8080');
    socket.on('pushJSONs', function(data) {
        JSONs = data;
        // draw();
    });
    socket.emit('pullJSONs', "/Users/guillaumepelletier/Desktop/Dropbox/Art/p5/Les-nouvelles-galaxies/Vert/sessions");
    // socket.on('receiveOSC', receiveOSC);
    // pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // canvasDOM = document.getElementById('defaultCanvas0');
    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    pixelDensity(1);
    noCanvas();
    // cnvs = createCanvas(windowWidth, windowWidth * 9 / 16, WEBGL);
    // cnvs = createCanvas(1280, 1280 * 9 / 16, WEBGL);
    cnvs = document.createElement('canvas');

    cnvs.id = "defaultCanvas0";
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(cnvs);
    canvasDOM = document.getElementById('defaultCanvas0');

    // noCanvas();
    // cnvs = document.getElementById('my_Canvas');
    // gl = canvas.getContext('webgl');
    gl = cnvs.getContext('webgl');





    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });



    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);
    // background(0);
    // fill(255, 50);
    noStroke();
    vertex_buffer = gl.createBuffer();
    dotsVBuf = gl.createBuffer();
    bgVBuf = gl.createBuffer(); 
    dotsCBuf = gl.createBuffer();
    termVBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    if (!looping) {
        noLoop();
    }
    shadersReadyToInitiate = true;
    initializeShaders();
    createWhiteDots();
    time = gl.getUniformLocation(getProgram("pulsar-fog"), "time");
    resolutionBG = gl.getUniformLocation(getProgram("pulsar-fog"), "resolution");
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);

    setTimeout( function() {
        // keysControl.style.cursor = 'none';
        keysControl.addEventListener("mouseenter", function(event) {
        document.body.style.cursor = "none";
        document.body.style.backgroundColor = "#000000";
        appControl.setAttribute("style", "display:none;");
        let tabs = document.querySelector("#file-tabs");
        tabs.setAttribute("style", "display:none;");
        // let slider = document.querySelector("#timeline-slider");
        // slider.setAttribute("style", "display:none;");
        // slider.style.display = "none";
        // canvasDOM.style.bottom = "0";
        cinemaMode = true;
        scdArea.style.display = "none";
        scdConsoleArea.style.display = "none";
        jsArea.style.display = "none";
        jsConsoleArea.style.display = "none";
    }, false);
    keysControl.addEventListener("mouseleave", function(event) {
            if (!grimoire) {
                document.body.style.cursor = "default";
                document.body.style.backgroundColor = "#1C1C1C";
                appControl.setAttribute("style", "display:block;");
                let tabs = document.querySelector("#file-tabs");
                tabs.setAttribute("style", "display:block;");
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
                if (displayMode === "both") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                } else if (displayMode == "scd") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                } else if (displayMode == "js") {
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                }
                cinemaMode = false;
                clearSelection();
            }   
        }, false);
    }, 1);
    if (batchExport) {
        exportCount = batchMin;
        drawCount = exportCount;
        exporting = true;
        redraw();
        songPlay = false;
        noLoop();
        looping = false;
    }
    socket.on('getNextImage', function(data) {
        if (drawCount <= batchMax) {
            // redraw();
            window.setTimeout(function() {
                redraw();
            }, 3000);
        }
    });
}

function clearSelection() {
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}

draw = function() {
    if (ge.t) {
        ge.t.display();
    } else {
        GrimoireTab.prototype.display();
    }
    if (tabsLoaded) {
        if (exporting && exportCount < maxFrames) {
            frameExport();
        }    
        drawCount += drawIncrement;
        exportCount++;
        drawCount = exportCount;
    }
}

// function keyPressed() {
//     if (keysActive) {
//         if (keyCode === 32) {
//             if (looping) {
//                 noLoop();
//                 looping = false;
//             } else {
//                 loop();
//                 looping = true;
//             }
//         }
//         if (key == 'r' || key == 'R') {
//             window.location.reload();
//         }
//         if (key == 'm' || key == 'M') {
//             redraw();
//         }
//     }
// }


keyPressed = function() {
    if (keysActive) {
        // if (keyCode === 32) {
        //     if (looping) {
        //         noLoop();
        //         looping = false;
        //     } else {
        //         loop();
        //         looping = true;
        //     }
        // }
        // if (key == 'r' || key == 'R') {
        //     window.location.reload();
        // }
        // if (key == 'm' || key == 'M') {
        //     redraw();
        // }
        // if (key == 'a' || key == 'A') {
        //     logJavaScriptConsole("yur!");
        // }
        // logJavaScriptConsole(key);
    if (vtActive) {
                    // vt.update(event);
         // if (keyCode === 8) {
            // vt.update("delete");
             // // logJavaScriptConsole(event);
        // }  else {
            // vt.update(event);
        // }
                     // logJavaScriptConsole(event.key);
        // logJavaScriptConsole(event.shiftKey);
        // if (key == 'a' || key == 'A') {
            // vt.update("a");
            // logJavaScriptConsole(event.key);
        // }
        }
    }
}


tl = function(d = 0) {
    setTimeout(function() {
                if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
    }, d * 1e3);
};


tl = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};

tl0 = function(d = 0) {
    setTimeout(function() {
                if (envirLooping) {
                // noLoop();
                envirLooping = false;
            } else {
                drawCount = 0;
                envirLooping = true;
                startAnimating();
            }
    }, d * 1e3);
};


keyDown = function(e) {
    if (keysActive) {
        if (ge.recording) {
            ge.recordingSession.push([drawCount, {
                name: "keyDown",
                key: e.key,
                keyCode: e.keyCode,
                altKey: e.altKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey
            }]);
        }
        // console.log(event.keyCode);
        if (e.keyCode == 27 && ge.activeTab !== null) {
            mode = (mode + 1) % 3;
        }
        if (mode == 0) {
                if (vtActive) {
                    vt.update(e);
                    // ljs(event.keyCode);
                }
            updateDrawing(e);
        } else if (mode == 1) {
            ge.update(e);
        } else if (mode == 2) {
            paintingKeys(e);
        }
    }
}

document.onkeydown = keyDown;       




function setResolutionScalar(sc) {
    resolutionScalar = sc;
    cnvs.width = 2560 * resolutionScalar;
    cnvs.height = 1440 * resolutionScalar;
    texture = createTexture();
    framebuf = createFrameBuffer(texture);
    texture2 = createTexture();
    framebuf2 = createFrameBuffer(texture2);
    drawCount--;
    redraw();
}

function sr(sc) {
    setResolutionScalar(sc);
}

function exportOne() {
    exporting = true;
    redraw();
    exporting = false;
}

gr = function() {
    grimoire = !grimoire;
}

if (false) {


receiveOSC = function(s) {
    trigger(s);
    // logJavaScriptConsole(s);
    if (s.address == "/eval") {
        eval(s.args[0].value);
    }
};

trigger = function(s) {
    console.log(s);
};

socket.off('receiveOSC', receiveOSC);
socket.on('receiveOSC', receiveOSC);


buzz = 0.1;
scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
    for (let y = 20; y < 25; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, 0);
                let v = Math.round(Math.sin(d + drawCount * Math.cos(xx * buzz)) * 0.5 + 0.5);
                c[y][x][i] = v;
            }
        }
    }
}

buzz = 0.1;
buzzY = 1;
    scdDisplay = function() {
    let c = ge.activeTab.canvas.data;
        let t = drawCount;
    for (let y = 20; y < 28; y++) {
        for (let x = 65; x < 105; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx, yy, 0, buzzY);
                let v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                v = Math.round(usin(Math.tan(d * buzz + t)));
                c[y][x][i] = v;
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}

}

buzz = 0.1;
buzzY = 1;
scdDisplay = function() {
    let t = drawCount;
    let c = ge.activeTab.canvas.data;
   c = ge.getTab("sh.js").canvas.data;
    let w = 100;
    let hw = w / 2;
    for (let y = 2; y < 23; y++) {
        for (let x = 31; x < 78; x++)  {
            if (c[y] == null) {c[y] = []};
            let v = Math.round(Math.random());
            if (c[y][x] == null) {c[y][x] = []};
            for (let i = 0; i < 63; i++) {
                let xx = x * 7 + (i % 7);
                let yy = y * 9 + (i / 7);
                let d = dist(xx * 0.94, yy * (5 / 3), 109 * 7 / 2 - 26, 25 * 9 / 2 * (5/3));
                let v = Math.round(usin(d * 100 + drawCount * 0.5 + Math.sin(xx)));
                v *= Math.round(usin(d * 5 + drawCount * 1e-1));
                // v = Math.round(usin(d + drawCount * Math.cos(xx * 0.1)));
                // v *= Math.round(usin(Math.sin(d * buzz + t)));
                
                if (d < 150.5) {
                    c[y][x][i] = v;
                } else {
                    // c[y][x][i] = 0;
                }
            }
        }
    }
    function usin(t) {
        return Math.sin(t) * 0.5 + 0.5;
    }
}
// scdDisplay();





logLatency = function() {
    logJavaScriptConsole((Date.now() - animationStart)/1000 - (drawCount/24));
}