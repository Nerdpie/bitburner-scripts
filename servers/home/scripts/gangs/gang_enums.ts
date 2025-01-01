export enum GangWeapon {
  'Baseball Bat' = 'Baseball Bat',
  'Katana' = 'Katana',
  'Glock 18C' = 'Glock 18C',
  'P90C' = 'P90C',
  'Steyr AUG' = 'Steyr AUG',
  'AK-47' = 'AK-47',
  'M15A10 Assault Rifle' = 'M15A10 Assault Rifle',
  'AWM Sniper Rifle' = 'AWM Sniper Rifle',
}

export enum GangArmor {
  'Bulletproof Vest' = 'Bulletproof Vest',
  'Full Body Armor' = 'Full Body Armor',
  'Liquid Body Armor' = 'Liquid Body Armor',
  'Graphene Plating Armor' = 'Graphene Plating Armor',
}

export enum GangVehicle {
  'Ford Flex V20' = 'Ford Flex V20',
  'ATX1070 Superbike' = 'ATX1070 Superbike',
  'Mercedes-Benz S9001' = 'Mercedes-Benz S9001',
  'White Ferrari' = 'White Ferrari',
}

export enum GangRootkit {
  'NUKE Rootkit' = 'NUKE Rootkit',
  'Soulstealer Rootkit' = 'Soulstealer Rootkit',
  'Demon Rootkit' = 'Demon Rootkit',
  'Hmap Node' = 'Hmap Node',
  'Jack the Ripper' = 'Jack the Ripper',
}

export enum GangAugment {
  'Bionic Arms' = 'Bionic Arms',
  'Bionic Legs' = 'Bionic Legs',
  'Bionic Spine' = 'Bionic Spine',
  'BrachiBlades' = 'BrachiBlades',
  'Nanofiber Weave' = 'Nanofiber Weave',
  'Synthetic Heart' = 'Synthetic Heart',
  'Synfibril Muscle' = 'Synfibril Muscle',
  'BitWire' = 'BitWire',
  'Neuralstimulator' = 'Neuralstimulator',
  'DataJack' = 'DataJack',
  'Graphene Bone Lacings' = 'Graphene Bone Lacings'
}

export type GangEquipment = GangWeapon | GangArmor | GangVehicle | GangRootkit | GangAugment

export type GangTask = GangMisc | GangEarning | GangTraining

export enum GangMisc {
  'Unassigned' = 'Unassigned',
  'Vigilante Justice' = 'Vigilante Justice',
  'Territory Warfare' = 'Territory Warfare'
}

export enum GangEarning {
  'Mug People' = 'Mug People',
  'Deal Drugs' = 'Deal Drugs',
  'Strongarm Civilians' = 'Strongarm Civilians',
  'Run a Con' = 'Run a Con',
  'Armed Robbery' = 'Armed Robbery',
  'Traffick Illegal Arms' = 'Traffick Illegal Arms',
  'Threaten & Blackmail' = 'Threaten & Blackmail',
  'Human Trafficking' = 'Human Trafficking',
  'Terrorism' = 'Terrorism',
}

export enum GangTraining {
  'Train Combat' = 'Train Combat',
  'Train Hacking' = 'Train Hacking',
  'Train Charisma' = 'Train Charisma',
}
