# The Loft

Three pages. No marketing copy.

- `index.html` — the archive of gatherings
- `understanding.html` — what hosting here involves
- `request.html` — request a date

## Publish

```bash
cd loft-site
git init
git add .
git commit -m "The Loft"
git branch -M main
git remote add origin https://github.com/syracusetp/the-loft.git
git push -u origin main --force
```

Then **Settings → Pages → Deploy from a branch → `main` / root**.
Live at `https://syracusetp.github.io/the-loft/`.

`--force` is there because it replaces the earlier version already committed.
Drop it if the repo is empty.

## Add a gathering

Edit `data/events.json`:

```json
{
  "id": "2026-08-02-supper-club",
  "name": "August Supper Club",
  "type": "Dinner",
  "date": "2026-08-02",
  "community": "The Loft Table",
  "photos": [
    "images/events/august-1.jpg",
    "images/events/august-2.jpg"
  ]
}
```

`type` and `community` both become filters automatically. Up to four photos
show per entry; any slot left empty falls back to a soft gradient, so a
partial set still looks intentional.

## Note on local preview

Opening the files directly with `file://` won't load the archive — browsers
block `fetch` on local files. To preview locally:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`. On GitHub Pages it works normally.

## Before publishing

- [ ] House fund amounts in `understanding.html` (currently `$[__]`)
- [ ] Form embed in `request.html` (labelled comment marks the spot)
- [ ] Real photos into `images/events/`, referenced from `data/events.json`
- [ ] Confirm the event list is accurate
