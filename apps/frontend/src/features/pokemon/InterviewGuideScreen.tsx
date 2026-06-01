'use client';

import React from 'react';
import { useBattleStore } from './useBattleStore';

function normalise(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export default function InterviewGuideScreen() {
  const opponent = useBattleStore((s) => s.opponent);
  const moves = useBattleStore((s) => s.equippedMoves);
  const startBattle = useBattleStore((s) => s.startBattle);

  const weaknesses = opponent?.weaknesses ?? ['REST APIs', 'Project delivery', 'Team fit'];

  const matchedMoves = weaknesses.map((weakness) => {
    const weaknessKey = normalise(weakness);
    return {
      weakness,
      matches: moves.filter((move) =>
        (move.proofTags ?? []).some((tag) => normalise(tag) === weaknessKey),
      ),
    };
  });

  return (
    <div className="guide-layout">
      <section className="guide-hero-card">
        <p className="eyebrow">Interview Guide</p>
        <h3>Prep notes before the battle</h3>
        <p className="guide-copy">
          Think of this as the LinkedIn-style proof post for the interviewer. If they ask about a
          weakness you can answer with a real project, your attack deals double damage.
        </p>

        <div className="guide-post-card">
          <p className="guide-post-kicker">Pinned prep post</p>
          <p className="guide-post-title">
            “If the interviewer asks for REST APIs, answer with the project that actually shipped
            one.”
          </p>
          <p className="guide-post-body">
            That is the rule here: matching evidence beats vague claims. Use your selected moves as
            proof points, then punish the weak spot when the answer aligns.
          </p>
        </div>
      </section>

      <section className="guide-panel-card">
        <div className="guide-panel-header">
          <div>
            <p className="eyebrow">Weakness map</p>
            <h4>{opponent?.name ?? 'Interview focus areas'}</h4>
          </div>
          <span className="guide-badge">{moves.length} proof points ready</span>
        </div>

        <div className="guide-weakness-list">
          {matchedMoves.map(({ weakness, matches }) => (
            <article className="guide-weakness-card" key={weakness}>
              <div className="guide-weakness-top">
                <strong>{weakness}</strong>
                <span className={matches.length > 0 ? 'guide-match guide-match-on' : 'guide-match'}>
                  {matches.length > 0 ? 'double damage' : 'no direct match'}
                </span>
              </div>
              {matches.length > 0 ? (
                <div className="guide-match-list">
                  {matches.map((move) => (
                    <span key={move.id} className="guide-match-chip">
                      {move.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="guide-weakness-empty">
                  No exact proof tag in the selected moves. Keep this as a talking point.
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="guide-footer">
          <button className="primary-button" type="button" onClick={startBattle}>
            Start battle
          </button>
          <p className="guide-hint">
            Exact proof-tag matches multiply damage by 2.
          </p>
        </div>
      </section>
    </div>
  );
}
