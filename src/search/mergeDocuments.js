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
  // TODO this should be refactored
  const merged = sorted.reduce((acc, curr) => {
    if (curr?.keywords) {
      const mergedKeywords = mergeProperties(curr.keywords, acc.keywords);
      acc.keywords = mergedKeywords;
    }
    if (curr?.keywordsAsStrings) {
      const mergedKeywordsAsStrings = new Set([ ...acc.keywordsAsStrings, ...curr.keywordsAsStrings ]);
      acc.keywordsAsStrings = [...mergedKeywordsAsStrings];
    }
    if (curr?.keywordsAsIds) {
      const mergedKeywordsAsIds = new Set([ ...acc.keywordsAsIds, ...curr.keywordsAsIds ]);
      acc.keywordsAsIds = [...mergedKeywordsAsIds];
    }
    if (curr?.resourceType) {
      const mergedResourceTypes = mergeProperties(
        curr.resourceType,
        acc.resourceType
      );
      acc.resourceType = mergedResourceTypes;
    }
    if (curr?.resourceTypeAsStrings) {
      const mergedResourceTypesAsStrings = new Set([ ...acc.resourceTypeAsStrings, ...curr.resourceTypeAsStrings ]);
      acc.resourceTypeAsStrings = [...mergedResourceTypesAsStrings];
    }
    if (curr?.resourceTypeAsIds) {
      const mergedResourceTypesAsIds = new Set([ ...acc.resourceTypeAsIds, ...curr.resourceTypeAsIds ]);
      acc.resourceTypeAsIds = [...mergedResourceTypesAsIds];
    }
    if (curr?.authors) {
      const mergedAuthors = mergeProperties(curr.authors, acc.authors);
      acc.authors = mergedAuthors;
    }
    if (curr?.authorsAsStrings) {
      const mergedAuthorsAsStrings = new Set([ ...acc.authorsAsStrings, ...curr.authorsAsStrings ]);
      acc.authorsAsStrings = [...mergedAuthorsAsStrings];
    }
    if (curr?.metadataContributor) {
      const mergedMetadataContributors = mergeProperties(
        curr.metadataContributors,
        acc.metadataContributors
      );
      acc.metadataContributors = mergedMetadataContributors;
    }
    if (curr?.metadataContributorsAsStrings) {
      const mergedMetadataContributorsAsStrings = new Set([ ...acc.metadataContributorsAsStrings, ...curr.metadataContributorsAsStrings ]);
      acc.metadataContributorsAsStrings = [...mergedMetadataContributorsAsStrings];
    }
    return acc;
  }, sorted[0]);
  merged.updated_at = newest.created_at;
  return merged;
}
