import type {Augmentation}                        from "@/game_internal_types/Augmentation/Augmentation";
import type {PlayerObject}                        from "@/game_internal_types/PersonObjects/Player/PlayerObject";
import type {CompanyWork}                         from "@/game_internal_types/Work/CompanyWork";
import type {FactionWork}                         from "@/game_internal_types/Work/FactionWork";
import type {WorkType}                            from "@/game_internal_types/Work/Work";
import {AugmentationName}                         from "@enums";
import {exposeGameInternalObjects}                from "@lib/exploits";
import {parseNsFlags}                             from "@lib/flags_util";
import {assertBackdoorInstalled, COMPANY_SERVERS} from "@lib/server_util";
import {formatSecondsShort, getTimeStamp}         from "@lib/time_util";

export async function main(ns: NS): Promise<void> {

  const DISABLED_LOGS = [
    "sleep",
  ];
  ns.disableLog("disableLog");
  DISABLED_LOGS.forEach(log => ns.disableLog(log));

  const args = parseNsFlags(ns, {"help": false});
  if (args.help) {
    ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }

  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  await ns.sleep(0);

  const doc = globalThis["document"];
  const hook0 = doc.getElementById("overview-extra-hook-0") as HTMLParagraphElement | null;
  const hook1 = doc.getElementById("overview-extra-hook-1") as HTMLParagraphElement | null;
  const hook2 = doc.getElementById("overview-extra-hook-2") as HTMLParagraphElement | null;

  if (!hook0 || !hook1 || !hook2) {
    return;
  }

  // noinspection InfiniteLoopJS - Intended design for this script
  while (true) {
    try {
      const headers: (number | string)[] = [];
      const values: (number | string)[] = [];
      // TODO Convert some of these values to generators, so that we can track the change over time
      //  E.g. have 󰔵, 󰔳 and 󰔴 indicators, possibly colored
      const decor: string[] = [];

      headers.push("Time");
      values.push(getTimeStamp());
      decor.push("");

      headers.push("Share");
      values.push(ns.formatNumber(ns.getSharePower()));
      decor.push("");

      headers.push("Karma");
      values.push(ns.formatNumber(ns.heart.break()));
      decor.push("");

      const playerInfo = ns.getPlayer();
      if (playerInfo.numPeopleKilled > 0) {
        headers.push("Kills");
        values.push(ns.getPlayer().numPeopleKilled);
        decor.push("");
      }

      const player = globalThis.Player as PlayerObject | null;
      const currentWork = player?.currentWork;
      if (currentWork) {
        const FACTION = "FACTION" as WorkType;
        const COMPANY = "COMPANY" as WorkType;
        switch (currentWork.type) {
          case FACTION:
            headers.push("Faction");
            values.push(factionWorkCountdown((currentWork as FactionWork)));
            decor.push("");
            break;
          case COMPANY:
            headers.push("Company");
            values.push(companyWorkCountdown(ns, (currentWork as CompanyWork)));
            decor.push("");
            break;
          default:
          // Not displaying anything specific
        }
      }

      if (ns.gang.inGang()) {
        const gangInfo = ns.gang.getGangInformation();

        headers.push("== Gang ==");
        values.push(gangInfo.territory === 1 ? "💰#1💰" : " ");
        decor.push("");

        headers.push("Respect");
        values.push(ns.formatNumber(gangInfo.respect));
        decor.push("");

        headers.push("Wanted");
        values.push(ns.formatPercent(1 - gangInfo.wantedPenalty));
        decor.push("");

        headers.push("Power");
        values.push(ns.formatNumber(gangInfo.power));
        decor.push("");

        if (gangInfo.territory < 1) {
          headers.push("Territory");
          values.push(ns.formatPercent(gangInfo.territory));
          decor.push("");

          headers.push("Clash");
          values.push(ns.formatPercent(gangInfo.territoryClashChance));
          decor.push("");
        }
      }

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join("\n");
      hook1.innerText = values.join("\n");
      hook2.innerText = decor.join("\n");
    } catch (err) { // This might come in handy later
      ns.print("ERROR: Update Skipped: " + String(err));
    }
    await ns.sleep(1000);
  }
}

// REFINE Convert this to a generator so that the augment costs aren't being re-evaluated each time
function factionWorkCountdown(work: FactionWork): string {
  const faction = work.getFaction();
  const player = globalThis.Player as PlayerObject;
  const ownedAugNames = player.augmentations.map(a => a.name);
  const queuedAugNames = player.queuedAugmentations.map(a => a.name);

  const augments = globalThis.Augmentations as Record<AugmentationName, Augmentation>;
  const maxRepNeeded = Object.values(augments)
    .filter(a => faction.augmentations.includes(a.name)
      && !ownedAugNames.includes(a.name)
      && !queuedAugNames.includes(a.name))
    .reduce((acc, val) => Math.max(acc, val.baseRepRequirement), 0);
  const playerRep = faction.playerReputation;

  let suffix = "";

  // MEMO Computed using the Formulas API; not expected to change
  // Once you have this much rep, after install, you will have 150 favor
  const REP_TO_150_FAVOR = 462490.07;
  if (playerRep >= REP_TO_150_FAVOR) {
    suffix = "|I";
  }

  // At 150 favor, you can just buy rep
  const FAVOR_TO_BUY = 150;
  if (faction.favor >= FAVOR_TO_BUY) {
    suffix = "|B";
  }

  if (playerRep < maxRepNeeded) {
    const secondsNeeded = (maxRepNeeded - playerRep) / (work.getReputationRate() * 5);
    return formatSecondsShort({seconds: secondsNeeded}) + suffix;
  }
  return "DONE!";
}

function companyWorkCountdown(ns: NS, work: CompanyWork): string {
  // TODO Check if there are any mults that impact these calculations...
  const company = work.getCompany();
  const faction = company.relatedFaction;
  const player = globalThis.Player as PlayerObject;
  // If the company doesn't have a related faction, or the player is already in/invited to it
  if (faction === undefined || player.factions.includes(faction) || player.factionInvitations.includes(faction)) {
    return "DONE!";
  }

  const serversBackdoored = COMPANY_SERVERS[work.companyName]
    .every(s => assertBackdoorInstalled(ns.getServer(s)));

  const TARGET_REP = serversBackdoored ? 300_000 : 400_000;
  const playerRep = company.playerReputation;
  // Barring race conditions, this WILL be a valid member and assignment
  const jobName = player.jobs[work.companyName];
  if (jobName === undefined) {
    ns.print("ERROR: Undefined JobName");
    return "ERR";
  }
  const totalSecondsNeeded = (TARGET_REP - playerRep) / (work.getGainRates(jobName).reputation * 5);
  return formatSecondsShort({seconds: totalSecondsNeeded});
}
