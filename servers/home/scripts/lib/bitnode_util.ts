export function getAugRepMultiplier(ns: NS) {
  try {
    return ns.getBitNodeMultipliers().AugmentationRepCost
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multiplier of 1
  }
  return 1;
}

export function getAugCostMultiplier(ns: NS) {
  try {
    return ns.getBitNodeMultipliers().AugmentationMoneyCost
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multiplier of 1
  }
  return 1;
}

export function getGangUniqueAug(ns: NS) {
  try {
    return ns.getBitNodeMultipliers().GangUniqueAugs
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multiplier of 1
  }
  return 1;
}