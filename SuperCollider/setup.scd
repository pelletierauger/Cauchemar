s.boot;
~toOSC = NetAddr.new("127.0.0.1", 57121);


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

(
CmdPeriod.remove(~ticking);
~ticking = {
var stepIndex = Pseq((0..15), inf).asStream;
    ~ticks.stop;
    ~ticks = Pbind(
        \instrument, \tick,
        \dur, FuncStream({
            ~toOSC.sendMsg("/beat", stepIndex.next);
            0.25;
        }),
        \beat, Pseq([1, 0, 0, 0], inf),
        \subd, Pseq([1, 1, 1, 1], inf)
    ).play(~nT, quant: 4);
};
CmdPeriod.add(~ticking);
~ticking.();
)

(
~hearCB.free;
~hearCB = {HPF.ar(K2A.ar({var a=In.kr(~cb, 2);[a[0],a[1]-a[0]];}), [7000, 3000]) * [32, 2]}.play;
)
s.record;
s.stopRecording
~rec.openOS;
(
~hearCB.free;
~hearCB = {HPF.ar(K2A.ar(In.kr(~cb, 2)[1]!2), 7000) * 4}.play;
)
(
~hearCB.free;
~hearCB = {
    var a=HPF.ar(K2A.ar(In.kr(~cb,2)),7e3) * 4;a[0]=Resonz.ar(a[0]*4,9e3);a;
}.play;
)

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


(
SynthDef(\sampler, {
    arg buf, rate = 1, spos = 0, pan = 1, amp = 1, atk = 0.001, susT = 1, rel = 0.01, out = 0;
    var sig, env, lfo;
    env = EnvGen.kr(Env.new([0, 1, 1, 0], [atk, susT, rel], ['lin', -8]), doneAction: 2);
    sig = PlayBuf.ar(
        2, buf,
        rate * BufRateScale.ir(buf),
        startPos: spos * BufSampleRate.ir(buf),
        doneAction: 2
    );
    sig = sig * amp * env;
    sig = Balance2.ar(sig[0], sig[1], pan, 1);
    Out.ar(out, sig);
}).add;

SynthDef(\samplerFlip, {
    arg buf, rate = 1, spos = 0, pan = 1, amp = 1, atk = 0.001, susT = 1, rel = 0.01, out = 0;
    var sig, env, lfo;
    env = EnvGen.kr(Env.new([0, 1, 1, 0], [atk, susT, rel], ['lin', -8]), doneAction: 2);
    sig = PlayBuf.ar(
        2, buf,
        rate * BufRateScale.ir(buf),
        startPos: spos * BufSampleRate.ir(buf),
        doneAction: 2
    );
    sig = sig * amp * env;
    sig = Balance2.ar(sig[0], sig[1], pan, 1);
    Out.ar(out, sig.reverse);
}).add;

SynthDef(\samplerFlipLPF, {
    arg buf, rate = 1, spos = 0, pan = 1, amp = 1, atk = 0.001, susT = 1, rel = 0.01, out = 0;
    var sig, env, lfo;
    env = EnvGen.kr(Env.new([0, 1, 1, 0], [atk, susT, rel], ['lin', -8]), doneAction: 2);
    sig = PlayBuf.ar(
        2, buf,
        rate * BufRateScale.ir(buf),
        startPos: spos * BufSampleRate.ir(buf),
        doneAction: 2
    );
    sig = sig * amp * env;
    sig = ~v.(sig,2000);
    sig = Balance2.ar(sig[0], sig[1], pan, 1);
    Out.ar(out, sig.reverse);
}).add;

SynthDef(\samplerHPF, {
    arg buf, rate = 1, spos = 0, pan = 1, amp = 1, atk = 0.001, susT = 1, rel = 0.01, out = 0;
    var sig, env, lfo;
    env = EnvGen.kr(Env.new([0, 1, 1, 0], [atk, susT, rel], ['lin', -8]), doneAction: 2);
    sig = PlayBuf.ar(
        2, buf,
        rate * BufRateScale.ir(buf),
        startPos: spos * BufSampleRate.ir(buf),
        doneAction: 2
    );
    sig = sig * amp * env;
    sig = ~v.(sig, 1000, 0, 5);
    sig = Balance2.ar(sig[0], sig[1], pan, 1);
    Out.ar(out, sig);
}).add;
)

go drums