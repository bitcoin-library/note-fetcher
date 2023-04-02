// combine the notes with same created_at to one document
import { randomUUID } from "crypto";

export const transform = (documents) => {
  const transformed = documents.reduce((accumulator, currentValue) => {
    const existingObj = accumulator.find(obj => obj.created_at === currentValue.created_at);
  
    if (existingObj) {
      existingObj.id = randomUUID()
      // name must be the same
      // created_at must be the same
      // existingObj.keywords.push(currentValue.keywords)
      // existingObj.resourceType.push(currentValue.resourceType)
      existingObj.eventIDs.push(currentValue.eventID)
    } else {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, []);
  return transformed;
}