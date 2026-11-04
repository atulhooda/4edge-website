# 4edge-website

Website for **4Edge**, premium PVC edge banding by Prime Edge Polycraft LLP, Pune.

## Pages
- `index.html`: Home
- `products.html`: Products & size codes
- `shades.html`: Shade library
- `about.html`: About
- `contact.html`: Contact / request a quote

## Editing
- Shared header, footer and quote section live in `index.html`.
- Inner pages are generated from `_src/*.html`. After editing, run:

  ```
  python3 build.py
  ```

- Shade list: `js/shades-data.js` (currently placeholder data).

## Run locally
```
python3 -m http.server 8080
```
Then open http://localhost:8080
