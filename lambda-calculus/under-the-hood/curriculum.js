// curriculum.js — Lambda Calculus: Under the Hood
// Each lesson is a sequence of blocks: 'concept' blocks teach, 'exercise' blocks test.
// Add new lessons to CURRICULUM.lessons to extend the course.

const CURRICULUM = {
  title: "Lambda Calculus: Under the Hood",
  subtitle: "Evaluation, encodings, and the patterns beneath the surface",
  lessons: [

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 1 — Normal Order vs. Applicative Order
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-01",
      title: "Lesson 1: Normal Order vs. Applicative Order",
      navTitle: "Normal vs. Applicative Order",
      description: "Two reduction strategies, one critical difference",
      completionText: "You've seen that the order in which you fire redexes isn't bookkeeping — it can be the difference between a program that terminates and one that loops forever. In the real world these strategies have names: lazy evaluation (normal order) and eager evaluation (applicative order). But lazy languages don't reduce all the way to normal form — they stop somewhere short of that. The next lesson is about exactly where.",
      blocks: [

        // ── Concept: A Question of Order ──────────────────────────────────────
        {
          type: "concept",
          id: "l01-order-intro",
          title: "A Question of Order",
          content: `
            <p>In <em>Foundations</em>, you reduced expressions by finding a redex and firing it.
            When there's only one redex, there's no choice. But most expressions have several,
            and we've never said which to pick first.</p>
            <p>Consider:</p>
            <div class="syntax-box"><code>(λx.x) ((λy.y) z)</code></div>
            <p>Two redexes live here:</p>
            <div class="ex-table">
              <div class="ex-row"><code>(λx.x) ((λy.y) z)</code><span>the outer application — the whole expression</span></div>
              <div class="ex-row"><code>(λy.y) z</code><span>the inner application — inside the argument</span></div>
            </div>
            <p>Both paths reach the same result:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">fire outer first</span></div>
              <div class="step step-reduce"><code>(λy.y) z</code><span class="step-note">x becomes (λy.y) z</span></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">fire inner first</span></div>
              <div class="step step-reduce"><code>(λx.x) z</code><span class="step-note">(λy.y) z reduces to z</span></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <p>Same answer either way — so order didn't matter here. But that won't always be true.</p>
          `
        },

        // ── Concept: Normal Order ─────────────────────────────────────────────
        {
          type: "concept",
          id: "l01-normal-order",
          title: "Normal Order",
          content: `
            <p><strong>Normal order</strong> always reduces the <strong>outermost, leftmost</strong> redex first.</p>
            <ul class="parts-list">
              <li><strong>Outermost</strong>: prefer a redex that isn't inside another redex's argument —
              apply the function before reducing what you're passing into it</li>
              <li><strong>Leftmost</strong>: when two redexes are equally outer, pick the one further left</li>
            </ul>
            <p>In plain terms: <em>apply functions first, evaluate arguments later — or never, if they're not needed.</em></p>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">normal order: fire outer — (λx.x) applied to its argument</span></div>
              <div class="step step-reduce"><code>(λy.y) z</code><span class="step-note">the argument (λy.y) z travels into the body unevaluated</span></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <p>Notice that <code>(λy.y) z</code> was passed into the body <em>as-is</em>.
            Normal order only had to evaluate it because the body was <code>x</code> —
            a bare variable that needed a value. If the body had discarded <code>x</code>,
            the argument would never have been touched.</p>
          `
        },

        // ── Exercise: Normal Order ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l01-ex-normal",
          title: "Quick Check: Normal Order",
          instruction: "What does normal order produce after exactly one step?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal order — one step:",
              expr: "(λx.x x) ((λy.y) z)",
              choices: [
                "((λy.y) z) ((λy.y) z)",
                "(λx.x x) z",
                "z z",
                "z"
              ],
              answer: 0,
              explanation: "Normal order fires the outermost redex: (λx.x x) applied to its argument. Substitute (λy.y) z for x in the body x x. Both x's become (λy.y) z. The argument wasn't evaluated before being copied in."
            },
            {
              prompt: "Normal order — one step:",
              expr: "(λx.λy.x) ((λz.z) a) b",
              choices: [
                "(λy.(λz.z) a) b",
                "(λx.λy.x) a b",
                "(λy.a) b",
                "a"
              ],
              answer: 0,
              explanation: "The outermost redex is (λx.λy.x) applied to its first argument (λz.z) a. Substitute (λz.z) a for x in λy.x. Result: λy.(λz.z) a, still applied to b. The argument (λz.z) a was not reduced first."
            },
            {
              prompt: "Normal order — one step:",
              expr: "(λf.f z) (λx.x)",
              choices: [
                "(λx.x) z",
                "z",
                "λx.x",
                "f z"
              ],
              answer: 0,
              explanation: "Only one redex exists, so both strategies agree here. Substitute (λx.x) for f in f z. Result: (λx.x) z."
            },
          ]
        },

        // ── Concept: Applicative Order ────────────────────────────────────────
        {
          type: "concept",
          id: "l01-applicative-order",
          title: "Applicative Order",
          content: `
            <p><strong>Applicative order</strong> always reduces the <strong>innermost, leftmost</strong> redex first.</p>
            <p>In plain terms: <em>fully evaluate every argument before applying a function to it.</em></p>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">applicative order: fire inner — evaluate the argument first</span></div>
              <div class="step step-reduce"><code>(λx.x) z</code><span class="step-note">(λy.y) z reduces to z</span></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <p>Applicative order evaluates <code>(λy.y) z</code> down to <code>z</code>
            before handing anything to <code>λx.x</code>.
            Functions always receive fully-reduced values.</p>
            <p>This is the strategy most programming languages use — Python, JavaScript,
            and C all evaluate arguments before calling a function. It's intuitive. But
            as you're about to see, it has a cost.</p>
          `
        },

        // ── Exercise: Applicative Order ───────────────────────────────────────
        {
          type: "exercise",
          id: "l01-ex-applicative",
          title: "Quick Check: Applicative Order",
          instruction: "What does applicative order produce after exactly one step?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Applicative order — one step:",
              expr: "(λx.x x) ((λy.y) z)",
              choices: [
                "(λx.x x) z",
                "((λy.y) z) ((λy.y) z)",
                "z z",
                "z"
              ],
              answer: 0,
              explanation: "Applicative order fires the innermost redex first: (λy.y) z, which is inside the argument. Result: (λx.x x) z. The outer function application has not fired yet."
            },
            {
              prompt: "Applicative order — one step:",
              expr: "(λx.λy.x) ((λz.z) a) b",
              choices: [
                "(λx.λy.x) a b",
                "(λy.(λz.z) a) b",
                "(λy.a) b",
                "a"
              ],
              answer: 0,
              explanation: "The innermost redex is (λz.z) a — the argument. Applicative order fires it first. (λz.z) a → a. Result: (λx.λy.x) a b. The outer application has not fired yet."
            },
            {
              prompt: "Applicative order — one step:",
              expr: "(λf.f z) (λx.x)",
              choices: [
                "(λx.x) z",
                "z",
                "λx.x",
                "f z"
              ],
              answer: 0,
              explanation: "(λx.x) is already a value — an abstraction with no redex inside. There's nothing to evaluate in the argument. Only one redex exists, so both strategies produce the same first step."
            },
          ]
        },

        // ── Concept: When They Diverge ────────────────────────────────────────
        {
          type: "concept",
          id: "l01-diverge",
          title: "When Strategies Diverge",
          content: `
            <p>The two strategies agree when every argument terminates.
            They part ways when an argument loops forever.</p>
            <p>Recall Ω from <em>Foundations</em>:</p>
            <div class="syntax-box"><code>Ω = (λx.x x)(λx.x x)</code></div>
            <p>Ω reduces to itself and never stops. Now apply a function that <em>ignores</em>
            its argument to Ω:</p>
            <div class="syntax-box"><code>(λx.λy.x) z Ω</code></div>
            <p>Written with explicit parentheses: <code>((λx.λy.x) z) Ω</code>.</p>
            <p><strong>Normal order</strong> — outermost first:</p>
            <div class="step-trace">
              <div class="step"><code>((λx.λy.x) z) Ω</code><span class="step-note">fire outer: apply (λx.λy.x) to z</span></div>
              <div class="step step-reduce"><code>(λy.z) Ω</code><span class="step-note">substitute z for x in λy.x</span></div>
              <div class="step step-reduce"><code>z</code><span class="step-note">apply (λy.z) to Ω — y absent, Ω is discarded</span></div>
            </div>
            <p><strong>Applicative order</strong> — arguments first:</p>
            <div class="step-trace">
              <div class="step"><code>((λx.λy.x) z) Ω</code><span class="step-note">must evaluate Ω before applying (λy.z) to it</span></div>
              <div class="step step-reduce"><code>((λx.λy.x) z) Ω</code><span class="step-note">Ω → Ω — same expression, try again</span></div>
              <div class="step step-reduce"><code>((λx.λy.x) z) Ω</code><span class="step-note">loops forever — never reaches z</span></div>
            </div>
            <p>Normal order delivers <code>z</code> in two steps.
            Applicative order loops forever, evaluating an argument the function will never use.</p>
          `
        },

        // ── Exercise: Termination ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "l01-ex-termination",
          title: "Quick Check: Termination",
          instruction: "Which strategy terminates? (Ω = (λx.x x)(λx.x x))",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which strategy terminates on:",
              expr: "(λx.z) Ω",
              choices: ["Normal order only", "Applicative order only", "Both", "Neither"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal order fires (λx.z) Ω immediately. x doesn't appear in z, so Ω is discarded. Result: z. Applicative order tries to reduce Ω first — and loops forever."
            },
            {
              prompt: "Which strategy terminates on:",
              expr: "(λx.x) z",
              choices: ["Both", "Normal order only", "Applicative order only", "Neither"],
              choicesAreCode: false,
              answer: 0,
              explanation: "z is already a value — no redex inside the argument. Both strategies fire the only available redex: (λx.x) z → z."
            },
            {
              prompt: "Which strategy terminates on:",
              expr: "(λx.x) Ω",
              choices: ["Neither", "Normal order only", "Applicative order only", "Both"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal order fires (λx.x) Ω → Ω. But Ω has no normal form, so now we're stuck with Ω. Applicative order also tries to reduce Ω first. Both loop forever."
            },
            {
              prompt: "Which strategy terminates on:",
              expr: "(λx.λy.y) Ω z",
              choices: ["Normal order only", "Applicative order only", "Both", "Neither"],
              choicesAreCode: false,
              answer: 0,
              explanation: "This is ((λx.λy.y) Ω) z. Normal order fires (λx.λy.y) Ω first → λy.y, then (λy.y) z → z. Ω was discarded unused. Applicative order tries to evaluate Ω first — loops forever."
            },
          ]
        },

        // ── Concept: The Guarantee ────────────────────────────────────────────
        {
          type: "concept",
          id: "l01-guarantee",
          title: "The Guarantee",
          content: `
            <p>Normal order has a property that applicative order lacks:</p>
            <div class="callout-note">
              If an expression has a normal form, normal order will find it.
            </div>
            <p>This is a consequence of the <strong>Church-Rosser theorem</strong> from
            <em>Foundations</em>: all terminating reduction paths lead to the same result.
            Normal order is guaranteed to be one of those paths — it never gets stuck
            evaluating something the function won't need.</p>
            <p>Applicative order makes no such promise. It can loop forever on expressions
            that do have normal forms, simply because it insists on evaluating an argument
            before the function has a chance to discard it.</p>
            <p>In the real world these strategies have names: normal order is
            <strong>lazy evaluation</strong>, applicative order is <strong>eager evaluation</strong>.
            Most languages are eager — Python, JavaScript, C. Haskell is the most prominent
            lazy language. But lazy languages don't actually reduce expressions all the
            way to normal form. They stop somewhere short of that — at a concept called
            Weak Head Normal Form, which is where the next lesson begins.</p>
            <div class="grammar-rule">
              <span class="g-label">Summary</span>
              <strong>Normal order</strong> = <strong>lazy evaluation</strong>: outermost redex first.
              Guaranteed to find a normal form if one exists.<br>
              <strong>Applicative order</strong> = <strong>eager evaluation</strong>: innermost redex first.
              Used by most real languages. Can loop where normal order terminates.
            </div>
          `
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l01-ex-review",
          title: "Review: Normal Order vs. Applicative Order",
          instruction: "A mix of questions from this lesson. Ω = (λx.x x)(λx.x x)",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Normal order reduces which redex first?",
              expr: "(λx.x) ((λy.y) z)",
              choices: [
                "The outer: (λx.x) ((λy.y) z)",
                "The inner: (λy.y) z"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal order is outermost first. The outer application (λx.x) ((λy.y) z) is not inside any other redex's argument, so it goes first."
            },
            {
              prompt: "Applicative order reduces which redex first?",
              expr: "(λx.x) ((λy.y) z)",
              choices: [
                "The inner: (λy.y) z",
                "The outer: (λx.x) ((λy.y) z)"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Applicative order is innermost first — evaluate the argument before the application. (λy.y) z is the innermost redex."
            },
            {
              prompt: "Normal order — one step:",
              expr: "(λx.x) Ω",
              choices: ["Ω", "(λx.x)(λx.x x)", "normal form", "(λx.x) Ω"],
              answer: 0,
              explanation: "Normal order fires the outermost redex: (λx.x) Ω → Ω. The identity function returns its argument unchanged. We now have Ω, which loops — but normal order did reach this step."
            },
            {
              prompt: "Which property does normal order have that applicative order lacks?",
              choices: [
                "If a normal form exists, it will find it",
                "It always terminates in fewer steps",
                "It never evaluates the same argument twice",
                "It evaluates left to right before right to left"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal order is guaranteed to reach a normal form if one exists — a consequence of Church-Rosser. Applicative order can loop on expressions like (λx.z) Ω that do have normal forms."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 2 — Weak Head Normal Form
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-02",
      title: "Lesson 2: Weak Head Normal Form",
      description: "How far lazy languages actually reduce — and why they stop there",
      completionText: "You now know how lazy languages actually evaluate: reduce to WHNF, not normal form, using thunks and sharing to avoid redundant work. Everything up to this point has been about how lambda calculus runs. The next lessons are about how it's structured — starting with a different way to encode data that makes pattern matching fall out naturally.",
      blocks: [

        // ── Concept: Stopping Short ───────────────────────────────────────────
        {
          type: "concept",
          id: "l02-stopping-short",
          title: "Stopping Short",
          content: `
            <p>You now know that lazy evaluation follows normal order — it applies functions
            before reducing arguments, and never evaluates an argument the function won't use.
            But there's a question that hasn't been asked: when does evaluation actually stop?</p>
            <p>The obvious answer would be normal form — no redexes anywhere.
            But consider this expression:</p>
            <div class="syntax-box"><code>λx.(λy.y) x</code></div>
            <p>It's a lambda. Inside the body there's a redex: <code>(λy.y) x</code> reduces to <code>x</code>.
            Should a lazy evaluator fire it?</p>
            <p>Not until someone calls this function. If it's never called, that work is wasted.
            If it <em>is</em> called with argument <code>z</code>, the body becomes
            <code>(λy.y) z → z</code> — the inner redex never appears in the result at all.</p>
            <p>Lazy languages reduce just far enough to know the <em>shape</em> of a value —
            whether it's a function, a constructor, a variable — but not what's inside.
            That stopping point has a name: <strong>Weak Head Normal Form</strong>.</p>
          `
        },

        // ── Concept: What Is WHNF? ────────────────────────────────────────────
        {
          type: "concept",
          id: "l02-whnf-def",
          title: "Weak Head Normal Form",
          content: `
            <p>An expression is in <strong>Weak Head Normal Form</strong> (WHNF) if the
            outermost position is not a redex.</p>
            <p>Two things can occupy the outermost position of a WHNF expression:</p>
            <ul class="parts-list">
              <li>A <strong>lambda abstraction</strong>: <code>λx.M</code> — whatever M looks like inside, this is a function</li>
              <li>A <strong>variable applied to arguments</strong>: <code>x</code>, <code>x M</code>, <code>x M N</code> — a neutral term</li>
            </ul>
            <p>If the outermost position is <code>(λx.M) N</code> — a lambda applied to an argument — that's a redex, and the expression is <em>not</em> in WHNF.</p>
            <div class="ex-table">
              <div class="ex-row"><code>λx.x</code><span>WHNF — it's a lambda</span></div>
              <div class="ex-row"><code>λx.(λy.y) x</code><span>WHNF — it's a lambda; the inner redex doesn't matter</span></div>
              <div class="ex-row"><code>f x y</code><span>WHNF — f is a free variable, not a redex</span></div>
              <div class="ex-row"><code>x ((λy.y) z)</code><span>WHNF — outermost is variable application</span></div>
              <div class="ex-row"><code>(λx.x) y</code><span>not WHNF — top-level redex</span></div>
              <div class="ex-row"><code>(λx.x x)(λy.y)</code><span>not WHNF — top-level redex</span></div>
            </div>
            <div class="callout-note">
              WHNF only cares about the outermost position.
              Inner redexes are irrelevant.
            </div>
          `
        },

        // ── Exercise: Is This WHNF? ───────────────────────────────────────────
        {
          type: "exercise",
          id: "l02-ex-whnf",
          title: "Quick Check: Is This WHNF?",
          instruction: "Is the expression in Weak Head Normal Form?",
          kind: "valid-or-invalid",
          items: [
            {
              expr: "λx.λy.x",
              answer: "valid",
              explanation: "WHNF. The outermost position is a lambda abstraction. What's inside doesn't matter."
            },
            {
              expr: "(λx.x) z",
              answer: "invalid",
              explanation: "Not WHNF. The outermost position is (λx.x) applied to z — a redex. It needs one more step to reach z."
            },
            {
              expr: "λf.(λx.x) f",
              answer: "valid",
              explanation: "WHNF. The outermost position is a lambda. The inner redex (λx.x) f is inside the body and doesn't disqualify it."
            },
            {
              expr: "g (λx.x) y",
              answer: "valid",
              explanation: "WHNF. g is a free variable. The outermost form is a variable applied to arguments — not a redex."
            },
            {
              expr: "(λx.λy.x) a b",
              answer: "invalid",
              explanation: "Not WHNF. The outermost position is (λx.λy.x) applied to a — a redex. Left-associativity makes this ((λx.λy.x) a) b, and (λx.λy.x) a is the top-level redex."
            },
          ]
        },

        // ── Concept: Thunks and Call-by-Need ─────────────────────────────────
        {
          type: "concept",
          id: "l02-thunks",
          title: "Thunks and Call-by-Need",
          content: `
            <p>A <strong>thunk</strong> is a suspended computation — an expression that hasn't
            been reduced to WHNF yet, stored and waiting. In a lazy language, arguments
            start their lives as thunks.</p>
            <p>When a thunk is <strong>demanded</strong> — when code needs to know what it
            actually is — the runtime reduces it to WHNF. The result then replaces the thunk
            in memory. Every subsequent reference gets the cached WHNF directly.</p>
            <p>This is <strong>call-by-need</strong>: lazy (reduce only when demanded) plus
            sharing (reduce at most once). It's what Haskell implements.</p>
            <p>Compare the two lazy strategies on an argument used twice:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.x x) ((λy.y) z)</code><span class="step-note">call-by-name: copy the thunk, reduce it twice</span></div>
              <div class="step step-reduce"><code>((λy.y) z) ((λy.y) z)</code></div>
              <div class="step step-reduce"><code>z ((λy.y) z)</code><span class="step-note">first copy reduced</span></div>
              <div class="step step-reduce"><code>z z</code><span class="step-note">second copy reduced separately — two reductions</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>(λx.x x) ((λy.y) z)</code><span class="step-note">call-by-need: share the thunk, reduce it once</span></div>
              <div class="step step-reduce"><code>z z</code><span class="step-note">thunk (λy.y) z → z, result shared for both x's — one reduction</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Summary</span>
              Call-by-name: lazy, but may re-evaluate the same argument multiple times.<br>
              Call-by-need: lazy + sharing — each argument reduced to WHNF at most once.
            </div>
          `
        },

        // ── Exercise: Thunks ──────────────────────────────────────────────────
        {
          type: "exercise",
          id: "l02-ex-thunks",
          title: "Quick Check: Thunks and Sharing",
          instruction: "How many times is the argument reduced under each strategy?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Call-by-name: how many times is the argument reduced?",
              expr: "(λx.x x x) e",
              choices: ["3 times", "1 time", "0 times", "Depends on e"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Call-by-name copies the unevaluated argument into the body for each occurrence of x. Three occurrences means three separate reductions of e."
            },
            {
              prompt: "Call-by-need: how many times is the argument reduced?",
              expr: "(λx.x x x) e",
              choices: ["1 time", "3 times", "0 times", "Depends on e"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Call-by-need evaluates e to WHNF the first time any x is demanded, then shares that result with the remaining two uses. One reduction total."
            },
            {
              prompt: "Call-by-need: how many times is the argument reduced?",
              expr: "(λx.z) e",
              choices: ["0 times", "1 time", "3 times", "Depends on e"],
              choicesAreCode: false,
              answer: 0,
              explanation: "x doesn't appear in the body z, so e is never demanded. Under call-by-need, an argument that's never needed is never reduced — the thunk is discarded."
            },
          ]
        },

        // ── Concept: Infinite Structures ──────────────────────────────────────
        {
          type: "concept",
          id: "l02-infinite",
          title: "What WHNF Makes Possible",
          content: `
            <p>WHNF is what makes infinite data structures work in lazy languages.</p>
            <p>In Haskell, you can define the infinite list of all ones:</p>
            <div class="syntax-box"><code>ones = 1 : ones</code></div>
            <p>In lambda calculus, using the CONS encoding from <em>Foundations</em>:</p>
            <div class="syntax-box"><code>ONES = λf. f 1 (λ_. ONES)</code></div>
            <p>This expression is already in WHNF — it's a lambda. The tail
            <code>λ_. ONES</code> is a thunk. Nothing forces it until something
            asks for the next element.</p>
            <p>If you demand the head, you get <code>1</code> immediately.
            If you demand the tail, the thunk is forced — returning another WHNF
            expression with the same shape. The list unfolds one element at a time,
            only as far as needed.</p>
            <p>Under eager evaluation, constructing <code>ONES</code> would immediately
            force the tail, which forces the next tail, which forces the next — never
            terminating. WHNF is the reason "infinite" data structures can be finite
            in practice: you define the shape, and laziness decides how much to
            actually build.</p>
          `
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l02-ex-review",
          title: "Review: Weak Head Normal Form",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Is this expression in WHNF?",
              expr: "λx.(λy.y y) x",
              choices: ["Yes — it's a lambda", "No — there's a redex inside"],
              choicesAreCode: false,
              answer: 0,
              explanation: "WHNF only checks the outermost position. The outermost form is a lambda abstraction, so it's in WHNF — regardless of what's inside the body."
            },
            {
              prompt: "Is this expression in WHNF?",
              expr: "(λx.λy.y) z",
              choices: ["No — it's a top-level redex", "Yes — it starts with λ"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Not WHNF. The outermost position is (λx.λy.y) applied to z — a redex. One step gives λy.y, which is in WHNF."
            },
            {
              prompt: "What is a thunk?",
              choices: [
                "A suspended expression waiting to be reduced to WHNF",
                "An expression already in normal form",
                "A lambda with no free variables",
                "An expression that loops forever"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A thunk is a deferred computation. In a lazy language, arguments start as thunks and are only reduced to WHNF when their value is demanded."
            },
            {
              prompt: "What does call-by-need add to call-by-name?",
              choices: ["Sharing — each thunk is evaluated at most once", "Strictness — arguments are evaluated immediately", "Infinite structures — lists can be unbounded", "Normal form — expressions are always fully reduced"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Call-by-need is call-by-name plus sharing. Once a thunk is forced to WHNF, the result is cached — so the same argument is never evaluated twice. This is what Haskell implements."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 3 — Scott Encodings
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-03",
      title: "Lesson 3: Scott Encodings",
      description: "A different way to encode data — one where pattern matching is trivial",
      completionText: "Church encodes what you can build; Scott encodes what you can take apart. You've seen how dramatically that changes something as simple as PRED. The next lesson applies both encodings to binary trees — a type with real recursive structure on both sides — where the tradeoff becomes even clearer.",
      blocks: [

        // ── Concept: A Different Perspective ─────────────────────────────────
        {
          type: "concept",
          id: "l03-perspective",
          title: "A Different Perspective",
          content: `
            <p>The Church encodings from <em>Foundations</em> represent a value as what you can
            <em>do</em> with it. A Church numeral <code>n</code> is a function: give it
            <code>f</code> and <code>x</code>, and it applies <code>f</code> to <code>x</code>
            exactly <code>n</code> times.</p>
            <div class="syntax-box"><code>2 = λf.λx. f (f x)</code></div>
            <p>This works beautifully for iteration — ADD, MULT, and SUCC fall out cleanly.
            But it makes <em>decomposition</em> hard. To ask "what is the predecessor of n?"
            required the elaborate sliding-window trick from Lesson 8 of <em>Foundations</em>.</p>
            <p>There is another design: encode a value as the function that <em>takes it apart</em>.
            Instead of "here is what you can build with me," a value says "here are my cases —
            pick one."</p>
            <p>This is the idea behind <strong>Scott encodings</strong>.</p>
          `
        },

        // ── Concept: Scott Booleans ───────────────────────────────────────────
        {
          type: "concept",
          id: "l03-scott-bools",
          title: "Scott Booleans",
          content: `
            <p>A boolean has two cases: true and false, each carrying no data.
            Under Scott encoding, a boolean takes one branch for each case and
            returns the matching one:</p>
            <div class="ex-table">
              <div class="ex-row"><code>TRUE  = λt.λf.t</code><span>the true case: return the true branch</span></div>
              <div class="ex-row"><code>FALSE = λt.λf.f</code><span>the false case: return the false branch</span></div>
            </div>
            <p>These are identical to Church booleans — and that's not a coincidence.
            For a type with no data inside its cases, "what you can do with a value"
            and "how you take it apart" collapse into the same thing: pick a branch.</p>
            <p>The two approaches only diverge when a case <em>carries data</em>.
            Numbers carry a predecessor. Trees carry subtrees. That's where the
            difference becomes dramatic.</p>
          `
        },

        // ── Concept: Scott Naturals ───────────────────────────────────────────
        {
          type: "concept",
          id: "l03-scott-nats",
          title: "Scott Naturals",
          content: `
            <p>A natural number is either zero, or it is the successor of some other
            natural. Under Scott encoding, a natural takes two arguments: one for
            the zero case, one for the successor case.</p>
            <div class="ex-table">
              <div class="ex-row"><code>ZERO = λz.λs.z</code><span>"I'm zero: return the zero value, ignore the rest"</span></div>
              <div class="ex-row"><code>SUCC = λn.λz.λs.s n</code><span>"I'm a successor: call the successor handler with my predecessor"</span></div>
            </div>
            <p>Writing out the first few:</p>
            <div class="ex-table">
              <div class="ex-row"><code>0 = λz.λs.z</code><span>Church: <code>λf.λx.x</code></span></div>
              <div class="ex-row"><code>1 = λz.λs.s (λz.λs.z)</code><span>Church: <code>λf.λx.f x</code></span></div>
              <div class="ex-row"><code>2 = λz.λs.s (λz.λs.s (λz.λs.z))</code><span>Church: <code>λf.λx.f (f x)</code></span></div>
            </div>
            <p>Notice what Scott 1 contains: the entire encoding of 0.
            Scott 2 contains the entire encoding of 1, which contains 0.
            The predecessor is <em>literally embedded</em> in the structure —
            not computed, just retrieved.</p>
          `
        },

        // ── Exercise: Reading Scott Numerals ──────────────────────────────────
        {
          type: "exercise",
          id: "l03-ex-read",
          title: "Quick Check: Reading Scott Numerals",
          instruction: "What value does each Scott numeral represent?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What number is this?",
              expr: "λz.λs.z",
              choices: ["0", "1", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "This is ZERO. It takes z and s and returns z — the zero case. Applying it to any two arguments always picks the first."
            },
            {
              prompt: "What number is this?",
              expr: "λz.λs.s (λz.λs.z)",
              choices: ["1", "0", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "This is ONE. It takes z and s and calls s with the encoding of 0. The successor handler receives the predecessor — which here is ZERO."
            },
            {
              prompt: "Apply this Scott numeral to the zero-case value a and successor handler b. What is the result?",
              expr: "(λz.λs.z) a b",
              choices: ["a", "b", "b a", "a b"],
              answer: 0,
              explanation: "This is ZERO applied to a and b. ZERO = λz.λs.z — it ignores s and returns z. Result: a."
            },
            {
              prompt: "Apply this Scott numeral to zero-case a and successor handler b. What is the result?",
              expr: "(λz.λs.s (λz.λs.z)) a b",
              choices: ["b (λz.λs.z)", "a", "b", "λz.λs.z"],
              answer: 0,
              explanation: "This is ONE applied to a and b. ONE = λz.λs.s (λz.λs.z) — it ignores z and calls s with the predecessor ZERO. Result: b (λz.λs.z), i.e., the successor handler called with 0."
            },
          ]
        },

        // ── Concept: Pattern Matching Falls Out ───────────────────────────────
        {
          type: "concept",
          id: "l03-pattern-match",
          title: "Pattern Matching Falls Out",
          content: `
            <p>With Scott naturals, ISZERO and PRED become trivial. Compare:</p>
            <p><strong>ISZERO</strong></p>
            <div class="ex-table">
              <div class="ex-row"><code>Church:  λn. n (λx.FALSE) TRUE</code><span>apply a false-returning function n times to TRUE</span></div>
              <div class="ex-row"><code>Scott:   λn. n TRUE (λp.FALSE)</code><span>zero case → TRUE; successor case → FALSE</span></div>
            </div>
            <p>The Scott version reads as a direct case analysis: "if zero, TRUE; if successor, FALSE (ignoring the predecessor p)."</p>
            <p><strong>PRED</strong></p>
            <div class="ex-table">
              <div class="ex-row"><code>Church:  λn. FST (n SHIFT (PAIR 0 0))</code><span>sliding-window accumulator across all n steps</span></div>
              <div class="ex-row"><code>Scott:   λn. n ZERO (λp.p)</code><span>zero case → ZERO; successor case → return the predecessor directly</span></div>
            </div>
            <p>Church PRED must <em>reconstruct</em> the predecessor by iterating from zero,
            because Church numerals only know how to iterate — they don't store their predecessor.
            Scott PRED just <em>extracts</em> it — the predecessor is right there, embedded
            in the encoding.</p>
            <div class="callout-note">
              Scott PRED: "zero case returns zero; successor case gives you the predecessor directly."
            </div>
          `
        },

        // ── Exercise: Using Scott Encodings ───────────────────────────────────
        {
          type: "exercise",
          id: "l03-ex-apply",
          title: "Quick Check: Applying Scott Functions",
          instruction: "Reduce each expression. Use: ZERO = λz.λs.z, ONE = λz.λs.s ZERO, ISZERO = λn.n TRUE (λp.FALSE), PRED = λn.n ZERO (λp.p)",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce to normal form:",
              expr: "ISZERO ZERO",
              choices: ["TRUE", "FALSE", "ZERO", "(λp.FALSE) ZERO"],
              answer: 0,
              explanation: "ISZERO ZERO = ZERO TRUE (λp.FALSE) = (λz.λs.z) TRUE (λp.FALSE) = TRUE. ZERO picks its first argument."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "ISZERO ONE",
              choices: ["FALSE", "TRUE", "ZERO", "(λp.FALSE) ONE"],
              answer: 0,
              explanation: "ISZERO ONE = ONE TRUE (λp.FALSE) = (λz.λs.s ZERO) TRUE (λp.FALSE) = (λp.FALSE) ZERO = FALSE. ONE picks its second argument (the successor handler) and applies it to the predecessor."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "PRED ONE",
              choices: ["ZERO", "ONE", "FALSE", "TRUE"],
              answer: 0,
              explanation: "PRED ONE = ONE ZERO (λp.p) = (λz.λs.s ZERO) ZERO (λp.p) = (λp.p) ZERO = ZERO. The successor handler λp.p is the identity — it returns the predecessor directly."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "PRED ZERO",
              choices: ["ZERO", "ONE", "TRUE", "FALSE"],
              answer: 0,
              explanation: "PRED ZERO = ZERO ZERO (λp.p) = (λz.λs.z) ZERO (λp.p) = ZERO. ZERO picks its first argument — by convention, the predecessor of zero is zero."
            },
          ]
        },

        // ── Concept: Arithmetic and the Limits of Scott ──────────────────────
        {
          type: "concept",
          id: "l03-arithmetic",
          title: "Arithmetic and the Limits of Scott",
          content: `
            <p>PRED and ISZERO required no cleverness because they are pure
            <em>extraction</em> — the predecessor is already embedded in the encoding.
            But arithmetic is different. To double a number you don't extract anything;
            you need to recurse all the way to zero and build back up.</p>
            <p>Scott numerals are case analysis, not iteration. So arithmetic needs the
            Y combinator — the self-application trick from <em>Foundations</em> Lesson 10.</p>
            <p>Start with doubling, the simplest recursive case:</p>
            <div class="syntax-box"><code>-- schematic (self-reference via Y, as in Foundations)
DOUBLE = λn. n ZERO (λp. SUCC (SUCC (DOUBLE p)))</code></div>
            <p>Read it: "if n is zero, return zero; if n is SUCC p, double the predecessor
            and add 2." Trace <code>DOUBLE ONE</code>:</p>
            <div class="step-trace">
              <div class="step"><code>DOUBLE ONE</code></div>
              <div class="step step-reduce"><code>ONE ZERO (λp. SUCC(SUCC(DOUBLE p)))</code><span class="step-note">ONE is a Scott nat — case-analyse it</span></div>
              <div class="step step-reduce"><code>(λp. SUCC(SUCC(DOUBLE p))) ZERO</code><span class="step-note">ONE picks the succ handler, passes its predecessor ZERO</span></div>
              <div class="step step-reduce"><code>SUCC(SUCC(DOUBLE ZERO))</code><span class="step-note">substitute ZERO for p</span></div>
              <div class="step step-reduce"><code>SUCC(SUCC ZERO)</code><span class="step-note">DOUBLE ZERO picks the zero case → ZERO</span></div>
            </div>
            <p>Result: TWO ✓. The shape is: hit the base case, unwind with SUCC SUCC on
            the way back out.</p>
            <p>Addition follows the same pattern. To add m and n:
            if m is zero the answer is n; if m is SUCC p, the answer is SUCC(ADD p n) —
            recurse on the predecessor of m, counting down until it reaches zero.</p>
            <div class="syntax-box"><code>ADD = λm.λn. m n (λp. SUCC (ADD p n))</code></div>
            <p>Now compare directly to Church ADD:</p>
            <div class="ex-table">
              <div class="ex-row"><code>Church ADD = λm.λn.λf.λx. m f (n f x)</code><span>m is already a fold — thread n's fold through it; no Y needed</span></div>
              <div class="ex-row"><code>Scott ADD  = Y(λadd.λm.λn. m n (λp. SUCC (add p n)))</code><span>m is case analysis — recurse on the predecessor step by step</span></div>
            </div>
            <p>Church numerals <em>are</em> iteration by construction. Scott numerals
            <em>are</em> case analysis by construction. The claim that "Church wins for
            iteration" is not an opinion — it's structural. Church ADD uses the fold
            that Church numerals already provide. Scott ADD has to invent its own fold
            with Y because Scott numerals don't come with one.</p>
          `
        },

        // ── Exercise: Arithmetic with Scott Numerals ──────────────────────────
        {
          type: "exercise",
          id: "l03-ex-arithmetic",
          title: "Quick Check: Scott Arithmetic",
          instruction: "DOUBLE = λn. n ZERO (λp. SUCC(SUCC(DOUBLE p)))  ·  ADD = λm.λn. m n (λp. SUCC(ADD p n))",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce to normal form:",
              expr: "DOUBLE ZERO",
              choices: ["ZERO", "ONE", "SUCC ZERO", "TWO"],
              answer: 0,
              explanation: "DOUBLE ZERO = ZERO ZERO (λp.SUCC(SUCC(DOUBLE p))) = ZERO. ZERO picks its first argument — the zero case — and returns it directly."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "DOUBLE TWO",
              choices: ["SUCC(SUCC(SUCC(SUCC ZERO)))", "SUCC(SUCC ZERO)", "SUCC(SUCC(SUCC ZERO))", "TWO"],
              answer: 0,
              explanation: "DOUBLE TWO recurses: DOUBLE TWO → SUCC(SUCC(DOUBLE ONE)) → SUCC(SUCC(SUCC(SUCC(DOUBLE ZERO)))) → SUCC(SUCC(SUCC(SUCC ZERO))). That's FOUR."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "ADD ZERO TWO",
              choices: ["TWO", "ZERO", "ONE", "SUCC TWO"],
              answer: 0,
              explanation: "ADD ZERO TWO = ZERO TWO (λp.SUCC(ADD p TWO)) = TWO. ZERO picks its first argument — the zero case — which is n = TWO. Base case: 0 + n = n."
            },
            {
              prompt: "Why does Church ADD need no Y combinator while Scott ADD does?",
              choices: [
                "A Church numeral is itself a fold — ADD just threads one fold through another. A Scott numeral is case analysis — ADD must invent its own iteration with Y.",
                "Church ADD uses pairs internally to avoid recursion.",
                "Scott numerals are larger, so they require more steps.",
                "Y is only needed when the result is a boolean."
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Church n = λf.λx.f(f(...(f x)...)) — it already encodes 'apply f n times.' ADD just uses that built-in iteration: m f (n f x) applies f m+n times total. Scott n just says 'I am zero' or 'my predecessor is p' — no iteration is built in, so ADD must recurse with Y."
            },
          ]
        },

        // ── Concept: Church vs. Scott ─────────────────────────────────────────
        {
          type: "concept",
          id: "l03-tradeoffs",
          title: "Church vs. Scott",
          content: `
            <p>Neither encoding is strictly better. You've now seen both sides concretely:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Church wins</strong><span>iteration — SUCC, ADD, MULT are one-liners because a Church numeral <em>is</em> a fold</span></div>
              <div class="ex-row"><strong>Scott wins</strong><span>decomposition — PRED, ISZERO are one-liners because a Scott numeral <em>is</em> a case analysis</span></div>
              <div class="ex-row"><strong>Church loses</strong><span>PRED requires the elaborate sliding-window trick — the predecessor must be reconstructed from scratch</span></div>
              <div class="ex-row"><strong>Scott loses</strong><span>ADD requires Y — no fold is built in, so iteration must be invented with the Y combinator</span></div>
            </div>
            <p>In practice, Scott encodings correspond directly to how algebraic data types
            work in typed languages like Haskell and ML — each constructor becomes a case in
            the encoding, and the type checker enforces that all cases are handled.</p>
            <div class="callout-note">
              Church = fold. Scott = case analysis.<br>
              Pick the encoding whose natural operation matches what you need.
            </div>
          `
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l03-ex-review",
          title: "Review: Scott Encodings",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Why are Church and Scott booleans identical?",
              choices: [
                "Neither case carries data, so fold and case-analysis collapse into the same thing",
                "Both encodings were designed to agree on booleans",
                "Booleans are the simplest Church encoding",
                "Scott encodings only differ from Church for recursive types"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "When a type's cases carry no data, there's nothing to reconstruct (Church fold) or extract (Scott case analysis). Both just pick a branch — so the encodings are the same."
            },
            {
              prompt: "What does applying a Scott numeral to two arguments do?",
              choices: [
                "Returns the first if zero, calls the second with the predecessor if successor",
                "Applies the first argument that many times to the second",
                "Returns the successor of the numeral",
                "Checks whether the numeral is zero"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A Scott natural n takes a zero-case value z and a successor handler s. If n is zero, it returns z. If n is succ(m), it returns s m — the handler called with the predecessor."
            },
            {
              prompt: "Why is Scott PRED simpler than Church PRED?",
              choices: [
                "The predecessor is embedded in the Scott encoding and just needs to be extracted",
                "Scott numerals iterate in reverse",
                "Church numerals don't support PRED",
                "Scott encodings use pairs internally"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A Scott numeral for n+1 is λz.λs.s n — n is literally right there. PRED just extracts it with the identity function. Church numerals only know how to iterate, so PRED must reconstruct the predecessor step by step."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "PRED (SUCC ZERO)",
              choices: ["ZERO", "SUCC ZERO", "TRUE", "FALSE"],
              answer: 0,
              explanation: "SUCC ZERO = λz.λs.s ZERO = ONE. PRED ONE = ONE ZERO (λp.p) = (λp.p) ZERO = ZERO. The predecessor of 1 is 0."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 4 — Trees
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-04",
      title: "Lesson 4: Trees",
      description: "Church and Scott encodings applied to a recursive type with two sub-pieces",
      completionText: "You've seen the encoding pattern across booleans, naturals, and trees — and how lambda terms themselves follow the same three-constructor tree structure. With the structural side covered, the course shifts to how computation is controlled. The next lesson introduces continuation-passing style.",
      blocks: [

        // ── Concept: The Binary Tree ──────────────────────────────────────────
        {
          type: "concept",
          id: "l04-intro",
          title: "The Binary Tree",
          content: `
            <p>A binary tree is either a <strong>leaf</strong> — empty, no data — or a
            <strong>node</strong> carrying a value and two subtrees: a left child and a
            right child.</p>
            <div class="ex-table">
              <div class="ex-row"><code>LEAF</code><span>the empty tree</span></div>
              <div class="ex-row"><code>NODE v l r</code><span>value v, left subtree l, right subtree r</span></div>
            </div>
            <p>A small tree written in this notation:</p>
            <div class="syntax-box"><code>NODE a (NODE b LEAF LEAF) LEAF</code></div>
            <p>Read it: a root node with value <code>a</code>, whose left child is a node
            with value <code>b</code> and two empty children, and whose right child
            is a leaf.</p>
            <p>Trees are the first type we've encoded that has <em>two</em> recursive
            sub-pieces in one case. You'll see how that sharpens the Church vs. Scott
            tradeoff considerably.</p>
          `
        },

        // ── Concept: Church Trees ─────────────────────────────────────────────
        {
          type: "concept",
          id: "l04-church-trees",
          title: "Church Trees",
          content: `
            <p>Church encoding = fold. A Church tree takes two arguments:</p>
            <ul class="parts-list">
              <li><code>b</code> — the value to return for a leaf</li>
              <li><code>n</code> — a function to call at each node, receiving the node's value
              and the <em>already-folded</em> results from both subtrees</li>
            </ul>
            <div class="ex-table">
              <div class="ex-row"><code>LEAF  = λb.λn.b</code><span>return the base value; no subtrees to fold</span></div>
              <div class="ex-row"><code>NODE  = λv.λl.λr.λb.λn.n v (l b n) (r b n)</code><span>fold both subtrees, then call n with the results</span></div>
            </div>
            <p>The key detail is <code>(l b n)</code> and <code>(r b n)</code>: the left and
            right subtrees are folded <em>before</em> being passed to <code>n</code>.
            By the time <code>n</code> sees them, they're already results — not trees.</p>
            <p>This means the entire recursive traversal happens automatically.
            You only say what to do at a leaf and what to combine at a node.</p>
          `
        },

        // ── Concept: Scott Trees ──────────────────────────────────────────────
        {
          type: "concept",
          id: "l04-scott-trees",
          title: "Scott Trees",
          content: `
            <p>Scott encoding = case analysis. A Scott tree also takes <code>b</code> and
            <code>n</code>, but <code>n</code> receives the raw, unevaluated subtrees:</p>
            <div class="ex-table">
              <div class="ex-row"><code>LEAF   = λb.λn.b</code><span>identical to Church — no subtrees, so no difference</span></div>
              <div class="ex-row"><code>NODE_S = λv.λl.λr.λb.λn.n v l r</code><span>pass the raw subtrees directly — no pre-folding</span></div>
            </div>
            <p>The only difference from Church NODE is the last part:</p>
            <div class="ex-table">
              <div class="ex-row"><code>Church:  n v (l b n) (r b n)</code><span>subtrees pre-folded</span></div>
              <div class="ex-row"><code>Scott:   n v l r</code><span>subtrees passed as-is</span></div>
            </div>
            <p>In Scott encoding, <code>n</code> receives the actual subtrees — complete Church
            or Scott trees it can inspect or recurse into however it likes.
            In Church encoding, <code>n</code> only ever sees fold <em>results</em>,
            never the subtrees themselves.</p>
          `
        },

        // ── Exercise: Reading Tree Encodings ──────────────────────────────────
        {
          type: "exercise",
          id: "l04-ex-read",
          title: "Quick Check: Church vs. Scott Trees",
          instruction: "Questions about the structure of the two encodings.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which of these is the Church NODE?",
              choices: [
                "λv.λl.λr.λb.λn.n v (l b n) (r b n)",
                "λv.λl.λr.λb.λn.n v l r"
              ],
              answer: 0,
              explanation: "Church NODE pre-folds both subtrees: (l b n) folds the left, (r b n) folds the right, and then n receives the fold results. Scott NODE passes l and r directly."
            },
            {
              prompt: "In Church NODE, what does n receive for the subtrees?",
              choices: [
                "The already-folded results (l b n) and (r b n)",
                "The raw subtree encodings l and r",
                "The subtree values only",
                "Fresh copies of b and n"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Church NODE calls (l b n) and (r b n) before passing to n. These are the results of folding each subtree — not the trees themselves."
            },
            {
              prompt: "Apply this to zero-case a and node-case f. What is the result?",
              expr: "(λb.λn.b) a f",
              choices: ["a", "f", "f a", "b"],
              answer: 0,
              explanation: "This is LEAF applied to a and f. LEAF = λb.λn.b — it ignores the node function and returns the base value. Result: a."
            },
            {
              prompt: "LEAF is the same in both encodings. Why?",
              choices: [
                "A leaf has no subtrees, so there is nothing to fold or extract",
                "Both encodings start from the same base case by convention",
                "LEAF ignores both arguments, making the difference irrelevant",
                "Church and Scott always agree on base cases"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The Church/Scott difference is about what happens to subtrees. A leaf has no subtrees — nothing to pre-fold or pass raw. So both encodings produce the same LEAF: λb.λn.b."
            },
          ]
        },

        // ── Concept: Church Folds in Action ───────────────────────────────────
        {
          type: "concept",
          id: "l04-church-action",
          title: "Church Folds in Action",
          content: `
            <p>Because Church trees pre-fold their subtrees, recursive operations
            need no Y combinator. The traversal is already baked in.</p>
            <p><strong>ISLEAF</strong> — is this tree a leaf?</p>
            <div class="syntax-box"><code>ISLEAF = λt.t TRUE (λv.λls.λrs.FALSE)</code></div>
            <p>Leaf case: TRUE. Node case: FALSE (the pre-folded results ls and rs are irrelevant).</p>
            <p><strong>SIZE</strong> — how many nodes?</p>
            <div class="syntax-box"><code>SIZE = λt.t 0 (λv.λls.λrs.SUCC(ADD ls rs))</code></div>
            <p>Leaf case: 0. Node case: 1 + leftSize + rightSize. The fold handles the recursion; we only say what to do at each point.</p>
            <p><strong>MIRROR</strong> — flip left and right at every node:</p>
            <div class="syntax-box"><code>MIRROR = λt.t LEAF (λv.λlm.λrm.NODE v rm lm)</code></div>
            <p>Leaf case: LEAF. Node case: rebuild the node with the mirrored subtrees swapped.
            <code>lm</code> is the already-mirrored left, <code>rm</code> is the already-mirrored right —
            swapping them gives the mirror of the whole node.</p>
            <p>All three operations are single expressions with no recursion. The Church encoding
            does the walking; you supply what to do at each step.</p>
          `
        },

        // ── Exercise: Church Folds ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l04-ex-church",
          title: "Quick Check: Church Fold Results",
          instruction: "Use LEAF = λb.λn.b and NODE = λv.λl.λr.λb.λn.n v (l b n) (r b n).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "ISLEAF = λt.t TRUE (λv.λls.λrs.FALSE). Reduce:",
              expr: "ISLEAF LEAF",
              choices: ["TRUE", "FALSE", "LEAF", "λv.λls.λrs.FALSE"],
              answer: 0,
              explanation: "ISLEAF LEAF = LEAF TRUE (λv.λls.λrs.FALSE) = (λb.λn.b) TRUE (λv.λls.λrs.FALSE) = TRUE. LEAF ignores the node function and returns the base value."
            },
            {
              prompt: "ISLEAF = λt.t TRUE (λv.λls.λrs.FALSE). Reduce:",
              expr: "ISLEAF (NODE a LEAF LEAF)",
              choices: ["FALSE", "TRUE", "NODE a LEAF LEAF", "a"],
              answer: 0,
              explanation: "NODE a LEAF LEAF TRUE (λv.λls.λrs.FALSE) = (λv.λls.λrs.FALSE) a (LEAF TRUE ...) (LEAF TRUE ...) = (λv.λls.λrs.FALSE) a TRUE TRUE = FALSE."
            },
            {
              prompt: "SIZE = λt.t 0 (λv.λls.λrs.SUCC(ADD ls rs)). Reduce:",
              expr: "SIZE LEAF",
              choices: ["0", "1", "SUCC 0", "LEAF"],
              answer: 0,
              explanation: "SIZE LEAF = LEAF 0 (λv.λls.λrs.SUCC(ADD ls rs)) = 0. The leaf case returns the base value directly."
            },
            {
              prompt: "SIZE = λt.t 0 (λv.λls.λrs.SUCC(ADD ls rs)). Reduce:",
              expr: "SIZE (NODE a LEAF LEAF)",
              choices: ["SUCC 0", "0", "SUCC(SUCC 0)", "a"],
              answer: 0,
              explanation: "NODE a LEAF LEAF 0 (λv.λls.λrs.SUCC(ADD ls rs)) = (λv.λls.λrs.SUCC(ADD ls rs)) a (SIZE LEAF) (SIZE LEAF) = SUCC(ADD 0 0) = SUCC 0. Both subtrees are leaves (size 0), plus 1 for the node itself."
            },
          ]
        },

        // ── Concept: Scott Trees in Action ────────────────────────────────────
        {
          type: "concept",
          id: "l04-scott-action",
          title: "Scott Trees in Action",
          content: `
            <p>Scott trees make structural access trivial. Because NODE_S passes raw
            subtrees to <code>n</code>, extracting them requires no work at all.</p>
            <p><strong>GETLEFT</strong> — return the left subtree:</p>
            <div class="syntax-box"><code>GETLEFT = λt.t LEAF (λv.λl.λr.l)</code></div>
            <p>Leaf case: return LEAF by convention. Node case: <code>n</code> receives
            <code>v</code>, <code>l</code>, <code>r</code> — return <code>l</code> directly.
            The left subtree is right there; nothing to reconstruct.</p>
            <p><strong>GETVAL</strong> — return the value at the root:</p>
            <div class="syntax-box"><code>GETVAL = λt.t ZERO (λv.λl.λr.v)</code></div>
            <p>Leaf case: ZERO by convention (no root value). Node case: just return <code>v</code>. One step.</p>
            <p>But recursive operations now need explicit recursion — and therefore Y:</p>
            <div class="syntax-box"><code>SIZE_S = Y(λrec.λt.t 0 (λv.λl.λr.SUCC(ADD(rec l)(rec r))))</code></div>
            <p>Scott SIZE must call <code>rec</code> on each subtree because the subtrees
            arrive unevaluated. Church SIZE didn't need this because the fold pre-applied
            SIZE to both subtrees automatically.</p>
            <div class="grammar-rule">
              <span class="g-label">Tradeoff</span>
              Church: fold-based operations (SIZE, SUM, MIRROR) need no Y — the traversal
              is built in. Structural access is awkward.<br>
              Scott: structural access (GETLEFT, GETVAL, ISLEAF) is direct — just extract.
              Recursive operations need Y.
            </div>
          `
        },

        // ── Concept: Lambda Terms as a Tree ──────────────────────────────────
        {
          type: "concept",
          id: "l04-terms",
          title: "Lambda Terms as a Tree",
          content: `
            <p>There's one tree that matters more than any other in this course:
            a lambda term itself. Every lambda term is exactly one of three things:</p>
            <div class="ex-table">
              <div class="ex-row"><code>Var name</code><span>a variable — just a name</span></div>
              <div class="ex-row"><code>Lam param body</code><span>an abstraction — a parameter name and a body term</span></div>
              <div class="ex-row"><code>App func arg</code><span>an application — a function term and an argument term</span></div>
            </div>
            <p>Three constructors, one recursive type — a tree. Scott-encode it the same
            way you'd encode any three-constructor type: take three handler arguments,
            one per constructor, call the one that matches:</p>
            <div class="syntax-box"><code>VAR  = λname.        λvar.λlam.λapp. var name
LAM  = λparam.λbody. λvar.λlam.λapp. lam param body
APP  = λfunc.λarg.   λvar.λlam.λapp. app func arg</code></div>
            <p>The term <code>λx. x x</code> represented as data:</p>
            <div class="syntax-box"><code>LAM x (APP (VAR x) (VAR x))</code></div>
            <p>An evaluator pattern-matches on the outermost constructor by supplying three
            handler functions:</p>
            <div class="syntax-box"><code>eval t = t
  (λname. lookup name env)           -- Var: return the bound value
  (λparam.λbody. Closure param body) -- Lam: already a value, wrap it
  (λfunc.λarg. apply (eval func) (eval arg)) -- App: eval both, apply</code></div>
            <p>Why Scott and not Church? Church trees pre-fold their subtrees before
            passing them to the node handler — useful for aggregates (SIZE, SUM), but wrong
            for an evaluator that needs to <em>select one branch</em> and inspect the
            outermost form without touching the interior. Scott gives you the raw
            sub-terms; you decide what to recurse into and when.</p>
          `
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l04-ex-review",
          title: "Review: Trees",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "GETLEFT = λt.t LEAF (λv.λl.λr.l). Using Scott NODE_S — reduce:",
              expr: "GETLEFT (NODE_S a (NODE_S b LEAF LEAF) LEAF)",
              choices: [
                "NODE_S b LEAF LEAF",
                "LEAF",
                "a",
                "b"
              ],
              answer: 0,
              explanation: "NODE_S a (NODE_S b LEAF LEAF) LEAF LEAF (λv.λl.λr.l) = (λv.λl.λr.l) a (NODE_S b LEAF LEAF) LEAF = NODE_S b LEAF LEAF. Scott NODE passes raw subtrees, so l is the full encoding of the left subtree — returned directly."
            },
            {
              prompt: "Why does Scott SIZE need Y but Church SIZE does not?",
              choices: [
                "Church SIZE receives pre-folded subtree sizes; Scott SIZE receives raw subtrees it must recurse into",
                "Scott encodings are always recursive; Church encodings never are",
                "Y is only needed for trees, not for lists or naturals",
                "Church SIZE uses ADD which handles the recursion internally"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "In Church SIZE, the fold applies SIZE to both subtrees automatically — the node function receives sizes, not trees. In Scott SIZE, the node function receives the raw subtrees and must call rec on each one explicitly."
            },
            {
              prompt: "MIRROR = λt.t LEAF (λv.λlm.λrm.NODE v rm lm). What does lm represent?",
              choices: [
                "The already-mirrored left subtree",
                "The original left subtree unchanged",
                "The value of the leftmost node",
                "A copy of LEAF"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "In Church MIRROR, lm is (l LEAF (λv.λlm.λrm.NODE v rm lm)) — the result of applying MIRROR to the left subtree. The fold pre-mirrors both subtrees before the node function sees them."
            },
            {
              prompt: "Which encoding is more natural for an operation that inspects the root's value without recursing into subtrees?",
              choices: ["Scott", "Church", "Both equally", "Neither"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Scott NODE passes the raw value and subtrees directly: λv.λl.λr.v just returns v. Church NODE pre-folds the subtrees, which is wasted work if you only want the root value."
            },
            {
              prompt: "How many handler arguments does the Scott encoding of a lambda term take?",
              choices: ["3 — one for Var, one for Lam, one for App", "2 — one for variables, one for compound terms", "1 — all cases share a single eliminator", "Depends on the depth of the term"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Three constructors means three handlers: var (receives the name), lam (receives param and body), app (receives func and arg). The same rule as every Scott encoding — one handler per constructor."
            },
            {
              prompt: "Apply APP (VAR f) (VAR x) to handlers var, lam, app. Which handler is called, and with what arguments?",
              choices: [
                "app, receiving VAR f and VAR x as the two sub-terms",
                "var, receiving the name f",
                "lam, receiving f as param and VAR x as body",
                "app, receiving the pre-evaluated results of VAR f and VAR x"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "APP = λfunc.λarg.λvar.λlam.λapp. app func arg. Applied to VAR f and VAR x, then to three handlers: the app handler is called with func = VAR f and arg = VAR x. The sub-terms are passed raw — this is Scott, not Church. The evaluator decides whether and when to recurse into them."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 5 — Continuation-Passing Style
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-05",
      title: "Lesson 5: Continuation-Passing Style",
      description: "Making 'what happens next' a first-class value",
      completionText: "You can now read and write CPS expressions, use two continuations to model error paths, and explain why CPS eliminates the call stack. The next lesson makes the transform mechanical: a systematic procedure for converting any direct-style expression into CPS, step by step.",
      blocks: [

        // ── Concept: The Hidden Call Stack ────────────────────────────────────
        {
          type: "concept",
          id: "l05-hidden-stack",
          title: "The Hidden Call Stack",
          content: `
            <p>Every function call you've written in this course hides an assumption:
            the caller <em>waits</em>. When you write <code>f (g (h x))</code>,
            the evaluator has to remember what to do after each call finishes:</p>
            <div class="step-trace">
              <div class="step"><code>f (g (h x))</code><span class="step-note">f is waiting for g; g is waiting for h</span></div>
              <div class="step step-reduce"><code>f (g result_h)</code><span class="step-note">h finishes — g resumes with result_h</span></div>
              <div class="step step-reduce"><code>f result_g</code><span class="step-note">g finishes — f resumes with result_g</span></div>
              <div class="step step-reduce"><code>result_f</code><span class="step-note">f finishes — caller resumes</span></div>
            </div>
            <p>Each suspended caller occupies a <strong>stack frame</strong>. Three nested
            calls means three frames. A recursive evaluator processing a deeply nested
            lambda term might suspend thousands of frames before any results start flowing
            back — and eventually overflow.</p>
            <p>The implicit return is the culprit. It's invisible: every function
            automatically suspends its caller, runs to completion, and hands back a result.
            You can't intercept it, redirect it, or defer it.</p>
            <p>What if instead of returning implicitly, a function received an explicit
            instruction for what to do with its result? That instruction —
            "when you have the answer, do <em>this</em> with it" —
            is called a <strong>continuation</strong>.</p>
          `
        },

        // ── Concept: The Continuation ─────────────────────────────────────────
        {
          type: "concept",
          id: "l05-continuation",
          title: "The Continuation",
          content: `
            <p>A <strong>continuation</strong> is a function representing
            "the rest of the computation." Instead of returning a result,
            a function in continuation-passing style (CPS) receives a continuation
            <code>k</code> and <em>calls</em> it with the result.</p>
            <p>The rule is simple: add a <code>k</code> parameter, replace
            "return the result" with "call <code>k</code> with the result."</p>
            <div class="ex-table">
              <div class="ex-row"><code>ID    = λx.x</code><span>direct — returns x to caller</span></div>
              <div class="ex-row"><code>ID_K  = λx.λk.k x</code><span>CPS — calls k with x</span></div>
              <div class="ex-row"><code>CONST   = λx.λy.x</code><span>direct — returns x, ignores y</span></div>
              <div class="ex-row"><code>CONST_K = λx.λy.λk.k x</code><span>CPS — calls k with x</span></div>
            </div>
            <p>Instead of <em>producing</em> <code>x</code>, <code>ID_K</code>
            <em>delivers</em> <code>x</code> to whatever comes next.
            The continuation <code>k</code> is that "whatever."</p>
            <p>To run a CPS function and get its result, pass the identity function
            as the final continuation — it just returns whatever it receives:</p>
            <div class="step-trace">
              <div class="step"><code>ID_K a (λr.r)</code><span class="step-note">call ID_K with value a and identity continuation</span></div>
              <div class="step step-reduce"><code>(λr.r) a</code><span class="step-note">ID_K calls k with a</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">identity returns a — same result as direct style</span></div>
            </div>
          `
        },

        // ── Concept: CPS in Lambda Calculus ───────────────────────────────────
        {
          type: "concept",
          id: "l05-cps-lambda",
          title: "CPS in Lambda Calculus",
          content: `
            <p>When a CPS function calls another CPS function inside itself,
            the inner continuation is the <em>rest of the outer computation</em>:</p>
            <div class="syntax-box"><code>CONST_K a b (λr. ID_K r (λs.s))</code></div>
            <div class="step-trace">
              <div class="step"><code>CONST_K a b (λr. ID_K r (λs.s))</code></div>
              <div class="step step-reduce"><code>(λr. ID_K r (λs.s)) a</code><span class="step-note">CONST_K delivers a to its continuation</span></div>
              <div class="step step-reduce"><code>ID_K a (λs.s)</code><span class="step-note">continuation calls ID_K with a</span></div>
              <div class="step step-reduce"><code>(λs.s) a</code><span class="step-note">ID_K delivers a to the identity</span></div>
              <div class="step step-reduce"><code>a</code></div>
            </div>
            <p>Each step explicitly states: "I have this result — now call the next thing with it."
            There is no implicit waiting. The continuation is always the last call made.</p>
          `
        },

        // ── Exercise: Reading CPS ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "l05-ex-read",
          title: "Quick Check: Reading CPS",
          instruction: "ID_K = λx.λk.k x  ·  CONST_K = λx.λy.λk.k x",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce to normal form:",
              expr: "ID_K z (λr.r)",
              choices: ["z", "λr.r", "k z", "ID_K z"],
              answer: 0,
              explanation: "ID_K z (λr.r) = (λr.r) z = z. ID_K calls its continuation with z; the identity continuation returns z."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "CONST_K a b (λr.r)",
              choices: ["a", "b", "λr.r", "a b"],
              answer: 0,
              explanation: "CONST_K a b (λr.r) = (λr.r) a = a. CONST_K ignores b and delivers a to the continuation."
            },
            {
              prompt: "What is the role of (λr.r) in a CPS expression?",
              choices: [
                "The final continuation — it collects the result and returns it",
                "A placeholder that discards the result",
                "The first continuation in a chain",
                "A way to pass two arguments at once"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "λr.r is the identity function. Used as the outermost continuation, it acts as the 'exit' of the CPS chain — it receives the final result and returns it unchanged."
            },
            {
              prompt: "Which of these is the CPS version of λx.λy.y ?",
              choices: [
                "λx.λy.λk.k y",
                "λx.λy.λk.k x",
                "λx.λk.k x",
                "λx.λy.y (λk.k)"
              ],
              answer: 0,
              explanation: "The direct version returns y (the second argument). In CPS, add a k parameter and call k with the result: λx.λy.λk.k y."
            },
          ]
        },

        // ── Concept: Chaining ─────────────────────────────────────────────────
        {
          type: "concept",
          id: "l05-chaining",
          title: "Chaining Computations",
          content: `
            <p>In direct style, chaining two functions means nesting their calls:</p>
            <div class="syntax-box"><code>g (f x)  -- f runs first, its result goes to g</code></div>
            <p>In CPS, the chain is written inside-out — each step's continuation
            contains the next step:</p>
            <div class="syntax-box"><code>f_K x (λr1. g_K r1 k)</code></div>
            <p>Read it: "call <code>f_K</code> with <code>x</code>; when it has a result,
            call that result <code>r1</code> and pass it to <code>g_K</code>;
            when <em>that</em> has a result, pass it to <code>k</code>."</p>
            <p>A chain of three, step by step:</p>
            <div class="step-trace">
              <div class="step"><code>f_K x (λr1. g_K r1 (λr2. h_K r2 k))</code></div>
              <div class="step step-reduce"><code>g_K (f x) (λr2. h_K r2 k)</code><span class="step-note">f delivers its result as r1</span></div>
              <div class="step step-reduce"><code>h_K (g (f x)) k</code><span class="step-note">g delivers its result as r2</span></div>
              <div class="step step-reduce"><code>k (h (g (f x)))</code><span class="step-note">h delivers the final result to k</span></div>
            </div>
            <p>The computation flows left to right through the continuations —
            the opposite of how nested direct calls read.
            Each result is named (<code>r1</code>, <code>r2</code>...) and
            available to everything that follows.</p>
          `
        },

        // ── Exercise: Chaining ────────────────────────────────────────────────
        {
          type: "exercise",
          id: "l05-ex-chain",
          title: "Quick Check: CPS Chains",
          instruction: "ID_K = λx.λk.k x  ·  CONST_K = λx.λy.λk.k x",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce to normal form:",
              expr: "ID_K a (λr1. ID_K r1 (λr2.r2))",
              choices: ["a", "r1", "r2", "λr2.r2"],
              answer: 0,
              explanation: "ID_K a passes a to the continuation. Continuation calls ID_K a again, which passes a to the identity. Result: a. Two identity steps in a chain still give back the original value."
            },
            {
              prompt: "Reduce to normal form:",
              expr: "CONST_K a b (λr1. ID_K r1 (λr2.r2))",
              choices: ["a", "b", "r1", "r2"],
              answer: 0,
              explanation: "CONST_K a b delivers a to its continuation. Continuation calls ID_K a, which delivers a to the identity. Result: a."
            },
            {
              prompt: "In the chain f_K x (λr. g_K r k), what does r name?",
              choices: [
                "The result produced by f_K, passed to g_K",
                "The final result of the whole chain",
                "The continuation k",
                "The argument x"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "r is the parameter of the continuation λr. g_K r k — it receives whatever f_K delivers. r is f's output and g's input: the intermediate result passed between two steps in the chain."
            },
          ]
        },

        // ── Concept: Two Continuations ────────────────────────────────────────
        {
          type: "concept",
          id: "l05-two-k",
          title: "Two Continuations",
          content: `
            <p>So far every CPS function has had one continuation: <code>k</code>,
            "what to do with the result." But a function can take <em>two</em>
            continuations — one for each possible outcome.</p>
            <p>Consider a function that checks whether its argument is nonzero before
            proceeding. It has two outcomes: the value is usable, or it isn't.
            Instead of returning a special sentinel or crashing, it calls the
            appropriate continuation:</p>
            <div class="syntax-box"><code>NONZERO_K = λn. λk. λe. ISZERO n e (k n)</code></div>
            <p>Read it: "given n, a success continuation k, and an error continuation e —
            if n is zero, call e; otherwise call k with n."</p>
            <p>Two traces, same function:</p>
            <div class="step-trace">
              <div class="step"><code>NONZERO_K ONE k e</code><span class="step-note">n = ONE (nonzero)</span></div>
              <div class="step step-reduce"><code>ISZERO ONE e (k ONE)</code></div>
              <div class="step step-reduce"><code>FALSE e (k ONE)</code></div>
              <div class="step step-reduce"><code>k ONE</code><span class="step-note">success: k is called with the value</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>NONZERO_K ZERO k e</code><span class="step-note">n = ZERO</span></div>
              <div class="step step-reduce"><code>ISZERO ZERO e (k ZERO)</code></div>
              <div class="step step-reduce"><code>TRUE e (k ZERO)</code></div>
              <div class="step step-reduce"><code>e</code><span class="step-note">failure: e is returned — k is never called</span></div>
            </div>
            <p>When n is zero, the chain through <code>k</code> is abandoned entirely.
            <code>k</code> is never reached. The computation takes the error path instead.</p>
            <p>This is the mechanism underlying every control-flow feature that "skips"
            the normal return path:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Exceptions</strong><span>k = normal path; e = jump to the handler — throw means call e instead of k</span></div>
              <div class="ex-row"><strong>Early return</strong><span>capture the outer k and call it directly from inside a chain, skipping everything that follows</span></div>
              <div class="ex-row"><strong>Optional result</strong><span>no-value path calls e; value path calls k with the value — the same two-handler Scott pattern from Lessons 3–4</span></div>
            </div>
            <div class="callout-note">
              Control flow is not a special mechanism. In CPS, it is a choice:
              which continuation do we call?
            </div>
          `
        },

        // ── Exercise: Two Continuations ───────────────────────────────────────
        {
          type: "exercise",
          id: "l05-ex-two-k",
          title: "Quick Check: Two Continuations",
          instruction: "NONZERO_K = λn.λk.λe. ISZERO n e (k n)  ·  ISZERO ZERO = TRUE  ·  ISZERO (SUCC n) = FALSE",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce NONZERO_K ONE k e to normal form.",
              choices: ["k ONE", "e ONE", "k", "e"],
              answer: 0,
              explanation: "ISZERO ONE = FALSE. FALSE e (k ONE) = k ONE. ONE is nonzero, so the success continuation k is called with ONE."
            },
            {
              prompt: "Reduce NONZERO_K ZERO k e to normal form.",
              choices: ["e", "k ZERO", "k ONE", "e ZERO"],
              answer: 0,
              explanation: "ISZERO ZERO = TRUE. TRUE e (k ZERO) = e. ZERO triggers the error path — the error continuation e is the result and k is never called."
            },
            {
              prompt: "In NONZERO_K, which continuation is never called when n = ZERO?",
              choices: ["k", "e", "both", "neither"],
              choicesAreCode: false,
              answer: 0,
              explanation: "When n = ZERO, the result is e — the error continuation. k (the success continuation) is never called. The computation abandoned the normal path entirely."
            },
            {
              prompt: "The two-continuation CPS pattern (e for error, k for success with payload) most directly resembles which encoding from this course?",
              choices: [
                "Scott naturals — ZERO selects the first handler (no payload); SUCC n selects the second with payload n",
                "Church naturals — apply a function n times to a base value",
                "PAIR — both values forwarded together to a single consumer",
                "Church trees — recursively fold left and right subtrees"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "ZERO = λz.λs.z (selects first handler, no payload) and SUCC n = λz.λs.s n (selects second handler with payload n). In NONZERO_K, e is the 'zero' path (called with no payload, signaling failure) and k is the 'succ' path (called with n, the value). The structure is identical: two handlers, one with a payload, one without."
            },
          ]
        },

        // ── Concept: CPS and the Call Stack ───────────────────────────────────
        {
          type: "concept",
          id: "l05-no-stack",
          title: "CPS and the Call Stack",
          content: `
            <p>Return to the problem from the start of this lesson. A direct-style
            recursive function accumulates stack frames:</p>
            <div class="syntax-box"><code>-- schematic (self-reference via Y, as in Course 1)
WALK = λn. ISZERO n ZERO (WALK (PRED n))</code></div>
            <p><code>WALK THREE</code> suspends three frames before reaching the base case.
            Each call waits for the inner call to return. For large inputs, or for an
            evaluator processing a deeply nested term, the stack grows without bound.</p>
            <p>The CPS version passes the same continuation forward instead of suspending:</p>
            <div class="syntax-box"><code>WALK_K = λn. λk. ISZERO n (k ZERO) (WALK_K (PRED n) k)</code></div>
            <p>Read the recursive case: <code>WALK_K (PRED n) k</code>. The continuation
            <code>k</code> is passed along unchanged. When the base case is eventually reached,
            <code>k ZERO</code> is called once. No intermediate frame is held.
            The call stack stays flat.</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Direct style</strong><span>each call suspends the caller; stack grows one frame per recursive step</span></div>
              <div class="ex-row"><strong>CPS</strong><span>each call passes the continuation forward; caller is gone when callee runs</span></div>
            </div>
            <p>This is what "every call is a tail call" means. After calling the continuation,
            there is nothing left to do — so no frame needs to be saved. The continuation
            itself accumulates on the <em>heap</em> rather than the stack, and can be
            garbage-collected as steps complete.</p>
            <p>Because the continuation is a first-class function that can be stored and
            called at any time, the same mechanism handles deferred computation:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Async / coroutines</strong><span>save the continuation; resume it later when the value is ready</span></div>
              <div class="ex-row"><strong>call/cc</strong><span>hand the current continuation to user code as a value — Scheme's foundation for first-class control flow</span></div>
            </div>
          `
        },

        // ── Concept: Preview — CPS in an Evaluator ────────────────────────────
        {
          type: "concept",
          id: "l05-foreshadow",
          title: "Preview: CPS in an Evaluator",
          content: `
            <p>The reason CPS matters in this course is that a lambda calculus
            evaluator is a recursive program — and real terms can be deeply nested.</p>
            <p>A naive evaluator handles application like this (pseudocode):</p>
            <div class="syntax-box"><code>eval(App(f, x)) = apply(eval(f), eval(x))</code></div>
            <p>Both recursive calls to <code>eval</code> suspend the outer call.
            A term like <code>f (g (h (i x)))</code> builds four waiting frames
            before any result flows back.</p>
            <p>A CPS evaluator turns those suspended frames into heap-allocated
            continuations:</p>
            <div class="syntax-box"><code>eval(App(f, x), k) =
  eval(f, λfv.
    eval(x, λxv.
      apply(fv, xv, k)))</code></div>
            <p>No call waits. <code>eval(f, ...)</code> finishes by calling its continuation —
            which calls <code>eval(x, ...)</code> — which finishes by calling its continuation
            — which calls <code>apply</code>. At each step the previous frame is gone.
            Deep terms evaluate without growing the stack.</p>
            <p>Lesson 8 uses this directly. It asks: what concept from this course explains each
            component of a real evaluator? CPS is the answer to the stack management question.
            The two lessons ahead — the mechanical CPS transform, and then combinators —
            complete the picture before that capstone.</p>
          `
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l05-ex-review",
          title: "Review: Continuation-Passing Style",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "What is a continuation?",
              choices: [
                "A function representing the rest of the computation",
                "A function that has already been evaluated",
                "The return value of a CPS function",
                "A lambda with no free variables"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A continuation is 'what to do next.' In CPS, instead of returning a result, a function calls its continuation k with that result — handing off to the rest of the computation."
            },
            {
              prompt: "Why does CPS eliminate the need for a call stack?",
              choices: [
                "Every call is a tail call — there is nothing left to do after calling the continuation",
                "CPS functions never call other functions",
                "Continuations are evaluated before the function runs",
                "CPS uses iteration instead of recursion"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "In direct style, the caller waits on the stack for the callee to return. In CPS, the callee never returns — it calls the continuation instead. There is no suspended caller to restore, so no stack frame is needed."
            },
            {
              prompt: "NONZERO_K = λn.λk.λe. ISZERO n e (k n). Reduce to normal form:",
              expr: "NONZERO_K THREE k e",
              choices: ["k THREE", "e", "e THREE", "k"],
              answer: 0,
              explanation: "ISZERO THREE = FALSE. FALSE e (k THREE) = k THREE. THREE is nonzero, so the success continuation k is called with THREE."
            },
            {
              prompt: "In a two-continuation CPS function λn.λk.λe.(...), what does calling e instead of k correspond to?",
              choices: [
                "Throwing an exception — taking the error path instead of the normal one",
                "Returning twice",
                "Calling k with a default value",
                "Discarding n"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "e is the error continuation. Calling it instead of k abandons the normal chain and takes the error path — exactly the mechanism of throwing an exception. In CPS, throw is not a special construct; it is just a choice of which continuation to call."
            },
            {
              prompt: "Reduce to normal form: ID_K = λx.λk.k x",
              expr: "ID_K p (λr1. ID_K r1 (λr2. ID_K r2 (λr3.r3)))",
              choices: ["p", "r1", "r2", "r3"],
              answer: 0,
              explanation: "Three identity CPS functions chained together. Each passes its input unchanged to the next continuation. p flows through r1, r2, r3, and out the end. Result: p."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 6 — The CPS Transform
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-06",
      title: "Lesson 6: The CPS Transform",
      description: "A mechanical procedure for converting any expression to CPS",
      completionText: "You can now convert any expression to CPS by applying three rules, and handle curried applications by treating them as nested applications of Rule 3. The last new topic in this course takes a completely different angle: instead of transforming how results flow, it eliminates variables entirely — writing programs purely as compositions of a small set of primitive combinators.",
      blocks: [

        // ── Concept: A Systematic Procedure ───────────────────────────────────
        {
          type: "concept",
          id: "l06-intro",
          title: "A Systematic Procedure",
          content: `
            <p>In the last lesson you read and wrote CPS expressions by hand.
            This lesson makes the process mechanical: given any direct-style expression,
            there is a procedure — the <strong>CPS transform</strong> — that produces
            its CPS equivalent.</p>
            <p>Every lambda calculus expression is one of exactly three things:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Variable</strong><span><code>x</code> — a name referring to a value</span></div>
              <div class="ex-row"><strong>Abstraction</strong><span><code>λx.M</code> — a function</span></div>
              <div class="ex-row"><strong>Application</strong><span><code>M N</code> — a function applied to an argument</span></div>
            </div>
            <p>The transform handles each case with one rule. We'll write the transform
            of expression M as <strong>T(M)</strong>. The result always has the same shape:
            a lambda <code>λk.(... k ...)</code> that takes a continuation and eventually
            calls it with the result.</p>
          `
        },

        // ── Concept: Rules 1 and 2 — Values ───────────────────────────────────
        {
          type: "concept",
          id: "l06-values",
          title: "Rules 1 and 2: Values",
          content: `
            <p>Variables and abstractions are both <em>values</em> — they don't need
            to be computed, they already are something. The rule for both is the same:
            wrap the value in a continuation call.</p>
            <p><strong>Rule 1 — Variable:</strong></p>
            <div class="syntax-box"><code>T(x) = λk. k x</code></div>
            <p>"I'm a value. Call k with me."</p>
            <p><strong>Rule 2 — Abstraction:</strong></p>
            <div class="syntax-box"><code>T(λx.M) = λk. k (λx. T(M))</code></div>
            <p>The lambda itself is a value — deliver it to k.
            But the body M is also transformed: when the lambda is later called,
            its body will need to accept a continuation too.</p>
            <p>Examples:</p>
            <div class="ex-table">
              <div class="ex-row"><code>T(a)     = λk. k a</code><span>variable — deliver a to k</span></div>
              <div class="ex-row"><code>T(λx.x)  = λk. k (λx. λk'. k' x)</code><span>abstraction — deliver the lambda to k; body T(x) = λk'.k' x</span></div>
              <div class="ex-row"><code>T(λx.λy.x) = λk. k (λx. λk'. k' (λy. λk''. k'' x))</code><span>nested abstraction — each layer adds a continuation</span></div>
            </div>
            <p>Notice that a lambda with <em>n</em> parameters in direct style
            gains <em>n</em> extra continuation parameters in CPS — one for the
            result of each body.</p>
          `
        },

        // ── Exercise: Transforming Values ──────────────────────────────────────
        {
          type: "exercise",
          id: "l06-ex-values",
          title: "Quick Check: Transforming Values",
          instruction: "Apply T(x) = λk.k x and T(λx.M) = λk.k(λx.T(M)).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What is T(z)?",
              choices: ["λk.k z", "λz.k z", "k z", "λk.z k"],
              answer: 0,
              explanation: "z is a variable. Rule 1: T(z) = λk.k z. Wrap the variable in a lambda that calls k with it."
            },
            {
              prompt: "What is T(λx.y)?",
              choices: [
                "λk.k(λx.λk'.k' y)",
                "λk.k(λx.y)",
                "λx.λk.k y",
                "λk.λx.k y"
              ],
              answer: 0,
              explanation: "Rule 2: T(λx.y) = λk.k(λx.T(y)). T(y) = λk'.k' y by Rule 1. So: λk.k(λx.λk'.k' y). The outer λk delivers the function to k; the inner λk' is the continuation for the body y when the function is called."
            },
            {
              prompt: "A direct-style lambda λx.λy.M has how many continuation parameters after the full transform?",
              choices: ["2 — one for each layer of abstraction", "1 — one for the whole expression", "0 — lambdas are values, no continuation needed", "3 — one extra"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Each abstraction layer adds one k. The outer λk delivers the whole function to its continuation; each inner body gains its own k' for when that level is called. Two-parameter function → two extra k's."
            },
            {
              prompt: "What is T(λx.λy.y)?",
              choices: [
                "λk.k(λx.λk'.k'(λy.λk''.k'' y))",
                "λk.k(λx.λy.y)",
                "λk.k(λx.λk'.k' y)",
                "λk.k(λy.λk'.k' y)"
              ],
              answer: 0,
              explanation: "Rule 2 applied twice. Outer: T(λx.λy.y) = λk.k(λx.T(λy.y)). Inner: T(λy.y) = λk'.k'(λy.T(y)) = λk'.k'(λy.λk''.k'' y). Assembled: λk.k(λx.λk'.k'(λy.λk''.k'' y))."
            },
          ]
        },

        // ── Concept: Deriving Rule 3 ───────────────────────────────────────────
        {
          type: "concept",
          id: "l06-rule3-why",
          title: "Deriving Rule 3",
          content: `
            <p>Application <code>M N</code> is the interesting case. Three things must happen
            in sequence: evaluate M to get a function, evaluate N to get an argument, apply
            the function to the argument. In CPS, each step must explicitly pass its result
            to the next. Let's build the rule from that requirement.</p>
            <p><strong>Step 1:</strong> Evaluate M in CPS. T(M) is a term that takes a
            continuation and delivers M's result to it. Give it a continuation that names
            the result <code>f</code>:</p>
            <div class="syntax-box"><code>T(M)(λf. ...)</code></div>
            <p><strong>Step 2:</strong> Inside that continuation, evaluate N in CPS.
            Give T(N) a continuation that names the result <code>a</code>:</p>
            <div class="syntax-box"><code>T(M)(λf. T(N)(λa. ...))</code></div>
            <p><strong>Step 3:</strong> Now apply f to a. But f is a CPS function —
            it was produced by T(M), so it expects an argument <em>and</em> a continuation.
            The whole expression's continuation <code>k</code> is what f should call
            when done:</p>
            <div class="syntax-box"><code>T(M)(λf. T(N)(λa. f a k))</code></div>
            <p><strong>Step 4:</strong> The whole transform is itself a CPS term — it
            must accept a continuation before any of this begins:</p>
            <div class="syntax-box"><code>T(M N) = λk. T(M)(λf. T(N)(λa. f a k))</code></div>
            <p>Each part of the formula exists because one specific sub-problem required it.
            <code>λf.</code> names M's result. <code>λa.</code> names N's result.
            <code>k</code> is passed to f so the final result reaches the outer world.
            <code>λk.</code> makes the whole thing a CPS term.</p>
          `
        },

        // ── Concept: Rule 3 — Applications ────────────────────────────────────
        {
          type: "concept",
          id: "l06-applications",
          title: "Rule 3: Applications",
          content: `
            <p><strong>Rule 3 — Application:</strong></p>
            <div class="syntax-box"><code>T(M N) = λk. T(M)(λf. T(N)(λa. f a k))</code></div>
            <p>The lambdas introduced by the transform itself — <code>λk.</code>,
            <code>λf.</code>, <code>λa.</code> — are called <strong>administrative lambdas</strong>.
            They are scaffolding created by the procedure, not present in the original program.
            When you beta-reduce them, they disappear, leaving only the essential CPS structure.</p>
            <p>Read the rule once more with that framing:</p>
            <ul class="parts-list">
              <li><code>λk.</code> — administrative: makes T(M N) a CPS term that accepts a continuation</li>
              <li><code>T(M)(λf. …)</code> — evaluate M; the administrative <code>λf.</code> receives its result</li>
              <li><code>T(N)(λa. …)</code> — evaluate N; the administrative <code>λa.</code> receives its result</li>
              <li><code>f a k</code> — the actual application: call f with argument a and continuation k</li>
            </ul>
          `
        },

        // ── Concept: A Simple Walkthrough ─────────────────────────────────────
        {
          type: "concept",
          id: "l06-simple-walkthrough",
          title: "A Simple Walkthrough: T(f x)",
          content: `
            <p>Before tackling a complex example, work through T(f x) where
            <code>f</code> and <code>x</code> are free variables. Their transforms
            are immediate by Rule 1:</p>
            <div class="ex-table">
              <div class="ex-row"><code>T(f) = λk'. k' f</code><span>Rule 1 — variable</span></div>
              <div class="ex-row"><code>T(x) = λk''. k'' x</code><span>Rule 1 — variable</span></div>
            </div>
            <p>Apply Rule 3 to T(f x):</p>
            <div class="syntax-box"><code>T(f x) = λk. T(f)(λfv. T(x)(λa. fv a k))</code></div>
            <p>Now substitute T(f) and T(x) and beta-reduce the administrative lambdas
            — the <code>λk'.</code> and <code>λk''.</code> introduced by the transform:</p>
            <div class="step-trace">
              <div class="step"><code>λk. (λk'.k' f)(λfv. (λk''.k'' x)(λa. fv a k))</code></div>
              <div class="step step-reduce"><code>λk. (λfv. (λk''.k'' x)(λa. fv a k)) f</code><span class="step-note">reduce administrative λk': deliver f to λfv.</span></div>
              <div class="step step-reduce"><code>λk. (λk''.k'' x)(λa. f a k)</code><span class="step-note">reduce administrative λfv: substitute f</span></div>
              <div class="step step-reduce"><code>λk. (λa. f a k) x</code><span class="step-note">reduce administrative λk'': deliver x to λa.</span></div>
              <div class="step step-reduce"><code>λk. f x k</code><span class="step-note">reduce administrative λa: substitute x</span></div>
            </div>
            <p>Result: <code>λk. f x k</code> — the CPS version of applying f to x.
            To use it, supply the outer continuation: <code>T(f x) k</code> = <code>f x k</code>.
            The application runs and delivers its result to <code>k</code>.</p>
            <p>Notice what beta-reducing the administrative lambdas did: it eliminated all
            the scaffolding (<code>λk'.</code>, <code>λk''.</code>, <code>λfv.</code>,
            <code>λa.</code>) leaving only <code>λk. f x k</code> — the clean CPS form.
            This is always what the administrative reductions accomplish.</p>
          `
        },

        // ── Concept: A Full Walkthrough ────────────────────────────────────────
        {
          type: "concept",
          id: "l06-walkthrough",
          title: "A Full Walkthrough: T((λx.x) z)",
          content: `
            <p>Now a harder case: <code>(λx.x) z</code> — the identity applied to z.
            This time M is a lambda, not a free variable, so T(M) is not immediate.</p>
            <p><strong>Step 1:</strong> It's an application. Apply Rule 3:</p>
            <div class="syntax-box"><code>T((λx.x) z) = λk. T(λx.x)(λf. T(z)(λa. f a k))</code></div>
            <p><strong>Step 2:</strong> Expand the sub-transforms. T(λx.x) uses Rule 2;
            T(z) uses Rule 1:</p>
            <div class="syntax-box"><code>T(λx.x) = λk'. k'(λx. λk''. k'' x)
T(z)    = λk'''. k''' z</code></div>
            <p><strong>Step 3:</strong> Substitute and beta-reduce all administrative lambdas.
            Each reduction step eliminates one layer of scaffolding:</p>
            <div class="step-trace">
              <div class="step"><code>λk. (λk'.k'(λx.λk''.k'' x))(λf. (λk'''.k''' z)(λa. f a k))</code></div>
              <div class="step step-reduce"><code>λk. (λf. (λk'''.k''' z)(λa. f a k))(λx.λk''.k'' x)</code><span class="step-note">reduce λk': deliver the identity's CPS form to λf.</span></div>
              <div class="step step-reduce"><code>λk. (λk'''.k''' z)(λa. (λx.λk''.k'' x) a k)</code><span class="step-note">reduce λf: substitute the identity for f</span></div>
              <div class="step step-reduce"><code>λk. (λa. (λx.λk''.k'' x) a k) z</code><span class="step-note">reduce λk''': deliver z to λa.</span></div>
              <div class="step step-reduce"><code>λk. (λx.λk''.k'' x) z k</code><span class="step-note">reduce λa: substitute z</span></div>
              <div class="step step-reduce"><code>λk. k z</code><span class="step-note">apply identity to z, then deliver to k</span></div>
            </div>
            <p>Result: <code>λk.k z</code> — the same as T(z) directly.
            Applying the identity to z in CPS produces exactly what the CPS transform of z
            produces on its own. Confirm: <code>(λk.k z)(λr.r) = z</code>.</p>
            <p>The extra primes (<code>k'</code>, <code>k''</code>, <code>k'''</code>) are
            just fresh continuation names used inside T(λx.x) and T(z) to avoid clashing
            with the outer <code>k</code>. They all disappear in the administrative reductions.</p>
          `
        },

        // ── Concept: Curried Applications ─────────────────────────────────────
        {
          type: "concept",
          id: "l06-curried",
          title: "Curried Applications",
          content: `
            <p>Lambda calculus application is left-associative.
            <code>f a b</code> is shorthand for <code>(f a) b</code> — two nested
            applications, not one. To transform <code>f a b</code>, apply Rule 3 twice:
            first to the outer application, then to the inner.</p>
            <p>Let f, a, b be free variables. From the previous walkthrough,
            T(f a) = λk'. f a k'. Now treat T(f a b) = T((f a) b):</p>
            <div class="step-trace">
              <div class="step"><code>T(f a b) = λk. T(f a)(λg. T(b)(λbv. g bv k))</code><span class="step-note">Rule 3 on the outer application</span></div>
              <div class="step step-reduce"><code>λk. (λk'.f a k')(λg. (λk''.k'' b)(λbv. g bv k))</code><span class="step-note">substitute T(f a) and T(b)</span></div>
              <div class="step step-reduce"><code>λk. f a (λg. (λk''.k'' b)(λbv. g bv k))</code><span class="step-note">reduce administrative λk'</span></div>
              <div class="step step-reduce"><code>λk. f a (λg. (λbv. g bv k) b)</code><span class="step-note">reduce administrative λk''</span></div>
              <div class="step step-reduce"><code>λk. f a (λg. g b k)</code><span class="step-note">reduce administrative λbv</span></div>
            </div>
            <p>Result: <code>λk. f a (λg. g b k)</code>.</p>
            <p>This is not simply <code>λk. f a b k</code> — the intermediate result of
            <code>f a</code> is explicitly named <code>g</code>, and then <code>g</code>
            is applied to <code>b</code> and <code>k</code>.
            CPS makes the intermediate result of every sub-application visible and named,
            because that is exactly what continuations are for.</p>
            <div class="callout-note">
              Each additional argument adds one more administrative lambda that names
              the intermediate result. Three arguments? Three nested λ's, three named
              intermediate results, one continuation at the end.
            </div>
          `
        },

        // ── Exercise: Applying Rule 3 ──────────────────────────────────────────
        {
          type: "exercise",
          id: "l06-ex-applications",
          title: "Quick Check: Applications",
          instruction: "Apply T(M N) = λk.T(M)(λf.T(N)(λa.f a k)).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What is the first step of T(f x) — before substituting sub-transforms?",
              choices: [
                "λk. T(f)(λfv. T(x)(λxv. fv xv k))",
                "λk. f(λfv. x(λxv. fv xv k))",
                "λk. k(f x)",
                "T(f)(T(x))"
              ],
              answer: 0,
              explanation: "Rule 3 applied directly to f x, naming the sub-transform results as fv and xv. The sub-transforms T(f) and T(x) are not yet expanded — this is just the structural template."
            },
            {
              prompt: "T(f) = λk.k f and T(z) = λk.k z. What does T(f z) reduce to after beta-reducing the administrative lambdas?",
              choices: [
                "λk. f z k",
                "λk. k (f z)",
                "λk. T(f)(T(z))",
                "f z"
              ],
              answer: 0,
              explanation: "T(f z) = λk.T(f)(λfv.T(z)(λa.fv a k)) → λk.(λfv.(λa.fv a k) z) f → λk.(λa.f a k) z → λk.f z k. The administrative lambdas (λk', λfv, λa) are eliminated one by one, leaving λk.f z k."
            },
            {
              prompt: "After the full CPS transform and beta-reduction, T((λx.x) a) equals:",
              choices: ["λk.k a", "λk.(λx.λk'.k' x) a k", "λk.k(λx.x) a", "a"],
              answer: 0,
              explanation: "Applying the identity function to a in direct style gives a. The CPS transform of the whole thing reduces to λk.k a — it delivers a to the continuation, same as T(a) directly. The identity disappears in the administrative reductions."
            },
            {
              prompt: "f, a, b are free variables. T(f a b) reduces to:",
              choices: [
                "λk. f a (λg. g b k)",
                "λk. f a b k",
                "λk. k (f a b)",
                "λk. f (λg. g a (λh. h b k))"
              ],
              answer: 0,
              explanation: "f a b = (f a) b — two applications. T(f a) = λk'.f a k'. Apply Rule 3 to the outer application: λk.(λk'.f a k')(λg.T(b)(λbv.g bv k)) → λk.f a (λg.(λk''.k'' b)(λbv.g bv k)) → λk.f a (λg.g b k). The intermediate result of f a is named g and applied to b and k."
            },
          ]
        },

        // ── Final Exercise: Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l06-ex-review",
          title: "Review: The CPS Transform",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "What rule applies to T(λx.M)?",
              choices: [
                "λk.k(λx.T(M)) — the lambda is a value; deliver it to k, with the body also transformed",
                "λk.T(M) — the lambda disappears; only the body matters",
                "λx.λk.T(M) — add k after the existing parameters",
                "T(M) — abstractions are already in CPS"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Rule 2: T(λx.M) = λk.k(λx.T(M)). The lambda is a value delivered to k. Its body M is also transformed so that when the function is eventually called, it too will accept and call a continuation."
            },
            {
              prompt: "In T(M N) = λk.T(M)(λf.T(N)(λa.f a k)), what is the role of k in f a k?",
              choices: [
                "It is the continuation passed to f — f will call k with its result",
                "It is the argument passed to f after a",
                "It names the result of f a",
                "It is the continuation for evaluating N"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "f is a CPS-transformed function — it expects an argument and a continuation. f a k says: call f with argument a and continuation k. When f is done, it will call k with its result, completing the chain."
            },
            {
              prompt: "Every term produced by the CPS transform has what shape?",
              choices: [
                "λk.(... k ...) — a lambda that takes a continuation and eventually calls it",
                "λk.k — the identity function",
                "λx.λk.x — a value followed by a continuation",
                "k M — the continuation applied to the original term"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Every CPS-transformed term is λk.(expression calling k). Variables become λk.k x. Lambdas become λk.k(λx.T(M)). Applications become λk.T(M)(λf.T(N)(λa.f a k)). In each case, the outermost form is a lambda waiting for a continuation."
            },
            {
              prompt: "What are administrative lambdas?",
              choices: [
                "Lambdas introduced by the transform as scaffolding, not present in the original program",
                "Lambdas that appear in the original direct-style expression",
                "Lambdas that remain after beta reduction is complete",
                "Lambdas used to encode data types"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Administrative lambdas — λk., λf., λa. and their renamed variants — are created by the transform to name intermediate results and thread continuations. They are scaffolding. Beta-reducing them eliminates the scaffolding and leaves the clean CPS form."
            },
            {
              prompt: "T((λx.λy.x) a b) reduces (after beta-reducing administrative lambdas) to:",
              choices: ["λk.k a", "λk.k b", "λk.k(λy.a)", "λk.a b k"],
              answer: 0,
              explanation: "In direct style, (λx.λy.x) a b = a (the constant function applied to a and b returns a). The CPS transform of the whole expression reduces to λk.k a — it delivers a to the continuation, same as T(a)."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 7 — Combinators and Point-Free Style
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-07",
      title: "Lesson 7: Combinators and Point-Free Style",
      navTitle: "Combinators",
      description: "S, K, I — three terms that can express everything",
      completionText: "You've now seen how lambda calculus, evaluation strategies, encodings, CPS, and combinators all fit together as distinct layers of theory. The final lesson brings these pieces into view at once — not to implement an interpreter from scratch, but to recognize how each layer shows up when you open one up.",
      blocks: [

        // ── Concept: What Is a Combinator? ───────────────────────────────────
        {
          type: "concept",
          id: "l07-combinators-intro",
          title: "What Is a Combinator?",
          content: `
            <p>A <strong>combinator</strong> is a lambda term with <em>no free variables</em>.
            Every variable in its body is bound by some enclosing λ within the term itself —
            none of its behavior depends on the surrounding context.</p>
            <p>The terms from <em>Foundations</em> — TRUE, FALSE, PAIR, Y — were all combinators.
            Combinator style takes this to the extreme: write programs using <em>only</em>
            pre-built combinators, without ever introducing a new λ or naming a new variable.</p>
            <p>Three combinators form a universal basis:</p>
            <div class="ex-table">
              <div class="ex-row"><code>I = λx.x</code><span><strong>Identity</strong> — returns its argument unchanged</span></div>
              <div class="ex-row"><code>K = λx.λy.x</code><span><strong>Constant</strong> — returns its first argument, ignores its second</span></div>
              <div class="ex-row"><code>S = λx.λy.λz.x z (y z)</code><span><strong>Substitution</strong> — applies its first argument to its third, applies its second argument to its third, then applies those results together</span></div>
            </div>
            <p>I and K are old friends from Foundations. I is the identity function; K is TRUE —
            the same select-first behavior that appears in PAIR's FST. S is the new one, and it
            needs a moment of explanation.</p>
            <p>When you write a lambda term, a bound variable can be used in exactly three ways:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Zero times</strong><span>the variable is ignored — K handles this by discarding one of its arguments</span></div>
              <div class="ex-row"><strong>Once, in position</strong><span>the variable is passed through — I handles this by returning its argument unchanged</span></div>
              <div class="ex-row"><strong>In two or more places</strong><span>the variable must be duplicated — S handles this by passing its third argument to both of the first two</span></div>
            </div>
            <p>Those three cases are exhaustive. S handles the hard case — the one where
            a variable appears on multiple sides of an expression. That is why S and K together
            are sufficient for anything.</p>
          `
        },

        // ── Concept: I, K, and S in Action ───────────────────────────────────
        {
          type: "concept",
          id: "l07-ski-action",
          title: "I, K, and S in Action",
          content: `
            <p>Let's see each combinator reduce:</p>
            <div class="step-trace">
              <div class="step"><code>I a</code><span class="step-note">identity</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">returns its argument unchanged</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>K a b</code><span class="step-note">constant</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">ignores b, returns a</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>S f g x</code><span class="step-note">substitution</span></div>
              <div class="step step-reduce"><code>f x (g x)</code><span class="step-note">x is duplicated: passed to both f and g; then f's result is applied to g's result</span></div>
            </div>
            <p>S is the duplication combinator. One argument (<code>x</code>) goes to two places
            simultaneously. Without S, you could only pass an argument to one function —
            you couldn't share it.</p>
            <p>A famous consequence: <strong>S K K = I</strong>.</p>
            <div class="step-trace">
              <div class="step"><code>S K K x</code></div>
              <div class="step step-reduce"><code>K x (K x)</code><span class="step-note">S duplicates x: passed to both K's</span></div>
              <div class="step step-reduce"><code>x</code><span class="step-note">K x (K x) returns its first argument</span></div>
            </div>
            <p><strong>S and K alone are sufficient</strong> for any computation — I is just a
            convenience. The SKI calculus is as powerful as full lambda calculus.</p>
          `
        },

        // ── Exercise: Reducing with S, K, I ──────────────────────────────────
        {
          type: "exercise",
          id: "l07-ex-ski-reduce",
          kind: "multiple-choice",
          title: "Reducing with S, K, I",
          instruction: "Reduce each expression using I = λx.x, K = λx.λy.x, S = λx.λy.λz.x z (y z).",
          items: [
            {
              prompt: "K a b reduces to:",
              choices: ["a", "b", "K a", "a b"],
              answer: 0,
              explanation: "K = λx.λy.x. K a b = (λy.a) b = a. The constant combinator returns its first argument and ignores its second."
            },
            {
              prompt: "I (K a b) reduces to:",
              choices: ["a", "b", "K a b", "I a"],
              answer: 0,
              explanation: "K a b = a (K returns its first argument). Then I a = a. I is transparent — it returns exactly what it receives."
            },
            {
              prompt: "S K K a reduces to:",
              choices: ["a", "K a", "K K a", "S a"],
              answer: 0,
              explanation: "S K K a = K a (K a) = a. S distributes a across both K's: K a (K a). Then K a (K a) returns its first argument: a. This confirms S K K = I."
            },
            {
              prompt: "K (S K K) a reduces to:",
              choices: ["S K K", "a", "K a", "I"],
              answer: 0,
              explanation: "K takes two arguments and returns the first. K (S K K) a = S K K. The second argument a is discarded. (S K K is never applied here, so it stays unreduced.)"
            },
          ]
        },

        // ── Concept: Bracket Abstraction ─────────────────────────────────────
        {
          type: "concept",
          id: "l07-bracket-abstraction",
          title: "Bracket Abstraction",
          content: `
            <p>The claim that S and K can express anything is constructive — there's an algorithm
            to convert any lambda term into an equivalent one that uses <em>only</em> S, K, I,
            and application. It's called <strong>bracket abstraction</strong>.</p>
            <p>Write <code>[x]M</code> to mean "eliminate all free occurrences of x from M."
            Three rules cover every case:</p>
            <div class="ex-table">
              <div class="ex-row"><code>[x]x = I</code><span>a lone x becomes identity — the "use once" case</span></div>
              <div class="ex-row"><code>[x]M = K M</code><span>if x ∉ FV(M) — x doesn't appear; K discards whatever x will be — the "use zero times" case</span></div>
              <div class="ex-row"><code>[x](P Q) = S ([x]P) ([x]Q)</code><span>an application — recurse into each side; S will duplicate x and send one copy to each — the "use in two places" case</span></div>
            </div>
            <p>The three rules correspond directly to the three ways of using a variable:
            discard (K), use once (I), use in two places (S). Apply these recursively from
            <em>inside out</em>, eliminating one variable at a time. When finished, no λ remains.</p>
          `
        },

        // ── Concept: A Simple Conversion ──────────────────────────────────────
        {
          type: "concept",
          id: "l07-simple-example",
          title: "A Simple Conversion: λx.x x",
          content: `
            <p>Let's start with a one-variable case: <code>λx.x x</code> — the
            self-application function.</p>
            <p>Eliminate x from the body <code>x x</code>. It's an application, so use Rule 3:</p>
            <div class="ex-table">
              <div class="ex-row"><code>[x](x x) = S ([x]x) ([x]x)</code><span>Rule 3 — recurse into each half</span></div>
              <div class="ex-row"><code>[x]x = I</code><span>Rule 1 — both halves are just x</span></div>
              <div class="ex-row"><code>= S I I</code><span>substitute both results</span></div>
            </div>
            <p>Result: <code>λx.x x = S I I</code>. Verify:</p>
            <div class="step-trace">
              <div class="step"><code>S I I a</code></div>
              <div class="step step-reduce"><code>I a (I a)</code><span class="step-note">S duplicates a: passed to both I's</span></div>
              <div class="step step-reduce"><code>a (I a)</code><span class="step-note">first I returns a</span></div>
              <div class="step step-reduce"><code>a a</code><span class="step-note">second I returns a — self-application ✓</span></div>
            </div>
            <p>S I I is the self-application combinator. Notice how S did exactly its job:
            x appeared in two places in the body, so S duplicated it and sent one copy to
            each I. Rule 3 exists precisely for this case.</p>
          `
        },

        // ── Concept: A Two-Variable Conversion ───────────────────────────────
        {
          type: "concept",
          id: "l07-conversion-example",
          title: "A Two-Variable Conversion: K",
          content: `
            <p>Now two variables: <code>K = λx.λy.x</code>.
            Work inside-out, eliminating the innermost variable first.</p>
            <p><strong>Step 1: eliminate y from the body x</strong> (the inner lambda).</p>
            <div class="ex-table">
              <div class="ex-row"><code>[y]x</code><span>y does not appear free in x — Rule 2</span></div>
              <div class="ex-row"><code>= K x</code><span>wrap with K to discard y</span></div>
            </div>
            <p>So <code>λy.x = K x</code>. The inner lambda is now gone.</p>
            <p><strong>Step 2: eliminate x from K x</strong> (the outer lambda).</p>
            <div class="ex-table">
              <div class="ex-row"><code>[x](K x)</code><span>an application — Rule 3</span></div>
              <div class="ex-row"><code>= S ([x]K) ([x]x)</code><span>recurse into each part</span></div>
              <div class="ex-row"><code>[x]K = K K</code><span>x ∉ FV(K) — Rule 2: wrap with K</span></div>
              <div class="ex-row"><code>[x]x = I</code><span>Rule 1</span></div>
              <div class="ex-row"><code>= S (K K) I</code><span>substitute back</span></div>
            </div>
            <p>Result: <code>K = S (K K) I</code>. The K on the right side is the combinator
            being used as a building block — not a circular definition, but an equality:
            bracket abstraction produces S(KK)I, and S(KK)I reduces to the same thing
            as λx.λy.x. Verify:</p>
            <div class="step-trace">
              <div class="step"><code>S (K K) I a b</code></div>
              <div class="step step-reduce"><code>(K K) a (I a) b</code><span class="step-note">S distributes a to both (KK) and I</span></div>
              <div class="step step-reduce"><code>K (I a) b</code><span class="step-note">(K K) a = K — K drops a, returns K</span></div>
              <div class="step step-reduce"><code>I a</code><span class="step-note">K returns its first argument (I a), drops b</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">I a = a ✓</span></div>
            </div>
            <p>K a b = a, which is exactly what λx.λy.x does.</p>
          `
        },

        // ── Exercise: Bracket Abstraction ────────────────────────────────────
        {
          type: "exercise",
          id: "l07-ex-bracket",
          kind: "multiple-choice",
          title: "Bracket Abstraction",
          instruction: "Apply the rules: [x]x = I,  [x]M = KM (x ∉ FV(M)),  [x](PQ) = S([x]P)([x]Q).",
          items: [
            {
              prompt: "What is [x]x?",
              choices: ["I", "K x", "S x x", "K K"],
              answer: 0,
              explanation: "[x]x matches Rule 1 exactly: a lone x becomes I."
            },
            {
              prompt: "What is [x]y, where x ≠ y?",
              choices: ["K y", "I", "S x y", "K x"],
              answer: 0,
              explanation: "x does not appear free in y, so Rule 2 applies: [x]y = K y. The result ignores x and returns y."
            },
            {
              prompt: "[x](f x) by Rule 3 gives S([x]f)([x]x). Since [x]f = Kf and [x]x = I, the result is:",
              choices: ["S (K f) I", "S f I", "K (S f I)", "S I (K f)"],
              answer: 0,
              explanation: "[x](f x) = S([x]f)([x]x) = S(Kf)(I). Verify: S(Kf)I x = (Kf)x (Ix) = f x. This equals λx.f x — the identity of application, which eta-reduces to f."
            },
            {
              prompt: "λx.x x in combinator form is S I I. What does S I I a reduce to?",
              choices: ["a a", "I a", "a", "S a a"],
              answer: 0,
              explanation: "S I I a = I a (I a) = a (I a) = a a. S duplicates a and passes it to both I's. Each I returns a unchanged. The result is a applied to a — self-application."
            },
            {
              prompt: "λx.λy.y in combinator form is (work inside-out: first [y]y = I, then [x]I = ?):",
              choices: ["K I", "S K I", "I I", "K K"],
              answer: 0,
              explanation: "Step 1: [y]y = I. Step 2: x ∉ FV(I), so [x]I = K I. Result: λx.λy.y = K I. Verify: K I a b = I b = b — select-second behavior. This is FALSE from Foundations, expressed without any λ."
            },
          ]
        },

        // ── Concept: Point-Free Style ─────────────────────────────────────────
        {
          type: "concept",
          id: "l07-point-free",
          title: "Point-Free Style",
          content: `
            <p>Once you have combinators, you can write programs without naming arguments at all.
            This is called <strong>point-free style</strong> — "points" is a mathematical term for
            "arguments," and point-free means writing functions without mentioning what they take.</p>
            <p>In direct style: <code>λx.f (g x)</code> — you name x to thread it through g then f.</p>
            <p>With the <strong>B combinator</strong> (function composition), you don't need to:</p>
            <div class="ex-table">
              <div class="ex-row"><code>B = λf.λg.λx. f (g x)</code><span>apply g to x first, pass result to f</span></div>
            </div>
            <p>With B, you write <code>B f g</code> instead of <code>λx.f (g x)</code>.
            Haskell's <code>f . g</code> operator is exactly B.</p>
            <p>Bracket abstraction converts B to SKI as <code>B = S (K S) K</code>.
            Verify by reduction:</p>
            <div class="step-trace">
              <div class="step"><code>S (K S) K f g x</code></div>
              <div class="step step-reduce"><code>(K S) f (K f) g x</code><span class="step-note">S distributes f to (KS) and K</span></div>
              <div class="step step-reduce"><code>S (K f) g x</code><span class="step-note">(K S) f = S — K drops f, returns S</span></div>
              <div class="step step-reduce"><code>(K f) x (g x)</code><span class="step-note">S distributes x to (Kf) and g</span></div>
              <div class="step step-reduce"><code>f (g x)</code><span class="step-note">(K f) x = f — K drops x, returns f ✓</span></div>
            </div>
            <p>B is derived from the primitives — no new axiom needed. Higher-level combinators
            like B are convenient abbreviations for patterns that S, K, and I already express.</p>
          `
        },

        // ── Concept: The SKI Machine ──────────────────────────────────────────
        {
          type: "concept",
          id: "l07-ski-machine",
          title: "Preview: The SKI Machine",
          content: `
            <p>Everything in this lesson points toward a specific question: what if you used
            bracket abstraction as a compilation step, and then evaluated the resulting SKI
            term by three rewriting rules — never touching a λ or looking up a variable?</p>
            <p>That is the <strong>SKI machine</strong>:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Phase 1 — Compile</strong><span>convert every lambda in the program to S, K, I via bracket abstraction; no bound variables remain</span></div>
              <div class="ex-row"><strong>Phase 2 — Evaluate</strong><span>reduce by three rules — I x → x, K x y → x, S f g x → f x (g x) — no variable lookup, no substitution</span></div>
            </div>
            <p>The evaluator is three pattern-match cases. No scope tracking. No alpha renaming.
            No substitution. It powered early Haskell compilers and remains a clean existence proof:
            computation needs only three primitives to be universal.</p>
            <p>Lesson 8 uses this as one of several examples of how each topic in this course
            maps onto a real component of an interpreter. The SKI machine is the answer to the
            question: what if you eliminated variable substitution from evaluation entirely?</p>
          `
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l07-ex-final",
          kind: "multiple-choice",
          title: "Combinators and Point-Free Style",
          isFinal: true,
          instruction: "Review questions covering the whole lesson.",
          items: [
            {
              prompt: "A lambda term is a combinator if:",
              choices: [
                "It has no free variables",
                "It has no bound variables",
                "It is built from S, K, and I only",
                "It reduces to a value in one step"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A combinator is any lambda term with no free variables — every variable in the body is bound by a lambda within the term itself. Being built from S, K, I is one way to achieve this, but any closed lambda term (like TRUE or PAIR) is also a combinator."
            },
            {
              prompt: "Why is S the specific combinator needed for universality, alongside K?",
              choices: [
                "S handles the case where a variable appears in two places — K and I can't duplicate",
                "S eliminates the need for lambda entirely",
                "S is the only combinator that can reduce to K",
                "S handles the base case where a variable isn't used"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "K discards (variable used zero times), I passes through (used once). The remaining case — a variable used in two or more places — requires duplication. S x passes its third argument to both its first and second arguments simultaneously: S f g x = f x (g x). That duplication is exactly what makes S complete the basis."
            },
            {
              prompt: "In bracket abstraction, the rule that handles an application [x](P Q) is:",
              choices: [
                "Rule 3: S([x]P)([x]Q)",
                "Rule 1: I",
                "Rule 2: K(PQ)",
                "No rule exists for applications"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Rule 3 handles applications by recursing into each subterm and combining with S. S is needed because the future argument x must be sent to both halves — that's duplication, which only S provides."
            },
            {
              prompt: "λx.λy.y in combinator form is:",
              choices: ["K I", "K K", "S K K", "I I"],
              answer: 0,
              explanation: "[y]y = I, then [x]I = K I (since x ∉ FV(I)). So λx.λy.y = K I. Verify: K I a b = I b = b — the select-second behavior of FALSE, now expressed without any λ."
            },
            {
              prompt: "The B combinator (B = S(KS)K) verified by reducing S(KS)K f g x produces:",
              choices: [
                "f (g x) — B is function composition",
                "g (f x) — B reverses composition order",
                "f g x — B is just application",
                "K f g x — B discards x"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "S(KS)K f g x → (KS)f (Kf) g x → S(Kf) g x → (Kf)x (g x) → f(g x). B applies g first, then f — the standard composition order. Haskell's (.) is B."
            },
          ]
        },

      ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    //  Lesson 8 — Putting It Together
    // ══════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-08",
      title: "Lesson 8: Putting It Together",
      navTitle: "Putting It Together",
      description: "How evaluation strategies, encodings, CPS, and combinators compose into an interpreter",
      completionText: "You've reached the end of Under the Hood. You started with a question about which redex to fire first, and ended with a picture of how a real evaluator is five independent decisions — each of which is a concept from this course. Lambda calculus turns out not to be just a theoretical model of computation; it's a precise lens for understanding how computation is actually implemented.",
      blocks: [

        // ── Concept: The Three Stages ─────────────────────────────────────────
        {
          type: "concept",
          id: "l08-three-stages",
          title: "The Three Stages",
          content: `
            <p>A lambda calculus interpreter has three stages:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Parse</strong><span>text → abstract syntax tree</span></div>
              <div class="ex-row"><strong>Evaluate</strong><span>AST → reduced AST</span></div>
              <div class="ex-row"><strong>Print</strong><span>AST → text</span></div>
            </div>
            <p>Parsing and printing are largely mechanical. The evaluator is where all the
            interesting choices live — and every topic in this course describes one of those choices.</p>
            <p>This lesson doesn't ask you to implement an interpreter. Instead, it shows
            how the evaluator is a stack of independent decisions, maps each decision to the
            lesson that explains it, and shows what combinations produce what real systems.</p>
          `
        },

        // ── Concept: Representing Terms ───────────────────────────────────────
        {
          type: "concept",
          id: "l08-representing-terms",
          title: "Representing Terms",
          content: `
            <p>Every lambda term is one of three things. An evaluator needs to store and inspect
            them — which means choosing a representation. This is the encoding pattern from
            Lessons 3–4, now applied to terms themselves.</p>
            <div class="ex-table">
              <div class="ex-row"><code>Var(name)</code><span>a variable — a name that refers to a binding</span></div>
              <div class="ex-row"><code>Lam(param, body)</code><span>an abstraction — a parameter name and a body term</span></div>
              <div class="ex-row"><code>App(func, arg)</code><span>an application — a function term and an argument term</span></div>
            </div>
            <p>In Haskell, this is a one-liner:</p>
            <div class="syntax-box"><code>data Term = Var String | Lam String Term | App Term Term</code></div>
            <p>The eval function dispatches on it. In lambda calculus, a Scott-encoded Term
            takes three handler arguments — one per constructor — and calls the right one with
            its payload. The eval loop looks like:</p>
            <div class="syntax-box"><code>eval term =
  term
    (λname.     lookup name env)       -- Var handler
    (λparam.λbody.  Lam param body)    -- Lam handler (already a value)
    (λfunc.λarg.  apply (eval func) (eval arg))  -- App handler</code></div>
            <p>This is the same three-handler structure as every Scott encoding in this course —
            the same pattern as naturals (zero/succ) and trees (leaf/node), now with three
            constructors instead of two. The eval function is just case analysis on terms.</p>
            <p>Church encodings fold over structure — useful for computing aggregates, but
            awkward for dispatch. Scott's direct case analysis is cleaner here because
            eval needs to <em>select</em> one branch, not iterate.</p>
          `
        },

        // ── Concept: The Evaluation Loop ──────────────────────────────────────
        {
          type: "concept",
          id: "l08-eval-loop",
          title: "The Evaluation Loop",
          content: `
            <p>The evaluator runs a loop: find a redex, fire it, check if done.
            Three independent decisions shape that loop:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Which redex?</strong><span>Evaluation strategy — normal order (outermost first) or applicative order (innermost first) — Lesson 1</span></div>
              <div class="ex-row"><strong>When done?</strong><span>Normal form check — full normal form, or stop at WHNF (outer lambda visible) — Lesson 2</span></div>
              <div class="ex-row"><strong>How deep?</strong><span>Stack management — naive recursion hits limits; CPS or trampolining avoids it — Lessons 5–6</span></div>
            </div>
            <p>These decisions interact in a specific way for lazy evaluation. Normal order
            only reduces what is demanded — it never evaluates an argument unless something
            actually needs it. WHNF says "stop as soon as the outer constructor is visible."
            Together, they mean: expose enough structure to know <em>what</em> the value is,
            then stop — leave the interior for later. That is exactly what makes infinite
            structures like <code>ones = 1 : ones</code> productive: the outer cons cell is
            exposed (WHNF reached), the tail stays as an unevaluated thunk.</p>
            <p>Applicative order with full normal form is the eager combination: evaluate the
            argument fully before calling the function. Strict languages (ML, Scheme) use this.
            It's simpler to implement but can't handle infinite structures.</p>
          `
        },

        // ── Exercise: Recognizing the Layers ─────────────────────────────────
        {
          type: "exercise",
          id: "l08-ex-layers",
          kind: "multiple-choice",
          title: "Recognizing the Layers",
          instruction: "Match each described behavior to the concept from this course that explains it.",
          items: [
            {
              prompt: "The evaluator stops reducing as soon as the outermost form is a lambda, leaving inner parts unevaluated.",
              choices: [
                "Weak Head Normal Form",
                "Normal order evaluation",
                "Applicative order evaluation",
                "Alpha conversion"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Stopping when the outermost form is a lambda is WHNF. Inner parts stay as thunks — evaluated only when demanded. This is the lazy evaluator's stopping condition."
            },
            {
              prompt: "Instead of using the call stack for recursive evaluation, the evaluator passes 'what to do after this reduction' as an explicit function argument.",
              choices: [
                "Continuation-Passing Style",
                "Bracket abstraction",
                "Scott encodings",
                "Weak Head Normal Form"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Passing 'the rest of the computation' explicitly is CPS. It trades stack depth for heap-allocated continuations, enabling evaluation of arbitrarily deep terms without stack overflow."
            },
            {
              prompt: "The evaluator represents terms as Var/Lam/App nodes where each case is handled by passing the right handler function — no if-then-else needed.",
              choices: [
                "Scott encodings",
                "Church encodings",
                "The CPS transform",
                "Bracket abstraction"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Scott encodings represent each constructor as a term that selects and applies the matching handler — exactly case analysis by function application. Church encodings fold over structure, which is less direct for dispatch."
            },
            {
              prompt: "The evaluator converts all lambdas to S, K, I before evaluating, then reduces by three rewriting rules — no variable lookup required.",
              choices: [
                "Bracket abstraction / SKI reduction",
                "Normal order evaluation",
                "Continuation-Passing Style",
                "The encoding pattern"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Bracket abstraction converts any lambda term into SKI combinators. An SKI machine then evaluates purely by rewriting: S f g x → f x (g x), K x y → x, I x → x. No variables, no substitution."
            },
          ]
        },

        // ── Concept: The Full Picture ─────────────────────────────────────────
        {
          type: "concept",
          id: "l08-full-picture",
          title: "The Full Picture",
          content: `
            <p>Every evaluator is a stack of five independent choices. Pick one option from
            each row:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Representation</strong><span>Scott encoding (direct case dispatch) — or — Church encoding (fold over structure)</span></div>
              <div class="ex-row"><strong>Strategy</strong><span>Normal order (outermost first, call-by-name) — or — Applicative order (innermost first, call-by-value)</span></div>
              <div class="ex-row"><strong>Stopping condition</strong><span>WHNF (outer constructor visible) — or — Full normal form (fully reduced)</span></div>
              <div class="ex-row"><strong>Stack management</strong><span>CPS / trampolining (continuations on heap) — or — Direct recursion (call stack)</span></div>
              <div class="ex-row"><strong>Variable handling</strong><span>Substitution (beta reduction, lambda terms throughout) — or — SKI machine (bracket abstraction eliminates variables before evaluation)</span></div>
            </div>
            <p>Three recognizable evaluator models arise from specific combinations:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Haskell (GHC)</strong><span>Scott + Normal order + WHNF + graph reduction (CPS variant) + Substitution via the STG machine</span></div>
              <div class="ex-row"><strong>Strict functional (ML, Scheme)</strong><span>Scott + Applicative order + Full NF + CPS + Substitution</span></div>
              <div class="ex-row"><strong>Early Haskell / Miranda</strong><span>SKI machine — bracket abstraction eliminates variables; three rewriting rules evaluate with no substitution</span></div>
            </div>
            <div class="callout-note">
              The choices are independent. Changing one doesn't force you to change another.
              Each row is a concept from this course.
            </div>
          `
        },

        // ── Concept: Lazy Evaluation in Practice ─────────────────────────────
        {
          type: "concept",
          id: "l08-lazy-practice",
          title: "Lazy Evaluation in Practice",
          content: `
            <p>A lazy evaluator is the combination of two things from the first two lessons:</p>
            <div class="ex-table">
              <div class="ex-row"><strong>Normal order (Lesson 1)</strong><span>reduce outermost redex first — equivalent to "call-by-name": pass arguments unevaluated and reduce only when demanded</span></div>
              <div class="ex-row"><strong>WHNF (Lesson 2)</strong><span>stop as soon as the outermost constructor is visible — expose just enough structure for the caller to proceed</span></div>
            </div>
            <p>These two together give laziness in its purest form. Real lazy languages like
            Haskell add one more mechanism: <strong>sharing</strong>. If the same argument
            would be evaluated more than once, evaluate it once and cache the result.</p>
            <p>Normal order + WHNF + sharing = <strong>call-by-need</strong>. Each argument is
            wrapped in a <em>thunk</em>. The first time the thunk is forced, evaluate it and
            overwrite with the result. Later forces just return the cached value.</p>
            <p>This is why <code>head (map f [1..])</code> terminates. The evaluator exposes
            the outer cons cell (WHNF reached), extracts the head, and never touches the rest of
            the list. The infinite tail exists as a thunk that is never forced.</p>
          `
        },

        // ── Concept: CPS in the Evaluator ─────────────────────────────────────
        {
          type: "concept",
          id: "l08-cps-evaluator",
          title: "CPS in the Evaluator",
          content: `
            <p>Lesson 5 showed how a CPS evaluator avoids call-stack growth by replacing
            waiting frames with heap-allocated continuations. Two practical consequences
            follow from that design.</p>
            <p><strong>Trampolining.</strong> A pure CPS evaluator still calls functions
            directly — just in tail position. Some runtimes don't optimize tail calls,
            so in practice the CPS style is implemented as a <em>trampoline</em>: instead of
            calling the next step, return a thunk representing it. An outer loop bounces
            between thunks in a flat loop:</p>
            <div class="syntax-box"><code>loop(thunk):
  result = thunk()          -- one step
  if result is a thunk: loop(result)
  else: return result</code></div>
            <p>The stack never grows past one frame. Each step produces either a final value
            or another thunk, which the loop handles immediately.</p>
            <p><strong>call/cc.</strong> In a direct-style evaluator, the current state of
            the computation is implicit — it's the call stack. You can't name it or hand it to
            user code. In a CPS evaluator, the current continuation <code>k</code> is already
            an explicit value. <code>call/cc</code> — call-with-current-continuation — simply
            passes <code>k</code> to user code as a first-class function:</p>
            <div class="syntax-box"><code>callcc(f, k) = f(k, k)</code></div>
            <p>User code can store <code>k</code>, call it later, call it multiple times, or
            ignore it. This is the foundation of exceptions (call <code>k</code> from an
            error handler), generators (call <code>k</code> to resume), and coroutines
            (two continuations that resume each other). None of these require new language
            primitives — they fall out of CPS for free.</p>
          `
        },

        // ── Concept: The SKI Machine ──────────────────────────────────────────
        {
          type: "concept",
          id: "l08-ski-machine",
          title: "The SKI Machine",
          content: `
            <p>Substitution-based evaluation — finding a redex, substituting the argument for the
            bound variable throughout the body — is conceptually clean but operationally fiddly.
            Variables must be looked up, scopes must be tracked, accidental capture must be avoided.</p>
            <p>The SKI machine sidesteps all of this with two phases:</p>
            <p><strong>Phase 1 — Bracket abstraction:</strong> convert every lambda in the program
            to S, K, I. No bound variables remain.</p>
            <p><strong>Phase 2 — Combinator reduction:</strong> evaluate by three rewriting rules:</p>
            <div class="ex-table">
              <div class="ex-row"><code>I x → x</code><span></span></div>
              <div class="ex-row"><code>K x y → x</code><span></span></div>
              <div class="ex-row"><code>S f g x → f x (g x)</code><span></span></div>
            </div>
            <p>No variable lookup. No substitution. Just pattern-match the outermost form and
            rewrite. The evaluator is three cases.</p>
            <p>This powered early implementations of Miranda and the first Haskell compilers.
            The cost: bracket abstraction can produce terms exponentially larger than the
            original — a term with <em>n</em> variables may balloon to size O(4ⁿ) in the worst
            case. Modern compilers like GHC prefer graph reduction directly on lambda terms,
            using the Spineless Tagless G-machine (STG) instead. But the SKI machine remains
            a clean existence proof: computation needs only three primitives, and evaluation
            needs no variables at all.</p>
          `
        },

        // ── Exercise: Final Review ────────────────────────────────────────────
        {
          type: "exercise",
          id: "l08-ex-final",
          kind: "multiple-choice",
          title: "Putting It Together",
          isFinal: true,
          instruction: "Review questions spanning the full course.",
          items: [
            {
              prompt: "In a lazy evaluator, an argument wrapped in a deferred computation — evaluated only when first demanded — is called:",
              choices: ["A thunk", "A continuation", "A combinator", "A redex"],
              choicesAreCode: false,
              answer: 0,
              explanation: "A thunk is a deferred computation. The first time it is forced (demanded), it is evaluated and its result is cached. Subsequent forces return the cached value without re-evaluating."
            },
            {
              prompt: "Why does normal order evaluation pair with WHNF to make infinite structures productive?",
              choices: [
                "Normal order only reduces what's demanded; WHNF stops once the outer constructor is visible — together they expose just enough structure without forcing the interior",
                "Normal order evaluates all arguments first; WHNF ensures the result is fully reduced",
                "WHNF is the starting condition; normal order is the stopping condition",
                "Both strategies avoid beta reduction — infinite structures need no reduction at all"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal order (call-by-name) only reduces a redex when something demands the result. WHNF says 'stop once the outermost lambda or constructor is exposed.' Together: reduce as little as possible, expose the outer structure, leave the rest as a thunk. An infinite list's tail is never touched unless something asks for it."
            },
            {
              prompt: "Scott encodings are well-suited for representing terms in an evaluator because:",
              choices: [
                "Each case directly selects and applies the matching handler — the same pattern used for booleans, naturals, and trees",
                "They reduce to normal form faster than Church encodings",
                "They eliminate the need for an evaluation strategy",
                "They can represent infinite structures without diverging"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The Term type (Var/Lam/App) is a three-constructor sum type. Scott encoding gives each constructor a form that selects and invokes the right handler. Eval dispatches by passing three handler lambdas — the same elimination rule pattern used for every encoding in this course."
            },
            {
              prompt: "call/cc (call-with-current-continuation) is straightforward to add to a CPS evaluator because:",
              choices: [
                "The current continuation is already an explicit value — just pass it to user code as a function",
                "CPS evaluators automatically memoize continuations",
                "call/cc only works when the call stack is empty",
                "Continuations and thunks are the same thing in CPS"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "In direct-style evaluation, the 'current continuation' is implicit — it's the call stack, which user code can't name or touch. In CPS, k is an explicit function argument at every step. call/cc just hands k to user code. No new mechanism is needed."
            },
            {
              prompt: "Which combination of choices describes the lazy evaluator that Haskell uses?",
              choices: [
                "Scott + Normal order + WHNF + CPS/graph reduction + Substitution",
                "Church + Applicative order + Full NF + Direct recursion + SKI machine",
                "Scott + Applicative order + Full NF + CPS + Substitution",
                "SKI machine + Normal order + WHNF + Trampolining"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Haskell (GHC) uses Scott-style case dispatch, normal order (call-by-need), WHNF as the stopping condition, graph reduction (a CPS variant that shares thunks), and substitution-based beta reduction via the STG machine — not an SKI machine."
            },
          ]
        },

      ]
    },

  ]
};
