/*
Cards
For referencing card types in code.
Note: 'Unknown' type should only be used transiently. Players should never have an Unknown in their hand or pile.
*/
export const Cards = {
  UNKNOWN: 0,
  BAT: 1,
  FLY: 2,
  COCKROACH: 3,
  TOAD: 4,
  RAT: 5,
  SCORPION: 6,
  SPIDER: 7,
  STINKBUG: 8,
};

/*
PlayerIcons
These are examples; we may use image URLs instead.
*/
export const PlayerIcons = {
  COW: 'pi/PiCowDuotone',
  PIRATE_SHIP: 'gi/GiCaravel',
  CAPYBARA: 'gi/GiCapybara',
};

/*
GameStatus
SETUP: Host has created the room but not started the game.
ONGOING: Game is ongoing.
ENDED: Game has ended.
*/
export const GameStatus = {
  SETUP: 0,
  ONGOING: 1,
  ENDED: 2,
};

/*
CardNumberToString
For conversion of cards in player hands to actual card types. 
TODO: Move to front-end.
*/
export const CardNumberToString = {
  0: 'Unknown',
  1: 'Bat',
  2: 'Fly',
  3: 'Cockroach',
  4: 'Toad',
  5: 'Rat',
  6: 'Scorpion',
  7: 'Spider',
  8: 'Stinkbug',
};

/*
GAME_ROOM_PREFIX 
Prefix for socket.io rooms. For example, game:123B
*/
export const GAME_ROOM_PREFIX = 'game:';
