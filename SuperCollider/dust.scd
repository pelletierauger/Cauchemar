(
SynthDef(\dust, {
    var a = \amount.kr(1);
    var sig = Dust.ar(a);
    var br = (a-50/900/5);
    // var env = EnvGen.kr(Env([0,1,0], [0.01,0.01]), doneAction: 2);
    // sig = BPF.ar(sig, Rand(100, 5000));
    // sig = MiRings.ar(sig, trig: 0, pit: 27, struct: 0.25, bright: 0.25 + br, damp: 0.7, pos: 0, model:0);
    // sig = Pan2.ar(sig, Rand(-1.00, 1.00));

    var amp = min(a-50, 1).linlin(0,1,0.25,1).lag(0.01);
        // amp.poll;
    var sig2 = ~v.(sig, 2400, 0, 5) * 1 ! 2 * amp;
    // sig = sig2 + ~v.(CombN.ar(sig!2*amp, 1, 0.125, 2)*0.5,1000);
    Out.ar(0, sig2 * 0.5);
}).add;
)
(
~dust.free;
~dust = Synth.new(\dust);
)

s.numSynths





(
OSCdef.new(
    \fromnode,
    // The following function will be executed every time 
    // a message is received at the address 'bouncy'.
    {
        arg msg, time, addr, port;
        // The message we receive is contained in the msg property.
        var dusts = max(0, msg[1]);
        ~dust.set(\amount, dusts * 1);
        // note.postln;
        
    },
    // This is the address at which this instance of OSCdef listens.
    'dusty'
);
)