import index from "./index.js";

const documentExists = async (uri) => {
  const res = await index.search("", {
    filter: [`uri = "${uri}"`],
  });
  if (res.hits.length > 0) {
    console.log(`document with uri: ${uri} already exists`);
    return true;
  } else {
    return false;
  }
};

export default async (documents) => {
  const filteredDocuments = documents.filter(
    (doc) => documentExists(doc.uri)
  );

  let response = await index.addDocuments(filteredDocuments, { primaryKey: "id" });

  console.log(response); // => { "uid": 0 }
  return response;
};
