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
    }

  ]
};
