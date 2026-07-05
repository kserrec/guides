// curriculum.js — Term Functor Logic: The Full Language
// Based on: Sommers & Englebretsen, "An Invitation to Formal Reasoning: The Logic of Terms" (2000)
// Chapters 4 and 5 — The Language of Logic (II) and Syllogistic depth

// Shared template helpers (syl, engSyl, mcPrompt) come from ../tfl-helpers.js.

const CURRICULUM = {
  title: "Term Functor Logic: The Full Language",
  subtitle: "Compound statements, relational terms, and the complete sign algebra",
  icon: "∴",
  lessons: [

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 1: Compound Statements
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-01",
      title: "Lesson 1: Compound Statements",
      description: "Extend TFL's sign algebra to 'and,' 'or,' and complex compound sentences — all the standard propositional connectives expressed through the four categorical forms.",
      completionText: "You've now mapped every standard propositional connective onto TFL's categorical forms — and discovered that 'or' has two equivalent forms, the conditional and the four-minus. In the next lesson you'll extend the algebra even further: instead of propositional terms p and q, you'll work with relational terms that connect two things at once, and find that 'John loves Mary' fits the same S–functor–P structure as 'All dogs are mammals.'",
      blocks: [

        // ── Concept: Propositional Terms Revisited ───────────────────────────
        {
          type: "concept",
          id: "prop-terms-review",
          title: "1. Propositional Terms Revisited",
          content: `
            <p>In Introduction Lesson 8 we discovered that <strong>propositions can be treated
            as terms</strong>. A propositional term <code>p</code> names the class of states of
            affairs — moments, situations, worlds — in which <code>p</code> holds.</p>

            <p>We live in exactly one such state: the actual world. Logicians call this the
            <strong>singleton propositional universe</strong> — a universe whose only "individual"
            is the actual state of affairs. In this universe the four categorical forms map
            directly onto the four basic ways propositions can be combined:</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              Lesson 8: <em>if p then q</em> is an A-form. <code>−p+q</code> reads "all
              p-states are q-states" — wherever p holds, q holds too. That is exactly what a
              conditional says.
            </div>

            <p>Lesson 8 only covered the conditional. This lesson fills in the rest: conjunction,
            disjunction, and their negations — and shows that a single TFL form underlies each one.</p>
          `
        },

        // ── Concept: Conjunction — 'And' as I-form ───────────────────────────
        {
          type: "concept",
          id: "conjunction",
          title: "2. Conjunction: 'And' as I-form",
          content: `
            <p>The I-form <code>+p+q</code> says: <em>some</em> state that is a p-state is
            also a q-state.</p>

            <p>In the singleton universe there is only one "individual" — the actual world.
            <em>Some</em> means that individual belongs to both classes simultaneously. So
            <code>+p+q</code> says the actual world is both a p-world and a q-world:
            <strong>p and q are both true</strong>.</p>

            <div class="syntax-box"><code>+p+q</code> &nbsp;=&nbsp; p ∧ q &nbsp;&nbsp;&nbsp; "p and q"</div>

            <div class="ex-table">
              <div class="ex-row"><code>+rain+cold</code><span>It is raining and it is cold</span></div>
              <div class="ex-row"><code>+studied+passed</code><span>She studied and she passed</span></div>
            </div>

            <p>The O-form extends this to conjunction with a denied predicate — <em>p is true and
            q is false</em>:</p>

            <div class="syntax-box"><code>+p−q</code> &nbsp;=&nbsp; p ∧ ¬q &nbsp;&nbsp;&nbsp; "p but not q"</div>

            <div class="ex-table">
              <div class="ex-row"><code>+studied−passed</code><span>She studied but did not pass</span></div>
              <div class="ex-row"><code>+raining−umbrella</code><span>It is raining but there is no umbrella</span></div>
            </div>

            <p>Same algebra, same form — only the quality sign on the second term changes.</p>
          `
        },

        // ── Concept: Disjunction — 'Or' ──────────────────────────────────────
        {
          type: "concept",
          id: "disjunction",
          title: "3. Disjunction: 'Or' as a Conditional in Disguise",
          content: `
            <p>Disjunction has two equivalent TFL forms. The book's <strong>canonical form</strong>
            is the <strong>four-minus form</strong>:</p>

            <div class="syntax-box"><code>−(−p)−(−q)</code> &nbsp;=&nbsp; p ∨ q &nbsp;&nbsp;&nbsp; "p or q"</div>

            <p>Read it: "No non-p-state is a non-q-state." If a state is not a p-state, it must be
            a q-state — and vice versa. Equivalently, "no situation where p fails is also a situation
            where q fails." That is exactly disjunction: at least one of p, q must hold.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−(−rain)−(−umbrella)</code><span>It is raining or you have an umbrella</span></div>
              <div class="ex-row"><code>−(−alarm)−(−awake)</code><span>The alarm went off or she was already awake</span></div>
            </div>

            <p>A second equivalent form comes from the classical equivalence p ∨ q ≡ ¬p → q:</p>

            <div class="syntax-box"><code>−(−p)+q</code> &nbsp;≡&nbsp; p ∨ q &nbsp;&nbsp;&nbsp; "if not-p, then q"</div>

            <p>This conditional form — A-form with the complement of p as subject — is valid too.
            Both express the same disjunction; the four-minus form <code>−(−p)−(−q)</code> is the
            book's canonical transcription.</p>

            <div class="callout-note">
              <span class="cn-label">Symmetry</span>
              Since "p or q" = "q or p," you could equally write <code>−(−q)−(−p)</code> or
              <code>−(−q)+p</code>. The four-minus form makes the symmetry visible: both terms
              appear in the same negative-complement structure.
            </div>
          `
        },

        // ── Concept: The Full Map ─────────────────────────────────────────────
        {
          type: "concept",
          id: "full-map",
          title: "4. The Full Map",
          content: `
            <p>All four categorical forms now have propositional readings, plus disjunction
            as a variant A-form with a negated subject:</p>

            <div class="syntax-box">
              <table>
                <tr><td><code>+p+q</code></td><td>p ∧ q</td><td>p and q</td></tr>
                <tr><td><code>+p−q</code></td><td>p ∧ ¬q</td><td>p but not q</td></tr>
                <tr><td><code>−p+q</code></td><td>p → q</td><td>if p then q</td></tr>
                <tr><td><code>−p−q</code></td><td>p → ¬q</td><td>if p then not q</td></tr>
                <tr><td><code>−(−p)−(−q)</code></td><td>p ∨ q</td><td>p or q (canonical four-minus form)</td></tr>
                <tr><td><code>−(−p)+q</code></td><td>p ∨ q</td><td>p or q (conditional form — equivalent)</td></tr>
              </table>
            </div>

            <p>Notice the pattern. The A-form family (subject gets − quantity sign) handles
            statements about <em>all</em> cases of some kind: conditionals and disjunction.
            The I/O family (subject gets + quantity sign) handles <em>particular</em> cases —
            conjunction, where both things obtain simultaneously in the actual world.</p>

            <p>No new rules were introduced. Propositional terms <code>p</code>, <code>q</code>
            simply fill the subject and predicate slots already present in TFL's four forms.
            The algebra from Lessons 1–8 of the Introduction applies unchanged.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Idea</span>
              Every standard propositional connective is already expressible in TFL. Conjunction
              is I-form. Conditional is A-form. Disjunction is E-form on the complements (four-minus)
              or equivalently an A-form with a complement subject. The sign algebra handles them all.
            </div>
          `
        },

        // ── Exercise: Identify the TFL Form ──────────────────────────────────
        {
          type: "exercise",
          id: "ex-connective-forms",
          title: "Quick Check: Connective to Form",
          instruction: "Which TFL form expresses this connective?",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Which form expresses:", "p and q"),
              choices: ["+p+q", "−p+q", "−(−p)−(−q)", "+p−q"],
              answer: 0,
              explanation: "Conjunction is I-form: +p+q. In the singleton universe, 'some p-state is a q-state' means the actual world is both a p-world and a q-world — p and q are both true."
            },
            {
              promptHtml: mcPrompt("Which form expresses:", "if p then q"),
              choices: ["−p+q", "+p+q", "−(−p)−(−q)", "+p−q"],
              answer: 0,
              explanation: "The conditional is A-form: −p+q. 'All p-states are q-states' — wherever p holds, q holds too. Covered in Introduction Lesson 8."
            },
            {
              promptHtml: mcPrompt("Which form expresses:", "p or q (canonical)"),
              choices: ["−(−p)−(−q)", "+p+q", "−p+q", "−p−q"],
              answer: 0,
              explanation: "Disjunction's canonical form is the four-minus E-form: −(−p)−(−q). 'No non-p-state is a non-q-state' — wherever p fails, q must hold. Equivalent form: −(−p)+q (conditional form, if not-p then q)."
            },
            {
              promptHtml: mcPrompt("Which form expresses:", "p but not q"),
              choices: ["+p−q", "+p+q", "−p−q", "−(−p)−(−q)"],
              answer: 0,
              explanation: "O-form: +p−q. 'Some p-state is a non-q-state' — the actual world is a p-world where q fails. The I-form with a denied predicate is conjunction with negation of the second conjunct."
            }
          ]
        },

        // ── Exercise: Transcribing Compound Statements (Final) ───────────────
        {
          type: "exercise",
          id: "ex-transcribe-compound",
          isFinal: true,
          title: "Final Review: Transcribe the Compound Statement",
          instruction: "Choose the correct TFL form for each compound English statement.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "It is raining and it is cold.",
              choices: ["+rain+cold", "−rain+cold", "−(−rain)−(−cold)", "+rain−cold"],
              answer: 0,
              explanation: "Conjunction = I-form. +rain+cold: the actual world is both a rain-world and a cold-world. Both propositions hold simultaneously."
            },
            {
              prompt: "If it is raining, then the streets are wet.",
              choices: ["−rain+wet", "+rain+wet", "−(−rain)+wet", "+rain−wet"],
              answer: 0,
              explanation: "Conditional = A-form. −rain+wet: all rain-states are wet-states. Covered in Introduction Lesson 8; repeated here for the full picture."
            },
            {
              prompt: "The light is on or the door is open.",
              choices: ["−(−light)−(−door)", "+light+door", "−light+door", "+light−door"],
              answer: 0,
              explanation: "Disjunction = canonical four-minus form. −(−light)−(−door): no non-light-state is a non-door-state — wherever the light is off, the door must be open. Equivalent conditional form: −(−light)+door."
            },
            {
              prompt: "She studied but did not pass.",
              choices: ["+studied−passed", "+studied+passed", "−studied+passed", "−(−studied)+passed"],
              answer: 0,
              explanation: "O-form: +studied−passed. She studied (p is true) and did not pass (q is false). The I-form with a denied predicate is conjunction with negation of the second conjunct."
            },
            {
              prompt: "If it is not raining, it is sunny.",
              choices: ["−(−rain)+sunny", "−rain+sunny", "+rain−sunny", "+(−rain)+sunny"],
              answer: 0,
              explanation: "This is a conditional whose antecedent is 'not raining' — the complement of rain. A-form with negated subject: −(−rain)+sunny. Notice this is also the conditional-form disjunction: 'if not-rain then sunny' = 'rain or sunny.' The four-minus form of the same disjunction would be −(−rain)−(−sunny)."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 2: Relational Statements
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-02",
      title: "Lesson 2: Relational Statements",
      description: "Extend TFL's S–functor–P structure to two-place relations — and discover that 'John loves Mary' is a categorical statement after all.",
      completionText: "Relational statements fit TFL's structure perfectly — three flat components, each carrying its own sign, replace variables and two-place predicates entirely. The sign algebra applies unchanged: subject quantity, relation functor, object quantity. In the next lesson you'll learn the passive transformation: a simple operation that lets you flip which participant sits in subject position — and with it, a powerful new inference tool.",
      blocks: [

        // ── Concept: From Monadic to Relational ──────────────────────────────
        {
          type: "concept",
          id: "monadic-to-relational",
          title: "1. From Monadic to Relational",
          content: `
            <p>Every categorical statement we have studied so far has been <strong>monadic</strong> —
            it says something about one kind of thing at a time:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Dog + Mammal</code><span>All dogs are mammals — one subject-kind, one predicate-kind</span></div>
              <div class="ex-row"><code>+Philosopher + Wise</code><span>Some philosophers are wise</span></div>
            </div>

            <p>But natural language is saturated with <strong>relational statements</strong> — statements
            that connect two participants through a relation:</p>

            <div class="ex-table">
              <div class="ex-row"><code>John loves Mary</code><span>two participants: John and Mary; relation: loves</span></div>
              <div class="ex-row"><code>Every student reads some book</code><span>two kinds: students and books; relation: reads</span></div>
              <div class="ex-row"><code>Caesar conquered Gaul</code><span>two participants; relation: conquered</span></div>
            </div>

            <p>Modern predicate logic (MPL) handles these by introducing object variables and
            two-place predicates: <code>∀x∃y(Student(x) → Book(y) ∧ Reads(x,y))</code>. The variable
            <code>x</code> ranges over students, <code>y</code> over books, and the relation
            <code>Reads</code> connects them.</p>

            <p>TFL takes a different path — one that requires no variables at all. The key insight
            is that a relational statement is still a categorical statement: it still has exactly
            one subject-term, one predicate-term, and a functor connecting them. You just have to
            know where to look.</p>
          `
        },

        // ── Concept: Compound Predicate Terms ────────────────────────────────
        {
          type: "concept",
          id: "compound-predicate",
          title: "2. Compound Predicate Terms",
          content: `
            <p>TFL's move: fold the <strong>relation</strong> and <strong>one participant</strong>
            together into a single compound predicate term. The other participant becomes the subject.</p>

            <p>Take "John loves Mary."</p>
            <ul>
              <li>Subject: <strong>John</strong></li>
              <li>Predicate: <strong>lover-of-Mary</strong> — a compound term naming the kind
              <em>things that love Mary</em></li>
            </ul>

            <p>The statement says John belongs to the kind <em>lover-of-Mary</em>. That is a
            perfectly ordinary categorical statement — singular subject, compound predicate, functor
            connecting them.</p>

            <div class="ex-table">
              <div class="ex-row"><code>Caesar conquered Gaul</code><span>subject: Caesar; predicate: <em>conqueror-of-Gaul</em></span></div>
              <div class="ex-row"><code>Every student reads some book</code><span>subject: student; predicate: <em>reader-of-some-book</em></span></div>
              <div class="ex-row"><code>No philosopher envies Socrates</code><span>subject: philosopher; predicate: <em>envier-of-Socrates</em></span></div>
            </div>

            <p>The compound predicate term is a genuine term — it names a kind. <em>Lover-of-Mary</em>
            names the class of all things that love Mary. <em>Reader-of-some-book</em> names the class
            of things that read at least one book. The algebra has no trouble with this: a compound
            predicate is a predicate, full stop.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Idea</span>
              Every relational statement has the form Subject — Relation — Object, where the relation
              and its object together constitute the compound predicate term. The subject-predicate-functor
              structure is preserved.
            </div>
          `
        },

        // ── Concept: English Normal Form ─────────────────────────────────────
        {
          type: "concept",
          id: "dyadic-normal-form",
          title: "3. English Normal Form",
          content: `
            <p>To work with relational statements algebraically, TFL writes them in
            <strong>English normal form (ENF)</strong>: three components, each carrying its own sign.</p>

            <div class="syntax-box">
              <code>± Subject &nbsp; ±(Relation &nbsp; ± Object)</code>
            </div>

            <p>The signs work exactly as they do in monadic statements:</p>
            <ul>
              <li>The sign on the <strong>subject</strong> is its quantity sign (− all, + some, ± singular).</li>
              <li>The sign <em>before</em> the parenthesis is the <strong>functor sign</strong> —
                  the same quality sign from the four categorical forms (+ affirmed, − denied).</li>
              <li>The sign on the <strong>object</strong> inside the parenthesis is its quantity sign (− all, + some, ± singular).</li>
            </ul>
            <p>The relation name and its object are enclosed in parentheses, forming the
            <strong>compound predicate term</strong>. The three signs occupy three slots:
            subject, functor (before the paren), and object (inside the paren).</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Man+(Lov±Mary*)</code><span>Every man loves Mary — singular object</span></div>
              <div class="ex-row"><code>−Man+(Lov+Woman)</code><span>Every man loves some woman — particular object</span></div>
              <div class="ex-row"><code>−Man+(Lov−Woman)</code><span>Every man loves every woman — universal object</span></div>
              <div class="ex-row"><code>+Man+(Lov+Woman)</code><span>Some man loves some woman</span></div>
              <div class="ex-row"><code>+Man−(Lov+Woman)</code><span>Some man does not love any woman — predicate denied</span></div>
            </div>

            <p>No new rules. The subject's sign and the functor sign play their usual roles from
            the four categorical forms. The object's sign extends the same algebra to cover
            the second participant — three terms, three signs, no variables.</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              Singular terms take wild quantity ± because the all/some distinction collapses for
              a unique individual (Introduction Lesson 7). Proper names and definite descriptions
              are <strong>uniquely-denoting terms (UDTs)</strong> — marked with an asterisk:
              <code>±Mary*</code>, <code>±Caesar*</code>. Mary as the object is still singular:
              she gets both ± and *.
            </div>
          `
        },

        // ── Concept: Commuting Relational Terms ───────────────────────────────
        {
          type: "concept",
          id: "commuting-relational",
          title: "4. Commuting Relational Terms",
          content: `
            <p>The same relational fact can be stated from either participant's perspective.
            "John loves Mary" can equally be read as "Mary is loved by John." TFL captures
            this by swapping which participant sits in subject position — a move called
            <strong>commuting</strong> the relational term.</p>

            <p>When you commute a relational term, the two participants exchange roles — the
            object becomes the subject and vice versa. The TFL <strong>relation symbol stays the
            same</strong>; it is the English reading (active vs. passive voice) that changes:</p>

            <div class="proof-box">
              <div class="proof-row"><code>±John*+(Lov±Mary*)</code><span class="proof-note">John loves Mary — John as subject</span></div>
              <div class="proof-row"><code>±Mary*+(Lov±John*)</code><span class="proof-note">Mary is loved by John — Mary as subject</span></div>
            </div>

            <p>Both rows express the same fact with the same TFL relation <code>Lov</code>.
            The participants switch positions; the relation symbol does not change.
            This is not an inference — it is the <em>same statement</em> written two ways.</p>

            <p>The same works with quantified terms:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−Man+(Lov+Woman)</code><span class="proof-note">Every man loves some woman</span></div>
              <div class="proof-row"><code>+Woman+(Lov−Man)</code><span class="proof-note">Some woman is loved by every man</span></div>
            </div>

            <p>Notice what happened to the signs. The quantity sign on Man (−) travels with Man
            when Man moves to object position. The quantity sign on Woman (+) travels with Woman
            when Woman moves to subject position. Signs stay attached to their terms; positions
            shift around them.</p>

            <div class="callout-note">
              <span class="cn-label">Note</span>
              Commuting is not always a valid <em>inference</em>. "Every man loves some woman"
              (−Man+(Lov+Woman)) and "some woman is loved by every man" (+Woman+(Lov−Man)) say
              different things about scope: in the first, each man may love a <em>different</em>
              woman; in the second, one woman is loved by <em>all</em> men. The sign positions
              encode this difference. You will explore this fully in the next lesson on the passive transformation.
            </div>
          `
        },

        // ── Exercise: Identify the Compound Predicate ─────────────────────────
        {
          type: "exercise",
          id: "ex-identify-relational",
          title: "Quick Check: Reading Relational Statements",
          instruction: "Identify the compound predicate term in each ENF statement.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("The compound predicate in:", "−Student+(Reads+Book)"),
              choices: ["(Reads+Book)", "−Student", "+Book", "Student"],
              answer: 0,
              explanation: "(Reads+Book) is the compound predicate — 'reader of some book.' −Student is the subject with its quantity sign. The + before Book inside the parentheses is the object's quantity sign (some book)."
            },
            {
              promptHtml: mcPrompt("The English reading of:", "+Philosopher+(Admires±Socrates*)"),
              choices: ["Some philosopher admires Socrates", "Every philosopher admires Socrates", "Socrates admires some philosopher", "Some philosopher is admired by Socrates"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The subject sign is + (some philosopher). The functor is + (affirmed). Inside the compound predicate: Admires is the relation, Socrates is a UDT (asterisk) and singular (±). So: some philosopher admires Socrates."
            },
            {
              promptHtml: mcPrompt("The ENF form of:", "Every teacher teaches some student"),
              choices: ["−Teacher+(Teaches+Student)", "−Teacher+(Teaches−Student)", "+Teacher+(Teaches+Student)", "−Student+(Teaches+Teacher)"],
              answer: 0,
              explanation: "Subject: teacher, universal (−Teacher). Functor: affirmed (+). Compound predicate: (Teaches+Student) — teaches some student. Result: −Teacher+(Teaches+Student)."
            },
            {
              promptHtml: mcPrompt("The ENF form of:", "No country borders every country"),
              choices: ["−Country−(Borders−Country)", "−Country+(Borders−Country)", "+Country−(Borders−Country)", "−Country−(Borders+Country)"],
              answer: 0,
              explanation: "E-form: No S is P → −S−P. Subject: country, universal (−Country). Functor: denied (−). Compound predicate: (Borders−Country) — borders every country. Result: −Country−(Borders−Country)."
            }
          ]
        },

        // ── Exercise: ENF Transcription (Final) ──────────────────────────────
        {
          type: "exercise",
          id: "ex-dnf-transcription",
          isFinal: true,
          title: "Final Review: Relational Transcription",
          instruction: "Choose the correct English normal form for each statement.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Caesar conquered Gaul.",
              choices: ["±Caesar*+(Conquered±Gaul*)", "−Caesar*+(Conquered±Gaul*)", "±Gaul*+(Conquered±Caesar*)", "±Caesar*−(Conquered±Gaul*)"],
              answer: 0,
              explanation: "Caesar and Gaul are proper names — UDTs, marked with asterisk. Both are singular subjects (±). Functor: affirmed (+). Compound predicate: (Conquered±Gaul*). Result: ±Caesar*+(Conquered±Gaul*)."
            },
            {
              prompt: "Some student reads every book.",
              choices: ["+Student+(Reads−Book)", "−Student+(Reads+Book)", "+Student+(Reads+Book)", "−Student−(Reads−Book)"],
              answer: 0,
              explanation: "+Student (some student), functor affirmed (+), compound predicate (Reads−Book) — reads every book. Result: +Student+(Reads−Book). The scope difference matters: some one student reads all of them."
            },
            {
              prompt: "No senator admires every lobbyist.",
              choices: ["−Senator−(Admires−Lobbyist)", "−Senator+(Admires−Lobbyist)", "+Senator−(Admires−Lobbyist)", "−Senator−(Admires+Lobbyist)"],
              answer: 0,
              explanation: "E-form: No S is P → −S−P. Subject: senator, universal (−Senator). Functor: denied (−). Compound predicate: (Admires−Lobbyist) — admires every lobbyist. Result: −Senator−(Admires−Lobbyist)."
            },
            {
              prompt: "Mary is loved by every philosopher.",
              choices: ["±Mary*+(Loves−Philosopher)", "−Philosopher+(Loves±Mary*)", "±Mary*+(Loves+Philosopher)", "±Mary*−(Loves−Philosopher)"],
              answer: 0,
              explanation: "Mary is the singular subject — a UDT, so ±Mary*. Functor: affirmed (+). Compound predicate: (Loves−Philosopher) — the relation with every philosopher in object position. Result: ±Mary*+(Loves−Philosopher). In TFL, the relation symbol stays the same; the passive reading ('is loved by') follows from Mary being in subject position. Note: −Philosopher+(Loves±Mary*) is the active form — the same fact from the philosophers' side."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 3: The Passive Transformation
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-03",
      title: "Lesson 3: The Passive Transformation",
      description: "Master TFL's rule for shifting which participant sits in subject position — and discover that a simple sign operation creates genuine scope differences for quantified relational statements.",
      completionText: "The passive transformation's mechanics are clean: swap participant positions, signs travel with their terms, the relation symbol stays the same. Its logic is subtle: when one participant is universal and the other particular, the two forms make different scope claims. The safeguard is the symmetry rule — same signs on both participants, or one participant singular, means the forms are genuinely equivalent. In the next lesson you'll meet proterms: TFL's device for tracking an individual across multiple relational claims without variables.",
      blocks: [

        // ── Concept: The Passive Transformation ──────────────────────────────
        {
          type: "concept",
          id: "passive-rule",
          title: "1. The Passive Transformation",
          content: `
            <p>In Lesson 2 you saw that a relational statement can be written with either participant
            as the subject. The formal name for this operation is the <strong>passive
            transformation</strong>, and it has a precise algebraic rule.</p>

            <p>Given a relational statement in English normal form (ENF):</p>
            <div class="syntax-box"><code>±S &nbsp; +(R &nbsp; ± O)</code></div>

            <p>The passive transformation produces:</p>
            <div class="syntax-box"><code>±O &nbsp; +(R &nbsp; ± S)</code></div>

            <p>Two things happen simultaneously:</p>
            <ol>
              <li>The original object moves to <strong>subject position</strong></li>
              <li>The original subject moves to <strong>object position</strong></li>
            </ol>

            <p>The relation symbol <strong>stays the same</strong> — the TFL algebra does not
            introduce a separate "converse" relation. What changes is the English reading:
            <code>Teaches</code> in subject-object order reads "teaches"; in object-subject order
            it reads "is taught by." The TFL symbol is the same in both; the English voice changes.</p>

            <p>Crucially: <strong>signs stay with their terms</strong>. The quantity sign attached
            to the original subject travels with that term to its new object position — and vice
            versa. Signs are properties of terms, not of structural slots.</p>

            <div class="proof-box">
              <div class="proof-row"><code>±Caesar*+(Conquered±Gaul*)</code><span class="proof-note">Caesar conquered Gaul — active</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">↓</span><code>±Gaul*+(Conquered±Caesar*)</code><span class="proof-note">Gaul was conquered by Caesar — passive (same relation, participants swapped)</span></div>
            </div>

            <div class="proof-box">
              <div class="proof-row"><code>−Philosopher+(Teaches+Student)</code><span class="proof-note">Every philosopher teaches some student — active</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">↓</span><code>+Student+(Teaches−Philosopher)</code><span class="proof-note">Some student is taught by every philosopher — passive</span></div>
            </div>

            <div class="callout-note">
              <span class="cn-label">Signs Travel</span>
              The − on Philosopher in subject position is still − on Philosopher in object position.
              The + on Student in object position is still + on Student in subject position.
              A sign travels with its term — it does not belong to the slot.
            </div>
          `
        },

        // ── Concept: Scope Effects ────────────────────────────────────────────
        {
          type: "concept",
          id: "scope-effects",
          title: "2. Scope: Why Active ≠ Passive for Quantified Terms",
          content: `
            <p>Look at the second example again. Are these two statements the same?</p>

            <div class="proof-box">
              <div class="proof-row"><code>−Philosopher+(Teaches+Student)</code><span class="proof-note">Every philosopher teaches some student</span></div>
              <div class="proof-row"><code>+Student+(Teaches−Philosopher)</code><span class="proof-note">Some student is taught by every philosopher</span></div>
            </div>

            <p>Same three terms. Same signs on those terms. Different claims:</p>
            <ul>
              <li><strong>Active:</strong> For each philosopher, at least one student exists that
              they teach. Different philosophers may teach different students — or the same one;
              the statement leaves this open.</li>
              <li><strong>Passive:</strong> One specific student exists who is taught by <em>every</em>
              philosopher — a single universal pupil.</li>
            </ul>

            <p>The passive makes a much stronger claim. The difference is <strong>scope</strong>:
            which participant's quantifier is evaluated first. The term in <strong>subject
            position</strong> has wider scope — its quantifier is "outside" the other's.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Philosopher+(Teaches+Student)</code><span>∀x ∃y Teaches(x,y) — each philosopher has his own student</span></div>
              <div class="ex-row"><code>+Student+(Teaches−Philosopher)</code><span>∃y ∀x Teaches(x,y) — one student for all philosophers</span></div>
            </div>

            <p>Moving a term from object to subject position widens its scope — and widening scope
            changes what the statement claims.</p>

            <div class="grammar-rule">
              <span class="g-label">Key Principle</span>
              When the two participants carry <em>different</em> quantity signs — one − (universal),
              one + (particular) — the passive transformation changes logical content. Active and passive
              are different statements and neither implies the other.
            </div>
          `
        },

        // ── Concept: When Passivization Is Valid ──────────────────────────────
        {
          type: "concept",
          id: "valid-passivization",
          title: "3. When the Passive Transformation Preserves Logical Content",
          content: `
            <p>The scope problem only arises when participants carry <em>different</em> quantity signs.
            When they carry the <em>same</em> sign — or when one is singular — the passive
            transformation is a valid equivalence.</p>

            <p><strong>Case 1: Both participants singular (± ±)</strong></p>
            <p>Singular terms name exactly one individual: no scope, no ∀/∃ interaction.</p>
            <div class="proof-box">
              <div class="proof-row"><code>±Caesar*+(Conquered±Gaul*)</code></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>±Gaul*+(Conquered±Caesar*)</code></div>
            </div>

            <p><strong>Case 2: Both participants universal (− −)</strong></p>
            <p>Universal quantifiers commute: ∀x ∀y = ∀y ∀x.</p>
            <div class="proof-box">
              <div class="proof-row"><code>−Man+(Lov−Woman)</code><span class="proof-note">Every man loves every woman</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>−Woman+(Lov−Man)</code><span class="proof-note">Every woman is loved by every man</span></div>
            </div>

            <p><strong>Case 3: Both participants particular (+ +)</strong></p>
            <p>Existential quantifiers commute: ∃x ∃y = ∃y ∃x.</p>
            <div class="proof-box">
              <div class="proof-row"><code>+Man+(Lov+Woman)</code><span class="proof-note">Some man loves some woman</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>+Woman+(Lov+Man)</code><span class="proof-note">Some woman is loved by some man</span></div>
            </div>

            <p><strong>Case 4: One participant singular (±), other general</strong></p>
            <p>A singular term is a fixed individual — no scope interaction with a quantifier.</p>
            <div class="proof-box">
              <div class="proof-row"><code>−Philosopher+(Loves±Mary*)</code><span class="proof-note">Every philosopher loves Mary</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>±Mary*+(Loves−Philosopher)</code><span class="proof-note">Mary is loved by every philosopher</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">Symmetry Rule</span>
              The passive transformation is a valid equivalence when:<br>
              (a) Both participants carry the <em>same</em> sign (−−, ++, or ±±), or<br>
              (b) At least one participant is singular (±).<br><br>
              When participants carry <em>different non-singular signs</em> (−+ or +−), active and
              passive make different scope claims and are not equivalent.
            </div>
          `
        },

        // ── Concept: Sign Algebra on Relational Statements ────────────────────
        {
          type: "concept",
          id: "relational-sign-algebra",
          title: "4. Sign Algebra on Relational Statements",
          content: `
            <p>The same algebraic operations that apply to monadic categorical statements apply
            to relational ones without modification.</p>

            <p><strong>Obversion</strong></p>
            <p>For monadic statements, obversion changes the functor sign while negating the
            predicate — leaving the proposition unchanged: <code>−S + P ≡ −S − (−P)</code>.</p>

            <p>The same principle applies to relational statements. The compound predicate
            <code>R ± O</code> can be obverted: deny the functor, negate the relation.</p>

            <div class="proof-box">
              <div class="proof-row"><code>−Man+(Lov+Woman)</code><span class="proof-note">Every man loves some woman</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>−Man−(non-Lov+Woman)</code><span class="proof-note">No man fails to love some woman</span></div>
            </div>

            <p><code>non-Lov</code> (fails-to-love) is the negative of the relation <code>Lov</code>,
            exactly as <code>non-Mortal</code> is the negative of <code>Mortal</code> in monadic logic.
            The functor sign flips; the proposition is unchanged.</p>

            <p><strong>Relational simplification</strong></p>
            <p>A relational statement whose object is singular can always be read as a plain
            monadic categorical statement. The compound predicate <code>(R ± Name*)</code> names
            a definite class — all things standing in relation R to that named individual.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Man+(Lov±Mary*)</code><span>= −Man+LoverOfMary* — every man is a lover-of-Mary</span></div>
              <div class="ex-row"><code>+Philosopher+(Admires±Socrates*)</code><span>= +Philosopher+AdmirerOfSocrates*</span></div>
              <div class="ex-row"><code>±Caesar*+(Conquered±Gaul*)</code><span>= ±Caesar*+ConquerorOfGaul*</span></div>
            </div>

            <p>This is TFL's unification: relational statements <em>are</em> categorical statements.
            When one participant is fixed, the relation collapses into a compound monadic predicate
            and the full power of the four categorical forms — including the immediate inference rules
            from Lesson 4 of the Introduction — applies directly.</p>

            <div class="callout-note">
              <span class="cn-label">When the Full Relational Algebra Is Needed</span>
              Relational ENF with two quantified participants — like <code>−Man+(Lov+Woman)</code>
              — cannot be reduced to a monadic form without loss. The full relational treatment is
              required whenever both participants are general (non-singular) terms with different
              quantity signs and the scope distinction matters. That is exactly the situation the
              passive transformation and its symmetry rule govern.
            </div>
          `
        },

        // ── Exercise: Valid or Invalid Passive Transform? ─────────────────────
        {
          type: "exercise",
          id: "ex-passive-valid",
          title: "Quick Check: Valid Equivalence?",
          instruction: "Is the passive form a valid equivalence of the active? Apply the symmetry rule.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl(
                ['±Brutus*+(Stabbed±Caesar*)'],
                '±Caesar*+(Stabbed±Brutus*)'
              ),
              answer: "valid",
              explanation: "Valid — both participants are singular (±±). Proper names are UDTs (asterisk). Singular terms have no scope interaction. Active and passive express the same fact about two named individuals. The relation Stabbed stays the same; the English reads 'Caesar was stabbed by Brutus.'"
            },
            {
              exprHtml: syl(
                ['−Senator+(Admires+Philosopher)'],
                '+Philosopher+(Admires−Senator)'
              ),
              answer: "invalid",
              explanation: "Invalid — participants carry different signs (−Senator, +Philosopher). Active: for each senator, some philosopher they admire exists — possibly a different one per senator. Passive: one specific philosopher is admired by every senator. Different scope claims. The symmetry rule fails: −+ mismatch."
            },
            {
              exprHtml: syl(
                ['−Dog+(Sees−Cat)'],
                '−Cat+(Sees−Dog)'
              ),
              answer: "valid",
              explanation: "Valid — both participants carry the same sign (−−). Universal quantifiers commute: ∀x∀y Sees(x,y) ≡ ∀y∀x Sees(x,y). Every dog sees every cat says the same thing as every cat is seen by every dog. The relation Sees stays the same in TFL."
            },
            {
              exprHtml: syl(
                ['+Man+(Lov+Woman)'],
                '+Woman+(Lov+Man)'
              ),
              answer: "valid",
              explanation: "Valid — both participants carry the same sign (++). Existential quantifiers commute: ∃x∃y Lov(x,y) ≡ ∃y∃x Lov(x,y). Some man loves some woman ≡ some woman is loved by some man. The same pair witnesses both. Note: the relation symbol Lov is the same in both — the TFL algebra keeps the same relation letter; the English reading ('is loved by') is the passive voice of 'loves.'"
            },
            {
              exprHtml: syl(
                ['+Philosopher+(Teaches−Student)'],
                '−Student+(Teaches+Philosopher)'
              ),
              answer: "invalid",
              explanation: "Invalid — participants carry different signs (+Philosopher, −Student). Active: some philosopher teaches every student (∃x∀y). Passive: every student is taught by some philosopher — possibly a different one for each student (∀y∃x). These are not equivalent. Signs are mixed: +− mismatch."
            }
          ]
        },

        // ── Exercise: Passive Transformation (Final) ──────────────────────────
        {
          type: "exercise",
          id: "ex-passive-final",
          isFinal: true,
          title: "Final Review: The Passive Transformation",
          instruction: "Apply the passive transformation, check the symmetry rule, and select the correct answer.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("The passive of:", "−Teacher+(Instructs+Student)"),
              choices: ["+Student+(Instructs−Teacher)", "−Teacher+(Instructs+Student)", "−Student+(Instructs+Teacher)", "+Teacher+(Instructs−Student)"],
              answer: 0,
              explanation: "Passive transformation: object (+Student) → subject, subject (−Teacher) → object. Signs travel: + stays on Student, − stays on Teacher. The relation Instructs stays the same in TFL. Result: +Student+(Instructs−Teacher). In English this reads 'some student is instructed by every teacher.'"
            },
            {
              prompt: "Is +Student+(Instructs−Teacher) an equivalent statement to −Teacher+(Instructs+Student)?",
              choices: ["No — signs are mixed (−+), so the forms make different scope claims", "Yes — both participants are universal", "Yes — participants are swapped so the scopes become identical", "No — the relation name changed during the transformation"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The participants carry different signs: −Teacher (universal) and +Student (particular). Symmetry rule: −+ mismatch → not a valid equivalence. The active says each teacher has some student; the passive says some one student is instructed by every teacher. Different scope claims."
            },
            {
              promptHtml: mcPrompt("The passive of:", "±Athens*+(Borders±Sparta*)"),
              choices: ["±Sparta*+(Borders±Athens*)", "−Sparta*+(Borders−Athens*)", "±Athens*+(Borders±Sparta*)", "+Sparta*+(Borders−Athens*)"],
              answer: 0,
              explanation: "Both participants are singular (±±) and proper names (UDTs, asterisk). Signs travel: ± stays on Sparta, ± stays on Athens. The relation Borders stays the same. Result: ±Sparta*+(Borders±Athens*). Since both participants are singular, this is a valid equivalence."
            },
            {
              prompt: "Which of the following is an example of relational simplification?",
              choices: [
                "Reading −Man+(Lov±Mary*) as −Man+LoverOfMary*",
                "Converting −Man+(Lov+Woman) to +Woman+(Lov−Man)",
                "Applying obversion to get −Man−(non-Lov+Woman)",
                "Treating ±John*+(Lov±Mary*) as equivalent to ±Mary*+(Lov±John*)"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "When the object is singular, the compound predicate (Lov±Mary*) names a fixed class — lover-of-Mary. Treating it as a single monadic predicate LoverOfMary* reduces the relational statement to a plain categorical form. This is relational simplification: one fixed participant collapses the two-place relation into a one-place predicate."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 4: Proterms and Pronominal Reference
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-04",
      title: "Lesson 4: Proterms and Pronominal Reference",
      description: "Discover how TFL handles pronouns without bound variables — a prime superscript marks a recurring term as a proterm, giving TFL the expressive power of MPL's bound variables through a purely algebraic device.",
      completionText: "Proterms complete TFL's toolkit for relational statements. A prime superscript on a recurring term shows co-denotation: the two marked occurrences refer to the same individual(s). Four kinds of term markers give precise algebraic control over denotation that natural language handles through context. In the next lesson you'll return to the syllogistic to see why REGAL works — deriving the two validity conditions from first principles.",
      blocks: [

        // ── Concept: When the Same Term Recurs ───────────────────────────────
        {
          type: "concept",
          id: "recurring-terms",
          title: "1. When the Same Term Recurs",
          content: `
            <p>Consider two sentences that share a term:</p>

            <div class="proof-box">
              <div class="proof-row"><code>+M+S</code><span class="proof-note">Some men were shouting</span></div>
              <div class="proof-row"><code>+M+A</code><span class="proof-note">Some men are alarmed</span></div>
            </div>

            <p>Both sentences use the term <code>M</code> (men). But do they refer to the
            <em>same</em> men? As written, no — each <code>+M</code> could pick out a different
            group of men. The first sentence talks about some shouting men; the second about some
            alarmed men. There is no logical connection between the two groups.</p>

            <p>Now compare these two sentences:</p>

            <div class="proof-box">
              <div class="proof-row"><code>+M'+S</code><span class="proof-note">Some men were shouting</span></div>
              <div class="proof-row"><code>±M'+A</code><span class="proof-note">They are alarmed</span></div>
            </div>

            <p>The prime superscript (<code>'</code>) on <code>M</code> marks both occurrences as
            <strong>co-denoting</strong>: they refer to the <em>same</em> men. The second sentence
            says <em>those men</em> — the ones already referred to — are alarmed. This is
            pronominal reference: "they" picks up the denotation of "some men" from the first sentence.</p>

            <p>In TFL, a term marked with a prime superscript is called a <strong>proterm</strong>
            — it is a <em>pro</em>noun term, standing in for an individual already introduced.
            The first marked occurrence is the <strong>antecedent</strong>; subsequent marked
            occurrences are the <strong>pronouns</strong>.</p>

            <div class="callout-note">
              <span class="cn-label">Wild Quantity on the Pronoun</span>
              The pronoun <code>±M'</code> has wild quantity ±. "They" refers to all of the men in
              question — not "some of them" or "every one in general," but specifically those men.
              Like a singular term, the all/some distinction collapses when reference is already fixed.
            </div>
          `
        },

        // ── Concept: Pronominal Markers ───────────────────────────────────────
        {
          type: "concept",
          id: "pronominal-markers",
          title: "2. Pronominal Markers: The Prime Superscript",
          content: `
            <p>A <strong>pronominal marker</strong> is a prime superscript (<code>'</code>) affixed to
            a recurring term to show that its denotation is focused on some one thing or group
            already introduced. The rules:</p>

            <ul>
              <li>The first marked occurrence is the <strong>antecedent</strong> — it introduces
              the focused individual(s).</li>
              <li>Every subsequent marked occurrence is a <strong>pronoun</strong> — it refers back
              to the same individual(s).</li>
              <li>Multiple unrelated pronominalizations in the same context use different prime
              marks: single prime <code>'</code> for one, double prime <code>"</code> for another.</li>
            </ul>

            <div class="ex-table">
              <div class="ex-row"><code>+A'+B; ±A'+C</code><span>some A is B; that A is C</span></div>
              <div class="ex-row"><code>+A'+B; +A"+C</code><span>some A is B; some A (possibly different) is C — two separate groups</span></div>
              <div class="ex-row"><code>−A'+B; −A'+C</code><span>every A is B; every A is C — same distributed term</span></div>
            </div>

            <p>For <strong>reflexive</strong> sentences — where a term appears twice within the
            same relational statement — the proterm carries numerical subscripts to distinguish
            participant roles (shaver vs. shaved, lover vs. loved):</p>

            <div class="proof-box">
              <div class="proof-row"><code>+B'₁+S₁₂+B'₂</code><span class="proof-note">Some barber shaves himself — B'₁ is barber-qua-shaver, B'₂ is barber-qua-shaved</span></div>
              <div class="proof-row"><code>−B'₁+S₁₂+B'₂</code><span class="proof-note">Every barber shaves himself</span></div>
            </div>

            <p>The common prime on both <code>B'</code> occurrences shows they co-denote — the
            same barber appears in both participant positions. The subscripts show which position
            each occurrence fills within the relation.</p>

            <div class="grammar-rule">
              <span class="g-label">Term Markers</span>
              TFL uses four kinds of term markers: (1) pairing markers — numerical subscripts
              showing which terms co-denote in a relational statement; (2) pronominal markers —
              prime superscripts showing proterms; (3) UDT markers — asterisk (*) on
              uniquely-denoting terms (proper names, definite descriptions); (4) restrictive
              markers — double-stroke on terms with bounded class denotation.
            </div>
          `
        },

        // ── Concept: Common Pronominalization Forms ───────────────────────────
        {
          type: "concept",
          id: "pronominalization-forms",
          title: "3. Common Pronominalization Forms",
          content: `
            <p>Two forms of pronominalization recur throughout natural language. Both use the
            propositional-term brackets <code>[ ]</code> to embed the sub-sentences as terms:</p>

            <p><strong>Form 1: Conjunctive ("some A is B and it is C")</strong></p>
            <div class="syntax-box"><code>+[+A″+B]+[+A″+C]</code></div>
            <p>The outer <code>+...+</code> is the I-form conjunction (Lesson 1). Inside, both
            sub-sentences carry the same proterm <code>A″</code> (double prime). In the actual world,
            some A″ is B — and that same A″ is C.</p>

            <div class="ex-table">
              <div class="ex-row"><code>+[+C″+W]+[+C″+F]</code><span>some critic wrote a book and she is famous</span></div>
              <div class="ex-row"><code>+[+M″+R]+[±M″+A]</code><span>some man ran and he was arrested</span></div>
            </div>

            <p><strong>Form 2: Conditional ("if any A is B then it is C")</strong></p>
            <div class="syntax-box"><code>−[+A'+B]+[+A'+C]</code></div>
            <p>The outer <code>−...+</code> is the A-form conditional. All sub-situations where
            some A' is B are sub-situations where that same A' is C. The proterm A' (single prime)
            ranges across the whole conditional.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−[+D'+B]+[+D'+R]</code><span>if any dog bites, it runs</span></div>
              <div class="ex-row"><code>−[+S'+P]+[+S'+H]</code><span>if any student passes, she is happy</span></div>
            </div>

            <p>Notice the difference between Form 1 and Form 2. In Form 1 the conjunction uses
            <strong>double prime</strong> (A″) and the outer form is I-form (+): the actual world
            satisfies both sub-sentences. In Form 2 the conditional uses <strong>single prime</strong>
            (A') and the outer form is A-form (−): every A-world satisfying the antecedent also
            satisfies the consequent.</p>

            <div class="callout-note">
              <span class="cn-label">Compare with MPL</span>
              Form 1 (A″) = ∃x(A(x) ∧ B(x) ∧ C(x)). Form 2 (A') = ∀x(A(x) ∧ B(x) → C(x)). No variables
              appear in TFL — the prime superscript does the work the variable x does in MPL. The
              prime type (double vs. single) signals conjunctive vs. conditional scope.
            </div>
          `
        },

        // ── Concept: Bounded Denotation ───────────────────────────────────────
        {
          type: "concept",
          id: "bounded-denotation",
          title: "4. Bounded Denotation",
          content: `
            <p>A term's <strong>extension</strong> is the full class of things it applies to —
            all snobs, all critics, all men. This is fixed by the term's meaning and doesn't
            vary from context to context.</p>

            <p>A term's <strong>denotation</strong> in a specific use is what it actually picks out
            in that context. This <em>does</em> vary:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−C+U</code><span>"every critic is unhappy" — C denotes all critics (full extension)</span></div>
              <div class="ex-row"><code>+C+S</code><span>"some critic is a snob" — C denotes some critics (part of extension)</span></div>
              <div class="ex-row"><code>+C*+L</code><span>"the critic is late" — C* denotes one specific critic (UDT)</span></div>
            </div>

            <p>A proterm's denotation is <strong>bounded</strong>: it is restricted to the specific
            individual(s) the antecedent was used to denote. The proterm does not roam freely over
            its extension — its reference is anchored to what the antecedent fixed in context.</p>

            <div class="proof-box">
              <div class="proof-row"><code>+C'+S</code><span class="proof-note">some critic is a snob — C' introduced</span></div>
              <div class="proof-row"><code>±C'+L</code><span class="proof-note">that critic is late — C' refers to the very critics introduced above</span></div>
            </div>

            <p>The denotation of <code>±C'</code> in the second sentence is bounded to those critics
            introduced in the first. This is the algebraic counterpart of how a bound variable in
            MPL is fixed in its scope: <code>∃x(Critic(x) ∧ Snob(x)) ∧ Late(x)</code> —
            the final x refers to the same individual as the x under the existential quantifier.</p>

            <p><strong>Internal Pronoun Elimination (IPE)</strong></p>
            <p>When a proterm occurs as the object of a reflexive relational statement, it can
            sometimes be eliminated — changing the reflexive predicate into a monadic one:</p>

            <div class="proof-box">
              <div class="proof-row"><code>+B'₁+S₁₂+B'₂</code><span class="proof-note">some barber shaves himself</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">→ IPE →</span><code>+B+(S₁₁)</code><span class="proof-note">some barber self-shaves — pronoun eliminated, S₁₂ becomes S₁₁</span></div>
            </div>

            <p>IPE removes the pronoun and adjusts the subscript: <code>S₁₂</code> (shaves
            participant-1 to participant-2) becomes <code>S₁₁</code> (shaves-self). The reflexive
            relational statement reduces to a monadic categorical statement about self-shavers.</p>
          `
        },

        // ── Exercise: Quick Check ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-proterm-check",
          title: "Quick Check: Proterms",
          instruction: "Apply what you know about proterms and pronominal markers.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("In", "+M'+S ; ±M'+A"),
              choices: ["±M' is a proterm — it co-denotes with the +M' in the first sentence", "±M' is a singular term — it names one specific man", "±M' denotes all men in the extension of M", "The prime is a negation marker — it denies M"],
              choicesAreCode: false,
              answer: 0,
              explanation: "±M' is a proterm. The prime marks it as co-denoting with +M' in the first sentence — the same men referred to there. Wild quantity ± shows the pronoun picks up a fixed group, not a fresh quantification."
            },
            {
              promptHtml: mcPrompt("Which form expresses:", "some student passed and she celebrated"),
              choices: ["+[+S″+P]+[+S″+C]", "+S'+P; +S'+C", "+S+P; +S+C", "−[+S'+P]+[+S'+C]"],
              answer: 0,
              explanation: "+[+S″+P]+[+S″+C] is the I-form conjunctive pronominalization — double prime marks the conjunctive form. The actual world is both a (+S″+P) world and a (+S″+C) world. The shared double prime shows both sub-sentences refer to the same student. The conditional form would use single prime with the A-form outer bracket."
            },
            {
              promptHtml: mcPrompt("In the reflexive statement", "+B'₁+S₁₂+B'₂"),
              choices: ["Both B' occurrences denote the same barber — one as shaver, one as shaved", "B'₁ and B'₂ are different barbers with the same property", "The subscripts mean participant 1 and participant 2 are different terms", "The prime means B is being negated"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Both B'₁ and B'₂ carry the same prime mark, showing co-denotation — they refer to the same individual barber. The subscripts 1 and 2 distinguish participant roles within the shaves relation (shaver vs. shaved), not different individuals."
            },
            {
              prompt: "What is the key difference between +M+S; +M+A and +M'+S; ±M'+A?",
              choices: [
                "In the first, the two M's may denote different men; in the second, the prime forces co-denotation",
                "The first uses general terms; the second uses singular terms",
                "The prime in the second means M is being used universally",
                "There is no logical difference — both say some men are shouting and some men are alarmed"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Without the prime, two uses of M in separate sentences are unrelated — they may pick out different men. The prime superscript marks the two occurrences as proterms that co-denote: the same men appear in both. This is the difference between 'some men were shouting; some men are alarmed' (possibly different men) and 'some men were shouting; they are alarmed' (the same men)."
            }
          ]
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-proterm-final",
          isFinal: true,
          title: "Final Review: Pronouns and Proterms",
          instruction: "Match English sentences to their TFL proterm transcription, and apply the key concepts.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Some dog bit a man and it ran away.",
              choices: ["+[+D″+B]+[+D″+R]", "+D+B; +D+R", "+[+D″+B]+[+M′+R]", "−[+D'+B]+[+D'+R]"],
              answer: 0,
              explanation: "+[+D″+B]+[+D″+R]: I-form conjunctive pronominalization — double prime (D″) marks the conjunctive form. Both sub-sentences carry D″ (the same dog). The outer +[...]+[...] is the I-form conjunction. 'It ran away' — the pronoun 'it' refers back to the dog, so D″ carries across both."
            },
            {
              prompt: "If any barber shaves himself, he is skilled.",
              choices: [
                "−[+B'₁+S₁₂+B'₂]+[+B'+K]",
                "+[+B'₁+S₁₂+B'₂]+[+B'+K]",
                "−[+B'+S]+[+B'+K]",
                "+B'₁+S₁₂+B'₂; ±B'+K"
              ],
              answer: 0,
              explanation: "The conditional form -[...]+[...] wraps the antecedent (a reflexive relational statement about the barber shaving himself) and the consequent (that barber is skilled). The prime carries across both sub-sentences, tracking the same barber."
            },
            {
              prompt: "What does 'bounded denotation' mean for a proterm?",
              choices: [
                "It refers to the specific individual(s) the antecedent picked out in context — not freely ranging over its extension",
                "It refers to every member of its extension, like a universally quantified term",
                "It refers to some arbitrary individual, like a freshly introduced existential",
                "It has no denotation — proterms are purely syntactic markers"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A proterm's denotation is bounded by its antecedent: it refers to the same specific individual(s) that the antecedent was used to pick out. The term 'critics' has an extension of all critics, but C' in 'some critics are snobs; they admire one another' denotes specifically those critics introduced — a bounded subset of the full extension."
            },
            {
              prompt: "Which correctly applies IPE (Internal Pronoun Elimination) to +B'₁+S₁₂+B'₂?",
              choices: [
                "+B+(S₁₁) — remove B'₂, change subscript 12 → 11, giving 'some barber self-shaves'",
                "+B+(S₁₂) — remove B'₂, keep subscript 12",
                "+B'₁+S₁₁ — remove B'₂ and the second subscript",
                "IPE does not apply here — the two B' occurrences are in different sentences"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "IPE removes the internal pronoun (B'₂) and adjusts the relation's subscript: S₁₂ (shaves 1 to 2) becomes S₁₁ (shaves-self, or is a self-shaver). The result +B+(S₁₁) is a monadic statement: some barber is a self-shaver. The reflexive relation becomes a monadic predicate."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 5: REGAL and Why It Works
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-05",
      title: "Lesson 5: REGAL and Why It Works",
      description: "Discover where the two validity conditions come from — not a medieval recipe but a theorem about algebraic inconsistency. Two hidden names, one principle of validity, and a canonical form that explains everything.",
      completionText: "REGAL is a theorem: any syllogism whose counterclaim satisfies P and Z is valid, and REGAL exactly characterizes the syllogisms whose counterclaims do. Regularity and equality aren't two conditions handed down from tradition — they're two faces of one algebraic structure. In the next lesson you'll put this machinery to work on enthymemes: arguments with missing premises or conclusions, where knowing why REGAL works lets you recover what's implicit.",
      blocks: [

        // ── Concept: The Name ─────────────────────────────────────────────────
        {
          type: "concept",
          id: "regal-name",
          title: "1. What REGAL Actually Means",
          content: `
            <p>In the Introduction you learned that a syllogism is valid when it satisfies two
            conditions — called "Condition 1" and "Condition 2." Those labels describe the tests
            without explaining where they come from. This lesson repairs that.</p>

            <p>The two conditions have proper names — <em>regularity</em> and <em>equality</em> —
            and this course bundles them under one memorable label: <strong>REGAL</strong>, a
            portmanteau (not an acronym) of those two words. The conditions themselves are
            Sommers and Englebretsen's; REGAL is our name for the pair.</p>

            <div class="grammar-rule">
              <span class="g-label">REGAL = REG(ular) + egAL</span>
              <strong>Regularity</strong> — the mood condition: how many particular statements
              may appear, and where.<br>
              <strong>Equality</strong> — the algebraic condition: the premises must sum to the
              conclusion. (From French <em>égal</em> = equal/adds up.)
            </div>

            <p>A syllogism satisfies REGAL when it is both <em>regular</em> and <em>equal</em>.
            These are the proper names for Condition 2 and Condition 1 from the Introduction.</p>

            <p><strong>Two kinds of regular mood:</strong></p>
            <ul>
              <li><strong>U-regular</strong> (Universal-regular): <em>all three</em> statements
              are universal — zero particular statements in the mood. Examples: AAA (Barbara),
              EAE (Celarent), AEE.</li>
              <li><strong>P-regular</strong> (Particular-regular): exactly <em>two</em> statements
              are particular, and the conclusion is one of them — one particular premise and one
              particular conclusion. Examples: AII (Darii), EIO (Ferio), EAO.</li>
            </ul>
            <p>Any other mood — two particular premises with a universal conclusion, or a
            single particular in the wrong position — is <strong>irregular</strong> and
            automatically invalid regardless of how the algebra comes out.</p>

            <div class="ex-table">
              <div class="ex-row"><code>AAA &nbsp;(Barbara)</code><span>U-regular — three universals, zero particulars</span></div>
              <div class="ex-row"><code>AII &nbsp;(Darii)</code><span>P-regular — one particular premise + one particular conclusion</span></div>
              <div class="ex-row"><code>EIO &nbsp;(Ferio)</code><span>P-regular — one particular premise + one particular conclusion</span></div>
              <div class="ex-row"><code>IIA</code><span>Irregular — two particular premises, universal conclusion</span></div>
            </div>
          `
        },

        // ── Concept: Validity and Its Counterclaim ────────────────────────────
        {
          type: "concept",
          id: "counterclaim",
          title: "2. Validity Through Its Counterclaim",
          content: `
            <p>Why should regularity and equality — those two specific conditions — be what
            validity consists in? The answer starts with a general principle about what validity
            means.</p>

            <div class="grammar-rule">
              <span class="g-label">Principle of Validity (PV)</span>
              An argument is valid if and only if its <strong>counterclaim</strong> is
              inconsistent.
            </div>

            <p>The <strong>counterclaim</strong> of an argument is the explicit claim that all
            the premises are true and the conclusion is false. It is formed by conjoining all the
            premises with the <em>contradictory</em> of the conclusion. An argument is valid
            precisely when this claim cannot be consistently made.</p>

            <p>In TFL, forming a counterclaim means replacing the conclusion with its
            contradictory. From the Introduction you know that contradictories flip <em>both</em>
            the quantity sign and the quality sign — they swap universal ↔ particular:</p>

            <div class="ex-table">
              <div class="ex-row"><code>−S+P</code><span>(A-form, universal)</span><span>→ contradictory: <code>+S−P</code> (O-form, particular)</span></div>
              <div class="ex-row"><code>−S−P</code><span>(E-form, universal)</span><span>→ contradictory: <code>+S+P</code> (I-form, particular)</span></div>
              <div class="ex-row"><code>+S+P</code><span>(I-form, particular)</span><span>→ contradictory: <code>−S−P</code> (E-form, universal)</span></div>
              <div class="ex-row"><code>+S−P</code><span>(O-form, particular)</span><span>→ contradictory: <code>−S+P</code> (A-form, universal)</span></div>
            </div>

            <p>The crucial asymmetry: <strong>the contradictory of a universal is particular,
            and vice versa.</strong> This will drive everything that follows.</p>

            <p>Forming the counterclaim of Barbara (AAA-1):</p>

            <div class="proof-box">
              <div class="proof-row"><code>−M+P</code><span class="proof-note">Premise 1 — keep as-is</span></div>
              <div class="proof-row"><code>−S+M</code><span class="proof-note">Premise 2 — keep as-is</span></div>
              <div class="proof-row"><code>+S−P</code><span class="proof-note">Conclusion denied: contradictory of −S+P (A) is +S−P (O)</span></div>
            </div>

            <p>The counterclaim is this three-statement conjunction. If no interpretation
            can make all three true at once, Barbara is valid. The question that now matters:
            <em>when</em> is such a conjunction inconsistent?</p>
          `
        },

        // ── Concept: P and Z ──────────────────────────────────────────────────
        {
          type: "concept",
          id: "p-and-z",
          title: "3. The Two Signs of Inconsistency: P and Z",
          content: `
            <p>A syllogistic conjunction is inconsistent when no interpretation satisfies all
            its conjuncts simultaneously. Sommers identifies two algebraic conditions that
            together characterize this:</p>

            <div class="grammar-rule">
              <span class="g-label">P Condition</span>
              The conjunction contains <strong>exactly one particular</strong> statement —
              exactly one conjunct whose subject carries a + quantity sign.
            </div>

            <div class="grammar-rule">
              <span class="g-label">Z Condition</span>
              The <strong>algebraic sum</strong> of all the conjuncts equals <strong>zero</strong>
              — every signed term cancels out completely.
            </div>

            <div class="callout-note">
              <span class="cn-label">The P/Z Theorem</span>
              A syllogistic conjunction is inconsistent <em>if and only if</em> it satisfies
              <strong>both P and Z</strong>.
            </div>

            <p><strong>The simplest case — one statement:</strong> <code>+A−A</code>
            ("some A is not-A"). P: one particular. Z: <code>+A−A = 0</code>. Obviously
            inconsistent — nothing is both A and not-A.</p>

            <p><strong>A two-statement case:</strong></p>
            <div class="proof-box">
              <div class="proof-row"><code>−A+B</code><span class="proof-note">Every A is B</span></div>
              <div class="proof-row"><code>+A−B</code><span class="proof-note">Some A is not B</span></div>
            </div>
            <p>P: one particular (<code>+A−B</code>). Z: <code>(−A+B)+(+A−B) = 0</code>.
            If every A is B, there can be no A that fails to be B. Inconsistent.</p>

            <p><strong>The canonical three-statement form</strong> — a transitive chain of two
            universals plus one particular that denies what the chain entails:</p>

            <div class="proof-box">
              <div class="proof-row"><code>−A+B</code><span class="proof-note">Every A is B</span></div>
              <div class="proof-row"><code>−B+C</code><span class="proof-note">Every B is C</span></div>
              <div class="proof-row"><code>+A−C</code><span class="proof-note">Some A is not C</span></div>
            </div>

            <p>P: one particular (<code>+A−C</code>). Z: <code>(−A+B)+(−B+C)+(+A−C) = 0</code>.
            The two universal links entail every A is C; the third statement says some A is not C.
            These cannot all be true. Inconsistent.</p>

            <p>Now verify the Barbara counterclaim <code>{−M+P, −S+M, +S−P}</code>:</p>

            <div class="proof-box">
              <div class="proof-row"><span class="proof-note">P: one particular — only +S−P carries +. ✓</span></div>
              <div class="proof-row"><code>(−M+P)+(−S+M)+(+S−P) = (−M+M)+(−S+S)+(P−P) = 0</code><span class="proof-note">Z: sum = 0. ✓</span></div>
            </div>

            <p>Both conditions hold. The Barbara counterclaim is inconsistent. By PV, Barbara
            is valid. The two conditions are not magic — they capture the algebraic structure
            of inconsistency itself.</p>
          `
        },

        // ── Concept: Closing the Circle ───────────────────────────────────────
        {
          type: "concept",
          id: "closing-the-circle",
          title: "4. Closing the Circle: Why REGAL Follows",
          content: `
            <p>Now everything connects. A syllogism is valid iff its counterclaim is inconsistent
            (PV). A conjunction is inconsistent iff it satisfies P and Z. Which syllogisms
            generate counterclaims satisfying P and Z?</p>

            <p><strong>U-regular syllogisms</strong> (all-universal mood):</p>
            <p>Counterclaim = two universal premises + contradictory of a universal conclusion.
            The contradictory of a universal is particular — so the counterclaim gets exactly
            <em>one</em> new particular. P ✓. If equality holds (premises sum to conclusion),
            then the counterclaim sums to zero. Z ✓. Both satisfied → inconsistent → valid.</p>

            <p><strong>P-regular syllogisms</strong> (one particular premise, particular conclusion):</p>
            <p>Counterclaim = one universal premise + one particular premise (kept) + contradictory
            of a particular conclusion. The contradictory of a particular is <em>universal</em>.
            So the counterclaim's one particular is exactly the original particular premise. P ✓.
            If equality holds, Z ✓. → Valid.</p>

            <p><strong>Irregular syllogisms fail P:</strong></p>
            <ul>
              <li><em>IIA</em> (two particular premises, universal conclusion): counterclaim keeps
              both particular premises and adds the denial of the universal (= one more particular).
              Three particulars. P fails.</li>
              <li><em>Any mood with no particular at all in a P-regular slot</em>: the count
              comes out wrong. P fails.</li>
            </ul>

            <div class="grammar-rule">
              <span class="g-label">The REGAL Theorem</span>
              A syllogism is valid if and only if its mood is regular (U-regular or P-regular)
              AND its premises sum algebraically to its conclusion (equality). This is not a
              recipe — it is a theorem about what consistency and validity mean algebraically.
            </div>

            <p>Watch the <strong>undistributed middle</strong> fail Z while satisfying P:</p>

            ${syl(['−M+P', '−M+S'], '−S+P')}

            <p>Counterclaim: <code>{−M+P, −M+S, +S−P}</code></p>
            <p>P: one particular (<code>+S−P</code>) ✓<br>
            Z: <code>(−M+P)+(−M+S)+(+S−P) = −2M+2S ≠ 0</code> ✗</p>
            <p>Z fails because M appears with the <em>same</em> sign (−M) in both premises —
            it cannot cancel. The middle term is undistributed, the counterclaim can be
            consistently satisfied, and the argument is invalid. The P/Z test and the
            cancellation-check are two angles on the same algebraic fact.</p>
          `
        },

        // ── Exercise: Quick Check ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-regal-check",
          title: "Quick Check: REGAL Foundations",
          instruction: "Apply what you know about REGAL, regularity, and counterclaims.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What do the two halves of the word REGAL refer to?",
              choices: [
                "REG = Regularity (the mood condition); egAL = Equality (from French 'égal' = equal/adds up)",
                "REG = Reduction (to first-figure form); AL = Algebraic Laws of the syllogism",
                "R = Relational; EGAL = Every General Argument is Logical",
                "REGAL is an acronym for the five steps of syllogistic proof"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "REGAL is a portmanteau — not an acronym. 'reg' from REGular and 'al' from egAL (French: equal/adds up). Regularity governs the mood (how many particulars, and where). Equality governs the algebra (premises must sum to the conclusion)."
            },
            {
              prompt: "Syllogism Darii has mood AII: the first premise is an A-form (universal), the second premise is an I-form (particular), and the conclusion is an I-form (particular). What is its regularity status?",
              choices: [
                "P-regular — two particular statements, one of which is the conclusion",
                "U-regular — all statements are universal",
                "Irregular — a particular premise is not permitted",
                "P-regular — but only if the middle term cancels"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "P-regular means exactly two particular statements, with the conclusion being one of them. AII has one particular premise (I-form) and one particular conclusion (I-form) — exactly two particulars, conclusion included. P-regular. Regularity is about the count and placement, not about whether the algebra works out."
            },
            {
              promptHtml: mcPrompt("The counterclaim of", "{ −M+P,  −S+M,  ∴ −S+P }  is formed by keeping the premises and replacing the conclusion with:"),
              choices: ["+S−P (the O-form contradictory — deny the A-form conclusion)", "−S−P (flip both signs of the conclusion)", "+S+P (I-form contradictory of E-form)", "−S+P unchanged (the conclusion must still hold)"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The counterclaim denies the conclusion. The contradictory of the A-form −S+P is the O-form +S−P — both signs flip (universal → particular, affirmed → denied). The counterclaim is {−M+P, −S+M, +S−P}."
            },
            {
              promptHtml: mcPrompt("Check the Barbara counterclaim", "{ −M+P,  −S+M,  +S−P }"),
              choices: [
                "Satisfies both P and Z: one particular (+S−P); sum = (−M+P)+(−S+M)+(+S−P) = 0",
                "Satisfies P but not Z: one particular, but the sum = −2M",
                "Satisfies Z but not P: sum = 0, but two particulars",
                "Satisfies neither: two particulars and sum ≠ 0"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "P: only +S−P has a + subject — one particular. ✓  Z: (−M+P)+(−S+M)+(+S−P) = (−M+M)+(−S+S)+(P−P) = 0. ✓  Both conditions hold → the counterclaim is inconsistent → Barbara is valid."
            }
          ]
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-regal-final",
          isFinal: true,
          title: "Final Review: Why REGAL Works",
          instruction: "Apply the full derivation — from regularity and equality to counterclaims and P/Z.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Mood IIA has two particular premises and a universal conclusion. Its counterclaim contains the two particular premises (kept) plus the denial of the universal conclusion. The denial of a universal is particular. How many particular statements does this counterclaim have, and what does that mean for condition P?",
              choices: [
                "Three particulars — condition P fails (requires exactly one), so no IIA syllogism can be valid",
                "One particular — condition P holds, so the mood could be valid if equality also holds",
                "Zero particulars — both premises are particular so the counterclaim is all universal",
                "Two particulars — condition P holds because two is close enough to one"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The counterclaim of IIA keeps both particular premises intact, then adds the denial of the universal conclusion — which is itself particular (contradictory of universal = particular). That gives three particulars total. P requires exactly one. Three fails P → the counterclaim cannot be inconsistent regardless of the algebra → no IIA argument can be valid. Irregular moods are ruled out by the count alone."
            },
            {
              promptHtml: `Verify Ferio (EIO-1): ${syl(['−M−P', '+S+M'], '+S−P')}`,
              choices: [
                "Counterclaim {−M−P, +S+M, −S+P}: P ✓ (one particular: +S+M), Z ✓ (sum = 0) — valid",
                "Counterclaim {−M−P, +S+M, +S+P}: P fails — two particulars",
                "Counterclaim {−M−P, +S+M, −S+P}: Z fails — middle term does not cancel",
                "Ferio is P-regular but fails equality, so it is invalid"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Ferio (EIO): P1 = −M−P (E-form), P2 = +S+M (I-form, particular), conclusion = +S−P (O-form, particular). Counterclaim: deny the O-form conclusion → A-form contradictory −S+P. Counterclaim = {−M−P, +S+M, −S+P}. P: one particular (+S+M) ✓. Z: (−M−P)+(+S+M)+(−S+P) = (−M+M)+(−P+P)+(S−S) = 0 ✓. Valid."
            },
            {
              prompt: "A syllogism is regular but its premises do not sum to the conclusion. Which REGAL condition fails, and what does the P/Z analysis reveal?",
              choices: [
                "Equality fails — the counterclaim satisfies P (correct number of particulars) but not Z (sum ≠ 0), so the counterclaim can be satisfied and the argument is invalid",
                "Regularity fails — the mood count is wrong regardless of the algebra",
                "Both conditions fail simultaneously — if equality fails, regularity must also fail",
                "Neither condition fails — regularity alone guarantees validity"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Equality (condition Z) fails. Because the mood is still regular, the counterclaim will have exactly one particular (P ✓). But the algebraic sum won't be zero (Z ✗). A non-zero sum means the middle term didn't fully cancel — some term remains in the sum that shouldn't. The counterclaim isn't forced to be false, so the argument isn't guaranteed valid. The undistributed middle is a classic example: regular mood, Z fails."
            },
            {
              prompt: "Why does the P/Z theorem explain REGAL rather than just restating it?",
              choices: [
                "P/Z gives an independent account of inconsistency derived from term algebra; REGAL then follows as a theorem — any valid syllogism's counterclaim must satisfy P/Z, which forces exactly the regularity and equality conditions",
                "P/Z and REGAL are just two names for the same checklist; neither explains the other",
                "P/Z is stronger than REGAL — it identifies more valid syllogisms that REGAL misses",
                "REGAL explains P/Z, not the other way around — REGAL came first historically"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "P/Z is defined independently of REGAL in terms of algebraic properties of conjunctions. The P/Z theorem says a conjunction is inconsistent iff it satisfies P and Z. PV says an argument is valid iff its counterclaim is inconsistent. Together: valid iff counterclaim satisfies P/Z. Working out which mood structures produce counterclaims satisfying P/Z yields exactly the regularity and equality conditions — REGAL falls out as a theorem, not an axiom."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 6: Enthymemes and the Matrix Method
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-06",
      title: "Lesson 6: Enthymemes and the Matrix Method",
      description: "Extend REGAL in two directions: backward to recover what an argument left implicit, and forward to chain multiple premises into one inference. Then find the logical principle that justifies all of it.",
      completionText: "Enthymemes are arguments with gaps that REGAL can fill. Polysyllogisms are chains that REGAL can compress. Both are instances of the same algebraic structure — add up what you have, cancel the middles, read off the result. The Matrix Method names the logical principle underneath it all: Aristotle's Dictum de Omni, made algebraic. In the final lesson of this course you'll close out with identity statements and the laws TFL derives from its own sign algebra.",
      blocks: [

        // ── Concept: Enthymemes — Arguments with Gaps ────────────────────────
        {
          type: "concept",
          id: "enthymemes",
          title: "1. Enthymemes — Arguments with Gaps",
          content: `
            <p>Most arguments in ordinary reasoning are not stated in full. A premise that is
            obvious, widely shared, or too polite to spell out gets left implicit. An argument
            with one or more missing premises (or occasionally a missing conclusion) is called
            an <strong>enthymeme</strong>. The omitted piece is the <strong>tacit premise</strong>.</p>

            <p>Consider this argument:</p>

            ${engSyl(
              "Poodle is a dog.",
              "<em>(tacit)</em>",
              "Poodle is an animal."
            )}

            <p>The conclusion follows — but only because a premise was silently assumed. TFL lets
            you <em>recover</em> that premise algebraically. The key is that any completed argument
            must satisfy REGAL: it must be regular and equal. Those two constraints, together with
            a term-membership condition, pin down the missing piece.</p>

            <p>Three constraints narrow the search:</p>

            <ol>
              <li><strong>Regularity constraint.</strong> No valid argument has two particular
              premises. If the given premise and the conclusion are both particular (+ on subject),
              the missing premise must be universal. If one is universal and the other particular,
              the missing premise is particular. This constraint fixes the <em>mood</em> of the
              tacit premise before you touch any algebra.</li>

              <li><strong>Term constraint.</strong> The missing premise must contain the
              <strong>middle term</strong> — the term that links the given material to the
              conclusion. If a term appears in the conclusion but not in any given premise, it
              must appear in the tacit premise.</li>

              <li><strong>Equality constraint.</strong> When the tacit premise is added to the
              given premises, the sum must equal the conclusion. This determines the exact sign
              and content of the missing premise.</li>
            </ol>

            <div class="callout-note">
              <span class="cn-label">Notation</span>
              A recovered tacit premise is marked with an asterisk on its premise number —
              <code>1.*</code>, <code>2.*</code> — to show it was not given but derived.
            </div>
          `
        },

        // ── Concept: Recovering the Missing Premise ───────────────────────────
        {
          type: "concept",
          id: "recovery",
          title: "2. The Algebraic Recovery",
          content: `
            <p>The equality constraint makes recovery mechanical: rearrange the equation
            <code>given + tacit = conclusion</code> and solve for the tacit premise.</p>

            <div class="syntax-box">
              <code>tacit = conclusion &minus; given premises</code>
            </div>

            <p><strong>Example 1 — Poodle</strong></p>

            <div class="proof-box">
              <div class="proof-row"><code>+Poodle*+Dog</code><span class="proof-note">Given premise (P-form)</span></div>
              <div class="proof-row"><code>+Poodle*+Animal</code><span class="proof-note">Conclusion (P-form)</span></div>
            </div>

            <p>Both are particular → missing premise is <strong>universal</strong> (regularity).
            Dog appears in the given premise; Animal in the conclusion — Dog is the middle term
            that must appear in the tacit premise. So the tacit premise has the form
            <code>−Dog + ?</code>. Equality:</p>
            <div class="proof-box">
              <div class="proof-row"><code>(+Poodle*+Dog) + (−Dog+Animal) = +Poodle*+Animal</code><span class="proof-note">✓</span></div>
            </div>
            <p>Tacit premise: <code>−Dog+Animal</code> — all dogs are animals.</p>

            <p><strong>Example 2 — Ted</strong></p>

            <div class="proof-box">
              <div class="proof-row"><code>+Ted*+Priest</code><span class="proof-note">Ted is a Catholic priest (given)</span></div>
              <div class="proof-row"><code>+Ted*−Married</code><span class="proof-note">Ted is not married (conclusion)</span></div>
            </div>

            <p>Both are particular → missing premise is universal. Married appears in the
            conclusion but not the given premise — it is the new term that must enter via the
            tacit premise. Apply the subtraction:</p>
            <div class="proof-box">
              <div class="proof-row"><code>tacit = (+Ted*−Married) − (+Ted*+Priest)</code></div>
              <div class="proof-row"><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= −Priest − Married</code><span class="proof-note">E-form: no Catholic priest is married</span></div>
            </div>
            <p>Verify: <code>(+Ted*+Priest) + (−Priest−Married) = +Ted*−Married</code> ✓</p>

            <p>The completed argument:</p>
            ${syl(
              [['−Priest−Married', 'No Catholic priest is married  1.*'],
               ['+Ted*+Priest',    'Ted is a Catholic priest      2.']],
              ['+Ted*−Married',    'Ted is not married']
            )}

            <p>Premise 1 is marked <code>1.*</code> — it was tacit, now made explicit. The
            argument is P-regular (one particular premise, one particular conclusion) and
            satisfies equality.</p>
          `
        },

        // ── Concept: Polysyllogisms ───────────────────────────────────────────
        {
          type: "concept",
          id: "polysyllogisms",
          title: "3. Polysyllogisms — Chaining More Than Two Premises",
          content: `
            <p>A <strong>polysyllogism</strong> (also called a <strong>sorites</strong>) is a
            syllogism with more than two premises. The same REGAL conditions apply: the argument
            is U-regular if all statements are universal, or P-regular if exactly two are
            particular (one premise, one conclusion). The add-up method scales directly —
            sum all the premises, all middle terms cancel, and what remains is the conclusion.</p>

            <p>Lewis Carroll used polysyllogisms as a test of logical methods. Here is his
            puddings example:</p>

            ${syl(
              [['−P+N',  'all puddings are nice'],
               ['+D+P',  'some deserts are puddings'],
               ['−N−W',  'nothing nice is wholesome']],
              ['+D−W', 'some deserts are not wholesome']
            )}

            <p>Three middle terms weave through the premises: <code>P</code> (puddings) connects
            D to N; <code>N</code> (nice) connects P to W. Both cancel in the sum:</p>

            <div class="proof-box">
              <div class="proof-row"><code>(−P+N) + (+D+P) + (−N−W)</code></div>
              <div class="proof-row"><code>= D + (−P+P) + (N−N) − W</code></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">=</span><code>+D−W</code><span class="proof-note">some deserts are not wholesome ✓</span></div>
            </div>

            <p>Regularity check: <code>+D+P</code> is the only particular premise; <code>+D−W</code>
            is the particular conclusion. Exactly two particulars, conclusion is one of them —
            P-regular ✓.</p>

            <div class="callout-note">
              <span class="cn-label">Lewis Carroll's Six-Premise Sorites</span>
              Carroll's most elaborate example involves bathing machines, salt, and mother-of-pearl
              — six premises, each universal. All six cancel cleanly to a two-term universal
              conclusion: <code>−B−M</code> (no bathing machine is made of mother-of-pearl).
              TFL handles any number of premises without additional machinery.
            </div>
          `
        },

        // ── Concept: The Matrix Method and Dictum de Omni ─────────────────────
        {
          type: "concept",
          id: "matrix-method",
          title: "4. The Matrix Method and Dictum de Omni",
          content: `
            <p>You have been canceling middle terms since Introduction Lesson 5. But <em>why</em>
            does cancellation yield a valid conclusion? The answer is an ancient principle given
            a modern algebraic form.</p>

            <div class="grammar-rule">
              <span class="g-label">Dictum de Omni (DDO)</span>
              Whatever characterizes every X also characterizes any X. If a predicate holds
              of <em>all</em> members of a class, it holds of <em>any</em> individual or
              subclass within that class.
            </div>

            <p>Every two-premise syllogistic inference has two roles:</p>

            <ul>
              <li>The <strong>Omni premise</strong> (also called the <em>donor</em>): the
              universal premise of the form <code>−X+Y</code>. It says "every X is Y" —
              X is distributed (negative), and Y is what X's membership donates to anyone
              that has X.</li>
              <li>The <strong>Matrix premise</strong> (also called the <em>host</em>): the
              other premise, in which X appears with a <em>positive</em> sign — some term is
              embedded in the "is-X" environment (the matrix).</li>
            </ul>

            <p>DDO says: since every X is Y, you can <strong>substitute Y for X</strong> in the
            matrix premise. The middle term X is replaced by what the donor donates:</p>

            <div class="proof-box">
              <div class="proof-row"><code>+S + M</code><span class="proof-note">Matrix premise: some S is M — S embedded in the "is-M" matrix</span></div>
              <div class="proof-row"><code>−M + P</code><span class="proof-note">Omni premise: every M is P — M donates P</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+S + P</code><span class="proof-note">DDO: replace M with P in the matrix → some S is P</span></div>
            </div>

            <p>Algebraically: M appears with + in the host and − in the donor — they cancel,
            leaving <code>+S+P</code>. The algebraic cancellation and the logical substitution
            are two descriptions of the same inference.</p>

            <p>This is why the <strong>donor must always be universal</strong>. DDO requires
            "every X" — a universal claim about X. A particular premise (<code>+M+P</code>,
            "some M is P") does not license substitution: knowing that some M are P tells you
            nothing about what any given S with M also has. If both premises were particular,
            no valid inference follows — and the P/Z analysis confirms this: the counterclaim
            would fail condition P.</p>

            <div class="grammar-rule">
              <span class="g-label">The Matrix Method in One Line</span>
              Find which premise distributes the middle term (the donor); substitute what it
              donates into the other premise (the matrix). The result is the conclusion.
              Algebraically: opposite signs on the middle term guarantee cancellation.
            </div>
          `
        },

        // ── Exercise: Quick Check ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-enthymeme-check",
          title: "Quick Check: Enthymemes and Polysyllogisms",
          instruction: "Apply the three recovery constraints and the add-up method.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: `An enthymeme has given premise <code>+Aristotle*+Philosopher</code> and conclusion <code>+Aristotle*+Mortal</code>. Both are particular. What must be true of the tacit premise?`,
              choices: [
                "It must be universal — two particular premises would be irregular",
                "It must be particular — the conclusion is particular so the premise matches",
                "It could be either — regularity only constrains the conclusion",
                "It must be an E-form — the conclusion has a denied predicate"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Regularity constraint: no valid syllogism has two particular premises. Given and conclusion are both particular (+Aristotle*+Philosopher and +Aristotle*+Mortal). The missing premise must be universal so the argument is P-regular — one universal (tacit), one particular (given), one particular (conclusion)."
            },
            {
              promptHtml: `In the same enthymeme (<code>+Aristotle*+Philosopher</code>, ∴ <code>+Aristotle*+Mortal</code>), which term must appear in the tacit premise?`,
              choices: [
                "Philosopher — it appears in the given premise and must be the middle term linking to Mortal",
                "Mortal — it appears in the conclusion and must be introduced by the tacit premise",
                "Aristotle — he is the subject of both statements and must appear in every premise",
                "Both Philosopher and Mortal — the tacit premise must repeat the conclusion"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Term constraint: the tacit premise must contain the middle term — the term that links the given premise to the conclusion. Philosopher appears in the given premise. Mortal appears in the conclusion. The link between them is Philosopher: the tacit premise will be of the form −Philosopher+Mortal (all philosophers are mortal)."
            },
            {
              promptHtml: `Verify: does <code>(+Aristotle*+Philosopher) + (−Philosopher+Mortal)</code> equal the conclusion <code>+Aristotle*+Mortal</code>?`,
              choices: [
                "Yes — Philosopher cancels (+Philosopher − Philosopher = 0), leaving +Aristotle*+Mortal",
                "No — the signs on Philosopher don't match for cancellation",
                "Yes — but only because Aristotle is singular",
                "No — you need a third premise to derive a particular conclusion"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Add them: (+Aristotle*+Philosopher) + (−Philosopher+Mortal) = +Aristotle* + (Philosopher−Philosopher) + Mortal = +Aristotle*+Mortal ✓. The middle term Philosopher has opposite signs (+Philosopher in the given premise, −Philosopher in the tacit premise) and cancels exactly."
            },
            {
              promptHtml: `Add up the three Lewis Carroll premises: <code>−P+N</code>, <code>+D+P</code>, <code>−N−W</code>. What is the conclusion?`,
              choices: [
                "+D−W (some deserts are not wholesome)",
                "−D+W (all deserts are wholesome)",
                "+D+W (some deserts are wholesome)",
                "−D−W (no desert is wholesome)"
              ],
              answer: 0,
              explanation: "(−P+N) + (+D+P) + (−N−W) = D + (−P+P) + (N−N) − W = +D−W. Both middle terms cancel: P cancels between premises 1 and 2, N cancels between premises 1 and 3. The conclusion is O-form: some deserts are not wholesome."
            }
          ]
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-enthymeme-final",
          isFinal: true,
          title: "Final Review: Recovery, Chaining, and the Dictum",
          instruction: "Apply full enthymeme recovery, polysyllogism analysis, and the Matrix Method.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: `Enthymeme: <code>−Logician+Careful</code> (all logicians are careful thinkers), ∴ <code>+Professor+Careful</code> (some professors are careful thinkers). Recover the tacit premise.`,
              choices: [
                "+Professor+Logician — some professors are logicians (the missing particular premise)",
                "−Professor+Logician — all professors are logicians (the missing universal premise)",
                "+Careful+Logician — some careful thinkers are logicians",
                "+Professor+Careful — the conclusion restated as a premise"
              ],
              answer: 0,
              explanation: "Given premise is universal (−Logician+Careful); conclusion is particular (+Professor+Careful). Regularity: one U premise + one P conclusion → missing premise must be P. Term: Professor appears in the conclusion but not the given premise → missing premise contains Professor. Form: +Professor+Logician. Verify: (−Logician+Careful) + (+Professor+Logician) = +Professor+Careful ✓."
            },
            {
              promptHtml: `Polysyllogism analysis: <code>−P+N, +D+P, −N−W, ∴ +D−W</code>. Which statement is the matrix/host premise for the first cancellation step (canceling P)?`,
              choices: [
                "+D+P — P appears with a positive sign, embedded in the 'is-P' environment",
                "−P+N — P has a negative sign (distributed), making it the donor",
                "−N−W — N has a negative sign, so this is the donor for the second step",
                "+D−W — the conclusion is always the matrix premise"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The matrix/host is the premise where the middle term has a positive sign — the term is 'embedded' in that premise's environment. P has a positive sign in +D+P, making it the matrix. The donor for P is −P+N, where P has a negative sign (distributed). DDO: since every P is N, any D that is P is also N — so +D+P with donor −P+N yields +D+N."
            },
            {
              promptHtml: `Apply the Matrix Method: what conclusion follows from <code>+Student+Philosopher</code> and <code>−Philosopher+Wise</code>?`,
              choices: [
                "+Student+Wise — Philosopher cancels; some student is wise",
                "+Wise+Student — the conclusion must put the donated term first",
                "−Student+Wise — the matrix premise always becomes universal",
                "+Philosopher+Wise — the donor term moves to subject position"
              ],
              answer: 0,
              explanation: "Matrix/host: +Student+Philosopher (Philosopher is positive — S embedded in the 'is-Philosopher' environment). Donor/omni: −Philosopher+Wise (Philosopher negative — distributes Wise). DDO: every Philosopher is Wise; any Student that is a Philosopher is also Wise. Replace Philosopher with Wise in the host: +Student+Wise. Algebraically: (+Student+Philosopher) + (−Philosopher+Wise) = +Student+Wise ✓."
            },
            {
              prompt: "Why must the Omni/Donor premise always be universal in the Matrix Method?",
              choices: [
                "DDO requires 'every X' — only a universal premise distributes the middle term, licensing substitution into the matrix. A particular premise 'some X is Y' does not license replacing X with Y for any given item.",
                "A particular donor would create two particular premises, violating P-regularity and automatically making the argument invalid.",
                "The Matrix Method only applies to first-figure syllogisms, all of which have a universal major premise.",
                "The DDO licensing requirement and the P-regularity constraint are two independent reasons, each separately forcing a universal donor."
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The logical reason is primary: DDO licenses substitution only for 'every X.' Knowing that some X is Y tells you nothing about what any particular X-bearing subject also has — the substitution doesn't go through. The regularity constraint (no two P-premises) is a consequence of the same fact, not an independent reason. A particular 'donor' would fail to support DDO, and its counterclaim would fail condition P — both diagnoses point to the same invalidity."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 7: Identity and the Laws of Identity
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-07",
      title: "Lesson 7: Identity and the Laws of Identity",
      description: "Discover how TFL handles identity without a special relation symbol — and how all four classical laws of identity fall out as theorems from ordinary categorical algebra.",
      completionText: "Identity in TFL is not a relation — it is an ordinary categorical statement with two uniquely-denoting terms. Symmetry follows from commutativity, transitivity from cancellation, reflexivity from the impossibility of self-contradiction, and Leibniz's Law from DDO. Modern predicate logic needs four extra axioms to get the same results; TFL needs none. That completes Course 2. In Course 3 you'll extend the syllogistic to relational arguments — premises with compound predicate terms — and meet the Dictum de Omni in its full relational form.",
      blocks: [

        // ── Concept: What an Identity Statement Is ────────────────────────────
        {
          type: "concept",
          id: "identity-form",
          title: "1. Identity Statements in TFL",
          content: `
            <p>From Lesson 2 of this course and Introduction Lesson 7 you know that a
            <strong>uniquely-denoting term (UDT)</strong> names exactly one individual. Proper
            names, definite descriptions, and mathematical expressions like <em>twice seven</em>
            are UDTs — each picks out precisely one thing. They are marked with an asterisk:
            <code>Twain*</code>, <code>Caesar*</code>, <code>theQueen*</code>.</p>

            <p>An <strong>identity statement</strong> is a categorical statement whose
            <em>predicate</em> is also a UDT — both subject and predicate pick out exactly one
            individual. In TFL, this is nothing more than an ordinary I-form with two asterisked
            terms:</p>

            <div class="ex-table">
              <div class="ex-row"><code>+Twain*+Clemens*</code><span>Twain is Clemens</span></div>
              <div class="ex-row"><code>+Caesar*+Conqueror*</code><span>Caesar is the Conqueror of Gaul</span></div>
              <div class="ex-row"><code>+P₄₂*+Clinton*</code><span>The 42nd President is Clinton</span></div>
              <div class="ex-row"><code>+TwiceSeven*+Fourteen*</code><span>Twice seven is fourteen</span></div>
            </div>

            <p>No special symbol, no extra notation. Identity is just the ordinary I-form
            <code>+X*+Y*</code> — two UDTs connected by the positive copula.</p>

            <div class="grammar-rule">
              <span class="g-label">TFL on Identity</span>
              TFL does not recognize identity as a relation. "Twain is Clemens" is a monadic
              categorical statement — no different in structure from "Twain is an author." The
              only difference is that the predicate <em>Clemens*</em> is itself a UDT rather than
              a general term.
            </div>

            <p>Because a UDT denotes exactly one individual, the all/some distinction collapses.
            <code>+X*+P</code> ("some X* is P") entails <code>−X*+P</code> ("every X* is P") —
            if the one individual that is X* is P, then trivially every X* is P. This is
            <strong>wild quantity</strong>: identity statements can freely be assigned either
            particular or universal quantity as the inference requires.</p>

            <div class="callout-note">
              <span class="cn-label">Contrast with MPL</span>
              Modern predicate logic requires a special identity predicate (<code>=</code>) and
              four additional axioms — reflexivity, symmetry, transitivity, and Leibniz's Law —
              added on top of the basic predicate calculus. In TFL, as you will see in this lesson,
              all four laws are <strong>derivable</strong> from the ordinary sign algebra.
            </div>
          `
        },

        // ── Concept: Symmetry and Reflexivity ─────────────────────────────────
        {
          type: "concept",
          id: "symmetry-reflexivity",
          title: "2. Symmetry and Reflexivity",
          content: `
            <p><strong>The Law of Symmetry:</strong> If X* is Y*, then Y* is X*.</p>

            <p>In TFL: <code>+X*+Y*</code> entails <code>+Y*+X*</code>. This is an instance of
            the <strong>Law of Commutation</strong> you have used since Introduction Lesson 2.
            The I-form <code>+(+X+Y)</code> is equivalent to <code>+(+Y+X)</code> — the two
            terms joined by the positive copula can be exchanged without changing the proposition.
            Commutativity is not a special fact about identity; it is the general behavior of the
            positive copula. Identity statements inherit it for free.</p>

            <div class="proof-box">
              <div class="proof-row"><code>+Twain*+Clemens*</code><span class="proof-note">Twain is Clemens</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">≡</span><code>+Clemens*+Twain*</code><span class="proof-note">Clemens is Twain — by commutativity</span></div>
            </div>

            <p>No new rule is needed. Symmetry of identity is just commutativity of <code>+</code>.</p>

            <hr style="margin:1.4em 0;border:none;border-top:1px solid var(--accent-border)">

            <p><strong>The Law of Reflexivity:</strong> X* is X*.</p>

            <p>Consider the denial: <code>+X*−X*</code> — "some X* is non-X*." A UDT denotes
            exactly one individual. That individual is X*. Saying it is simultaneously non-X*
            is a direct contradiction: the same individual both is and is not the very thing it
            denotes. <code>+X*−X*</code> is an <strong>inconsistent statement</strong> — it
            can never be true.</p>

            <p>Because the denial is impossible, the original statement <code>+X*+X*</code>
            is <strong>necessarily true</strong>. Every UDT is identical to itself — not as an
            extra axiom, but as a consequence of what it means for a term to denote exactly
            one individual.</p>

            <div class="proof-box">
              <div class="proof-row"><code>+X*−X*</code><span class="proof-note">denial of reflexivity — "some X* is non-X*"</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">⊥</span><code>contradiction — impossible for a UDT</code></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+X*+X*</code><span class="proof-note">necessarily true — reflexivity holds</span></div>
            </div>
          `
        },

        // ── Concept: Transitivity ─────────────────────────────────────────────
        {
          type: "concept",
          id: "transitivity",
          title: "3. Transitivity — Identity as Syllogism",
          content: `
            <p><strong>The Law of Transitivity:</strong> If X* is Y*, and Y* is Z*, then X* is Z*.</p>

            <p>This is a syllogism. Wild quantity lets you assign universal quantity to an
            identity premise wherever the middle term needs to cancel. Assign universal to the
            first premise so that Y* appears negative, and keep the second as particular so
            Y* appears positive — the middle term Y* then has opposite signs and cancels:</p>

            ${syl(
              [['−X*+Y*', 'every X* is Y*  (wild quantity, universal)'],
               ['+Y*+Z*', 'some Y* is Z*']],
              ['+X*+Z*', 'some X* is Z*']
            )}

            <p>Y* cancels: <code>(−X*+Y*) + (+Y*+Z*) = −X*+(Y*−Y*)+Z* = −X*+Z*</code>...
            wait — actually with the second premise as particular and the first as universal we get
            a P-regular argument, and the Darii structure gives a particular conclusion:</p>

            <div class="proof-box">
              <div class="proof-row"><code>(−X*+Y*) + (+Y*+Z*)</code></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">=</span><code>−X* + (Y*−Y*) + Z* &nbsp;→&nbsp; wait, signs: −X* accumulates, then +Y*−Y*=0, leaving −X*+Z*... but the conclusion should be +X*+Z*.</code></div>
            </div>

            <p>Let us assign universal to the <em>second</em> premise instead — this puts Y*
            negative in the donor position and positive in the matrix:</p>

            ${syl(
              [['+X*+Y*', 'some X* is Y*  (matrix/host)'],
               ['−Y*+Z*', 'every Y* is Z*  (wild quantity — omni/donor)']],
              ['+X*+Z*', 'some X* is Z*']
            )}

            <p>Y* cancels: <code>(+X*+Y*) + (−Y*+Z*) = +X* + (Y*−Y*) + Z* = +X*+Z*</code> ✓.
            This is a DDO inference: every Y* is Z*, and X* is Y* — so X* is Z*. Wild quantity on
            the second premise turns it into the donor, and the first premise serves as the matrix.</p>

            <p>The same chain extends to any length. "The 42nd President is Clinton; Clinton is
            the husband of Hillary; therefore the 42nd President is the husband of Hillary" is a
            two-step transitivity chain, solved by two successive cancellations.</p>
          `
        },

        // ── Concept: Leibniz's Law ────────────────────────────────────────────
        {
          type: "concept",
          id: "leibniz-law",
          title: "4. Leibniz's Law — Substitution as DDO",
          content: `
            <p>The fourth classical law of identity is the most powerful:</p>

            <div class="grammar-rule">
              <span class="g-label">Law of Indiscernibility (Leibniz's Law)</span>
              If X* is Y*, then whatever is true of X* is true of Y*. Identical things
              are indiscernible — no property can distinguish them.
            </div>

            <p>In TFL, this is simply a DDO syllogism. Use wild quantity to assign the identity
            premise universal quantity, making it the donor; let the property premise be the matrix:</p>

            ${syl(
              [['−Twain*+Clemens*', 'every Twain* is Clemens*  (wild quantity — donor)'],
               ['+Twain*+Humorist', 'Twain is a humorist  (matrix)']],
              ['+Clemens*+Humorist', 'Clemens is a humorist']
            )}

            <p><code>Twain*</code> cancels: <code>(−Twain*+Clemens*) + (+Twain*+Humorist) = +Clemens*+Humorist</code> ✓.</p>

            <p>The identity premise donates <code>Clemens*</code> wherever <code>Twain*</code>
            appeared. That is Leibniz's Law — but it required no axiom. It is DDO applied to an
            identity premise used as a donor.</p>

            <p>The general pattern for any property Q:</p>

            ${syl(
              [['−X*+Y*', 'every X* is Y*  (identity premise as donor)'],
               ['+X*+Q',  'X* has property Q  (matrix)']],
              ['+Y*+Q', 'Y* has property Q']
            )}

            <div class="callout-note">
              <span class="cn-label">TFL vs. MPL on Identity</span>
              Modern predicate logic introduces the identity sign <code>=</code> as a primitive
              two-place relation and then adds four axioms: reflexivity (LI.1), symmetry (LI.2),
              transitivity (LI.3), and Leibniz's Law (LI.4). In TFL, no special symbol and no
              extra axioms are needed. All four laws are theorems:<br><br>
              — Reflexivity: from the impossibility of <code>+X*−X*</code><br>
              — Symmetry: from commutativity of the I-form<br>
              — Transitivity: from DDO / syllogistic cancellation<br>
              — Leibniz's Law: from DDO with the identity premise as donor<br><br>
              The unity of TFL's algebra — one set of rules handling categoricals, singulars,
              compounds, and identity — is on full display here.
            </div>
          `
        },

        // ── Exercise: Quick Check ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-identity-check",
          title: "Quick Check: Identity in TFL",
          instruction: "Apply the notation and laws of identity.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "How is 'Hesperus is Phosphorus' written in TFL?",
              choices: [
                "+Hesperus*+Phosphorus* — two UDTs joined by the positive copula",
                "Hesperus* = Phosphorus* — using the identity sign",
                "+Hesperus*+(Ident±Phosphorus*) — identity as a two-place relation",
                "−Hesperus*+Phosphorus* — universal quantity, since it holds of every Hesperus"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "+Hesperus*+Phosphorus* — two UDTs, ordinary I-form. TFL does not use a special identity sign and does not treat identity as a two-place relation. It is the same categorical form as '+Hesperus*+EveningStar*' or '+Hesperus*+Bright' — the only difference is that the predicate is also a UDT."
            },
            {
              prompt: "What is wild quantity, and why do identity statements have it?",
              choices: [
                "The freedom to assign either universal or particular quantity: since a UDT denotes exactly one individual, 'some X* is P' and 'every X* is P' are equivalent",
                "The fact that identity statements have no quantity — they are neither universal nor particular",
                "The use of ± to mark proper names as UDTs in subject position",
                "The property of E-form statements that makes them equivalent to their converses"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Wild quantity: +X*+P entails −X*+P because there is at most one X*. If the single individual denoted by X* has property P, then trivially every individual denoted by X* (i.e., that same individual) has P. The all/some distinction collapses for UDTs. This flexibility is what lets identity premises serve as either donors or matrices in DDO inferences."
            },
            {
              promptHtml: `From <code>+Clemens*+Twain*</code>, the Law of Symmetry gives:`,
              choices: [
                "+Twain*+Clemens* — by commutativity of the positive copula",
                "−Twain*+Clemens* — symmetry always produces a universal conclusion",
                "+Clemens*−Twain* — deny the predicate to get the converse",
                "+Twain*−Clemens* — the converse of an identity is its obverse"
              ],
              answer: 0,
              explanation: "Symmetry is commutativity: +X*+Y* ≡ +Y*+X*. The I-form's positive copula joins two terms symmetrically — the order of the terms does not change the proposition. No new rule is needed; this is the Law of Commutation applied to an identity statement."
            },
            {
              promptHtml: `Apply Leibniz's Law: from <code>+Caesar*+Conqueror*</code> and <code>+Caesar*+Roman</code>, what follows?`,
              choices: [
                "+Conqueror*+Roman — assign universal to the identity premise (donor), cancel Caesar*",
                "+Caesar*+Roman — the conclusion just restates the second premise",
                "−Conqueror*+Roman — identity premises always yield universal conclusions",
                "+Roman+Conqueror* — the property term becomes the subject"
              ],
              answer: 0,
              explanation: "Leibniz's Law as DDO: assign universal quantity to the identity premise: −Caesar*+Conqueror* (donor). The property premise +Caesar*+Roman is the matrix. Cancel Caesar*: (−Caesar*+Conqueror*) + (+Caesar*+Roman) = +Conqueror*+Roman. The Conqueror is Roman. Caesar* cancels as the middle term."
            }
          ]
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-identity-final",
          isFinal: true,
          title: "Final Review: The Laws of Identity",
          instruction: "Derive each law and apply them to full arguments.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: `Transitivity chain: <code>+P₄₂*+Clinton*</code> (the 42nd President is Clinton) and <code>+Clinton*+Hillary*</code> (Clinton is the husband of Hillary). What is the conclusion, and how is it derived?`,
              choices: [
                "+P₄₂*+Hillary* — assign universal to the second identity (donor), cancel Clinton*",
                "+Hillary*+P₄₂* — symmetry of the conclusion applies after cancellation",
                "−P₄₂*+Hillary* — both premises become universal by wild quantity",
                "+P₄₂*+Clinton*+Hillary* — combine both identities into a triple"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Assign universal to the second premise: −Clinton*+Hillary* (donor). Keep the first as particular: +P₄₂*+Clinton* (matrix). Cancel Clinton*: (+P₄₂*+Clinton*) + (−Clinton*+Hillary*) = +P₄₂*+Hillary*. The 42nd President is the husband of Hillary. This is transitivity — a DDO inference using the second identity as donor."
            },
            {
              promptHtml: `Verify: does <code>+X*−X*</code> violate the P/Z conditions or produce a direct contradiction?`,
              choices: [
                "Direct contradiction — it asserts the single individual X* both is and is not X*, which is impossible for a UDT; no P/Z calculation needed",
                "It satisfies P (one particular) but fails Z (sum = 2X* ≠ 0) — a Z-failure",
                "It fails P (two particulars) — both occurrences of X* carry positive signs",
                "It is valid by wild quantity — since X* can be assigned universal, +X*−X* becomes −X*−X* which is just an E-form"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "+X*−X* says the one individual denoted by X* both belongs to X* and belongs to non-X*. That is directly self-contradictory — a single individual cannot be both a thing and not that thing. The P/Z framework is designed for syllogistic conjunctions; for a single-term contradiction like this, the impossibility is semantic (the UDT's denotation), not derived from a sum calculation."
            },
            {
              prompt: "Modern predicate logic (MPL) handles identity with a special symbol and four axioms. How does TFL compare?",
              choices: [
                "TFL uses no special symbol and no extra axioms — all four laws are theorems derivable from commutativity, cancellation, and the semantics of UDTs",
                "TFL uses the same four axioms but encodes them in the sign algebra rather than stating them explicitly",
                "TFL handles reflexivity and symmetry algebraically but requires an explicit axiom for Leibniz's Law",
                "TFL avoids identity entirely — UDTs are matched by definite descriptions in MPL, so no identity law is needed"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "TFL requires no identity sign and no additional axioms. Reflexivity follows from the impossibility of +X*−X*. Symmetry follows from commutativity of the I-form. Transitivity and Leibniz's Law follow from DDO with wild quantity. Four theorems derived from algebra that MPL must take as primitive axioms — this is one of TFL's sharpest demonstrations of the power of its unified sign system."
            },
            {
              promptHtml: `Full Leibniz's Law argument: <code>+Hesperus*+Phosphorus*</code>, <code>+Hesperus*+Visible</code>. Identify the donor, the matrix, the middle term, and the conclusion.`,
              choices: [
                "Donor: −Hesperus*+Phosphorus* (wild quantity); matrix: +Hesperus*+Visible; middle: Hesperus*; conclusion: +Phosphorus*+Visible",
                "Donor: +Hesperus*+Phosphorus*; matrix: +Hesperus*+Visible; middle: Visible; conclusion: +Hesperus*+Phosphorus*",
                "Donor: −Phosphorus*+Hesperus*; matrix: +Hesperus*+Visible; middle: Phosphorus*; conclusion: +Hesperus*+Visible",
                "No valid inference — identity statements cannot be used as donors because they have wild quantity"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Assign universal quantity to the identity premise: −Hesperus*+Phosphorus* (donor — Hesperus* is now negative, Phosphorus* is what it donates). The property premise +Hesperus*+Visible has Hesperus* positive — it is the matrix. Middle term: Hesperus*. Cancel: (−Hesperus*+Phosphorus*) + (+Hesperus*+Visible) = +Phosphorus*+Visible. Phosphorus is visible. This is the classical astronomical identity argument."
            }
          ]
        }

      ]
    }

  ]
};
