(
var dir = thisProcess.nowExecutingPath.dirname +/+ "samples/";
var sf = PathName.new(dir);
~samples = ();
sf.entries.do({| path, i |
    ~samples.put(path.fileNameWithoutExtension.asSymbol, 
        Buffer.read(s, path.fullPath)
    );
});
~samples;
)

// ——————————————————————————————— //
// Les guitares qui grincent et larmoient.
// ——————————————————————————————— //
([0.25,0.5].wrapExtend(6)++[0.75,1]).sum
(
~buzzMid.stop;
~buzzMid = Pbind(
    \instrument, \samplerFlipLPF,
    \buf, ~samples.at('buzzy01'),
    \spos,1.5,
    \susT, ~samples.at('buzzy01').duration-1-0.001-1.5,
    \atk, 0.025,
    \rel, 1,
    \dur, Pseq([8], inf),
    \amp, 16
).play(~nT, quant: [4]);

~buzzBass.stop;
~buzzBass = Pbind(
    \instrument, \sampler,
    \buf, ~samples.at('buzzy-bass'),
    \spos,0,
    \susT, ~samples.at('buzzy-bass').duration-1-0.001,
    \atk, 0.025,
    \rate, 0.midiratio,
    \rel, 1,
    \dur, Pseq([Rest(4), 4], inf),
    \amp, 3
).play(~nT, quant: [4, -0.2]);
)

// ——————————————————————————————— //
// La guitare qui murmure.
// ——————————————————————————————— //

(
~buzz.stop;
~buzz = Pbind(
    \instrument, \sampler,
    \buf, ~samples.at('buzzy01'),
    \susT, ~samples.at('buzzy01').duration-0.01-0.001*0.5,
    \dur, Pseq([3, 8-3], inf),
    \atk, 0.1,
    \amp, Pseq([\rest, 1.5], inf)
).play(~nT, quant: [4, -0.0625*2]);
)


(
~buzzyHats.stop;
~buzzyHats = Pbind(
    \instrument, \sampler,
    \buf, ~samples.at('buzzy02'),
    \dur, 0.25 * (4*0.25),q;
    \amp, Pseq([1, 0.75, 0.75, 0.75]*0.25, inf) + Pseq(Pseries(0, 0.1, 16).asStream.nextN(16), inf) * 0.5
).play(~nT, quant: [4, 0]);
)
~ro.()
(
~buzzyHats.stop;
~buzzyHats = Pbind(
    \instrument, \sampler,
    \buf, ~samples.at('buzzy02'),
    \dur, Pseq([0.25,0.5].wrapExtend(8)++[0.5,0.5], inf),
    \amp, Pseq([1, 0.75]*0.25, inf) + Pseq(Pseries(0, 0.1, 20).asStream.nextN(20), inf) * 0.5
).play(~nT, quant: [4, 0]);
)

go oubliette



(
~buzzyHats.stop;
~buzzyHats = Pbind(
    \instrument, \sampler,
    \buf, ~samples[1],
    \dur, 0.25,
    \amp, Pseq([1, 0.75, 0.75, 0.75]*0.25, inf)
).play(~nT, quant: [4, 0]);
)
-1.midiratio
(
var n = \rest;
~punchy.stop;
~punchy = Pbind(
    \instrument, \samplerHPF,
    \buf, ~samples[3],
    \dur, 0.5,
    \amp, Pseq([n, n, 2, n], inf)
).play(~nT, quant: [4, -0.0625]);
)

~nT.beatDur

(
~buzzMid.stop;
~buzzMid = Pbind(
    \instrument, \samplerFlip,
    \buf, ~samples[0],
    \spos,1.5,
    \susT,~nT.beatDur*4,
    \atk, 0.025,
    \dur, 4,
    \amp, 16
).play(~nT, quant: [4]);
)
~samples[2]

0.25 * 5.midiratio