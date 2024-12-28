import { AugmentationName, FactionName, FactionDiscovery } from "@/game_internal_types/Enums";
import { FactionInfo } from "./FactionInfo";
export declare class Faction {
    #private;
    /**
     * Flag signalling whether the player has already received an invitation
     * to this faction
     */
    alreadyInvited: boolean;
    /** Holds names of all augmentations that this Faction offers */
    augmentations: AugmentationName[];
    /** Flag signalling whether player has been banned from this faction */
    isBanned: boolean;
    /** Flag signalling whether player is a member of this faction */
    isMember: boolean;
    /** Level of player knowledge about this faction (unknown, rumored, known) */
    discovery: FactionDiscovery;
    /** Name of faction */
    name: FactionName;
    /** Amount of reputation player has with this faction */
    playerReputation: number;
    constructor(name: FactionName);
    get favor(): number;
    /**
     * There is no setter for this.#favor. This is intentional. Performing arithmetic operations on `favor` may lead to
     * the overflow error of `playerReputation`, so anything that wants to change `favor` must explicitly do that through
     * `setFavor`.
     *
     * @param value
     */
    setFavor(value: number): void;
    getInfo(): FactionInfo;
    prestigeSourceFile(): void;
    prestigeAugmentation(): void;
}
