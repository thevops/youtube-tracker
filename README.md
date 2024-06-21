# YouTube Tracker

Monitor YouTube channels using **RSS feeds**,
and add new videos to a **collection in Raindrop.io**.

The applications is running in a loop, checking for new videos every X minutes (frequency).
Each run will add new videos uploaded since the last run (current time - frequency).

## Usage

```shell
cp config/_template.yaml config/production.yaml
# Edit config/production.yaml
docker compose build
docker compose up -d
```
