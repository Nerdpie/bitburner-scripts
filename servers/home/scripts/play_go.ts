import {Go, setTailWindow} from "@settings";
import type {GoOpponent}   from "NetscriptDefinitions";

/**
 * Basic IPvGo script derived from https://github.com/bitburner-official/bitburner-src/blob/dev/src/Documentation/doc/programming/go_algorithms.md
 * @param {NS} ns
 */
export async function main(ns: NS): Promise<void> {
  const config = Go;
  setTailWindow(ns, config);

  const DISABLED_LOGS = [
    "sleep",
    "go.makeMove",
    "go.passTurn",
  ];
  ns.disableLog("disableLog");
  DISABLED_LOGS.forEach(l => ns.disableLog(l));

  /** Delay before processing the next move, in milliseconds */
  const LOOP_DELAY = config.loopDelay || 200;

  let result: { type: "move" | "pass" | "gameOver"; x: number | null; y: number | null; };

  if (ns.go.getCurrentPlayer() === "White") {
    await ns.go.opponentNextTurn(false);
  }

  // Have to fetch again, to determine if we need a new board
  if (ns.go.getCurrentPlayer() === "None") {
    if (config.keepPlaying) {
      ns.go.resetBoardState(config.faction as GoOpponent, config.boardSize);
    } else {
      ns.print("Game needs reset");
    }
  }

  do {
    do {
      const board = ns.go.getBoardState();
      const validMoves = ns.go.analysis.getValidMoves();

      const [randX, randY] = getRandomMove(board, validMoves);
      // TODO: more move options

      if (randX === undefined || randY === undefined) {
        // Pass turn if no moves are found
        result = await ns.go.passTurn();
      } else {
        // Play the selected move
        result = await ns.go.makeMove(randX, randY);
      }

      // TODO How does the return from this compare to those above?
      // Log opponent's next move, once it happens
      await ns.go.opponentNextTurn(false);

      await ns.sleep(LOOP_DELAY);

      // Keep looping as long as the opponent is playing moves
    } while (result.type !== "gameOver");

    ns.go.resetBoardState((config.faction as GoOpponent), config.boardSize);
  } while (config.keepPlaying);
}


/**
 * Choose one of the empty points on the board at random to play
 */
function getRandomMove(board: string[], validMoves: boolean[][]): [number, number] | [] {
  const moveOptions: [number, number][] = [];
  const size = board[0].length;

  // Look through all the points on the board
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Make sure the point is a valid move
      const isValidMove = validMoves[x][y];
      // Leave some spaces to make it harder to capture our pieces.
      // We don't want to run out of empty node connections!
      const isNotReservedSpace = x % 2 === 1 || y % 2 === 1;

      if (isValidMove && isNotReservedSpace) {
        moveOptions.push([x, y]);
      }
    }
  }

  // Choose one of the found moves at random
  const randomIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[randomIndex] ?? [];
}
