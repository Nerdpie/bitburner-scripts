import { exposeGameInternalObjects } from './scripts/lib/exploits'

export async function main(ns: NS) {
  if (!globalThis.Player) {
    exposeGameInternalObjects();
  }

  // noinspection ConfusingFloatingPointLiteralJS - 10 billion
  const MAX_CASINO_MONEY = 10e9;

  const casinoMoney = ns.getMoneySources().sinceInstall.casino;
  if ( casinoMoney >= MAX_CASINO_MONEY ) {
    return;
  }

  if (globalThis.Player.city !== 'Aevum') {
    globalThis.Player.travel('Aevum');
  }
  globalThis.Player.gainMoney(MAX_CASINO_MONEY - casinoMoney,'Casino');
}