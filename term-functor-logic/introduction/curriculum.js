// curriculum.js — Term Functor Logic
// Based on: Sommers & Englebretsen, "An Invitation to Formal Reasoning: The Logic of Terms" (2000)

// Shared template helpers (syl, engSyl, mcPrompt) come from ../tfl-helpers.js.

// Multiple-choice prompt showing two TFL premise rows
function premises(p1, p2, label = 'Premises:') {
  return `<span class="mc-prompt">${label}</span>
                <div class="syllogism-display" style="margin-top:0.4rem">
                  <div class="syl-row"><code>${p1}</code></div>
                  <div class="syl-row"><code>${p2}</code></div>
                </div>`;
}

const CURRICULUM = {
  title: "Term Functor Logic",
  subtitle: "A modern algebraic approach to Aristotelian logic",
  icon: "∴",
  lessons: [

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 1: Terms and Propositions
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-01",
      title: "Lesson 1: Terms and Propositions",
      description: "Meet the fundamental building blocks of TFL: terms, subjects, predicates, and categorical statements.",
      completionText: "You now know what terms are, how they combine into categorical statements, and the crucial distinction between positive and negative terms. In the next lesson, you'll learn the plus-minus sign algebra that gives TFL its power.",
      blocks: [

        // ── Concept: What Is Term Functor Logic? ────────────────────────────
        {
          type: "concept",
          id: "what-is-tfl",
          title: "1. What Is Term Functor Logic?",
          content: `
            <p><strong>Term Functor Logic (TFL)</strong> is a modern formal logic developed by philosopher
            Fred Sommers in the 1960s–1980s and co-authored into a textbook with George Englebretsen in 2000.
            It is a rigorous algebraic revival of the logic Aristotle invented — the system that dominated
            Western thought for over two thousand years before Frege's predicate logic replaced it in the
            late 19th century.</p>

            <p>The structural idea: every statement can be decomposed into exactly one
            <strong>subject-term</strong> and one <strong>predicate-term</strong>, connected by a
            <strong>functor</strong> — a sign-pair that encodes whether the connection is universal or
            particular, affirmed or denied. All inference then reduces to <strong>sign arithmetic</strong>
            with + and −.</p>

            <p>Compare how the two systems handle "All dogs are mammals":</p>

            <div class="ex-table">
              <div class="ex-row"><code>∀x(Dog(x) → Mammal(x))</code><span>MPL — a variable x ranges over individual objects; Dog and Mammal are predicates applied to x</span></div>
              <div class="ex-row"><code>−Dog + Mammal</code><span>TFL — Dog and Mammal are terms; the sign-pair (−, +) is the functor connecting them</span></div>
            </div>

            <p><strong>A word on "functor."</strong> The name "Term Functor Logic" means: logic where a
            <em>functor</em> (the sign-pair acting as copula) operates on <em>terms</em>. If you know
            category theory, set that meaning aside — the word here has nothing to do with
            structure-preserving maps between categories. It simply names the algebraic connective
            between two terms, the thing that determines how they are logically related. When you see
            "functor," read it as "algebraic copula-operator."</p>

            <p><strong>A word on "no variables."</strong> TFL is often described this way, and it is
            true in the important sense: TFL has no <em>first-order object variables</em> — no x, y, z
            ranging over individual members of a domain. MPL needs such variables because it reasons
            about individuals: "for every individual x, if x is a dog then x is a mammal." TFL instead
            works with <em>terms</em> — kinds — directly: <em>Dog</em> as a kind stands in relation to
            <em>Mammal</em> as a kind, with no individual x appearing anywhere. The schematic letters
            S, P, M you will see in TFL formulas are <em>term-level placeholders</em>: they stand for
            any term (any kind), not for any individual object. That is the meaningful contrast.</p>

            <div class="callout-note">
              <span class="cn-label">History</span>
              Aristotle's logic (the "syllogistic") was the only formal logic in the West from roughly
              350 BCE to 1879 CE — over 2,200 years. Sommers showed in the 1980s that it could be
              algebraized and made as powerful as modern predicate logic, while staying much closer to
              how we actually think and speak.
            </div>
          `
        },

        // ── Concept: What Is a Term? ────────────────────────────────────────
        {
          type: "concept",
          id: "what-is-a-term",
          title: "2. What Is a Term?",
          content: `
            <p>A <strong>term</strong> is a general word or phrase that names a <em>kind</em> of thing.
            Terms are the atoms of TFL — the smallest meaningful units.</p>

            <p>Terms can be nouns, adjectives, or noun phrases:</p>

            <div class="ex-table">
              <div class="ex-row"><code>mortal</code><span>names the kind: things that die</span></div>
              <div class="ex-row"><code>wise</code><span>names the kind: things having wisdom</span></div>
              <div class="ex-row"><code>philosopher</code><span>names the kind: persons who love wisdom</span></div>
              <div class="ex-row"><code>prime number</code><span>names the kind: integers divisible only by 1 and themselves</span></div>
              <div class="ex-row"><code>warm-blooded</code><span>names the kind: animals maintaining constant body temperature</span></div>
            </div>

            <p>Terms are <em>different</em> from the predicates of modern logic. A predicate like
            <code>Dog(x)</code> is applied to a variable. A term like <code>dog</code> stands alone —
            it is connected to other terms, not applied to arguments.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Idea</span>
              A term names a kind. A subject-term and a predicate-term connected by a functor (sign-pair) make a statement. Either term can itself be compound — built from simpler terms — but there is always exactly one subject slot and one predicate slot.
            </div>
          `
        },

        // ── Concept: Subject, Predicate, and Functor ────────────────────────
        {
          type: "concept",
          id: "subject-predicate",
          title: "3. Subject, Predicate, and Functor",
          content: `
            <p>Every categorical statement has exactly two slots:</p>

            <ul>
              <li>The <strong>subject term (S)</strong> — what we are talking about</li>
              <li>The <strong>predicate term (P)</strong> — what we are saying about the subject</li>
            </ul>

            <p>In ordinary English, a <strong>copula</strong> ("is," "are," "is not") connects them.
            In TFL, the copula is replaced by a <strong>functor</strong> — a sign-pair that encodes,
            algebraically, both how much of S is involved and whether P is affirmed or denied.
            You will learn the exact signs in Lesson 2; for now just notice that the structure is
            always S — functor — P.</p>

            <div class="syntax-box">S — functor — P</div>

            <p>Examples:</p>
            <div class="ex-table">
              <div class="ex-row"><code>All dogs are mammals</code><span>S = dogs, P = mammals</span></div>
              <div class="ex-row"><code>No whale is a fish</code><span>S = whale, P = fish</span></div>
              <div class="ex-row"><code>Some philosophers are wise</code><span>S = philosophers, P = wise</span></div>
              <div class="ex-row"><code>Some students are not diligent</code><span>S = students, P = diligent</span></div>
            </div>

            <p>The quantifier words ("all," "no," "some") and the copula ("is," "are not") are
            <em>not</em> separate ingredients pasted on top — in TFL they are entirely absorbed into
            the functor's sign-pair. What looks like four different things in English (subject, copula,
            quantifier, predicate) is just three in TFL: subject-term, functor, predicate-term.</p>

            <p>Both the subject-term and the predicate-term can be complex. "Every boy loves every
            girl" has subject <em>boy</em> and a compound predicate <em>lover-of-every-girl</em> —
            still one subject slot, one predicate slot, one functor between them. We cover compound
            terms when we reach relational statements later in the course.</p>
          `
        },

        // ── Exercise: Identify Subject/Predicate ────────────────────────────
        {
          type: "exercise",
          id: "ex-subpred",
          title: "Quick Check: Subject and Predicate",
          instruction: "In each statement, what is the predicate term?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "In:",
              expr: "All mammals are warm-blooded",
              choices: ["mammals", "warm-blooded", "all", "are"],
              choicesAreCode: false,
              answer: 1,
              explanation: "\"Warm-blooded\" is what we're saying about mammals — the predicate. \"Mammals\" is the subject. \"All\" tells us quantity, and \"are\" is the copula."
            },
            {
              prompt: "In:",
              expr: "No whale is a fish",
              choices: ["whale", "no", "fish", "is"],
              choicesAreCode: false,
              answer: 2,
              explanation: "\"Fish\" is the predicate — what we deny of whales. \"Whale\" is the subject. \"No\" gives universal-negative quantity."
            },
            {
              prompt: "In:",
              expr: "Some philosophers are not wise",
              choices: ["some", "philosophers", "wise", "not"],
              choicesAreCode: false,
              answer: 2,
              explanation: "\"Wise\" is the predicate term — what is being denied of some philosophers. The word \"not\" encodes the denial; it doesn't become part of the term itself."
            },
            {
              prompt: "In:",
              expr: "All prime numbers are odd or equal to 2",
              choices: ["prime numbers", "odd or equal to 2", "numbers", "all"],
              choicesAreCode: false,
              answer: 1,
              explanation: "The full predicate phrase \"odd or equal to 2\" is what is said about prime numbers. Complex predicates are still terms in TFL — they name a kind (things that are odd or are equal to 2)."
            }
          ]
        },

        // ── Concept: Positive and Negative Terms ────────────────────────────
        {
          type: "concept",
          id: "pos-neg-terms",
          title: "4. Positive and Negative Terms",
          content: `
            <p>Every term has a <strong>quality</strong>: it is either the positive term (the kind itself)
            or the <strong>negative term</strong> (its complement — everything <em>not</em> of that kind).</p>

            <p>You form the negative term by adding "non-" (or using a natural antonym):</p>

            <div class="ex-table">
              <div class="ex-row"><code>wise</code><span>positive → <code>non-wise</code> is its negative</span></div>
              <div class="ex-row"><code>mortal</code><span>positive → <code>immortal</code> (= non-mortal) is its negative</span></div>
              <div class="ex-row"><code>rational</code><span>positive → <code>irrational</code> (= non-rational)</span></div>
              <div class="ex-row"><code>present</code><span>positive → <code>absent</code> (= non-present)</span></div>
              <div class="ex-row"><code>fish</code><span>positive → <code>non-fish</code></span></div>
            </div>

            <p>Either can appear as a predicate in a statement:</p>
            <div class="ex-table">
              <div class="ex-row"><code>All whales are non-fish</code><span>negative predicate — "non-fish"</span></div>
              <div class="ex-row"><code>Some students are non-diligent</code><span>negative predicate</span></div>
              <div class="ex-row"><code>No squares are non-rectangles</code><span>negative predicate in a universal statement</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Important</span>
              Negating a <em>term</em> is different from negating a <em>sentence</em>. "Some students are non-diligent" (term negated) says that some students lack diligence. "It is not the case that some students are diligent" (sentence negated) says no students are diligent at all. TFL distinguishes these clearly with its sign notation, as you'll see in the next lesson.
            </div>
          `
        },

        // ── Exercise: Positive or Negative Term? ────────────────────────────
        {
          type: "exercise",
          id: "ex-posneg",
          isFinal: true,
          title: "Final Review: Positive and Negative Terms",
          instruction: "Identify whether the indicated term is positive or negative.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "The predicate in: \"All circles are non-squares\"",
              choices: ["Positive (the term itself)", "Negative (the complement)"],
              choicesAreCode: false,
              answer: 1,
              explanation: "\"Non-squares\" is the complement of \"squares\" — a negative term. The predicate is the complement kind."
            },
            {
              prompt: "The predicate in: \"Some animals are mortal\"",
              choices: ["Positive (the term itself)", "Negative (the complement)"],
              choicesAreCode: false,
              answer: 0,
              explanation: "\"Mortal\" is a positive term — it names the kind directly. Its negative would be \"immortal\" or \"non-mortal.\""
            },
            {
              prompt: "The term \"irrational\" (as in \"irrational numbers\")",
              choices: ["Positive (the term itself)", "Negative (the complement of \"rational\")"],
              choicesAreCode: false,
              answer: 1,
              explanation: "\"Irrational\" is the complement of \"rational\" — it is a negative term (non-rational). Natural language often gives us words for both members of a complementary pair."
            },
            {
              prompt: "The subject in: \"No philosophers are unwise\"",
              choices: ["Positive (\"philosophers\" is the positive term)", "Negative (the complement of philosophers)"],
              choicesAreCode: false,
              answer: 0,
              explanation: "\"Philosophers\" is the subject and it is the positive term — it names the kind directly, not its complement. \"Unwise\" in the predicate is negative, but we were asked about the subject."
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 2: The Plus-Minus Sign Algebra
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-02",
      title: "Lesson 2: The Plus-Minus Sign Algebra",
      description: "Learn how TFL encodes quantity and quality using nothing but + and − signs.",
      completionText: "You now understand TFL's sign algebra: + and − mark whether a term is positive or negative (quality), and whether a subject is \"some\" or \"all\" (quantity). Sign arithmetic governs how they combine. In the next lesson, you'll see these signs assemble into the four categorical forms.",
      blocks: [

        // ── Concept: Two Jobs, One Symbol ───────────────────────────────────
        {
          type: "concept",
          id: "two-jobs",
          title: "1. Two Jobs, One Symbol",
          content: `
            <p>TFL encodes all logical information using exactly two symbols: <strong>+</strong> and <strong>−</strong>.
            These signs do <em>two distinct jobs</em>, depending on where they appear:</p>

            <ul>
              <li>On a <strong>term</strong>: marks whether the term is positive or its complement</li>
              <li>On a <strong>subject</strong>: marks whether the statement is "some" (particular) or "all" (universal)</li>
            </ul>

            <p>This double duty is TFL's elegant trick. A single algebraic symbol encodes what would require
            separate notation in other systems. And because the signs follow ordinary arithmetic rules,
            <em>logical inference becomes algebra</em>.</p>

            <div class="grammar-rule">
              <span class="g-label">Core Insight</span>
              One symbol (+/−) encodes both what kind (quality) and how much (quantity). Reasoning is sign arithmetic.
            </div>
          `
        },

        // ── Concept: Quality — Term Signs ───────────────────────────────────
        {
          type: "concept",
          id: "quality-signs",
          title: "2. Quality: Positive and Negative Terms",
          content: `
            <p>When a sign appears on a <strong>term itself</strong>, it marks the term's <strong>quality</strong>
            — whether this is the positive kind or its complement:</p>

            <div class="syntax-box">
              <code>+T</code> = the positive term T (the kind itself)<br>
              <code>−T</code> = the negative term (the complement of T)
            </div>

            <p>This opposition is called the <strong>C-opposition</strong> (complementary opposition).
            Every term has exactly one complement:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+wise</code><span>the positive term: wise</span></div>
              <div class="ex-row"><code>−wise</code><span>the negative term: non-wise</span></div>
              <div class="ex-row"><code>+mortal</code><span>mortal</span></div>
              <div class="ex-row"><code>−mortal</code><span>non-mortal (= immortal)</span></div>
              <div class="ex-row"><code>+fish</code><span>fish</span></div>
              <div class="ex-row"><code>−fish</code><span>non-fish</span></div>
            </div>

            <p>In the four categorical forms we'll see next lesson, the predicate term always carries
            one of these quality signs.</p>

            <div class="callout-note">
              <span class="cn-label">Note</span>
              When no sign is written, a positive sign is implied. Writing <code>wise</code> alone means <code>+wise</code>.
            </div>
          `
        },

        // ── Concept: Quantity — Subject Signs ───────────────────────────────
        {
          type: "concept",
          id: "quantity-signs",
          title: "3. Quantity: Some vs. All",
          content: `
            <p>When a sign appears on the <strong>subject</strong> of a statement, it marks the statement's
            <strong>quantity</strong> — how much of the subject is involved:</p>

            <div class="syntax-box">
              <code>+S</code> = "some S" — the <strong>particular</strong> quantity (at least one)<br>
              <code>−S</code> = "all S" — the <strong>universal</strong> quantity (every one)
            </div>

            <p>The same symbol encodes these two fundamentally different logical meanings depending on
            whether it sits on the subject (quantity) or on a term within a predicate (quality).</p>

            <div class="ex-table">
              <div class="ex-row"><code>+Philosopher</code><span>"some philosophers" (particular subject)</span></div>
              <div class="ex-row"><code>−Philosopher</code><span>"all philosophers" / "every philosopher" (universal subject)</span></div>
              <div class="ex-row"><code>+Circle</code><span>"some circles"</span></div>
              <div class="ex-row"><code>−Circle</code><span>"every circle"</span></div>
            </div>

            <p>Why minus for "all"? Universal statements carry a stronger commitment — they claim
            something holds across the entire domain. The minus sign reflects this universality.
            (You'll see why this choice makes the algebra work elegantly in lessons 4 and 5.)</p>

            <div class="grammar-rule">
              <span class="g-label">Rule</span>
              On a subject: + means "some" (particular). − means "all" (universal).
            </div>
          `
        },

        // ── Exercise: Read the Sign ─────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-read-signs",
          title: "Quick Check: Reading Signs",
          instruction: "What does each sign expression mean in context?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "The subject sign in a statement:",
              expr: "+Student",
              choices: ["all students (universal)", "some students (particular)", "non-students (complement)", "some non-students"],
              choicesAreCode: false,
              answer: 1,
              explanation: "A + on the subject marks the particular quantity: \"some students.\" The + means at least one."
            },
            {
              prompt: "The subject sign in a statement:",
              expr: "−Mammal",
              choices: ["some mammals", "non-mammals", "all mammals (universal)", "no mammals"],
              choicesAreCode: false,
              answer: 2,
              explanation: "A − on the subject marks the universal quantity: \"all mammals\" or \"every mammal.\" This covers the entire class."
            },
            {
              prompt: "The quality sign on a predicate term:",
              expr: "+Wise",
              choices: ["all wise things", "the positive term: wise", "some wise things", "the complement: non-wise"],
              choicesAreCode: false,
              answer: 1,
              explanation: "A + on a term marks it as the positive term itself: \"wise.\" Quality signs mark the C-opposition — whether it's the kind or its complement."
            },
            {
              prompt: "The quality sign on a predicate term:",
              expr: "−Fish",
              choices: ["all fish", "no fish", "the positive term: fish", "the complement: non-fish"],
              choicesAreCode: false,
              answer: 3,
              explanation: "A − on a term marks it as the complement: \"non-fish.\" This is term quality (C-opposition), not quantity. The quantity reading of − only applies to the subject."
            }
          ]
        },

        // ── Concept: Sign Arithmetic ────────────────────────────────────────
        {
          type: "concept",
          id: "sign-arithmetic",
          title: "4. Sign Arithmetic",
          content: `
            <p>Signs in TFL combine exactly like multiplication by +1 and −1.
            The key rule: <em>like signs give positive, unlike signs give negative.</em></p>

            <div class="syntax-box">
              <code>+ × + = +</code><br>
              <code>− × − = +</code>  (double negative = positive)<br>
              <code>+ × − = −</code><br>
              <code>− × + = −</code>
            </div>

            <p>This arithmetic applies whenever signs combine. The most important case is
            <strong>double negation</strong>: two negatives cancel, just as in ordinary arithmetic.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−(−wise)</code><span>= +wise = "wise" (double negative cancels)</span></div>
              <div class="ex-row"><code>−(+mortal)</code><span>= −mortal = "non-mortal"</span></div>
              <div class="ex-row"><code>+(−fish)</code><span>= −fish = "non-fish"</span></div>
            </div>

            <p>Why does this matter? When we test syllogisms for validity in lesson 5, we'll
            <em>add</em> two premises algebraically. If the middle term appears with opposite signs
            in the two premises (+M in one, −M in the other), they cancel out. What remains
            is the conclusion.</p>

            <p>Two laws govern that sum, both echoing ordinary arithmetic:</p>

            <div class="grammar-rule">
              <span class="g-label">Commutation and Association</span>
              <strong>Commutation</strong> — order doesn't matter within a sum:
              <code>+A + B = +B + A</code>.<br>
              <strong>Association</strong> — grouping doesn't matter:
              <code>(+A + B) + C = +A + (+B + C)</code>.
            </div>

            <p>Together they are why a middle term cancels <em>wherever</em> it sits and
            <em>however</em> the premises are grouped — the "position-blindness" the validity test
            relies on. One caution, revisited in Lesson 4: commutation holds within a sum, but the
            subject and predicate do not swap across the copula — <code>−S+P</code> ("all S are P")
            is not <code>−P+S</code>.</p>

            <div class="callout-note">
              <span class="cn-label">Everyday Analogy</span>
              You already know sign arithmetic from language: "not unhappy" = happy. "It's not the case that no one came" = someone came. TFL just makes this pattern explicit and rigorous.
            </div>
          `
        },

        // ── Exercise: Sign Arithmetic (Final) ───────────────────────────────
        {
          type: "exercise",
          id: "ex-sign-arith",
          isFinal: true,
          title: "Final Review: Sign Arithmetic",
          instruction: "Simplify each sign expression by applying the arithmetic rules.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Simplify:",
              expr: "−(−mortal)",
              choices: ["−mortal  (non-mortal)", "+mortal  (mortal)", "−(mortal)  (no change)", "+(−mortal)"],
              choicesAreCode: true,
              answer: 1,
              explanation: "Double negation: − × − = +. So −(−mortal) = +mortal = \"mortal.\" The two negatives cancel."
            },
            {
              prompt: "What is the result of:",
              expr: "− × −",
              choices: ["+  (positive)", "−  (negative)", "0  (zero)", "±  (ambiguous)"],
              choicesAreCode: true,
              answer: 0,
              explanation: "Two negatives multiply to a positive: − × − = +. This is the algebraic law of double negation."
            },
            {
              prompt: "If + means affirm and − means negate, what does −(+wise) give?",
              choices: ["−wise  (non-wise)", "+wise  (wise)", "−(−wise)  (double negation)", "+(−wise)"],
              choicesAreCode: true,
              answer: 0,
              explanation: "−(+wise) = − × + = − → −wise = non-wise. Negating the positive term gives the complement."
            },
            {
              prompt: "Double negation applied to a subject: −(−Student) as a subject sign means?",
              choices: ["all students (universal)", "some students (particular)", "no students", "non-students"],
              choicesAreCode: false,
              answer: 1,
              explanation: "−(−Student) simplifies to +Student by double negation. A + on the subject means \"some students\" (particular). The double negative resolves back to positive/particular."
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 3: The Four Categorical Forms
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-03",
      title: "Lesson 3: The Four Categorical Forms",
      description: "Learn the A, E, I, and O forms — the four types of categorical statement in TFL — and how to transcribe English sentences into TFL notation.",
      completionText: "You can now read and write all four categorical forms in TFL notation. The four forms A, E, I, O cover every possible combination of universal/particular and affirmative/negative. Next, you'll learn the immediate inferences that follow directly from a single categorical statement.",
      blocks: [

        // ── Concept: Reading a Categorical Statement ─────────────────────────
        {
          type: "concept",
          id: "categorical-structure",
          title: "1. Structure of a Categorical Statement",
          content: `
            <p>A categorical statement in TFL has a precise two-part structure.
            Each term carries a sign that encodes logical information:</p>

            <div class="syntax-box"><code>(quantity sign)S  (quality sign)P</code></div>

            <ul>
              <li>The <strong>quantity sign</strong> on S: + = "some," − = "all"</li>
              <li>The <strong>quality sign</strong> on P: + = affirmed (positive term), − = denied (negative/complement)</li>
            </ul>

            <p>With two signs and two positions (+ or −), we get exactly <strong>four</strong> possible combinations
            — the four classical forms A, E, I, O that Aristotle identified over 2,300 years ago:</p>

            <div class="syntax-box">
              <table>
                <tr><td>A:</td><td><code>−S + P</code></td><td>All S is P</td></tr>
                <tr><td>E:</td><td><code>−S − P</code></td><td>No S is P</td></tr>
                <tr><td>I:</td><td><code>+S + P</code></td><td>Some S is P</td></tr>
                <tr><td>O:</td><td><code>+S − P</code></td><td>Some S is not P</td></tr>
              </table>
            </div>

            <p>The letters A, E, I, O come from the Latin words <em>Affirmo</em> (I affirm) and <em>Nego</em> (I deny).
            A and I are the affirmative forms; E and O are the negative forms.</p>
          `
        },

        // ── Concept: A-form and E-form ──────────────────────────────────────
        {
          type: "concept",
          id: "ae-forms",
          title: "2. The A-form and E-form (Universal)",
          content: `
            <p>Both A and E forms have a <strong>universal</strong> subject — the quantity sign on S is <strong>−</strong>
            (meaning "all" or "every").</p>

            <p><strong>A-form: −S + P</strong> — Universal Affirmative</p>
            <div class="syntax-box"><code>−S + P</code></div>
            <ul>
              <li>Subject: −S = "all S" (universal)</li>
              <li>Predicate: +P = positive term P (affirmed)</li>
              <li>Reading: "All S is P" / "Every S is P"</li>
            </ul>
            <div class="ex-table">
              <div class="ex-row"><code>−Dog + Mammal</code><span>"All dogs are mammals"</span></div>
              <div class="ex-row"><code>−Mammal + Mortal</code><span>"All mammals are mortal"</span></div>
              <div class="ex-row"><code>−Square + Rectangle</code><span>"All squares are rectangles"</span></div>
            </div>

            <p><strong>E-form: −S − P</strong> — Universal Negative</p>
            <div class="syntax-box"><code>−S − P</code></div>
            <ul>
              <li>Subject: −S = "all S" (universal)</li>
              <li>Predicate: −P = negative term (complement of P, or P denied)</li>
              <li>Reading: "No S is P" — equivalently, "All S is non-P"</li>
            </ul>
            <div class="ex-table">
              <div class="ex-row"><code>−Whale − Fish</code><span>"No whales are fish"</span></div>
              <div class="ex-row"><code>−Reptile − WarmBlooded</code><span>"No reptiles are warm-blooded"</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Insight</span>
              "No S is P" and "All S is non-P" are the same proposition — they have the same contracted TFL form <code>−S − P</code>. In TFL, the minus on P captures both the universal denial and the affirmation of the complement. This equivalence (called obversion) is built into the notation.
            </div>
          `
        },

        // ── Concept: I-form and O-form ──────────────────────────────────────
        {
          type: "concept",
          id: "io-forms",
          title: "3. The I-form and O-form (Particular)",
          content: `
            <p>Both I and O forms have a <strong>particular</strong> subject — the quantity sign on S is <strong>+</strong>
            (meaning "some").</p>

            <p><strong>I-form: +S + P</strong> — Particular Affirmative</p>
            <div class="syntax-box"><code>+S + P</code></div>
            <ul>
              <li>Subject: +S = "some S" (particular)</li>
              <li>Predicate: +P = positive term P (affirmed)</li>
              <li>Reading: "Some S is P" / "Some S are P"</li>
            </ul>
            <div class="ex-table">
              <div class="ex-row"><code>+Philosopher + Wise</code><span>"Some philosophers are wise"</span></div>
              <div class="ex-row"><code>+Student + Diligent</code><span>"Some students are diligent"</span></div>
            </div>

            <p><strong>O-form: +S − P</strong> — Particular Negative</p>
            <div class="syntax-box"><code>+S − P</code></div>
            <ul>
              <li>Subject: +S = "some S" (particular)</li>
              <li>Predicate: −P = complement of P (denied)</li>
              <li>Reading: "Some S is not P" — equivalently, "Some S is non-P"</li>
            </ul>
            <div class="ex-table">
              <div class="ex-row"><code>+Student − Diligent</code><span>"Some students are not diligent"</span></div>
              <div class="ex-row"><code>+Animal − Mortal</code><span>"Some animals are not mortal" (immortal animals?)</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">Summary</span>
              A (−S+P): all … is. E (−S−P): no … is. I (+S+P): some … is. O (+S−P): some … is not.
            </div>
          `
        },

        // ── Exercise: Name That Form ─────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-name-form",
          title: "Quick Check: Name That Form",
          instruction: "Identify the categorical form (A, E, I, or O) for each TFL expression.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What form is:",
              expr: "+Student + Diligent",
              choices: ["A  (−S+P)", "E  (−S−P)", "I  (+S+P)", "O  (+S−P)"],
              choicesAreCode: true,
              answer: 2,
              explanation: "The subject has + (particular: \"some students\") and the predicate has + (positive term: \"diligent\"). That's the I-form: +S+P, \"Some students are diligent.\""
            },
            {
              prompt: "What form is:",
              expr: "−Mammal − WarmBlooded",
              choices: ["A  (−S+P)", "E  (−S−P)", "I  (+S+P)", "O  (+S−P)"],
              choicesAreCode: true,
              answer: 1,
              explanation: "Universal subject (−Mammal = all mammals) and negative predicate (−WarmBlooded = non-warm-blooded / warm-blooded denied). That's the E-form: −S−P, \"No mammals are warm-blooded.\" (Of course this is false — but the form is E.)"
            },
            {
              prompt: "What form is:",
              expr: "+Circle − Square",
              choices: ["A  (−S+P)", "E  (−S−P)", "I  (+S+P)", "O  (+S−P)"],
              choicesAreCode: true,
              answer: 3,
              explanation: "Particular subject (+Circle = \"some circles\") and negative predicate (−Square = \"non-square\" / square denied). That's the O-form: +S−P, \"Some circles are not squares.\""
            },
            {
              prompt: "What English sentence does −Dog + Mammal express?",
              choices: ["Some dogs are mammals", "No dogs are mammals", "All dogs are mammals", "Some dogs are not mammals"],
              choicesAreCode: false,
              answer: 2,
              explanation: "−Dog: universal subject (all dogs). +Mammal: positive predicate (mammals affirmed). A-form: \"All dogs are mammals.\""
            }
          ]
        },

        // ── Concept: Transcribing English to TFL ────────────────────────────
        {
          type: "concept",
          id: "transcribing",
          title: "4. Transcribing English to TFL",
          content: `
            <p>TFL is designed to stay close to natural language. Translating ("transcribing") an
            English categorical statement requires answering only two questions:</p>

            <ol>
              <li><strong>Quantity?</strong> — Universal (all/every/no) → −S. Particular (some) → +S.</li>
              <li><strong>Quality?</strong> — Affirmed (is/are) → +P. Denied (is not/are not) → −P.</li>
            </ol>

            <p>Special case: "No S is P" is universal + denied → −S − P (E-form).</p>

            <p>Step-by-step examples:</p>

            <div class="step-trace">
              <div class="step"><code>"All circles are shapes"</code></div>
              <div class="step step-reduce"><span>Universal (all) → −Circle.  Affirmed → +Shape</span></div>
              <div class="step step-reduce"><code>−Circle + Shape</code><span class="step-note">A-form ✓</span></div>
            </div>

            <div class="step-trace">
              <div class="step"><code>"No whale is a fish"</code></div>
              <div class="step step-reduce"><span>Universal (no) → −Whale.  Denied → −Fish</span></div>
              <div class="step step-reduce"><code>−Whale − Fish</code><span class="step-note">E-form ✓</span></div>
            </div>

            <div class="step-trace">
              <div class="step"><code>"Some students are not diligent"</code></div>
              <div class="step step-reduce"><span>Particular (some) → +Student.  Denied (not) → −Diligent</span></div>
              <div class="step step-reduce"><code>+Student − Diligent</code><span class="step-note">O-form ✓</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Tip</span>
              Strip away the quantifier word ("all," "some," "no") and the copula ("is," "are," "is not") — what remains are exactly two terms, each getting a sign.
            </div>
          `
        },

        // ── Exercise: Write It Yourself (free input, engine-graded) ──────────
        {
          type: "exercise",
          id: "ex-transcribe-write",
          title: "Write It Yourself: Transcribe to TFL",
          instruction: "Type the TFL transcription. Any correct form is accepted — even an equivalent one (an obverse or contrapositive), since the engine grades up to the immediate rules. Use − for minus (a plain hyphen - works too).",
          kind: "tfl-expression",
          items: [
            {
              mode: "transcribe",
              prompt: "Transcribe: “Every dog is loyal.”",
              answer: "−Dog+Loyal",
              explanation: "Universal (every) → −Dog. Affirmed (is) → +Loyal. So −Dog+Loyal (A-form)."
            },
            {
              mode: "transcribe",
              prompt: "Transcribe: “Some metals are not magnetic.”",
              answer: "+Metal−Magnetic",
              explanation: "Particular (some) → +Metal. Denied (not) → −Magnetic. So +Metal−Magnetic (O-form)."
            },
            {
              mode: "transcribe",
              prompt: "Transcribe: “No ghost is real.”",
              answer: "−Ghost−Real",
              explanation: "Universal-negative (no) → −Ghost. Denied → −Real. So −Ghost−Real (E-form)."
            }
          ]
        },

        // ── Exercise: Transcribe It! (Final) ─────────────────────────────────
        {
          type: "exercise",
          id: "ex-transcribe",
          isFinal: true,
          title: "Final Review: Transcribe to TFL",
          instruction: "Choose the correct TFL notation for each English statement.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Transcribe:",
              expr: "All mammals are warm-blooded",
              choices: ["−Mammal + WarmBlooded", "+Mammal + WarmBlooded", "−Mammal − WarmBlooded", "+Mammal − WarmBlooded"],
              choicesAreCode: true,
              answer: 0,
              explanation: "Universal (all) → −Mammal. Affirmed (are) → +WarmBlooded. Result: −Mammal + WarmBlooded. A-form ✓"
            },
            {
              prompt: "Transcribe:",
              expr: "Some philosophers are wise",
              choices: ["−Philosopher + Wise", "+Philosopher + Wise", "+Philosopher − Wise", "−Philosopher − Wise"],
              choicesAreCode: true,
              answer: 1,
              explanation: "Particular (some) → +Philosopher. Affirmed (are) → +Wise. Result: +Philosopher + Wise. I-form ✓"
            },
            {
              prompt: "Transcribe:",
              expr: "No snakes are warm-blooded",
              choices: ["+Snake − WarmBlooded", "−Snake + WarmBlooded", "+Snake + WarmBlooded", "−Snake − WarmBlooded"],
              choicesAreCode: true,
              answer: 3,
              explanation: "Universal-negative (no) → −Snake. Denied → −WarmBlooded. Result: −Snake − WarmBlooded. E-form ✓"
            },
            {
              prompt: "Transcribe:",
              expr: "Some prime numbers are not odd",
              choices: ["−Prime + Odd", "+Prime + Odd", "+Prime − Odd", "−Prime − Odd"],
              choicesAreCode: true,
              answer: 2,
              explanation: "Particular (some) → +Prime. Denied (not) → −Odd. Result: +Prime − Odd. O-form ✓ (The only even prime, 2, makes this true.)"
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 4: Immediate Inferences
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-04",
      title: "Lesson 4: Immediate Inferences",
      description: "Discover how TFL's sign algebra makes one-premise inferences — conversion, contraposition, and obversion — transparent and algebraic.",
      completionText: "You can now perform the three classical immediate inferences using TFL's sign algebra. These aren't arbitrary rules — they fall directly out of the algebra. Next, you'll use these skills in syllogisms, where two premises combine to yield a conclusion.",
      blocks: [

        // ── Concept: What Is an Immediate Inference? ─────────────────────────
        {
          type: "concept",
          id: "immediate-intro",
          title: "1. What Is an Immediate Inference?",
          content: `
            <p>An <strong>immediate inference</strong> is a valid argument from a <em>single</em> premise
            to a conclusion — no middle term, no additional information. The conclusion follows
            directly from the structure of the premise alone.</p>

            <p>In classical logic there are three major kinds:</p>
            <ul>
              <li><strong>Conversion</strong> — swap subject and predicate</li>
              <li><strong>Contraposition</strong> — negate both terms and swap them</li>
              <li><strong>Obversion</strong> — change the copula quality, negate the predicate</li>
            </ul>

            <p>TFL's sign algebra makes it immediately clear which inferences are valid and which are not —
            we can check by manipulating signs rather than consulting tables of rules.</p>

            <div class="callout-note">
              <span class="cn-label">Symbol</span>
              We write immediate inferences with the "therefore" symbol: ∴ (so that). "−S+P ∴ −(−P)+(−S)" means "From −S+P we infer −(−P)+(−S)."
            </div>
          `
        },

        // ── Concept: Conversion ──────────────────────────────────────────────
        {
          type: "concept",
          id: "conversion",
          title: "2. Conversion: Swapping Terms",
          content: `
            <p><strong>Conversion</strong> swaps the subject and predicate terms. But it is only valid for
            certain forms — the symmetry of the copula determines when it works.</p>

            <p><strong>I-form converts (valid):</strong></p>
            <div class="syntax-box"><code>+S + P  ∴  +P + S</code></div>
            <p>The binary + copula is <em>symmetric</em>: "Some S is P" implies and is implied by "Some P is S."
            In TFL, this is the Commutation law: <code>+X + Y = +Y + X</code>.</p>
            <div class="ex-table">
              <div class="ex-row"><code>+Philosopher + Wise  ∴  +Wise + Philosopher</code><span>"Some philosophers are wise" ∴ "Some wise things are philosophers"</span></div>
            </div>

            <p><strong>E-form converts (valid):</strong></p>
            <div class="syntax-box"><code>−S − P  ∴  −P − S</code></div>
            <p>"No S is P" implies "No P is S." This follows from the symmetry of the denial relation —
            if nothing in S is in P, then nothing in P is in S either.</p>
            <div class="ex-table">
              <div class="ex-row"><code>−Whale − Fish  ∴  −Fish − Whale</code><span>"No whales are fish" ∴ "No fish are whales"</span></div>
            </div>

            <p><strong>A-form does NOT simply convert (invalid):</strong></p>
            <div class="syntax-box"><code>−S + P  ∴  −P + S  ✗</code></div>
            <p>The binary − copula (universal) is <em>not</em> symmetric. "All dogs are mammals" does
            <em>not</em> imply "All mammals are dogs" — most mammals aren't dogs.
            In TFL: −S+P ≠ −P+S in general. The signs don't commute across the − copula.</p>

            <div class="grammar-rule">
              <span class="g-label">Conversion Rule</span>
              I and E convert; A and O do not convert simply.
            </div>
          `
        },

        // ── Concept: Contraposition ──────────────────────────────────────────
        {
          type: "concept",
          id: "contraposition",
          title: "3. Contraposition: Negating and Swapping",
          content: `
            <p><strong>Contraposition</strong> produces an equivalent statement by negating both terms
            and swapping their roles. In TFL, this is encoded by the algebraic rule:</p>

            <div class="syntax-box"><code>−X + Y  =  −(−Y) + (−X)</code></div>

            <p>Applied to the A-form:</p>
            <div class="step-trace">
              <div class="step"><code>−Dog + Mammal</code><span class="step-note">"All dogs are mammals"</span></div>
              <div class="step step-reduce"><code>−(−Mammal) + (−Dog)</code><span class="step-note">"All non-mammals are non-dogs"</span></div>
            </div>

            <p>In English: negate both terms (<em>dog → non-dog, mammal → non-mammal</em>) and swap
            (the old predicate becomes subject, vice versa).</p>

            <div class="ex-table">
              <div class="ex-row"><code>−S + P  ∴  −(−P) + (−S)</code><span>A-form contraposes to A-form with negated, swapped terms</span></div>
            </div>

            <p>The O-form also contraposes:</p>
            <div class="syntax-box"><code>+S − P  ∴  +(−P) − (−S)</code></div>
            <p>"Some S is not P" becomes "Some non-P is not non-S."</p>

            <p>The I-form and E-form do <em>not</em> have a simple contrapositive.
            (E converts instead; I's contrapositive requires extra steps.)</p>

            <div class="grammar-rule">
              <span class="g-label">Contraposition Rule</span>
              A-form: negate both terms, swap. O-form: negate both terms, swap. I and E: contraposit differently or not at all.
            </div>
          `
        },

        // ── Concept: Obversion ───────────────────────────────────────────────
        {
          type: "concept",
          id: "obversion",
          title: "4. Obversion: The Built-In Equivalence",
          content: `
            <p><strong>Obversion</strong> is the logical equivalence between denying a predicate and
            affirming its complement. In TFL, this equivalence is <em>built into the contracted notation</em>:
            a negative copula (denial) and an affirmation of the complement collapse to the same sign.</p>

            <p>The algebraic rule is the <strong>Law of Obversion (Obv)</strong>:</p>
            <div class="syntax-box"><code>±X − (±Y)  =  ±X + (∓Y)</code></div>
            <p>Changing the copula sign flips the predicate's quality sign — and vice versa.</p>

            <p>The deep consequence: statements that look different in English turn out to be
            the <em>same proposition</em> in TFL's contracted form:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−S − P</code><span>"No S is P" = "All S is non-P" — both are E-form</span></div>
              <div class="ex-row"><code>−S + P</code><span>"All S is P" = "No S is non-P" — both are A-form</span></div>
              <div class="ex-row"><code>+S + P</code><span>"Some S is P" = "Some S is not non-P" — both are I-form</span></div>
              <div class="ex-row"><code>+S − P</code><span>"Some S is not P" = "Some S is non-P" — both are O-form</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Key Insight</span>
              Obversion isn't a rule you apply to get a different statement — it's the revelation that two phrasings ARE the same statement. TFL's sign algebra unifies them in a single contracted form.
            </div>
          `
        },

        // ── Exercise: Valid or Invalid Immediate Inference? ──────────────────
        {
          type: "exercise",
          id: "ex-immediate",
          title: "Quick Check: Valid or Invalid?",
          instruction: "Is this immediate inference valid?",
          kind: "valid-or-invalid",
          items: [
            {
              expr: "+S + P  ∴  +P + S",
              answer: "valid",
              explanation: "Valid — I-form conversion. The + copula is symmetric (+X+Y = +Y+X by Commutation). \"Some S is P\" implies and is implied by \"Some P is S.\""
            },
            {
              expr: "−S + P  ∴  −P + S",
              answer: "invalid",
              explanation: "Invalid — A-form cannot simply convert. \"All S is P\" does not imply \"All P is S.\" The − copula is not symmetric. (Example: \"All dogs are mammals\" does not mean \"All mammals are dogs.\")"
            },
            {
              expr: "−Whale − Fish  ∴  −Fish − Whale",
              answer: "valid",
              explanation: "Valid — E-form conversion. \"No whales are fish\" implies \"No fish are whales.\" The E-form converts simply."
            },
            {
              expr: "−S + P  ∴  −(−P) + (−S)",
              answer: "valid",
              explanation: "Valid — A-form contraposition. Negate both terms (P → −P, S → −S) and swap roles. \"All S is P\" becomes \"All non-P is non-S.\" This is the standard contrapositive."
            }
          ]
        },

        // ── Exercise: Name the Rule (Final) ─────────────────────────────────
        {
          type: "exercise",
          id: "ex-name-rule",
          isFinal: true,
          title: "Final Review: Name the Inference Rule",
          instruction: "Which immediate inference rule does each step apply?",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt('The step:', '+Wise + Philosopher  ∴  +Philosopher + Wise'),
              choices: ["Conversion (swapping terms)", "Contraposition (negating and swapping)", "Obversion (copula change)", "No valid rule — invalid"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Conversion: the I-form (+S+P) allows swapping subject and predicate to get +P+S. The + copula is symmetric."
            },
            {
              promptHtml: mcPrompt('The step:', '−Mammal + Mortal  ∴  −(−Mortal) + (−Mammal)'),
              choices: ["Conversion (swapping terms)", "Contraposition (negating and swapping)", "Obversion (copula change)", "No valid rule — invalid"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Contraposition: the A-form −S+P becomes −(−P)+(−S). Both terms are negated and their roles swap."
            },
            {
              promptHtml: mcPrompt('The equivalence:', '−Reptile − WarmBlooded  =  −Reptile + (−WarmBlooded)'),
              choices: ["Conversion (swapping terms)", "Contraposition (negating and swapping)", "Obversion (same proposition, two phrasings)", "Double Negation"],
              choicesAreCode: false,
              answer: 2,
              explanation: "Obversion: the two expressions are the same proposition in different surface forms. \"No reptile is warm-blooded\" = \"All reptiles are non-warm-blooded.\" Both are E-form in contracted notation."
            },
            {
              promptHtml: mcPrompt('The step:', '+Circle + Shape  ∴  −Shape + Circle'),
              choices: ["Conversion — valid", "Contraposition — valid", "Conversion — invalid (A-form doesn't convert)", "No valid rule — invalid"],
              choicesAreCode: false,
              answer: 3,
              explanation: "Invalid. This attempts to go from the I-form (+Circle+Shape = \"Some circles are shapes\") to a universal conclusion (−Shape+Circle = \"All shapes are circles\"), which doesn't follow at all. No immediate inference rule supports this."
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 5: The Syllogism
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-05",
      title: "Lesson 5: The Syllogism",
      description: "Learn TFL's algebraic method for syllogisms: add the premises, let the middle term cancel, and read off the conclusion.",
      completionText: "You've mastered TFL's core proof method: algebraic cancellation of the middle term. You can now test any first-figure syllogism for validity by pure sign arithmetic. In the final lesson, you'll apply this to all four valid first-figure moods and learn to diagnose the classic fallacies.",
      blocks: [

        // ── Concept: Structure of a Syllogism ───────────────────────────────
        {
          type: "concept",
          id: "syllogism-structure",
          title: "1. Structure of a Syllogism",
          content: `
            <p>A <strong>syllogism</strong> is an argument with exactly two premises and one conclusion,
            involving exactly three terms:</p>

            <ul>
              <li>The <strong>major term (P)</strong> — the predicate of the conclusion</li>
              <li>The <strong>minor term (S)</strong> — the subject of the conclusion</li>
              <li>The <strong>middle term (M)</strong> — appears in both premises, but <em>not</em> in the conclusion</li>
            </ul>

            <p>The middle term is the bridge between premises. It "connects" the major and minor terms
            indirectly. The conclusion directly connects the minor to the major.</p>

            <div class="proof-box">
              <div class="proof-row"><code>±M ± P</code><span class="proof-note">Major premise — connects M and P</span></div>
              <div class="proof-row"><code>±S ± M</code><span class="proof-note">Minor premise — connects S and M</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>±S ± P</code><span class="proof-note">Conclusion — connects S and P directly</span></div>
            </div>

            <p>The classic example — "All humans are mortal; Socrates is human; therefore Socrates is mortal" —
            has M = human, P = mortal, S = Socrates.</p>

            <div class="callout-note">
              <span class="cn-label">Terminology</span>
              The <em>first figure</em> is the arrangement where the middle term is the subject of the major premise and the predicate of the minor premise (as shown above). This is the most natural figure, and we'll focus on it in this lesson.
            </div>
          `
        },

        // ── Concept: The Algebraic Method ───────────────────────────────────
        {
          type: "concept",
          id: "algebraic-method",
          title: "2. The Algebraic Method: Middle Term Cancellation",
          content: `
            <p>Here is TFL's central insight about syllogistic reasoning:</p>

            <div class="grammar-rule">
              <span class="g-label">Core Rule</span>
              Write both premises as TFL expressions. Add them algebraically. If the middle term cancels, the sum is the conclusion — and the argument is valid.
            </div>

            <p>The middle term <strong>cancels</strong> when it appears with <em>opposite signs</em> in the two premises:
            one occurrence is <code>+M</code> and the other is <code>−M</code>.
            When you add them: <code>+M + (−M) = 0</code> — the M drops out.</p>

            <p>Why opposite signs? In the first figure:</p>
            <ul>
              <li>The major premise has M as its <strong>subject</strong>: M gets a <em>quantity sign</em>
                  (− for universal or + for particular)</li>
              <li>The minor premise has M as its <strong>predicate</strong>: M gets a
                  <em>quality sign</em> (+ for affirmed, − for denied)</li>
            </ul>

            <p>When the major premise is universal (−M) and the minor is affirmative (+M as predicate),
            the signs are opposite, so they cancel.</p>

            <div class="callout-note">
              <span class="cn-label">Analogy</span>
              Think of the middle term as a shared currency. One premise "produces" it (+M) and the other "consumes" it (−M). When they cancel, the debt is settled and you're left with a direct connection between S and P.
            </div>
          `
        },

        // ── Concept: Barbara — A Full Worked Example ─────────────────────────
        {
          type: "concept",
          id: "barbara-example",
          title: "3. Barbara: A Complete Example",
          content: `
            <p><strong>Barbara</strong> (AAA-1) is the most famous syllogism. All three propositions
            are A-forms, in the first figure:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−Mammal + Mortal</code><span class="proof-note">All mammals are mortal  (Major premise — A-form)</span></div>
              <div class="proof-row"><code>−Dog + Mammal</code><span class="proof-note">All dogs are mammals  (Minor premise — A-form)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>−Dog + Mortal</code><span class="proof-note">All dogs are mortal  (Conclusion — A-form)</span></div>
            </div>

            <p>The algebraic proof — add the premises and watch Mammal cancel:</p>

            <div class="step-trace">
              <div class="step"><code>(−Mammal + Mortal) + (−Dog + Mammal)</code></div>
              <div class="step step-reduce"><span>Collect the Mammal terms: −Mammal and +Mammal</span></div>
              <div class="step step-reduce"><code>−Dog + Mortal + (−Mammal + Mammal)</code></div>
              <div class="step step-reduce"><code>−Dog + Mortal + 0</code><span class="step-note">−Mammal + Mammal = 0 (they cancel)</span></div>
              <div class="step step-reduce"><code>−Dog + Mortal</code><span class="step-note">The conclusion — the middle term is gone ✓</span></div>
            </div>

            <p>In the major premise, Mammal is the <em>subject</em> (quantity sign: −Mammal).
            In the minor premise, Mammal is the <em>predicate</em> (quality sign: +Mammal).
            Opposite signs → they cancel. What's left is exactly the conclusion.</p>
          `
        },

        // ── Concept: The Validity Conditions ────────────────────────────────
        {
          type: "concept",
          id: "validity-conditions",
          title: "4. The Two Validity Conditions",
          content: `
            <p>A syllogism is valid in TFL if and only if <strong>both</strong> of these conditions hold:</p>

            <div class="syntax-box">
              <strong>Condition 1:</strong> The algebraic sum of the premises equals the conclusion<br>
              (the middle term cancels, leaving exactly S and P with the correct signs)<br><br>
              <strong>Condition 2 (Regularity):</strong> The argument must be <em>regular</em>:<br>
              &ensp;— <strong>U-regular:</strong> all premises and conclusion are universal (no + subject signs)<br>
              &ensp;— <strong>P-regular:</strong> exactly one particular premise, and the conclusion is particular
            </div>

            <p>Condition 1 is the cancellation check — the main workhorse.<br>
            Condition 2 (regularity) catches a subtle class of errors: you cannot draw a universal
            conclusion from a particular premise, nor a particular conclusion from all-universal
            premises. More than one particular premise makes an argument irregular and invalid.</p>

            <p>For the four standard first-figure moods:</p>
            <div class="ex-table">
              <div class="ex-row"><code>AAA (Barbara)</code><span>all universal — U-regular ✓</span></div>
              <div class="ex-row"><code>EAE (Celarent)</code><span>all universal — U-regular ✓</span></div>
              <div class="ex-row"><code>AII (Darii)</code><span>1 particular premise, particular conclusion — P-regular ✓</span></div>
              <div class="ex-row"><code>EIO (Ferio)</code><span>1 particular premise, particular conclusion — P-regular ✓</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">Test</span>
              Add the premises. Does the middle term cancel? Does the result equal the conclusion? Is the argument U-regular or P-regular? If yes to all: valid.
            </div>
          `
        },

        // ── Exercise: Middle Term Check ──────────────────────────────────────
        {
          type: "exercise",
          id: "ex-middle-term",
          title: "Quick Check: Middle Term Cancellation",
          instruction: "In each case, which term cancels (giving the middle term)?",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: premises('−Mammal + Mortal', '−Dog + Mammal'),
              choices: ["Dog cancels", "Mortal cancels", "Mammal cancels", "Nothing cancels"],
              choicesAreCode: false,
              answer: 2,
              explanation: "Mammal appears as −Mammal (subject in major) and +Mammal (predicate in minor). Opposite signs: −Mammal + Mammal = 0. The middle term is Mammal."
            },
            {
              promptHtml: premises('−Reptile − WarmBlooded', '−Snake + Reptile'),
              choices: ["Snake cancels", "WarmBlooded cancels", "Reptile cancels", "Nothing cancels"],
              choicesAreCode: false,
              answer: 2,
              explanation: "Reptile appears as −Reptile (subject in major) and +Reptile (predicate in minor). These cancel: −Reptile + Reptile = 0. The middle term is Reptile."
            },
            {
              promptHtml: premises('−P + M', '−S + M', 'Premises (invalid — what happens?):'),
              choices: ["M cancels (valid)", "S cancels (valid)", "M appears as +M in both — no cancellation (invalid)", "P cancels (valid)"],
              choicesAreCode: false,
              answer: 2,
              explanation: "M appears as +M (predicate) in BOTH premises. Same sign — they don't cancel. This is the fallacy of the Undistributed Middle. The sum gives −P + M − S + M, with two remaining +M terms. No valid conclusion."
            }
          ]
        },

        // ── Exercise: Valid Syllogism? (Final) ───────────────────────────────
        {
          type: "exercise",
          id: "ex-syllogism-valid",
          isFinal: true,
          title: "Final Review: Is This Syllogism Valid?",
          instruction: "Apply the cancellation method. Is each argument valid?",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl(
                [['−M + P', 'All M is P'], ['−S + M', 'All S is M']],
                ['−S + P', 'All S is P']
              ),
              answer: "valid",
              explanation: "Valid — Barbara (AAA-1). Sum: (−M+P) + (−S+M) = −S+P. The −M and +M cancel. The result exactly matches the conclusion."
            },
            {
              exprHtml: syl(
                [['−M + P', 'All M is P'], ['+S + M', 'Some S is M']],
                ['+S + P', 'Some S is P']
              ),
              answer: "valid",
              explanation: "Valid — Darii (AII-1). Sum: (−M+P) + (+S+M) = +S+P. The −M and +M cancel. 1 particular premise (minor), particular conclusion — P-regular ✓."
            },
            {
              exprHtml: syl(
                [['−M + P', 'All M is P'], ['+S + M', 'Some S is M']],
                ['−S + P', 'All S is P — claimed universal']
              ),
              answer: "invalid",
              explanation: "Invalid — regularity (Condition 2) fails. Cancellation works: (−M+P) + (+S+M) = +S+P (the −M and +M cancel). But the algebraic result +S+P is particular, while the claimed conclusion −S+P is universal. P-regular: with one particular premise, the conclusion must be particular. The correct valid conclusion from these premises is +S+P — Darii (AII-1), not a universal claim."
            },
            {
              exprHtml: syl(
                [['−P + M', 'All P is M'], ['−S + M', 'All S is M']],
                ['−S + P', 'All S is P']
              ),
              answer: "invalid",
              explanation: "Invalid — Undistributed Middle. M appears as +M (predicate) in BOTH premises. Same sign, so they don't cancel: (−P+M) + (−S+M) = −P − S + 2M. The M doesn't vanish, and the sum doesn't equal −S+P. This is the classic \"Undistributed Middle\" fallacy."
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 6: Named Patterns and the Figure Tradition
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-06",
      title: "Lesson 6: Named Patterns and the Figure Tradition",
      description: "See TFL's method in action on the classic syllogistic patterns — and discover why the medieval figure system it replaces needed hundreds of years of mnemonics to do what two conditions now handle in seconds.",
      completionText: "You've seen TFL's algebra handle every arrangement of the middle term without changing a single rule. The centuries-old tradition of syllogistic figures — Barbara, Celarent, and all the rest — is now just a historical footnote. Two conditions replace the whole system. Coming up: singular terms with their special wild-quantity ±, and then the crowning demonstration that modus ponens is just a syllogism in disguise.",
      blocks: [

        // ── Concept: The Figure Tradition ────────────────────────────────────
        {
          type: "concept",
          id: "figure-tradition",
          title: "1. The Figure Tradition",
          content: `
            <p>Aristotle's <em>Prior Analytics</em> (c. 350 BCE) introduced the first formal system of logic.
            He noticed that in any valid two-premise argument, three terms appear: a subject (S), a predicate (P),
            and a middle term (M) that links them. He then organized valid syllogisms into <strong>figures</strong>
            based on where M sits in each premise.</p>

            <p>Medieval logicians extended this into an elaborate taxonomy. Each figure had several valid
            "moods," and the names given to each mood encoded its A/E/I/O pattern in their vowels:</p>

            <div class="ex-table">
              <div class="ex-row"><code>Barbara</code><span>vowels A-A-A — three universal affirmatives</span></div>
              <div class="ex-row"><code>Celarent</code><span>vowels E-A-E — universal negative, universal affirmative, universal negative</span></div>
              <div class="ex-row"><code>Darii</code><span>vowels A-I-I — universal affirmative, particular, particular</span></div>
              <div class="ex-row"><code>Ferio</code><span>vowels E-I-O — universal negative, particular, particular negative</span></div>
              <div class="ex-row"><code>Cesare, Camestres…</code><span>the valid moods of the second figure</span></div>
              <div class="ex-row"><code>Darapti, Disamis…</code><span>the valid moods of the third figure</span></div>
            </div>

            <p>Students of logic memorized dozens of these names across four figures — each figure with its
            own rules, its own valid moods, its own mnemonic devices. This remained the dominant approach
            to formal inference for over two thousand years.</p>

            <p>The figure system works, and it is complete. But it answers the question <em>"which
            configurations are valid?"</em> by enumeration rather than by principle. There is no single
            underlying rule explaining why these moods and not others — only the accumulated taxonomy.</p>

            <p>TFL replaces all of it with two conditions. Let's see the classic patterns first.</p>
          `
        },

        // ── Concept: Four Classic Patterns ──────────────────────────────────
        {
          type: "concept",
          id: "four-classic-patterns",
          title: "2. Four Classic Patterns",
          content: `
            <p>The four patterns Aristotle identified as his "first figure" are the most natural starting
            point. In each one, M is the <strong>subject</strong> of the major premise and the
            <strong>predicate</strong> of the minor. This arrangement puts M in positions that guarantee
            opposite signs: as a universal subject M gets −M, and as an affirmed predicate it gets +M.
            Opposite signs cancel automatically.</p>

            <p><strong>Barbara</strong> — All M is P; All S is M; ∴ All S is P</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M + P</code><span class="proof-note">All M is P  (A-form)</span></div>
              <div class="proof-row"><code>−S + M</code><span class="proof-note">All S is M  (A-form)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>−S + P</code><span class="proof-note">All S is P  — M cancels: −M + (+M) = 0</span></div>
            </div>

            <p><em>Example:</em> All mammals are mortal. All dogs are mammals. ∴ All dogs are mortal.</p>

            <hr class="section-divider">

            <p><strong>Celarent</strong> — No M is P; All S is M; ∴ No S is P</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M − P</code><span class="proof-note">No M is P  (E-form)</span></div>
              <div class="proof-row"><code>−S + M</code><span class="proof-note">All S is M  (A-form)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>−S − P</code><span class="proof-note">No S is P  — M cancels ✓</span></div>
            </div>

            <p><em>Example:</em> No reptiles are warm-blooded. All snakes are reptiles. ∴ No snakes are warm-blooded.</p>

            <hr class="section-divider">

            <p><strong>Darii</strong> — All M is P; Some S is M; ∴ Some S is P</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M + P</code><span class="proof-note">All M is P  (A-form)</span></div>
              <div class="proof-row"><code>+S + M</code><span class="proof-note">Some S is M  (I-form)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+S + P</code><span class="proof-note">Some S is P  — M cancels ✓  |  P-regular ✓</span></div>
            </div>

            <p><em>Example:</em> All mammals are warm-blooded. Some animals are mammals. ∴ Some animals are warm-blooded.</p>

            <hr class="section-divider">

            <p><strong>Ferio</strong> — No M is P; Some S is M; ∴ Some S is not P</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M − P</code><span class="proof-note">No M is P  (E-form)</span></div>
              <div class="proof-row"><code>+S + M</code><span class="proof-note">Some S is M  (I-form)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+S − P</code><span class="proof-note">Some S is not P  — M cancels ✓  |  P-regular ✓</span></div>
            </div>

            <p><em>Example:</em> No fish are mammals. Some aquatic creatures are fish. ∴ Some aquatic creatures are not mammals.</p>
          `
        },

        // ── Concept: The Second Figure ───────────────────────────────────────
        {
          type: "concept",
          id: "second-figure-demo",
          title: "3. The Second Figure — And What That Tells Us",
          content: `
            <p>In Aristotle's "second figure," M is the <strong>predicate in both premises</strong>.
            On the surface this looks like trouble: if M appears in the same position twice, won't it
            carry the same sign and fail to cancel?</p>

            <p>Not necessarily. The sign on a predicate is its <em>quality</em> sign — + if the term is
            affirmed, − if denied. When one premise affirms M as predicate and the other denies it,
            the signs are still opposite, and cancellation still works.</p>

            <p><strong>Cesare</strong> — No P is M; All S is M; ∴ No S is P</p>

            <div class="proof-box">
              <div class="proof-row"><code>−P − M</code><span class="proof-note">No P is M  (E-form — M denied: −M)</span></div>
              <div class="proof-row"><code>−S + M</code><span class="proof-note">All S is M  (A-form — M affirmed: +M)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>−S − P</code><span class="proof-note">No S is P  — −M and +M cancel ✓</span></div>
            </div>

            <div class="step-trace">
              <div class="step"><code>(−P − M) + (−S + M)</code></div>
              <div class="step step-reduce"><code>−P − S + (−M + M)</code></div>
              <div class="step step-reduce"><code>−S − P</code><span class="step-note">M cancels ✓  |  U-regular ✓</span></div>
            </div>

            <p><em>Example:</em> No reptile is warm-blooded. All snakes are warm-blooded. ∴ No snake is a reptile.</p>

            <p>Notice what TFL's algebra does <em>not</em> notice: whether M is the subject or the predicate
            of each premise. It only sees the signs. The "figure" — the structural position of M — is
            invisible to the calculation. <strong>What matters is that M's signs are opposite.</strong>
            Where M sits is irrelevant.</p>

            <div class="callout-note">
              <span class="cn-label">The Payoff</span>
              The medieval logician had to ask: "Which figure is this? What moods are valid in that figure?"
              and then consult a memorized list. TFL asks only: do the signs on M cancel? Does the
              argument regular (U-regular or P-regular)? Two conditions replace the entire taxonomy.
            </div>
          `
        },

        // ── Concept: Invalid Syllogisms ──────────────────────────────────────
        {
          type: "concept",
          id: "invalid-syllogisms",
          title: "4. What Makes a Syllogism Invalid?",
          content: `
            <p>When a syllogism fails, TFL's algebra diagnoses exactly <em>why</em>.
            The three classic failure modes:</p>

            <p><strong>1. Undistributed Middle</strong> — M carries the same sign in both premises.
            No cancellation is possible.</p>

            <div class="proof-box">
              <div class="proof-row"><code>−P + M</code><span class="proof-note">All P is M  (M as predicate, affirmed: +M)</span></div>
              <div class="proof-row"><code>−S + M</code><span class="proof-note">All S is M  (M as predicate, affirmed: +M again)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴?</span><code>−S + P</code><span class="proof-note">Claimed — but sum is −P − S + 2M. M cannot cancel ✗</span></div>
            </div>

            <p>This is the same sign problem in all figures. A second-figure syllogism with +M in both
            premises fails just as surely as a first-figure one — the algebra catches it either way.</p>

            <p><strong>2. Illicit Major / Illicit Minor</strong> — a term has more generality in the
            conclusion than the premises warrant. TFL surfaces this as the wrong sign on S or P in
            the sum.</p>

            <p><strong>3. Regularity failure (Condition 2)</strong> — the sign arithmetic produces
            the right terms but the argument is irregular: a particular premise with a universal conclusion.</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M + P</code><span class="proof-note">All M is P (universal)</span></div>
              <div class="proof-row"><code>+S + M</code><span class="proof-note">Some S is M (particular)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴?</span><code>−S + P</code><span class="proof-note">Claimed universal — P-regular requires a particular conclusion ✗</span></div>
            </div>

            <p>The sum does yield +S+P (M cancels cleanly), but regularity (Condition 2) fails: with
            one particular premise the argument must be P-regular — the conclusion must be particular.
            −S+P is universal. The valid conclusion is <em>+S+P</em> (Darii).</p>

            <div class="grammar-rule">
              <span class="g-label">Diagnosis</span>
              Always check both: (1) Do M's signs cancel? (2) Is the argument regular (U-regular or P-regular)?
              Both must hold — regardless of figure.
            </div>
          `
        },

        // ── Exercise: Pattern Validity Check ─────────────────────────────────
        {
          type: "exercise",
          id: "ex-valid-patterns",
          title: "Quick Check: Valid or Invalid?",
          instruction: "Apply the two conditions. Does M cancel with opposite signs? Is the argument regular (U-regular or P-regular)?",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl(
                [['−M − P', 'Celarent'], '−S + M'],
                '−S − P'
              ),
              answer: "valid",
              explanation: "Valid — Celarent. Sum: (−M−P) + (−S+M) = −S−P. The −M and +M cancel. All universal — U-regular ✓"
            },
            {
              exprHtml: syl(
                [['−M − P', 'Ferio'], '+S + M'],
                '+S − P'
              ),
              answer: "valid",
              explanation: "Valid — Ferio. Sum: (−M−P) + (+S+M) = +S−P. M cancels. P-regular: 1 particular premise, particular conclusion ✓"
            },
            {
              exprHtml: syl(
                [['−P − M', 'Cesare (second figure)'], '−S + M'],
                '−S − P'
              ),
              answer: "valid",
              explanation: "Valid — Cesare. M is the predicate in both premises, but the signs differ: −M (denied) in the major and +M (affirmed) in the minor. Sum: (−P−M) + (−S+M) = −S−P. M cancels ✓. U-regular: all universal ✓. The figure is different from the first three items — the algebra doesn't care."
            },
            {
              exprHtml: syl(
                [['−M + P', 'same sign on M'], '−S − M'],
                '−S + P'
              ),
              answer: "invalid",
              explanation: "Invalid — same sign on M in both premises. Major has −M (subject, universal); minor has −M (predicate, denied). Both occurrences are −M — cancellation requires opposite signs (+M in one, −M in the other). Sum: (−M+P) + (−S−M) = −P−S−2M. M persists, no valid conclusion."
            },
            {
              exprHtml: syl(
                [['−M + P', 'Condition 2 failure'], '+S + M'],
                ['−S + P', 'claimed universal']
              ),
              answer: "invalid",
              explanation: "Invalid — regularity (Condition 2) fails. Cancellation works (sum gives +S+P), but the claimed conclusion −S+P is universal while one premise is particular. P-regular: with 1 particular premise the conclusion must be particular. The valid conclusion is +S+P, not −S+P."
            }
          ]
        },

        // ── Exercise: Mixed Validity (Final) ─────────────────────────────────
        {
          type: "exercise",
          id: "ex-mixed-final",
          isFinal: true,
          title: "Final Review: Valid or Invalid?",
          instruction: "Each argument uses real content. Transcribe to TFL and test both conditions.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: engSyl('All mammals are warm-blooded', 'All dogs are mammals', 'All dogs are warm-blooded'),
              answer: "valid",
              explanation: "Valid — Barbara. TFL: (−Mammal+Warm) + (−Dog+Mammal) = −Dog+Warm. Both universal, universal conclusion. Mammal cancels ✓"
            },
            {
              exprHtml: engSyl('No reptiles are warm-blooded', 'Some animals are reptiles', 'Some animals are not warm-blooded'),
              answer: "valid",
              explanation: "Valid — Ferio. TFL: (−Reptile−Warm) + (+Animal+Reptile) = +Animal−Warm. Reptile cancels. P-regular: 1 particular premise, particular conclusion ✓"
            },
            {
              exprHtml: engSyl('All athletes are disciplined', 'All athletes are healthy', 'All healthy people are disciplined'),
              answer: "invalid",
              explanation: "Invalid — Undistributed Middle. TFL: (−Athlete+Disciplined) + (−Athlete+Healthy). Athlete appears as the subject in both premises (−Athlete twice). It never appears as a predicate with +M, so the signs are never opposite — cancellation is impossible."
            },
            {
              exprHtml: engSyl('All philosophers love wisdom', 'Some students are philosophers', 'Some students love wisdom'),
              answer: "valid",
              explanation: "Valid — Darii. TFL: (−Philosopher+Wisdom) + (+Student+Philosopher) = +Student+Wisdom. Philosopher cancels (−Philosopher and +Philosopher). P-regular: 1 particular premise, particular conclusion ✓"
            },
            {
              exprHtml: engSyl('No fish are mammals', 'All whales are mammals', 'No whales are fish'),
              answer: "valid",
              explanation: "Valid — Cesare (second figure). TFL: (−Fish−Mammal) + (−Whale+Mammal) = −Whale−Fish. Mammal cancels (−Mammal and +Mammal). U-regular: all universal ✓. The figure is different from Barbara and Celarent — the algebra handles it identically."
            },
            {
              exprHtml: engSyl('Some birds can fly', 'All penguins are birds', 'All penguins can fly'),
              answer: "invalid",
              explanation: "Invalid — same sign on the middle term. TFL: major = +Bird+Fly (I-form: 'some birds can fly'); minor = −Penguin+Bird (A-form). In the major, Bird is the subject with + (particular); in the minor, Bird is the predicate with + (affirmed). Both occurrences are +Bird — same sign, no cancellation. A particular major premise about birds cannot ground a universal conclusion about penguins."
            }
          ]
        }
      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 7: Singular Terms
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-07",
      title: "Lesson 7: Singular Terms",
      description: "Learn how TFL handles proper names and definite descriptions — terms that name exactly one thing — and why they get a special wild quantity sign.",
      completionText: "Singular terms slot into TFL's algebra almost without friction — once you see that ± is just what happens when the all/some distinction collapses to a single individual. In the next lesson, you'll see something remarkable: propositional logic — if-then, and, or — is not a separate system but a special case of term logic. Modus ponens is secretly a Barbara in disguise.",
      blocks: [

        // ── Concept: Singular vs. General Terms ─────────────────────────────
        {
          type: "concept",
          id: "singular-vs-general",
          title: "1. Singular vs. General Terms",
          content: `
            <p>Every term we have seen so far has been a <strong>general term</strong> — a word that names
            a kind, a class that many individuals can belong to:</p>

            <div class="ex-table">
              <div class="ex-row"><code>philosopher</code><span>many things are philosophers</span></div>
              <div class="ex-row"><code>mortal</code><span>many things are mortal</span></div>
              <div class="ex-row"><code>prime number</code><span>many things are prime numbers</span></div>
              <div class="ex-row"><code>warm-blooded</code><span>many things are warm-blooded</span></div>
            </div>

            <p>A <strong>singular term</strong> names exactly one specific individual — one and only one
            thing, by design:</p>

            <div class="ex-table">
              <div class="ex-row"><code>Socrates</code><span>one specific person</span></div>
              <div class="ex-row"><code>Aristotle</code><span>one specific person</span></div>
              <div class="ex-row"><code>the Eiffel Tower</code><span>one specific structure</span></div>
              <div class="ex-row"><code>the number 7</code><span>one specific number</span></div>
              <div class="ex-row"><code>the planet Mars</code><span>one specific planet</span></div>
            </div>

            <p>Proper names and definite descriptions ("the X") are the two main kinds of singular term.
            The distinction matters for quantity, as you are about to see.</p>

            <div class="grammar-rule">
              <span class="g-label">Test</span>
              Can more than one thing be this? If yes: general term. If no, by definition: singular term.
            </div>
          `
        },

        // ── Concept: Wild Quantity ───────────────────────────────────────────
        {
          type: "concept",
          id: "wild-quantity",
          title: "2. Wild Quantity: Why ±",
          content: `
            <p>Recall that when a sign appears on the subject, it encodes quantity:</p>
            <div class="ex-table">
              <div class="ex-row"><code>+Philosopher</code><span>"some philosophers" — particular</span></div>
              <div class="ex-row"><code>−Philosopher</code><span>"all philosophers" — universal</span></div>
            </div>

            <p>This distinction carries real information for general terms. "Some philosophers are wise"
            and "All philosophers are wise" are very different claims — most philosophers would hope
            the first is true but would not dare assert the second.</p>

            <p>Now consider the same distinction applied to a singular term:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+Socrates</code><span>"some Socrates"</span></div>
              <div class="ex-row"><code>−Socrates</code><span>"all Socrates"</span></div>
            </div>

            <p>There is only one Socrates. "Some Socrates is wise" and "All Socrates is wise" say
            the exact same thing — both mean simply "Socrates is wise," and they are true or false
            together for exactly the same reason. The all/some distinction carries no information
            when the subject names exactly one individual.</p>

            <p>TFL captures this with the <strong>wild quantity sign ±</strong>: a singular subject
            is neither committed to + nor to −, but holds both simultaneously. It can function
            as either as the argument requires — and it always will, because both readings are
            equivalent.</p>

            <div class="syntax-box">±T  =  a singular subject — wild quantity</div>

            <div class="callout-note">
              <span class="cn-label">The ± Symbol</span>
              You have seen ± in the course header. There it represents TFL's algebraic spirit generally.
              Here it has a precise technical meaning: a singular term's quantity is wild — + and − are
              both true of it, because for a unique individual the two readings collapse to one.
            </div>
          `
        },

        // ── Concept: Writing Singular Statements ─────────────────────────────
        {
          type: "concept",
          id: "singular-notation",
          title: "3. Singular Statements in TFL",
          content: `
            <p>Singular statements follow exactly the same S — functor — P structure as all other
            categorical statements. The only differences are (1) the ± on the subject, and (2) an
            <strong>asterisk (*)</strong> on the singular term itself — the mark that it is
            <strong>uniquely-denoting</strong>:</p>

            <div class="ex-table">
              <div class="ex-row"><code>±Socrates* + Wise</code><span>"Socrates is wise"</span></div>
              <div class="ex-row"><code>±Socrates* + Mortal</code><span>"Socrates is mortal"</span></div>
              <div class="ex-row"><code>±Aristotle* + Philosopher</code><span>"Aristotle is a philosopher"</span></div>
              <div class="ex-row"><code>±EiffelTower* − Bridge</code><span>"The Eiffel Tower is not a bridge"</span></div>
              <div class="ex-row"><code>±Mars* − Star</code><span>"Mars is not a star"</span></div>
            </div>

            <p>The asterisk is called a <strong>UDT marker</strong> (uniquely-denoting term marker).
            It flags the term as referring to exactly one individual — contrasting with general terms
            like "philosopher" which can apply to many. The asterisk carries no algebraic weight;
            it is purely a notational tag.</p>

            <p>The predicate still carries a regular + or − quality sign — only the subject is wild.
            The functor for a singular statement is (±, +) for affirmative and (±, −) for negative.</p>

            <p><strong>A special case: identity.</strong> When two singular terms are connected, both
            slots carry ± and both get the asterisk. This is the <em>is</em> of identity rather
            than the <em>is</em> of predication:</p>

            <div class="ex-table">
              <div class="ex-row"><code>±MarkTwain* ± SamuelClemens*</code><span>"Mark Twain is Samuel Clemens" — identity</span></div>
              <div class="ex-row"><code>±Hesperus* ± Phosphorus*</code><span>"The morning star is the evening star" — identity</span></div>
              <div class="ex-row"><code>±Socrates* ± Socrates*</code><span>"Socrates is Socrates" — trivial self-identity</span></div>
            </div>

            <p>In an identity statement the predicate term is also singular, so it too gets ± and *.
            Both singular terms name the same one individual — they are interchangeable in either slot.</p>

            <div class="callout-note">
              <span class="cn-label">Predication vs. Identity</span>
              "Socrates is wise" (±Socrates* + Wise) — predicative: a singular UDT connected to a general term.<br>
              "Mark Twain is Samuel Clemens" (±MarkTwain* ± SamuelClemens*) — identity: two UDTs connected.<br>
              The predicate slot tells you which: a general term there means predication; a UDT there means identity.
            </div>
          `
        },

        // ── Exercise: Quick Check ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-singular-notation",
          title: "Quick Check: Singular Terms",
          instruction: "Apply what you know about singular terms and wild quantity.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which of these is a singular term?",
              choices: ["philosopher", "mortal", "Aristotle", "warm-blooded"],
              choicesAreCode: false,
              answer: 2,
              explanation: "\"Aristotle\" names exactly one specific person — a singular term. The others are general terms: many things can be philosophers, mortals, or warm-blooded."
            },
            {
              prompt: "How do you write \"Aristotle is a philosopher\" in TFL?",
              choices: ["−Aristotle* + Philosopher", "+Aristotle* + Philosopher", "±Aristotle* + Philosopher", "±Aristotle − Philosopher"],
              choicesAreCode: true,
              answer: 2,
              explanation: "Aristotle is a singular term (a proper name) → ± on the subject and * as the UDT marker. \"Philosopher\" is the positive predicate, affirmed → +Philosopher. Result: ±Aristotle* + Philosopher."
            },
            {
              prompt: "How do you write \"The number 2 is not odd\" in TFL?",
              choices: ["±Two* + Odd", "+Two* − Odd", "−Two* − Odd", "±Two* − Odd"],
              choicesAreCode: true,
              answer: 3,
              explanation: "\"The number 2\" is a singular term (a definite description) → ± and *. \"Odd\" is the predicate, denied (\"is not\") → −Odd. Result: ±Two* − Odd."
            },
            {
              prompt: "Why does a singular subject get ± rather than + or −?",
              choices: [
                "Because singular terms are always universal",
                "Because there is only one individual, so \"some\" and \"all\" mean the same thing",
                "Because singular terms cannot appear in syllogisms",
                "Because + and − cancel when applied to a proper name"
              ],
              choicesAreCode: false,
              answer: 1,
              explanation: "When exactly one individual satisfies the term, \"some Socrates is wise\" and \"all Socrates is wise\" say the same thing. The all/some distinction carries no information, so the quantity is wild: ±."
            }
          ]
        },

        // ── Concept: Singular Syllogisms ────────────────────────────────────
        {
          type: "concept",
          id: "singular-syllogisms",
          title: "4. Singular Syllogisms",
          content: `
            <p>Singular terms fit naturally into syllogisms. They typically appear in the
            <strong>minor premise</strong>, linking an individual to the middle-term kind:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−Human + Mortal</code><span class="proof-note">All humans are mortal  (major: A-form)</span></div>
              <div class="proof-row"><code>±Socrates* + Human</code><span class="proof-note">Socrates is human  (minor: singular UDT)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>±Socrates* + Mortal</code><span class="proof-note">Socrates is mortal  (conclusion: singular)</span></div>
            </div>

            <p>The cancellation works exactly as before — the wild ± acts as + in the predicate
            slot of the minor premise, giving the familiar −M / +M opposition:</p>

            <div class="step-trace">
              <div class="step"><code>(−Human + Mortal) + (±Socrates* + Human)</code></div>
              <div class="step step-reduce"><span>Human in major: −Human (subject, universal). Human in minor: +Human (predicate, affirmed).</span></div>
              <div class="step step-reduce"><code>±Socrates* + Mortal + (−Human + Human)</code></div>
              <div class="step step-reduce"><code>±Socrates* + Mortal + 0</code><span class="step-note">Human cancels ✓</span></div>
              <div class="step step-reduce"><code>±Socrates* + Mortal</code><span class="step-note">"Socrates is mortal" ✓</span></div>
            </div>

            <p><strong>Regularity (Condition 2) with wild quantity.</strong> For regularity, ± counts as +
            (particular). So this argument has 1 particular premise (the singular minor) and a
            particular conclusion (the singular result) — P-regular ✓.</p>

            <div class="callout-note">
              <span class="cn-label">Structure</span>
              A singular syllogism is essentially a Darii or Ferio with the minor premise's subject being
              a unique individual rather than a general "some." The algebra is identical; only the
              interpretation of ± differs from plain +.
            </div>
          `
        },

        // ── Exercise: Singular Syllogisms (Final) ────────────────────────────
        {
          type: "exercise",
          id: "ex-singular-syllogisms",
          isFinal: true,
          title: "Final Review: Singular Syllogisms",
          instruction: "Apply the cancellation method. Remember: ± acts as + for predicate quality and for regularity (Condition 2).",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: engSyl('All reptiles are cold-blooded', 'Rex (a T-Rex) is a reptile', 'Rex is cold-blooded'),
              answer: "valid",
              explanation: "Valid — singular Barbara. TFL: (−Reptile + ColdBlooded) + (±Rex* + Reptile) = ±Rex* + ColdBlooded. Reptile cancels: −Reptile (major subject) and +Reptile (minor predicate). P-regular: 1 singular premise, singular conclusion ✓"
            },
            {
              exprHtml: engSyl('No planet is a star', 'Mars is a planet', 'Mars is not a star'),
              answer: "valid",
              explanation: "Valid — singular Celarent. TFL: (−Planet − Star) + (±Mars* + Planet) = ±Mars* − Star. Planet cancels: −Planet (major subject) and +Planet (minor predicate). P-regular: 1 singular premise, singular conclusion ✓"
            },
            {
              exprHtml: engSyl('All philosophers are wise', 'Socrates is wise', 'Socrates is a philosopher'),
              answer: "invalid",
              explanation: "Invalid — Undistributed Middle. TFL: (−Philosopher + Wise) + (±Socrates* + Wise). Wise appears as +Wise in the predicate of both premises. Same sign — no cancellation. The middle term was never distributed universally in a subject position. (This is the fallacy of affirming the consequent in categorical form. Being wise does not make someone a philosopher.)"
            },
            {
              exprHtml: engSyl('Socrates is mortal', 'Aristotle is mortal', 'Socrates is Aristotle'),
              answer: "invalid",
              explanation: "Invalid — no middle term cancels. TFL: (±Socrates* + Mortal) + (±Aristotle* + Mortal). Mortal appears as +Mortal (predicate) in both premises. Same sign — no cancellation. Two things sharing a property tells you nothing about whether they are the same individual. The conclusion ±Socrates* ± Aristotle* does not follow from these premises."
            }
          ]
        }

      ]
    },


    // ════════════════════════════════════════════════════════════════════════
    // LESSON 8: Statement Logic as Term Logic
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-08",
      title: "Lesson 8: Statement Logic as Term Logic",
      description: "Discover that modus ponens is secretly Barbara in disguise — propositional logic is not a separate system but a special case of TFL.",
      completionText: "Propositional connectives are categorical forms, and every propositional inference is a syllogism. The algebraic method you've been using since Lesson 5 works here without modification. This is Sommers' most striking result: TFL does not merely parallel modern logic — it subsumes it.",
      blocks: [

        // ── Concept: Propositions as Terms ──────────────────────────────────
        {
          type: "concept",
          id: "prop-terms-intro",
          title: "1. Propositions as Terms",
          content: `
            <p>Every proposition can be <strong>treated as a term</strong> — a kind of thing that
            states of affairs can belong to. Write <code>p</code>, <code>q</code>, etc. as term
            letters for propositions, exactly as you would write <code>M</code>, <code>S</code>,
            <code>P</code> for ordinary kinds.</p>

            <p>What does <code>p</code> name as a term? The <strong>class of states of affairs
            where p is true</strong> — the situations in which p holds. Just as
            <code>Dog</code> names the kind "things that are dogs," <code>Rain</code>
            names the kind "situations in which it is raining."</p>

            <div class="ex-table">
              <div class="ex-row"><code>p</code><span>the kind: situations where p holds</span></div>
              <div class="ex-row"><code>q</code><span>the kind: situations where q holds</span></div>
              <div class="ex-row"><code>(−p)</code><span>the kind: situations where p does NOT hold — the complement of p</span></div>
            </div>

            <p>In TFL's sign notation, the complement of a term T is <code>−T</code>.
            So situations where p is false form the class <code>(−p)</code> — the negative of p.
            One notation, two readings.</p>

            <p>Once p becomes a term, it fills either slot in a categorical statement, and the
            standard sign algebra applies. The result: <em>every propositional connective is a
            categorical form.</em></p>

            <div class="grammar-rule">
              <span class="g-label">Key Move</span>
              Treat any proposition p as a TFL term. The sign algebra applies unchanged. Propositional logic becomes term logic.
            </div>
          `
        },

        // ── Concept: Connectives as Categorical Forms ────────────────────────
        {
          type: "concept",
          id: "connectives-as-forms",
          title: "2. Connectives as Categorical Forms",
          content: `
            <p>With propositional terms in hand, the major connectives fall directly into TFL's forms:</p>

            <div class="syntax-box">
              <table>
                <tr><td>if p then q</td><td><code>−p + q</code></td><td>A-form</td></tr>
                <tr><td>p (as a premise)</td><td><code>+p+p</code></td><td>I-form self-predication: p holds</td></tr>
                <tr><td>not-p (as a premise)</td><td><code>+(−p)+(−p)</code></td><td>I-form: the fact ¬p holds</td></tr>
              </table>
            </div>

            <p><strong>"If p then q" = −p + q</strong></p>
            <p>Read it: "All p-situations are q-situations." Wherever p holds, q holds too.
            This is the A-form with p as universal subject (−p) and q as affirmed predicate (+q).
            Compare:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Dog + Mammal</code><span>"All dog-things are mammal-things"</span></div>
              <div class="ex-row"><code>−p + q</code><span>"All p-situations are q-situations" = "if p then q"</span></div>
            </div>

            <p><strong>"p" (as a bare premise) = +p+p</strong></p>
            <p>A proposition used as a premise — "p is true, right now" — is an <em>I-form
            self-predication</em>: "some p-situation is a p-situation." In the singleton universe
            (the actual world only), this simply means p holds. Writing <code>+p+p</code> uses
            p as both subject and predicate — the actual world belongs to the class p. For
            regularity (Condition 2), the + subject counts as particular.</p>

            <div class="callout-note">
              <span class="cn-label">Note</span>
              "p and q," "p or q," and the biconditional also have TFL translations. The conditional is the key piece because it makes modus ponens work as Barbara — and that is the main event.
            </div>
          `
        },

        // ── Concept: Modus Ponens Is Barbara ────────────────────────────────
        {
          type: "concept",
          id: "modus-ponens-barbara",
          title: "3. Modus Ponens Is Barbara",
          content: `
            <p>Here is the payoff. Modus ponens — the most fundamental rule of propositional
            logic — is exactly <strong>Barbara (AAA-1)</strong> when the terms are propositional:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−p + q</code><span class="proof-note">If p then q  (A-form — major premise)</span></div>
              <div class="proof-row"><code>+p+p</code><span class="proof-note">p  (I-form self-predication — minor premise)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+q+p</code><span class="proof-note">q (and p) — conclusion: q holds ✓</span></div>
            </div>

            <p>The algebraic proof — <code>p</code> is the middle term, and it cancels:</p>

            <div class="step-trace">
              <div class="step"><code>(−p + q) + (+p+p)</code></div>
              <div class="step step-reduce"><span>p in major: −p (subject, universal). p in minor subject: +p (particular).</span></div>
              <div class="step step-reduce"><code>q + p + (−p + p)</code></div>
              <div class="step step-reduce"><code>+q+p</code><span class="step-note">−p + p = 0 — the middle term p cancels ✓</span></div>
            </div>

            <p>The conclusion <code>+q+p</code> means "q and p both hold" — the I-form conjunction.
            <code>+p</code> is the predicate from the minor's self-predication: we already knew p
            from the minor premise, so the new information is <strong>q holds</strong>.</p>

            <p><strong>Regularity (Condition 2):</strong> minor premise +p+p has a + subject
            (particular). Conclusion +q+p has a + subject (particular). P-regular ✓.</p>

            <p>This is not an analogy. Modus ponens <em>is</em> Barbara with propositional terms.
            The cancellation is the same algebraic operation, the validity conditions are the same
            two conditions. There is one system of logic, not two.</p>

            <div class="callout-note">
              <span class="cn-label">Barbara Again</span>
              General terms: (−M+P) + (−S+M) = −S+P. Propositional terms: (−p+q) + (+p+p) = +q+p. The algebra is identical. p plays the role of M — universal subject of the major, particular subject of the minor.
            </div>
          `
        },

        // ── Exercise: Propositional Forms ────────────────────────────────────
        {
          type: "exercise",
          id: "ex-prop-forms",
          title: "Quick Check: Propositional Forms",
          instruction: "Apply TFL's framework to propositional logic.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which categorical form is \"if p then q\"?",
              choices: ["A-form:  −p + q", "E-form:  −p − q", "I-form:  +p + q", "O-form:  +p − q"],
              choicesAreCode: true,
              answer: 0,
              explanation: "\"If p then q\" = \"All p-situations are q-situations\" — universal affirmative. −p is the universal subject (all p-situations), +q is the affirmed predicate. A-form: −p+q."
            },
            {
              prompt: "In modus ponens, what is the middle term?",
              choices: ["q  (the consequent)", "p  (the antecedent)", "r  (a third proposition)", "There is no middle term"],
              choicesAreCode: true,
              answer: 1,
              explanation: "p is the middle term. It appears as −p in the major premise (subject, universal) and as +p in the minor's subject (particular, from +p+p). Opposite signs → p cancels. What remains is +q+p (q and p both hold); the new information is q."
            },
            {
              prompt: "A bare proposition p, used as a premise, is written in TFL as:",
              choices: ["+p+p  (I-form self-predication)", "−p+p  (A-form)", "+p−p  (O-form)", "±p  (wild quantity singular)"],
              choicesAreCode: true,
              answer: 0,
              explanation: "+p+p is the I-form self-predication: \"some p-situation is a p-situation.\" In the singleton universe (the actual world only), this means p holds. The + subject counts as particular for regularity (Condition 2)."
            },
            {
              prompt: "Hypothetical syllogism (if p→q, if q→r, therefore if p→r) corresponds to which mood?",
              choices: ["Barbara (AAA-1)", "Celarent (EAE-1)", "Darii (AII-1)", "Ferio (EIO-1)"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Hypothetical syllogism is Barbara with propositional terms. TFL: (−q+r) + (−p+q) = −p+r. q appears as −q (subject of first premise, universal) and +q (predicate of second, affirmed). Opposite signs → q cancels. Three A-forms: AAA-1 = Barbara. U-regular ✓"
            }
          ]
        },

        // ── Concept: Modus Tollens and Hypothetical Syllogism ───────────────
        {
          type: "concept",
          id: "modus-tollens",
          title: "4. Hypothetical Syllogism and Modus Tollens",
          content: `
            <p>The same algebra handles every classical propositional inference pattern.</p>

            <p><strong>Hypothetical Syllogism</strong> — chaining two conditionals:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−q + r</code><span class="proof-note">If q then r  (M = q, P = r)</span></div>
              <div class="proof-row"><code>−p + q</code><span class="proof-note">If p then q  (S = p, M = q)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>−p + r</code><span class="proof-note">If p then r</span></div>
            </div>

            <div class="step-trace">
              <div class="step"><code>(−q + r) + (−p + q)</code></div>
              <div class="step step-reduce"><span>q in premise 1: −q (subject, universal). q in premise 2: +q (predicate, affirmed). Opposite signs → cancel.</span></div>
              <div class="step step-reduce"><code>−p + r</code><span class="step-note">Three A-forms: Barbara (AAA-1) ✓  U-regular ✓</span></div>
            </div>

            <p>Hypothetical syllogism is Barbara, plain and simple.</p>

            <hr class="section-divider">

            <p><strong>Modus Tollens</strong> — denying the consequent:</p>

            <p>Modus tollens ("if p then q; not-q; therefore not-p") works through the contrapositive.
            Recall that the A-form contraposes: <code>−S+P  ∴  −(−P)+(−S)</code>. Applied here:</p>

            <div class="step-trace">
              <div class="step"><code>−p + q</code><span class="step-note">if p then q (A-form)</span></div>
              <div class="step step-reduce"><span>Contrapose: negate both terms, swap roles</span></div>
              <div class="step step-reduce"><code>−(−q) + (−p)</code><span class="step-note">if not-q then not-p</span></div>
            </div>

            <p>Now apply modus ponens with minor premise <code>+(−q)+(−q)</code> (not-q holds):</p>

            <div class="proof-box">
              <div class="proof-row"><code>−(−q) + (−p)</code><span class="proof-note">If not-q then not-p  (contrapositive)</span></div>
              <div class="proof-row"><code>+(−q)+(−q)</code><span class="proof-note">not-q  (I-form self-predication)</span></div>
              <hr class="proof-divider">
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+(−p)+(−q)</code><span class="proof-note">not-p (and not-q)  ✓</span></div>
            </div>

            <p>Modus tollens is modus ponens applied to the contrapositive — which is itself a Barbara.
            The conclusion <code>+(−p)+(−q)</code> says "not-p holds (and not-q, which we already knew)."</p>

            <div class="grammar-rule">
              <span class="g-label">Pattern</span>
              MP = Barbara. Hypothetical Syllogism = Barbara. MT = Barbara on the contrapositive. One algebraic operation, every classical propositional inference.
            </div>
          `
        },

        // ── Exercise: Propositional Validity (Final) ─────────────────────────
        {
          type: "exercise",
          id: "ex-prop-valid",
          isFinal: true,
          title: "Final Review: Propositional Inferences",
          instruction: "Treat propositions as terms and apply the cancellation test. Valid or invalid?",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: engSyl('If it is raining, the ground is wet', 'It is raining', 'The ground is wet'),
              answer: "valid",
              explanation: "Valid — modus ponens (Barbara). TFL: (−Rain+Wet) + (+Rain+Rain) = +Wet+Rain. Rain cancels: −Rain in the major (subject, universal) and +Rain in the minor (subject, particular). +Wet+Rain means Wet holds (and Rain, already known). P-regular ✓"
            },
            {
              exprHtml: engSyl('If you study hard, you will understand the material', 'If you understand the material, you will pass the exam', 'If you study hard, you will pass the exam'),
              answer: "valid",
              explanation: "Valid — hypothetical syllogism (Barbara). Let p = study hard, q = understand material, r = pass exam. TFL: (−q+r) + (−p+q) = −p+r. q cancels: −q (subject of premise 1, universal) and +q (predicate of premise 2, affirmed). Three A-forms, U-regular ✓"
            },
            {
              exprHtml: engSyl('If the alarm rang, you woke up', 'You woke up', 'The alarm rang'),
              answer: "invalid",
              explanation: "Invalid — affirming the consequent (Undistributed Middle). TFL: (−Alarm+Awake) + (+Awake+Awake). Awake appears as +Awake in the major's predicate and +Awake in the minor's subject. Same sign — no cancellation. Waking up has many causes besides an alarm. TFL diagnoses this correctly: Awake is never a universal subject (−Awake), so it was never distributed and cannot serve as the middle term."
            },
            {
              exprHtml: engSyl('If the proof is complete, then every step is justified', 'Step 4 is not justified', 'The proof is not complete'),
              answer: "valid",
              explanation: "Valid — modus tollens. Contrapose the major: −Complete+Justified becomes −(−Justified)+(−Complete) (if not-justified then not-complete). Minor: +(−Justified)+(−Justified) (not-justified holds). TFL: (−(−Justified)+(−Complete)) + (+(−Justified)+(−Justified)) = +(−Complete)+(−Justified). (−Justified) cancels ✓ P-regular: particular premise, particular conclusion ✓. The new information is not-Complete holds."
            }
          ]
        }

      ]
    }

  ]
};
