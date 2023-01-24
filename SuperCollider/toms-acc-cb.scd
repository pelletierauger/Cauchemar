
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
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms = {
        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[1] * dd;
        var trig = t;
        var trig2 = t + DelayN.kr(t, 0.5, ~nT.beatDur / 8);
        var pat0 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        var pat1 = [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0];
        var pat2 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1];
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24],
            engine: 9,
            harm: [0.25, 0.4, 0.4, 0.25],
            timbre: [1, 1, 1, 1],
            morph: 0.75 - [0, 0.2, 0, -0.1],
            trigger: (trig!3)++(trig2!1) * [block0, block1, block1, block2] * trigGate,
            decay: [0.9, 0.6, 0.6, hh] * 0.5,
            lpg_colour: [0.75, 0.75, 0.75, 1],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        ) * dd.lag(0.1);
        // var dd = Demand.kr(trig, 0, Dseq([2, 1].stutter(16), inf));
        var ddd = Demand.kr(trig, 0, Dseq([8000, 5000].stutter(16), inf));
        var v = 1;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 2 + (sig[3][v] * 0.15)]!2 + sig2;
        sig = sig + (~v.(sig, 3000, 0, 5) * 8);
        // sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = [sig2, sig3] * 0.25;
        // sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500), 0, 5) * 8;
        // sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig * 2;
    }.play(fadeTime: 0.01).register;
});
)



(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    if(~toms2.isPlaying, {~toms2.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms2 = {
        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[1] * dd;
        var trig = t;
        var trig2 = t + DelayN.kr(t, 0.5, ~nT.beatDur / 8);
        var pat0 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        var pat1 = [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        var pat2 = (0!16) ++ [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24] + 12,
            engine: 9,
            harm: [0.25, 0.4, 0.4, 0.4],
            timbre: [1, 1, 1, 1],
            morph: 0.75 - [0, 0.2, 0, -0.2],
            trigger: (trig!3)++(trig2!1) * [block0, block1, block1, block2] * trigGate,
            decay: [0.9, 0.6, 0.6, 2] * 0.5,
            lpg_colour: [0.75, 0.75, 0.75, 0],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        ) * dd.lag(0.05);
        var v = 1;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 2 + (sig[3][v] * 0.5 * 0)]!2 + sig2;
        // sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = [sig2, sig3] * 0.25;
        sig = sig + (~v.(sig, 3000, 0, 5) * 8);
        // sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500), 0, 5) * 8;
        // sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig;
    }.play(fadeTime: 0.01).register;
});
)

(
if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
if(~toms2.isPlaying, {~toms2.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
if(~tomsZ.isPlaying, {~tomsZ.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
)

(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    ~x3b.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1);
    ~x3b = {
        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[1] * dd;
        var env = EnvGen.kr(Env([0, 1, 0], [0.001, 1], [2, -8, 'lin']), t);
        var d = Demand.kr(t, 0, Dseq([4, 4, 4, 5, 3, 3, 3, 2].stutter(1) - 0, inf));
        var note = Demand.kr(t, 0, Dseq([0, 0, 0, 1, -1, -1, -1, -2], inf));
        var sig = MiBraids.ar(
            pitch: 27 + 24 + 0 + [0, 0.25] + note,
            timbre: 0.5 + [0.0, 0.1],
            color: 0.5,
            model: 0,
            trig: t,
            resamp: 2,
            decim: \decim.kr(2) + [0, 4],
            bits: 4,
            ws: 0.5
        )[0] * 4 * env * dd.lag(0.05);
        sig = AnalogVintageDistortion.ar(
            input: sig,
            drivegain: 1, bias: 0, lowgain: 0.3, highgain: 0.3,
            shelvingfreq: 600, oversample: 0
        ) * 0.25;
        sig = AnalogVintageDistortion.ar(
            input: sig,
            drivegain: 1, bias: 0, lowgain: 0.3, highgain: 0.3,
            shelvingfreq: 600, oversample: 0
        ) * 0.25;
        sig = AnalogVintageDistortion.ar(
            input: sig,
            drivegain: 1, bias: 0, lowgain: 0.3, highgain: 0.3,
            shelvingfreq: 600, oversample: 0
        ) * 0.75;
        ~v.(sig, 100 + (4000 * env) + 100) * 0.1 ! 2 * dd.lag(0.05);
    }.play(fadeTime: 0);
});
)



(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    // ~x3b.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1);
/*    ~x3bbb.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1);
    ~guitOld.stop;
    ~guitOldB.stop;
    if(~toms2.isPlaying, {~toms2.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
 */
    if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms = {
        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[1] * dd;
        var trig = t;
        var trig2 = t + DelayN.kr(t, 0.5, ~nT.beatDur / 8);
        var pat0 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        var pat1 = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0];
        var pat2 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1];
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24] + 12,
            engine: 9,
            harm: [0.25, 0.4, 0.4, 0.25],
            timbre: [1, 1, 1, 1],
            morph: 0.75 - [0, 0.2, 0, -0.1],
            trigger: (trig!3)++(trig2!1) * [block0, block1, block1, block2] * trigGate,
            decay: [0.9, 0.6, 0.6, hh] * 0.125,
            lpg_colour: [0.75, 0.75, 0.75, 1],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        );
        var v = 0;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 2 + (sig[3][v] * 0.15)]!2 + sig2;

        sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        sig3 = [sig2, sig3] * 0.5;
        sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500) - 400, 0, 5) * 8;
        sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig * 0.65;
    }.play(fadeTime: 0.01).register;
});
)

// Avec LocalIn
~msg
(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    if(~toms2.isPlaying, {~toms2.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms2 = {
        | trigGate = 1 |
        var tr = ~tks.(1, trigGate);
        var dd = tr[1];
        var t = (tr[0]) * dd;
        var trig = t;
        var trig2 = ~div8.(tr[0]) * dd;
        var pat0 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
        var pat1 = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
        var pat2 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ++ (0!16);
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var in = LocalIn.ar(2);
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24] + 12,
            engine: 9,
            harm: [0.25, 0.4, 0.4, 0.4],
            timbre: [1, 1, 1, 1],
            morph: 0.75 - [0, 0.2, 0, -0.2],
            trigger:
            (trig!3)++(trig2!1) + [
                0,
                DelayN.kr(trig, 1, 0.01),
                DelayN.kr(trig, 1, 0.01),
                0
            ] * [block0, block1, block1, block2] * trigGate,
            decay: [0.9, 0.6, 0.6, 0.9] * 0.5,
            lpg_colour: [0.75, 0.75, 0.75, 1],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        ) * dd.lag(0.05);
        var v = 1;
        var clean;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 2 + (sig[3][v] * 0.5 * 0)]!2 + sig2;
        // sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = [sig2, sig3] * 0.25;
        sig = sig + (~v.(sig, 3000, 0, 5) * 8);
        clean = sig;
        sig = in + sig;
        LocalOut.ar(~v.(DelayC.ar(sig * 0.9, 1, 0.25*~nT.beatDur), 2000));
        // sig = CombC.ar(sig, 1, 0.125, 2);
        sig = clean + (sig * 0.25);
        sig = sig + (CombC.ar(sig, 1, 0.25*~nT.beatDur, 2) * 0.125*0.25);
        // sig = ~v.(sig, 12000);
        // sig = sig + CombC.ar(sig, 1, 0.125 * 2.5, 2);
        // sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500), 0, 5) * 8;
        // sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig;
    }.play(fadeTime: 0.01).register;
});
)


// Avec instabilité.

(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    // ~x3b.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1);
x.free;
x = {
        | trigGate = 1|
        var tr = ~tks.(1, trigGate);
        var dd = tr[1];
        var t = (tr[0]) * dd;
        var trig = t;
    var safeEnv = EnvGen.kr(Env([0,0,1], [0.009,0.001]));
    var sig = MiBraids.ar(27+0, 0.5, ~lfo.([3,3.1],0.5,0.55), model: 14);
    ~v.(sig,200) * 0.3 * Line.kr(0,1,0.125) * safeEnv * dd.lag(0.1);
}.play;
/*    ~x3bbb.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1);
    ~guitOld.stop;
    ~guitOldB.stop;
    if(~toms2.isPlaying, {~toms2.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
 */
    if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms = {
        | trigGate = 1 |
        var tr = ~tks.(1, trigGate);
        var dd = tr[1];
        var t = (tr[0]) * dd;
        var trig = t;
        var trig2 = ~div8.(tr[0]) * dd;
        var pat0 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
        var pat1 = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0];
        var pat2 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1];
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var sta = Demand.kr(t, 0, Dseq([1, 0, 0, 0], inf));
        var gli= \gli.kr(0.1);
        var sto = Demand.kr(sta, 0, Dseq((1!16)++Dwrand([1, 0], [1-gli, gli], inf), inf));
        var rep = SendReply.kr(sta, '/glitchListener', 1 - sto, 1);
        var si = 1 - sto * 0.5;
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24] + 12,
            engine: \engine.kr(9),
            harm: [0.25, 0.4, 0.4, 0.25],
            timbre: [1, 1, 1, 1],
            morph: 0.75 - [0, 0.2, 0, -0.1],
            trigger: (trig!3)++(trig2!1) * [block0, block1, block1, block2] * trigGate * sto,
            decay: [0.9, 0.6, 0.6, hh] * 0.5 + (1 - sto),
            lpg_colour: [0.75, 0.75, 0.75, 1],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        ) * dd.lag(0.025);
        var v = 0;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 2 + (sig[3][v] * 0.15)]!2 + sig2;
        sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25 + (si*0.7), algo: 1, timb: 0.4 + si)[0]);
        sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25 + (si*0.7), algo: 1, timb: 0.4 + si)[0]);
        sig3 = [sig2, sig3] * 0.5;
        sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500) - 400, 0, 5) * 8;
        sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig = sig * 0.65 * 0.5 * dd.lag(0.025);
        // sig = ~v.(sig, 2000,0,5);
    }.play(fadeTime: 0.01).register;
});
)

~toms.set(\gli, 0.9);
~toms.set(\engine, 9);
~toms.set(\engine, 10);
~toms.set(\engine, 5);
~toms.set(\engine, 8);

(
// ~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~glitchListen.free;
~glitchListen = OSCdef(\listener, {|msg|
        var data = msg[3..];
    // var data = msg;
    // data[0].postln;
    // ~msg = ~msg[0] ++ ~msg[1] ++ data[0] ++ ~msg[3] ++ ~msg[4] ++ ~msg[5];
    ~toOSC.sendMsg("/glitch", data[0]);
}, '/glitchListener');
)

~msg[0] = "9"
~msg = ~msg[0] ++ ~msg[2] ++ ~msg[3] ++ ~msg[4] ++ ~msg[5] ++ ~msg[6] ++ ~msg[7];
~msg
String


(
    if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    if(~toms3.isPlaying, {~toms3.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
x.set(\gate, 0, \fadeTime, 0.1);
)


// Hats très hauts
(
v.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1);
v = {
    | trigGate = 1 |
        var tr = ~tks.(1, trigGate);
        var dd = tr[1];
        var t = (tr[0]) * dd;
    var b = t * Demand.kr(t, 0, Dseq([1], inf));
    var m = Demand.kr(t, 0, Dseq([0.75, 0.94].stutter(4), inf));
    var m2 = Demand.kr(t, 0, Dseq([0, 24].stutter(4), inf));
    var e = EnvGen.kr(Env.new([0, 1, 0], [0.001, 0.5], ['lin', -8]), gate: t);
    var sig = MiPlaits.ar(
        pitch: 40 + 7 + 24,    engine: 15,
        harm: 0.25,      timbre: 0.85,     morph: 0.5,
        trigger: t,   level: t.lag(0.2) * 1,
        fm_mod: 0,    timb_mod: 0,     morph_mod: 0,
        decay: 0.5,   lpg_colour: 0
    )[0];
    // sig = sig * 0.125 + ;
/*    sig = MiWarps.ar(sig,
        CombC.ar((K2A.ar(t!2)*4),1,~toFreq.("A4").reciprocal,0.25), 0.9, 0.25, algo:1, timb: 0.4)[0];
 */   // sig = K2A.ar(Impulse.kr(8)!2);
    // sig = [sig, DelayC.ar(sig, 0.5, 0.02)];
    // sig = sig + ([sig[1], sig[0]] * 0.25);
    sig = ~v.(sig, 2000 * e + 1000, 0, 5) * 1;
    sig = sig * 0.1 * 4 ! 2;
}.play(fadeTime: 0);
)
