import React from "react";
import { FactionName } from "@/game_internal_types/Enums";
import { PlayerCondition, CompoundPlayerCondition } from "./FactionJoinCondition";
interface FactionInfoParams {
    infoText?: JSX.Element;
    rumorText?: JSX.Element;
    inviteReqs?: PlayerCondition[];
    rumorReqs?: PlayerCondition[];
    enemies?: FactionName[];
    offerHackingWork?: boolean;
    offerFieldWork?: boolean;
    offerSecurityWork?: boolean;
    special?: boolean;
    keepOnInstall?: boolean;
    assignment?: () => React.ReactElement;
}
/** Contains the "information" property for all the Factions, which is just a description of each faction */
export declare class FactionInfo {
    /** The names of all other factions considered to be enemies to this faction. */
    enemies: FactionName[];
    /** The descriptive text to show on the faction's page. */
    infoText: JSX.Element;
    /** The hint to show about how to get invited to this faction. */
    rumorText: JSX.Element;
    /** Conditions for being automatically inivited to this facton. */
    inviteReqs: CompoundPlayerCondition;
    /** Conditions for automatically hearing a rumor about this facton. */
    rumorReqs: CompoundPlayerCondition;
    /** A flag indicating if the faction supports field work to earn reputation. */
    offerFieldWork: boolean;
    /** A flag indicating if the faction supports hacking work to earn reputation. */
    offerHackingWork: boolean;
    /** A flag indicating if the faction supports security work to earn reputation. */
    offerSecurityWork: boolean;
    /** Keep faction on install. */
    keep: boolean;
    /** Special faction */
    special: boolean;
    /** The data to display on the faction screen. */
    assignment?: () => React.ReactElement;
    constructor(params: FactionInfoParams);
    offersWork(): boolean;
}
/** A map of all factions and associated info to them. */
export declare const FactionInfos: Record<FactionName, FactionInfo>;
export {};
