s.boot;

~nT = TempoClock.new(1.39 * 1 * 1.25).permanent_(true);
~nT.tempo;
~cb = Bus.control(s, 2);
Safety(s).disable;
(
SynthDef.new(\tick, {
    arg beat, subd;
    var sig = Impulse.kr(0.01);
    Line.kr(0, 1, 0.1, doneAction: 2);
    Out.kr(~cb, sig * [beat, subd]);
}).add;
)
~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/eval", "tl()");    // send the application the message "hello" with the parameter "there"

~toOSC.sendMsg("/eval", s);
~toOSC.sendMsg("/chunk", "00000001");

~msg = "000000";

(
~ticking = {
var stepIndex = Pseq((0..15), inf).asStream;
    ~ticks.stop;
    ~ticks = Pbind(
        \instrument, \tick,
        \dur, 0.25,
        \dur, FuncStream({
            var n = stepIndex.next;
            var m = n.asString.padLeft(2, "0") ++ ~msg;
            // m.postln;
            ~toOSC.sendMsg("/beat", m);
            0.25;
        }),
        \beat, Pseq([1, 0, 0, 0], inf),
        \subd, Pseq([1, 1, 1, 1], inf)
    ).play(~nT, quant: 4);
};
CmdPeriod.remove(~ticking);
CmdPeriod.add(~ticking);
~ticking.();
)