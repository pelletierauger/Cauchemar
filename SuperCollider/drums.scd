
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

go samples
go oubliette

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




(
~nT.sched(~nT.timeToNextBeat(quant: 4) - (~nT.beatDur * 0.5), {
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
            engine: \engine.kr(5),
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
        sig = ~v.(sig, 2000,0,5) * Line.kr(0, 1, 30);
    }.play(fadeTime: 0.01).register;
});
)