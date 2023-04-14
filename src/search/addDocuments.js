import index from "./index.js";
import { mergeDocuments } from "./mergeDocuments.js";

const groupData = (data) => {
  const groupedData = Object.values(
    data.reduce((acc, obj) => {
      const key = obj.id;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {})
  );
  return groupedData;
};

const documentExists = async (doc) => {
  const res = await index.search("", {
    filter: [`id = "${doc.id}"`],
  });
  if (res.hits.length > 0) {
    console.log(`document with uri: ${doc.uri} already exists`);
    // update the document
    // retrieve the document
    const docExisting = res.hits[0];
    // merge the documents
    const mergedDoc = mergeDocuments([doc, docExisting]);
    // update the document
    console.log("updating...");
    let response = await index.addDocuments([mergedDoc], {
      primaryKey: "id",
    });
    console.log(response);
    return true;
  } else {
    return false;
  }
};

export default async (documents) => {
  const filteredDocuments = documents.filter(async (doc) => {
    const exists = await documentExists(doc);
    console.log(exists);
    return !exists;
  });

  const groupedData = groupData(filteredDocuments);
  const merged = groupedData.map(element => {
    return mergeDocuments(element)
  });

  let response = await index.addDocuments(merged, {
    primaryKey: "id",
  });

  return response;
};
