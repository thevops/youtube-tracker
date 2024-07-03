import * as fs from "fs";

export interface CacheSchema {
  feeds: {
    [channelName: string]: string[];
  };
}

export class Cache {
  private cacheFilePath: string;

  constructor(path: string) {
    this.cacheFilePath = path;
    // Define empty object as default data
    const defaultData: CacheSchema = { feeds: {} };
    // Create the cache file if it doesn't exist
    if (!fs.existsSync(this.cacheFilePath)) {
      this.write(defaultData);
    }
  }

  // Read the cache file and return it
  public async read() {
    return new Promise<CacheSchema>((resolve, reject) => {
      fs.readFile(this.cacheFilePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  // Write (overwrite) the given object to the cache file
  public async write(data: CacheSchema) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(this.cacheFilePath, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
