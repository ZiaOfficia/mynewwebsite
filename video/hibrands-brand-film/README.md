# HiBrands intro film (website hero)

A 45.6-second cinematic introduction to HiBrands, built in code with Remotion. It tells the whole
story in on-screen words, so it works as a muted autoplay hero, and it has an original score and
sound design for when the sound is on.

## Deliverables (`out/`, not committed to git; regenerate with the commands below)

| File | What it is |
|---|---|
| `hibrands-intro-master.mp4` | Master: 1920×1080, 30 fps, H.264 (CRF 16), AAC 320 kbps, −14 LUFS |
| `hibrands-intro-no-music.mp4` | The same picture with sound design only, no music |
| `hibrands-website-hero.mp4` | Website version: H.264 (CRF 26), AAC 128 kbps, faststart, about 5 MB |
| `hibrands-intro.webm` | Website version in VP9 + Opus, about 5 MB |
| `hibrands-website-poster.jpg` | Poster image: the end card (logo, tagline, call to action) |
| `hibrands-preview.gif` | 6.5-second preview of the logo reveal, 800 px wide |

Audio (`audio/`): `hibrands-intro-mix.wav` (final mix), `hibrands-intro-music.wav` (music stem),
`hibrands-intro-sfx.wav` (sound-design stem). All original and synthesised; no licensed tracks.

Also here: `STORYBOARD.md` (scene plan) and `VOICEOVER-SCRIPT.md` (optional voice-over, timed).

## Source

- `../src/v4/` — the film: `scenes.tsx` (7 scenes), `fx.tsx` (brand tokens, headline, backgrounds), `Intro.tsx`
- `../audio/intro_timeline.py` — scene timing, every on-screen line, every sound cue → `src/v4/timeline.json`
- `../audio/make_intro_music.py` — the score and sound design, mixed and mastered
- The final lockup uses the official `public/brand/logo-reverse.svg`.

## Render

```bash
cd video
npm install
python3 audio/intro_timeline.py && python3 audio/make_intro_music.py
npx remotion render HiBrandsIntro out/intro-raw.mp4 --crf=16 --audio-bitrate=320k
./finalize.sh out/intro-raw.mp4 hibrands-brand-film/out/hibrands-intro-master.mp4 public/audio/intro.wav
# website versions
ffmpeg -i out/intro-raw.mp4 -i public/audio/intro.wav -map 0:v -map 1:a -vf "scale=in_range=full:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 128k -movflags +faststart -shortest hibrands-brand-film/out/hibrands-website-hero.mp4
ffmpeg -i out/intro-raw.mp4 -i public/audio/intro.wav -map 0:v -map 1:a -vf "format=yuv420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -c:a libopus -b:a 96k -shortest hibrands-brand-film/out/hibrands-intro.webm
```

## How it was reviewed

Two review passes on the rendered video, following EveryInc's product-launch-video workflow:
1. Four independent critics (design and layout, text and readability, narrative and pacing, brand
   consistency) each reviewed 31 frames of the actual render. Their fixes were applied.
2. A second critic re-checked every fix on a new render; the remaining issues were fixed and the
   moments re-checked frame by frame.
Technical checks on the final file: 1920×1080, 30 fps, 45.6 s, no frozen or black frames,
−14.2 LUFS integrated, true peak below −1.5 dBTP.

## Tools considered

- digitalsamba/claude-code-video-toolkit: voice, image and video generation need paid cloud APIs; not used.
- EveryInc/product-launch-video: its storyboard → render → multi-critic review workflow was followed.
- zhuyansen/awesome-claude-video-skills: a directory; no listed tool added capability without paid keys.
- Remotion (already in this project) for all motion; FFmpeg for encoding.

There is no voice-over: no natural-sounding voice could be generated here, and the film is designed
to work without one. Record `VOICEOVER-SCRIPT.md` to add it later.
