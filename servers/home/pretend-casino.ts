import {CityName}                  from "@enums";
import {exposeGameInternalObjects} from "@lib/exploits";

export function main(ns: NS) {
  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  if (!globalThis.Player) {
    throw new Error("Failed to expose Player");
  }

  const player = globalThis.Player;

  // noinspection ConfusingFloatingPointLiteralJS - 10 billion
  const MAX_CASINO_MONEY = 10e9;

  // noinspection ConfusingFloatingPointLiteralJS - 200 thousand
  const TRAVEL_COST = 200e3;

  const casinoMoney = ns.getMoneySources().sinceInstall.casino;
  if (casinoMoney >= MAX_CASINO_MONEY) {
    return;
  }

  const cityAevum = "Aevum" as CityName;

  if (player.city !== cityAevum) {
    if (player.money < TRAVEL_COST) {
      ns.tprint("ERROR: Insufficient funds to travel!");
      return;
    }
    player.travel(cityAevum);
  }
  player.gainMoney(MAX_CASINO_MONEY - casinoMoney, "casino");
}
