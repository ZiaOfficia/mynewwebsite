"""
Builds src/v2/timeline.json for the "Engineers, not an agency" film:
scene timing, the music arrangement and every sound-effect cue.

  python3 audio/engineers_timeline.py && python3 audio/make_music.py src/v2/timeline.json public/audio/engineers.wav

Scene-local cue frames mirror the constants exported from src/v2/*.tsx
(LAYER_AT, DOT_STOPS, CHAT, QUALITY_AT, COMPARE, WHY, FINAL). Change both together.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BAR = 72  # 100 BPM at 30 fps

ORDER = [
    ("office", 4), ("layers", 3), ("question", 3), ("transition", 1), ("reveal", 3), ("direct", 3),
    ("web", 3), ("landing", 3), ("seo", 3), ("social", 3), ("ads", 3),
    ("quality", 3), ("compare", 6), ("why", 4), ("work", 3), ("promises", 3), ("final", 5),
]
scenes, f = {}, 0
for name, bars in ORDER:
    scenes[name] = {"from": f, "duration": bars * BAR}
    f += bars * BAR
TOTAL = f

sfx = []


def cue(scene, local, sound, gain):
    sfx.append({"frame": scenes[scene]["from"] + local, "sound": sound, "gain": gain})


# 1-3 the agency world
cue("office", 18, "whooshSoft", 0.35)
cue("office", 28, "whooshSoft", 0.3)
cue("office", 42, "whooshSoft", 0.3)
for i in range(5):
    cue("layers", 16 + i * 14, "thud", 0.75)
for at in [104, 120, 136, 152, 168]:
    cue("layers", at, "tick", 0.3)
cue("question", 4, "whooshSoft", 0.35)
cue("question", 34, "whooshSoft", 0.3)
# 4 the light streak, then the drop
cue("transition", 2, "streak", 0.9)
cue("transition", 14, "whooshSoft", 0.4)
cue("reveal", 0, "impact", 1.0)
cue("reveal", 4, "pop", 0.8)
cue("reveal", 44, "whooshSoft", 0.4)
# 6 direct chat
cue("direct", 14, "click", 0.6)
cue("direct", 54, "select", 0.6)
cue("direct", 80, "select", 0.55)
cue("direct", 118, "click", 0.6)
cue("direct", 144, "confirm", 0.7)
cue("direct", 160, "pop", 0.45)
cue("direct", 176, "pop", 0.45)

# 7 services: reuse the sound design of the first film's service scenes
old = json.load(open(os.path.join(ROOT, "src", "timeline.json")))
for name in ["web", "landing", "seo", "social", "ads", "work", "promises"]:
    o = old["scenes"][name]
    cue(name, -4, "whoosh", 0.65)
    for c in old["sfx"]:
        if o["from"] <= c["frame"] < o["from"] + o["duration"] - 5:
            cue(name, c["frame"] - o["from"], c["sound"], c["gain"])

# 8 quality checklist
cue("quality", -4, "whoosh", 0.65)
for i in range(6):
    cue("quality", 30 + i * 12, "tick", 0.5)
cue("quality", 118, "chime", 0.45)
# 9 compare
cue("compare", -4, "whoosh", 0.7)
for i in range(5):
    cue("compare", 14 + i * 8, "tick", 0.3)
for i in range(0, 9, 2):
    cue("compare", 54 + i * 5, "coin", 0.35)
cue("compare", 40, "pop", 0.5)
cue("compare", 112, "riseUp", 0.35)
cue("compare", 206, "whoosh", 0.6)
cue("compare", 226, "sting", 0.55)
cue("compare", 286, "pop", 0.5)
# 10 why
cue("why", -4, "whoosh", 0.65)
for at in [26, 48, 70, 92]:
    cue("why", at, "tick", 0.35)
cue("why", 80, "pop", 0.5)
cue("why", 88, "pop", 0.5)
cue("why", 100, "riseUp", 0.4)
cue("why", 114, "confirm", 0.6)
for at in [176, 194, 212]:
    cue("why", at, "pop", 0.55)
# 13 final
cue("final", -4, "whoosh", 0.75)
cue("final", 80, "pop", 0.7)
cue("final", 112, "click", 0.7)
cue("final", 140, "riseUp", 0.45)
cue("final", 146, "whoosh", 0.6)
cue("final", 158, "sting", 0.8)

sfx.sort(key=lambda c: c["frame"])

S = lambda n: scenes[n]["from"]
music = [
    {"from": 0, "mode": "dark", "pad": 0.75, "padLp": 1100, "bass": 0.55, "kick": 0.5, "heart": True},
    {"from": S("layers"), "mode": "dark", "pad": 0.85, "padLp": 1300, "bass": 0.7, "kick": 0.6, "heart": True, "hat": 0.25},
    {"from": S("question"), "mode": "dark", "pad": 0.95, "padLp": 1700, "bass": 0.5, "pluck": 0.3},
    {"from": S("reveal"), "pad": 0.8, "pluck": 0.85, "bass": 1, "kick": 1, "clap": 1, "hat": 1},
    {"from": S("web"), "pad": 0.8, "pluck": 0.85, "bass": 1, "kick": 1, "clap": 1, "hat": 1, "shaker": 0.7},
    {"from": S("compare"), "pad": 0.9, "pluck": 0.75, "bass": 1, "kick": 1, "clap": 1, "hat": 0.9, "shaker": 0.4},
    {"from": S("why"), "pad": 0.8, "pluck": 0.85, "bass": 1, "kick": 1, "clap": 1, "hat": 1, "shaker": 0.7},
    {"from": S("promises"), "pad": 1.0, "pluck": 0.6, "bass": 0.6, "hat": 0.5},
    {"from": S("final"), "pad": 0.9, "pluck": 0.9, "bass": 1, "kick": 1, "clap": 1, "hat": 1, "shaker": 0.8},
]

out = {
    "fps": 30,
    "bpm": 100,
    "framesPerBeat": 18,
    "framesPerBar": BAR,
    "durationInFrames": TOTAL,
    "scenes": scenes,
    "music": music,
    "risers": [S("reveal"), S("final")],
    "sfx": sfx,
}
path = os.path.join(ROOT, "src", "v2", "timeline.json")
json.dump(out, open(path, "w"), indent=1)
print(f"wrote {path}: {TOTAL} frames ({TOTAL / 30:.1f}s), {len(sfx)} cues")
