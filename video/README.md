# HiBrands promo videos

A 74-second promo for HiBrands, made with [Remotion](https://github.com/remotion-dev/remotion)
(React for video). Two cuts from one source:

| File | Size | Use it for |
|---|---|---|
| `HiBrands-Promo-16x9.mp4` | 1920×1080 | YouTube, website, LinkedIn, presentations |
| `HiBrands-Promo-9x16.mp4` | 1080×1920 | Instagram Reels, YouTube Shorts, WhatsApp Status |

## Story (scene → time)

| Time | Scene |
|---|---|
| 0:00 | Logo: the Hi bubble says hi. "Engineers, not an agency." |
| 0:04.8 | "Ever wondered what an agency bill actually pays for?" |
| 0:09.6 | The agency bill: overhead crossed out line by line, only the work is left |
| 0:19.2 | Fewer people in the middle: the 5-person chain collapses to You → Engineer |
| 0:26.4 | The 5 services, each shown working, with real starting prices |
| 0:50.4 | Real client websites, all live |
| 0:57.6 | A tour of hibrands.in on desktop and phone |
| 1:02.4 | "We're not an agency built for profit": the three promises |
| 1:07.2 | Call to action, then the logo end card |

## Sound

- Original music written in code (`audio/make_music.py`): 100 BPM, C major, every scene
  change lands on a bar line. No licensing issues; it belongs to you.
- Interface sounds from Kenney's CC0 (public domain) packs, via
  [soundcn](https://github.com/kapishdima/soundcn); see `audio/sfx/KENNEY-LICENSE.txt`.
- Mastered to −14 LUFS (YouTube / Instagram / Spotify standard), true peak below −1 dBTP,
  48 kHz, AAC 320 kbps.

There is no voiceover. To add one, record it as `public/audio/voiceover.wav` and add a second
`<Audio>` in `src/Promo.tsx`. The music already leaves room for a voice.

## Edit and re-render

```bash
cd video
npm install
npm run dev                 # opens Remotion Studio to preview and edit
python3 audio/make_music.py # rebuild the soundtrack after changing src/timeline.json
npx remotion render HiBrandsPromo out/hibrands-promo-16x9.mp4 --crf=16 --audio-bitrate=320k
npx remotion render HiBrandsPromoVertical out/hibrands-promo-9x16.mp4 --crf=16 --audio-bitrate=320k
./finalize.sh out/hibrands-promo-16x9.mp4 out/HiBrands-Promo-16x9.mp4   # broadcast colour + faststart
```

- **Text, prices and services:** `src/Promo.tsx` and the files in `src/scenes/`
- **Timing:** `src/timeline.json` (scene starts and every sound effect, in frames at 30 fps).
  The video and the soundtrack both read it, so keep them in step by re-running the music script.
- **Colours and fonts:** `src/theme.ts` (the same palette and fonts as the website)

Remotion is free for individuals and companies with up to 3 employees. Check
[remotion.pro/license](https://www.remotion.pro/license) if the team grows beyond that.

---

# Film 2: "Engineers, not an agency" (2:14)

A longer brand film built from the agency-comparison brief. No prices appear anywhere, so it
stays correct when prices change.

| File | Size | Use it for |
|---|---|---|
| `HiBrands-Engineers-16x9.mp4` | 1920×1080 | YouTube, website, LinkedIn |
| `HiBrands-Engineers-9x16.mp4` | 1080×1920 | Reels, Shorts (under the 3-minute limit) |

| Time | Scene |
|---|---|
| 0:00 | Dark: "Traditional agency model": office tower, generic unbranded screens |
| 0:09.6 | "More layers. More overhead.": a message travels down five layers |
| 0:16.8 | "What if you could skip the layers, and work directly with the engineers?" |
| 0:24.0 | Light streak, particle burst, white flash: the music drops into the bright section |
| 0:26.4 | Hi logo: "We're engineers. Not an agency." |
| 0:33.6 | Direct access to the engineers: a client chats with the engineer, it goes live |
| 0:40.8 | The 5 services, each with its quality promise |
| 1:16.8 | "High quality in every section." 6 checks: "Not because we cut corners." |
| 1:24.0 | Split screen: agency (dark) vs HiBrands (bright), then "Premium quality. Minimum price." |
| 1:38.4 | The two workflows: Client → 3 layers → Engineering vs Client → Engineers |
| 1:48.0 | Real client sites, then the three promises |
| 2:02.4 | "Premium websites. Smarter pricing." CTA, then the logo end card |

Code: `src/v2/` (scenes in `Dark.tsx`, `Bright.tsx`, `Value.tsx`; shared looks in `kit.tsx`).
Timing and sound cues: `audio/engineers_timeline.py` writes `src/v2/timeline.json`.

```bash
python3 audio/engineers_timeline.py
python3 audio/make_music.py src/v2/timeline.json public/audio/engineers.wav
npx remotion render HiBrandsEngineers out/engineers-16x9.mp4 --crf=16 --audio-bitrate=320k
./finalize.sh out/engineers-16x9.mp4 out/HiBrands-Engineers-16x9.mp4 public/audio/engineers.wav
```

**About comparison claims.** The budget bars are labelled "Illustration, not actual figures",
and the film never says the agency's work is worse; it only compares layers and overhead.
A numeric claim such as "up to 95% less" was left out on purpose: under ASCI guidelines in
India a comparative number needs documented evidence (like quotes for equivalent work). If you
gather that evidence, add the line to the `Compare` scene in `src/v2/Value.tsx`.
