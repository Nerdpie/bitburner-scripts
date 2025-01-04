// Types to indicate that inputs are expected to be limited/restricted

export type ZeroOrOne = 0 | 1;

/** Valid board sizes for IPvGo */
// noinspection MagicNumberJS
export type GoBoardSizes = 5 | 7 | 9 | 13;

/** Valid RAM capacities are powers of 2, from 2^1 to 2^20 */
// noinspection MagicNumberJS
export type ValidRamCapacity =
  2
  | 4
  | 8
  | 16
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048
  | 4096
  | 8192
  | 16384
  | 32768
  | 65536
  | 131072
  | 262144
  | 524288
  | 1048576;

export type AugmentsModes = "purchasable" | "uniques" | "rep";

export type DeployMode = "hgw" | "share";

export type GangMode = "rep" | "cash";

/**
 * @desc Valid opponent factions for IPvGo
 *
 * Extended version of the built-in `GoOpponent` type, adding documentation about the associated bonus
 */
export enum GoFaction {
  /** Hacknet production bonus */
    "Netburners" = "Netburners",
  /** Crime success rate */
    "Slum Snakes" = "Slum Snakes",
  /** Hacking money */
    "The Black Hands" = "The Black Hands",
  /** Combat levels */
    "Tetrads" = "Tetrads",
  /** Reputation gain */
    "Daedalus" = "Daedalus",
  /** Faster hack/grow/weaken */
    "Illuminati" = "Illuminati",
  /** Hacking level */
    "????????????" = "????????????",
  /** Practice, script testing */
    "No AI" = "No AI",
}

export enum BuiltinServers {
  // noinspection SpellCheckingInspection
  "home" = "home",
  "darkweb" = "darkweb",
  "iron-gym" = "iron-gym",
  "harakiri-sushi" = "harakiri-sushi",
  "CSEC" = "CSEC",
  "neo-net" = "neo-net",
  "avmnite-02h" = "avmnite-02h",
  "summit-uni" = "summit-uni",
  "millenium-fitness" = "millenium-fitness",
  "global-pharm" = "global-pharm",
  "unitalife" = "unitalife",
  "zeus-med" = "zeus-med",
  "taiyang-digital" = "taiyang-digital",
  "alpha-ent" = "alpha-ent",
  "aerocorp" = "aerocorp",
  "deltaone" = "deltaone",
  "solaris" = "solaris",
  "univ-energy" = "univ-energy",
  "defcomm" = "defcomm",
  "zb-def" = "zb-def",
  "omnia" = "omnia",
  "icarus" = "icarus",
  "nova-med" = "nova-med",
  "run4theh111z" = "run4theh111z",
  "vitalife" = "vitalife",
  "omnitek" = "omnitek",
  "nwo" = "nwo",
  "helios" = "helios",
  "applied-energetics" = "applied-energetics",
  "microdyne" = "microdyne",
  "stormtech" = "stormtech",
  "infocomm" = "infocomm",
  "titan-labs" = "titan-labs",
  "fulcrumtech" = "fulcrumtech",
  "." = ".",
  "clarkinc" = "clarkinc",
  "The-Cave" = "The-Cave",
  "megacorp" = "megacorp",
  "ecorp" = "ecorp",
  "blade" = "blade",
  "kuai-gong" = "kuai-gong",
  "powerhouse-fitness" = "powerhouse-fitness",
  "b-and-a" = "b-and-a",
  "fulcrumassets" = "fulcrumassets",
  "4sigma" = "4sigma",
  "netlink" = "netlink",
  "I.I.I.I" = "I.I.I.I",
  "hong-fang-tea" = "hong-fang-tea",
  "zer0" = "zer0",
  "omega-net" = "omega-net",
  "johnson-ortho" = "johnson-ortho",
  "catalyst" = "catalyst",
  "lexo-corp" = "lexo-corp",
  "syscore" = "syscore",
  "phantasy" = "phantasy",
  "crush-fitness" = "crush-fitness",
  "joesguns" = "joesguns",
  "max-hardware" = "max-hardware",
  "silver-helix" = "silver-helix",
  "computek" = "computek",
  "the-hub" = "the-hub",
  "zb-institute" = "zb-institute",
  "aevum-police" = "aevum-police",
  "snap-fitness" = "snap-fitness",
  "galactic-cyber" = "galactic-cyber",
  "rho-construction" = "rho-construction",
  "rothman-uni" = "rothman-uni",
  "sigma-cosmetics" = "sigma-cosmetics",
  "foodnstuff" = "foodnstuff",
  "nectar-net" = "nectar-net",
  "n00dles" = "n00dles",
  "w0r1d_d43m0n" = "wr1d_d43m0n",
}
