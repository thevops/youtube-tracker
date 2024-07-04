# YouTube Tracker

Monitor YouTube channels using **RSS feeds**,
and add new videos to a **collection in Raindrop.io**.

The application runs in a loop, checking for new videos every X minutes (frequency).
Each run will add new videos uploaded since the last run (the cache file contains video IDs from the previous run).

## Usage

```shell
cp config/_template.yaml config/production.yaml
# Edit config/production.yaml
docker compose build
docker compose up -d
```
