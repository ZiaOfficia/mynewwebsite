"""
Soundtrack for the HiBrands brand film (the shop owner's story).

  python3 audio/make_film_music.py   ->  public/audio/brandfilm.wav  (48 kHz, 24-bit, stereo)

Original score, synthesised here, following the story section by section
(src/v3/timeline.json "music"):
  dream  gentle piano arpeggios, shop and street ambience       C  Am  F  G
  low    near silence: a soft drone, single piano notes, room   Am  F
  pulse  muted plucks and a heartbeat kick build as engineers connect   Am F C G
  full   the HiBrands reveal: pad, plucks, bass, drums          C  G  Am  F
  warm   piano melody over strings for his happy ending, then a swell
  end    a resolving chord and the "Hi" chime
Interface sounds: Kenney CC0 (audio/sfx) plus a few synthesised ones.
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
TL = json.load(open(os.path.join(ROOT, "src", "v3", "timeline.json")))

SR = 48000
FPS = TL["fps"]
BEAT = 60 / TL["bpm"]
BAR = 4 * BEAT
LEN = TL["durationInFrames"] / FPS
N = int(LEN * SR)
N_BARS = int(round(LEN / BAR))
rng = np.random.default_rng(11)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, x, t, gain=1.0):
    i = int(round(t * SR))
    if i >= len(buf) or i < 0:
        return
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i] * gain


def pan(x, p):
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], 1)


def lowpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, min(fc, SR / 2 - 100), "low", fs=SR, output="sos"), x, axis=0)


def highpass(x, fc, order=2):
    return signal.sosfilt(signal.butter(order, fc, "high", fs=SR, output="sos"), x, axis=0)


def bandpass(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def env(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1), endpoint=False), np.linspace(1, s, max(d, 1), endpoint=False), np.full(sus, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def make_ir(seconds=3.0, decay=2.4):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        ir[:, ch] = lowpass(rng.standard_normal(n), 5500) * np.exp(-decay * t)
    ir[: int(0.02 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(axis=0))


IR = make_ir()


def reverb(x):
    out = np.zeros((len(x) + len(IR) - 1, 2))
    for ch in range(2):
        out[:, ch] = signal.fftconvolve(x[:, ch], IR[:, ch])
    return out[: len(x)]


# ── Instruments ────────────────────────────────────────────────────────────
def piano(note, dur, vel=0.8):
    f = midi(note)
    n = int((dur + 1.6) * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 10):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > 12000:
            break
        x += (1 / k ** 1.3) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6)) * np.exp(-t * (0.9 + 0.55 * k) * (1 + (note - 60) / 48))
    x *= np.minimum(1, t / 0.003)
    hammer = lowpass(rng.standard_normal(n), 2500) * np.exp(-t * 90) * 0.06
    x = x + hammer
    # damper: release after the written duration
    rel = np.ones(n)
    k0 = int(dur * SR)
    rel[k0:] = np.exp(-np.arange(n - k0) / SR * 5)
    return x * rel * vel * 0.16


def strings(notes, dur, level=1.0, bright=2400):
    n = int((dur + 1.2) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for note in notes:
        for dc in (-8, 0, 8):
            vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.2 * t + rng.uniform(0, 6))
            f = midi(note) * 2 ** (dc / 1200) * vib
            ph = 2 * np.pi * np.cumsum(f) / SR
            saw = np.zeros(n)
            for k in range(1, 14):
                if midi(note) * k > 9000:
                    break
                saw += np.sin(k * ph) / k
            out += saw
    out = lowpass(highpass(out, 140), bright)
    return out * env(n, 0.7, 0.4, 0.9, 1.0) * 0.012 * level


def pad(notes, dur, level=1.0, lp=3000):
    n = int((dur + 0.8) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for note in notes:
        for dc in (-6, 0, 6):
            f = midi(note) * 2 ** (dc / 1200)
            for k in range(1, 12):
                if f * k > 8000:
                    break
                out += np.sin(2 * np.pi * f * k * t + rng.uniform(0, 6)) / k
    out = lowpass(highpass(out, 150), lp)
    return out * env(n, 0.4, 0.4, 0.85, 0.7) * 0.016 * level


def pluck(note, vel=1.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = midi(note)
    mod = np.sin(2 * np.pi * f * 4 * t) * 2.0 * np.exp(-t * 26)
    x = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 8)
    return x * 0.11 * vel


def bass(note, dur, vel=1.0, soft=False):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = midi(note)
    x = np.tanh((np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * 1.5)
    x = lowpass(x, 300 if soft else 420) * (env(n, 0.25, 0.4, 0.8, 0.4) if soft else env(n, 0.005, 0.12, 0.7, 0.06))
    return highpass(x, 40) * 0.12 * vel


def kick(vel=1.0, soft=False):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 10)
    if soft:
        k = lowpass(k, 700)
    return k * 0.3 * vel


def clap(vel=1.0):
    n = int(0.3 * SR)
    burst = np.zeros(n)
    for off in (0, 0.011, 0.022):
        o = int(off * SR)
        burst[o:] += np.exp(-np.arange(n - o) / SR * (60 if off < 0.02 else 14))
    return pan(bandpass(rng.standard_normal(n), 900, 4200) * burst * 0.1 * vel, 0.05)


def hat(vel=1.0):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return pan(highpass(rng.standard_normal(n), 7500) * np.exp(-t * 70) * 0.07 * vel, 0.3)


def bell(freqs, seconds=2.0, level=0.3):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for r, a, d in ((1, 1, 2.2), (2.76, 0.35, 4.5), (5.4, 0.15, 8)):
            x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d)
    x *= np.minimum(1, t / 0.004)
    return np.stack([x, x], 1) / np.abs(x).max() * level


# ── Arrangement ────────────────────────────────────────────────────────────
PROG = {
    "dream": [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]],  # C Am F G
    "low": [[45, 52, 57, 60], [41, 48, 53, 57]],  # Am F
    "pulse": [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]],  # Am F C G
    "full": [[48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]],  # C G Am F
    "warm": [[48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64]],
    "end": [[48, 55, 60, 64]],
}
ROOTS = {
    "dream": [36, 33, 29, 31],
    "low": [33, 29],
    "pulse": [33, 29, 36, 31],
    "full": [36, 31, 33, 29],
    "warm": [36, 31, 33, 29, 36],
    "end": [36],
}
MELODY = [  # warm section, (beat, length, midi)
    [(0, 1, 76), (1, 1, 79), (2, 0.5, 76), (2.5, 0.5, 74), (3, 1, 72)],
    [(0, 1.5, 74), (1.5, 0.5, 71), (2, 1, 74), (3, 1, 79)],
    [(0, 1, 72), (1, 1, 76), (2, 1.5, 81), (3.5, 0.5, 79)],
    [(0, 1, 77), (1, 1, 76), (2, 1, 74), (3, 1, 72)],
    [(0, 2, 76), (2, 2, 79)],
]
DREAM_TOP = [[(0, 2, 76), (2, 2, 74)], [(0, 2, 72), (2, 2, 76)], [(0, 3, 77)], [(0, 2, 74), (2, 2, 71)]]


def segment(bar):
    t = bar * BAR * FPS + 1
    seg = [m for m in TL["music"] if m["from"] <= t][-1]
    first = int(round(seg["from"] / FPS / BAR))
    return seg, bar - first


buses = {k: np.zeros((N + SR * 4, 2)) for k in ("piano", "pad", "strings", "pluck", "bass", "drums", "amb")}
kick_times = []

for bar in range(N_BARS):
    seg, i = segment(bar)
    mode = seg["mode"]
    start = bar * BAR
    prog = PROG[mode]
    chord = prog[i % len(prog)]
    root = ROOTS[mode][i % len(ROOTS[mode])]
    dim = seg.get("dim", 1.0)
    last = bar == N_BARS - 1

    if mode == "dream":
        # gentle 8th-note piano arpeggio, the top line on beats
        arp = [chord[0] - 12, chord[1], chord[2], chord[3], chord[2], chord[1], chord[2], chord[3]]
        for k, note in enumerate(arp):
            place(buses["piano"], pan(piano(note, BEAT * 0.9, (0.55 if k % 2 else 0.7) * dim), -0.2 + 0.05 * k), start + k * BEAT / 2)
        for b, l, note in DREAM_TOP[i % 4]:
            place(buses["piano"], pan(piano(note, l * BEAT, 0.75 * dim), 0.15), start + b * BEAT)
        place(buses["pad"], pan(pad(chord[1:], BAR, 0.5 * dim, 1800), 0), start)
    elif mode == "low":
        # near silence: a drone and a lonely note
        place(buses["pad"], pan(pad([chord[0] - 12, chord[0]], BAR, 0.45, 900), 0), start)
        if i % 2 == 0:
            place(buses["piano"], pan(piano(chord[3] + 12, 2 * BEAT, 0.45), 0.2), start + BEAT)
    elif mode == "pulse":
        place(buses["pad"], pan(pad(chord[1:], BAR, 0.6 + 0.12 * i, 1600 + 400 * i), 0), start)
        for k in range(8):
            place(buses["pluck"], pan(pluck(chord[1 + k % 3] + 12, 0.45 + 0.08 * i), -0.3 if k % 2 else 0.3), start + k * BEAT / 2)
        place(buses["bass"], bass(root, BAR * 0.95, 0.6, soft=True), start)
        for b in (0, 2):
            kt = start + b * BEAT
            place(buses["drums"], kick(0.5 + 0.1 * i, soft=True), kt)
            kick_times.append(kt)
    elif mode == "full":
        light = seg.get("light", False)
        place(buses["pad"], pan(pad(chord[1:] + [chord[0] + 12], BAR, 0.8), 0), start)
        arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 12, chord[1] + 24, chord[3] + 12, chord[2] + 12, chord[3] + 12]
        for k, note in enumerate(arp):
            place(buses["pluck"], pan(pluck(note, 0.9 if k % 2 == 0 else 0.65), -0.35 if k % 2 else 0.35), start + k * BEAT / 2)
        for b, l, v in [(0, 1, 0.95), (1.5, 0.5, 0.7), (2, 1, 0.9), (3.5, 0.5, 0.7)]:
            place(buses["bass"], bass(root, l * BEAT, v), start + b * BEAT)
        for b in range(4):
            bt = start + b * BEAT
            if b in (0, 2):
                place(buses["drums"], kick(0.9), bt)
                kick_times.append(bt)
            if b in (1, 3):
                place(buses["drums"], clap(0.8 if light else 1.0), bt)
            for h in (0, 0.5):
                place(buses["drums"], hat(0.45 if h == 0 else 0.75 * (0.7 if light else 1)), bt + h * BEAT)
    elif mode == "warm":
        swell = seg.get("swell", False)
        wi = i + (3 if swell else 0)  # continue the melody across the swell
        chord = PROG["warm"][wi % 5]
        root = ROOTS["warm"][wi % 5]
        place(buses["strings"], pan(strings(chord[1:] + [chord[0] + 12], BAR, 1.3 if swell else 0.9, 3200 if swell else 2200), 0), start)
        if swell:
            place(buses["strings"], pan(strings([chord[3] + 12, chord[2] + 24], BAR, 0.5, 4200), 0.1), start)
        for k in range(8):
            note = [chord[0], chord[1], chord[2], chord[3]][k % 4]
            place(buses["piano"], pan(piano(note, BEAT * 0.45, 0.4), -0.25), start + k * BEAT / 2)
        for b, l, note in MELODY[wi % 5]:
            place(buses["piano"], pan(piano(note, l * BEAT, 0.95), 0.15), start + b * BEAT)
        place(buses["bass"], bass(root, BAR * 0.95, 0.75, soft=True), start)
        if swell:
            for b in (0, 2):
                place(buses["drums"], kick(0.6, soft=True), start + b * BEAT)
                kick_times.append(start + b * BEAT)
            for b in (1, 3):
                place(buses["drums"], clap(0.45), start + b * BEAT)
    elif mode == "end":
        if i == 0:
            place(buses["strings"], pan(strings([48, 55, 60, 64, 67], BAR * 2.6, 1.1, 3000), 0), start)
            place(buses["pad"], pan(pad([48, 55, 64, 72], BAR * 2.6, 0.7), 0), start)
            place(buses["bass"], bass(36, BAR * 2.4, 0.8, soft=True), start)
            place(buses["piano"], pan(piano(60, BAR * 2, 0.8), 0), start)
            place(buses["piano"], pan(piano(64, BAR * 2, 0.6), 0.1), start + 0.03)
            place(buses["piano"], pan(piano(67, BAR * 2, 0.6), -0.1), start + 0.06)

# Ambience: shop and street in the dream and transformation, room tone at the low point
amb = buses["amb"]
for seg_name, a, b, lvl in [("dream", 0, TL["scenes"]["barrier"]["from"] + 260, 1.0), ("transform", TL["scenes"]["transform"]["from"], TL["scenes"]["ending"]["from"], 0.7)]:
    t0, t1 = a / FPS, b / FPS
    n = int((t1 - t0) * SR)
    noise = lowpass(rng.standard_normal((n, 2)), 700) * 0.012 * lvl
    noise *= np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.8 * SR))[:, None]
    place(amb, noise, t0)
    # distant birds and a soft scooter horn, sparse
    tt = t0 + 1.2
    while tt < t1 - 1:
        m = int(0.09 * SR)
        tm = np.arange(m) / SR
        chirp = np.sin(2 * np.pi * (3200 + 1600 * tm / tm[-1]) * tm) * np.sin(np.pi * tm / tm[-1]) * 0.012 * lvl
        place(amb, pan(chirp, rng.uniform(-0.8, 0.8)), tt)
        place(amb, pan(chirp, rng.uniform(-0.8, 0.8)), tt + 0.13)
        tt += rng.uniform(2.2, 4.0)

# Risers into the reveal and into the swell
for rf in TL.get("risers", []):
    n = int(2 * BAR * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    r = np.zeros(n)
    for a in range(0, n, 2048):
        r[a : a + 2048] = lowpass(noise[a : a + 2048], 300 + 7000 * (a / n) ** 2, 1)
    r *= (t / t[-1]) ** 2 * 0.07
    place(buses["drums"], np.stack([r, r], 1), rf / FPS - 2 * BAR)

# Sidechain pump
pump = np.ones(len(amb))
for kt in kick_times:
    i0 = int(kt * SR)
    n = int(0.3 * SR)
    seg_ = 1 - 0.4 * np.exp(-np.arange(n) / SR / 0.09)
    j = min(len(pump), i0 + n)
    pump[i0:j] = np.minimum(pump[i0:j], seg_[: j - i0])
buses["pad"] *= pump[:, None]
buses["strings"] *= (0.5 + 0.5 * pump)[:, None]
buses["bass"] *= (0.4 + 0.6 * pump)[:, None]

# Pluck delay
d = int(BEAT * 0.75 * SR)
src = buses["pluck"].copy()
for k in range(1, 4):
    sh = np.zeros_like(src)
    sh[d * k :] = src[: -d * k]
    if k % 2:
        sh = sh[:, ::-1]
    buses["pluck"] += lowpass(sh, 3500) * 0.3 ** k

dry = buses["piano"] + buses["pad"] + buses["strings"] + buses["pluck"] + buses["bass"] + buses["drums"] + buses["amb"]
wet = reverb(buses["piano"] * 0.6 + buses["strings"] * 0.5 + buses["pad"] * 0.35 + buses["pluck"] * 0.45 + buses["drums"] * 0.1)
music = highpass(dry + highpass(wet, 200) * 0.6, 35)


def shelf(x, fc, g, kind):
    A = 10 ** (g / 40)
    w = 2 * np.pi * fc / SR
    cw, sw = np.cos(w), np.sin(w)
    al = sw / 2 * np.sqrt(2)
    if kind == "low":
        b = [A * ((A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al)]
        a = [(A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al]
    else:
        b = [A * ((A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * al)]
        a = [(A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * al]
    return signal.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0)


music = shelf(music, 90, -3.0, "low")
music = shelf(music, 3500, 2.0, "high")

# Dynamic arc: quiet start, near silence at the low point, peaks at the reveal and the happy ending
SC = TL["scenes"]
ARC = [  # (frame, gain in dB)
    (0, -7.0), (SC["barrier"]["from"], -7.0), (SC["barrier"]["from"] + 3 * 80, -4.0),
    (SC["realize"]["from"], -3.5), (SC["birth"]["from"] + 120, -1.5), (SC["birth"]["from"] + 160, 2.5),
    (SC["work"]["from"], 2.0), (SC["compare"]["from"] + 230, 1.5), (SC["transform"]["from"], -2.0),
    (SC["transform"]["from"] + 230, -0.5), (SC["ending"]["from"], 0.5), (TL["durationInFrames"], 0.5),
]
fr = np.arange(len(music)) / SR * FPS
gdb = np.interp(fr, [p for p, _ in ARC], [g for _, g in ARC])
music *= (10 ** (gdb / 20))[:, None]


# ── Sound effects ──────────────────────────────────────────────────────────
def load(name):
    x, sr = sf.read(os.path.join(HERE, "sfx", name + ".wav"))
    assert sr == SR
    return x


def sweep(seconds, f0, f1, level):
    n = int(seconds * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    zi = None
    for a in range(0, n, 512):
        fc = f0 * (f1 / f0) ** (a / n)
        sos = signal.butter(2, [fc / 2.2, min(fc * 2.2, 20000)], "band", fs=SR, output="sos")
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[a : a + 512], zi = signal.sosfilt(sos, noise[a : a + 512], zi=zi)
    t = np.linspace(0, 1, n)
    out *= np.sin(np.pi * t ** 0.7) ** 2
    p = np.linspace(-0.7, 0.7, n)
    a = (p + 1) * np.pi / 4
    st = np.stack([out * np.cos(a), out * np.sin(a)], 1)
    return st / np.abs(st).max() * level


def thud():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(48 + 60 * np.exp(-t * 25)) / SR) * np.exp(-t * 9)
    x += lowpass(rng.standard_normal(n), 500) * np.exp(-t * 30) * 0.5
    x = lowpass(x, 1200)
    return np.stack([x, x], 1) / np.abs(x).max() * 0.55


def impact():
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-t * 12)) / SR) * np.exp(-t * 3.2)
    x = boom * 0.9 + highpass(rng.standard_normal(n), 2500) * np.exp(-t * 18) * 0.3
    st = np.stack([x, x], 1)
    sh = bell([midi(84), midi(88), midi(91), midi(96)], 2.6, 0.22)
    st[: len(sh)] += sh
    return st / np.abs(st).max() * 0.8


def cloth():
    n = int(0.35 * SR)
    t = np.linspace(0, 1, n)
    x = bandpass(rng.standard_normal(n), 1200, 6000) * np.sin(np.pi * t) ** 2
    return pan(x / np.abs(x).max() * 0.18, -0.2)


def key():
    k = load("tick_002")
    return highpass(k, 1500) * 0.5


def pop():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(220 + 600 * np.exp(-t * 40)) / SR) * np.exp(-t * 30)
    out = np.stack([x, x], 1) * 0.5
    k = load("pluck_002")
    o = np.zeros((max(len(out), len(k)), 2))
    o[: len(out)] += out
    o[: len(k)] += k * 0.5
    return o


SOUNDS = {
    "whoosh": sweep(0.55, 250, 5000, 0.55),
    "whooshSoft": sweep(0.45, 400, 3500, 0.3),
    "swooshDown": sweep(0.6, 4000, 250, 0.4),
    "riseUp": sweep(0.7, 300, 7000, 0.4),
    "thud": thud(),
    "impact": impact(),
    "cloth": cloth(),
    "key": key(),
    "pop": pop(),
    "tick": load("tick_002") * 0.7,
    "click": load("click_001") * 0.8,
    "confirm": load("confirmation_001"),
    "notify": load("confirmation_002"),
    "select": load("select_003"),
    "heart": load("pluck_001"),
    "chime": bell([midi(84), midi(88)], 1.8, 0.3),
    "sting": bell([midi(79), midi(84), midi(88), midi(91)], 3.2, 0.4),
}

sfx = np.zeros_like(music)
for c in TL["sfx"]:
    place(sfx, SOUNDS[c["sound"]], c["frame"] / FPS, c["gain"] * 0.5)
sfx += reverb(sfx) * 0.15

duck = np.ones(len(music))
for c in TL["sfx"]:
    i0 = int(c["frame"] / FPS * SR)
    n = int(0.35 * SR)
    s_ = 1 - 0.15 * np.sin(np.linspace(0, np.pi, n))
    j = min(len(duck), i0 + n)
    if i0 < len(duck):
        duck[i0:j] = np.minimum(duck[i0:j], s_[: j - i0])
music *= duck[:, None]

mix = (music + sfx)[:N]
fade = int(1.6 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.6
mix[: int(0.5 * SR)] *= np.linspace(0, 1, int(0.5 * SR))[:, None]


def compress(x, thresh_db=-20, ratio=2.0, attack=0.01, release=0.2):
    level = np.sqrt(lowpass(np.mean(x ** 2, axis=1), 30, 1).clip(1e-12))
    over = np.maximum(0, 20 * np.log10(level) - thresh_db)
    gdb = -over * (1 - 1 / ratio)
    a, r = np.exp(-1 / (attack * SR)), np.exp(-1 / (release * SR))
    g = np.zeros_like(gdb)
    cur = 0.0
    for i in range(0, len(g), 64):
        coef = a if gdb[i] < cur else r
        cur = coef ** 64 * cur + (1 - coef ** 64) * gdb[i]
        g[i : i + 64] = cur
    return x * (10 ** (g / 20))[:, None]


mix = compress(mix)
meter = pyln.Meter(SR)
mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)


def tp_limit(x, ceiling_db):
    ceiling = 10 ** (ceiling_db / 20)
    peak = np.abs(signal.resample_poly(x, 4, 1, axis=0)).max(axis=1).reshape(-1, 4).max(axis=1)[: len(x)]
    need = np.minimum(1, ceiling / np.maximum(peak, 1e-9))
    look = int(0.005 * SR)
    g = lowpass(minimum_filter1d(need, look * 2 + 1), 40, 1)
    g = minimum_filter1d(np.minimum(g, need), look)
    return x * g[:, None]


mix = tp_limit(mix, -1.5)
mix = tp_limit(mix, -2.0)
tp = np.abs(signal.resample_poly(mix, 4, 1, axis=0)).max()
if tp > 10 ** (-2.0 / 20):
    mix *= 10 ** (-2.0 / 20) / tp

out = os.path.join(ROOT, "public", "audio", "brandfilm.wav")
sf.write(out, mix, SR, subtype="PCM_24")
print(f"wrote {out}: {len(mix) / SR:.2f}s (video {LEN:.2f}s), {meter.integrated_loudness(mix):.1f} LUFS, "
      f"true peak {20 * np.log10(np.abs(signal.resample_poly(mix, 4, 1, axis=0)).max()):.2f} dBTP")
