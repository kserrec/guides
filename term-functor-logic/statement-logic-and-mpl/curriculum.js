// curriculum.js — Term Functor Logic: Statement Logic and the MPL Bridge
// Based on: Sommers & Englebretsen, "An Invitation to Formal Reasoning: The Logic of Terms" (2000)
// Chapters 7 and 8 — The Logic of Statements; TFL and Modern Predicate Logic
// Prerequisites: Introduction L8 (statement logic as term logic), The Full
// Language L1 (compound statements), L5 (REGAL / counterclaims), Course 3.

// Shared template helpers (syl, engSyl, mcPrompt) come from ../tfl-helpers.js.

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
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 2: Direct Proofs and the Tree Method
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-02",
      title: "Lesson 2: Direct Proofs and the Tree Method",
      navTitle: "Proofs & Trees",
      description: "Derive conclusions line by line with the one rule you already own — then meet the tree method, a systematic search for consistency that finds counterexamples when they exist and certifies validity when they don't.",
      completionText: "Two working tools, one signature. Direct proofs derive the conclusion by cancellation — every classical statement rule is Barbara wearing different clothes. Trees decompose a set of statements into every world that could satisfy it: all branches closing certifies a contradiction, an open branch hands you the counterexample. Next lesson: disjunctive normal form, and the striking result that statement logic is not a rival system but a branch of the syllogistic.",
      blocks: [

        // ── Concept: Proving, Not Just Checking ──────────────────────────────
        {
          type: "concept",
          id: "direct-proofs",
          title: "1. Proving, Not Just Checking",
          content: `
            <p>Lesson 1 gave you the target: validity means the counterclaim is a contradiction.
            This lesson gives you two ways to <em>demonstrate</em> it. The first is the
            <strong>direct proof</strong>: start from the premises and derive the conclusion by
            the cancellation you have used since the Introduction.</p>

            <p>One recall makes statement proofs run (Introduction, Lesson 8): a bare premise
            <em>p</em> — "p is true" — transcribes as the I-form self-predication:</p>

            <div class="syntax-box"><code>p &nbsp;=&nbsp; +p+p</code></div>

            <p>With that, watch a three-premise argument fall to pure algebra —
            <em>if p then q; if q then r; p; therefore r</em>:</p>

            <div class="proof-box">
              <div class="proof-row"><code>1.&nbsp; −p+q</code><span class="proof-note">premise</span></div>
              <div class="proof-row"><code>2.&nbsp; −q+r</code><span class="proof-note">premise</span></div>
              <div class="proof-row"><code>3.&nbsp; +p+p</code><span class="proof-note">premise: p</span></div>
              <div class="proof-row"><code>4.&nbsp; +p+q</code><span class="proof-note">DDO 1, 3 — p cancels (modus ponens)</span></div>
              <div class="proof-row"><code>5.&nbsp; +q+q</code><span class="proof-note">simplification of 4: q holds</span></div>
              <div class="proof-row"><code>6.&nbsp; +q+r</code><span class="proof-note">DDO 2, 5 — q cancels</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+r+r</code><span class="proof-note">simplification of 6: r ✓</span></div>
            </div>

            <p>Every line is one of two moves: a <strong>DDO cancellation</strong> (a universal
            conditional donating into a host, exactly as with terms) or a
            <strong>simplification</strong> (from "p and q," keep a conjunct). There are no
            special statement-logic rules to memorize — the syllogistic engine runs unmodified
            on propositional terms.</p>
          `
        },

        // ── Concept: One Rule, Many Names ────────────────────────────────────
        {
          type: "concept",
          id: "one-rule",
          title: "2. One Rule, Many Names",
          content: `
            <p>The classical rules of statement logic are this same cancellation viewed from
            different angles:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−p+q, +p+p ⊢ +p+q</code><span><strong>Modus ponens</strong> — Barbara with middle term p</span></div>
              <div class="ex-row"><code>−p+q ⊢ −(−q)+(−p)</code><span><strong>Contraposition</strong> — the A-form's valid immediate inference (Introduction L4)</span></div>
              <div class="ex-row"><code>−(−q)+(−p), +(−q)+(−q) ⊢ +(−q)+(−p)</code><span><strong>Modus tollens</strong> — ponens on the contrapositive: not-q yields not-p</span></div>
              <div class="ex-row"><code>−p+q, −q+r ⊢ −p+r</code><span><strong>Hypothetical syllogism</strong> — Barbara pure and simple</span></div>
              <div class="ex-row"><code>−(−p)+q, +(−p)+(−p) ⊢ +(−p)+q</code><span><strong>Disjunctive syllogism</strong> — "p or q" in conditional form, fed with not-p</span></div>
            </div>

            <p>Note the pattern in tollens and the disjunctive syllogism: negative terms like
            <code>(−p)</code> are just terms. "Not-q" enters a proof as <code>+(−q)+(−q)</code> —
            the bare-premise form of the term (−q) — and cancels like anything else.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Idea</span>
              Statement logic adds vocabulary, not machinery: propositional terms, negative
              terms, and the transcriptions of "and," "or," "if." The inference engine —
              DDO, contraposition, simplification — is the one you have had all along.
            </div>
          `
        },

        // ── Exercise: Proof Steps ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-proof-steps",
          title: "Quick Check: Justify the Step",
          instruction: "Each item shows premises or a proof situation. Pick the correct next line or diagnosis.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("From", "−rain+wet &nbsp;and&nbsp; +rain+rain"),
              choices: ["+rain+wet — DDO, rain cancels", "+wet−rain", "−rain−wet", "Nothing follows"],
              answer: 0,
              explanation: "Modus ponens as Barbara: the bare premise +rain+rain hosts, the conditional donates. Rain cancels: +rain+wet, and simplification then yields wet."
            },
            {
              promptHtml: mcPrompt("From", "−p+q &nbsp;and&nbsp; +(−q)+(−q)"),
              choices: [
                "+(−q)+(−p) — contrapose 1, then DDO (modus tollens)",
                "+p+q — modus ponens",
                "+q+q — simplification",
                "Nothing follows — (−q) is not a term"
              ],
              answer: 0,
              explanation: "Contrapose the conditional: −(−q)+(−p). The bare not-q premise hosts it; (−q) cancels, leaving +(−q)+(−p) — not-p holds. Modus tollens is ponens on the contrapositive."
            },
            {
              promptHtml: mcPrompt("'p or q' with premise not-p:", "−(−p)+q &nbsp;and&nbsp; +(−p)+(−p)"),
              choices: ["+(−p)+q — so q holds", "+p+q", "+(−q)+(−p)", "−p+(−q)"],
              answer: 0,
              explanation: "The disjunction in conditional form says 'if not-p then q.' The bare not-p premise hosts it; (−p) cancels: +(−p)+q, and simplification gives q. The disjunctive syllogism is one more Barbara."
            },
            {
              promptHtml: mcPrompt("What is wrong with: from", "−p+q &nbsp;and&nbsp; +q+q &nbsp;infer&nbsp; +p+p"),
              choices: [
                "q occurs + in both statements — no cancellation licenses the step (affirming the consequent)",
                "Nothing — this is modus ponens",
                "The premise +q+q is ill-formed",
                "The inference is valid but needs three premises"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The middle term q is undistributed in both — the same failed signature as the undistributed middle from Course 2. Knowing 'if p then q' and 'q' tells you nothing about p; this is the classic fallacy of affirming the consequent."
            }
          ]
        },

        // ── Concept: The Tree Method ─────────────────────────────────────────
        {
          type: "concept",
          id: "tree-method",
          title: "3. The Tree Method",
          content: `
            <p>Direct proofs need insight — you choose which cancellation to make next. The
            <strong>tree method</strong> needs none: it mechanically decomposes a set of
            statements into every kind of world that could satisfy it. If every path dies,
            no world satisfies the set: it is a contradiction.</p>

            <p>Three decomposition rules, straight from the transcriptions:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+p+q</code><span><strong>and — stack:</strong> the branch gets both p and q</span></div>
              <div class="ex-row"><code>−p+q</code><span><strong>if — branch:</strong> split into (−p) &nbsp;|&nbsp; q — the two ways a conditional is true</span></div>
              <div class="ex-row"><code>−(−p)−(−q)</code><span><strong>or — branch:</strong> split into p &nbsp;|&nbsp; q</span></div>
            </div>

            <p>A branch <strong>closes</strong> (×) when it contains a term and its negation —
            the +X−X signature surfacing as X and (−X) on one path. To test an argument, tree
            its <em>counterclaim</em>. Modus ponens:</p>

            <div class="syntax-box"><pre>
1.  −p+q      (premise)
2.  p         (premise)
3.  (−q)      (denied conclusion)

     ┌────┴────┐
   (−p)        q
    ×          ×
 closes: 2  closes: 3</pre></div>

            <p>Line 1 branches: either (−p) or q. The left path holds both p (line 2) and (−p) —
            closed. The right path holds both (−q) (line 3) and q — closed. Every path dies:
            the counterclaim is a contradiction, and modus ponens is valid.</p>

            <div class="grammar-rule">
              <span class="g-label">Tree Verdicts</span>
              All branches closed ⇒ the set is <strong>inconsistent</strong> (for a
              counterclaim: the argument is <strong>valid</strong>). At least one completed
              open branch ⇒ the set is <strong>consistent</strong> — and the open branch tells
              you exactly which world satisfies it.
            </div>
          `
        },

        // ── Concept: Reading Open Branches ───────────────────────────────────
        {
          type: "concept",
          id: "open-branches",
          title: "4. What an Open Branch Tells You",
          content: `
            <p>Trees do more than certify validity — they <em>build counterexamples</em>. Take
            the fallacy of affirming the consequent: <em>if p then q; q; therefore p</em>.
            Tree the counterclaim:</p>

            <div class="syntax-box"><pre>
1.  −p+q      (premise)
2.  q         (premise)
3.  (−p)      (denied conclusion)

     ┌────┴────┐
   (−p)        q
   open       open</pre></div>

            <p>Neither path contains a clash — the left branch holds (−p), q, (−p); the right
            holds q, (−p), q. Read either open branch as a world: <strong>p false, q true</strong>.
            In that world both premises are true and the conclusion is false. The tree did not
            just say "invalid" — it handed you the world that proves it.</p>

            <p>And the same machine classifies single statements into Lesson 1's bins:</p>

            <div class="ex-table">
              <div class="ex-row"><code>tree of S closes</code><span>S is a <strong>contradiction</strong></span></div>
              <div class="ex-row"><code>tree of S's contradictory closes</code><span>S is a <strong>tautology</strong></span></div>
              <div class="ex-row"><code>both trees stay open</code><span>S is <strong>contingent</strong> — each open branch is a witnessing world</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Why It Terminates</span>
              Each rule application strictly shrinks what remains to decompose — a compound
              becomes its parts, never anything larger. Finitely many statements, finitely many
              parts: every tree finishes, and every verdict is mechanical. Logic's three bins,
              sorted by a procedure.
            </div>
          `
        },

        // ── Exercise: Tree Verdicts ──────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-tree-verdicts",
          title: "Quick Check: Valid or Invalid?",
          instruction: "Tree each counterclaim in your head: branch the conditionals and disjunctions, close on any clash. All branches close = valid.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl([["−p+q", "if p then q"], ["+p+p", "p"]], ["+q+q", "q"]),
              answer: "valid",
              explanation: "Counterclaim {−p+q, p, (−q)}. The conditional branches into (−p) | q; the left closes against p, the right against (−q). All closed — modus ponens is valid."
            },
            {
              exprHtml: syl([["−p+q", "if p then q"], ["+q+q", "q"]], ["+p+p", "p"]),
              answer: "invalid",
              explanation: "Counterclaim {−p+q, q, (−p)}. Both branches of the conditional stay open — the world p-false, q-true satisfies the whole set. Affirming the consequent, with the counterexample handed to you."
            },
            {
              exprHtml: syl([["−(−p)+q", "p or q"], ["+(−p)+(−p)", "not-p"]], ["+q+q", "q"]),
              answer: "valid",
              explanation: "Counterclaim {−(−p)+q, (−p), (−q)}. The disjunction branches into p | q; the left closes against (−p), the right against (−q). All closed — the disjunctive syllogism is valid."
            },
            {
              exprHtml: syl([["−p+q", "if p then q"], ["+(−p)+(−p)", "not-p"]], ["+(−q)+(−q)", "not-q"]),
              answer: "invalid",
              explanation: "Counterclaim {−p+q, (−p), q}. The conditional branches into (−p) | q — both consistent with what the branch already holds. Open branch: p false, q true. Denying the antecedent fails, and the tree shows the world where it fails."
            },
            {
              exprHtml: syl([["−p+q", "if p then q"], ["−q+r", "if q then r"]], ["−p+r", "if p then r"]),
              answer: "valid",
              explanation: "Counterclaim {−p+q, −q+r, +p−r}. The particular conjunct stacks p and (−r); the first conditional branches (−p)|q — left closes on p; the survivor's second conditional branches (−q)|r — both close. Hypothetical syllogism, certified by tree."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-proofs-trees-final",
          isFinal: true,
          title: "Final Review: Proofs and Trees",
          instruction: "Direct proof moves, tree rules, and what open branches mean.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("A bare premise p enters a proof as:", "?"),
              choices: ["+p+p — the I-form self-predication", "−p+p", "+p−p", "(−p)"],
              answer: 0,
              explanation: "'p is true' = 'some p-state is a p-state' in the singleton universe. This is what lets bare premises host conditionals in DDO cancellations (Introduction L8)."
            },
            {
              promptHtml: mcPrompt("The tree rule for", "−(−p)−(−q)"),
              choices: [
                "Branch into p | q — the two ways a disjunction is true",
                "Stack both (−p) and (−q)",
                "Branch into (−p) | (−q)",
                "Close the branch immediately"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The four-minus form is 'p or q': a world satisfies it via p or via q. Branching explores both. (Stacking is for conjunctions, where a world must supply both parts.)"
            },
            {
              prompt: "A completed tree of an argument's counterclaim has one open branch. Then:",
              choices: [
                "The argument is invalid, and the branch describes a counterexample world",
                "The argument is valid — one branch is within tolerance",
                "The counterclaim is a tautology",
                "The tree must be restarted with the conclusion undenied"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "An open branch is a consistent way for all counterclaim members to be true — premises true, conclusion false. That is the definition of a counterexample, read directly off the branch."
            },
            {
              promptHtml: mcPrompt("To show a statement S is a tautology by tree, you tree:", "?"),
              choices: [
                "S's contradictory, and find every branch closes",
                "S itself, and find every branch closes",
                "S itself, and find an open branch",
                "Both S and its contradictory, and find both open"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Tautology = contradictory is a contradiction (Lesson 1's test). The tree certifies contradiction by closing every branch. Treeing S itself and closing everything would show S is a contradiction instead."
            },
            {
              promptHtml: mcPrompt("In the proof of r from", "−p+q, −q+r, p"),
              choices: [
                "Every line is DDO cancellation or simplification — no new rules",
                "Modus ponens and modus tollens are primitive rules added for statements",
                "The tree method must be used first",
                "The proof requires pronominalization"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Statement logic adds vocabulary (propositional and negative terms, the transcriptions) but no machinery. MP, MT, hypothetical and disjunctive syllogism are all the one cancellation — Barbara — in different dress."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 3: DNF and the Subsumption of Statement Logic
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-03",
      title: "Lesson 3: DNF and the Subsumption of Statement Logic",
      navTitle: "DNF & Subsumption",
      description: "Reduce any statement to its list of satisfying worlds — disjunctive normal form — watch the tree method compute it for free, and cash in the course's promise: statement logic is not a rival system beside the syllogistic but a branch of it.",
      completionText: "The subsumption is complete. DNF supplies the expressive half — every truth-functional compound reduces to or-of-ands of literals, and 'or,' 'and,' 'not' all transcribe categorically — while Lessons 1–2 supplied the inferential half: nothing statement logic proves needs rules beyond DDO, contraposition, and simplification. Statement logic is the syllogistic run in a one-member universe, where propositions are singular terms for the world-state and quantity goes wild. Next lesson the course crosses to the other side of the bridge: modern predicate logic on its own terms — quantifiers, variables, and the predicate way of building statements.",
      blocks: [

        // ── Concept: World-Descriptions and Normal Form ──────────────────────
        {
          type: "concept",
          id: "world-descriptions",
          title: "1. World-Descriptions and Normal Form",
          content: `
            <p>Lesson 2 ended with trees handing you worlds: an open branch read off as
            "p false, q true" was the counterexample. This lesson makes that reading the star.
            Fix a vocabulary of statement terms — say p and q. A <strong>world-description</strong>
            settles every term, affirming it or denying it, in one conjunction:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+p+q</code><span>worlds where p and q both hold</span></div>
              <div class="ex-row"><code>+p+(−q)</code><span>worlds with p but not q</span></div>
              <div class="ex-row"><code>+(−p)+q</code><span>worlds with q but not p</span></div>
              <div class="ex-row"><code>+(−p)+(−q)</code><span>worlds with neither</span></div>
            </div>

            <p>Two terms, two choices each: four kinds of world, and every world is exactly one
            of the four. Any statement built from p and q is true in some rows and false in the
            rest — Lesson 1's trichotomy just counts them: all four, none, or in between.</p>

            <div class="grammar-rule">
              <span class="g-label">Disjunctive Normal Form</span>
              Every statement is equivalent to the <strong>disjunction of the world-descriptions
              it is true in</strong> — its DNF. A statement <em>is</em> its list of worlds:
              tautology = the full list, contradiction = the empty list, contingent = a proper,
              non-empty selection.
            </div>

            <p>Take <code>−p+q</code> — "if p then q." It fails in exactly one kind of world:
            p without q. So its DNF is the other three rows:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+p+q</code><span>✓ satisfies it</span></div>
              <div class="ex-row"><code>+p+(−q)</code><span>✗ the one excluded row</span></div>
              <div class="ex-row"><code>+(−p)+q</code><span>✓ satisfies it</span></div>
              <div class="ex-row"><code>+(−p)+(−q)</code><span>✓ satisfies it</span></div>
            </div>

            <p>Look closely at the excluded row: <code>+p+(−q)</code> is the conditional's
            contradictory <code>+p−q</code> — "p but not q" — in world-description dress
            (obversion: "isn't q" = "is non-q"). A statement's missing rows are not lost;
            they are exactly where its contradictory lives.</p>

            <div class="callout-note">
              <span class="cn-label">Notation</span>
              In the sign algebra proper, disjunction chains through the four-minus form —
              the DNF of a conditional is a nested <code>−(−…)−(−…)</code> tower. Nothing new
              is needed to write it; plenty is gained by not reading it. We display normal
              forms as row lists and let the algebra keep the receipts.
            </div>
          `
        },

        // ── Concept: Trees Compute Normal Forms ──────────────────────────────
        {
          type: "concept",
          id: "trees-compute-dnf",
          title: "2. Trees Compute Normal Forms",
          content: `
            <p>How do you find a statement's DNF? You already own the machine. Complete a tree
            of the statement: every open branch is a conjunction of literals — a
            world-description, possibly partial. The open branches, disjoined,
            <em>are</em> a normal form.</p>

            <div class="syntax-box"><pre>
1.  −p+q      (the statement)

     ┌────┴────┐
   (−p)        q
   open       open</pre></div>

            <p>Compact DNF: <code>(−p)</code> or <code>q</code>. Each branch is silent about
            the term it doesn't mention, so it covers both settings of that term. Expand the
            silences and the full DNF appears:</p>

            <div class="ex-table">
              <div class="ex-row"><code>(−p)</code><span>covers +(−p)+q and +(−p)+(−q)</span></div>
              <div class="ex-row"><code>q</code><span>covers +p+q and +(−p)+q</span></div>
              <div class="ex-row"><code>together</code><span>the three rows of §1 — overlap counted once</span></div>
            </div>

            <p>And the tree verdicts of Lesson 2 become row counts. All branches close: no
            disjuncts, empty DNF, contradiction. To certify a tautology, tree the contradictory
            and watch it close — equivalently, the statement's own full DNF lists every row.</p>

            <p>Normal form also settles <strong>equivalence</strong>, a question trees alone
            answered awkwardly. The conditional <code>−p+q</code> and its contrapositive
            <code>−(−q)+(−p)</code> look nothing alike; both exclude exactly the row
            <code>+p+(−q)</code>, so both have the same three-row DNF. Same rows, same
            statement:</p>

            <div class="grammar-rule">
              <span class="g-label">Canonical Form</span>
              Two statements are logically equivalent if and only if their full DNFs list the
              same world-descriptions. Syntax varies — dozens of ways to write one claim — but
              the normal form is a fingerprint.
            </div>
          `
        },

        // ── Exercise: Reading Normal Forms ───────────────────────────────────
        {
          type: "exercise",
          id: "ex-normal-forms",
          title: "Quick Check: Reading Normal Forms",
          instruction: "World-descriptions, DNF by tree, and equivalence by fingerprint.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Which world-descriptions over p, q satisfy:", "−p+q"),
              choices: [
                "+p+q only",
                "+p+(−q) only",
                "+p+q · +(−p)+q · +(−p)+(−q)",
                "+(−p)+q · +(−p)+(−q)"
              ],
              answer: 2,
              explanation: "'If p then q' fails only where p holds without q — the row +p+(−q), its contradictory +p−q in world-description dress. The other three rows all satisfy it, and they are its full DNF."
            },
            {
              prompt: "How many world-descriptions are there over three statement terms p, q, r?",
              choices: ["3", "6", "8", "9"],
              answer: 2,
              explanation: "Each term is settled independently — affirmed or denied — so the count doubles per term: 2 × 2 × 2 = 8. A full DNF over three terms is a selection from those eight rows; a tautology takes all eight."
            },
            {
              prompt: "A completed tree of S closes every branch. What is S's DNF?",
              choices: [
                "The single row +S+S",
                "All world-descriptions over S's terms",
                "It cannot be determined from a closed tree",
                "The empty disjunction — no world-description satisfies S"
              ],
              choicesAreCode: false,
              answer: 3,
              explanation: "Open branches are the disjuncts of the DNF. No open branches, no disjuncts: S's list of satisfying worlds is empty, which is what being a contradiction means. Tree method and normal form deliver the same verdict from the same evidence."
            },
            {
              promptHtml: mcPrompt("Compare the full DNFs of", "−p+q &nbsp;and&nbsp; −(−q)+(−p)"),
              choices: [
                "They differ in one row — the contrapositive drops +(−p)+(−q)",
                "Identical, three rows each — the statements are equivalent",
                "They share no rows — the statements are contradictories",
                "Incomparable: DNF is defined only for positive terms"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "A conditional and its contrapositive exclude exactly the same kind of world: p without q. Same excluded row, same three remaining rows — and identity of full DNFs is what equivalence means. The fingerprint test at work."
            }
          ]
        },

        // ── Concept: Expressive Completeness ─────────────────────────────────
        {
          type: "concept",
          id: "expressive-completeness",
          title: "3. Nothing Statement Logic Says Escapes the Algebra",
          content: `
            <p>Why does normal form matter beyond bookkeeping? Because it answers a challenge.
            TFL transcribed "and," "or," and "if" in Course 2 — but statement logic can define
            <em>any</em> truth-functional compound: the biconditional, exclusive-or, some
            unnamed three-term connective given only by its truth table. Does each new
            connective need its own transcription?</p>

            <p>DNF says no. Given any truth table whatsoever, collect the rows where the
            compound is true; each row is a world-description — a conjunction of affirmed and
            denied terms; disjoin them. Done. For instance:</p>

            <div class="ex-table">
              <div class="ex-row"><code>p iff q</code><span>true rows: +p+q, +(−p)+(−q) — "both or neither"</span></div>
              <div class="ex-row"><code>p xor q</code><span>true rows: +p+(−q), +(−p)+q — the complementary pair</span></div>
            </div>

            <p>So every truth function reduces to three operations — <em>or</em>, <em>and</em>,
            <em>not</em> — and TFL owns all three:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+A+B</code><span>conjunction — the I-form</span></div>
              <div class="ex-row"><code>−(−A)−(−B)</code><span>disjunction — the four-minus form</span></div>
              <div class="ex-row"><code>(−A)</code><span>negation — the negative term</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">The Expressive Half of the Subsumption</span>
              Every truth-functional compound, however exotic, is equivalent to its DNF — and a
              DNF is built from conjunction, disjunction, and negative terms, all of which are
              already categorical. Nothing statement logic can say is missing from TFL.
            </div>

            <p>Note the division of labor with the earlier lessons. Lessons 1–2 showed that
            what statement logic <em>proves</em>, TFL proves — with cancellation, trees, and
            the P/Z detector. This section shows that what statement logic <em>says</em>, TFL
            says. Expressible and provable: those are the two halves of "subsumed."</p>
          `
        },

        // ── Concept: The Singleton Universe ──────────────────────────────────
        {
          type: "concept",
          id: "singleton-subsumption",
          title: "4. A Branch, Not a Rival",
          content: `
            <p>Where does statement logic's perfect obedience come from? From a fact recalled
            since the Introduction: the propositional universe is a <strong>singleton</strong>.
            Statement terms name kinds of world-state — "situations where it rains" — and there
            is exactly one candidate to be in or out of those kinds: the actual world-state.</p>

            <p>That makes statements the <strong>singular terms</strong> of their universe. In
            a one-member universe, an occupied class is not just nonempty — it is the whole
            universe. So once p is asserted, "some p-situation is q" and "every p-situation
            is q" pick out the same fact, and quantity goes <strong>wild</strong> — the same
            collapse that earned Socrates his ± in Introduction Lesson 7, for the same reason:
            a term that can denote at most one thing makes all/some a distinction without a
            difference.</p>

            <p>Wild quantity is why the bare premise <code>+p+p</code> could host the universal
            <code>−p+q</code> the moment it entered a proof, and why Course 4 added no
            machinery: modus ponens was Barbara, tollens was ponens on the contrapositive,
            tree closure was the +X−X signature, the trichotomy was the P/Z detector's
            three possible verdicts. Rules borrowed, none invented.</p>

            <div class="grammar-rule">
              <span class="g-label">The Subsumption</span>
              Statement logic is the syllogistic applied to propositional terms in a one-member
              universe. Expressible (DNF + the transcriptions) and provable (DDO,
              contraposition, simplification) — a <strong>branch</strong> of term logic, not a
              system beside it.
            </div>

            <p>Measure that against the modern architecture. Since Frege, logic is built the
            other way up: the propositional calculus is the ground floor, quantifiers and
            predicates are erected on top of it, and the syllogistic is retired as a quaint
            fragment of the result. Sommers inverts the building: the term algebra is the
            trunk, and the propositional calculus grows out of it as the singleton-universe
            special case.</p>

            <div class="callout-note">
              <span class="cn-label">What's Next</span>
              One system remains standing on the other side: modern predicate logic itself —
              MPL, the logic of quantifiers and bound variables. Before TFL and MPL can be
              translated into each other, you need to read MPL natively. Next lesson: its
              syntax, and the predicate way of building statements.
            </div>
          `
        },

        // ── Exercise: The Subsumption ────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-subsumption",
          title: "Quick Check: The Subsumption",
          instruction: "The singleton universe, wild quantity, and what DNF proves.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "In the propositional universe, why do 'some p-situation is q' and 'every p-situation is q' collapse once p is asserted?",
              choices: [
                "Because q must also be asserted",
                "Because propositions cannot appear in subject position",
                "The universe has one member — an occupied class is the whole universe, so 'some' and 'every' pick out the same fact",
                "They do not collapse; the tree method is needed to distinguish them"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "One candidate world-state: if any p-situation exists, the whole universe is p-situations. All/some becomes a distinction without a difference — wild quantity, exactly as with singular terms."
            },
            {
              prompt: "Which new rules of inference does statement logic add to the term algebra?",
              choices: [
                "Modus ponens and modus tollens",
                "The tree decomposition rules",
                "Branch closure on +X−X",
                "None — only new vocabulary: propositional terms, negative terms, and the transcriptions of the connectives"
              ],
              choicesAreCode: false,
              answer: 3,
              explanation: "Every 'rule' of this course was already licensed: ponens is Barbara, tollens is ponens on the contrapositive, tree closure is the contradiction signature surfacing on a branch. Vocabulary grew; the engine never changed."
            },
            {
              prompt: "What exactly does DNF contribute to the subsumption claim?",
              choices: [
                "It shows statement-logic proofs always terminate",
                "Expressive completeness: any truth-functional compound reduces to or-of-ands of literals — and 'or,' 'and,' 'not' all transcribe categorically",
                "It shows all tautologies share one normal form",
                "It replaces the tree method"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Proofs and trees covered what statement logic proves; DNF covers what it says. Any truth table, however exotic its connective, is a disjunction of its true rows — built from three operations TFL already owns."
            },
            {
              prompt: "How does TFL's architecture differ from modern logic's?",
              choices: [
                "Modern logic makes the propositional calculus the ground floor and builds quantification on top; TFL derives statement logic as the singleton-universe branch of the syllogistic",
                "TFL rejects statement logic as meaningless",
                "They agree on architecture and differ only in notation",
                "TFL makes statement logic basic and derives the syllogistic from it"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Since Frege, the syllogistic has been treated as a small fragment of a logic built on a propositional base. Sommers inverts the building: the term algebra is the trunk, and the whole propositional calculus is one of its branches."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-dnf-subsumption-final",
          isFinal: true,
          title: "Final Review: DNF and the Subsumption",
          instruction: "Normal forms, what they classify, and why statement logic is a branch of the syllogistic.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "The full DNF over p, q of a tautology:",
              choices: [
                "Is empty",
                "Is the single row +p+q",
                "Lists all four world-descriptions — true in every kind of world",
                "Cannot be computed by a tree"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "A tautology excludes nothing, so every row is on its list — which is precisely why it carries no information (Lesson 1). Dually, a contradiction's list is empty; contingency is everything in between."
            },
            {
              promptHtml: mcPrompt("Over the vocabulary p, q, a completed open branch holds just", "(−p)"),
              choices: [
                "It covers the rows +(−p)+q and +(−p)+(−q)",
                "It covers the row +(−p)+q only",
                "It covers the rows +p+q and +p+(−q)",
                "No rows — a branch must mention every term"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A branch silent about q constrains only p: any world with p false satisfies it, whichever way q goes. Expanding the silence splits the compact disjunct into its two full rows."
            },
            {
              prompt: "How do the full DNFs of a statement and its contradictory relate?",
              choices: [
                "They are identical",
                "The contradictory's DNF is always empty",
                "They overlap in exactly one row",
                "They split the world-descriptions between them — no shared row, and together they exhaust all of them"
              ],
              choicesAreCode: false,
              answer: 3,
              explanation: "Denial swaps the worlds a statement is true in for the worlds it is false in (Lesson 1). Row-wise: the contradictory's list is the exact complement. At the trichotomy's ends the split is total — all rows against none."
            },
            {
              prompt: "Statements take wild quantity for the same reason singular terms do. What is that reason?",
              choices: [
                "Both denote at most one thing — and a class with one possible member makes 'all' and 'some' coincide once it is occupied",
                "Both are always true",
                "Both abbreviate conjunctions",
                "Neither can be negated"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Socrates earned his ± from unique denotation (Introduction L7); a propositional term describes world-states in a one-world universe. Occupied means exhaustive, so quantity carries no information — choose + to host, − to donate, as the proof requires."
            },
            {
              prompt: "'Statement logic is a branch of the syllogistic.' Which two established facts make that literal?",
              choices: [
                "The trichotomy and the tree method",
                "Every truth-functional compound is expressible by TFL transcriptions (via DNF), and every statement-logic inference is derivable by the term rules (DDO, contraposition, simplification)",
                "Statement logic and the syllogistic share the forms A, E, I, O",
                "Trees terminate and proofs are finite"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Subsumption has two halves. Expressive: DNF reduces any connective to or/and/not, all categorical. Inferential: every proof in this course ran on rules you had before the course began. Said and proved — nothing left over."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 4: MPL's Syntax and the Predicate Way
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-04",
      title: "Lesson 4: MPL's Syntax and the Predicate Way",
      navTitle: "The Predicate Way",
      description: "Learn to read modern predicate logic natively — names, predicates, quantifiers, and bound variables — and see with TFL-trained eyes what the predicate way of building statements buys, and what it costs.",
      completionText: "You can now read MPL as its speakers do: atomic predications of names, glued by the statement-logic connectives, generalized by quantifiers whose variables work as full-time pronouns. You have also seen the costs of the predicate way — a caste system separating names from predicates, one categorical form split across two connectives, and vacuous truth settling existential import by fiat. Next lesson the two notations finally meet: systematic translation between TFL's signed terms and MPL's quantified formulas, in both directions.",
      blocks: [

        // ── Concept: The Predicate Way ────────────────────────────────────────
        {
          type: "concept",
          id: "predicate-way",
          title: "1. The Predicate Way",
          content: `
            <p>Since the Introduction's first lesson, TFL has parsed "every senator is a
            politician" the <em>term way</em>: two terms, joined by a functor that carries
            quantity and quality — <code>−Senator+Politician</code>. Modern predicate logic
            — <strong>MPL</strong>, the logic of Frege, Russell, and every standard textbook
            since — parses the same sentence the <em>predicate way</em>: as a statement about
            <em>everything</em>. Take any object whatever: if it is a senator, it is a
            politician.</p>

            <p>To say such things, MPL builds from a kit with strictly sorted parts:</p>

            <div class="ex-table">
              <div class="ex-row"><code>s, a, b</code><span><strong>names</strong> (individual constants) — each denotes one individual</span></div>
              <div class="ex-row"><code>x, y, z</code><span><strong>variables</strong> — pronouns awaiting a quantifier</span></div>
              <div class="ex-row"><code>W, P, L</code><span><strong>predicates</strong> — each takes a fixed number of subjects</span></div>
              <div class="ex-row"><code>Ws</code><span>atomic statement: "Socrates is wise" — predicate W applied to name s</span></div>
              <div class="ex-row"><code>Lab</code><span>atomic statement: "a loves b" — a two-place predicate takes two names</span></div>
            </div>

            <p>Note the word <em>sorted</em>. In TFL there is one syntactic category — the
            term — and "Socrates," "wise," and "loves Mary" all belong to it. MPL splits the
            vocabulary into castes: <strong>names may only occupy subject positions; general
            terms may only be predicates</strong>. "Socrates is wise" goes through as
            <code>Ws</code>, but "some philosopher is Socrates" cannot put Socrates in
            predicate position — MPL must reach for a special identity predicate and write
            <code>∃x(Px ∧ x = s)</code>.</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              TFL needed no identity relation at all: "Twain is Clemens" is an ordinary
              monadic categorical with a singular predicate term, and the laws of identity
              fell out as theorems (The Full Language, Lesson 7). Where the caste system
              forces new machinery, the term way already had room.
            </div>

            <p>The statement-connectives you know from Lessons 1–2 reappear in MPL's dress,
            and they are exactly your transcriptions read backward:</p>

            <div class="ex-table">
              <div class="ex-row"><code>¬p</code><span>not-p — TFL's negative term <code>(−p)</code></span></div>
              <div class="ex-row"><code>p ∧ q</code><span>p and q — TFL's <code>+p+q</code></span></div>
              <div class="ex-row"><code>p → q</code><span>if p then q — TFL's <code>−p+q</code></span></div>
              <div class="ex-row"><code>p ∨ q</code><span>p or q — TFL's four-minus form</span></div>
            </div>
          `
        },

        // ── Concept: Quantifiers and Bound Variables ─────────────────────────
        {
          type: "concept",
          id: "quantifiers-variables",
          title: "2. Quantifiers and Bound Variables",
          content: `
            <p>Atomic predications and connectives only talk about named individuals. To
            generalize, MPL adds two <strong>quantifiers</strong>, each governing a
            variable:</p>

            <div class="ex-table">
              <div class="ex-row"><code>∀x( … x … )</code><span>"everything is such that … it …"</span></div>
              <div class="ex-row"><code>∃x( … x … )</code><span>"something is such that … it …"</span></div>
            </div>

            <p>Read the universal A-form the predicate way, step by step:</p>

            <div class="step-trace">
              <div class="step"><code>∀x(Mx → Tx)</code><span class="step-note">every man is mortal</span></div>
              <div class="step step-reduce"><span>"Take anything whatever — call it x —</span></div>
              <div class="step step-reduce"><span>if <em>it</em> is a man, then <em>it</em> is mortal."</span></div>
            </div>

            <p>The variable is a <strong>pronoun</strong>: it names nothing, refers to no one,
            and exists to cross-reference the quantifier's "anything" through the formula. You
            have met this device — Course 3's proterms did precisely this work in indirect
            proofs. The difference is economy: TFL reaches for a proterm only when an argument
            needs one; MPL's grammar requires the pronouns <em>everywhere</em>, in every
            general statement it can write.</p>

            <p>A quantifier binds every occurrence of its variable inside its
            <strong>scope</strong> — the parenthesized formula it governs. A variable no
            quantifier binds is <strong>free</strong>, and a formula with a free variable is
            an <strong>open sentence</strong>: "x is wise" is neither true nor false, any more
            than "it is wise" said with no antecedent. Only when every variable is bound (or
            replaced by a name) does the formula become a statement.</p>

            <div class="grammar-rule">
              <span class="g-label">What Counts as an MPL Statement</span>
              Atomic predications of names, combined by <code>¬ ∧ ∨ →</code>, generalized by
              <code>∀</code> and <code>∃</code> — with <strong>no variable left free</strong>.
            </div>
          `
        },

        // ── Exercise: Reading MPL ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-reading-mpl",
          title: "Quick Check: Reading MPL",
          instruction: "Atomic formulas, quantifier readings, and bound versus free.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("What does this say?", "∀x(Mx → Tx)"),
              choices: [
                "Everything is both M and T",
                "Take anything whatever: if it is M, then it is T — every M is T",
                "Something is M, and it is T",
                "The individual named x is M and therefore T"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "∀x reads 'everything is such that,' and the arrow makes the claim conditional on being M. The x is a bound pronoun, not a name — the formula mentions no individual in particular."
            },
            {
              promptHtml: mcPrompt("In", "∃x(Px ∧ Wx)") + " what is x?",
              choices: [
                "A name for the particular individual the formula discovered",
                "A bound variable — a pronoun cross-referencing 'something': something is such that it is P and it is W",
                "A one-place predicate",
                "A free variable, so the formula has no truth value"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "The quantifier says 'something'; both occurrences of x are its pronouns, bound inside its scope. No individual is named — the statement is true if at least one thing is both P and W, whoever that may be."
            },
            {
              prompt: "Which of these is an open sentence — no truth value until repaired?",
              choices: [
                "∀x(Sx → Px)",
                "Ws",
                "∃y Lay",
                "Px ∧ Wx"
              ],
              answer: 3,
              explanation: "In Px ∧ Wx nothing binds x: it is 'it is P and it is W' with no antecedent for 'it.' The first formula binds x with ∀, the second contains no variable at all, and in the third ∃y binds y while a is a name."
            },
            {
              prompt: "In MPL, 'Socrates is wise' is:",
              choices: [
                "Ws — the predicate W applied to the name s",
                "∃x(Sx ∧ Wx) — names must enter through a quantifier",
                "±Socrates* + Wise — MPL borrows TFL's wild quantity",
                "sW — the name applied to the predicate"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Singular statements are MPL's base case — an atomic predication, no quantifier needed. Contrast TFL, where singulars earned special treatment (wild quantity); and note the caste rule: s could never itself be predicated."
            }
          ]
        },

        // ── Concept: The Four Forms, the Hard Way ─────────────────────────────
        {
          type: "concept",
          id: "four-forms-mpl",
          title: "3. The Four Forms, the Hard Way",
          content: `
            <p>Here are the four categorical forms you have written with two signs since the
            Introduction, rendered the predicate way:</p>

            <div class="syntax-box">
              <table>
                <tr><td>A: every S is P</td><td><code>−S+P</code></td><td><code>∀x(Sx → Px)</code></td></tr>
                <tr><td>E: no S is P</td><td><code>−S−P</code></td><td><code>∀x(Sx → ¬Px)</code></td></tr>
                <tr><td>I: some S is P</td><td><code>+S+P</code></td><td><code>∃x(Sx ∧ Px)</code></td></tr>
                <tr><td>O: some S isn't P</td><td><code>+S−P</code></td><td><code>∃x(Sx ∧ ¬Px)</code></td></tr>
              </table>
            </div>

            <p>Look down the MPL column and notice the <strong>asymmetry</strong>: universal
            forms take the conditional, particular forms take the conjunction. This is not a
            style choice — cross the wires and the meaning breaks:</p>

            <div class="ex-table">
              <div class="ex-row"><code>∀x(Sx ∧ Px)</code><span><strong>too strong</strong> — "everything is an S and a P": every object in the universe a senator-politician</span></div>
              <div class="ex-row"><code>∃x(Sx → Px)</code><span><strong>too weak</strong> — a conditional with a false antecedent is true, so any one non-S in the domain verifies it</span></div>
            </div>

            <p>The second trap is the classic. "Some senator is a politician" rendered as
            <code>∃x(Sx → Px)</code> comes out true in a universe containing one teacup and
            no senators — the teacup fails to be S, the conditional holds, "something" is
            found. Every student of MPL burns a hand on this stove once.</p>

            <div class="grammar-rule">
              <span class="g-label">The Asymmetry</span>
              MPL's quantifiers cannot carry the subject–predicate tie by themselves, so each
              quantity conscripts a different connective: <em>every</em> pairs with
              <code>→</code>, <em>some</em> pairs with <code>∧</code>. What TFL writes as one
              form with different signs, MPL splits across two connectives.
            </div>

            <p>The asymmetry also settles existential import — by fiat of the truth-functions.
            In a world with no unicorns, <code>∀x(Ux → Wx)</code> ("all unicorns have wings")
            is <strong>true</strong>: every instance of the conditional has a false antecedent.
            Meanwhile <code>∃x(Ux ∧ Wx)</code> is false. So in MPL, A never entails I;
            universal statements about empty kinds are all true at once — including "all
            unicorns lack wings."</p>
          `
        },

        // ── Concept: Relations, Order, and the Two Towers ─────────────────────
        {
          type: "concept",
          id: "relations-two-towers",
          title: "4. Relations, Quantifier Order, and the Two Towers",
          content: `
            <p>Where MPL earned its reputation is relational generality. A two-place predicate
            plus nested quantifiers expresses "every man loves some woman":</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Man+(Lov+Woman)</code><span>TFL — Course 2, Lesson 2: signs inside the relational complex</span></div>
              <div class="ex-row"><code>∀x(Mx → ∃y(Wy ∧ Lxy))</code><span>MPL — a quantifier per participant, pronouns keeping them apart</span></div>
            </div>

            <p>With nested quantifiers, <strong>order is meaning</strong>:</p>

            <div class="ex-table">
              <div class="ex-row"><code>∀x∃y Lxy</code><span>everyone loves someone — each x finds a y, perhaps a different y each time</span></div>
              <div class="ex-row"><code>∃y∀x Lxy</code><span>someone is loved by everyone — one y serves all x</span></div>
            </div>

            <p>The second entails the first — one universally-loved y supplies every x with a
            beloved — but not conversely: from each having their own, no common favorite
            follows. TFL drew this same distinction with the placement of signs inside the
            complex; MPL draws it with the left-to-right order of quantifiers. Both notations
            mark it; they mark it in different places, which is exactly what a translation
            procedure will have to track.</p>

            <p>Step back and the architecture of Lesson 3 is now visible from both sides.
            MPL is built exactly the way the moderns describe: the statement-logic connectives
            are the ground floor, and the quantifier-variable apparatus is erected on top.
            TFL runs the same materials the other way: the term algebra is the ground floor,
            and statement logic falls out as the singleton-universe branch. Two towers, same
            stone.</p>

            <div class="callout-note">
              <span class="cn-label">What's Next</span>
              You can now read both notations natively. Next lesson: the bridge — systematic
              procedures for translating TFL's signed terms into MPL's quantified formulas
              and back, including the relational cases where the two notations divide the
              labor most differently.
            </div>
          `
        },

        // ── Exercise: The Four Forms in MPL ──────────────────────────────────
        {
          type: "exercise",
          id: "ex-four-forms-mpl",
          title: "Quick Check: The Four Forms in MPL",
          instruction: "Pick the right rendering — and diagnose the classic mistranslations.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Translate:", "every senator is a politician"),
              choices: [
                "∀x(Sx ∧ Px)",
                "∃x(Sx → Px)",
                "∀x(Sx → Px)",
                "∀x(Px → Sx)"
              ],
              answer: 2,
              explanation: "Universal quantity conscripts the conditional: anything, if a senator, is a politician. The conjunction version claims everything is a senator-politician; the ∃ version is the too-weak trap; the last converts the terms — every politician a senator."
            },
            {
              promptHtml: "What is wrong with " + mcPrompt("", "∃x(Sx → Px)") + " for \"some S is P\"?",
              choices: [
                "It is too weak — a false antecedent makes the conditional true, so any single non-S in the domain verifies it, even if no S is P",
                "It is too strong — it demands that every S be P",
                "It is ill-formed — a quantifier cannot govern a conditional",
                "Nothing — it is the standard I-form"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "One teacup, zero senators: the teacup fails Sx, the conditional holds of it, and the existential is satisfied. Particular quantity needs the conjunction — something is an S and a P."
            },
            {
              promptHtml: mcPrompt("Which is equivalent to:", "¬∃x(Sx ∧ Px)"),
              choices: [
                "∃x(Sx ∧ ¬Px)",
                "∀x(Sx → ¬Px)",
                "∀x(¬Sx → ¬Px)",
                "¬∀x(Sx → Px)"
              ],
              answer: 1,
              explanation: "'Nothing is an S-and-P' is the E-form: everything, if S, fails to be P. The first choice is the O-form; the last is O's other dress ('not every S is P'); the third says every non-S is a non-P — a different claim entirely."
            },
            {
              promptHtml: "In a world with no unicorns, " + mcPrompt("", "∀x(Ux → Wx)") + " (\"all unicorns have wings\") is:",
              choices: [
                "False — there are no winged unicorns to verify it",
                "Truth-valueless — the subject term is empty",
                "True — every instance of the conditional has a false antecedent (vacuous truth)",
                "True — because ∃x(Ux ∧ Wx) is also true"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "MPL settles existential import by truth-functions: an empty subject verifies every universal about it — winged and wingless alike — while the I-form ∃x(Ux ∧ Wx) stays false. In MPL, A does not entail I."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-mpl-syntax-final",
          isFinal: true,
          title: "Final Review: The Predicate Way",
          instruction: "The caste system, binding, the asymmetry, and quantifier order.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "MPL sorts names and general terms into different syntactic castes. What does that mean?",
              choices: [
                "Names occupy subject positions and can never be predicated; general terms are predicates and can never name — so 'some philosopher is Socrates' needs the identity predicate: ∃x(Px ∧ x = s)",
                "Predicates may bind variables and names may not",
                "Names have truth values and predicates do not",
                "There is no such division — MPL, like TFL, has a single category of term"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The predicate way is built on the split: atomic statements predicate general terms of named individuals, never the reverse. TFL's single term category let 'Socrates' sit in predicate position and got the laws of identity for free (The Full Language, Lesson 7)."
            },
            {
              promptHtml: mcPrompt("Bound or free?", "∃y(Lxy ∧ Py)"),
              choices: [
                "y is bound, x is free — the formula is an open sentence",
                "Both are bound — ∃y binds every variable in its scope",
                "Both are free — ∃ binds only its first occurrence",
                "x is bound automatically, y is free"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "∃y binds exactly the y's in its scope. Nothing binds x — it is a pronoun with no antecedent, so the formula has no truth value until x is bound by a quantifier or replaced by a name."
            },
            {
              prompt: "Why do MPL's universal forms take → while its particular forms take ∧?",
              choices: [
                "A historical accident; either connective works with either quantifier",
                "Because the quantifiers alone cannot carry the subject–predicate tie: 'every S is P' must become 'everything is P-if-S,' and 'some S is P' must become 'something is S-and-P' — one categorical form, split across two connectives",
                "Because → is logically stronger than ∧",
                "To ensure that A entails I"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "∀ and ∃ speak only of 'everything' and 'something'; the restriction to S must be smuggled in through a connective, and each quantity needs a different one — cross them and you say far too much or almost nothing. TFL's functors carry quantity and the tie together: −S+P, +S+P."
            },
            {
              promptHtml: mcPrompt("Compare:", "∀x∃y Lxy &nbsp;and&nbsp; ∃y∀x Lxy"),
              choices: [
                "Equivalent — quantifier order never affects meaning",
                "The first entails the second — each beloved must be the same",
                "The second entails the first: one y loved by all supplies each x with a beloved; the converse fails",
                "They are contradictories"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "'Someone is loved by everyone' gives every x the same y, so everyone loves someone. But 'everyone loves someone' lets each x pick a different y — no common favorite follows. Order is meaning; TFL marked the same distinction with sign placement inside the relational complex."
            },
            {
              prompt: "Which describes MPL's architecture?",
              choices: [
                "Statement logic is the ground floor, and the quantifier–variable apparatus is erected on top — the exact inversion of TFL, where statement logic is a derived branch of the term algebra",
                "Quantifiers are basic, and the truth-functional connectives are derived from them",
                "MPL derives its connectives from the syllogistic",
                "MPL is unstructured — connectives and quantifiers are mutually independent primitives"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Lesson 3 from the other side: the moderns build upward from the propositional calculus; Sommers grows statement logic out of the term algebra as the singleton-universe case. Two towers, same stone — and next lesson builds the bridge between them."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 5: Translating Between TFL and MPL
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-05",
      title: "Lesson 5: Translating Between TFL and MPL",
      navTitle: "The Bridge",
      description: "Build the bridge: systematic procedures for carrying any statement between TFL's signed terms and MPL's quantified formulas — categoricals, compounds, singulars, and the relational cases where the two notations mark scope in different places.",
      completionText: "The bridge stands, and traffic runs both ways: subject signs become quantifiers, quantities pick their connectives, starred singulars become names, and left-to-right sign order becomes left-to-right quantifier order. Both directions preserve validity — TFL and MPL are two notations for one logic across everything this course has treated. One lesson remains: stepping back from the bridge to survey both banks — what each notation says easily, what it says awkwardly, and what, if anything, lies beyond TFL's reach.",
      blocks: [

        // ── Concept: The Dictionary ───────────────────────────────────────────
        {
          type: "concept",
          id: "translation-dictionary",
          title: "1. The Dictionary",
          content: `
            <p>Everything this course has built now assembles into a two-column dictionary.
            The four categorical forms, the singular form, and the statement compounds all
            have entries on both sides:</p>

            <div class="syntax-box">
              <table>
                <tr><td>every S is P</td><td><code>−S+P</code></td><td><code>∀x(Sx → Px)</code></td></tr>
                <tr><td>no S is P</td><td><code>−S−P</code></td><td><code>∀x(Sx → ¬Px)</code></td></tr>
                <tr><td>some S is P</td><td><code>+S+P</code></td><td><code>∃x(Sx ∧ Px)</code></td></tr>
                <tr><td>some S isn't P</td><td><code>+S−P</code></td><td><code>∃x(Sx ∧ ¬Px)</code></td></tr>
                <tr><td>Socrates is P</td><td><code>±s*+P</code></td><td><code>Ps</code></td></tr>
              </table>
            </div>

            <div class="grammar-rule">
              <span class="g-label">TFL → MPL, in Four Moves</span>
              1. The <strong>subject sign</strong> picks the quantifier: − becomes ∀,
              + becomes ∃.&ensp;
              2. The quantity picks the connective: ∀ pairs with →, ∃ with ∧ — Lesson 4's
              asymmetry, now working for you.&ensp;
              3. A negative <strong>predicate quality</strong> becomes ¬.&ensp;
              4. Starred singular terms become <strong>names</strong> — no quantifier at all.
            </div>

            <p>What about structure <em>inside</em> a term? TFL's term operations translate
            into MPL's connectives applied to open sentences:</p>

            <div class="ex-table">
              <div class="ex-row"><code>(−T)</code><span>the negative term ↔ <code>¬Tx</code></span></div>
              <div class="ex-row"><code>+A+B</code><span>the compound term ↔ <code>Ax ∧ Bx</code></span></div>
            </div>

            <p>So "every white horse is gentle," with its compound subject, crosses the bridge
            in one pass: <code>−(+White+Horse)+Gentle</code> becomes
            <code>∀x((Wx ∧ Hx) → Gx)</code> — the subject's minus chose ∀, the ∀ chose →, and
            the compound term unpacked into a conjunction of open sentences.</p>

            <p>Statement compounds need no new entries at all: Lesson 4's connective table
            (<code>−p+q</code> ↔ <code>p → q</code> and the rest) already runs in both
            directions.</p>
          `
        },

        // ── Concept: Reading Back ─────────────────────────────────────────────
        {
          type: "concept",
          id: "reading-back",
          title: "2. Reading Back: Drive the Negation In",
          content: `
            <p>MPL → TFL is pattern-matching in reverse: <code>∀…(… → …)</code> is a
            universal, <code>∃…(… ∧ …)</code> is a particular, a <code>¬</code> on the
            consequent or right conjunct is negative quality. But MPL formulas do not always
            arrive in one of the four shapes — most often a negation sits out front. Two laws
            drive it inward:</p>

            <div class="ex-table">
              <div class="ex-row"><code>¬∀x φ &nbsp;↔&nbsp; ∃x ¬φ</code><span>"not everything is thus" = "something is not thus"</span></div>
              <div class="ex-row"><code>¬∃x φ &nbsp;↔&nbsp; ∀x ¬φ</code><span>"nothing is thus" = "everything is not thus"</span></div>
            </div>

            <p>Watch them work on "not every senator is a politician":</p>

            <div class="step-trace">
              <div class="step"><code>¬∀x(Sx → Px)</code><span class="step-note">the denied A-form</span></div>
              <div class="step step-reduce"><code>∃x ¬(Sx → Px)</code><span class="step-note">negation through the quantifier</span></div>
              <div class="step step-reduce"><code>∃x(Sx ∧ ¬Px)</code><span class="step-note">a conditional fails only one way: antecedent true, consequent false</span></div>
              <div class="step step-reduce"><code>+S−P</code><span class="step-note">the O-form — read off the dictionary</span></div>
            </div>

            <p>Three MPL steps — and now recall how TFL performs the same computation. The
            contradictory of <code>−S+P</code> is: flip both leading signs. <code>+S−P</code>.
            One move.</p>

            <div class="grammar-rule">
              <span class="g-label">The Flip, Exported</span>
              MPL's quantifier-negation laws plus its negated-connective rewrites compute
              exactly what TFL's flip-both-leading-signs rule computes. The bridge doesn't
              just carry statements across — it shows the same inference wearing different
              costs on each side.
            </div>
          `
        },

        // ── Exercise: The Dictionary ─────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-dictionary",
          title: "Quick Check: The Dictionary",
          instruction: "Translate in both directions, using the four moves and the negation laws.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Translate to MPL:", "−(+White+Horse)+Gentle"),
              choices: [
                "∀x((Wx ∧ Hx) ∧ Gx)",
                "∀x((Wx ∧ Hx) → Gx)",
                "∃x((Wx ∧ Hx) → Gx)",
                "∀x(Wx → (Hx ∧ Gx))"
              ],
              answer: 1,
              explanation: "Subject sign − picks ∀, so the connective is →; the compound subject term +White+Horse unpacks to Wx ∧ Hx as the antecedent. The first choice claims everything is a gentle white horse; the third is Lesson 4's too-weak trap; the last makes 'white' the subject and 'gentle horse' the predicate."
            },
            {
              promptHtml: mcPrompt("Translate to TFL:", "∃x(Px ∧ ¬Wx)"),
              choices: [
                "+P−W — some P isn't W: the O-form",
                "−P+W — every P is W",
                "+P+W — some P is W",
                "−P−W — no P is W"
              ],
              answer: 0,
              explanation: "∃ with ∧ is a particular; the ¬ on the right conjunct is negative quality. Particular quantity (+ subject), negative quality (− predicate): +P−W."
            },
            {
              prompt: "MPL computes the contradictory of an A-form in three steps: negation through the quantifier, then the negated-conditional rewrite, then read off the form. TFL's equivalent is:",
              choices: [
                "Obverting the predicate term",
                "Contraposing the conditional",
                "Flipping both leading signs — one move",
                "Running the tree method on the counterclaim"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "The contradictory of −S+P is +S−P: flip the two leading signs. What MPL spreads across quantifier-negation laws and connective rewrites, the sign algebra does in a single stroke — the same computation, priced differently."
            },
            {
              promptHtml: mcPrompt("Translate to MPL:", "±John*+(Lov±Mary*)"),
              choices: [
                "∃x(Jx ∧ Lxm)",
                "Lmj",
                "∀x(Jx → Lxm)",
                "Ljm"
              ],
              answer: 3,
              explanation: "Both participants are starred singulars, so both become names — no quantifiers at all: Ljm, an atomic formula. Argument order encodes the roles: Lmj would say Mary loves John. TFL's wild quantity simply vanishes into the constants."
            }
          ]
        },

        // ── Concept: Relationals Across the Bridge ────────────────────────────
        {
          type: "concept",
          id: "relationals-bridge",
          title: "3. Relationals Across the Bridge",
          content: `
            <p>Relational statements are where the two notations divide the labor most
            differently — and where the translation rule is most illuminating:</p>

            <div class="grammar-rule">
              <span class="g-label">The Relational Rule</span>
              Take the signed terms <strong>left to right</strong>; each general term
              contributes its quantifier (by its sign) and its connective (by its quantity),
              nested in that order. The relation becomes a many-place predicate whose
              <strong>variable order records the roles</strong>.
            </div>

            <p>Watch it on the pair Course 2 used to warn about scope:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Man+(Lov+Woman)</code><span>every man loves some woman ↔ <code>∀x(Mx → ∃y(Wy ∧ Lxy))</code></span></div>
              <div class="ex-row"><code>+Woman+(Lov−Man)</code><span>some woman is loved by every man ↔ <code>∃y(Wy ∧ ∀x(Mx → Lxy))</code></span></div>
            </div>

            <p>Course 2's passive-transformation lesson warned that this pair says different
            things — each man may love a different woman in the first, one woman collects all
            the love in the second — and flagged it with sign positions. On the MPL side the
            difference is Lesson 4's quantifier order, visible at a glance: <code>∀∃</code>
            against <code>∃∀</code>. The bridge pays in both directions: MPL makes TFL's scope
            warnings syntactically loud, and TFL packs MPL's nested formulas into three signed
            symbols.</p>

            <p>A full worked crossing — "some boy envies every astronaut":</p>

            <div class="step-trace">
              <div class="step"><code>+Boy+(Env−Astronaut)</code><span class="step-note">TFL: signs in place</span></div>
              <div class="step step-reduce"><code>∃x(Bx ∧ …)</code><span class="step-note">first signed term: + picks ∃, ∃ picks ∧</span></div>
              <div class="step step-reduce"><code>∃x(Bx ∧ ∀y(Ay → …))</code><span class="step-note">second signed term: − picks ∀, ∀ picks →</span></div>
              <div class="step step-reduce"><code>∃x(Bx ∧ ∀y(Ay → Exy))</code><span class="step-note">the relation, variables in role order</span></div>
            </div>

            <p>And the singular relational case runs the other way in difficulty:
            <code>±John*+(Lov±Mary*)</code> — TFL's most decorated-looking form — crosses to
            <code>Ljm</code>, MPL's simplest. Names need no quantifiers; wild quantity was
            precisely the mark of a term that never needed one.</p>
          `
        },

        // ── Concept: One Logic, Two Notations ────────────────────────────────
        {
          type: "concept",
          id: "one-logic",
          title: "4. One Logic, Two Notations",
          content: `
            <p>One more correspondence completes the picture. When Course 3 needed to track an
            individual through an indirect proof, it introduced <strong>proterms</strong> —
            pronouns with fixed reference and wild quantity, deployed only when an argument
            demanded them. MPL's bound variables are the same device made compulsory: every
            general statement carries its pronouns, whether or not any inference will use
            them. Course 3 said it already: distributed proterms are TFL's answer to MPL's
            instantiation rules.</p>

            <p>Now the payoff of having a systematic bridge. Translate an argument premise by
            premise, conclusion included, and <strong>validity survives the crossing — in both
            directions</strong>. A cancellation proof on the TFL side certifies the MPL
            argument; a quantifier derivation on the MPL side certifies the TFL one. Across
            everything this course has treated, the two systems disagree on no verdict:</p>

            <div class="grammar-rule">
              <span class="g-label">One Logic</span>
              TFL and MPL are not rival logics but two notations for one logic. What differs
              is where each marks the logical work — and what each charges for it.
            </div>

            <div class="ex-table">
              <div class="ex-row"><code>quantity</code><span>TFL: a sign on the term · MPL: a quantifier prefix</span></div>
              <div class="ex-row"><code>scope</code><span>TFL: left-to-right sign order · MPL: left-to-right quantifier order</span></div>
              <div class="ex-row"><code>pronouns</code><span>TFL: proterms, on demand · MPL: bound variables, mandatory</span></div>
              <div class="ex-row"><code>inference</code><span>TFL: algebraic cancellation · MPL: instantiation and generalization rules</span></div>
            </div>

            <p>What translation cannot settle is the question behind the whole comparison: is
            there anything one notation says that the other cannot? And which handles its own
            territory more powerfully — the algebra that cancels, or the calculus that
            instantiates? That reckoning — the limits and the power of TFL — is the final
            lesson.</p>
          `
        },

        // ── Exercise: Relationals Across the Bridge ──────────────────────────
        {
          type: "exercise",
          id: "ex-relational-bridge",
          title: "Quick Check: Relationals Across the Bridge",
          instruction: "Left-to-right signs become left-to-right quantifiers. Translate carefully.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Translate to MPL:", "−Man+(Lov+Woman)"),
              choices: [
                "∃y(Wy ∧ ∀x(Mx → Lxy))",
                "∀x(Mx ∧ ∃y(Wy → Lxy))",
                "∀x(Mx → ∃y(Wy ∧ Lxy))",
                "∀x∀y((Mx ∧ Wy) → Lxy)"
              ],
              answer: 2,
              explanation: "Left to right: −Man gives ∀x(Mx → …), +Woman gives ∃y(Wy ∧ …), and Lxy records who loves whom. The first choice reverses the scope; the second crosses the connectives; the last says every man loves every woman."
            },
            {
              promptHtml: mcPrompt("Translate to TFL:", "∃y(Wy ∧ ∀x(Mx → Lxy))"),
              choices: [
                "−Man+(Lov+Woman) — every man loves some woman",
                "+Woman+(Lov−Man) — some woman is loved by every man",
                "+Woman+(Lov+Man) — some woman is loved by some man",
                "−Woman+(Lov−Man) — every woman is loved by every man"
              ],
              answer: 1,
              explanation: "The outer ∃ over women comes first, so Woman leads with +; the inner ∀ over men puts −Man in object position. Quantifier order and sign order tell the same left-to-right story: one woman, loved by all."
            },
            {
              promptHtml: "Are " + mcPrompt("", "∀x(Mx → ∃y(Wy ∧ Lxy))") + " and " + mcPrompt("", "∃y(Wy ∧ ∀x(Mx → Lxy))") + " equivalent?",
              choices: [
                "No — the second entails the first, not conversely: Course 2's passive-transformation warning, now visible as quantifier order",
                "Yes — commuting a relational term never changes meaning",
                "No — they are contradictories",
                "Yes — both reduce to the same DNF"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "One woman loved by every man gives each man a beloved; each man loving his own woman crowns no common favorite. TFL marked the difference with sign positions, MPL with ∀∃ versus ∃∀ — same distinction, different notation."
            },
            {
              promptHtml: mcPrompt("Translate:", "some boy envies every astronaut"),
              choices: [
                "∃x(Bx → ∀y(Ay ∧ Exy))",
                "∃x(Bx ∧ ∀y(Ay → Exy))",
                "∀y(Ay → ∃x(Bx ∧ Exy))",
                "∃x∃y(Bx ∧ Ay ∧ Exy)"
              ],
              answer: 1,
              explanation: "TFL first: +Boy+(Env−Astronaut). Then the rule: + picks ∃ with ∧, − picks ∀ with →, nested in order. The first choice crosses the connectives both ways; the third puts the astronauts in charge of scope ('every astronaut is envied by some boy'); the last says merely that some boy envies some astronaut."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-translation-final",
          isFinal: true,
          title: "Final Review: The Bridge",
          instruction: "The four moves, term operations, singulars, and what survives translation.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Translate to MPL:", "−S−P"),
              choices: [
                "∃x(Sx ∧ ¬Px)",
                "∀x(¬Sx → ¬Px)",
                "¬∀x(Sx → Px)",
                "∀x(Sx → ¬Px)"
              ],
              answer: 3,
              explanation: "The E-form: subject − picks ∀ (so →), predicate − becomes ¬. The first choice is the O-form; the second says every non-S is non-P; the third denies the A-form — which is O again, not E."
            },
            {
              prompt: "How do TFL's term operations translate into MPL?",
              choices: [
                "(−T) becomes ¬Tx, and the compound term +A+B becomes Ax ∧ Bx — connectives applied to open sentences",
                "(−T) becomes ∀x¬Tx, a quantified denial",
                "Term operations have no MPL counterpart",
                "+A+B becomes Ax → Bx"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Inside a term, TFL's minus is MPL's ¬ and TFL's conjunction is MPL's ∧ — applied to open sentences, not statements. That is how −(+White+Horse)+Gentle crosses in one pass to ∀x((Wx ∧ Hx) → Gx)."
            },
            {
              prompt: "TFL forms a contradictory by flipping both leading signs. The corresponding MPL computation is:",
              choices: [
                "Swapping ∀ and ∃ while keeping the connectives",
                "Driving ¬ through the quantifier (¬∀ = ∃¬), then rewriting the negated connective",
                "Adding ¬ to every predicate letter",
                "Reversing the order of the quantifiers"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "¬∀x(Sx → Px) becomes ∃x¬(Sx → Px), and the failed conditional becomes Sx ∧ ¬Px: quantifier flips, connective flips, quality flips — three rewrites for TFL's one stroke. Swapping quantifiers alone, without touching the connective, produces the too-strong and too-weak traps."
            },
            {
              prompt: "What happens to TFL's starred singular terms at the bridge?",
              choices: [
                "They become bound variables",
                "They become one-place predicates",
                "They become MPL names, and the wild ± vanishes — names take no quantifier, which is what wild quantity marked all along",
                "They cannot be translated without the identity predicate"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "±John*+(Lov±Mary*) crosses to the atomic Ljm. A term with wild quantity is one whose all/some distinction carries no information — exactly the terms MPL exempts from quantifiers by making them constants."
            },
            {
              prompt: "What does the translation bridge establish about TFL and MPL?",
              choices: [
                "They are two notations for one logic: validity survives translation in both directions, and the systems differ in where they mark quantity, scope, and pronouns — not in their verdicts",
                "TFL is a fragment of MPL that omits relations",
                "MPL is inconsistent where TFL is not",
                "The two systems agree on universal statements but disagree on particulars"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Premise-by-premise translation preserves validity both ways across everything this course has treated: categoricals, compounds, singulars, relationals. Signs versus quantifiers, sign order versus quantifier order, proterms versus variables — different bookkeeping, one logic. Whether either notation out-reaches the other is the final lesson's question."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 6: Numerical Quantifiers — Most, Many, and Few
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-06-numerical",
      title: "Lesson 6: Numerical Quantifiers — Most, Many, and Few",
      navTitle: "Numerical Quantifiers",
      description: "Extend the sign algebra past 'all' and 'some' to the intermediate quantifiers of ordinary speech — most, many, few — with Peterson and Thompson's SYLL⁺ recast as TFL⁺: quantity levels on the subject and one extra condition on the decision method.",
      completionText: "You can now reason with the quantifiers ordinary speech actually uses. Most, many, and few become quantity levels 1–3 on a particular subject, and the plus-minus method gains a single new clause: a conclusion can be no stronger than its strongest premise. The same cancellation that drove Barbara now drives 'most voters are citizens, no fool is a citizen, so many voters are not fools' — and refuses 'most men are fascists' when only 'many' was given. What still lies beyond is exact and comparative counting — at least two, exactly three, more S than P — the province of Murphree's numerical term logic. With most/many/few in hand, the next and final lesson can weigh what term logic truly can and cannot do.",
      blocks: [

        // ── Concept: Beyond Some and Every ────────────────────────────────────
        {
          type: "concept",
          id: "beyond-some-every",
          title: "1. Beyond Some and Every",
          content: `
            <p>The syllogistic you have built has exactly two quantities: <strong>universal</strong>
            (<em>every</em>, <em>no</em> — a minus subject) and <strong>particular</strong>
            (<em>some</em> — a plus subject). But ordinary reasoning lives in between:</p>

            <div class="ex-table">
              <div class="ex-row"><code>most</code><span>"Most voters are citizens" — more than half, but not necessarily all</span></div>
              <div class="ex-row"><code>many</code><span>"Many men are cops" — a common share, weaker than "most"</span></div>
              <div class="ex-row"><code>few</code><span>"Few cars are hybrid" — nearly none, the strong end next to "no"</span></div>
            </div>

            <p>These are the <strong>intermediate quantifiers</strong>. Peterson (1979) and
            Thompson (1982) extended the syllogistic to cover them — the system
            <strong>SYLL⁺</strong> — and showed the classical results survive: "most voters are
            citizens; no fool is a citizen" still yields "many voters are not fools," by the same
            middle-term reasoning as Barbara.</p>

            <p>Ranked by strength, the affirmative quantities form a ladder — each rung entails the
            one below it, never the reverse:</p>

            <div class="syntax-box">every  ⊃  most  ⊃  many  ⊃  some</div>

            <p>If <em>every</em> S is P then certainly <em>most</em> are, and if <em>most</em> then
            <em>many</em>, and if <em>many</em> then at least <em>some</em>. "Few" is the mirror
            image at the negative end, sitting just inside "no." The task of this lesson is to give
            this ladder an algebra — to make "most" and "many" compute the way "+" and "−" already
            do.</p>
          `
        },

        // ── Exercise: the ladder ──────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-num-ladder",
          title: "Quick Check: The Quantity Ladder",
          instruction: "One question on how the intermediate quantities relate.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "\"Most students passed.\" Which of these follows with certainty?",
              choices: [
                "Many students passed",
                "Every student passed",
                "Exactly half the students passed",
                "Few students passed"
              ],
              answer: 0,
              explanation: "Most ⊃ many ⊃ some: 'most' guarantees the weaker 'many' (and 'some'), but never the stronger 'every,' nor an exact count, nor 'few' (its opposite end)."
            }
          ]
        },

        // ── Concept: Quantity Levels ──────────────────────────────────────────
        {
          type: "concept",
          id: "quantity-levels",
          title: "2. Quantity Levels",
          content: `
            <p>TFL⁺ (Castro-Manzano, Lozano-Cobos &amp; Reyes-Cárdenas 2018) keeps the whole
            plus-minus notation and adds one thing: a <strong>quantity level</strong>, a small
            digit on the <em>particular</em> subject that says <em>how</em> particular. The level
            rides as a superscript (or, in plain text, after a caret <code>^</code>):</p>

            <div class="ex-table">
              <div class="ex-row"><code>+S⁰+P</code><span>level 0 — <strong>some</strong> S are P (the ordinary particular)</span></div>
              <div class="ex-row"><code>+S¹+P</code><span>level 1 — <strong>many</strong> S are P</span></div>
              <div class="ex-row"><code>+S²+P</code><span>level 2 — <strong>most</strong> S are P</span></div>
              <div class="ex-row"><code>+S³−P</code><span>level 3 — <strong>few</strong> S are P (the strong, near-negative end)</span></div>
            </div>

            <p>Two things stay fixed. The <strong>predicate sign</strong> is still quality —
            <code>+P</code> for "are P," <code>−P</code> for "are not P" — so "most students are not
            athletes" is <code>+S²−A</code>. And <strong>universals never carry a level</strong>:
            "every" and "no" are already the top of the ladder, so <code>−S+P</code> and
            <code>−S−P</code> stay level 0. A level only ever decorates a plus subject.</p>

            <div class="syntax-box">Most voters are citizens  =  +V²+C  =  +V^2+C</div>

            <p>Level 0 is exactly the classical <em>some</em>, and the printer hides it — so every
            proposition you have written so far is already a level-0 TFL⁺ proposition. Nothing about
            the old notation changes; the intermediate quantifiers simply fill in the rungs between
            <em>some</em> (0) and <em>every</em> (the universal minus).</p>
          `
        },

        // ── Exercise: representation ──────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-num-represent",
          title: "Quick Check: Writing the Levels",
          instruction: "Transcribe the intermediate quantifiers into TFL⁺.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Transcribe:", "Most men are cops"),
              choices: ["+Men² + Cop", "−Men² + Cop", "+Men¹ + Cop", "+Men² − Cop"],
              choicesAreCode: true,
              answer: 0,
              explanation: "Particular (a level rides only on a plus subject), 'most' = level 2, affirmed = +Cop. So +Men²+Cop."
            },
            {
              promptHtml: mcPrompt("Transcribe:", "Many voters are not fools"),
              choices: ["+Voter¹ − Fool", "+Voter² − Fool", "−Voter¹ − Fool", "+Voter¹ + Fool"],
              choicesAreCode: true,
              answer: 0,
              explanation: "'Many' = level 1; 'are not' is negative quality → −Fool. So +Voter¹−Fool."
            }
          ]
        },

        // ── Concept: The Third Condition ──────────────────────────────────────
        {
          type: "concept",
          id: "third-condition",
          title: "3. The Third Condition",
          content: `
            <p>Recall the plus-minus test for a classical syllogism: a conclusion follows iff
            <strong>(i)</strong> the premises sum algebraically to the conclusion (the middle term
            cancels), and <strong>(ii)</strong> the number of particular premises equals the number
            of particular conclusions. TFL⁺ adds exactly one clause for the levels:</p>

            <div class="grammar-rule">
              <span class="g-label">The TFL⁺ Decision Method</span>
              A conclusion follows iff (i) the premises sum to the conclusion, (ii) the particular
              counts match, and <strong>(iii) the conclusion is no stronger than the premise that
              quantifies its subject</strong> — an intermediate quantity is carried only by the term
              it quantifies, so a conclusion about <em>S</em> can be "most" only if a premise says
              "most <em>S</em>…"; otherwise it is capped at "some."
            </div>

            <p>Condition (iii) is the algebra of the ladder. The signs still do all the work of (i)
            and (ii); the level only says how strong the conclusion's own quantity may be, and it
            inherits that strength from the premise about the very same term. Take the flagship
            case:</p>

            ${engSyl("No fool is a citizen.", "Most voters are citizens.", "Many voters are not fools.")}

            ${syl([["−F−C", "no fool is a citizen"], ["+V²+C", "most voters are citizens"]], ["+V¹−F", "many voters are not fools"])}

            <p><strong>(i)</strong> Sum: <code>−F−C</code> plus <code>+V²+C</code>; the <code>+C</code>
            and <code>−C</code> cancel, leaving <code>+V−F</code> — the conclusion.
            <strong>(ii)</strong> One particular premise (<code>+V²</code>), one particular
            conclusion (<code>+V¹</code>) ✓. <strong>(iii)</strong> The conclusion is "many voters"
            (level 1); its subject, <em>voters</em>, is quantified by the premise "most voters are
            citizens" (level 2); 1 ≤ 2 ✓. All three hold — valid.</p>

            <p>Notice condition (iii) let the conclusion come out <em>weaker</em> than the premise:
            "most" in, "many" out. That is always safe. Run it in the lab and read the checklist:</p>

            <div class="syntax-box stacked">−F−C
+V²+C
+V¹−F</div>
          `
        },

        // ── Exercise: valid numerical syllogisms ──────────────────────────────
        {
          type: "exercise",
          id: "ex-num-valid",
          title: "Quick Check: Does It Follow?",
          instruction: "Apply the three conditions. Each conclusion is at or below its premises' strength.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl([["+C³−H", "few cars are hybrid"], ["−C+E", "all cars are expensive"]], ["+E−H", "some expensive things are not hybrid"]),
              answer: "valid",
              explanation: "Sum: +C³−H plus −C+E — the ±C cancels, leaving +E−H ✓. One particular premise, one particular conclusion ✓. Level: conclusion 'some' (0) ≤ premise 'few' (3) ✓. A far weaker conclusion than the premise, which is always safe. Valid."
            },
            {
              exprHtml: syl([["+A²+B", "most A are B"], ["−B+C", "all B are C"]], ["+A²+C", "most A are C"]),
              answer: "valid",
              explanation: "Sum: +A+B plus −B+C → +A+C ✓. Particular counts match ✓. Level: conclusion 'most' (2) ≤ premise 'most' (2) ✓. The conclusion is exactly as strong as the strongest premise — the ceiling, but not over it. Valid."
            }
          ]
        },

        // ── Concept: You Can't Conclude More Than You Know ────────────────────
        {
          type: "concept",
          id: "no-free-strength",
          title: "4. You Can't Conclude More Than You Know",
          content: `
            <p>Condition (iii) earns its keep only when it <em>fails</em> — when the signs would
            license a conclusion but its quantity is too strong for the premises. The classic case:</p>

            ${engSyl("All cops are fascists.", "Many men are cops.", "Most men are fascists.")}

            ${syl([["−C+F", "all cops are fascists"], ["+M¹+C", "many men are cops"]], ["+M²+F", "most men are fascists"])}

            <p>Check the first two conditions and it looks airtight. <strong>(i)</strong> Sum:
            <code>−C+F</code> plus <code>+M+C</code>; the <code>±C</code> cancels, leaving
            <code>+M+F</code> — the conclusion's signs exactly. <strong>(ii)</strong> One particular
            premise, one particular conclusion ✓. But <strong>(iii)</strong> fails: the conclusion
            claims "<strong>most</strong> men" (level 2), yet the premise about <em>men</em> is only
            "<strong>many</strong> men are cops" (level 1). You cannot squeeze <em>most</em> men out
            of a premise that gave you only <em>many</em>. Invalid.</p>

            <p>And the strength must ride the <em>right</em> term. "Most bakers are honest" would not
            license "most honest people are artisans," however the signs fall — because the "most"
            is about bakers, not about honest people. An intermediate quantity is conserved on the
            term it quantifies, never transferred and never manufactured. Weaken "most" to "many"
            here and the same argument goes through. Try both in the lab — the checklist marks the
            failed condition:</p>

            <div class="syntax-box stacked">−C+F
+M¹+C
+M²+F</div>

            <p>The lab reads this as an argument (the last line is the conclusion), routes it to the
            TFL⁺ decision method, and shows all three conditions — the third with a red ✗. Change the
            conclusion to <code>+M¹+F</code> ("many men are fascists") and it turns green.</p>
          `
        },

        // ── Concept: The Frontier — Exact Counts ──────────────────────────────
        {
          type: "concept",
          id: "numerical-frontier",
          title: "5. The Frontier: Exact and Comparative Counts",
          content: `
            <p>Most, many, and few now compute — but they are still <em>proportional</em>
            quantifiers, about shares of a class. Ordinary speech also counts exactly and compares:</p>

            <div class="ex-table">
              <div class="ex-row"><code>exactly</code><span>"Exactly three students passed"</span></div>
              <div class="ex-row"><code>at least</code><span>"At least two witnesses agree"</span></div>
              <div class="ex-row"><code>more … than</code><span>"More senators than governors attended"</span></div>
            </div>

            <p>These lie beyond SYLL⁺. Extending term logic to them is the work of Murphree's
            <strong>Numerical Term Logic</strong> (1998), which adds genuine numerical functors —
            subscripted quantities that count individuals rather than rank proportions — and their
            own inference rules. That is the honest present frontier of the algebra: proportional
            quantity (this lesson) is in hand; exact and comparative quantity is charted but sits
            past this curriculum.</p>

            <p>Even so, the lesson to carry forward is how <em>little</em> had to change. The whole
            apparatus of intermediate quantifiers rode on one new field — a level on the subject —
            and one new clause in a decision method you already knew. The middle term still cancels;
            the particular counts still match. Sommers' plus-minus algebra absorbed "most" and "many"
            the way it absorbed relations, singulars, and statements: by extending the same engine,
            not replacing it.</p>
          `
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-num-final",
          isFinal: true,
          title: "Final Review: Judge the Numerical Syllogisms",
          instruction: "For each, run the three conditions — sum, particular counts, and level (conclusion no stronger than its strongest premise).",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl([["−C−F", "no citizen is a fool"], ["+V²+C", "most voters are citizens"]], ["+V²−F", "most voters are not fools"]),
              answer: "valid",
              explanation: "Sum: −C−F plus +V²+C → the ±C cancels → +V−F ✓. Particular counts match ✓. Level: conclusion 'most' (2) ≤ premise 'most' (2) ✓. Valid."
            },
            {
              exprHtml: syl([["−M+P", "all M are P"], ["+S¹+M", "many S are M"]], ["+S²+P", "most S are P"]),
              answer: "invalid",
              explanation: "Signs cancel to +S+P and the particular counts match, but the conclusion is 'most' (level 2) while the strongest premise is only 'many' (level 1). Condition (iii) fails — you cannot conclude more than the premises give. 'Many S are P' would be valid."
            },
            {
              exprHtml: syl([["−B+A", "all bakers are artisans"], ["+B²+H", "most bakers are honest"]], ["+H²+A", "most honest people are artisans"]),
              answer: "invalid",
              explanation: "The signs do cancel (B is the middle term) and the particular counts match — but condition (iii) fails. The conclusion claims 'most honest people,' yet the 'most' in the premises is about bakers, not honest people. An intermediate quantity rides only its own term, so nothing here supports more than 'some honest people are artisans.' Invalid."
            }
          ]
        }
      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 7: The Limits and Power of TFL
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-06",
      title: "Lesson 7: The Limits and Power of TFL",
      navTitle: "Limits & Power",
      description: "The final reckoning: audit the century-old indictment of term logic against everything this curriculum has built, concede the limits that are real, and weigh Sommers' wager — that the logic of natural language is a logic of terms.",
      completionText: "Course complete — and with it, the whole Term Functor Logic curriculum: four courses, from the first plus-minus transcription through most/many/few, the MPL bridge, and this final reckoning. The audit came out as Sommers wagered: every inference the moderns called impossible for term logic fell to the same sign algebra — relations, singulars, identity, statement logic, the intermediate quantifiers — while MPL's genuine advantages lie in exact counting and infrastructure, not verdicts. You leave with two fluent notations and one logic. If the algebra has won you over, the source is Sommers & Englebretsen's An Invitation to Formal Reasoning; the frontier beyond it is real — Murphree's numerical functors for exact and comparative counting, metatheory, and the standing wager that natural reasoning is term reasoning.",
      blocks: [

        // ── Concept: The Case Against Term Logic ──────────────────────────────
        {
          type: "concept",
          id: "case-against",
          title: "1. The Case Against Term Logic",
          content: `
            <p>Kant judged that logic, since Aristotle, "has not had to retrace a single step"
            — and seemed complete. A century later Frege's <em>Begriffsschrift</em> (1879)
            rebuilt logic on the predicate way, and the modern verdict inverted: the
            syllogistic was not finished but <em>finished off</em> — a quaint fragment,
            incapable of serious work. The indictment has standard counts:</p>

            <div class="ex-table">
              <div class="ex-row"><code>relations</code><span>term logic cannot reason about loves, heads, betweenness — De Morgan's horse's head as the emblem</span></div>
              <div class="ex-row"><code>statements</code><span>it has no account of and, or, if — no propositional logic</span></div>
              <div class="ex-row"><code>singulars</code><span>proper names fit the subject–predicate mold awkwardly, if at all</span></div>
              <div class="ex-row"><code>pronouns</code><span>no variables, so no way to track an individual through a multi-step inference</span></div>
              <div class="ex-row"><code>identity</code><span>no theory of "Twain is Clemens" and the substitution it licenses</span></div>
            </div>

            <p>On this story, MPL was not an alternative notation but a rescue: logic could not
            do its job until terms were split into names and predicates and quantity was handed
            to variable-binding operators.</p>

            <p>You are now in a rare position for a modern student of logic: you have worked
            both systems from the ground up. This last lesson is the audit — which counts of
            the indictment failed, which have something to them, and what the algebra's own
            positive case amounts to.</p>
          `
        },

        // ── Concept: The Charges, Answered ───────────────────────────────────
        {
          type: "concept",
          id: "charges-answered",
          title: "2. The Charges, Answered",
          content: `
            <p>Take the counts in order, each with the lesson where it fell:</p>

            <div class="ex-table">
              <div class="ex-row"><code>relations</code><span>English normal form <code>±S±(R±O)</code> — signs inside the complex (The Full Language L2–L3); the dictum reaching into complexes (Course 3)</span></div>
              <div class="ex-row"><code>statements</code><span>this course: the trichotomy, direct proofs, trees, DNF — and the subsumption: statement logic is a <em>branch</em> of the syllogistic (L3)</span></div>
              <div class="ex-row"><code>singulars</code><span>wild quantity <code>±s*</code> (Introduction L7) — and at the bridge they are exactly MPL's names (L5)</span></div>
              <div class="ex-row"><code>pronouns</code><span>proterms with fixed reference and wild quantity (Course 3) — bound variables, on demand instead of mandatory</span></div>
              <div class="ex-row"><code>identity</code><span>monadic singular predication, with all four laws of identity as theorems (The Full Language L7)</span></div>
            </div>

            <p>And the emblem deserves its replay. De Morgan's horse's head — "beyond the
            syllogistic," the argument that supposedly forced modern logic into existence —
            fell in Course 3 to a one-step cancellation, once a free tautology supplied the
            host premise:</p>

            <div class="step-trace">
              <div class="step"><code>−(Head+Horse)+(Head+Horse)</code><span class="step-note">every head of a horse is a head of a horse — costs nothing</span></div>
              <div class="step"><code>−Horse+Animal</code><span class="step-note">the lone premise, a perfect donor</span></div>
              <div class="step step-reduce"><code>−(Head+Horse)+(Head+Animal)</code><span class="step-note">Horse cancels inside the complex: every head of a horse is a head of an animal ✓</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">The Verdict So Far</span>
              Every inference the indictment called impossible was performed inside the sign
              algebra — no variables, no quantifier rules, no new machinery. The prosecution's
              exhibits became the curriculum's exercises.
            </div>
          `
        },

        // ── Exercise: The Audit ───────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-audit",
          title: "Quick Check: The Audit",
          instruction: "Match each charge against term logic to how the algebra answered it.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "De Morgan's horse's head lacked a host premise. What supplied it?",
              choices: [
                "An MPL translation of the conclusion",
                "A tautology — 'every head of a horse is a head of a horse' — added at no cost, exposing +Horse for the donor to cancel",
                "The passive transformation",
                "A second empirical premise about horses"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Tautologies are true no matter what, so adding one costs nothing (Lesson 1's trichotomy, weaponized). −(Head+Horse)+(Head+Horse) hosts the donor −Horse+Animal, Horse cancels inside the complex, and the 'impossible' argument is a one-step syllogism."
            },
            {
              prompt: "How did TFL answer the charge that it has no propositional logic?",
              choices: [
                "By adopting MPL's connectives as new primitives",
                "By showing propositional logic is unnecessary",
                "By subsuming it: propositional terms in the singleton universe, with the trichotomy, proofs, trees, and DNF all running on the old rules — a branch of the syllogistic, not a rival",
                "By restricting itself to categorical statements"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "This course was the answer: transcribe the connectives (−p+q and company), let bare premises enter as +p+p, and every statement-logic method — the P/Z detector, cancellation proofs, trees, normal forms — is the term algebra at work in a one-member universe."
            },
            {
              prompt: "The singular-terms charge said proper names fit the subject–predicate mold awkwardly. TFL's answer:",
              choices: [
                "Wild quantity — a term denoting one individual makes all/some collapse, so it takes ± and slots into the ordinary forms; at the bridge these are exactly MPL's names",
                "Names are banned from subject position",
                "Names are treated as abbreviated descriptions",
                "Singular statements are left untranslatable"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "±Socrates*+Wise is an ordinary categorical with a wild subject sign (Introduction L7). Far from awkward, the treatment explains MPL's own design: names are precisely the terms whose quantifier would carry no information — so MPL omits it."
            },
            {
              prompt: "And the pronoun charge — no variables, no way to track an individual through a proof?",
              choices: [
                "Conceded — TFL cannot do multi-step relational proofs",
                "Answered by borrowing MPL's variables wholesale",
                "Answered by forbidding multiply general premises",
                "Answered by proterms: pronouns with fixed reference and wild quantity, deployed exactly when an argument needs them — MPL's variables, on demand instead of mandatory"
              ],
              choicesAreCode: false,
              answer: 3,
              explanation: "Course 3's indirect proofs pronominalized the particular premises and let distributed proterms do the work of instantiation rules. The device is the same as MPL's bound variables; the economy — used only when needed — is TFL's own."
            }
          ]
        },

        // ── Concept: Real Limits ──────────────────────────────────────────────
        {
          type: "concept",
          id: "real-limits",
          title: "3. Real Limits",
          content: `
            <p>An honest audit concedes what is genuinely on the other side. Two things
            are.</p>

            <p><strong>Exact and comparative counting.</strong> The intermediate quantifiers of the
            previous lesson — <em>most</em>, <em>many</em>, <em>few</em> — turned out to sit inside
            the algebra after all: a level on the subject and one clause on the decision method. But
            <em>counting</em> is a further step. "At least two students passed." MPL, with its
            identity predicate and distinguishable variables, says it directly:</p>

            <div class="syntax-box"><code>∃x∃y(x ≠ y ∧ Sx ∧ Px ∧ Sy ∧ Py)</code></div>

            <p>Two pronouns, certified distinct, each a passing student. TFL⁺ handles proportional
            quantity, but has no native functor for <em>at least two</em>, <em>exactly three</em>, or
            <em>more S than P</em>. Murphree's numerical term logic extends the algebra to these too,
            but they lie beyond this curriculum. On exact and comparative counting, MPL's
            variable-and-identity trick is a real, working advantage — and the honest present
            frontier of the term-logic programme.</p>

            <p><strong>Infrastructure.</strong> A century of mathematics has been built on
            MPL's syntax: model theory, Gödel's completeness theorem, computability, proof
            assistants, database theory. Its regimentation — scope worn openly as quantifier
            order, one rigid grammar — is exactly what machines and metatheorems want. TFL has
            soundness and completeness results of its own, but the ecosystem is a village
            beside a metropolis. If you are formalizing mathematics or writing a theorem
            prover this year, you will speak MPL.</p>

            <div class="grammar-rule">
              <span class="g-label">A Fair Scorecard</span>
              Across everything this curriculum treated — categoricals, relationals, singulars,
              identity, statement logic, and now the intermediate quantifiers — the two systems
              match verdict for verdict. Beyond it, MPL's exact-counting idioms and mature
              infrastructure are real advantages: answerable in principle by extensions, answered
              in practice only partly.
            </div>

            <p>Note what the concessions are <em>not</em>. Neither is a class of valid
            arguments TFL gets wrong; both are matters of vocabulary and tooling. The
            indictment claimed term logic <em>couldn't reason</em>. The truth is that it
            reasons perfectly and, at the edges, speaks a smaller language with fewer
            institutions behind it.</p>
          `
        },

        // ── Concept: The Power of TFL ─────────────────────────────────────────
        {
          type: "concept",
          id: "power-of-tfl",
          title: "4. The Power of TFL — and the Wager",
          content: `
            <p>Now the algebra's own case, assembled from four courses of evidence.</p>

            <p><strong>Naturalness.</strong> TFL transcribes English nearly word for word:
            quantity words become signs in place, and "every man loves some woman" keeps its
            shape as <code>−Man+(Lov+Woman)</code>. MPL must paraphrase — "take anything
            whatever: if it is a man, then there is something which is a woman and…" — through
            the caste system, the mandatory pronouns, and an asymmetry that burns every
            beginner. One notation follows the language; the other reforms it.</p>

            <p><strong>One engine.</strong> From Barbara in the Introduction to relational
            enthymemes, modus ponens, and this course's trees, a single principle — cancel
            the middle, with contraposition and simplification as escorts — powered every
            proof. Nothing was added for statements, relations, singulars, or identity;
            vocabulary grew and the engine never changed.</p>

            <p><strong>Architecture.</strong> The subsumption (Lesson 3): statement logic,
            modern logic's ground floor, is a branch of the syllogistic — the singleton-universe
            case. The term way does not sit beside the predicate way as an equal dialect; over
            their shared territory it <em>contains</em> the propositional calculus that MPL
            builds on.</p>

            <p>And behind the technical case, Sommers' <strong>wager</strong>: people do not
            reason in quantifier prefixes and bound variables — they reason in terms, the way
            children learn language and the way arguments actually run at a dinner table. If
            that is right, TFL is not a nostalgic reconstruction but a description of the
            logic we natively run, given algebraic teeth.</p>

            <div class="callout-note">
              <span class="cn-label">The Road Behind</span>
              Four courses: the sign algebra and the four forms; compound, relational, and
              identity statements with REGAL; the relational syllogistic with distribution and
              proterms; and statement logic through the trichotomy, proofs, trees, DNF, the
              subsumption, and the MPL bridge. Every tool earned inside the algebra, every
              rival exhibit answered on its own terms.
            </div>
          `
        },

        // ── Exercise: Limits and Power ───────────────────────────────────────
        {
          type: "exercise",
          id: "ex-limits-power",
          title: "Quick Check: Limits and Power",
          instruction: "The honest concessions — and the algebra's positive case.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Express in each system:", "at least two students passed"),
              choices: [
                "TFL: +S+P said twice; MPL: ∃x(Sx ∧ Px) said twice",
                "MPL: ∃x∃y(x ≠ y ∧ Sx ∧ Px ∧ Sy ∧ Py); core TFL: no functor for numerical quantity — extensions add one, beyond this course",
                "Both systems express it as a universal statement",
                "Neither system can express numerical quantity"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Repeating 'some student passed' never certifies two students — the same one may witness both. MPL's identity-and-variables idiom certifies distinctness directly; TFL's core signs stop at every/some. A genuine limit, honestly conceded."
            },
            {
              prompt: "What does MPL's rigid regimentation genuinely buy?",
              choices: [
                "Machine-friendliness and metatheory: scope worn openly as quantifier order, one grammar for provers and model theory — the infrastructure of modern mathematics",
                "Shorter formulas than TFL's",
                "Immunity to the vacuous-truth problem",
                "A guarantee that A entails I"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Regimentation is a cost to human readers (Lesson 4) and a gift to machines and metatheorems. Formulas get longer, not shorter; vacuous truth is MPL's own convention; and A-entails-I is exactly what MPL gave up."
            },
            {
              prompt: "TFL's naturalness claim is that:",
              choices: [
                "TFL formulas are always shorter",
                "TFL avoids all symbolic notation",
                "Transcription is nearly homophonic — quantity words become signs in place, so English keeps its shape — where MPL must paraphrase through castes, mandatory pronouns, and the connective asymmetry",
                "MPL cannot express what English says"
              ],
              choicesAreCode: false,
              answer: 2,
              explanation: "'Every man loves some woman' → −Man+(Lov+Woman): subject, relation, object, each with its sign, in English order. The claim is not that MPL lacks the content — Lesson 5's bridge carries it — but that one notation follows the language while the other reforms it."
            },
            {
              prompt: "The 'one engine' argument observes that:",
              choices: [
                "TFL needs a different rule set for each course",
                "A single principle — cancel the middle term, with contraposition and simplification — powered every proof from Barbara through relationals, modus ponens, and trees; new subject matter added vocabulary, never machinery",
                "Trees replaced cancellation in the final course",
                "The engine works only in the singleton universe"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Count the rules across four courses: DDO cancellation, contraposition, simplification — and every 'new' rule (ponens, tollens, disjunctive syllogism, tree closure) unmasked as one of them in different dress. That economy is the algebra's standing argument."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-whole-journey-final",
          isFinal: true,
          title: "Final Review: The Whole Journey",
          instruction: "Five questions spanning the full curriculum — the algebra, validity, the bridge, the subsumption, and the verdict.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("The contradictory of", "−S+P"),
              choices: [
                "−S−P — no S is P",
                "−P+S — every P is S",
                "+S−P — some S isn't P: flip both leading signs",
                "+(−S)+(−P)"
              ],
              answer: 2,
              explanation: "The rule from the Introduction that never changed: flip both leading signs. A's denial is O — the same computation MPL performs with quantifier-negation laws and a negated-conditional rewrite (Lesson 5)."
            },
            {
              prompt: "An argument is valid if and only if:",
              choices: [
                "Its counterclaim — premises plus denied conclusion — is a contradiction: exactly one particular conjunct (P) and an algebraic sum of zero (Z)",
                "Its premises are all true",
                "Its conclusion is a tautology",
                "Its tree has at least one open branch"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The Principle of Validity, from REGAL through the trichotomy: deduction is contradiction-detection. Open branches certify the opposite — a counterexample world. True premises and tautologous conclusions are neither necessary nor sufficient."
            },
            {
              promptHtml: mcPrompt("Across the bridge:", "−Man+(Lov+Woman)"),
              choices: [
                "∃y(Wy ∧ ∀x(Mx → Lxy))",
                "∀x∀y((Mx ∧ Wy) → Lxy)",
                "∀x(Mx ∧ ∃y(Wy → Lxy))",
                "∀x(Mx → ∃y(Wy ∧ Lxy))"
              ],
              answer: 3,
              explanation: "Left-to-right signs become left-to-right quantifiers: − picks ∀ with →, + picks ∃ with ∧, and Lxy records the roles. The first choice reverses scope (some woman loved by all); the others cross connectives or over-quantify."
            },
            {
              prompt: "The subsumption result says:",
              choices: [
                "TFL and MPL are incommensurable systems",
                "Statement logic is a branch of the syllogistic: propositional terms in the singleton universe, expressible via DNF and the transcriptions, provable by the term rules — the inversion of the modern architecture",
                "The syllogistic is a fragment of statement logic",
                "Statement logic requires the tree method"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "Lesson 3's twin halves: everything statement logic says (DNF reduces any connective to or/and/not, all categorical) and everything it proves (DDO, contraposition, simplification) lives inside the term algebra. Frege's tower, inverted."
            },
            {
              prompt: "The curriculum's final verdict on term logic versus the century-old indictment:",
              choices: [
                "Every charge — relations, statements, singulars, pronouns, identity — was answered inside the sign algebra; the real limits are numerical idioms and infrastructure, not verdicts; over shared territory, one logic in two notations",
                "The indictment stands — term logic remains a quaint fragment",
                "TFL wins on all counts, including metatheory and tooling",
                "The two systems disagree about which relational arguments are valid"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The audit in full: the prosecution's exhibits became exercises (the horse's head fell to one cancellation), the concessions are matters of vocabulary and ecosystem rather than correctness, and the bridge showed validity surviving translation both ways. What remains open is Sommers' wager — that the logic we natively run is a logic of terms."
            }
          ]
        }

      ]
    }

  ]
};
