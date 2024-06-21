import * as fs from "fs";
import * as yaml from "js-yaml";
import { SimpleFMTLogger } from "simple-fmt-logger";
import { Raindrop } from "raindrop-api";

interface Feed {
  name: string;
  channel_id: string;
}

interface ConfigSchema {
  log_level: string;
  feeds: Feed[];
  frequency: number;
  raindrop_token: string;
  raindrop_collection_id: string;

  [key: string]: any;
}

function validateConfig(config: ConfigSchema) {
  const requiredFields = [
    "log_level",
    "feeds",
    "frequency",
    "raindrop_token",
    "raindrop_collection_id",
  ];

  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Load the config file
const configPath = process.argv[2] || "config.yaml";
export const Config = yaml.load(
  fs.readFileSync(configPath, "utf8"),
) as ConfigSchema;
validateConfig(Config);

// Initialize the logger
export const logger = new SimpleFMTLogger(Config.log_level || "info");

// Initialize the Raindrop API
export const raindropAPI = new Raindrop(Config.raindrop_token);
