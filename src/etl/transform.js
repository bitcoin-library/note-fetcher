// combine the notes with same created_at to one document
import { randomUUID } from "crypto";
import crypto from "crypto";

// Check if all objects in an array have defined values for all keys
const mergeObjects = (arr1, arr2) => {
  const merged = arr1.map((obj) => {
    if (obj.addedByEvent[0] !== null) {
      return obj;
    } else {
      const otherObj = arr2.find((o) => o.id === obj.id);
      if (otherObj && otherObj.addedByEvent[0] !== null) {
        return otherObj;
      } else {
        return obj;
      }
    }
  });
  return merged;
};

const mergeStrings = (arr1, arr2) => {
  const merged = new Set([...arr1, ...arr2]);
  return [...merged];
};

export const transform = (documents) => {
  const transformed = documents.reduce((accumulator, currentValue) => {
    const existingObj = accumulator.find(
      (obj) => obj.created_at === currentValue.created_at
    );

    if (existingObj) {
      // name must be the same
      // created_at must be the same
      const keywords = mergeObjects(existingObj.keywords, currentValue.keywords);
      const resourceTye = mergeObjects(
        existingObj.resourceType,
        currentValue.resourceType
      );
      existingObj.keywords = keywords;
      existingObj.keywordsAsStrings = mergeStrings(existingObj.keywordsAsStrings, currentValue.keywordsAsStrings);
      existingObj.resourceType = resourceTye;
      existingObj.resourceTypeAsStrings = mergeStrings(existingObj.resourceTypeAsStrings, currentValue.resourceTypeAsStrings);
      existingObj.eventIDs.push(currentValue.eventID);
      existingObj.authors = mergeObjects(existingObj.authors, currentValue.authors);
      existingObj.authorsAsStrings = mergeStrings(existingObj.authorsAsStrings, currentValue.authorsAsStrings);
      existingObj.metadataContributors = mergeObjects(
        existingObj.metadataContributors,
        currentValue.metadataContributors
      );
      existingObj.metadataContributorsAsStrings = mergeStrings(existingObj.metadataContributorsAsStrings, currentValue.metadataContributorsAsStrings);
    } else {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
  return transformed;
};
