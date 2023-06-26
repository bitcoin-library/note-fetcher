import { MeiliSearch } from 'meilisearch'

export const client = new MeiliSearch({
  host: 'http://search:7700',
  apiKey: 'MASTER_KEY',
})

