import type { RaindropItem } from "raindrop-api";
import { logger, Config, raindropAPI } from "./config";
import { getNewerYouTubeVideos } from "./youtube";

async function main() {
  logger.info("Running...");

  for (const feed of Config.feeds) {
    logger.debug(`Checking feed: ${feed.name}`);

    // Get current time and subtract the frequency time (plus 5 minutes more as a buffer) in minutes
    const previous_check = new Date(
      Date.now() - (Config.frequency + 5) * 60000,
    );
    logger.debug(`Previous check: ${previous_check.toISOString()}`);

    const new_videos = await getNewerYouTubeVideos(
      previous_check,
      feed.channel_id,
    );
    if (new_videos.length <= 0) {
      logger.debug("No new videos found");
      continue;
    }

    logger.debug(`Found ${new_videos.length} new videos`);
    for (const video of new_videos) {
      logger.info(`Adding video to Raindrop: ${video.link}`);
      const item: RaindropItem = {
        link: video.link,
        collection: {
          $id: Number(Config.raindrop_collection_id),
        }
      }
      const res = await raindropAPI.addItem(item);
      if (res) {
        logger.info("Video added successfully");
      } else {
        logger.error("Failed to add video");
      }
    }
  }
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
