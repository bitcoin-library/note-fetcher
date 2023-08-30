import dotenv from "dotenv"
import { MeiliSearch } from 'meilisearch'

dotenv.config()

const MASTER_KEY = process.env.MASTER_KEY

export const client = new MeiliSearch({
  host: 'http://search:7700',
  apiKey: MASTER_KEY,
})

