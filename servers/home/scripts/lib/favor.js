// Pulled from `utils.helpers.clampNumber.ts`
function clampNumber(value, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  if(isNaN(value)) {
    return min;
  }

  return Math.max(Math.min(value, max), min);
}

// Most of this is pulled directly from `Faction/formulas/favor.ts`

const MaxFavor = 35331;

export function favorToRep(favor) {
  return clampNumber(25000 * (Math.pow(1.02, favor) - 1), 0);
}

export function repToFavor(rep) {
  return clampNumber(Math.log(rep / 25000 + 1) / Math.log(1.02), 0, MaxFavor);
}

export function calculateFavorAfterResetting(favor, rep) {
  return repToFavor(favorToRep(favor) + rep);
}