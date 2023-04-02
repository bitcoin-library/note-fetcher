import { client } from "./client.js";

const index = client.index("nostr_notes");
client.index("nostr_notes").updateFilterableAttributes(["id", "uri"]);

export default index