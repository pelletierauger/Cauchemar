makeXFadeArray = function() {
    xFadeArray = new Uint8Array(109 * 25 * 7 * 9);
    let lerp = function(e,t,r){return r*(t-e)+e};
    for (let y = 0; y < 25 * 9; y++) {
        for (let x = 0; x < 109 * 7; x++) {
            let xx = x * 0.025 * 0.25 + drawCount * 0.25e-1;
            let yy = y * 0.025 + drawCount * 0.25e-1 + 1000;
            let zz = drawCount * 0.25e-1;
            let nA = Math.floor((openSimplex.noise3D(xx, yy, zz) * 0.5 + 0.5) * 256);
            let nB = Math.floor(Math.random() * 256);
            let nC = Math.floor(lerp(nA, nB, 0.25));
            xFadeArray[x + (y * 109 * 7)] = nC;
        }
    }
};



// dans display...

    makeXFadeArray();
    ge.xFadeWithZeroes("sh3.js", 0, 61, 109, 61 + 25,"sh3.js", 0, 61 + 25, 0.5, xFadeArray)
    drawTerminal(currentProgram);
  



  //—————————————————————————————————————————————————————————————————


makeXFadeArray = function() {
    xFadeArray = new Uint8Array(109 * 25 * 7 * 9);
    let lerp = function(e,t,r){return r*(t-e)+e};
    for (let y = 0; y < 25 * 9; y++) {
        for (let x = 0; x < 109 * 7; x++) {
            let xx = x * 0.025 * 0.25 + drawCount * 0.25e-1 * 0.5;
            let yy = y * 0.025 + drawCount * 0.25e-1 * 0.5 + 1000;
            let zz = drawCount * 0.25e-1 * 0.5;
            let nA = Math.floor((openSimplex.noise3D(xx, yy, zz) * 0.5 + 0.5) * 256);
            let nB = Math.floor(Math.random() * 256);
            let nC = Math.floor(lerp(nA, nB, 0.125));
            xFadeArray[x + (y * 109 * 7)] = nC;
        }
    }
};


// display
makeXFadeArray();
ge.xFadeWithZeroes("sketch.js", 0, 0, 109, 0 + 25,"sh3.js", 0, 61 + 25, 0.65, xFadeArray)
ge.canvasToCanvasSubtract("sh2.js", 10, 0, 80, 0 + 25, "sh3.js", 10, 61 + 25);
ge.canvasToCanvasAdd("sketch.js", 41, 0, 62, 0 + 25, "sh3.js", 41, 61 + 25);
// drawTerminal(currentProgram);
// ge.xFadeWithZeroes("sh3.js", 0, 61, 109, 61 + 25,"sh3.js", 0, 61 + 25, l, celine)
// ge.xFadeWithZeroesAdd("sh3.js", 0, 782, 109, 782 + 25,"sh3.js", 0, 61 + 25, l2, nina)
drawTerminal(currentProgram);
