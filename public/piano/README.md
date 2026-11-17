# Piano samples

The homepage's piano improvisations (`components/wustep/PianoPhrase.tsx`,
played by `lib/piano-voice.ts`) use these files.

They are excerpts of the **Salamander Grand Piano V3** by **Alexander Holm**,
a Yamaha C5 grand recorded at 48 kHz/24-bit with two AKG C414s. The original
is at <https://archive.org/details/SalamanderGrandPianoV3>.

It is licensed under the Creative Commons Attribution 3.0 Unported license
(CC BY 3.0): <https://creativecommons.org/licenses/by/3.0/>. These excerpts
are shared under the same license.

## What was changed

This is a small subset of the original, adapted with
`scripts/build-piano-samples.mts` from its 44.1 kHz/16-bit release:

- 21 notes, every minor third from C2 to C7, in 3 of its 16 velocity layers
  (v5, v9 and v13). Files keep Salamander's names, with `Ds` for D♯ and `Fs`
  for F♯.
- Each note is trimmed to just before the hammer, cut to 4–8 seconds
  depending on register, and faded out at the end.
- Levels are matched across notes and layers. The player applies velocity.
- Each file is encoded as a VBR stereo MP3 (LAME `-V 3`).

The release-noise, string-resonance and pedal samples are not included.

## Caching

`next.config.js` serves `/piano/*.mp3` as immutable for a year. If a sample
ever changes, give it a new file name.
