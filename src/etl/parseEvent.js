import { randomUUID } from "crypto";
import bots from "../../bots.js";
import crypto from "crypto";


function findAddEvent(event, property) {
  const tBot = bots.find((b) => b.id === property.uri);
  if (tBot && tBot.pk === event.pubkey) {
    return event.id;
  } else {
    return event.id;
  }
}

// create a hash of id
function hashId(id) {
  const hash = crypto.createHash("sha256");
  hash.update(id);
  return hash.digest("hex");
}

function parseMetadataArrays(arr, attr, event) {
  if (!arr[attr]) return [];
  // we make sure prop is an array
  const prop = Array.isArray(arr[attr]) ? arr[attr] : [arr[attr]];

  return prop.map((p) => ({
    ...p,
    addedByEvent: [findAddEvent(event, p)],
  }));
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

      metadata["id"] = hashId(id);
      metadata["uri"] = id;
      metadata["created_at"] = event.created_at;
      metadata["eventID"] = event.id;
      metadata["eventIDs"] = [];
      metadata["keywords"] = parseMetadataArrays(metadata, "keywords", event);
      metadata["keywordsAsStrings"] = metadata.keywords.map(e => e.title)
      metadata["resourceType"] = parseMetadataArrays(metadata, "resourceType", event);
      metadata["resourceTypeAsStrings"] = metadata.resourceType.map(e => e.title)
      metadata["authors"] = parseMetadataArrays(metadata, "authors", event);
      metadata["authorsAsStrings"] = metadata.authors.map(e => e.name)
      metadata["metadataContributors"] = parseMetadataArrays(metadata, "metadataContributor", event);
      metadata["metadataContributorsAsStrings"] = metadata.metadataContributors.map(e => e.name)
      // TODO clean up the metadata of tags and resourceType?
      return metadata;
    } else {
      return null;
    }
  });
  return documents.filter((doc) => doc !== null);
};
