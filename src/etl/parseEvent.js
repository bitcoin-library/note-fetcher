import { randomUUID } from "crypto";
import crypto from "crypto";

const createHash = (val) => {
  const hash = crypto.createHash("sha256");
  hash.update(val);
  return hash.digest("hex");
};

/**
 * 
 * @param {*} event 
 * @returns {Array[Object] | Array[] }
 */
export const parseEvent = (event) => {
  const documents = event.tags.flatMap((tag) => {
    if (tag[0] === "#m" || tag[0] === "metadata") {
      const {id, ...metadata} = JSON.parse(tag[1]);
      
      if (!id) return null
      // hash the uri to get the id

      metadata["uri"] = id;
      metadata["id"] = randomUUID()
      metadata["created_at"] = event.created_at;
      metadata["eventID"] = event.id
      metadata["eventIDs"] = []
      // TODO clean up the metadata of tags and resourceType?
      return metadata
    } else {
      return null
    }
  });
  return documents.filter((doc) => doc !== null);
};
