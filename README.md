# RoadLint Monitor

[Open the live monitor](https://ttezer.github.io/RoadLint-Monitor/) ·
[View the public repository](https://github.com/ttezer/RoadLint-Monitor)

RoadLint Monitor is a public browser monitor for WZDx 4.2 Work Zone Feed data.
It displays the latest WSDOT snapshot on a map and runs the RoadLint Rust/WASM
analyzer locally in the browser.

![GitHub Pages deployment](https://github.com/ttezer/RoadLint-Monitor/actions/workflows/pages.yml/badge.svg)

## What is published here?

This repository contains the generated browser artifact and the latest
fixed-source WSDOT snapshot:

- `index.html`, JavaScript, CSS, examples, and the browser WASM bundle;
- `live-feed.json`, the latest accepted WSDOT snapshot envelope;
- `status.json`, publication time, source identity, feature count, and snapshot
  SHA-256 metadata.

The analyzer source, rules, authority evidence, and publication workflow remain
in the private [`RoadLint`](https://github.com/ttezer/RoadLint) repository.

## Live site and data source

**Website:** [ttezer.github.io/RoadLint-Monitor](https://ttezer.github.io/RoadLint-Monitor/)

**Source feed:** [`https://wzdx.wsdot.wa.gov/api/v4/WorkZoneFeed`](https://wzdx.wsdot.wa.gov/api/v4/WorkZoneFeed)

The public publication is refreshed on a scheduled GitHub Actions run, currently
every 15 minutes. The page is a snapshot publication, so it may be behind the
upstream feed by one schedule interval. Check [`status.json`](https://ttezer.github.io/RoadLint-Monitor/status.json)
for the last publication time, fetch time, feature count, and content hash.

## How to use it

1. Open the [live monitor](https://ttezer.github.io/RoadLint-Monitor/).
2. Review the map and feed inspector for the current snapshot.
3. Use the `01 / INGEST` controls to load a local JSON/GeoJSON feed when you
   want to analyze another input in your browser.
4. Inspect the report, findings, recovery boundary, and comparison sections.

Analysis runs locally in the browser. The public site does not send arbitrary
feed URLs through a server-side proxy.

## Scope and boundaries

- Normative target: WZDx 4.2 Work Zone Feed only.
- Device Feed, TDx, CWZ, and pre-4.x WZDx lineage are outside this publication.
- No real producer profile or automatic recovery is applied.
- This repository is a generated publication; change the private `RoadLint`
  source and let the publication workflow update this repository.
