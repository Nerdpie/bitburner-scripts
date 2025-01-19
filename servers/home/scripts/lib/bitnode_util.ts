import type {BitNodeMultipliers} from "NetscriptDefinitions";

function tryGetBitNodeMultipliers(ns: NS): BitNodeMultipliers {
  try {
    return ns.getBitNodeMultipliers();
  } catch {
    // If we haven't unlocked `getBitNodeMultipliers`, just use the default multipliers
  }

  // Derived from src/BitNode/BitNodeMultipliers.ts
  return {
    AgilityLevelMultiplier: 1,
    AugmentationMoneyCost: 1,
    AugmentationRepCost: 1,
    BladeburnerRank: 1,
    BladeburnerSkillCost: 1,
    CharismaLevelMultiplier: 1,
    ClassGymExpGain: 1,
    CodingContractMoney: 1,
    CompanyWorkExpGain: 1,
    CompanyWorkMoney: 1,
    CompanyWorkRepGain: 1,
    CorporationDivisions: 1,
    CorporationSoftcap: 1,
    CorporationValuation: 1,
    CrimeExpGain: 1,
    CrimeMoney: 1,
    CrimeSuccessRate: 1,
    DaedalusAugsRequirement: 30,
    DefenseLevelMultiplier: 1,
    DexterityLevelMultiplier: 1,
    FactionPassiveRepGain: 1,
    FactionWorkExpGain: 1,
    FactionWorkRepGain: 1,
    FourSigmaMarketDataApiCost: 1,
    FourSigmaMarketDataCost: 1,
    GangSoftcap: 1,
    GangUniqueAugs: 1,
    GoPower: 1,
    HackExpGain: 1,
    HackingLevelMultiplier: 1,
    HackingSpeedMultiplier: 1,
    HacknetNodeMoney: 1,
    HomeComputerRamCost: 1,
    InfiltrationMoney: 1,
    InfiltrationRep: 1,
    ManualHackMoney: 1,
    PurchasedServerCost: 1,
    PurchasedServerLimit: 1,
    PurchasedServerMaxRam: 1,
    PurchasedServerSoftcap: 1,
    RepToDonateToFaction: 1,
    ScriptHackMoney: 1,
    ScriptHackMoneyGain: 1,
    ServerGrowthRate: 1,
    ServerMaxMoney: 1,
    ServerStartingMoney: 1,
    ServerStartingSecurity: 1,
    ServerWeakenRate: 1,
    StaneksGiftExtraSize: 0,
    StaneksGiftPowerMultiplier: 1,
    StrengthLevelMultiplier: 1,
    WorldDaemonDifficulty: 1,

  };
}

export function getAugRepMultiplier(ns: NS) {
  return tryGetBitNodeMultipliers(ns).AugmentationRepCost;
}

export function getAugCostMultiplier(ns: NS) {
  return tryGetBitNodeMultipliers(ns).AugmentationMoneyCost;
}

export function getGangUniqueAug(ns: NS) {
  return tryGetBitNodeMultipliers(ns).GangUniqueAugs;
}
