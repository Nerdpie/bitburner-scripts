// Types to indicate that inputs are expected to be limited/restricted

export type ZeroOrOne = 0|1;

/** Valid board sizes for IPvGo */
// noinspection MagicNumberJS
export type GoBoardSizes = 5 | 7 | 9 | 13;

/** Valid RAM capacities are powers of 2, from 2^1 to 2^20 */
// noinspection MagicNumberJS
export type ValidRamCapacity = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536 | 131072 | 262144 | 524288 | 1048576;

export type AugmentsModes = 'purchasable' | 'uniques' | 'rep';

export type DeployMode = 'hgw' | 'share';

/**
 * @desc Valid opponent factions for IPvGo
 *
 * Extended version of the built-in `GoOpponent` type, adding documentation about the associated bonus
 */
export enum GoFaction {
  /** Hacknet production bonus */
    "Netburners" = "Netburners",
  /** Crime success rate */
    'Slum Snakes' = "Slum Snakes",
  /** Hacking money */
    'The Black Hands' = "The Black Hands",
  /** Combat levels */
    'Tetrads' = "Tetrads",
  /** Reputation gain */
    'Daedalus' = "Daedalus",
  /** Faster hack/grow/weaken */
    'Illuminati' = "Illuminati",
  /** Hacking level */
    '????????????' = '????????????',
  /** Practice, script testing */
    'No AI' = "No AI",
}