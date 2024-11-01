# YouTube Tracker

Monitor YouTube channels using **RSS feeds**,
and add new videos to a **collection in Raindrop.io**.

The application runs in a loop, checking for new videos every X minutes (frequency).
Each run will add new videos uploaded since the last run
(the cache file contains video IDs from the previous run).

## 🎁 Features

- Monitor multiple YouTube channels
- Add new videos to a Raindrop.io collection
- Configurable check frequency
- Caching of previously processed videos

## 📝 Prerequisites

- Docker
- Docker Compose
- [Bun](https://bun.sh/) (JavaScript runtime; drop-in replacement for Node.js)
- [Raindrop.io](https://raindrop.io/) account

## 🛠️ Installation

### 1. Clone the repository:

```shell
git clone https://github.com/thevops/youtube-tracker
cd youtube-tracker
```

### 2. Copy the configuration template and edit it:

```shell
cp config/_template.yaml config/production.yaml
# Edit config/production.yaml with your preferred settings
```

#### Find YouTube channel ID with the following command:

```shell
# Replace the URL with the channel URL
curl -s https://www.youtube.com/@DevOpsToolkit | grep -oP '(?<=/channel/)[\w-]+' | sort | uniq
```

### 3. Build and start the application using Docker Compose:

```shell
docker compose build
docker compose up -d
```

> [!NOTE]
> Public image is available at
> https://github.com/thevops/youtube-tracker/pkgs/container/youtube-tracker

## 🧾 Configuration

The configuration file is located at `config/production.yaml`. Here is an example configuration:

```yaml
log_level: info
frequency: 30 # minutes
raindrop_token: "your_raindrop_token"
raindrop_collection_id: "your_collection_id"
cache_file_path: "/data/cache.json"
feeds:
  - name: DevOpsToolkit
    channel_id: UCfz8x0lVzJpb_dgWm9kPVrw
  - name: Mateusz Chrobok
    channel_id: UCTTZqMWBvLsUYqYwKTdjvkw
  # Add more channels as needed
```

## 🧪 Development

To start the application for local development:

```shell
bun src/index.ts config/production.yaml
```

To run a single script:

```shell
bun <script_name>
```

[./src/youtube.ts](./src/youtube.ts) file can be executed separately
to test the YouTube functionality.
When running the script in this way, the configuration file is not required.
For more details, see the script's `if (import.meta.main) {}` block.

## 📦 Building the Docker Image

To build the Docker image:

```shell
docker buildx build --platform linux/arm64 -t local/youtube-tracker .
```

## 🧽 Formatting Code

To format the code using Prettier:

```shell
bun x prettier --write .
```

## License

This project is licensed under the MIT License.
