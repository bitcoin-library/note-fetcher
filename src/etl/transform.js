// combine the notes with same created_at to one document
import { randomUUID } from "crypto";
import crypto from "crypto";

// Check if all objects in an array have defined values for all keys
const isAllDefined = (arr) => {
  return arr.every((obj) => {
    return Object.values(obj).every((val) => {
      return val !== null && val !== undefined;
    });
  });
};

const merge = (arr1, arr2) => {
  if (isAllDefined(arr1)) {
    return arr1;
  } else if (isAllDefined(arr2)) {
    return arr2;
  }
  const merged = arr1.reduce((acc, obj, index) => {
    const newObj = Object.assign({}, obj);
    Object.keys(obj).forEach((key) => {
      if (
        key === "addedByEvent" &&
        (newObj[key] === undefined || newObj[key] === null)
      ) {
        const otherObj =
          index === 0
            ? arr2.find(
                (o) =>
                  o.id === obj.id &&
                  o.addedByEvent !== undefined &&
                  o.addedByEvent !== null
              )
            : arr1.find(
                (o) =>
                  o.id === obj.id &&
                  o.addedByEvent !== undefined &&
                  o.addedByEvent !== null
              );
        if (otherObj) {
          newObj[key] = otherObj[key];
        }
      } else if (newObj[key] === undefined || newObj[key] === null) {
        const otherObj =
          index === 0
            ? arr2.find((o) => o[key] !== undefined && o[key] !== null)
            : arr1.find((o) => o[key] !== undefined && o[key] !== null);
        if (otherObj) {
          newObj[key] = otherObj[key];
        }
      }
    });
    acc.push(newObj);
    return acc;
  }, []);
  return merged;
};

const merge2 = (arr1, arr2) => {
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

export const transform = (documents) => {
  const transformed = documents.reduce((accumulator, currentValue) => {
    const existingObj = accumulator.find(
      (obj) => obj.created_at === currentValue.created_at
    );

    if (existingObj) {
      // name must be the same
      // created_at must be the same
      const keywords = merge2(existingObj.keywords, currentValue.keywords);
      const resourceTye = merge2(
        existingObj.resourceType,
        currentValue.resourceType
      );
      existingObj.keywords = keywords;
      existingObj.resourceType = resourceTye;
      existingObj.eventIDs.push(currentValue.eventID);
      existingObj.authors = merge2(existingObj.authors, currentValue.authors);
      existingObj.metadataContributor = merge2(
        existingObj.metadataContributor,
        currentValue.metadataContributor
      );
    } else {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
  return transformed;
};
