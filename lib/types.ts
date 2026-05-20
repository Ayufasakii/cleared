import type { Game, Trophy, JournalEntry, Platform, GameStatus, TrophyGrade } from "@prisma/client";

export type { Platform, GameStatus, TrophyGrade };

export type GameWithTrophies = Game & {
  trophies: Trophy[];
};

export type GameWithAll = Game & {
  trophies: Trophy[];
  journalEntries: JournalEntry[];
};

export type JournalWithGame = JournalEntry & {
  game: Game | null;
  trophies: Trophy[];
};
