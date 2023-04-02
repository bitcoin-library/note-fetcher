import { pollRelay } from "./pollRelay.js";
import { parseEvent } from "./src/parseEvent.js";
import addDocuments from "./src/search/addDocuments.js";
import { transform } from "./src/transform.js";

let lastFetchedEvent = 0

// get events and retrieve the last timestamp

async function main() {
  setInterval(async () => {
    const events = await pollRelay(lastFetchedEvent);
    if (events) {
      const documents = events.flatMap((event) => {
        const metadata = parseEvent(event)
        if (metadata) {
          return metadata
        } else {
          return null
        }
      });
      const transformed = transform(documents)
      addDocuments(transformed)
    }
    lastFetchedEvent = events.length ? events[events.length - 1]["created_at"] + 1 : lastFetchedEvent;
  }, 5000);
}

main();
