import { Factions } from "./Faction/Factions";
import "./utils/Protections";
import "./PersonObjects/Player/PlayerObject";
import { Player } from "./Player";
import { saveObject, loadGame } from "./SaveObject";
import { GetAllServers } from "./Server/AllServers";
import { SaveData } from "./types";
import { EventEmitter } from "./utils/EventEmitter";
import { Companies } from "./Company/Companies";
declare global {
    var Bitburner: {
        Player: typeof Player;
        GetAllServers: typeof GetAllServers;
        Factions: typeof Factions;
        Companies: typeof Companies;
        SaveObject: {
            saveObject: typeof saveObject;
            loadGame: typeof loadGame;
        };
    };
}
export declare const GameCycleEvents: EventEmitter<[]>;
/** Game engine. Handles the main game loop. */
declare const Engine: {
    _lastUpdate: number;
    updateGame: (numCycles?: number) => void;
    Counters: {
        [key: string]: number | undefined;
        autoSaveCounter: number;
        updateSkillLevelsCounter: number;
        updateDisplays: number;
        updateDisplaysLong: number;
        updateActiveScriptsDisplay: number;
        createProgramNotifications: number;
        augmentationsNotifications: number;
        checkFactionInvitations: number;
        passiveFactionGrowth: number;
        messages: number;
        mechanicProcess: number;
        contractGeneration: number;
        achievementsCounter: number;
    };
    decrementAllCounters: (numCycles?: number) => void;
    checkCounters: () => void;
    load: (saveData: SaveData) => Promise<void>;
    start: () => void;
};
export { Engine };
