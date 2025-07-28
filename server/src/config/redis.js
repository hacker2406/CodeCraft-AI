import { Redis } from "@upstash/redis";
import 'dotenv/config'

// This will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from your .env
const redis = Redis.fromEnv();


export default redis;