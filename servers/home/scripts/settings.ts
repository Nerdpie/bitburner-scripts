// TODO Consider moving the default `tail` config block into a utility function
// TODO Consider creating a wrapper class to clean up the type data for `ScriptSettings`
// TODO Consider creating enums for the different 'mode' options
/**
 * Central settings for my scripts
 * @example
 * import { ScriptSettings } from "servers/home/scripts/settings"
 *
 * ns.tail();
 * ns.clearLog();
 *
 * let config = ScriptSettings.deploy;
 * ns.moveTail(config.x, config.y);
 * ns.resizeTail(config.width, config.height);
 */
export const ScriptSettings = {
  contract_calc: {
    x: 1250,
    y: 50,
    width: 500,
    height: 300
  },
  scratchpad: {
    x: 1250,
    y: 85,
    width: 500,
    height: 200
  },
  run: {
    x: 1500,
    y: 120,
    width: 200,
    height: 200,
    keepalive: true
  },
  go: {
    x: 1500,
    y: 155,
    width: 200,
    height: 200,
    keepPlaying: true,
    /* Valid factions are: 
     * 'Netburners'     - Hacknet production
     * 'Slum Snakes'    - Crime success rate
     * 'The Black Hand' - Hacking money
     * 'Tetrads'        - Combat levels
     * 'Daedalus'       - Reputation gain
     * 'Illuminati'     - Faster HGW
     * '????????????'   - Hacking level; 
     * 'No AI'          - Practice, script testing
     */
    faction: 'Daedalus',
    boardSize: 7
  },
  net_tree: {
    x: 1375,
    y: 475,
    width: 525,
    height: 400
  },
  contracts: {
    x: 1500,
    y: 510,
    width: 400,
    height: 200
  },
  augments: {
    x: 1500,
    y: 545,
    width: 400,
    height: 200,
    // Mode options are currently: purchasable, uniques
    mode: 'uniques'
  },
  hacknet_manager: {
    x: 1500,
    y: 750,
    width: 400,
    height: 200,
    maxPrice: 1e9,
    loopDelay: 10 * 1000,
    threshold: undefined
  },
  deploy: {
    x: 1500,
    y: 780,
    width: 400,
    height: 200,
    // Mode options are currently: hgw, share
    mode: 'hgw',
    resetScripts: true,
    targetSelf: false,
    targetServer: 'joesguns',
    ramCapacity: 1024,
    shareCount: 5,
    weakenCount: 3,
    growCount: 2,
    clusterCount: 3,
  },

}

// noinspection SpellCheckingInspection - In-game servers have irregular names
export const ServerSelections = {
  alwaysBackdoor: [
    // Special servers (core factions, etc.)
    'CSEC',         // CyberSec
    'avmnite-02h',  // NiteSec
    'I.I.I.I.',     // The Black Hand
    'run4theh111z', // BitRunners
    '.',            // The Dark Army
    'The-Cave',     // Daedalus
    'w0r1d_d43m0n',
    // Good targets
    'joesguns',     // Apparently can be `grow`-farmed for exp?
  ],
  // Get a 10% discount if a venue is backdoored
  classesBackdoor: [
    // Sector 12
    'iron-gym',             // Gym - 1x cost,  1x exp
    'powerhouse-fitness',   // Gym - 20x cost, 10x exp
    'rothman-uni',          // Uni - 3x cost,  2x exp
    // Aevum
    'crush-fitness',        // Gym - 3x cost,  2x exp
    'snap-fitness',         // Gym - 10x cost, 5x exp
    'summit-uni',           // Uni - 4x cost,  3x exp
    // Volhaven
    'millenium-fitness',    // Gym - 7x cost,  4x exp
    'zb-institute'          // Uni - 5x cost,  4x exp
  ],
  // Get a reduced rep threshold to join a company's faction (and promoted?)
  companyBackdoor: [
    'b-and-a',
    'blade',
    'clarkinc',
    'ecorp',
    'fulcrumassets', // Fulcrum Secret Technologies
    'fulcrumtech',
    'kuai-gong',
    'megacorp',
    'nwo',
    //'omnitek'
  ],
}

export const BackdoorConcat: string[] =
  ServerSelections.alwaysBackdoor.concat(
    ServerSelections.classesBackdoor,
    ServerSelections.companyBackdoor);