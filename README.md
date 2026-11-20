# Sticky Notes

A single-page sticky notes board built with React and TypeScript, with no UI component libraries. Notes can be placed at a chosen position and size, moved, resized, recoloured, edited and deleted, and they're saved in the browser between visits.

See [ARCHITECTURE.md](ARCHITECTURE.md) for how the app is structured.

## Getting started

Requires Node.js (developed and tested on Node 24) and npm.

```sh
npm install
npm run dev        # start the dev server, then open the URL it prints
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks, then builds a production bundle to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Runs the unit tests on every change |
| `npm run lint` | Lints with Oxlint |

## Using the app

- **Create a note:** click the red note button in the toolbar, then click the board to place a default-sized note, or press and drag to draw the note at the size you want. Pick a colour from the swatches while placing. Press Escape, click the note button again or click ✕ on the colour bar to cancel. From the keyboard, pressing Enter or Space on the note button adds a note straight away.
- **Write in a note:** click into it and type.
- **Move a note:** drag the strip along its top. The note you drop comes to the front.
- **Resize a note:** drag the grip in its bottom-right corner.
- **Change a note's colour:** click the note, then pick a swatch. The highlighted note, shown with a folded corner, is the one that changes.
- **Delete a note:** drag it onto the trash in the toolbar, or focus the note itself and press Delete or Backspace. In the text, press Escape first to move focus to the note.
- **Pan around the board:** scroll with a trackpad or mouse wheel, or drag an empty part of the board. The board has no edges, so notes can go anywhere.

## Brief coverage

| Feature | Status |
|---|---|
| 1. Create a note of a specified size at a specified position | Done: click to place, or drag to set the size |
| 2. Change note size by dragging | Done: native resize grip, synced to state with `ResizeObserver` |
| 3. Move a note by dragging | Done |
| 4. Remove a note by dragging it over the trash | Done, plus the Delete key |
| I. Enter and edit note text | Done |
| II. Move notes to the front | Done on drop |
| III. Save to local storage | Done |
| IV. Different note colours | Done: five colours, set when placing or afterwards |
| V. Save to a REST API | Not implemented |

## Browser support

Built for desktop at 1024×768 and above, in current Chrome, Edge and Firefox. The folded corner on the selected note uses CSS `corner-shape`. Browsers without it show an outline instead.

## Known limitations

- Notes can't be moved with the keyboard yet. Adding and deleting work from the keyboard; moving needs a pointer.
- A note comes to the front when you finish dragging it, not when you click it.
- Clicking an empty part of the board doesn't deselect the highlighted note.
- The pan position isn't saved, so the board opens at its origin after a reload.
- Dragging a note to the edge of the window doesn't pan the board automatically. Pan first, then keep dragging.
- Saving to a REST API (bonus V) isn't implemented. Persistence goes through the `loadNotes`/`saveNotes` functions in `noteStorage.ts`, so an async API version could be swapped in behind the same interface.
