import { capitalCase } from "capital-case";

/**
 * Strip title
 * @param fullTitle "SubObject - TopObject"
 * @param topTitle "TopObject"
 * @returns "SubObject"
 */
export function stripTitle(fullTitle, topTitle) {
  return fullTitle.replace(` - ${topTitle}`, "");
}

export function nicifyTitle(title) {
  return capitalCase(title)
    .replace("ae", "ä")
    .replace("oe", "ö")
    .replace("ue", "ü");
}
