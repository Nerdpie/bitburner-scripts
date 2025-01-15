import { Skills } from "@nsdefs";
import { type IReviverValue } from "./utils/JSONReviver";
import { SaveData } from "./types";
/**
 * This interface is only for transferring game data to electron-related code.
 */
export interface ElectronGameData {
    playerIdentifier: string;
    fileName: string;
    save: SaveData;
    savedOn: number;
}
export interface ImportData {
    saveData: SaveData;
    playerData?: ImportPlayerData;
}
export interface ImportPlayerData {
    identifier: string;
    lastSave: number;
    totalPlaytime: number;
    money: number;
    skills: Skills;
    augmentations: number;
    factions: number;
    achievements: number;
    bitNode: number;
    bitNodeLevel: number;
    sourceFiles: number;
    exploits: number;
}
export type BitburnerSaveObjectType = {
    PlayerSave: string;
    AllServersSave: string;
    CompaniesSave: string;
    FactionsSave: string;
    AliasesSave: string;
    GlobalAliasesSave: string;
    StockMarketSave: string;
    SettingsSave?: string;
    VersionSave?: string;
    AllGangsSave?: string;
    LastExportBonus?: string;
    StaneksGiftSave: string;
    GoSave: unknown;
};
declare class BitburnerSaveObject implements BitburnerSaveObjectType {
    PlayerSave: string;
    AllServersSave: string;
    CompaniesSave: string;
    FactionsSave: string;
    AliasesSave: string;
    GlobalAliasesSave: string;
    StockMarketSave: string;
    SettingsSave: string;
    VersionSave: string;
    AllGangsSave: string;
    LastExportBonus: string;
    StaneksGiftSave: string;
    GoSave: string;
    getSaveData(forceExcludeRunningScripts?: boolean): Promise<SaveData>;
    saveGame(emitToastEvent?: boolean): Promise<void>;
    getSaveFileName(): string;
    exportGame(): Promise<void>;
    importGame(saveData: SaveData, reload?: boolean): Promise<void>;
    getSaveDataFromFile(files: FileList | null): Promise<SaveData>;
    getImportDataFromSaveData(saveData: SaveData): Promise<ImportData>;
    toJSON(): IReviverValue;
    static fromJSON(value: IReviverValue): BitburnerSaveObject;
}
declare function loadGame(saveData: SaveData): Promise<boolean>;
export { saveObject, loadGame };
declare const saveObject: BitburnerSaveObject;
