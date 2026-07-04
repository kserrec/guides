// curriculum.js — Term Functor Logic: Statement Logic and the MPL Bridge
// Based on: Sommers & Englebretsen, "An Invitation to Formal Reasoning: The Logic of Terms" (2000)
// Chapters 7 and 8 — The Logic of Statements; TFL and Modern Predicate Logic
// Prerequisites: Introduction L8 (statement logic as term logic), The Full
// Language L1 (compound statements), L5 (REGAL / counterclaims), Course 3.

// ── Template helpers (same as the other TFL curricula) ───────────────────────

function syl(rows, conclusion) {
  const rowHtml = rows.map(r => {
    const [c, lbl] = Array.isArray(r) ? r : [r, null];
    return `<div class="syl-row"><code>${c}</code>${lbl ? `<span class="syl-label">${lbl}</span>` : ''}</div>`;
  }).join('\n                ');
  const [cc, clbl] = Array.isArray(conclusion) ? conclusion : [conclusion, null];
  return `<div class="syllogism-display">
                ${rowHtml}
                <hr class="syl-divider">
                <div class="syl-row syl-conclusion"><span class="syl-therefore">∴</span><code>${cc}</code>${clbl ? `<span class="syl-label">${clbl}</span>` : ''}</div>
              </div>`;
}

function engSyl(p1, p2, conc) {
  return `<div class="syllogism-display">
                <div class="syl-row"><span class="syl-label">Premise 1:</span><span class="syl-text">${p1}</span></div>
                <div class="syl-row"><span class="syl-label">Premise 2:</span><span class="syl-text">${p2}</span></div>
                <hr class="syl-divider">
                <div class="syl-row syl-conclusion"><span class="syl-therefore">∴</span><span class="syl-text">${conc}</span></div>
              </div>`;
}

function mcPrompt(label, formula) {
  return `<span class="mc-prompt">${label}</span> <code class="mc-expr">${formula}</code>`;
}

const CURRICULUM = {
  title: "Term Functor Logic: Statement Logic and the MPL Bridge",
  subtitle: "Proofs, trees, and the bridge to predicate logic",
  icon: "∴",
  lessons: [

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 1: Contradictions, Tautologies, and Contingency
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-01",
      title: "Lesson 1: Contradictions, Tautologies, and Contingency",
      navTitle: "The Trichotomy",
      description: "Sort every statement into one of three bins — true by form, false by form, or hostage to the facts — and see why 'valid argument' literally means 'counterclaim in the second bin.'",
      completionText: "The trichotomy is in place: contradictions self-destruct, tautologies are statements whose contradictories self-destruct, and everything else is contingent — hostage to the facts. Validity itself lives in the second bin: an argument is valid exactly when its counterclaim is a contradiction. In the next lesson you'll build the machinery that certifies membership in that bin: direct proofs, and the tree method for hunting down consistency.",
      blocks: [

        // ── Concept: Three Kinds of Statements ───────────────────────────────
        {
          type: "concept",
          id: "trichotomy",
          title: "1. Three Kinds of Statements",
          content: `
            <p>Some statements cannot help being true. Some cannot help being false. The rest —
            nearly everything anyone actually says — depend on how the world happens to be.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−p+p</code><span><strong>Tautology</strong> — "if it's raining, it's raining." True no matter what.</span></div>
              <div class="ex-row"><code>+p−p</code><span><strong>Contradiction</strong> — "it's raining and it's not raining." False no matter what.</span></div>
              <div class="ex-row"><code>+p+q</code><span><strong>Contingent</strong> — "it's raining and it's cold." Check the weather.</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">The Trichotomy</span>
              Every statement is exactly one of: a <strong>tautology</strong> (true under every
              way the world could be), a <strong>contradiction</strong> (false under every way),
              or <strong>contingent</strong> (true under some ways, false under others).
            </div>

            <p>Notice what the classification turns on: not the statement's subject matter but
            its <em>form</em>. A tautology's truth owes nothing to the weather; a contradiction's
            falsity survives any weather. Only contingent statements carry information about
            which world you are in — which is why almost everything worth saying is contingent,
            and why the other two bins belong to logic alone.</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              Statement logic in TFL (Introduction L8, The Full Language L1): propositional
              terms live in the singleton propositional universe, and compounds transcribe into
              the categorical forms — <code>+p+q</code> "p and q," <code>−p+q</code> "if p then q,"
              <code>−(−p)−(−q)</code> "p or q" (the four-minus form). Contradictories flip both
              leading signs.
            </div>
          `
        },

        // ── Concept: The Signature of Contradiction ──────────────────────────
        {
          type: "concept",
          id: "contradiction-signature",
          title: "2. The Algebraic Signature of Contradiction",
          content: `
            <p>How do you <em>recognize</em> a contradiction without checking every possible
            world? By its algebraic signature: somewhere in the statement, the same thing is
            both affirmed and denied of the same subject.</p>

            <p>The minimal case is <code>+p−p</code> — the O-form conjunction "p but not p."
            One term, both signs. But the signature also appears spread across a conjunction of
            statements. Take the pair:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−p+q</code><span class="proof-note">if p then q</span></div>
              <div class="proof-row"><code>+p−q</code><span class="proof-note">p, but not q</span></div>
            </div>

            <p>Each statement is contingent on its own. Conjoined, they are a contradiction —
            and you can see it without any worlds: the two statements are <em>contradictories</em>
            of each other (flip both leading signs of one and you get the other). Asserting both
            is asserting a statement together with its own denial.</p>

            <p>Larger conjunctions hide the signature more deeply, and you have met the tool
            that digs it out. In The Full Language, Lesson 5, a counterclaim was shown
            inconsistent when it satisfied P and Z — exactly one particular conjunct, and an
            algebraic sum of zero. That P/Z test <em>is</em> a contradiction detector: it
            certifies that the conjunction affirms and denies the same content of the same
            subject, once all the cancelling is done.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Idea</span>
              "Inconsistent," "counterclaim fails," "self-contradictory" — one property, one
              signature: <code>+X</code> and <code>−X</code> extracted for the same X. Everything
              in this course is a method for extracting it.
            </div>
          `
        },

        // ── Exercise: Classify ────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-classify",
          title: "Quick Check: Which Bin?",
          instruction: "Classify each statement as a tautology, a contradiction, or contingent.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Classify:", "−p+p"),
              choices: ["Tautology", "Contradiction", "Contingent", "Not a well-formed statement"],
              choicesAreCode: false,
              answer: 0,
              explanation: "'If p then p' — the A-form with the same term twice. No way the world is can make it false: its contradictory +p−p ('p but not p') is the minimal contradiction."
            },
            {
              promptHtml: mcPrompt("Classify:", "+rain−rain"),
              choices: ["Contradiction", "Tautology", "Contingent", "Depends on the season"],
              choicesAreCode: false,
              answer: 0,
              explanation: "'It is raining and it is not raining' — the same term affirmed and denied of the same world-state. The signature +X−X, worn openly."
            },
            {
              promptHtml: mcPrompt("Classify:", "−(−p)−(−q)"),
              choices: ["Contingent", "Tautology", "Contradiction", "Tautology, but only if p = q"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The four-minus form: 'p or q.' Some worlds satisfy it (any with p or with q), some don't (worlds with neither). Contingent — a disjunction of two independent terms says something about the world."
            },
            {
              promptHtml: mcPrompt("Classify:", "−(+p+q)+p"),
              choices: ["Tautology", "Contingent", "Contradiction", "Contingent unless q is true"],
              choicesAreCode: false,
              answer: 0,
              explanation: "'If p and q, then p.' Its contradictory is +(+p+q)−p — 'p-and-q, but not p' — which affirms p (inside the conjunction) and denies it at once. Contradictory self-destructs, so the original is a tautology."
            }
          ]
        },

        // ── Concept: Tautologies ──────────────────────────────────────────────
        {
          type: "concept",
          id: "tautology-test",
          title: "3. Tautologies: Statements That Deny Nothing",
          content: `
            <p>Contradictions wear their signature internally. Tautologies are recognized by a
            beautiful indirection:</p>

            <div class="grammar-rule">
              <span class="g-label">Tautology Test</span>
              A statement is a tautology if and only if its <strong>contradictory</strong> is a
              contradiction. Flip both leading signs; if the result self-destructs, the original
              could not have been false.
            </div>

            <div class="ex-table">
              <div class="ex-row"><code>−p+p</code><span>contradictory <code>+p−p</code> — self-destructs ⇒ tautology ✓</span></div>
              <div class="ex-row"><code>−(−p)+(−p)</code><span>"if not-p then not-p" — i.e. <em>p or not-p</em>, excluded middle; contradictory <code>+(−p)−(−p)</code> self-destructs ⇒ tautology ✓</span></div>
              <div class="ex-row"><code>−(+p+q)+p</code><span>"if p and q, then p"; contradictory <code>+(+p+q)−p</code> affirms and denies p ⇒ tautology ✓</span></div>
              <div class="ex-row"><code>−p+q</code><span>contradictory <code>+p−q</code> — merely contingent ⇒ <em>not</em> a tautology</span></div>
            </div>

            <p>The second row rewards a close look. Excluded middle — "p or not-p" — transcribes
            as the conditional form of the disjunction with <code>q = −p</code>: "if not-p, then
            not-p." A law celebrated since antiquity is, in the sign algebra, just <code>−X+X</code>
            with a negative term in the X position.</p>

            <p>And a pleasing symmetry: the contradictory of the law of noncontradiction's
            target <code>+p−p</code> is <code>−p+p</code>. The minimal contradiction and the
            minimal tautology are each other's denials — the two ends of the trichotomy are one
            sign-flip apart, with all of contingency in between.</p>

            <p>A tautology, being true everywhere, rules out nothing and says nothing about
            which world you are in. That is not a defect. It is why logic's own truths can be
            trusted in every argument about anything: they never take sides between worlds.</p>
          `
        },

        // ── Concept: Contingency and Validity ────────────────────────────────
        {
          type: "concept",
          id: "contingency-validity",
          title: "4. Contingency — and Why Validity Lives in Bin Two",
          content: `
            <p>Contingent statements are the leftovers of the two tests — no internal
            signature, no self-destructing contradictory — and they are logic's reason for
            existing: they are the statements arguments are <em>about</em>.</p>

            <p>Here is the payoff of the trichotomy. Recall the Principle of Validity: an
            argument is valid iff its counterclaim — premises plus denied conclusion — is
            inconsistent. In this lesson's vocabulary:</p>

            <div class="grammar-rule">
              <span class="g-label">Validity, Restated</span>
              An argument is valid if and only if its counterclaim is a
              <strong>contradiction</strong>. Deduction is contradiction-detection.
            </div>

            <p>Watch it work on the hypothetical syllogism — pure statement logic, but the
            machinery is the Barbara you have known since the Introduction:</p>

            ${syl([["−p+q", "if p then q"],
                   ["−q+r", "if q then r"]],
                  ["−p+r", "if p then r"])}

            <div class="step-trace">
              <div class="step"><code>{−p+q, &nbsp;−q+r, &nbsp;+p−r}</code><span class="step-note">counterclaim: premises + contradictory of conclusion</span></div>
              <div class="step step-reduce"><span>Exactly one particular conjunct (+p−r): P ✓. Sum: q cancels, p cancels, r cancels — zero: Z ✓.</span></div>
              <div class="step step-reduce"><code>⊥</code><span class="step-note">the counterclaim is a contradiction ⇒ the argument is valid ✓</span></div>
            </div>

            <p>Every conjunct of that counterclaim is contingent; the <em>conjunction</em> is a
            contradiction. That is the shape of every valid argument: individually innocent
            premises whose joint denial of the conclusion cannot be made.</p>

            <p>The two lessons ahead build the working tools: <strong>direct proofs</strong>,
            which derive the contradiction step by step, and the <strong>tree method</strong>,
            which searches exhaustively for the consistency a contradiction lacks — and reports
            contingency or tautology when it finds or fails to find it.</p>
          `
        },

        // ── Exercise: Tautology Testing ──────────────────────────────────────
        {
          type: "exercise",
          id: "ex-tautology-test",
          title: "Quick Check: The Contradictory Test",
          instruction: "Form the contradictory (flip both leading signs) and see whether it self-destructs.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("The contradictory of:", "−(+p+q)+p"),
              choices: ["+(+p+q)−p", "−(+p+q)−p", "+(−p−q)+p", "−p+(+p+q)"],
              answer: 0,
              explanation: "Flip the two leading signs; the compound term (+p+q) stays intact inside. The result — 'p-and-q but not p' — self-destructs, certifying the original as a tautology."
            },
            {
              promptHtml: mcPrompt("Is this a tautology?", "−(−p)+(−p)"),
              choices: [
                "Yes — its contradictory +(−p)−(−p) affirms and denies (−p)",
                "No — it contains negative terms",
                "No — it is the four-minus form of 'or'",
                "Cannot be determined without knowing p"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "This is excluded middle: 'if not-p then not-p' ≡ 'p or not-p.' The contradictory carries the +X−X signature with X = (−p). Form alone settles it — no facts about p needed."
            },
            {
              promptHtml: mcPrompt("Is this a tautology?", "−p+q"),
              choices: [
                "No — its contradictory +p−q is merely contingent",
                "Yes — all conditionals are tautologies",
                "Yes — it cancels to zero",
                "No — it is a contradiction"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "'If p then q' for independent p, q is contingent: worlds with p-and-not-q falsify it, and its contradictory +p−q describes exactly those worlds without self-destructing."
            },
            {
              prompt: "A statement and its contradictory are both contingent. This is:",
              choices: [
                "The normal case — contingency is closed under denial",
                "Impossible — one of the pair must be a tautology",
                "Possible only in the singleton universe",
                "A sign the statement is relational"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Denial swaps the worlds a statement is true in for the worlds it is false in. A contingent statement has some of each — and so, therefore, does its contradictory. Only at the trichotomy's ends does denial change bins: tautology ↔ contradiction."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-trichotomy-final",
          isFinal: true,
          title: "Final Review: The Trichotomy",
          instruction: "Classification, the contradictory test, and validity as contradiction.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Classify:", "+(−p)−(−p)"),
              choices: ["Contradiction", "Tautology", "Contingent", "Ill-formed"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The signature +X−X with X = (−p): 'not-p, and yet not not-p.' A negative term is a term like any other — affirming and denying it of the same world-state self-destructs."
            },
            {
              prompt: "Why does a tautology carry no information about which world you are in?",
              choices: [
                "It is true in every world, so learning it rules nothing out",
                "It contains no terms",
                "It is false in every world",
                "Its terms are all negative"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Information discriminates: to say something about the world is to rule out ways it might have been. A statement true everywhere rules out nothing — which is precisely why logical truths are safe to add to any argument."
            },
            {
              promptHtml: mcPrompt("The counterclaim of the hypothetical syllogism", "−p+q, −q+r ∴ −p+r"),
              choices: [
                "{−p+q, −q+r, +p−r} — and it is a contradiction",
                "{−p+q, −q+r, −p+r} — and it is a tautology",
                "{+p−q, +q−r, +p−r} — and it is contingent",
                "{−p+q, −q+r, −r+p} — and it is a contradiction"
              ],
              answer: 0,
              explanation: "Premises kept, conclusion replaced by its contradictory (+p−r). P: one particular ✓; Z: the sum cancels to zero ✓ — a contradiction, so the argument is valid."
            },
            {
              prompt: "An argument's counterclaim turns out to be contingent. The argument is:",
              choices: [
                "Invalid — some world makes the premises true and the conclusion false",
                "Valid — contingent counterclaims are acceptable",
                "Valid — as long as the premises are tautologies",
                "Impossible to assess without truth tables"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A contingent counterclaim is true in some world — and that world is a counterexample: premises true, conclusion false. Validity demands the counterclaim be a contradiction, true in no world at all."
            },
            {
              promptHtml: mcPrompt("Which is contingent?", "−(+p+q)+p &nbsp;·&nbsp; −(−q)+p &nbsp;·&nbsp; +q−q"),
              choices: [
                "−(−q)+p — 'if not-q fails... i.e., q or p' depends on the world",
                "−(+p+q)+p — conditionals are always contingent",
                "+q−q — it depends on q",
                "None; every compound is a tautology or contradiction"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "−(−q)+p is the conditional form of 'q or p' — true in worlds with q or with p, false in worlds with neither: contingent. The first is the tautology 'if p and q then p'; the third is a bare contradiction."
            }
          ]
        }

      ]
    }

  ]
};
