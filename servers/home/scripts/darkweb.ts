import type {Terminal}             from "@/game_internal_types/Terminal/Terminal";
import {exposeGameInternalObjects} from "@lib/exploits";

export function main(ns: NS): void {
  if (!buyTor(ns)) {
    return;
  }

  buyPrograms(ns);
}

function buyTor(ns: NS): boolean {
  if (ns.hasTorRouter()) {
    return true;
  }

  const doc = globalThis["document"];

  const TOR_COST = 200000;
  if (ns.getServerMoneyAvailable("home") < TOR_COST) {
    ns.tprintf("ERROR: Insufficient funds to buy TOR router");
    return false;
  }

  // Go to the `City` view
  const CITY_DIV_SELECTOR = "div[role='button']:has(svg[aria-label='City'])";
  const cityNavDiv = doc.querySelector<HTMLDivElement>(CITY_DIV_SELECTOR);

  if (cityNavDiv === null) {
    ns.tprintf("ERROR: Unable to find the 'City' nav icon");
    return false;
  }
  cityNavDiv.click();

  // Find one of the 'technology' locations
  // language=CSS
  const TECH_STORE_SELECTOR = "span[class$='location']";
  const techStores = Array.from(doc.querySelectorAll<HTMLSpanElement>(TECH_STORE_SELECTOR))
    .filter(n => n.ariaLabel !== "Travel Agency" && n.innerText === "T");

  if (techStores.length === 0) {
    ns.tprintf("ERROR: Unable to find a tech store in current city");
    return false;
  }
  techStores[0].click();

  // Get the 'TOR Router' button
  // language=CSS
  const TOR_UNBUYABLE_SELECTOR = "button:has(span[class$='unbuyable'])";
  const torUnbuyable = Array.from(doc.querySelectorAll<HTMLButtonElement>(TOR_UNBUYABLE_SELECTOR))
    .filter(b => b.innerText.indexOf("TOR router") !== -1);

  if (torUnbuyable.length > 0) {
    ns.tprintf("ERROR: TOR currently cannot be bought");
    return false;
  }

  // language=CSS
  const TOR_BUTTON_SELECTOR = "button:has(span[class$='money'])";
  const torButton = Array.from(doc.querySelectorAll<HTMLButtonElement>(TOR_BUTTON_SELECTOR))
    .filter(n => n.innerText.indexOf("TOR router") !== -1);

  if (torButton.length === 0) {
    ns.tprintf("ERROR: Unable to find button to buy TOR router");
    return false;
  }
  torButton[0].click();

  return ns.hasTorRouter();
}

function buyPrograms(ns: NS) {
  if (!globalThis.Terminal) {
    exposeGameInternalObjects();
  }
  const terminal = globalThis.Terminal as Terminal;

  const DARKWEB_PROGRAMS = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "ServerProfiler.exe",
    "DeepscanV1.exe",
    "DeepscanV2.exe",
    "AutoLink.exe",
    "Formulas.exe",
  ];

  DARKWEB_PROGRAMS.filter(program => !ns.fileExists(program, "home"))
    .forEach(program => terminal.executeCommands(`buy ${program}`));
}
