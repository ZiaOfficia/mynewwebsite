"""
Score and sound design for the HiBrands intro film (website hero).

  python3 audio/make_intro_music.py
    -> public/audio/intro.wav           final mix (music + sound design), -14 LUFS
    -> public/audio/intro-music.wav     music stem
    -> public/audio/intro-sfx.wav       sound-design stem (the "music-free" version)

Original, synthesised here. 100 BPM; timing from src/v4/timeline.json.
Arc: a dark A-minor drone with deep pulses and ticks, tension through F, G and E,
then the reveal resolves to C major on the downbeat with an impact and the "Hi"
sonic signature (G5 to C6). A confident groove for the engineers, stabs for
"Premium / Local / Zero compromise", a climax for the network, a clean final chord.
"""
import json
import os
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy import signal
from scipy.ndimage import minimum_filter1d

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TL = json.load(open(os.path.join(ROOT, "src", "v4", "timeline.json")))
SR = 48000
FPS = TL["fps"]
BEAT = 60 / TL["bpm"]
BAR = 4 * BEAT
LEN = TL["durationInFrames"] / FPS
N = int(LEN * SR)
rng = np.random.default_rng(23)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, x, t, g=1.0):
    i = int(round(t * SR))
    if i < 0 or i >= len(buf):
        return
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i] * g


def pan(x, p):
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], 1)


def lp(x, fc, o=2):
    return signal.sosfilt(signal.butter(o, min(fc, SR / 2 - 200), "low", fs=SR, output="sos"), x, axis=0)


def hp(x, fc, o=2):
    return signal.sosfilt(signal.butter(o, fc, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, o=2):
    return signal.sosfilt(signal.butter(o, [lo, min(hi, SR / 2 - 200)], "band", fs=SR, output="sos"), x, axis=0)


def env(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1), endpoint=False), np.linspace(1, s, max(d, 1), endpoint=False), np.full(sus, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def make_ir(sec=3.2, decay=2.0):
    n = int(sec * SR)
    t = np.arange(n) / SR
    ir = np.stack([lp(rng.standard_normal(n), 6000) * np.exp(-decay * t) for _ in range(2)], 1)
    ir[: int(0.025 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(axis=0))


IR = make_ir()


def verb(x):
    return np.stack([signal.fftconvolve(x[:, c], IR[:, c])[: len(x)] for c in range(2)], 1)


def saw(f, n, harm=16, ph=None):
    t = np.arange(n) / SR
    out = np.zeros(n)
    p0 = rng.uniform(0, 6) if ph is None else ph
    for k in range(1, harm + 1):
        if f * k > 10000:
            break
        out += np.sin(2 * np.pi * f * k * t + p0 * k) / k
    return out


def pad(notes, dur, lvl=1.0, cut=2500, attack=0.6):
    n = int((dur + 1.0) * SR)
    out = np.zeros(n)
    for note in notes:
        for dc in (-7, 0, 7):
            out += saw(midi(note) * 2 ** (dc / 1200), n, 12)
    out = lp(hp(out, 120), cut)
    return out * env(n, attack, 0.5, 0.85, 0.9) * 0.014 * lvl


def drone(note, dur, lvl=1.0):
    n = int((dur + 1.0) * SR)
    t = np.arange(n) / SR
    f = midi(note)
    x = np.sin(2 * np.pi * f * t) + 0.5 * lp(saw(f, n, 8), 180 + 60 * np.sin(t * 0.7).mean())
    return x * env(n, 1.0, 0.5, 0.9, 1.0) * 0.045 * lvl


def sub_pulse(note, lvl=1.0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    f = midi(note)
    x = np.sin(2 * np.pi * f * t + 2.2 * np.exp(-t * 18)) * np.exp(-t * 4.5)
    return lp(x, 160) * 0.18 * lvl


def tick(lvl=1.0):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 6000) * np.exp(-t * 220) * 0.07 * lvl


def pluck(note, lvl=1.0, bright=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = midi(note)
    m = np.sin(2 * np.pi * f * 3 * t) * (1.6 * bright) * np.exp(-t * 24)
    return np.sin(2 * np.pi * f * t + m) * np.exp(-t * 9) * 0.09 * lvl


def bass(note, dur, lvl=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    x = np.tanh((np.sin(2 * np.pi * f * t) + 0.35 * saw(f, n, 6)) * 1.4)
    return hp(lp(x, 380), 45) * env(n, 0.004, 0.1, 0.75, 0.05) * 0.075 * lvl


def kick(lvl=1.0):
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    k = np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-t * 32)) / SR) * np.exp(-t * 10)
    return k * 0.26 * lvl


def clap(lvl=1.0):
    n = int(0.3 * SR)
    b = np.zeros(n)
    for off in (0, 0.01, 0.02):
        o = int(off * SR)
        b[o:] += np.exp(-np.arange(n - o) / SR * (60 if off < 0.02 else 13))
    return pan(bp(rng.standard_normal(n), 900, 4500) * b * 0.09 * lvl, 0.05)


def hat(lvl=1.0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    return pan(hp(rng.standard_normal(n), 8000) * np.exp(-t * 80) * 0.06 * lvl, 0.3)


def lead(note, dur, lvl=1.0):
    n = int((dur + 0.4) * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.4)
    ph = 2 * np.pi * np.cumsum(midi(note) * vib) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 9))
    return lp(x, 3200) * env(n, 0.04, 0.2, 0.7, 0.35) * 0.05 * lvl


def bell(freqs, sec=2.0, lvl=0.3):
    n = int(sec * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for r, a, d in ((1, 1, 2.0), (2.76, 0.32, 4.4), (5.4, 0.14, 8)):
            x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d)
    x *= np.minimum(1, t / 0.003)
    return np.stack([x, x], 1) / np.abs(x).max() * lvl


# ── Score ──────────────────────────────────────────────────────────────────
#           bar: chord (midi), root
CH = {
    "Am": ([57, 60, 64], 45), "F": ([53, 57, 60], 41), "G": ([55, 59, 62], 43), "E": ([56, 59, 64], 40),
    "C": ([55, 60, 64], 48), "Gs": ([55, 60, 62], 43),
}
PLAN = ["Am", "Am", "F", "G", "E", "C", "G", "C", "G", "Am", "F", "C", "G", "Am", "F", "Gs", "C", "C", "C"]
N_BARS = len(PLAN)
MEL = {  # lifeline climax melody, (beat, length, midi)
    13: [(0, 1, 76), (1, 1, 79), (2, 2, 81)],
    14: [(0, 1, 79), (1, 1, 77), (2, 1, 76), (3, 1, 74)],
    15: [(0, 2, 74), (2, 1, 76), (3, 1, 79)],
}

B = {k: np.zeros((N + 5 * SR, 2)) for k in ("pad", "drone", "pulse", "tick", "pluck", "bass", "drums", "lead", "logo")}
kicks = []
for bar, name in enumerate(PLAN):
    st = bar * BAR
    notes, root = CH[name]
    if bar <= 4:  # the dark opening and tension
        place(B["drone"], drone(root - 12 if root > 40 else root, BAR), st)
        for b in (0, 2) if bar < 2 else (0, 1, 2, 3):
            place(B["pulse"], sub_pulse(root - 12 + 12 * (root < 40), 0.8 + 0.1 * bar), st + b * BEAT)
        for s16 in range(16):
            if bar >= 1 and (s16 % 2 == 0 or bar >= 3):
                place(B["tick"], pan(tick(0.6 + 0.15 * bar + (0.3 if s16 % 4 == 0 else 0)), 0.4 if s16 % 2 else -0.4), st + s16 * BEAT / 4)
        if bar >= 2:
            cut = 600 + 700 * (bar - 2)
            place(B["pad"], pan(pad(notes, BAR, 0.7, cut), 0), st)
            for k in range(8):
                place(B["pluck"], pan(pluck(notes[k % 3] + 12, 0.5, 0.6), -0.3 if k % 2 else 0.3), st + k * BEAT / 2)
    elif bar in (5, 6):  # after the reveal: open and warm
        place(B["pad"], pan(pad(notes + [notes[0] + 12], BAR, 1.1, 3200, 0.2), 0), st)
        place(B["bass"], bass(root - 12, BAR * 0.95, 0.7), st)
        for k in range(8):
            place(B["pluck"], pan(pluck(notes[(k * 2) % 3] + 24, 0.55), 0.35 if k % 2 else -0.35), st + k * BEAT / 2)
    elif bar <= 15:  # the groove, then the climax
        climax = bar >= 13
        place(B["pad"], pan(pad(notes + [notes[0] + 12], BAR, 0.9 if not climax else 1.2, 3000 if not climax else 4200), 0), st)
        for k in range(8):
            place(B["bass"], bass(root - 12 + (12 if k % 2 else 0), BEAT / 2 * 0.9, 0.8 + 0.2 * (k % 2 == 0)), st + k * BEAT / 2)
        for k in range(8):
            place(B["pluck"], pan(pluck([notes[0], notes[1], notes[2], notes[1]][k % 4] + 12, 0.85), 0.35 if k % 2 else -0.35), st + k * BEAT / 2)
        for b in range(4):
            bt = st + b * BEAT
            place(B["drums"], kick(1.0), bt)
            kicks.append(bt)
            if b in (1, 3):
                place(B["drums"], clap(1.0), bt)
            for h in (0.5,) if not climax else (0.25, 0.5, 0.75):
                place(B["drums"], hat(0.8), bt + h * BEAT)
        if bar in (10, 11, 12):  # stabs under "Premium / Local / Zero compromise"
            stab = pad(notes + [notes[0] + 12, notes[2] + 12], BEAT * 0.6, 3.0, 5000, 0.005)
            place(B["pad"], pan(stab, 0), st)
        if bar in MEL:
            for b, l, note in MEL[bar]:
                place(B["lead"], pan(lead(note, l * BEAT, 1.0), 0.1), st + b * BEAT)
    else:  # final chord
        if bar == 16:
            place(B["pad"], pan(pad([48, 55, 60, 64, 67, 72], BAR * 2.6, 1.3, 3800, 0.05), 0), st)
            place(B["bass"], bass(36, BAR * 1.8, 0.9), st)
            place(B["drone"], drone(36, BAR * 2.2, 0.6), st)
            for k in range(6):
                place(B["pluck"], pan(pluck([72, 76, 79, 84, 79, 76][k], 0.45), 0.3 if k % 2 else -0.3), st + BAR * 0.5 + k * BEAT / 2)

# Risers into the reveal and the final statement
for f in TL["impacts"]:
    n = int(2 * BAR * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    r = np.zeros(n)
    for a in range(0, n, 2048):
        r[a : a + 2048] = lp(noise[a : a + 2048], 250 + 9000 * (a / n) ** 2.2, 1)
    r *= (t / t[-1]) ** 2.4 * 0.08
    place(B["drums"], np.stack([r, r[::-1] * 0 + r], 1), f / FPS - 2 * BAR)

# Sidechain
pump = np.ones(len(B["pad"]))
for kt in kicks:
    i0 = int(kt * SR)
    n = int(0.28 * SR)
    s_ = 1 - 0.42 * np.exp(-np.arange(n) / SR / 0.08)
    j = min(len(pump), i0 + n)
    pump[i0:j] = np.minimum(pump[i0:j], s_[: j - i0])
B["pad"] *= pump[:, None]
B["bass"] *= (0.45 + 0.55 * pump)[:, None]

# Pluck delay
d = int(BEAT * 0.75 * SR)
src = B["pluck"].copy()
for k in range(1, 4):
    sh = np.zeros_like(src)
    sh[d * k :] = src[: -d * k]
    if k % 2:
        sh = sh[:, ::-1]
    B["pluck"] += lp(sh, 3800) * 0.3 ** k

dry = sum(B.values())
wet = verb(B["pad"] * 0.4 + B["pluck"] * 0.5 + B["lead"] * 0.6 + B["drums"] * 0.08 + B["tick"] * 0.4)
music = hp(dry + hp(wet, 220) * 0.6, 30)


def shelf(x, fc, g, kind):
    A = 10 ** (g / 40)
    w = 2 * np.pi * fc / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / 2 * np.sqrt(2)
    s = 1 if kind == "low" else -1
    b = [A * ((A + 1) - s * (A - 1) * cw + 2 * np.sqrt(A) * al), s * 2 * A * ((A - 1) - s * (A + 1) * cw), A * ((A + 1) - s * (A - 1) * cw - 2 * np.sqrt(A) * al)]
    a = [(A + 1) + s * (A - 1) * cw + 2 * np.sqrt(A) * al, -s * 2 * ((A - 1) + s * (A + 1) * cw), (A + 1) + s * (A - 1) * cw - 2 * np.sqrt(A) * al]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


music = shelf(music, 140, -5.0, "low")
music = shelf(music, 3000, 4.0, "high")

# Dynamic arc (dB) across the film
SC = TL["scenes"]
ARC = [(0, -5), (SC["shift"]["from"], -3.5), (SC["reveal"]["from"] + 70, -1.5), (SC["reveal"]["from"] + 74, 0), (SC["engineers"]["from"], 0), (SC["lifeline"]["from"], 1.5), (SC["final"]["from"], 1.0), (TL["durationInFrames"], 0)]
fr = np.arange(len(music)) / SR * FPS
music *= (10 ** (np.interp(fr, [p for p, _ in ARC], [g for _, g in ARC]) / 20))[:, None]


# ── Sound design ───────────────────────────────────────────────────────────
def sweep(sec, f0, f1, lvl, width=2.2):
    n = int(sec * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    zi = None
    for a in range(0, n, 512):
        fc = f0 * (f1 / f0) ** (a / n)
        sos = signal.butter(2, [max(30, fc / width), min(fc * width, 20000)], "band", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[a : a + 512], zi = signal.sosfilt(sos, noise[a : a + 512], zi=zi)
    t = np.linspace(0, 1, n)
    out *= np.sin(np.pi * t ** 0.7) ** 2
    p = np.linspace(-0.7, 0.7, n)
    a = (p + 1) * np.pi / 4
    st = np.stack([out * np.cos(a), out * np.sin(a)], 1)
    return st / np.abs(st).max() * lvl


def tone_sweep(sec, f0, f1, lvl):
    n = int(sec * SR)
    t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / sec)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / sec) ** 2 * (0.8 + 0.2 * np.sin(2 * np.pi * 9 * t))
    return np.stack([x, x], 1) * lvl


def activate():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    zap = bp(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 14) * (rng.random(n) > 0.7)
    hum = np.sin(2 * np.pi * 110 * t) * np.exp(-t * 3) * 0.4
    x = zap * 0.5 + hum
    return np.stack([x, x], 1) / np.abs(x).max() * 0.4


def crackle():
    n = int(0.8 * SR)
    x = np.zeros(n)
    for _ in range(14):
        i = rng.integers(0, n - 400)
        x[i : i + 300] += hp(rng.standard_normal(300), 3000) * np.exp(-np.arange(300) / 60)
    return pan(x / np.abs(x).max() * 0.25, -0.3)


def shatter():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 2500) * np.exp(-t * 9) * 0.6
    for _ in range(40):
        f = rng.uniform(3000, 9500)
        o = int(rng.uniform(0, 0.5) * SR)
        m = n - o
        tt = np.arange(m) / SR
        x[o:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(10, 25)) * rng.uniform(0.1, 0.3)
    st = np.stack([x, np.roll(x, 300)], 1)
    return st / np.abs(st).max() * 0.55


def blip():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * (1300 + 500 * t / t[-1]) * t) * np.exp(-t * 40)
    return pan(x * 0.22, rng.uniform(-0.5, 0.5))


def boom(lvl=0.9, sec=2.8):
    n = int(sec * SR)
    t = np.arange(n) / SR
    b = np.sin(2 * np.pi * np.cumsum(42 + 95 * np.exp(-t * 11)) / SR) * np.exp(-t * 3.4)
    x = 0.7 * b + hp(rng.standard_normal(n), 2500) * np.exp(-t * 16) * 0.45
    st = np.stack([x, x], 1)
    st += verb(st * 0.3)[: len(st)]
    return st / np.abs(st).max() * lvl


def hi_logo():
    # The HiBrands sonic signature: G5 then C6, bell and pluck, with a soft low C
    a = bell([midi(79)], 1.6, 0.28)
    b = bell([midi(84), midi(88)], 2.6, 0.34)
    out = np.zeros((int(3.0 * SR), 2))
    out[: len(a)] += a
    o = int(BEAT / 2 * SR)
    out[o : o + len(b)] += b[: len(out) - o]
    n = int(1.5 * SR)
    t = np.arange(n) / SR
    out[o : o + n] += np.stack([np.sin(2 * np.pi * midi(48) * t) * np.exp(-t * 3)] * 2, 1) * 0.15
    return out


SOUNDS = {
    "activate": activate(),
    "lineTone": tone_sweep(0.9, 300, 1200, 0.08),
    "low": boom(0.45, 1.6),
    "crackle": crackle(),
    "beam": sweep(0.9, 300, 9000, 0.6),
    "shatter": shatter(),
    "blip": blip(),
    "suck": sweep(0.7, 6000, 200, 0.4),
    "trace": tone_sweep(1.3, 220, 880, 0.09),
    "sweep": sweep(0.5, 800, 7000, 0.3, 1.6),
    "impact": boom(0.95),
    "impactSoft": boom(0.6, 2.4),
    "hiLogo": hi_logo(),
    "tick": tick(3.0),
    "whoosh": sweep(0.55, 250, 5000, 0.5),
    "shimmer": bell([midi(88), midi(91), midi(95), midi(100)], 1.8, 0.2),
    "stab": boom(0.35, 1.0),
    "slice": sweep(0.35, 2000, 12000, 0.55, 1.4),
    "wave": sweep(1.2, 120, 3000, 0.45),
}
sfx = np.zeros_like(music)
for c in TL["sfx"]:
    place(sfx, SOUNDS[c["sound"]], c["frame"] / FPS, c["gain"] * 0.55)
sfx += verb(sfx) * 0.12

L = N
music, sfx = music[:L], sfx[:L]
fade = int(1.8 * SR)
for x in (music, sfx):
    x[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
    x[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]


def compress(x, th=-20, ratio=2.0):
    level = np.sqrt(lp(np.mean(x ** 2, axis=1), 30, 1).clip(1e-12))
    gdb = -np.maximum(0, 20 * np.log10(level) - th) * (1 - 1 / ratio)
    a, r = np.exp(-1 / (0.01 * SR)), np.exp(-1 / (0.2 * SR))
    g = np.zeros_like(gdb)
    cur = 0.0
    for i in range(0, len(g), 64):
        c = a if gdb[i] < cur else r
        cur = c ** 64 * cur + (1 - c ** 64) * gdb[i]
        g[i : i + 64] = cur
    return x * (10 ** (g / 20))[:, None]


def tp_limit(x, db):
    ceil = 10 ** (db / 20)
    pk = np.abs(signal.resample_poly(x, 4, 1, axis=0)).max(axis=1).reshape(-1, 4).max(axis=1)[: len(x)]
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    look = int(0.005 * SR)
    g = lp(minimum_filter1d(need, look * 2 + 1), 40, 1)
    g = minimum_filter1d(np.minimum(g, need), look)
    x = x * g[:, None]
    tp = np.abs(signal.resample_poly(x, 4, 1, axis=0)).max()
    return x * min(1, ceil / tp)


meter = pyln.Meter(SR)


def master(x, target):
    x = compress(x)
    x = pyln.normalize.loudness(x, meter.integrated_loudness(x), target)
    return tp_limit(tp_limit(x, -1.5), -2.0)


# Duck music slightly under each sound effect
duck = np.ones(L)
for c in TL["sfx"]:
    i0 = int(c["frame"] / FPS * SR)
    n = int(0.3 * SR)
    s_ = 1 - 0.14 * np.sin(np.linspace(0, np.pi, n))
    j = min(L, i0 + n)
    if i0 < L:
        duck[i0:j] = np.minimum(duck[i0:j], s_[: j - i0])

mix = master(music * duck[:, None] + sfx, -14.0)
outdir = os.path.join(ROOT, "public", "audio")
sf.write(os.path.join(outdir, "intro.wav"), mix, SR, subtype="PCM_24")
sf.write(os.path.join(outdir, "intro-music.wav"), master(music, -16.0), SR, subtype="PCM_24")
sf.write(os.path.join(outdir, "intro-sfx.wav"), master(sfx, -18.0), SR, subtype="PCM_24")
tp = 20 * np.log10(np.abs(signal.resample_poly(mix, 4, 1, axis=0)).max())
print(f"intro.wav {len(mix) / SR:.2f}s (video {LEN:.2f}s)  {meter.integrated_loudness(mix):.1f} LUFS  true peak {tp:.2f} dBTP")
for name, a, b in [("struggle", 0, 4.8), ("shift", 4.8, 9.6), ("reveal", 9.6, 16.8), ("engineers", 16.8, 24), ("premium", 24, 31.2), ("lifeline", 31.2, 38.4), ("final", 38.4, 45.6)]:
    print(f"  {name:10s} {meter.integrated_loudness(mix[int(a * SR):int(b * SR)]):6.1f} LUFS")
