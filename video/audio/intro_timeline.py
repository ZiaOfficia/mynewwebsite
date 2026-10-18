"""
Builds src/v4/timeline.json for the HiBrands intro film (website hero):
scene timing, on-screen lines, and sound cues. 100 BPM at 30 fps: a bar is 72 frames.

  python3 audio/intro_timeline.py && python3 audio/make_intro_music.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BAR = 72

ORDER = [("struggle", 2), ("shift", 2), ("reveal", 3), ("engineers", 3), ("premium", 3), ("lifeline", 3), ("final", 3)]
scenes, f = {}, 0
for name, bars in ORDER:
    scenes[name] = {"from": f, "duration": bars * BAR}
    f += bars * BAR
TOTAL = f

# On-screen lines: (scene, from, to, text). The scene decides where and how big.
LINES = [
    ("struggle", 22, 74, "Big dreams."),
    ("struggle", 78, 140, "Limited resources."),
    ("shift", 34, 142, "Growth shouldn't be out of reach."),
    ("reveal", 96, 150, "Meet HiBrands."),
    ("reveal", 154, 214, "Your partner in digital growth."),
    ("engineers", 6, 78, "Built by engineers."),
    ("engineers", 82, 148, "Designed for real businesses."),
    ("engineers", 152, 214, "Five services today. Much more on the way."),
    ("premium", 4, 70, "Premium services."),
    ("premium", 76, 142, "Local prices."),
    ("premium", 148, 214, "Zero compromise on ambition."),
    ("lifeline", 8, 70, "Your business deserves more."),
    ("lifeline", 76, 142, "From local business to brand."),
    ("lifeline", 148, 214, "Let's build what's next."),
]
lines = [{"scene": s, "from": a, "to": b, "text": t, "start": scenes[s]["from"] + a, "end": scenes[s]["from"] + b} for s, a, b, t in LINES]

sfx = []


def cue(scene, local, sound, gain):
    sfx.append({"frame": scenes[scene]["from"] + local, "sound": sound, "gain": gain})


cue("struggle", 0, "activate", 0.7)
cue("struggle", 4, "lineTone", 0.5)
cue("struggle", 22, "low", 0.6)
cue("struggle", 78, "low", 0.6)
cue("struggle", 100, "crackle", 0.35)
cue("shift", 8, "beam", 0.8)
cue("shift", 16, "shatter", 0.75)
for i in range(4):
    cue("shift", 40 + i * 9, "blip", 0.45)
cue("shift", 120, "suck", 0.5)
cue("reveal", 2, "trace", 0.55)
cue("reveal", 40, "sweep", 0.4)
cue("reveal", 56, "sweep", 0.4)
cue("reveal", 72, "impact", 1.0)
cue("reveal", 72, "hiLogo", 0.8)
cue("reveal", 96, "tick", 0.35)
cue("reveal", 154, "tick", 0.35)
cue("engineers", 0, "whoosh", 0.55)
for i in range(6):
    cue("engineers", 8 + i * 7, "blip", 0.35)
cue("engineers", 152, "shimmer", 0.5)
cue("premium", 0, "stab", 0.7)
cue("premium", 72, "slice", 0.75)
cue("premium", 144, "stab", 0.7)
cue("lifeline", 0, "wave", 0.7)
for i in range(5):
    cue("lifeline", 20 + i * 10, "blip", 0.35)
cue("final", 0, "impactSoft", 0.8)
cue("final", 10, "hiLogo", 0.85)
cue("final", 60, "tick", 0.3)
sfx.sort(key=lambda c: c["frame"])

out = {
    "fps": 30,
    "bpm": 100,
    "framesPerBar": BAR,
    "durationInFrames": TOTAL,
    "scenes": scenes,
    "lines": lines,
    "impacts": [scenes["reveal"]["from"] + 72, scenes["final"]["from"]],
    "sfx": sfx,
}
path = os.path.join(ROOT, "src", "v4", "timeline.json")
os.makedirs(os.path.dirname(path), exist_ok=True)
json.dump(out, open(path, "w"), indent=1)
print(f"wrote {path}: {TOTAL} frames ({TOTAL / 30:.1f}s)")
