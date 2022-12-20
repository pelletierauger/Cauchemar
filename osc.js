if (false) {


receiveOSC = function(s) {
    s = s.args[0].value;
    // trigger(s);
    ge.t.tick(s);
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
