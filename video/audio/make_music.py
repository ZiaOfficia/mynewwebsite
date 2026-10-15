"""
HiBrands promo soundtrack: original music + sound design, mixed and mastered.

  python3 audio/make_music.py        ->  public/audio/soundtrack.wav  (48 kHz, 24-bit, stereo)

Everything is synthesised here except a few CC0 interface sounds by Kenney
(audio/sfx, see KENNEY-LICENSE.txt). Timing comes from src/timeline.json, the
same file the video reads, so picture and sound cannot drift apart.

Music: 100 BPM, C major, I-V-vi-IV (C G Am F). Warm pad, marimba-like plucks,
round bass, soft drums. Arrangement follows the scenes: quiet intro, beat in
for the bill, full groove through the services, a short breakdown with a riser
into the call to action, a final chord to close.
"""
import json
import os
import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TL = json.load(open(os.path.join(ROOT, 'src', 'timeline.json')))

SR = 48000
FPS = TL['fps']
BPM = TL['bpm']
BEAT = 60 / BPM
BAR = 4 * BEAT
VIDEO_LEN = TL['durationInFrames'] / FPS
N = int((VIDEO_LEN + 0.0) * SR)
rng = np.random.default_rng(7)


def t_of_frame(f):
    return f / FPS


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, x, start_s, gain=1.0):
    """Add stereo (n,2) or mono (n,) signal x into buf at start_s."""
    i = int(round(start_s * SR))
    if i >= len(buf):
        return
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i] * gain


def pan(x, p):
    """p in [-1, 1], constant power."""
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    sus = max(0, n - a - d - r)
    e = np.concatenate([
        np.linspace(0, 1, max(a, 1), endpoint=False),
        np.linspace(1, s, max(d, 1), endpoint=False),
        np.full(sus, s),
        np.linspace(s, 0, max(r, 1)),
    ])
    return np.pad(e, (0, max(0, n - len(e))))[:n]


def lowpass(x, fc, order=2):
    sos = signal.butter(order, fc, 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def highpass(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def make_ir(seconds=2.2, decay=3.2):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = rng.standard_normal(n)
        noise = lowpass(noise, 6500)
        ir[:, ch] = noise * np.exp(-decay * t)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt((ir ** 2).sum(axis=0))


IR = make_ir()


def reverb(x):
    out = np.zeros((len(x) + len(IR) - 1, 2))
    for ch in range(2):
        out[:, ch] = signal.fftconvolve(x[:, ch], IR[:, ch])
    return out[: len(x)]


# ── Arrangement ────────────────────────────────────────────────────────────
N_BARS = int(np.ceil(VIDEO_LEN / BAR))
#            C               G               Am              F
CHORDS = [[48, 52, 55, 60], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]]
ROOTS = [36, 31, 33, 29]


def section(bar):
    """Which instruments play in a given bar (scene-aware)."""
    s = TL['scenes']
    t = bar * BAR * FPS  # bar start in frames
    if t < s['question']['from']:
        return dict(pad=0.8, pluck=0.55, bass=0, kick=0, clap=0, hat=0, shaker=0)
    if t < s['bill']['from']:
        return dict(pad=0.9, pluck=0.7, bass=0.8, kick=0, clap=0, hat=0.6, shaker=0)
    if t < s['promises']['from']:
        busy = s['web']['from'] <= t < s['tour']['from']
        return dict(pad=0.8, pluck=0.85, bass=1, kick=1, clap=1, hat=1, shaker=0.7 if busy else 0)
    if t < s['cta']['from']:
        return dict(pad=1.0, pluck=0.6, bass=0.6, kick=0, clap=0, hat=0.5, shaker=0)  # breakdown
    return dict(pad=0.9, pluck=0.9, bass=1, kick=1, clap=1, hat=1, shaker=0.8)


def saw(freq, n, detune_cents=0.0, harmonics=18):
    t = np.arange(n) / SR
    f = freq * 2 ** (detune_cents / 1200)
    out = np.zeros(n)
    ph = rng.uniform(0, 2 * np.pi)
    for k in range(1, harmonics + 1):
        if f * k > 9000:
            break
        out += np.sin(2 * np.pi * f * k * t + ph * k) / k
    return out


music = np.zeros((N + SR * 3, 2))
pad_bus = np.zeros_like(music)
pluck_bus = np.zeros_like(music)
bass_bus = np.zeros_like(music)
drum_bus = np.zeros_like(music)
kick_times = []

for bar in range(N_BARS):
    sec = section(bar)
    start = bar * BAR
    chord = CHORDS[bar % 4]
    root = ROOTS[bar % 4]
    last_bar = bar == N_BARS - 1

    # Pad: detuned saws, soft attack
    if sec['pad']:
        n = int((BAR + 0.6) * SR)
        voice = np.zeros(n)
        for note in chord[1:] + [chord[0] + 12]:
            for dc in (-7, 0, 7):
                voice += saw(midi(note), n, dc)
        voice = highpass(lowpass(voice, 3200 if not last_bar else 3800), 170)
        voice *= env_adsr(n, 0.25, 0.4, 0.85, 0.6) * 0.022 * sec['pad']
        L = voice * (0.9 + 0.1 * np.sin(np.linspace(0, 3, n)))
        R = voice * (0.9 + 0.1 * np.cos(np.linspace(0, 3, n)))
        place(pad_bus, np.stack([L, R], 1), start)

    # Plucks: marimba-like FM, 8th-note arpeggio, 16ths in busy sections
    if sec['pluck'] and not last_bar:
        arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 12,
               chord[1] + 24, chord[3] + 12, chord[2] + 12, chord[3] + 12]
        step = BEAT / 2
        for i, note in enumerate(arp):
            n = int(0.5 * SR)
            t = np.arange(n) / SR
            f = midi(note)
            mod = np.sin(2 * np.pi * f * 4 * t) * 2.2 * np.exp(-t * 28)
            tone = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 9)
            tone += 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 16)
            vel = (0.95 if i % 2 == 0 else 0.7) * sec['pluck']
            place(pluck_bus, pan(tone * 0.13 * vel, -0.35 if i % 2 else 0.35), start + i * step)

    # Bass: syncopated roots
    if sec['bass']:
        pattern = [(0, 1.0, 0.95), (1.5, 0.5, 0.7), (2, 1.0, 0.9), (3.5, 0.5, 0.7)]
        if last_bar:
            pattern = [(0, 3.5, 1.0)]
        for beat, length, vel in pattern:
            n = int(length * BEAT * SR)
            t = np.arange(n) / SR
            f = midi(root)
            tone = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
            tone = np.tanh(tone * 1.6)
            tone = lowpass(tone, 420) * env_adsr(n, 0.005, 0.12, 0.7, 0.06)
            place(bass_bus, highpass(tone, 45) * 0.11 * vel * sec['bass'], start + beat * BEAT)

    # Drums
    for beat in range(4):
        bt = start + beat * BEAT
        if sec['kick'] and beat in (0, 2) and not last_bar:
            n = int(0.45 * SR)
            t = np.arange(n) / SR
            f = 52 + 120 * np.exp(-t * 30)
            ph = 2 * np.pi * np.cumsum(f) / SR
            k = np.sin(ph) * np.exp(-t * 11)
            k[: int(0.003 * SR)] += lowpass(rng.standard_normal(int(0.003 * SR)), 3000) * 0.12
            place(drum_bus, k * 0.30 * sec['kick'], bt)
            kick_times.append(bt)
        if sec['clap'] and beat in (1, 3) and not last_bar:
            n = int(0.35 * SR)
            t = np.arange(n) / SR
            noise = rng.standard_normal(n)
            burst = np.zeros(n)
            for off in (0, 0.011, 0.022):
                o = int(off * SR)
                burst[o:] += np.exp(-np.arange(n - o) / SR * (60 if off < 0.02 else 14))
            c = bandpass(noise, 900, 4200) * burst
            place(drum_bus, pan(c * 0.11 * sec['clap'], 0.05), bt)
        if sec['hat'] and not last_bar:
            for half in (0, 0.5):
                n = int(0.06 * SR)
                t = np.arange(n) / SR
                h = highpass(rng.standard_normal(n), 7500) * np.exp(-t * 70)
                vel = (0.45 if half == 0 else 0.75) * sec['hat']
                place(drum_bus, pan(h * 0.085 * vel, 0.3), bt + half * BEAT)
        if sec['shaker'] and not last_bar:
            for q in (0.25, 0.75):
                n = int(0.08 * SR)
                t = np.arange(n) / SR
                sh = bandpass(rng.standard_normal(n), 5000, 11000) * (np.sin(np.pi * t / 0.08) ** 2)
                place(drum_bus, pan(sh * 0.05 * sec['shaker'], -0.4), bt + q * BEAT)

# Riser into the call to action (last 2 beats of the breakdown)
cta_t = t_of_frame(TL['scenes']['cta']['from'])
n = int(2 * BAR * SR)
t = np.arange(n) / SR
riser = np.zeros(n)
noise = rng.standard_normal(n)
for i, (a, b) in enumerate(zip(range(0, n, 2048), range(2048, n + 2048, 2048))):
    fc = 400 + 7000 * (a / n) ** 2
    riser[a:b] = lowpass(noise[a:b], min(fc, 20000), 1)
riser *= (t / t[-1]) ** 2 * 0.09
place(drum_bus, np.stack([riser, riser[::-1] * 0 + riser], 1), cta_t - 2 * BAR)

# Final chord bell hit
end_bar_t = (N_BARS - 1) * BAR

# Sidechain the pad and bass to the kick for a gentle pump
pump = np.ones(len(music))
for kt in kick_times:
    i = int(kt * SR)
    n = int(0.3 * SR)
    seg = 1 - 0.45 * np.exp(-np.arange(n) / SR / 0.09)
    j = min(len(pump), i + n)
    pump[i:j] = np.minimum(pump[i:j], seg[: j - i])
pad_bus *= pump[:, None]
bass_bus *= (0.4 + 0.6 * pump)[:, None]

# Pluck ping-pong delay (dotted 8th)
d = int(BEAT * 0.75 * SR)
delayed = np.zeros_like(pluck_bus)
src = pluck_bus.copy()
for k in range(1, 4):
    g = 0.32 ** k
    shifted = np.zeros_like(src)
    shifted[d * k:] = src[: -d * k]
    if k % 2:
        shifted = shifted[:, ::-1]
    delayed += lowpass(shifted, 3500) * g
pluck_bus += delayed

music = pad_bus + pluck_bus + bass_bus + drum_bus
music += highpass(reverb(pad_bus * 0.35 + pluck_bus * 0.5 + drum_bus * 0.12), 220) * 0.55
music = highpass(music, 35)


def shelf(x, fc, gain_db, kind):
    # RBJ shelving biquad
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * fc / SR
    cw, sw = np.cos(w), np.sin(w)
    alpha = sw / 2 * np.sqrt(2)
    if kind == 'low':
        b0 = A * ((A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * alpha)
        b1 = 2 * A * ((A - 1) - (A + 1) * cw)
        b2 = A * ((A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * alpha)
        a0 = (A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * alpha
        a1 = -2 * ((A - 1) + (A + 1) * cw)
        a2 = (A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * alpha
    else:
        b0 = A * ((A + 1) + (A - 1) * cw + 2 * np.sqrt(A) * alpha)
        b1 = -2 * A * ((A - 1) + (A + 1) * cw)
        b2 = A * ((A + 1) + (A - 1) * cw - 2 * np.sqrt(A) * alpha)
        a0 = (A + 1) - (A - 1) * cw + 2 * np.sqrt(A) * alpha
        a1 = 2 * ((A - 1) - (A + 1) * cw)
        a2 = (A + 1) - (A - 1) * cw - 2 * np.sqrt(A) * alpha
    return signal.lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x, axis=0)


# Mastering EQ: tame the sub, open up presence and air
music = shelf(music, 90, -4.0, 'low')
music = shelf(music, 3500, 3.0, 'high')

# ── Sound design ───────────────────────────────────────────────────────────
def load(name):
    x, sr = sf.read(os.path.join(HERE, 'sfx', name + '.wav'))
    assert sr == SR
    return x


def sweep_noise(seconds, f0, f1, width=1.2, curve=1.0):
    n = int(seconds * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    block = 512
    zi = None
    for a in range(0, n, block):
        p = (a / n) ** curve
        fc = f0 * (f1 / f0) ** p
        lo, hi = fc / (1 + width), min(fc * (1 + width), 20000)
        sos = signal.butter(2, [lo, hi], 'band', fs=SR, output='sos')
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[a:a + block], zi = signal.sosfilt(sos, noise[a:a + block], zi=zi)
    return out


def whoosh(seconds=0.55, f0=250, f1=4500, level=0.5):
    x = sweep_noise(seconds, f0, f1)
    n = len(x)
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * t ** 0.7) ** 2
    x = x * e
    p = np.linspace(-0.7, 0.7, n)
    a = (p + 1) * np.pi / 4
    st = np.stack([x * np.cos(a), x * np.sin(a)], 1)
    return st / np.abs(st).max() * level


def bell(freqs, seconds=1.4, level=0.35):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for ratio, amp, dec in ((1, 1, 2.6), (2.76, 0.35, 5), (5.4, 0.15, 9)):
            x += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * dec)
    x *= np.minimum(1, t / 0.004)
    return np.stack([x, x], 1) / np.abs(x).max() * level


def pop():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 220 + 600 * np.exp(-t * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)
    syn = np.stack([x, x], 1) * 0.55
    k = load('pluck_002')
    out = np.zeros((max(len(syn), len(k)), 2))
    out[: len(syn)] += syn
    out[: len(k)] += k * 0.5
    return out


SOUNDS = {
    'pop': pop(),
    'whoosh': whoosh(0.55, 250, 5000, 0.55),
    'whooshSoft': whoosh(0.45, 400, 3500, 0.3),
    'swooshDown': whoosh(0.5, 5000, 300, 0.5),
    'riseUp': np.concatenate([whoosh(0.6, 300, 7000, 0.4)]),
    'tick': load('tick_002') * 0.7,
    'strike': load('scratch_001'),
    'click': load('click_001') * 0.8,
    'confirm': load('confirmation_001'),
    'notify': load('confirmation_002'),
    'select': load('select_003'),
    'heart': load('pluck_001'),
    'drop': load('drop_002'),
    'bong': load('bong_001'),
    'chime': bell([midi(84), midi(88)], 1.6, 0.3),
    'sting': bell([midi(72), midi(76), midi(79), midi(84)], 3.0, 0.4),
}

sfx = np.zeros_like(music)
for cue in TL['sfx']:
    snd = SOUNDS[cue['sound']]
    place(sfx, snd, t_of_frame(cue['frame']), cue['gain'] * 0.5)
sfx += reverb(sfx) * 0.18

# Duck the music a little under each sound effect, so SFX read clearly
duck = np.ones(len(music))
for cue in TL['sfx']:
    i = int(t_of_frame(cue['frame']) * SR)
    n = int(0.35 * SR)
    seg = 1 - 0.18 * np.sin(np.linspace(0, np.pi, n))
    j = min(len(duck), i + n)
    duck[i:j] = np.minimum(duck[i:j], seg[: j - i])
music *= duck[:, None]

# Fade the music out under the final chord, aligned to the end of the video
mix = music + sfx
mix = mix[:N]
fade_n = int(1.2 * SR)
mix[-fade_n:] *= np.linspace(1, 0, fade_n)[:, None] ** 1.5
fade_in = int(0.03 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]

# ── Master: glue compressor, loudness, true-peak limiter ───────────────────
def compress(x, thresh_db=-18, ratio=2.0, attack=0.01, release=0.15):
    level = np.sqrt(lowpass(np.mean(x ** 2, axis=1), 30, 1).clip(1e-12))
    db = 20 * np.log10(level)
    over = np.maximum(0, db - thresh_db)
    gain_db = -over * (1 - 1 / ratio)
    a = np.exp(-1 / (attack * SR))
    r = np.exp(-1 / (release * SR))
    g = np.zeros_like(gain_db)
    cur = 0.0
    for i in range(0, len(g), 64):
        target = gain_db[i]
        coef = a if target < cur else r
        cur = coef ** 64 * cur + (1 - coef ** 64) * target
        g[i:i + 64] = cur
    return x * (10 ** (g / 20))[:, None]


mix = compress(mix)

meter = pyln.Meter(SR)
loud = meter.integrated_loudness(mix)
TARGET = -14.0
mix = pyln.normalize.loudness(mix, loud, TARGET)


def true_peak_limit(x, ceiling_db=-1.0):
    ceiling = 10 ** (ceiling_db / 20)
    up = signal.resample_poly(x, 4, 1, axis=0)
    peak = np.abs(up).max(axis=1)
    peak = peak.reshape(-1, 4).max(axis=1)[: len(x)]
    need = np.minimum(1, ceiling / np.maximum(peak, 1e-9))
    look = int(0.005 * SR)
    g = signal.minimum_filter1d(need, look * 2 + 1) if hasattr(signal, 'minimum_filter1d') else None
    if g is None:
        from scipy.ndimage import minimum_filter1d
        g = minimum_filter1d(need, look * 2 + 1)
    g = lowpass(g, 40, 1)
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(np.minimum(g, need), look)
    return x * g[:, None]


mix = true_peak_limit(mix)
mix = true_peak_limit(mix, -2.0)
# final safety: guarantee the true-peak ceiling
tp_now = np.abs(signal.resample_poly(mix, 4, 1, axis=0)).max()
if tp_now > 10 ** (-2.0 / 20):
    mix *= 10 ** (-2.0 / 20) / tp_now
final_loud = meter.integrated_loudness(mix)
tp = 20 * np.log10(np.abs(signal.resample_poly(mix, 4, 1, axis=0)).max())

out = os.path.join(ROOT, 'public', 'audio', 'soundtrack.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
sf.write(out, mix, SR, subtype='PCM_24')
print(f'wrote {out}')
print(f'length {len(mix)/SR:.2f}s (video {VIDEO_LEN:.2f}s)  loudness {final_loud:.1f} LUFS  true peak {tp:.2f} dBTP')
