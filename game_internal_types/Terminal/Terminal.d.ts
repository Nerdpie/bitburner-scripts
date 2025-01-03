/// <reference types="react" />
import { Output, Link, RawOutput, TTimer } from "./OutputTypes";
import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { Directory } from "../Paths/Directory";
import { FilePath } from "../Paths/FilePath";
import { ContractFilePath } from "../Paths/ContractFilePath";
import React from "react";
export declare class Terminal {
    action: TTimer | null;
    commandHistory: string[];
    commandHistoryIndex: number;
    outputHistory: (Output | Link | RawOutput)[];
    contractOpen: boolean;
    currDir: Directory;
    process(cycles: number): void;
    append(item: Output | Link | RawOutput): void;
    print(s: string): void;
    printRaw(node: React.ReactNode): void;
    error(s: string): void;
    success(s: string): void;
    info(s: string): void;
    warn(s: string): void;
    finishAction(cancelled?: boolean): void;
    getFile(filename: string): Script | TextFile | string | null;
    getFilepath(path: string, useAbsolute?: boolean): FilePath | null;
    getDirectory(path: string, useAbsolute?: boolean): Directory | null;
    getScript(filename: string): Script | null;
    getTextFile(filename: string): TextFile | null;
    getLitFile(filename: string): string | null;
    cwd(): Directory;
    setcwd(dir: Directory): void;
    runContract(contractPath: ContractFilePath): Promise<void>;
    executeScanAnalyzeCommand(depth?: number, all?: boolean): void;
    connectToServer(server: string): void;
    executeCommands(commands: string): void;
    clear(): void;
    prestige(): void;
    executeCommand(command: string): void;
    getProgressText(): string;
}
