const mergeProperties = (newProps, existingProps) => {
  const allProps = [...newProps, ...existingProps];
  const merged = [];
  allProps.forEach((prop) => {
    const existingIndex = merged.findIndex((p) => p.uri === prop.uri);
    if (existingIndex !== -1) {
      const updated = merged.find((p) => p.uri === prop.uri);
      updated.addedByEvent = [
        ...new Set([...updated.addedByEvent, ...prop.addedByEvent]),
      ];
      merged[existingIndex] = updated;
    } else {
      merged.push(prop);
    }
  });
  return merged;
};

// oldest one has to come first
// TODO other attributes have to get merged and updated as well
export function mergeDocuments(arr) {
  // find the newest document
  const newest = arr.reduce((acc, curr) => {
    return new Date(acc.created_at) > new Date(curr.created_at) ? acc : curr;
  });
  const sorted = arr.sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });
  const merged = sorted.reduce((acc, curr) => {
    if (curr?.keywords) {
      const mergedKeywords = mergeProperties(curr.keywords, acc.keywords);
      acc.keywords = mergedKeywords;
      if (curr?.authors) {
        
        const mergedAuthors = mergeProperties(curr.authors, acc.authors);
        acc.authors = mergedAuthors;
      }
      if (curr?.metadataContributor) {
        const mergedMetadataContributor = mergeProperties(
          curr.metadataContributor,
          acc.metadataContributor
        );
        acc.metadataContributor = mergedMetadataContributor;
      }
      return acc;
    }
  }, sorted[0]);
  merged.updated_at = newest.created_at;
  return merged;
}
