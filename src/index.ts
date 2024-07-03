import type { RaindropItem } from "raindrop-api";
import { logger, Config, raindropAPI } from "./config";
import { getNewerYouTubeVideos } from "./youtube";
import { Cache } from "./cache";

async function main() {
  logger.info("Running...");

  // Cache is used to store the video IDs from the previous run
  const cache = new Cache(Config.cache_file_path);
  const cacheData = await cache.read();

  for (const feed of Config.feeds) {
    logger.debug(`Checking feed: ${feed.name}`);

    // Create an empty array if the feed doesn't exist in the cache
    // If the feed doesn't exist in the cache, it means that it's the first run
    if (!cacheData.feeds[feed.channel_id]) {
      cacheData.feeds[feed.channel_id] = [];
    }

    const [new_videos, new_cached_ids] = await getNewerYouTubeVideos(
      feed.channel_id,
      cacheData.feeds[feed.channel_id],
    );
    if (new_videos.length <= 0) {
      logger.debug("No new videos found");
      continue;
    }

    // Check if that was the first run
    if (cacheData.feeds[feed.channel_id].length === 0) {
      logger.debug(`First run for ${feed.channel_id}, skipping Raindrop`);
      cacheData.feeds[feed.channel_id] = new_cached_ids;
      continue;
    }

    logger.debug(`Found ${new_videos.length} new videos`);
    // Update the cache with the new video IDs
    cacheData.feeds[feed.channel_id] = new_cached_ids;

    for (const video of new_videos) {
      logger.info(`Adding video to Raindrop: ${video.link}`);
      const item: RaindropItem = {
        link: video.link,
        collection: {
          $id: Number(Config.raindrop_collection_id),
        },
      };
      const res = await raindropAPI.addItem(item);
      if (res) {
        logger.info("Video added successfully");
      } else {
        logger.error("Failed to add video");
      }
    }
  }

  // Write the updated cache
  await cache.write(cacheData);
}

async function runForever() {
  logger.info("Starting...");
  while (true) {
    await main();
    // Sleep for X seconds
    await new Promise((resolve) =>
      setTimeout(resolve, Config.frequency * 60 * 1000),
    );
  }
}

runForever();
