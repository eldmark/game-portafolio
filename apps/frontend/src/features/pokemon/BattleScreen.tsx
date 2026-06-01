'use client';

import React from 'react';
import { useBattleStore } from './useBattleStore';
import HPBar from './components/HPBar';
import MoveGrid from './components/MoveGrid';
import BattleLog from './components/BattleLog';
import PokemonSprite from './components/PokemonSprite';
import PlayerSprite from './components/PlayerSprite';
import { EFFECTIVENESS } from './lib/data';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export default function BattleScreen() {
  const opponent = useBattleStore((s) => s.opponent);
  const opponentHp = useBattleStore((s) => s.opponentHp);
  const opponentMax = useBattleStore((s) => s.opponentMaxHp);
  const marcoHp = useBattleStore((s) => s.marcoHp);
  const marcoMax = useBattleStore((s) => s.marcoMaxHp);
  const moves = useBattleStore((s) => s.equippedMoves);
  const log = useBattleStore((s) => s.log);
  const result = useBattleStore((s) => s.result);
  const appendLog = useBattleStore((s) => s.appendLog);
  const applyDamageToOpponent = useBattleStore((s) => s.applyDamageToOpponent);
  const applyDamageToMarco = useBattleStore((s) => s.applyDamageToMarco);
  const consumeMovePp = useBattleStore((s) => s.consumeMovePp);
  const resetBattle = useBattleStore((s) => s.resetBattle);

  const battleEnded = result !== null;

  function onUse(idx: number) {
    if (battleEnded) return;
    const move = moves[idx];
    if (!move) return;

    consumeMovePp(move.id);
    const eff = (EFFECTIVENESS[opponent?.typeTag ?? 'JUNIOR'] || {})[move.type] ?? 1;
    const weaknessMatch = (move.proofTags ?? []).some((tag) =>
      (opponent?.weaknesses ?? []).some((weakness) => normalize(tag) === normalize(weakness)),
    );
    const proofMultiplier = weaknessMatch ? 2 : 1;
    const damage = Math.max(1, Math.round((move.power * eff * proofMultiplier) / 12));
    appendLog(
      `Marco used ${move.name} — ${damage} dmg (x${eff}${weaknessMatch ? ' x2 proof match' : ''})`,
    );
    applyDamageToOpponent(damage);

    if (useBattleStore.getState().result) return;

    setTimeout(() => {
      const state = useBattleStore.getState();
      if (!opponent || state.result) return;

      const oppDamage = Math.max(1, Math.round(Math.random() * 6 + 1));
      appendLog(`${opponent.name} hits Marco for ${oppDamage} dmg`);
      applyDamageToMarco(oppDamage);
    }, 600);
  }

  return (
    <div className="battle-screen">
      <section className="battle-arena-card">
        <div className="battle-actors">
          <article className="battle-actor battle-actor-enemy">
            <div className="battle-actor-header">
              <div className="battle-actor-identity">
                <PokemonSprite opponentId={opponent?.id ?? 'alex'} alt={opponent?.name} />
                <div>
                  <p className="eyebrow battle-actor-kicker">Interviewer</p>
                  <h3>{opponent?.name ?? 'Opponent'}</h3>
                  <p className="battle-actor-subtitle">Lv. {opponent?.level ?? '??'}</p>
                </div>
              </div>
              <div className="battle-actor-hp">
                <div className="battle-actor-hp-label">
                  <span>HP</span>
                  <strong>
                    {opponentHp}/{opponentMax}
                  </strong>
                </div>
                <HPBar value={opponentHp} max={opponentMax} />
              </div>
            </div>
          </article>

          <div className="battle-vs-card">
            <span>VS</span>
          </div>

          <article className="battle-actor battle-actor-player">
            <div className="battle-actor-header">
              <div className="battle-actor-identity">
                <PlayerSprite alt="Marco" />
                <div>
                  <p className="eyebrow battle-actor-kicker">Candidate</p>
                  <h3>Marco</h3>
                  <p className="battle-actor-subtitle">Portfolio challenger</p>
                </div>
              </div>
              <div className="battle-actor-hp">
                <div className="battle-actor-hp-label">
                  <span>HP</span>
                  <strong>
                    {marcoHp}/{marcoMax}
                  </strong>
                </div>
                <HPBar value={marcoHp} max={marcoMax} />
              </div>
            </div>
          </article>
        </div>

        <div className="battle-status-row">
          <div className="equipped-strip battle-equipped-strip">
            <div className="equipped-strip-header">
              <span className="eyebrow">Selected moveset</span>
              <span className="equipped-strip-count">{moves.length}/4 ready</span>
            </div>
            <div className="equipped-chips">
              {moves.map((move, index) => (
                <div key={move.id} className="equipped-chip">
                  <span className="equipped-chip-index">{index + 1}</span>
                  <span className="equipped-chip-name">{move.name}</span>
                  <span className="equipped-chip-meta">{move.type}</span>
                </div>
              ))}
            </div>
          </div>

          {result ? (
            <div className={`battle-result-card battle-result-${result}`}>
              <p className="eyebrow">Battle complete</p>
              <h3>{result === 'win' ? 'You won the interview battle' : 'You lost the interview battle'}</h3>
              <p>{result === 'win' ? 'The opponent hit 0% HP first.' : 'Marco hit 0% HP first.'}</p>
              <div className="battle-result-actions">
                <button className="primary-button" type="button" onClick={resetBattle}>
                  Fight again
                </button>
                <button className="secondary-button" type="button" onClick={resetBattle}>
                  Pick another interviewer
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="battle-controls-grid">
        <div className="battle-actions-card">
          <div className="battle-actions-header">
            <span className="eyebrow">Choose an attack</span>
            <span className="battle-actions-hint">Battle ends automatically at 0% HP</span>
          </div>
          <MoveGrid moves={moves} onUse={onUse} disabled={battleEnded} />
        </div>
        <div className="battle-log-card">
          <BattleLog entries={log} />
        </div>
      </div>

      <div className="battle-footer">
        <button className="secondary-button" type="button" onClick={resetBattle}>
          Quit battle
        </button>
      </div>
    </div>
  );
}
