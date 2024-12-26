export declare enum GoOpponent {
    none = "No AI",
    Netburners = "Netburners",
    SlumSnakes = "Slum Snakes",
    TheBlackHand = "The Black Hand",
    Tetrads = "Tetrads",
    Daedalus = "Daedalus",
    Illuminati = "Illuminati",
    w0r1d_d43m0n = "????????????"
}
export declare enum GoColor {
    white = "White",
    black = "Black",
    empty = "Empty"
}
export declare enum GoValidity {
    pointBroken = "That node is offline; a piece cannot be placed there",
    pointNotEmpty = "That node is already occupied by a piece",
    boardRepeated = "It is illegal to repeat prior board states",
    noSuicide = "It is illegal to cause your own pieces to be captured",
    notYourTurn = "It is not your turn to play",
    gameOver = "The game is over",
    invalid = "Invalid move",
    valid = "Valid move"
}
export declare enum GoPlayType {
    move = "move",
    pass = "pass",
    gameOver = "gameOver"
}
