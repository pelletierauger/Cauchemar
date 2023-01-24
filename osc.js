if (false) {


receiveOSC = function(s) {
    // s = s.args[0].value;
    // trigger(s);
    if (s.address == "/beat") {
        ge.t.tick(s.args[0].value);
    }
    if (s.address == "/glitch") {
        if (s.args[0].value) {
            glitchDist = Math.random() * 1000;
        } else {
            glitchDist = 0;
        }
    }
    // console.log(s);
    // logJavaScriptConsole(s);
    // console.log("wattup");
    if (s.address == "/eval") {
        eval(s.args[0].value);
    }
};

trigger = function(s) {
    console.log(s);
};

socket.off('receiveOSC', receiveOSC);
socket.on('receiveOSC', receiveOSC);


}
