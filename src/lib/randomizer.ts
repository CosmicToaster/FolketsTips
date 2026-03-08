import { Outcome, PlayerGrid } from '@/types';

const OUTCOMES: Outcome[] = ['1', 'X', '2'];

export function generateFinalRow(playerGrids: PlayerGrid[]): Outcome[] {
  const result: Outcome[] = [];

  for (let match = 0; match < 13; match++) {
    const tally: Record<Outcome, number> = { '1': 0, 'X': 0, '2': 0 };

    for (const grid of playerGrids) {
      for (const outcome of grid.picks[match].outcomes) {
        tally[outcome]++;
      }
    }

    const totalVotes = tally['1'] + tally['X'] + tally['2'];
    const roll = Math.random() * totalVotes;
    let cumulative = 0;
    let selected: Outcome = '1';

    for (const outcome of OUTCOMES) {
      cumulative += tally[outcome];
      if (roll < cumulative) {
        selected = outcome;
        break;
      }
    }

    result.push(selected);
  }

  return result;
}

export function getMatchTallies(playerGrids: PlayerGrid[]): Record<Outcome, number>[] {
  const tallies: Record<Outcome, number>[] = [];

  for (let match = 0; match < 13; match++) {
    const tally: Record<Outcome, number> = { '1': 0, 'X': 0, '2': 0 };

    for (const grid of playerGrids) {
      for (const outcome of grid.picks[match].outcomes) {
        tally[outcome]++;
      }
    }

    tallies.push(tally);
  }

  return tallies;
}
