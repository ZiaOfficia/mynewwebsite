"""
Builds src/v3/timeline.json for the HiBrands brand film (the shop owner's story):
scene timing, narration captions, music arrangement and sound cues.
Also writes out/HiBrands-Brand-Film.srt from the same captions.

  python3 audio/brandfilm_timeline.py
  python3 audio/make_film_music.py      # soundtrack from the same timeline

90 BPM at 30 fps: a beat is 20 frames, a bar is 80 frames. Every scene starts on a bar.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BAR = 80

ORDER = [("dream", 4), ("barrier", 5), ("realize", 5), ("birth", 4), ("work", 5), ("compare", 3), ("transform", 5), ("ending", 3)]
scenes, f = {}, 0
for name, bars in ORDER:
    scenes[name] = {"from": f, "duration": bars * BAR}
    f += bars * BAR
TOTAL = f

# Narration, shown as captions. style: sub (subtitle), thought (his inner voice), quote (an engineer), title (drawn by the scene)
CAPTIONS = [
    ("dream", 12, 140, "sub", "Every business begins with a dream."),
    ("dream", 150, 304, "sub", "To reach more people. To grow beyond familiar streets."),
    ("barrier", 120, 186, "sub", "Websites. Branding. Marketing. Different providers."),
    ("barrier", 190, 256, "sub", "Costs that can make even big dreams feel out of reach."),
    ("barrier", 282, 392, "thought", "“Maybe businesses like mine will never go digital.”"),
    ("realize", 24, 150, "sub", "Across different workspaces, experienced engineers saw the same problem."),
    ("realize", 160, 272, "quote", "“Small businesses don't lack potential. They lack access to the right expertise.”"),
    ("realize", 284, 394, "quote", "“What if we brought the expertise directly to them?”"),
    ("birth", 12, 118, "title", "Different skills. One shared mission."),
    ("birth", 150, 232, "title", "Introducing HiBrands."),
    ("birth", 236, 316, "title", "Engineers, not an agency."),
    ("work", 14, 128, "sub", "Direct access to skilled engineers. No middlemen."),
    ("work", 140, 270, "sub", "Websites. Landing pages. SEO. Social media. Google Ads."),
    ("work", 280, 396, "sub", "You don't need an entire agency. You need the right people, working together."),
    ("compare", 8, 110, "title", "Traditional agency overhead"),
    ("compare", 100, 236, "title", "Direct access to the people building your product"),
    ("transform", 24, 150, "sub", "What once felt impossible began to feel possible."),
    ("transform", 170, 270, "sub", "Not because he stopped dreaming."),
    ("transform", 282, 396, "sub", "But because he finally found people ready to help him build it."),
    ("ending", 30, 236, "title", "Your business has potential. Let's build what's next."),
]

captions = [
    {"scene": s, "from": a, "to": b, "style": st, "text": t, "start": scenes[s]["from"] + a, "end": scenes[s]["from"] + b}
    for (s, a, b, st, t) in CAPTIONS
]

sfx = []


def cue(scene, local, sound, gain):
    sfx.append({"frame": scenes[scene]["from"] + local, "sound": sound, "gain": gain})


# dream: the shop wakes up
cue("dream", 6, "whooshSoft", 0.3)
cue("dream", 40, "cloth", 0.5)
cue("dream", 110, "cloth", 0.45)
# barrier: laptop, proposals stacking, the low point
cue("barrier", 14, "click", 0.5)
for t in range(40, 100, 7):
    cue("barrier", t, "key", 0.35)
cue("barrier", 108, "whooshSoft", 0.4)
for i in range(5):
    cue("barrier", 130 + i * 22, "thud", 0.6)
cue("barrier", 258, "swooshDown", 0.35)
# realize: engineers appear, ideas spark, the call connects
for i in range(4):
    cue("realize", i * 28 + 4, "pop", 0.45)
cue("realize", 150, "notify", 0.45)
cue("realize", 236, "riseUp", 0.4)
cue("realize", 252, "confirm", 0.6)
# birth: nodes converge, impact, logo
for i in range(5):
    cue("birth", 18 + i * 10, "tick", 0.4)
cue("birth", 100, "riseUp", 0.5)
cue("birth", 132, "impact", 0.95)
cue("birth", 136, "pop", 0.8)
cue("birth", 236, "chime", 0.5)
# work: the call, then the build
cue("work", 4, "confirm", 0.5)
for t, s in [(140, "pop"), (175, "click"), (205, "select"), (235, "whoosh"), (265, "tick"), (295, "heart"), (320, "notify")]:
    cue("work", t, s, 0.55)
# compare
cue("compare", -4, "whoosh", 0.6)
for i in range(3):
    cue("compare", 20 + i * 14, "thud", 0.35)
cue("compare", 104, "riseUp", 0.4)
cue("compare", 120, "confirm", 0.55)
# transform: the reveal and his joy
cue("transform", 4, "whooshSoft", 0.4)
cue("transform", 96, "whoosh", 0.5)
cue("transform", 150, "whooshSoft", 0.4)
cue("transform", 178, "notify", 0.6)
cue("transform", 292, "chime", 0.45)
# ending
cue("ending", -4, "whoosh", 0.6)
cue("ending", 10, "pop", 0.75)
cue("ending", 12, "sting", 0.8)

sfx.sort(key=lambda c: c["frame"])

S = lambda n: scenes[n]["from"]
# Music arrangement, per section. mode: dream (piano), low (near silence), pulse, full, warm (piano + strings), end
music = [
    {"from": 0, "mode": "dream"},
    {"from": S("barrier"), "mode": "dream", "dim": 0.6},
    {"from": S("barrier") + 3 * BAR, "mode": "low"},
    {"from": S("realize"), "mode": "pulse"},
    {"from": S("birth") + 2 * BAR, "mode": "full"},
    {"from": S("compare"), "mode": "full", "light": True},
    {"from": S("transform"), "mode": "warm"},
    {"from": S("transform") + 3 * BAR, "mode": "warm", "swell": True},
    {"from": S("ending"), "mode": "end"},
]

out = {
    "fps": 30,
    "bpm": 90,
    "framesPerBeat": 20,
    "framesPerBar": BAR,
    "durationInFrames": TOTAL,
    "scenes": scenes,
    "captions": captions,
    "music": music,
    "risers": [S("birth") + 132, S("transform") + 3 * BAR],
    "sfx": sfx,
}
path = os.path.join(ROOT, "src", "v3", "timeline.json")
json.dump(out, open(path, "w"), indent=1, ensure_ascii=False)


def ts(frame):
    ms = int(round(frame / 30 * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s_, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s_:02},{ms:03}"


os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
with open(os.path.join(ROOT, "out", "HiBrands-Brand-Film.srt"), "w") as fh:
    for i, c in enumerate(captions, 1):
        fh.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n\n")
print(f"wrote {path}: {TOTAL} frames ({TOTAL / 30:.1f}s), {len(captions)} captions, {len(sfx)} cues")
