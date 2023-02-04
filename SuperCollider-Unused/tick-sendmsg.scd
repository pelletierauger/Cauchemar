s.boot;

~nT = TempoClock.new(1.39 * 1 * 1.25).permanent_(true);
~nT.tempo;
~nT.tempo = 1.39 * 1 * 1.25;
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

(
~go_to = { |tab, line| 
    var s;
    if (line == nil, {
        s = "go_to(\"" ++ tab ++ "\")";
        s.postln;
        ~toOSC.sendMsg("/eval", s);
    }, {
        s = "go_to(\"" ++ tab ++ "\"," ++ line ++ ")";
        s.postln;
        ~toOSC.sendMsg("/eval", s);
    });
};
)

~go_to.("gnaw-low.scd", 0);

~msg = "000000";

(
CmdPeriod.remove(~ticking);
~ticking = {
var stepIndex = Pseq((0..15), inf).asStream;
    ~ticks.stop;
    ~ticks = Pbind(
        \instrument, \tick,
        \dur, 0.25,
        \dur, FuncStream({
            var n = stepIndex.next;
            // ~msg = n.asString.padLeft(2, "0");
            // m.postln;
            ~toOSC.sendMsg("/beat", n);
            0.25;
        }),
        \beat, Pseq([1, 0, 0, 0], inf),
        \subd, Pseq([1, 1, 1, 1], inf)
    ).play(~nT, quant: 4);
};
CmdPeriod.add(~ticking);
~ticking.();
)