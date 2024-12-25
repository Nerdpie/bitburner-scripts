import {exposeGameInternalObjects} from './scripts/lib/exploits'

export async function main(ns: NS) {
  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  // noinspection ConfusingFloatingPointLiteralJS - 10 billion
  const MAX_CASINO_MONEY = 10e9;

// noinspection ConfusingFloatingPointLiteralJS - 200 thousand
  const TRAVEL_COST = 200e3;

  const casinoMoney = ns.getMoneySources().sinceInstall.casino;
  if (casinoMoney >= MAX_CASINO_MONEY) {
    return;
  }

  if (globalThis.Player.city !== 'Aevum') {
    if (globalThis.Player.money < TRAVEL_COST) {
      ns.tprint('ERROR: Insufficient funds to travel!');
      return;
    }
    globalThis.Player.travel('Aevum');
  }
  globalThis.Player.gainMoney(MAX_CASINO_MONEY - casinoMoney, 'casino');
}