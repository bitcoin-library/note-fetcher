interface VocabsEntry {
  id: string;
  title: string;
  uri: string;
  addedByEvent: Array<string>; // we can then use this to be more confident of that setting if array is longer
}

interface Document {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  resourceType: Array<VocabsEntry>
  keywords: Array<VocabsEntry>
  eventIDs: Array<string>
}

interface EventMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  resourceType: Array<VocabsEntry>
  keywords: Array<VocabsEntry>
  eventID: string
  eventIDs: Array<null>

}