import type {Augmentation}                from '@/game_internal_types/Augmentation/Augmentation';
import type {PlayerObject}                from '@/game_internal_types/PersonObjects/Player/PlayerObject';
import type {CompanyWork}                 from '@/game_internal_types/Work/CompanyWork';
import type {FactionWork}                 from '@/game_internal_types/Work/FactionWork';
import type {WorkType}                    from '@/game_internal_types/Work/Work';
import type {JobName}                     from '@enums';
import {parseNsFlags}                     from '@lib/flags_util';
import {formatSecondsShort, getTimeStamp} from '@lib/time_util';

export async function main(ns: NS): Promise<void> {

  const DISABLED_LOGS = [
    'sleep',
  ];
  ns.disableLog('disableLog');
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const args = parseNsFlags(ns, {'help': false});
  if (args.help) {
    ns.tprint('This script will enhance your HUD (Heads up Display) with custom statistics.');
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint('Example:');
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }

  await ns.sleep(0);

  const doc = globalThis['document'];
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');

  if (!hook0 || !hook1) {
    return;
  }

  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const values: any[] = [];

      headers.push('Time');
      values.push(getTimeStamp());

      headers.push('SharePower');
      values.push(ns.formatNumber(ns.getSharePower()));

      headers.push('Karma');
      values.push(ns.formatNumber(ns.heart.break()));

      const playerInfo = ns.getPlayer();
      if (playerInfo.numPeopleKilled > 0) {
        headers.push('Kills');
        values.push(ns.getPlayer().numPeopleKilled);
      }

      const player = globalThis.Player as PlayerObject | null;
      const currentWork = player?.currentWork;
      if (currentWork) {
        const FACTION = <WorkType>'FACTION';
        const COMPANY = <WorkType>'COMPANY';
        switch (currentWork.type) {
          case FACTION:
            headers.push('Faction');
            values.push(factionWorkCountdown(<FactionWork>currentWork));
            break;
          case COMPANY:
            headers.push('Company');
            values.push(companyWorkCountdown(<CompanyWork>currentWork));
            break;
          default:
          // Not displaying anything specific
        }
      }

      if (ns.gang.inGang()) {
        const gangInfo = ns.gang.getGangInformation();

        headers.push('=== Gang ===');
        values.push(gangInfo.territory === 1 ? '💰#1💰' : ' ');

        headers.push('Respect');
        values.push(ns.formatNumber(gangInfo.respect));

        headers.push('Wanted Penalty');
        values.push(ns.formatPercent(1 - gangInfo.wantedPenalty));

        headers.push('Power');
        values.push(ns.formatNumber(gangInfo.power));

        if (gangInfo.territory < 1) {
          headers.push('Territory');
          values.push(ns.formatPercent(gangInfo.territory));

          headers.push('Clash Chance');
          values.push(ns.formatPercent(gangInfo.territoryClashChance));
        }
      }

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join('\n');
      hook1.innerText = values.join('\n');
    } catch (err) { // This might come in handy later
      ns.print('ERROR: Update Skipped: ' + String(err));
    }
    await ns.sleep(1000);
  }
}

function factionWorkCountdown(work: FactionWork): string {
  const faction = work.getFaction();
  const player = <PlayerObject>globalThis.Player;
  const ownedAugNames = player.augmentations.map(a => a.name);
  const queuedAugNames = player.queuedAugmentations.map(a => a.name);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const maxRepNeeded = Object.values<Augmentation>(globalThis.Augmentations)
    .filter(a => faction.augmentations.includes(a.name))
    .filter(a => !ownedAugNames.includes(a.name))
    .filter(a => !queuedAugNames.includes(a.name))
    .reduce((acc, val) => Math.max(acc, val.baseRepRequirement), 0);
  const playerRep = faction.playerReputation;

  if (playerRep < maxRepNeeded) {
    const secondsNeeded = (maxRepNeeded - playerRep) / (work.getReputationRate() * 5);
    return formatSecondsShort({seconds: secondsNeeded});
  }
  return 'DONE!';
}

function companyWorkCountdown(work: CompanyWork): string {
  // TODO Check if there are any mults that impact these calculations...
  const company = work.getCompany();
  const faction = company.relatedFaction;
  const player = <PlayerObject>globalThis.Player;
  // If the company doesn't have a related faction, or the player is already in/invited to it
  if (faction === undefined || player.factions.includes(faction) || player.factionInvitations.includes(faction)) {
    return 'DONE!';
  }

  // TODO Decide on a clean-ish way to check if we've backdoored the company's server
  //  Would need to either expose more game internals, or hard-code the mappings
  const TARGET_REP = 400000;
  const playerRep = company.playerReputation;
  // Barring race conditions, this WILL be a valid member and assignment
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const jobName: JobName = player.jobs[company.name];
  const totalSecondsNeeded = (TARGET_REP - playerRep) / (work.getGainRates(jobName).reputation * 5);
  return formatSecondsShort({seconds: totalSecondsNeeded});
}
