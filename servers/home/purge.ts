/**
 * Script intended to reset the state of `home`, in case script integrity is in question
 */

export async function main(ns: NS): Promise<void> {
  const exclusions = [
    'z_from_others/insight', // Helps avoid a reported issue with API call limits
    '\.lit', // No point purging the literature files; we'd just scrape them again...
    '\.exe', // Can be a rather pricey mistake early in a run...
  ]

  function isExcluded(file: string): boolean {
    for (const exclusion of exclusions) {
      if (file.match(exclusion)) {
        return true;
      }
    }
    return false;
  }

  // REFINE May want to do several passes, depending upon how 'directories' are handled.
  const allFiles = ns.ls('home');
  allFiles.filter(file => !isExcluded(file))
    .forEach((file) => {ns.rm(file)});
}