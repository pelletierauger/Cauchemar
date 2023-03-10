(
~nT.sched(~nT.timeToNextBeat(quant: 4), {
    // if(~toms.isPlaying, {~toms.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
 ~amas.set(\gate, 0, \fadeTime, 1);
 ~amas = {
     | trigGate = 1 |
     var tr = In.kr(~cb, 2) * trigGate;
     var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
     var t = tr[0] * dd * Demand.kr(tr[0] * dd,0, Dseq([1,0,0,0] ++(0!4),inf));
     var d = Demand.kr(t, 0, Drand([0, 1],inf) ! 20).lag(1);
     var sig = MiBraids.ar(
         \pitch.kr(27 + 12) * ((1..20) / 400 + 1) + [0, 3, 7, 14, 15].wrapExtend(20),
         timbre:~lfo.(0.01),
         color: 0.75,
         model:38
     ).scramble;
     sig = sig * d;
     sig = Splay.ar(sig) * 0.5 * 1 * Line.kr(0,1,5) * 0.5;
}.play;
});
)


~amas.set(\pitch, 27 + 0);
~amas.set(\pitch, 27 - 12 - 12);

(
~nT.sched(~nT.timeToNextBeat(quant: 4), {
 ~amasAmythists.free;
 ~amasAmythists =
    {        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[0] * dd * Demand.kr(tr[0]*dd,0, Dseq([1,0,0,0] ++(0!4),inf));
    var d = Demand.kr(t, 0, Drand([0,1],inf)!20).lag(1);
    var sig = MiBraids.ar(
        31+12*((1..20)/400+1) + [0,3,7,14,15].wrapExtend(20),
        timbre:~lfo.(0.01),
        color: 0.75,
        model:42).scramble;
    sig = sig * d;
    sig = Splay.ar(sig) * 1.6;
}.play;
});
)


(
~nT.sched(~nT.timeToNextBeat(quant: 4), {
 ~amasAmythistZ.free;
 ~amasAmythistZ =
    {        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[0] * dd * Demand.kr(tr[0]*dd,0, Dseq([1,0,0,0] ++(0!4),inf));
     var d = Demand.kr(t, 0, Drand([0,1],inf)!20).lag(1);
    var sig = MiBraids.ar(
        27+24*((1..20)/400+1) + [0,3,7,14,15].wrapExtend(20),
        timbre:~lfo.(0.01),
        color: 0.75,
        model:42).scramble;
    sig = sig * d;
    sig = Splay.ar(sig) * 1;
    sig = ~v.(sig,1000,0,5) * 4;
}.play;
});
)



(
~buzzyHats.stop;
~buzzyHats = Pbind(
    \instrument, \sampler,
    \buf, ~samples.at('buzzy02'),
    \dur, 0.25 * (4*0.25),
    \amp, Pseq([1, 0.75, 0.75, 0.75]*0.25, inf) + Pseq(Pseries(0, 0.1, 16).asStream.nextN(16), inf) * 0.5
).play(~nT, quant: [4, 0]);
)

(
var n = \rest;
~punchy2.stop;
~punchy2 = Pbind(
    \instrument, \samplerHPF,
    \buf, ~samples[3],
    \spos, 0.15,
    \dur, 0.75 * 0.5,
    \amp, Pseq([4] * 8, inf)
).play(~nT, quant: [4, -0.01]);
)




(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
    if(~toms3.isPlaying, {~toms3.set(\trigGate, 0, \gate, 0, \fadeTime, 10.1)});
    ~toms3 = {
        | trigGate = 1 |
        var tr = In.kr(~cb, 2) * trigGate;
        var dd = Demand.kr(tr[0], 0, Dseq([1])); // This opens up the triggers.
        var t = tr[1] * dd;
        var trig = t;
        var trig2 = t + DelayN.kr(t, 0.5, ~nT.beatDur / 8);
        var a = Demand.kr(t, 0, Dseq((0!16)++(0!16),inf));
        var pat0 = [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, a, 0, a];
        var pat1 = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, a, 0];
        var pat2 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] ++ (0!16);
        var block0 = Demand.kr(trig, 0, Dseq(pat0, inf));
        var block1 = Demand.kr(trig, 0, Dseq(pat1, inf));
        var block2 = Demand.kr(trig2, 0, Dseq(pat2, inf));
        var dm = Demand.kr(trig * block2, 0, Dseq([0.7, 0.6], inf));
        var hh = Demand.kr(trig * block2, 0, Dseq([0.9, 1.1], inf));
        var scr = Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf));
        var trs = (trig!3)++(trig2!1) * [block0, block1, block1, block2] * trigGate;
        var trs2 = DelayN.kr([trs[1],trs[2]],1,~nT.beatDur/32);
        var trs3 = [trs[0], trs[1]+trs2[0],trs[2]+trs2[1],trs[3]];
        var sig = MiPlaits.ar(
            pitch: 27 + [0, 12, 12, 24] + 12,
            engine: 9,
            harm: [0.25, 0.4, 0.4, 0.4],
            timbre: [1, 1, 1, 1],
            morph: 0.5 - [0, 0.2, 0, -0.2],
            trigger: trs3,
            decay: [0.9, 0.6, 0.6, 0.9] * 0.5,
            lpg_colour: [0.75, 0.75, 0.75, 1],
            // fm_mod: -0.5,
            // timb_mod: 0.5
            morph_mod: -1
        ) * dd.lag(0.05);
        var v = 1;
        var sig3;
        var sig2 = [sig[1][v], sig[2][v]] * 1.5 * Line.kr(0, 1, ~nT.beatDur * 2);
        sig = [sig[0][v] * 0 + (sig[3][v] * 0.5 * 0)]!2 + sig2;
        // sig2 = (MiWarps.ar(sig[0], PinkNoise.ar() * sig[0], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = (MiWarps.ar(sig[1], PinkNoise.ar() * sig[1], 0.75, 0.25, algo: 1, timb: 0.4)[0]);
        // sig3 = [sig2, sig3] * 0.25;
        sig = sig + (~v.(sig, 3000, 0, 5) * 8);
        // sig = sig + (CombC.ar(sig, 1, ~nT.beatDur/16, 4)*0.25);
        // sig = VAKorg35.ar(sig, 4000, 0.125, 0.125, 0);
        // sig = ~v.(sig, 7000);
        // sig3 = VadimFilter.ar(sig3, scr.linlin(0, 1, 5000, 500), 0, 5) * 8;
        // sig = sig + (sig3 * Demand.kr(trig!2, 0, Dwhite(0.00, 1.00, inf)).lag(1));
        sig * 0.5;
    }.play(fadeTime: 0.01).register;
});
)


