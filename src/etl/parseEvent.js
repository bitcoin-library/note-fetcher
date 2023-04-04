import { randomUUID } from "crypto";
import bots from "../../bots.js";

function findAddEvent(event, keyword) {
  const tBot = bots.find((b) => b.id === keyword.uri);
  if (tBot && tBot.pk === event.pubkey) {
    console.log("found add event");
    return event.id;
  } else {
    console.log("did not find add event")
    return null;
  }
}

/**
 *
 * @param {*} event
 * @returns {Array[Object] | Array[] }
 */
export const parseEvent = (event) => {
  const documents = event.tags.flatMap((tag) => {
    if (tag[0] === "#m" || tag[0] === "metadata") {
      const { id, ...metadata } = JSON.parse(tag[1]);

      if (!id) return null;

      metadata["uri"] = id;
      metadata["id"] = randomUUID();
      metadata["created_at"] = event.created_at;
      metadata["eventID"] = event.id;
      metadata["eventIDs"] = [];
      metadata["keywords"] = metadata.keywords.map((keyword) => ({
        ...keyword,
        addedByEvent: findAddEvent(event, keyword),
      }));
      metadata["resourceType"] = metadata.resourceType.map((keyword) => ({
        ...keyword,
        addedByEvent: findAddEvent(event, keyword),
      }));
      // TODO clean up the metadata of tags and resourceType?
      return metadata;
    } else {
      return null;
    }
  });
  return documents.filter((doc) => doc !== null);
};
