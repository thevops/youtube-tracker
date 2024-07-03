import Parser from "rss-parser";

interface YouTubeVideo {
  title: string;
  link: string;
}

export async function getNewerYouTubeVideos(
  channel_id: string,
  cached_ids: string[],
) {
  const parser = new Parser();
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;
  const feed = await parser.parseURL(feedUrl);

  // Go through the feed and filter out videos that are not in the cached_ids (item.id is used as a key)
  // and return only the video title and link.
  const new_videos: YouTubeVideo[] = feed.items
    .filter((item) => {
      if (item.id) {
        return !cached_ids.includes(item.id);
      }
      return false;
    })
    .map((item) => {
      return {
        title: item.title || "",
        link: item.link || "",
      };
    });

  // Create a list of video IDs to be used in the cache
  const new_cached_ids = feed.items.map((video) => {
    return video.id;
  });

  return [new_videos, new_cached_ids];
}

// ----------------------------------------------------------------------------
// For testing purposes (bun only)
if (import.meta.main) {
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

  function test_getNewerYouTubeVideos() {
    const channel_id = "UCfz8x0lVzJpb_dgWm9kPVrw";
    const cached_ids = [
      // "yt:video:HQY2jgSN6pA",
      "yt:video:PV1sBiC85Yc",
      "yt:video:0pG3txMPKJI",
      "yt:video:oY9le4DDAOY",
      "yt:video:hgNN2wOE7lc",
      // "yt:video:tgwxMfIsLJY",
      "yt:video:6cwb3xNcqqI",
      "yt:video:-1H0BeN9hIk",
      "yt:video:Ca1qxZoxBkg",
      "yt:video:vHQtWrqrFho",
      "yt:video:Gn6btuH3ULw",
      "yt:video:U6weXlzQxoY",
      "yt:video:hQJWGzogIiI",
      "yt:video:7-3dVxmG9qs",
      "yt:video:WiFLtcBvGMU",
    ];
    getNewerYouTubeVideos(channel_id, cached_ids).then(
      ([new_videos, new_cached_ids]) => {
        console.log(new_videos);
        console.log(new_cached_ids);
      },
    );
  }

  // test_rssParser();
  // test_getNewerYouTubeVideos();
}
