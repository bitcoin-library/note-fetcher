import { client } from "./client.js";

const index = client.index("nostr_notes");
client
  .index("nostr_notes")
  .updateFilterableAttributes([
    "id",
    "eventID",
    "eventIDs",
    "uri",
    "keywordsAsStrings",
    "keywordsAsIds",
    "resourceTypeAsStrings",
    "resourceTypeAsIds",
    "authorsAsStrings",
    "metadataContributorsAsStrings",
  ])

client
  .index("nostr_notes")
  .updateSortableAttributes([
    "created_at"
  ]);


export default index;
