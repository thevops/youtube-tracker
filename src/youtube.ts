import Parser from "rss-parser";

interface YouTubeVideo {
  title: string;
  link: string;
}

export async function getNewerYouTubeVideos(
  previous_check: Date,
  channel_id: string,
) {
  const parser = new Parser();
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;
  const feed = await parser.parseURL(feedUrl);

  // Filter out videos that were published before the previous check
  // and return only the video title and link.
  const new_videos: YouTubeVideo[] = feed.items
    .filter((item) => {
      if (item.isoDate) {
        return new Date(item.isoDate) > previous_check;
      }
      return false;
    })
    .map((item) => {
      return {
        title: item.title || "",
        link: item.link || "",
      };
    });

  return new_videos;
}

// ----------------------------------------------------------------------------
// For testing purposes (bun only)
if (import.meta.main) {
  function test_getNewerYouTubeVideos() {
    const channel_id = "UCTTZqMWBvLsUYqYwKTdjvkw";
    const previous_check = new Date("2024-04-20T00:00:00Z");
    getNewerYouTubeVideos(previous_check, channel_id).then((new_videos) => {
      console.log(new_videos);
    });
  }

  function test_rssParser() {
    const parser = new Parser();
    const feedUrl =
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCfz8x0lVzJpb_dgWm9kPVrw";
    parser.parseURL(feedUrl).then((feed) => {
      console.log(feed.title);
      feed.items.forEach((item) => {
        console.log(item);
      });
    });
  }

  // test_getNewerYouTubeVideos();
  // test_rssParser();
}
