import type { Member } from "../types";
export declare enum IndustryType {
    Water = "Water Utilities",
    Spring = "Spring Water",
    Agriculture = "Agriculture",
    Fishing = "Fishing",
    Mining = "Mining",
    Refinery = "Refinery",
    Restaurant = "Restaurant",
    Tobacco = "Tobacco",
    Chemical = "Chemical",
    Pharmaceutical = "Pharmaceutical",
    Computers = "Computer Hardware",
    Robotics = "Robotics",
    Software = "Software",
    Healthcare = "Healthcare",
    RealEstate = "Real Estate"
}
export declare enum CorpEmployeeJob {
    Operations = "Operations",
    Engineer = "Engineer",
    Business = "Business",
    Management = "Management",
    RandD = "Research & Development",
    Intern = "Intern",
    Unassigned = "Unassigned"
}
export declare enum CorpUnlockName {
    Export = "Export",
    SmartSupply = "Smart Supply",
    MarketResearchDemand = "Market Research - Demand",
    MarketDataCompetition = "Market Data - Competition",
    VeChain = "VeChain",
    ShadyAccounting = "Shady Accounting",
    GovernmentPartnership = "Government Partnership",
    WarehouseAPI = "Warehouse API",
    OfficeAPI = "Office API"
}
export declare enum CorpUpgradeName {
    SmartFactories = "Smart Factories",
    SmartStorage = "Smart Storage",
    DreamSense = "DreamSense",
    WilsonAnalytics = "Wilson Analytics",
    NuoptimalNootropicInjectorImplants = "Nuoptimal Nootropic Injector Implants",
    SpeechProcessorImplants = "Speech Processor Implants",
    NeuralAccelerators = "Neural Accelerators",
    FocusWires = "FocusWires",
    ABCSalesBots = "ABC SalesBots",
    ProjectInsight = "Project Insight"
}
export declare const CorpMaterialName: {
    readonly Water: "Water";
    readonly Ore: "Ore";
    readonly Minerals: "Minerals";
    readonly Food: "Food";
    readonly Plants: "Plants";
    readonly Metal: "Metal";
    readonly Hardware: "Hardware";
    readonly Chemicals: "Chemicals";
    readonly Drugs: "Drugs";
    readonly Robots: "Robots";
    readonly AiCores: "AI Cores";
    readonly RealEstate: "Real Estate";
};
export type CorpMaterialName = Member<typeof CorpMaterialName>;
export declare const SmartSupplyOption: {
    readonly leftovers: "leftovers";
    readonly imports: "imports";
    readonly none: "none";
};
export type SmartSupplyOption = Member<typeof SmartSupplyOption>;
export declare const CorpBaseResearchName: {
    readonly Lab: "Hi-Tech R&D Laboratory";
    readonly AutoBrew: "AutoBrew";
    readonly AutoParty: "AutoPartyManager";
    readonly AutoDrug: "Automatic Drug Administration";
    readonly CPH4Inject: "CPH4 Injections";
    readonly Drones: "Drones";
    readonly DronesAssembly: "Drones - Assembly";
    readonly DronesTransport: "Drones - Transport";
    readonly GoJuice: "Go-Juice";
    readonly RecruitHR: "HRBuddy-Recruitment";
    readonly TrainingHR: "HRBuddy-Training";
    readonly MarketTa1: "Market-TA.I";
    readonly MarketTa2: "Market-TA.II";
    readonly Overclock: "Overclock";
    readonly SelfCorrectAssemblers: "Self-Correcting Assemblers";
    readonly Stimu: "Sti.mu";
};
export type CorpBaseResearchName = Member<typeof CorpBaseResearchName>;
export declare const CorpProductResearchName: {
    readonly Capacity1: "uPgrade: Capacity.I";
    readonly Capacity2: "uPgrade: Capacity.II";
    readonly Dashboard: "uPgrade: Dashboard";
    readonly Fulcrum: "uPgrade: Fulcrum";
};
export type CorpProductResearchName = Member<typeof CorpProductResearchName>;
export declare const CorpResearchName: {
    Lab: "Hi-Tech R&D Laboratory";
    AutoBrew: "AutoBrew";
    AutoParty: "AutoPartyManager";
    AutoDrug: "Automatic Drug Administration";
    CPH4Inject: "CPH4 Injections";
    Drones: "Drones";
    DronesAssembly: "Drones - Assembly";
    DronesTransport: "Drones - Transport";
    GoJuice: "Go-Juice";
    RecruitHR: "HRBuddy-Recruitment";
    TrainingHR: "HRBuddy-Training";
    MarketTa1: "Market-TA.I";
    MarketTa2: "Market-TA.II";
    Overclock: "Overclock";
    SelfCorrectAssemblers: "Self-Correcting Assemblers";
    Stimu: "Sti.mu";
    Capacity1: "uPgrade: Capacity.I";
    Capacity2: "uPgrade: Capacity.II";
    Dashboard: "uPgrade: Dashboard";
    Fulcrum: "uPgrade: Fulcrum";
};
export type CorpResearchName = Member<typeof CorpResearchName>;
export declare enum CreatingCorporationCheckResult {
    Success = "Success",
    NoSf3OrDisabled = "NoSf3OrDisabled",
    CorporationExists = "CorporationExists",
    UseSeedMoneyOutsideBN3 = "UseSeedMoneyOutsideBN3",
    DisabledBySoftCap = "DisabledBySoftCap"
}
