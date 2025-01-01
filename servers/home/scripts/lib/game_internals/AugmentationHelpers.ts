// Derived from bitburner-src/src/Augmentations/AugmentationHelpers.ts
// noinspection MagicNumberJS

import type {Augmentation}                         from '@/game_internal_types/Augmentation/Augmentation';
import type {PlayerObject}                         from '@/game_internal_types/PersonObjects/Player/PlayerObject';
import type {AugmentationName}                     from '@enums';
import {getAugCostMultiplier, getAugRepMultiplier} from '../bitnode_util';
import {exposeGameInternalObjects}                 from '../exploits';
import {CONSTANTS}                                 from './Constants';

if (!globalThis.Player) {
  exposeGameInternalObjects();
}

const player = <PlayerObject>globalThis.Player;

const soaAugmentationNames = [
  'SoA - Beauty of Aphrodite',
  'SoA - Chaos of Dionysus',
  'SoA - Flood of Poseidon',
  'SoA - Hunt of Artemis',
  'SoA - Knowledge of Apollo',
  'SoA - Might of Ares',
  'SoA - Trickery of Hermes',
  'SoA - phyzical WKS harmonizer',
  'SoA - Wisdom of Athena',
];

export function getBaseAugmentationPriceMultiplier(): number {
  return CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][player.activeSourceFileLvl(11)];
}

export function getGenericAugmentationPriceMultiplier(): number {
  const queuedNonSoAAugmentationList = player.queuedAugmentations.filter((augmentation) => {
    return !soaAugmentationNames.includes(augmentation.name);
  });
  return Math.pow(getBaseAugmentationPriceMultiplier(), queuedNonSoAAugmentationList.length);
}

export function isRepeatableAug(aug: Augmentation | string): boolean {
  const augName = typeof aug === 'string' ? aug : aug.name;
  return augName === 'NeuroFlux Governor';
}

export interface AugmentationCosts {
  moneyCost: number;
  repCost: number;
}

export function getAugCost(ns: NS, aug: Augmentation): AugmentationCosts {
  const repMult = getAugRepMultiplier(ns);
  const costMult = getAugCostMultiplier(ns);

  let moneyCost = aug.baseCost;
  let repCost = aug.baseRepRequirement;

  const NFG = <AugmentationName>'NeuroFlux Governor';

  if (aug.name === NFG) {
    const multiplier = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, aug.getLevel());
    repCost = aug.baseRepRequirement * multiplier * repMult;
    moneyCost = aug.baseCost * multiplier * costMult;
    moneyCost *= getGenericAugmentationPriceMultiplier();
  } else if (soaAugmentationNames.includes(aug.name)) {
    const soaAugCount = soaAugmentationNames.filter((augName) => player.hasAugmentation(augName)).length;
    moneyCost = aug.baseCost * Math.pow(CONSTANTS.SoACostMult, soaAugCount);
    repCost = aug.baseRepRequirement * Math.pow(CONSTANTS.SoARepMult, soaAugCount);
  } else {
    moneyCost = aug.baseCost * getGenericAugmentationPriceMultiplier() * costMult;
    repCost = aug.baseRepRequirement * repMult;
  }
  return {moneyCost, repCost};
}
