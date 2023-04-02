interface VocabsEntry {
  id: string;
  title: string;
  uri: string;
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