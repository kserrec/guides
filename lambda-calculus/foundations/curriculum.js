// curriculum.js
// Each lesson is a sequence of blocks: 'concept' blocks teach, 'exercise' blocks test.
// Add new lessons to CURRICULUM.lessons to extend the course.

const CURRICULUM = {
  title: "Lambda Calculus",
  subtitle: "An interactive introduction to the foundation of computation",
  lessons: [
    {
      id: "lesson-01",
      title: "Lesson 1: Syntax",
      description: "Learn to read and write lambda calculus expressions",
      completionText: "You now know all three expression forms and how they interact. In the next lesson, you'll learn the one rule that makes lambda calculus actually <em>compute</em>.",
      blocks: [
        // ── Concept: Variables ──────────────────────────────────────────────
        {
          type: "concept",
          id: "variables",
          title: "1. Variables",
          content: `
            <p>The simplest expression in lambda calculus is a <strong>variable</strong>.
            In our notation, variables are single lowercase letters.</p>
            <div class="ex-table">
              <div class="ex-row"><code>x</code><span>a variable named x</span></div>
              <div class="ex-row"><code>y</code><span>a variable named y</span></div>
              <div class="ex-row"><code>f</code><span>a variable — often used to represent functions</span></div>
              <div class="ex-row"><code>n</code><span>a variable — often used to represent numbers</span></div>
            </div>
            <p>A variable alone is a complete, valid lambda expression.</p>
            <div class="grammar-rule">
              <span class="g-label">Grammar</span>
              Any single lowercase letter is a valid expression.
            </div>
          `
        },

        // ── Exercise: Variables ─────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-vars",
          title: "Quick Check: Variables",
          instruction: "Which of these are valid lambda calculus expressions?",
          kind: "valid-or-invalid",
          items: [
            {
              expr: "x",
              answer: "valid",
              explanation: "A single letter — a valid variable."
            },
            {
              expr: "42",
              answer: "invalid",
              explanation: "Numbers aren't part of lambda calculus syntax. Variables must be single letters."
            },
            {
              expr: "f",
              answer: "valid",
              explanation: "Any single letter is a valid variable, including those we associate with functions."
            },
            {
              expr: "x1",
              answer: "invalid",
              explanation: "Variables must be a single letter. \"x1\" is two characters, not one."
            },
          ]
        },

        // ── Concept: Lambda Abstractions ────────────────────────────────────
        {
          type: "concept",
          id: "abstraction",
          title: "2. Lambda Abstractions",
          content: `
            <p>A <strong>lambda abstraction</strong> defines a function.
            It uses the λ symbol — when typing, write a backslash <code>\</code> in its place.</p>
            <div class="syntax-box"><code>λx.M</code></div>
            <ul class="parts-list">
              <li><code>λx</code> &mdash; declares the parameter (the input variable)</li>
              <li><code>.</code> &mdash; separates the parameter from the body</li>
              <li><code>M</code> &mdash; the body (any lambda expression)</li>
            </ul>
            <p>Read it as: <em>"the function that takes <code>x</code> and returns <code>M</code>."</em></p>
            <div class="ex-table">
              <div class="ex-row"><code>λx.x</code><span>the identity function — returns its argument unchanged</span></div>
              <div class="ex-row"><code>λx.y</code><span>ignores its argument, always returns <code>y</code></span></div>
              <div class="ex-row"><code>λf.f</code><span>takes <code>f</code> and returns it unchanged</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Grammar</span>
              If <code>x</code> is a variable and <code>M</code> is an expression,
              then <code>λx.M</code> is an expression.
            </div>
          `
        },

        // ── Exercise: Abstractions ──────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-abs",
          title: "Quick Check: Abstractions",
          instruction: "Which of these are valid lambda abstractions?",
          kind: "valid-or-invalid",
          items: [
            {
              expr: "λx.x",
              answer: "valid",
              explanation: "Valid: λx.M where M is the variable x."
            },
            {
              expr: "λx",
              answer: "invalid",
              explanation: "Missing the dot and body. A lambda abstraction requires λx.M."
            },
            {
              expr: "λ. x",
              answer: "invalid",
              explanation: "Missing the parameter variable. It must be λx.M — a letter is required between λ and the dot."
            },
            {
              expr: "λx.",
              answer: "invalid",
              explanation: "Missing the body. After the dot, there must be an expression."
            },
            {
              expr: "λy.f y",
              answer: "valid",
              explanation: "Valid: λy.M where M is the application \"f y\" (we'll cover application next)."
            },
          ]
        },

        // ── Concept: Application ────────────────────────────────────────────
        {
          type: "concept",
          id: "application",
          title: "3. Application",
          content: `
            <p><strong>Application</strong> means calling a function with an argument.
            Write it by placing two expressions next to each other — no special symbol needed.</p>
            <div class="syntax-box"><code>M N</code></div>
            <p>The left expression is the function; the right is the argument.</p>
            <div class="ex-table">
              <div class="ex-row"><code>f x</code><span>apply f to x</span></div>
              <div class="ex-row"><code>g y</code><span>apply g to y</span></div>
              <div class="ex-row"><code>(λx.x) y</code><span>apply the identity function to y</span></div>
            </div>
            <p>Application is <strong>left-associative</strong>: a chain groups from the left.</p>
            <div class="ex-table">
              <div class="ex-row"><code>f x y</code><span>means <code>(f x) y</code></span></div>
              <div class="ex-row"><code>f x y z</code><span>means <code>((f x) y) z</code></span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Grammar</span>
              If <code>M</code> and <code>N</code> are expressions, then <code>M N</code> is an expression.
            </div>
          `
        },

        // ── Exercise: Application ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-app",
          title: "Quick Check: Application",
          instruction: "Which of these are valid expressions?",
          kind: "valid-or-invalid",
          items: [
            {
              expr: "f x",
              answer: "valid",
              explanation: "Valid: application of f to x."
            },
            {
              expr: "(λx.x) y",
              answer: "valid",
              explanation: "Valid: applying the identity function to y. Parentheses wrap the abstraction so it's treated as the function."
            },
            {
              expr: "(f x",
              answer: "invalid",
              explanation: "Invalid: the opening parenthesis is never closed."
            },
            {
              expr: "x y z",
              answer: "valid",
              explanation: "Valid: left-associative application. This means (x y) z."
            },
          ]
        },

        // ── Concept: Precedence & Parentheses ───────────────────────────────
        {
          type: "concept",
          id: "precedence",
          title: "4. Precedence & Parentheses",
          content: `
            <p>You now know all three kinds of expressions. Without rules about which binds tighter, an expression like <code>λx.f x y</code> would be ambiguous — does the body stretch to include <code>y</code>, or not? Two rules resolve every case:</p>
            <p><strong>Abstraction extends as far right as possible.</strong>
            The body of <code>λx.…</code> stretches to the end of the expression
            (or the nearest unmatched closing parenthesis).</p>
            <div class="ex-table">
              <div class="ex-row"><code>λx.f x</code><span>means <code>λx.(f x)</code>, not <code>(λx.f) x</code></span></div>
              <div class="ex-row"><code>λx.λy.x</code><span>means <code>λx.(λy.x)</code> — nested functions</span></div>
            </div>
            <p><strong>Application binds tighter than abstraction.</strong>
            Use parentheses whenever you need to override the defaults.</p>
            <div class="ex-table">
              <div class="ex-row"><code>(λx.x) y</code><span>parens required to apply the abstraction as a function</span></div>
              <div class="ex-row"><code>f (x y)</code><span>apply f to the <em>result</em> of applying x to y</span></div>
            </div>
            <p>Parentheses must always be <strong>balanced</strong>:
            every <code>(</code> needs exactly one matching <code>)</code>.</p>
            <div class="grammar-rule">
              <span class="g-label">Grammar</span>
              If <code>M</code> is an expression, then <code>(M)</code> is an expression.
            </div>
          `
        },

        // ── Final Exercise ──────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-review",
          title: "Review: Valid or Invalid?",
          instruction: "You've seen all of lambda calculus syntax. Classify each expression — some are tricky!",
          kind: "valid-or-invalid",
          isFinal: true,
          items: [
            {
              expr: "λx.x",
              answer: "valid",
              explanation: "The identity function. A valid lambda abstraction."
            },
            {
              expr: "λx",
              answer: "invalid",
              explanation: "Missing the dot and body. Must be λx.M."
            },
            {
              expr: "f x y",
              answer: "valid",
              explanation: "Left-associative application: (f x) y."
            },
            {
              expr: "(x y",
              answer: "invalid",
              explanation: "Unclosed parenthesis — every ( needs a matching )."
            },
            {
              expr: "λx.λy.x",
              answer: "valid",
              explanation: "Nested abstractions: λx.(λy.x). A function that takes two arguments and returns the first."
            },
            {
              expr: "λ. x",
              answer: "invalid",
              explanation: "Missing the parameter variable. Must be λx.M — a letter is required after λ."
            },
            {
              expr: "(λx.x) y",
              answer: "valid",
              explanation: "Applying the identity function to y. The parens group the abstraction so it sits in the function position."
            },
            {
              expr: "λx y. x",
              answer: "invalid",
              explanation: "You can't list multiple parameters in one abstraction. Write λx.λy.x instead — one λ per parameter."
            },
            {
              expr: "λf.f (f x)",
              answer: "valid",
              explanation: "A function that applies f to (f x). Parentheses group the inner application as the argument."
            },
            {
              expr: "λx.",
              answer: "invalid",
              explanation: "The dot needs a body expression after it."
            },
          ]
        }
      ]
    },

    // ── Lesson 2: Beta Reduction ────────────────────────────────────────────
    {
      id: "lesson-02",
      title: "Lesson 2: Beta Reduction",
      description: "Learn the one rule that makes lambda calculus compute",
      completionText: "You can now reduce lambda expressions to their normal forms. Next up: we'll build real values — booleans, pairs, and numbers — entirely out of functions.",

      blocks: [

        // ── Concept: The Beta Reduction Rule ───────────────────────────────
        {
          type: "concept",
          id: "beta-rule",
          title: "The Beta Reduction Rule",
          content: `
            <p>Lambda calculus has exactly one computation rule: <strong>beta reduction</strong>.</p>
            <p>When you see a lambda abstraction applied to an argument, you can reduce it:</p>
            <div class="syntax-box"><code>(λx.M) N  →  M[x := N]</code></div>
            <p><code>M[x := N]</code> means: <em>"copy <code>M</code>, replacing every occurrence
            of <code>x</code> with <code>N</code>."</em> Think of it as find-and-replace:
            scan the body and swap out the variable wherever it appears.
            Nothing is evaluated yet — it's pure rewriting.</p>
            <p>The pattern <code>(λx.M) N</code> — an abstraction applied to an argument —
            is called a <strong>redex</strong> (short for <em>reducible expression</em>).</p>
            <div class="ex-table">
              <div class="ex-row"><code>(λx.x) y</code><span>→ <code>y</code> &nbsp; substitute y for x in body x</span></div>
              <div class="ex-row"><code>(λx.y) z</code><span>→ <code>y</code> &nbsp; x never appears; z is discarded</span></div>
              <div class="ex-row"><code>(λx.x x) f</code><span>→ <code>f f</code> &nbsp; x appears twice; both replaced</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Only an <em>abstraction</em> applied to an argument is a redex.
              Applying a <em>variable</em> to an argument (like <code>f x</code>)
              is not a redex — you'd need to know what <code>f</code> is first.
            </div>
          `
        },

        // ── Exercise: Spot the Redex ────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-redex",
          title: "Quick Check: Spot the Redex",
          instruction: "A redex looks like (λx.M) N — an abstraction applied to an argument. Which of these contain a redex?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Does this contain a redex?",
              expr: "(λx.x) y",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Yes — the whole expression is a redex: the abstraction (λx.x) applied to y."
            },
            {
              prompt: "Does this contain a redex?",
              expr: "x y",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 1,
              explanation: "No redex. x is a variable, not an abstraction. Only (λx.M) N is a redex."
            },
            {
              prompt: "Does this contain a redex?",
              expr: "f (λx.x)",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 1,
              explanation: "No redex. f is a variable — not an abstraction. The (λx.x) is just sitting there as an argument, not being applied."
            },
            {
              prompt: "Does this contain a redex?",
              expr: "λx.(λy.y) z",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Yes — inside the body, (λy.y) z is a redex: the abstraction (λy.y) applied to z."
            },
          ]
        },

        // ── Concept: Substitution Mechanics ────────────────────────────────
        {
          type: "concept",
          id: "substitution",
          title: "Performing the Substitution",
          content: `
            <p><code>M[x := N]</code> means: scan through <code>M</code> and replace
            every occurrence of variable <code>x</code> with <code>N</code>.
            Everything else stays untouched.</p>
            <div class="ex-table">
              <div class="ex-row"><code>x[x := a]</code><span>→ <code>a</code> &nbsp; replace x</span></div>
              <div class="ex-row"><code>y[x := a]</code><span>→ <code>y</code> &nbsp; y is not x; unchanged</span></div>
              <div class="ex-row"><code>(f x)[x := g]</code><span>→ <code>f g</code> &nbsp; only x is replaced</span></div>
              <div class="ex-row"><code>(x x x)[x := h]</code><span>→ <code>h h h</code> &nbsp; all three replaced</span></div>
            </div>
            <p>The argument can itself be a lambda abstraction — substitution just
            copies it in wherever <code>x</code> appears:</p>
            <div class="step-trace">
              <div class="step"><code>(λf.f y) g</code></div>
              <div class="step step-reduce"><code>g y</code><span class="step-note">substitute g for f in "f y"</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>(λx.x x) (λy.y)</code></div>
              <div class="step step-reduce"><code>(λy.y) (λy.y)</code><span class="step-note">substitute (λy.y) for x in "x x"</span></div>
            </div>
          `
        },

        // ── Exercise: Single-Step Reduction ────────────────────────────────
        {
          type: "exercise",
          id: "ex-step",
          title: "Quick Check: One Reduction Step",
          instruction: "Apply one beta reduction step. What is the result?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Reduce one step:",
              expr: "(λx.x) y",
              choices: ["y", "x", "x y", "(λx.y)"],
              answer: 0,
              explanation: "Substitute y for x in the body x. x becomes y."
            },
            {
              prompt: "Reduce one step:",
              expr: "(λx.y) z",
              choices: ["y", "z", "y z", "(λx.z)"],
              answer: 0,
              explanation: "x doesn't appear in the body y, so z is discarded. Result: y."
            },
            {
              prompt: "Reduce one step:",
              expr: "(λx.x x) f",
              choices: ["f f", "f", "x x", "f x"],
              answer: 0,
              explanation: "Substitute f for x in the body x x. Both x's become f. Result: f f."
            },
            {
              prompt: "Reduce one step:",
              expr: "(λx.λy.x) a",
              choices: ["λy.a", "λy.x", "a", "λx.a"],
              answer: 0,
              explanation: "Substitute a for x in the body λy.x. The x inside becomes a. Result: λy.a — still a function, now returning a fixed value."
            },
          ]
        },

        // ── Concept: Normal Form ────────────────────────────────────────────
        {
          type: "concept",
          id: "normal-form",
          title: "Normal Form",
          content: `
            <p>One reduction step may produce a new redex. Keep going — reduce any redex you find, then look again — until there are no redexes left anywhere in the expression. That fully-reduced state is the <strong>normal form</strong>.</p>
            <div class="step-trace">
              <div class="step"><code>(λx.λy.x) a b</code><span class="step-note">&nbsp;= ((λx.λy.x) a) b</span></div>
              <div class="step step-reduce"><code>(λy.a) b</code><span class="step-note">substitute a for x in λy.x</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">substitute b for y in a — y absent, b discarded</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>(λf.λx.f x) g a</code><span class="step-note">&nbsp;= ((λf.λx.f x) g) a</span></div>
              <div class="step step-reduce"><code>(λx.g x) a</code><span class="step-note">substitute g for f in λx.f x</span></div>
              <div class="step step-reduce"><code>g a</code><span class="step-note">substitute a for x in g x</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Note</span>
              Not every expression has a normal form — some keep producing new redexes
              and never stop. We'll see an example of that in a later lesson.
            </div>
          `
        },

        // ── Exercise: Normal Form ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-normal",
          title: "Quick Check: Reduce to Normal Form",
          instruction: "Reduce completely. What is the normal form?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal form of:",
              expr: "(λx.λy.x) a b",
              choices: ["a", "b", "a b", "λy.a"],
              answer: 0,
              explanation: "Step 1: (λx.λy.x) a → λy.a. Step 2: (λy.a) b → a. y doesn't appear in a, so b is discarded."
            },
            {
              prompt: "Normal form of:",
              expr: "(λf.λx.f x) g a",
              choices: ["g a", "g", "f a", "λx.g x"],
              answer: 0,
              explanation: "Step 1: (λf.λx.f x) g → λx.g x. Step 2: (λx.g x) a → g a."
            },
            {
              prompt: "Normal form of:",
              expr: "(λx.x x) (λy.y)",
              choices: ["λy.y", "y y", "(λy.y) (λy.y)", "y"],
              answer: 0,
              explanation: "Step 1: substitute (λy.y) for x in x x → (λy.y) (λy.y). Step 2: apply identity to itself — substitute (λy.y) for y in y → λy.y."
            },
          ]
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-beta-review",
          title: "Review: Beta Reduction",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Does this contain a redex?",
              expr: "x (λy.y)",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 1,
              explanation: "No redex. x is a variable — we'd need an abstraction on the left to have a redex. (λy.y) is just the argument."
            },
            {
              prompt: "Does this contain a redex?",
              expr: "(λx.x) (λy.y)",
              choices: ["Has a redex", "No redex"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Yes — (λx.x) is an abstraction applied to (λy.y). The whole thing is a redex."
            },
            {
              prompt: "Reduce one step:",
              expr: "(λx.x y) f",
              choices: ["f y", "x y", "f", "λx.f y"],
              answer: 0,
              explanation: "Substitute f for x in the body x y. Result: f y."
            },
            {
              prompt: "Reduce one step:",
              expr: "(λx.λy.y) a",
              choices: ["λy.y", "λy.a", "a", "λy.y"],
              answer: 0,
              explanation: "Substitute a for x in the body λy.y — but x doesn't appear in the body! Result: λy.y unchanged."
            },
            {
              prompt: "Normal form of:",
              expr: "(λx.x) ((λy.y) z)",
              choices: ["z", "λy.y", "x", "(λy.y) z"],
              answer: 0,
              explanation: "Two redexes, both paths lead to z. Inner first: (λy.y) z → z, then (λx.x) z → z. Outer first: (λx.x) applied to its argument → (λy.y) z → z."
            },
            {
              prompt: "Normal form of:",
              expr: "(λf.f f) (λx.x)",
              choices: ["λx.x", "x x", "(λx.x) (λx.x)", "x"],
              answer: 0,
              explanation: "Step 1: substitute (λx.x) for f in f f → (λx.x) (λx.x). Step 2: apply identity to itself → λx.x."
            },
          ]
        }

      ]
    },

    // ── Lesson 3: Non-termination ───────────────────────────────────────────
    {
      id: "lesson-03",
      title: "Lesson 3: Non-termination",
      description: "Discover expressions that reduce forever — and why order matters",
      completionText: "You've seen that lambda calculus can express infinite loops, and that the order you choose to reduce can be the difference between terminating and looping forever. Next up: alpha conversion — renaming bound variables to keep substitution safe.",

      blocks: [

        // ── Concept: Multiple Redexes ───────────────────────────────────────
        {
          type: "concept",
          id: "multi-redex",
          title: "Multiple Redexes",
          content: `
            <p>An expression can contain more than one redex at once.
            You get to choose which one to reduce first.</p>
            <p>This expression has <strong>two redexes</strong>:</p>
            <div class="ex-table">
              <div class="ex-row"><code>(λx.x) ((λy.y) z)</code><span>outer redex — the whole application</span></div>
              <div class="ex-row"><code>(λy.y) z</code><span>inner redex — nested inside the argument</span></div>
            </div>
            <p>Whichever you pick, you reach the same result:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">&nbsp; inner first</span></div>
              <div class="step step-reduce"><code>(λx.x) z</code></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>(λx.x) ((λy.y) z)</code><span class="step-note">&nbsp; outer first</span></div>
              <div class="step step-reduce"><code>(λy.y) z</code><span class="step-note">identity returns its argument whole</span></div>
              <div class="step step-reduce"><code>z</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Good news</span>
              If an expression has a normal form, every reduction sequence that
              terminates reaches the <em>same</em> normal form. The order you pick doesn't change the answer — only whether you find it.
            </div>
          `
        },

        // ── Exercise: Count Redexes ─────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-count",
          title: "Quick Check: Counting Redexes",
          instruction: "How many redexes does each expression contain?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "How many redexes?",
              expr: "(λx.x) y",
              choices: ["0", "1", "2", "3"],
              answer: 1,
              explanation: "One redex: (λx.x) y — an abstraction applied to an argument."
            },
            {
              prompt: "How many redexes?",
              expr: "(λx.x) ((λy.y) z)",
              choices: ["0", "1", "2", "3"],
              answer: 2,
              explanation: "Two: the outer (λx.x) applied to its argument, and the inner (λy.y) z."
            },
            {
              prompt: "How many redexes?",
              expr: "x y z",
              choices: ["0", "1", "2", "3"],
              answer: 0,
              explanation: "Zero. x, y, z are all variables — no abstraction is being applied to anything."
            },
            {
              prompt: "How many redexes?",
              expr: "(λf.f a)((λx.x) b)",
              choices: ["0", "1", "2", "3"],
              answer: 2,
              explanation: "Two: the outer (λf.f a) applied to its argument, and the inner (λx.x) b."
            },
          ]
        },

        // ── Concept: The Ω Combinator ───────────────────────────────────────
        {
          type: "concept",
          id: "omega",
          title: "The Ω Combinator",
          content: `
            <p>Not every expression reaches a normal form. Some keep producing new redexes and never stop.</p>
            <p>Define <strong>ω</strong> (omega) — the self-application function:</p>
            <div class="syntax-box"><code>ω  =  λx.x x</code></div>
            <p>ω takes an argument and applies it to itself.
            Now apply ω to <em>itself</em>:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.x x)(λx.x x)</code></div>
              <div class="step step-reduce"><code>(λx.x x)(λx.x x)</code><span class="step-note">substitute (λx.x x) for x in x x — same expression</span></div>
              <div class="step step-reduce"><code>(λx.x x)(λx.x x)</code><span class="step-note">and again, forever</span></div>
            </div>
            <p>This is <strong>Ω</strong> (capital omega). It has exactly one redex at all times,
            and reducing it reproduces Ω exactly. It has no normal form.</p>
            <p>Ω is the simplest expression of an infinite loop in lambda calculus.</p>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Lambda calculus can express non-termination. This is part of
              what makes it Turing-complete — it can simulate any computation,
              including ones that never halt.
            </div>
          `
        },

        // ── Exercise: Normal Form or Not ────────────────────────────────────
        {
          type: "exercise",
          id: "ex-normalform",
          title: "Quick Check: Normal Form or Not?",
          instruction: "Does this expression eventually reach a normal form, or does it loop forever?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λx.x x)(λx.x x)",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 1,
              explanation: "This is Ω — it reduces to itself indefinitely. No normal form."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λx.y) z",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal form: y. x doesn't appear in the body, so z is discarded in one step."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λx.x x x)(λx.x x x)",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Loops forever. One step produces three copies: (λx.x x x)(λx.x x x)(λx.x x x). Each step multiplies the copies — it grows without bound."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λf.f a)(λx.x)",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Has a normal form: a. One step: substitute (λx.x) for f in f a → (λx.x) a → a."
            },
          ]
        },

        // ── Concept: When Order Matters ─────────────────────────────────────
        {
          type: "concept",
          id: "order-matters",
          title: "When Order Matters",
          content: `
            <p>Church-Rosser guarantees the same normal form for all terminating paths.
            But some orders can loop forever while others terminate.</p>
            <p>Apply <code>λx.y</code> (a function that ignores its argument) to Ω:</p>
            <div class="syntax-box"><code>(λx.y)((λx.x x)(λx.x x))</code></div>
            <p><strong>Reduce Ω first:</strong></p>
            <div class="step-trace">
              <div class="step"><code>(λx.y)((λx.x x)(λx.x x))</code></div>
              <div class="step step-reduce"><code>(λx.y)((λx.x x)(λx.x x))</code><span class="step-note">Ω → Ω — nothing changes</span></div>
              <div class="step step-reduce"><code>⋯</code><span class="step-note">loops forever</span></div>
            </div>
            <p><strong>Reduce the outer redex first:</strong></p>
            <div class="step-trace">
              <div class="step"><code>(λx.y)((λx.x x)(λx.x x))</code></div>
              <div class="step step-reduce"><code>y</code><span class="step-note">x doesn't appear in y — the entire argument is discarded</span></div>
            </div>
            <p>The strategy of always picking the <strong>leftmost outermost</strong> redex is called
            <strong>normal order</strong>. It evaluates the function before the argument —
            so if the function body ignores its input, that input never runs.</p>
            <div class="grammar-rule">
              <span class="g-label">Normal order</span>
              Always reduce the leftmost outermost redex first. This strategy
              is guaranteed to find the normal form whenever one exists.
            </div>
          `
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-nontermination-review",
          title: "Review: Non-termination",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "How many redexes?",
              expr: "λx.(λy.y) z",
              choices: ["0", "1", "2", "3"],
              answer: 1,
              explanation: "One — inside the body: (λy.y) z. The outer λx is an abstraction, not an application, so it's not part of a redex."
            },
            {
              prompt: "How many redexes?",
              expr: "(λx.x)((λy.y)(λz.z))",
              choices: ["0", "1", "2", "3"],
              answer: 2,
              explanation: "Two: the outer (λx.x) applied to its argument, and the inner (λy.y)(λz.z)."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λf.f f)(λf.f f)",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 1,
              explanation: "This is Ω with f instead of x — same structure, same result. Reduces to itself forever."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λx.y)((λx.x x)(λx.x x))",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Normal form: y. Reducing the outer redex first discards Ω entirely — x doesn't appear in y."
            },
            {
              prompt: "Normal form or infinite loop?",
              expr: "(λx.x)(λx.x x)(λx.x x)",
              choices: ["Has a normal form", "Loops forever"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Left-associative: (λx.x)(λx.x x)(λx.x x) parses as ((λx.x)(λx.x x))(λx.x x). The identity (λx.x) applied to (λx.x x) returns (λx.x x) unchanged — so the whole expression becomes (λx.x x)(λx.x x), which is Ω. Loops forever."
            },
            {
              prompt: "Reduce to normal form (normal order):",
              expr: "(λx.λy.y) a b",
              choices: ["b", "a", "y", "λy.y"],
              answer: 0,
              explanation: "Step 1: (λx.λy.y) a → λy.y (a is discarded, x not in body). Step 2: (λy.y) b → b."
            },
            {
              prompt: "Which of these has no normal form?",
              choices: [
                "(λx.x x)(λx.x x)",
                "(λx.x)(λy.y)",
                "(λx.y)((λx.x x)(λx.x x))",
                "(λx.λy.x) a b"
              ],
              answer: 0,
              explanation: "Only Ω = (λx.x x)(λx.x x) loops forever. The others all terminate: identity◦identity = λy.y; (λx.y)(Ω) = y; K a b = a."
            },
          ]
        }

      ]
    },

    // ── Lesson 4: Alpha Conversion ──────────────────────────────────────────
    {
      id: "lesson-04",
      title: "Lesson 4: Alpha Conversion",
      description: "Rename bound variables safely — and avoid the variable capture trap",
      completionText: "You now have the complete reduction toolkit: beta reduction, awareness of non-termination, and alpha conversion to keep substitution honest. Next up: putting it all to work by encoding real values as pure functions.",

      blocks: [

        // ── Concept: Bound and Free Variables ──────────────────────────────
        {
          type: "concept",
          id: "bound-free",
          title: "Bound and Free Variables",
          content: `
            <p>Every variable in a lambda expression is either <strong>bound</strong>
            or <strong>free</strong>.</p>
            <p>A variable is <strong>bound</strong> if a surrounding λ introduces it as
            a parameter. It's <strong>free</strong> if no surrounding λ does.</p>
            <div class="ex-table">
              <div class="ex-row"><code>λx.x y</code><span><code>x</code> is bound (by λx) &nbsp;·&nbsp; <code>y</code> is free</span></div>
              <div class="ex-row"><code>λx.λy.x y</code><span>both <code>x</code> and <code>y</code> are bound</span></div>
              <div class="ex-row"><code>z (λx.x)</code><span><code>z</code> is free &nbsp;·&nbsp; <code>x</code> is bound inside the abstraction</span></div>
            </div>
            <p>Bound variables are pure placeholders — like parameter names in a function definition, they only matter inside the abstraction that introduces them. Rename them and nothing changes: <code>λx.x</code> and <code>λy.y</code>
            are the exact same function.</p>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              A variable is bound <em>within</em> the abstraction that introduces it.
              Outside that scope, the same letter can mean something else entirely.
            </div>
          `
        },

        // ── Exercise: Bound or Free ─────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-bound-free",
          title: "Quick Check: Bound or Free?",
          instruction: "Is the named variable free or bound in each expression?",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Is y free or bound?",
              expr: "λx.x y",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Free — no λ in this expression introduces y. It comes from outside."
            },
            {
              prompt: "Is f free or bound?",
              expr: "λf.f a",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Bound — λf introduces f as the parameter. Inside this abstraction, f is just a placeholder name."
            },
            {
              prompt: "Is z free or bound?",
              expr: "λx.λy.y z",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Free — neither λx nor λy introduces z. It's a free variable in this expression."
            },
            {
              prompt: "Is y free or bound?",
              expr: "λy.(λx.x) y",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Bound — the outer λy introduces y. Even though y appears as an argument to an inner application, it's still in the scope of λy."
            },
          ]
        },

        // ── Concept: Variable Capture ───────────────────────────────────────
        {
          type: "concept",
          id: "capture",
          title: "The Variable Capture Problem",
          content: `
            <p>Here's where naive beta reduction breaks down. Consider applying
            the K combinator to <code>y</code>:</p>
            <div class="syntax-box"><code>(λx.λy.x) y</code></div>
            <p><code>λx.λy.x</code> takes two arguments and returns the first.
            Applied to <code>y</code>, it should return a function that
            always gives back <code>y</code> — something like <code>λz.y</code>.</p>
            <p><strong>Naive beta reduction</strong> — substitute <code>y</code>
            for <code>x</code> in <code>λz.x</code>:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.λy.x) y</code></div>
              <div class="step step-reduce"><code>λy.y</code><span class="step-note">❌ wrong — this is the identity function</span></div>
            </div>
            <p>The argument contained a free variable named <code>y</code>. The function body also had a bound variable named <code>y</code> — but they are completely different variables that happen to share a name. Naive substitution didn't notice the collision and incorrectly merged them.</p>
            <p>This is called <strong>variable capture</strong>.</p>
            <div class="grammar-rule">
              <span class="g-label">Variable capture</span>
              Capture occurs when a free variable in the argument shares a name
              with a bound variable in the function body. Naive substitution
              incorrectly merges them, changing the expression's meaning.
            </div>
          `
        },

        // ── Concept: Alpha Conversion ───────────────────────────────────────
        {
          type: "concept",
          id: "alpha",
          title: "Alpha Conversion",
          content: `
            <p>The fix is to rename the conflicting bound variable <em>before</em>
            substituting. This is called <strong>alpha conversion</strong>.</p>
            <div class="syntax-box"><code>λx.M  =α  λy.M[x := y]</code></div>
            <p>You can rename any bound variable to any fresh name — one that doesn't
            already appear free in the body — without changing the function's meaning.</p>
            <p>Applied to the capture problem:</p>
            <div class="step-trace">
              <div class="step"><code>(λx.λy.x) y</code></div>
              <div class="step step-reduce"><code>(λx.λz.x) y</code><span class="step-note">α — rename bound y to z (z is fresh)</span></div>
              <div class="step step-reduce"><code>λz.y</code><span class="step-note">β — substitute y for x in λz.x</span></div>
            </div>
            <p>Now the result is <code>λz.y</code> — a function that ignores its
            argument and always returns <code>y</code>. Correct.</p>
            <p>Two expressions that differ only in the names of their bound variables
            are <strong>alpha-equivalent</strong> — they are the same function:</p>
            <div class="ex-table">
              <div class="ex-row"><code>λx.x</code><span>=α &nbsp;<code>λy.y</code> &nbsp;=α &nbsp;<code>λz.z</code></span></div>
              <div class="ex-row"><code>λx.λy.x y</code><span>=α &nbsp;<code>λa.λb.a b</code></span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Rule</span>
              Before beta-reducing, check whether any free variable in the argument
              shares a name with a bound variable in the body. If so, rename the
              bound variable to something fresh first.
            </div>
          `
        },

        // ── Exercise: Alpha Conversion ──────────────────────────────────────
        {
          type: "exercise",
          id: "ex-alpha",
          title: "Quick Check: Alpha Conversion",
          instruction: "Apply alpha conversion and beta reduction correctly.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Correct result of reducing (alpha-rename first if needed):",
              expr: "(λx.λy.x) y",
              choices: ["λz.y", "λy.y", "λz.x", "y"],
              answer: 0,
              explanation: "Naive substitution gives λy.y — wrong, y was captured. Alpha-rename the inner λy to λz first: (λx.λz.x) y → λz.y. A function that ignores its argument and always returns y."
            },
            {
              prompt: "Which correctly renames x to z in:",
              expr: "λx.x y",
              choices: ["λz.z y", "λz.x y", "λy.y y", "λz.z z"],
              answer: 0,
              explanation: "Replace every x in the body with z: x y → z y, giving λz.z y. The second option forgets to replace x. The third uses y, which is already free — that would cause capture. The fourth also renamed y."
            },
            {
              prompt: "Which is NOT a valid alpha conversion of:",
              expr: "λx.x",
              choices: ["λy.x", "λy.y", "λz.z", "λa.a"],
              answer: 0,
              explanation: "λy.x renamed the binder to y but left x unchanged in the body — it's now a free variable with a different meaning. A valid rename must update both the binder and every occurrence in the body."
            },
            {
              prompt: "Correct result of reducing (alpha-rename first if needed):",
              expr: "(λy.λx.y) x",
              choices: ["λz.x", "λx.x", "λz.y", "x"],
              answer: 0,
              explanation: "Naive substitution of x for y in λx.y gives λx.x (identity — wrong, x was captured). Alpha-rename the inner λx to λz: (λy.λz.y) x → λz.x. A function that always returns x."
            },
          ]
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-alpha-review",
          title: "Review: Alpha Conversion",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Is y free or bound?",
              expr: "λx.λy.y z",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 1,
              explanation: "Bound — the inner λy introduces y. Even though z is free here, y itself is bound within the inner abstraction."
            },
            {
              prompt: "Is z free or bound?",
              expr: "λx.λy.y z",
              choices: ["Free", "Bound"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Free — no λ in this expression introduces z."
            },
            {
              prompt: "Are these the same function?",
              expr: "λx.x    and    λy.y",
              choices: ["Yes — alpha-equivalent", "No — different functions"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Yes — alpha-equivalent. Bound variable names are just placeholders. λx.x and λy.y both represent the identity function."
            },
            {
              prompt: "Correct result of reducing (alpha-rename first if needed):",
              expr: "(λa.λb.a) b",
              choices: ["λz.b", "λb.b", "λz.a", "b"],
              answer: 0,
              explanation: "Naive substitution of b for a in λb.a gives λb.b (identity — wrong, b was captured). Alpha-rename: (λa.λz.a) b → λz.b. A function that always returns b."
            },
            {
              prompt: "Which correctly renames y to z in:",
              expr: "λy.y x",
              choices: ["λz.z x", "λz.y x", "λx.x x", "λz.z z"],
              answer: 0,
              explanation: "Replace every y in the body with z: y x → z x, giving λz.z x. The second forgets to replace y. The third uses x, which is already free. The fourth also renamed x."
            },
            {
              prompt: "What does NAIVE (incorrect) beta reduction of (λx.λy.x) y produce?",
              choices: ["λy.y", "λz.y", "λz.x", "y"],
              answer: 0,
              explanation: "Naive substitution replaces x with y in λy.x, giving λy.y — the identity function. This is wrong: the free y in the argument was captured by the bound λy in the body."
            },
          ]
        }

      ]
    },

    // ── Lesson 5: Booleans ──────────────────────────────────────────────────────
    {
      id: "lesson-05",
      title: "Lesson 5: Booleans",
      description: "One way to encode true and false as pure functions — and build logic out of nothing but λ",
      completionText: "You've seen one way to encode truth values and logical operations as pure lambda expressions. Next up: Church numerals — one way to encode the natural numbers.",

      blocks: [

        // ── Concept: Church Booleans ────────────────────────────────────────
        {
          type: "concept",
          id: "bool-intro",
          title: "Church Booleans",
          content: `
            <p>Lambda calculus has no built-in booleans. One way to encode them is as functions
            that choose between two alternatives:</p>
            <div class="ex-table">
              <div class="ex-row"><code>TRUE  =  λx.λy.x</code><span>returns the <em>first</em> argument</span></div>
              <div class="ex-row"><code>FALSE  =  λx.λy.y</code><span>returns the <em>second</em> argument</span></div>
            </div>
            <p>The idea behind this encoding: a boolean's only job is to choose between two things.
            So we encode TRUE and FALSE as functions that do exactly that — pick one of two arguments.
            This means <strong>if-then-else needs no special syntax</strong> — it is just application.
            Writing <code>b M N</code> applies the boolean <code>b</code> to two branches and gets back the one it selects:</p>
            <div class="step-trace">
              <div class="step"><code>TRUE a b</code></div>
              <div class="step step-reduce"><code>(λx.λy.x) a b</code><span class="step-note">expand TRUE</span></div>
              <div class="step step-reduce"><code>(λy.a) b</code></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">TRUE picks the first argument</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>FALSE a b</code></div>
              <div class="step step-reduce"><code>(λx.λy.y) a b</code><span class="step-note">expand FALSE</span></div>
              <div class="step step-reduce"><code>(λy.y) b</code></div>
              <div class="step step-reduce"><code>b</code><span class="step-note">FALSE picks the second argument</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              A boolean is a function that takes two arguments and returns one of them.
              TRUE returns the first; FALSE returns the second.
              <code>b M N</code> is if-then-else with no extra machinery.
            </div>
          `
        },

        // ── Exercise: Church Booleans ───────────────────────────────────────
        {
          type: "exercise",
          id: "ex-bool-basic",
          title: "Quick Check: TRUE and FALSE",
          instruction: "Use the definitions TRUE = λx.λy.x and FALSE = λx.λy.y.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal form of:",
              expr: "TRUE f g",
              choices: ["f", "g", "f g", "λy.f"],
              answer: 0,
              explanation: "TRUE = λx.λy.x picks the first argument. TRUE f g → (λy.f) g → f."
            },
            {
              prompt: "Normal form of:",
              expr: "FALSE f g",
              choices: ["g", "f", "f g", "λy.g"],
              answer: 0,
              explanation: "FALSE = λx.λy.y picks the second argument. FALSE f g → (λy.y) g → g."
            },
            {
              prompt: "Which expression is FALSE?",
              choices: ["λx.λy.y", "λx.λy.x", "λx.x", "λx.y"],
              answer: 0,
              explanation: "FALSE = λx.λy.y — it ignores the first argument and returns the second."
            },
            {
              prompt: "Normal form of:",
              expr: "TRUE (FALSE a b) c",
              choices: ["b", "a", "c", "FALSE a b"],
              answer: 0,
              explanation: "TRUE picks its first argument: (FALSE a b). Then FALSE picks the second of a and b: b."
            },
          ]
        },

        // ── Concept: NOT ────────────────────────────────────────────────────
        {
          type: "concept",
          id: "bool-not",
          title: "NOT",
          content: `
            <p>To negate a boolean <code>b</code>, apply it to FALSE and TRUE — in that order.
            If <code>b</code> is TRUE it selects the first (FALSE); if FALSE it selects the second (TRUE):</p>
            <div class="syntax-box"><code>NOT  =  λb.b FALSE TRUE</code></div>
            <div class="step-trace">
              <div class="step"><code>NOT TRUE</code></div>
              <div class="step step-reduce"><code>TRUE FALSE TRUE</code><span class="step-note">substitute TRUE for b</span></div>
              <div class="step step-reduce"><code>FALSE</code><span class="step-note">TRUE picks its first argument</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>NOT FALSE</code></div>
              <div class="step step-reduce"><code>FALSE FALSE TRUE</code><span class="step-note">substitute FALSE for b</span></div>
              <div class="step step-reduce"><code>TRUE</code><span class="step-note">FALSE picks its second argument</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Pattern</span>
              Boolean operations work by passing the right arguments to the boolean itself —
              the boolean's own selector behavior does all the work.
            </div>
          `
        },

        // ── Exercise: NOT ───────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-bool-not",
          title: "Quick Check: NOT",
          instruction: "Use NOT = λb.b FALSE TRUE, TRUE = λx.λy.x, FALSE = λx.λy.y.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal form of:",
              expr: "NOT FALSE",
              choices: ["TRUE", "FALSE", "NOT", "FALSE TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NOT FALSE → FALSE FALSE TRUE → TRUE. FALSE picks its second argument: TRUE."
            },
            {
              prompt: "One step of:",
              expr: "NOT TRUE",
              choices: ["TRUE FALSE TRUE", "FALSE TRUE", "TRUE FALSE", "FALSE"],
              answer: 0,
              explanation: "Substitute TRUE for b in b FALSE TRUE: TRUE FALSE TRUE. Then TRUE picks first, giving FALSE."
            },
            {
              prompt: "Normal form of:",
              expr: "NOT (NOT TRUE)",
              choices: ["TRUE", "FALSE", "NOT TRUE", "NOT FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NOT TRUE → FALSE. NOT FALSE → TRUE. Double negation returns the original value."
            },
            {
              prompt: "Which correctly defines NOT?",
              choices: ["λb.b FALSE TRUE", "λb.b TRUE FALSE", "λb.FALSE TRUE", "λb.b"],
              answer: 0,
              explanation: "λb.b FALSE TRUE: apply b to FALSE and TRUE so that TRUE selects FALSE and FALSE selects TRUE. Swapping the arguments would invert the logic."
            },
          ]
        },

        // ── Concept: AND and OR ─────────────────────────────────────────────
        {
          type: "concept",
          id: "bool-and-or",
          title: "AND and OR",
          content: `
            <p>The same pattern extends to binary operations.
            Apply the first boolean to the "if true" and "if false" branches:</p>
            <div class="ex-table">
              <div class="ex-row"><code>AND  =  λb.λc.b c FALSE</code><span>if b then c else FALSE</span></div>
              <div class="ex-row"><code>OR   =  λb.λc.b TRUE c</code><span>if b then TRUE else c</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>AND TRUE FALSE</code></div>
              <div class="step step-reduce"><code>(λc.TRUE c FALSE) FALSE</code><span class="step-note">substitute TRUE for b</span></div>
              <div class="step step-reduce"><code>TRUE FALSE FALSE</code><span class="step-note">substitute FALSE for c</span></div>
              <div class="step step-reduce"><code>FALSE</code><span class="step-note">TRUE picks first: FALSE</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>AND FALSE TRUE</code></div>
              <div class="step step-reduce"><code>(λc.FALSE c FALSE) TRUE</code><span class="step-note">substitute FALSE for b</span></div>
              <div class="step step-reduce"><code>FALSE TRUE FALSE</code><span class="step-note">substitute TRUE for c</span></div>
              <div class="step step-reduce"><code>FALSE</code><span class="step-note">FALSE picks second: FALSE</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>OR FALSE TRUE</code></div>
              <div class="step step-reduce"><code>(λc.FALSE TRUE c) TRUE</code><span class="step-note">substitute FALSE for b</span></div>
              <div class="step step-reduce"><code>FALSE TRUE TRUE</code><span class="step-note">substitute TRUE for c</span></div>
              <div class="step step-reduce"><code>TRUE</code><span class="step-note">FALSE picks second: TRUE</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              AND and OR don't inspect their arguments directly —
              they let the boolean's own selector behavior determine the result.
            </div>
          `
        },

        // ── Exercise: Write It Yourself ─────────────────────────────────────
        {
          type: "exercise",
          id: "ex-write-booleans",
          title: "Write It Yourself",
          instruction: "Now write the expressions — type \\ to get λ. Your answer is checked by reducing it, so any equivalent expression counts.",
          kind: "write-expression",
          items: [
            {
              prompt: "Write TRUE as a raw lambda expression — no names, just λ, variables, and parentheses.",
              answer: "λx.λy.x",
              check: "alpha",
              explanation: "TRUE = λx.λy.x — take two arguments, return the first. Any variable names work: λa.λb.a is the same expression."
            },
            {
              prompt: "Using the names you've learned (NOT, AND, OR, TRUE, FALSE), write an expression that reduces to FALSE — without writing FALSE itself.",
              answer: "NOT TRUE",
              check: "beta",
              explanation: "NOT TRUE → TRUE FALSE TRUE → FALSE is the shortest route, but anything that reduces to λx.λy.y counts."
            },
            {
              prompt: "Write XOR — a function of two booleans that gives TRUE exactly when they differ. It's checked by applying it to all four input pairs.",
              answer: "λb.λc.b (NOT c) c",
              tests: [
                { args: ["TRUE", "TRUE"],   expect: "FALSE" },
                { args: ["TRUE", "FALSE"],  expect: "TRUE" },
                { args: ["FALSE", "TRUE"],  expect: "TRUE" },
                { args: ["FALSE", "FALSE"], expect: "FALSE" },
              ],
              explanation: "One way: λb.λc.b (NOT c) c — if b is TRUE the answer is NOT c; if b is FALSE the answer is c itself. Any implementation passing all four cases is correct."
            },
          ]
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-bool-review",
          title: "Review: Booleans",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Normal form of:",
              expr: "AND TRUE TRUE",
              choices: ["TRUE", "FALSE", "TRUE TRUE", "AND TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "AND TRUE TRUE → TRUE TRUE FALSE → TRUE. TRUE picks its first argument: TRUE."
            },
            {
              prompt: "Normal form of:",
              expr: "AND FALSE TRUE",
              choices: ["FALSE", "TRUE", "FALSE TRUE", "AND FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "AND FALSE TRUE → FALSE TRUE FALSE → FALSE. FALSE picks its second argument: FALSE."
            },
            {
              prompt: "Normal form of:",
              expr: "OR TRUE FALSE",
              choices: ["TRUE", "FALSE", "OR TRUE", "TRUE FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "OR TRUE FALSE → TRUE TRUE FALSE → TRUE. TRUE picks its first argument: TRUE."
            },
            {
              prompt: "Normal form of:",
              expr: "OR FALSE FALSE",
              choices: ["FALSE", "TRUE", "OR FALSE", "FALSE FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "OR FALSE FALSE → FALSE TRUE FALSE → FALSE. FALSE picks its second argument: FALSE."
            },
            {
              prompt: "Normal form of:",
              expr: "NOT (AND TRUE FALSE)",
              choices: ["TRUE", "FALSE", "NOT FALSE", "NOT TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "AND TRUE FALSE → FALSE. NOT FALSE → TRUE."
            },
            {
              prompt: "Normal form of:",
              expr: "AND (OR FALSE TRUE) (NOT FALSE)",
              choices: ["TRUE", "FALSE", "OR FALSE TRUE", "NOT FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "OR FALSE TRUE → TRUE. NOT FALSE → TRUE. AND TRUE TRUE → TRUE."
            },
          ]
        }

      ]
    },

    // ── Lesson 6: Church Numerals ───────────────────────────────────────────────
    {
      id: "lesson-06",
      title: "Lesson 6: Church Numerals",
      description: "One way to encode the natural numbers as pure functions",
      completionText: "You've seen one way to encode the natural numbers — and arithmetic on them — as pure lambda expressions. Every numeral is just a pattern of function application, all the way down.",

      blocks: [

        // ── Concept: Church Numerals ────────────────────────────────────────
        {
          type: "concept",
          id: "numerals-intro",
          title: "Church Numerals",
          content: `
            <p>Lambda calculus has no built-in numbers. To encode them, we need a property that captures what a number fundamentally <em>is</em> — and counting is just repeated application: doing something once, twice, three times. So we encode the number <em>n</em> as a function that applies another function exactly <em>n</em> times.</p>
            <p>The numeral <strong>n</strong> takes a function <code>f</code> and a starting value <code>x</code>, and applies <code>f</code> to <code>x</code> exactly <em>n</em> times:</p>
            <div class="ex-table">
              <div class="ex-row"><code>0  =  λf.λx.x</code><span>apply f <em>zero</em> times — return x unchanged</span></div>
              <div class="ex-row"><code>1  =  λf.λx.f x</code><span>apply f <em>once</em></span></div>
              <div class="ex-row"><code>2  =  λf.λx.f (f x)</code><span>apply f <em>twice</em></span></div>
              <div class="ex-row"><code>3  =  λf.λx.f (f (f x))</code><span>apply f <em>three times</em></span></div>
            </div>
            <div class="callout-note">
              <span class="cn-label">Heads up</span>
              <span>You may notice that <code>0 = λf.λx.x</code> looks identical to <code>FALSE = λx.λy.y</code>
              from the last lesson — just with different variable names. That's not a mistake.
              Both expressions discard their first argument and return the second unchanged.
              In pure lambda calculus, a function <em>is</em> what it does; names are notation only.
              Two terms that behave identically are, in every meaningful sense, the same function.</span>
            </div>
            <p>The pattern is visual: each numeral wraps one more <code>f</code> around the previous body.
            Applying any numeral to concrete arguments makes this plain:</p>
            <div class="step-trace">
              <div class="step"><code>2 f x</code></div>
              <div class="step step-reduce"><code>(λf.λx.f (f x)) f x</code><span class="step-note">expand 2</span></div>
              <div class="step step-reduce"><code>(λx.f (f x)) x</code></div>
              <div class="step step-reduce"><code>f (f x)</code><span class="step-note">f applied twice</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              The numeral <em>n</em> <strong>is</strong> the act of applying a function n times.
              There is no separate notion of number — the repetition itself is the number.
            </div>
          `
        },

        // ── Exercise: Church Numerals ───────────────────────────────────────
        {
          type: "exercise",
          id: "ex-numerals-basic",
          title: "Quick Check: Church Numerals",
          instruction: "Use 0 = λf.λx.x, 1 = λf.λx.f x, 2 = λf.λx.f (f x), 3 = λf.λx.f (f (f x)).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which expression is 2?",
              choices: ["λf.λx.f (f x)", "λf.λx.f x", "λf.λx.f (f (f x))", "λf.λx.x"],
              answer: 0,
              explanation: "2 = λf.λx.f (f x) — f applied twice. λf.λx.f x is 1, λf.λx.f (f (f x)) is 3, and λf.λx.x is 0."
            },
            {
              prompt: "Normal form of:",
              expr: "1 f x",
              choices: ["f x", "x", "f (f x)", "f"],
              answer: 0,
              explanation: "1 = λf.λx.f x. Applying to f then x: (λx.f x) x → f x. One application of f."
            },
            {
              prompt: "Normal form of:",
              expr: "0 f x",
              choices: ["x", "f x", "f", "f x x"],
              answer: 0,
              explanation: "0 = λf.λx.x. Applying to f then x: (λx.x) x → x. Zero applications — f is discarded entirely."
            },
            {
              prompt: "How many times does 3 apply f to x?",
              choices: ["Three", "Zero", "Once", "Twice"],
              choicesAreCode: false,
              answer: 0,
              explanation: "3 = λf.λx.f (f (f x)): f applied to x, then to that result, then once more — three times total."
            },
          ]
        },

        // ── Concept: SUCC ───────────────────────────────────────────────────
        {
          type: "concept",
          id: "numerals-succ",
          title: "Successor",
          content: `
            <p>To produce the next numeral after <code>n</code>, apply <code>f</code>
            one more time than <code>n</code> does.
            <code>n f x</code> gives n applications; one more <code>f</code> on top gives n+1:</p>
            <div class="syntax-box"><code>SUCC  =  λn.λf.λx.f (n f x)</code></div>
            <div class="step-trace">
              <div class="step"><code>SUCC 1</code></div>
              <div class="step step-reduce"><code>λf.λx.f (1 f x)</code><span class="step-note">substitute 1 for n</span></div>
              <div class="step step-reduce"><code>λf.λx.f (f x)</code><span class="step-note">1 f x → f x</span></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>SUCC 2</code></div>
              <div class="step step-reduce"><code>λf.λx.f (2 f x)</code><span class="step-note">substitute 2 for n</span></div>
              <div class="step step-reduce"><code>λf.λx.f (f (f x))</code><span class="step-note">2 f x → f (f x)</span></div>
              <div class="step step-reduce"><code>3</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              SUCC doesn't count — it wraps. The outer <code>f</code> in
              <code>f (n f x)</code> is the one extra application that turns n into n+1.
            </div>
          `
        },

        // ── Exercise: SUCC ──────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-numerals-succ",
          title: "Quick Check: Successor",
          instruction: "Use SUCC = λn.λf.λx.f (n f x) and the numeral definitions from before.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Normal form of:",
              expr: "SUCC 0",
              choices: ["λf.λx.f x", "λf.λx.x", "λf.λx.f (f x)", "λf.λx.f"],
              answer: 0,
              explanation: "SUCC 0 → λf.λx.f (0 f x). 0 discards f and returns x, so 0 f x → x. Body becomes f x = 1."
            },
            {
              prompt: "Normal form of:",
              expr: "SUCC 2",
              choices: ["λf.λx.f (f (f x))", "λf.λx.f (f x)", "λf.λx.f x", "λf.λx.x"],
              answer: 0,
              explanation: "SUCC 2 → λf.λx.f (2 f x) → λf.λx.f (f (f x)) = 3. 2 f x → f (f x), so wrapping adds one more f."
            },
            {
              prompt: "Normal form of:",
              expr: "SUCC 1 f x",
              choices: ["f (f x)", "f x", "f (f (f x))", "x"],
              answer: 0,
              explanation: "SUCC 1 = 2. Applying 2 to f and x gives 2 f x → f (f x)."
            },
            {
              prompt: "Which correctly defines SUCC?",
              choices: ["λn.λf.λx.f (n f x)", "λn.λf.λx.n f x", "λn.λf.λx.f n x", "λn.λf.λx.n (f x)"],
              answer: 0,
              explanation: "λn.λf.λx.f (n f x): compute n f x (n applications), then apply f once more. The other forms either omit the extra f or pass arguments in the wrong order."
            },
          ]
        },

        // ── Concept: ADD and MULT ───────────────────────────────────────────
        {
          type: "concept",
          id: "numerals-add-mult",
          title: "ADD and MULT",
          content: `
            <p>Addition chains two runs of applications end to end: apply <code>f</code>
            n times to <code>x</code>, then apply <code>f</code> m more times to that result.
            Total: m+n applications.</p>
            <div class="syntax-box"><code>ADD  =  λm.λn.λf.λx.m f (n f x)</code></div>
            <div class="step-trace">
              <div class="step"><code>ADD 1 2</code></div>
              <div class="step step-reduce"><code>λf.λx.1 f (2 f x)</code><span class="step-note">substitute 1 for m, 2 for n</span></div>
              <div class="step step-reduce"><code>λf.λx.f (2 f x)</code><span class="step-note">1 f y → f y</span></div>
              <div class="step step-reduce"><code>λf.λx.f (f (f x))</code><span class="step-note">2 f x → f (f x)</span></div>
              <div class="step step-reduce"><code>3</code></div>
            </div>
            <p>Multiplication nests them: applying <code>f</code> n times is the function
            <code>n f</code>. Repeating <em>that</em> m times gives m×n total applications.</p>
            <div class="syntax-box"><code>MULT  =  λm.λn.λf.m (n f)</code></div>
            <div class="step-trace">
              <div class="step"><code>MULT 2 3</code></div>
              <div class="step step-reduce"><code>λf.2 (3 f)</code><span class="step-note">substitute 2 for m, 3 for n</span></div>
              <div class="step step-reduce"><code>λf.λx.(3 f) ((3 f) x)</code><span class="step-note">2 g x → g (g x), with g = 3 f</span></div>
              <div class="step step-reduce"><code>λf.λx.f (f (f (f (f (f x)))))</code><span class="step-note">each (3 f) applies f three times</span></div>
              <div class="step step-reduce"><code>6</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              ADD threads one run of applications into the start of another.
              MULT uses one numeral to control how many times the other's pattern repeats.
            </div>
          `
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-numerals-review",
          title: "Review: Church Numerals",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Normal form of:",
              expr: "ADD 0 2",
              choices: ["λf.λx.f (f x)", "λf.λx.x", "λf.λx.f x", "λf.λx.f (f (f x))"],
              answer: 0,
              explanation: "ADD 0 2 → λf.λx.0 f (2 f x) → λf.λx.2 f x → λf.λx.f (f x) = 2. 0 discards f and returns its argument unchanged, so adding zero is a no-op."
            },
            {
              prompt: "Normal form of:",
              expr: "ADD 1 1",
              choices: ["λf.λx.f (f x)", "λf.λx.f x", "λf.λx.f (f (f x))", "λf.λx.x"],
              answer: 0,
              explanation: "ADD 1 1 → λf.λx.1 f (1 f x) → λf.λx.f (f x) = 2."
            },
            {
              prompt: "Normal form of:",
              expr: "SUCC (SUCC 1)",
              choices: ["λf.λx.f (f (f x))", "λf.λx.f (f x)", "λf.λx.f x", "λf.λx.f (f (f (f x)))"],
              answer: 0,
              explanation: "SUCC 1 = 2. SUCC 2 = 3 = λf.λx.f (f (f x))."
            },
            {
              prompt: "Normal form of:",
              expr: "ADD 2 (SUCC 0)",
              choices: ["λf.λx.f (f (f x))", "λf.λx.f (f x)", "λf.λx.f x", "λf.λx.f (f (f (f x)))"],
              answer: 0,
              explanation: "SUCC 0 = 1. ADD 2 1 → λf.λx.f (f (f x)) = 3."
            },
            {
              prompt: "Normal form of:",
              expr: "MULT 2 2",
              choices: ["λf.λx.f (f (f (f x)))", "λf.λx.f (f x)", "λf.λx.f (f (f x))", "λf.λx.f x"],
              answer: 0,
              explanation: "MULT 2 2 → λf.2 (2 f) → λf.λx.f (f (f (f x))) = 4. Two runs of two applications each."
            },
            {
              prompt: "Normal form of:",
              expr: "MULT 1 3",
              choices: ["λf.λx.f (f (f x))", "λf.λx.f (f (f (f x)))", "λf.λx.f x", "λf.λx.x"],
              answer: 0,
              explanation: "MULT 1 3 → λf.1 (3 f) → λf.3 f → λf.λx.f (f (f x)) = 3. Multiplying by 1 leaves the numeral unchanged."
            },
          ]
        }

      ]
    },

    // ── Lesson 7: Testing Numbers ──────────────────────────────────────────────
    {
      id: "lesson-07",
      title: "Lesson 7: Testing Numbers",
      description: "Asking whether a Church numeral is zero, even, or odd — and seeing how predicates connect arithmetic back to booleans",
      completionText: "You can now test whether any Church numeral is zero, even, or odd, and branch on the result. The unifying idea: a numeral is a machine for applying a function n times — swap in a different function to ask a different question. Next up: pairs, the key ingredient for subtraction and equality.",

      blocks: [

        // ── Concept: ISZERO ─────────────────────────────────────────────────
        {
          type: "concept",
          id: "iszero-intro",
          title: "ISZERO",
          content: `
            <p>We have numerals. We have booleans. The natural next question:
            how do we test whether a numeral is zero?</p>
            <p>The trick: ask the numeral to do some work. If it does it, the answer is nonzero.
            If it does nothing, the answer is zero. Here's how to make that concrete:</p>
            <div class="syntax-box">ISZERO  =  λn.n (λx.FALSE) TRUE</div>
            <p>ISZERO feeds <code>n</code> a specific pair of arguments, exploiting the fact
            that a numeral is a function that applies <code>f</code> to <code>x</code>
            exactly n times:</p>
            <div class="ex-table">
              <div class="ex-row"><code>f  =  λx.FALSE</code><span>a constant function — ignores its argument, always returns FALSE</span></div>
              <div class="ex-row"><code>x  =  TRUE</code><span>the starting value</span></div>
            </div>
            <p>If <code>n = 0</code>, the function is never applied — TRUE comes back unchanged.
            If <code>n > 0</code>, the function fires at least once, converting the result to FALSE —
            and any further applications of the constant-FALSE function leave it FALSE.</p>
            <div class="step-trace">
              <div class="step"><code>ISZERO 0</code></div>
              <div class="step step-reduce"><code>0 (λx.FALSE) TRUE</code><span class="step-note">substitute n := 0</span></div>
              <div class="step step-reduce"><code>TRUE</code><span class="step-note">0 applies f zero times — TRUE is returned unchanged</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>ISZERO 1</code></div>
              <div class="step step-reduce"><code>1 (λx.FALSE) TRUE</code><span class="step-note">substitute n := 1</span></div>
              <div class="step step-reduce"><code>(λx.FALSE) TRUE</code><span class="step-note">1 applies f once</span></div>
              <div class="step step-reduce"><code>FALSE</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              ISZERO asks: does n apply its function zero times?
              If yes, the TRUE starting value survives. If no, the constant-FALSE function destroys it.
            </div>
          `
        },

        // ── Exercise: Quick Check ISZERO ────────────────────────────────────
        {
          type: "exercise",
          id: "ex-iszero-basic",
          title: "Quick Check: ISZERO",
          instruction: "Use ISZERO = λn.n (λx.FALSE) TRUE and the numerals from the last lesson.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "ISZERO 0",
              choices: ["TRUE", "FALSE", "0", "1"],
              choicesAreCode: false,
              answer: 0,
              explanation: "0 applies f zero times, so TRUE comes back unchanged. ISZERO 0 = TRUE."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO 3",
              choices: ["FALSE", "TRUE", "3", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "3 applies (λx.FALSE) three times starting from TRUE. After the first application the result is FALSE, and further applications leave it FALSE."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO (SUCC 0)",
              choices: ["FALSE", "TRUE", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUCC 0 = 1. 1 is nonzero, so ISZERO 1 = FALSE."
            },
            {
              prompt: "Which correctly defines ISZERO?",
              choices: ["λn.n (λx.FALSE) TRUE", "λn.n (λx.TRUE) FALSE", "λn.n FALSE TRUE", "λn.TRUE FALSE n"],
              answer: 0,
              explanation: "λn.n (λx.FALSE) TRUE: feed n the constant-FALSE function and TRUE as the starting value. Zero returns TRUE; any positive n drives it to FALSE."
            },
          ]
        },

        // ── Concept: EVEN and ODD ───────────────────────────────────────────
        {
          type: "concept",
          id: "even-odd-intro",
          title: "EVEN and ODD",
          content: `
            <p>ISZERO works by feeding a numeral a <em>constant</em> function as its stepper —
            one that ignores its argument and always returns FALSE. But the stepper can be anything.
            What if we use NOT instead?</p>
            <div class="syntax-box">EVEN  =  λn.n NOT TRUE</div>
            <div class="syntax-box">ODD   =  λn.n NOT FALSE</div>
            <p>NOT alternates: TRUE → FALSE → TRUE → FALSE...
            Starting from TRUE and flipping n times lands on TRUE for even n, FALSE for odd n.
            Starting from FALSE flips the pattern.</p>
            <div class="ex-table">
              <div class="ex-row"><code>EVEN 0</code><span>0 flips from TRUE → TRUE</span></div>
              <div class="ex-row"><code>EVEN 1</code><span>1 flip  from TRUE → FALSE</span></div>
              <div class="ex-row"><code>EVEN 2</code><span>2 flips from TRUE → TRUE</span></div>
              <div class="ex-row"><code>EVEN 3</code><span>3 flips from TRUE → FALSE</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>EVEN 2</code></div>
              <div class="step step-reduce"><code>2 NOT TRUE</code><span class="step-note">substitute n := 2</span></div>
              <div class="step step-reduce"><code>NOT (NOT TRUE)</code><span class="step-note">2 applies NOT twice</span></div>
              <div class="step step-reduce"><code>NOT FALSE</code></div>
              <div class="step step-reduce"><code>TRUE</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>ODD 3</code></div>
              <div class="step step-reduce"><code>3 NOT FALSE</code><span class="step-note">substitute n := 3</span></div>
              <div class="step step-reduce"><code>NOT (NOT (NOT FALSE))</code><span class="step-note">3 applies NOT three times</span></div>
              <div class="step step-reduce"><code>TRUE</code><span class="step-note">FALSE → TRUE → FALSE → TRUE</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              A numeral is a machine for applying a function n times.
              Swap in a different function and starting value to ask a different question about n.
            </div>
          `
        },

        // ── Exercise: Quick Check EVEN/ODD ──────────────────────────────────
        {
          type: "exercise",
          id: "ex-even-odd-basic",
          title: "Quick Check: EVEN and ODD",
          instruction: "Use EVEN = λn.n NOT TRUE and ODD = λn.n NOT FALSE.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "EVEN 0",
              choices: ["TRUE", "FALSE", "0", "NOT"],
              choicesAreCode: false,
              answer: 0,
              explanation: "0 applies NOT zero times — TRUE is returned unchanged. 0 is even, so EVEN 0 = TRUE."
            },
            {
              prompt: "Result of:",
              expr: "EVEN 3",
              choices: ["FALSE", "TRUE", "3", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "3 applies NOT three times starting from TRUE: TRUE → FALSE → TRUE → FALSE. EVEN 3 = FALSE."
            },
            {
              prompt: "Result of:",
              expr: "ODD 2",
              choices: ["FALSE", "TRUE", "2", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "2 applies NOT twice starting from FALSE: FALSE → TRUE → FALSE. ODD 2 = FALSE."
            },
            {
              prompt: "Which correctly defines EVEN?",
              choices: ["λn.n NOT TRUE", "λn.n NOT FALSE", "λn.n (λx.FALSE) TRUE", "λn.NOT n"],
              answer: 0,
              explanation: "λn.n NOT TRUE: apply NOT n times starting from TRUE. Even counts of flips return to TRUE; odd counts land on FALSE."
            },
          ]
        },

        // ── Concept: Branching on numbers ───────────────────────────────────
        {
          type: "concept",
          id: "iszero-branching",
          title: "Branching on Numbers",
          content: `
            <p>Because ISZERO returns a Church boolean, it plugs directly into the
            if-then-else pattern from Lesson 5. Recall that <code>b M N</code> selects
            <code>M</code> when b is TRUE and <code>N</code> when b is FALSE:</p>
            <div class="step-trace">
              <div class="step"><code>ISZERO 0 M N</code></div>
              <div class="step step-reduce"><code>TRUE M N</code><span class="step-note">ISZERO 0 = TRUE</span></div>
              <div class="step step-reduce"><code>M</code><span class="step-note">TRUE selects its first argument</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>ISZERO 1 M N</code></div>
              <div class="step step-reduce"><code>FALSE M N</code><span class="step-note">ISZERO 1 = FALSE</span></div>
              <div class="step step-reduce"><code>N</code><span class="step-note">FALSE selects its second argument</span></div>
            </div>
            <p>The same pattern holds for EVEN and ODD — any predicate that returns a Church boolean
            can immediately serve as the condition in an if-then-else. Booleans and numerals were
            encoded independently, yet they compose without friction.</p>
            <div class="callout-note">
              <span class="cn-label">What's next</span>
              <span>We can test for zero, parity, and branch on the result — but we cannot yet ask
              whether two numbers are <em>equal</em> or one is <em>less than</em> another.
              Those comparisons need subtraction, which needs a new tool first: pairs.</span>
            </div>
          `
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-iszero-review",
          title: "Review: Testing Numbers",
          instruction: "Use ISZERO, EVEN, ODD, ADD, SUCC, NOT, and the Church booleans from previous lessons.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "ISZERO (ADD 0 0)",
              choices: ["TRUE", "FALSE", "0", "ADD"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ADD 0 0 = 0. ISZERO 0 = TRUE."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO (ADD 1 0)",
              choices: ["FALSE", "TRUE", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ADD 1 0 = 1. ISZERO 1 = FALSE."
            },
            {
              prompt: "Result of:",
              expr: "NOT (ISZERO 0)",
              choices: ["FALSE", "TRUE", "0", "NOT"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 0 = TRUE. NOT TRUE = FALSE."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO 0 TRUE FALSE",
              choices: ["TRUE", "FALSE", "0", "1"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 0 = TRUE. TRUE TRUE FALSE = TRUE — the first branch is selected."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO 1 TRUE FALSE",
              choices: ["FALSE", "TRUE", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 1 = FALSE. FALSE TRUE FALSE = FALSE — the second branch is selected."
            },
            {
              prompt: "Normal form of ISZERO 2:",
              choices: ["λx.λy.y", "λx.λy.x", "λf.λx.x", "λf.λx.f x"],
              answer: 0,
              explanation: "ISZERO 2 = FALSE = λx.λy.y. Any positive numeral drives the result to FALSE."
            },
            {
              prompt: "Result of:",
              expr: "EVEN (ADD 1 1)",
              choices: ["TRUE", "FALSE", "2", "ODD"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ADD 1 1 = 2. EVEN 2: two flips of NOT from TRUE → FALSE → TRUE. EVEN 2 = TRUE."
            },
            {
              prompt: "Result of:",
              expr: "ODD (SUCC 2)",
              choices: ["TRUE", "FALSE", "3", "EVEN"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUCC 2 = 3. ODD 3: three flips of NOT from FALSE → TRUE → FALSE → TRUE. ODD 3 = TRUE."
            },
          ]
        }

      ]
    },

    // ── Lesson 8: Pairs ────────────────────────────────────────────────────────
    {
      id: "lesson-08",
      title: "Lesson 8: Pairs",
      description: "Storing two values in a single function — and the sliding window that makes subtraction possible",
      completionText: "Pairs let you carry two pieces of information through a computation as one unit. The sliding window trick you saw here is the exact mechanism that unlocks the predecessor function — coming next.",

      blocks: [

        // ── Concept: PAIR, FST, SND ─────────────────────────────────────────
        {
          type: "concept",
          id: "pairs-intro",
          title: "PAIR, FST, and SND",
          content: `
            <p>Everything so far handles one value at a time — one number, one boolean.
            But some computations need to carry two values together, like tracking both a current
            value and the one before it. Church pairs do this with a single function.</p>
            <p>A Church pair stores two values inside a function. To retrieve a value, you apply
            the pair to a <em>selector</em> — a function that picks one of the two components.</p>
            <div class="syntax-box">PAIR  =  λx.λy.λf.f x y</div>
            <div class="syntax-box">FST   =  λp.p TRUE</div>
            <div class="syntax-box">SND   =  λp.p FALSE</div>
            <p>The selectors are exactly the Church booleans from Lesson 5. TRUE picks its first
            argument; FALSE picks its second. The connection is not a coincidence — it is why
            those encodings were chosen.</p>
            <div class="step-trace">
              <div class="step"><code>FST (PAIR a b)</code></div>
              <div class="step step-reduce"><code>(PAIR a b) TRUE</code><span class="step-note">FST applies TRUE as selector</span></div>
              <div class="step step-reduce"><code>TRUE a b</code><span class="step-note">PAIR feeds a and b to TRUE</span></div>
              <div class="step step-reduce"><code>a</code><span class="step-note">TRUE selects its first argument</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>SND (PAIR a b)</code></div>
              <div class="step step-reduce"><code>(PAIR a b) FALSE</code><span class="step-note">SND applies FALSE as selector</span></div>
              <div class="step step-reduce"><code>FALSE a b</code><span class="step-note">PAIR feeds a and b to FALSE</span></div>
              <div class="step step-reduce"><code>b</code><span class="step-note">FALSE selects its second argument</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              A pair is a suspended application — it holds x and y in waiting until a selector
              tells it which to return. TRUE and FALSE are the perfect selectors because that
              is precisely what they already do.
            </div>
          `
        },

        // ── Exercise: Quick Check Pairs ─────────────────────────────────────
        {
          type: "exercise",
          id: "ex-pairs-basic",
          title: "Quick Check: Pairs",
          instruction: "Use PAIR = λx.λy.λf.f x y, FST = λp.p TRUE, SND = λp.p FALSE.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "FST (PAIR 1 2)",
              choices: ["1", "2", "PAIR 1 2", "TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FST applies TRUE as the selector. TRUE 1 2 = 1."
            },
            {
              prompt: "Result of:",
              expr: "SND (PAIR 1 2)",
              choices: ["2", "1", "PAIR 1 2", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SND applies FALSE as the selector. FALSE 1 2 = 2."
            },
            {
              prompt: "Result of:",
              expr: "FST (PAIR FALSE TRUE)",
              choices: ["FALSE", "TRUE", "PAIR FALSE TRUE", "SND"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FST applies TRUE as selector. TRUE FALSE TRUE = FALSE — TRUE picks the first component."
            },
            {
              prompt: "Which correctly defines FST?",
              choices: ["λp.p TRUE", "λp.p FALSE", "λp.TRUE p", "λp.FALSE p"],
              answer: 0,
              explanation: "FST = λp.p TRUE: apply the pair to TRUE, which selects the first component."
            },
          ]
        },

        // ── Concept: The Sliding Window ─────────────────────────────────────
        {
          type: "concept",
          id: "pairs-shift",
          title: "The Sliding Window",
          content: `
            <p>Pairs become powerful when you use them to carry <em>state</em> across repeated
            applications. Consider a pair that tracks two consecutive numbers — and a function
            that advances it by one step:</p>
            <div class="syntax-box">SHIFT  =  λp.PAIR (SUCC (FST p)) (FST p)</div>
            <p>SHIFT takes a pair, increments the first component, and makes the old first
            the new second. Each step, the window slides forward by one — FST holds the current
            count, SND always trails one behind.</p>
            <div class="ex-table">
              <div class="ex-row"><code>PAIR 0 0</code><span>start</span></div>
              <div class="ex-row"><code>PAIR 1 0</code><span>after 1 SHIFT — FST=1, SND=0</span></div>
              <div class="ex-row"><code>PAIR 2 1</code><span>after 2 SHIFTs — FST=2, SND=1</span></div>
              <div class="ex-row"><code>PAIR 3 2</code><span>after 3 SHIFTs — FST=3, SND=2</span></div>
              <div class="ex-row"><code>PAIR n (n−1)</code><span>after n SHIFTs — SND is always one behind</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>SHIFT (PAIR 1 0)</code></div>
              <div class="step step-reduce"><code>PAIR (SUCC (FST (PAIR 1 0))) (FST (PAIR 1 0))</code><span class="step-note">expand SHIFT</span></div>
              <div class="step step-reduce"><code>PAIR (SUCC 1) 1</code><span class="step-note">FST (PAIR 1 0) = 1</span></div>
              <div class="step step-reduce"><code>PAIR 2 1</code></div>
            </div>
            <p>To apply SHIFT exactly n times starting from <code>PAIR 0 0</code>, hand it to the
            numeral n as its stepping function:</p>
            <div class="syntax-box">n SHIFT (PAIR 0 0)</div>
            <p>After n steps, the second component holds n−1. That is the predecessor of n —
            and building PRED from this is exactly what comes next.</p>
            <div class="callout-note">
              <span class="cn-label">Heads up</span>
              <span>The special case n = 0 gives <code>PAIR 0 0</code> unchanged, so
              <code>SND (0 SHIFT (PAIR 0 0)) = 0</code>. Church predecessor is defined to
              return 0 for 0 — there are no negative Church numerals.</span>
            </div>
          `
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-pairs-review",
          title: "Review: Pairs",
          instruction: "Use PAIR, FST, SND, SHIFT, and the numerals and booleans from previous lessons.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "SND (PAIR 0 1)",
              choices: ["1", "0", "2", "PAIR 0 1"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SND applies FALSE as selector. FALSE 0 1 = 1 — the second component."
            },
            {
              prompt: "Result of:",
              expr: "FST (PAIR TRUE FALSE)",
              choices: ["TRUE", "FALSE", "PAIR TRUE FALSE", "SND"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FST applies TRUE as selector. TRUE TRUE FALSE = TRUE — the first component."
            },
            {
              prompt: "Result of:",
              expr: "SND (PAIR FALSE TRUE)",
              choices: ["TRUE", "FALSE", "PAIR FALSE TRUE", "FST"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SND applies FALSE as selector. FALSE FALSE TRUE = TRUE — the second component."
            },
            {
              prompt: "Result of:",
              expr: "FST (SHIFT (PAIR 0 0))",
              choices: ["1", "0", "2", "PAIR 1 0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SHIFT (PAIR 0 0) = PAIR (SUCC 0) 0 = PAIR 1 0. FST (PAIR 1 0) = 1."
            },
            {
              prompt: "Result of:",
              expr: "SND (SHIFT (PAIR 1 0))",
              choices: ["1", "0", "2", "PAIR 2 1"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SHIFT (PAIR 1 0) = PAIR (SUCC 1) 1 = PAIR 2 1. SND (PAIR 2 1) = 1."
            },
            {
              prompt: "Which correctly defines SHIFT?",
              choices: [
                "λp.PAIR (SUCC (FST p)) (FST p)",
                "λp.PAIR (FST p) (SUCC (FST p))",
                "λp.PAIR (SUCC (SND p)) (SND p)",
                "λp.PAIR (SND p) (FST p)"
              ],
              answer: 0,
              explanation: "SHIFT increments the first component and copies the old first to second: PAIR (SUCC (FST p)) (FST p). This makes SND trail one step behind FST."
            },
          ]
        }

      ]
    },

    // ── Lesson 9: Predecessor & Subtraction ───────────────────────────────────
    {
      id: "lesson-09",
      title: "Lesson 9: Predecessor & Subtraction",
      description: "The predecessor function — built from the sliding window — and the subtraction, equality, and comparison operators it unlocks",
      completionText: "With PRED and SUB in hand, LEQ and EQ follow directly. You now have a complete arithmetic and comparison toolkit. The one thing still missing: a way to write functions that call themselves. That comes next.",

      blocks: [

        // ── Concept: PRED ───────────────────────────────────────────────────
        {
          type: "concept",
          id: "pred-intro",
          title: "Predecessor",
          content: `
            <p>In Lesson 8 you saw that applying SHIFT n times to <code>PAIR 0 0</code>
            produces <code>PAIR n (n−1)</code>. The second component is always one behind.
            PRED extracts it:</p>
            <div class="syntax-box">PRED  =  λn.SND (n SHIFT (PAIR 0 0))</div>
            <p>Hand the numeral n its stepping function (SHIFT) and its seed value
            (<code>PAIR 0 0</code>), then read the trailing component with SND.</p>
            <div class="step-trace">
              <div class="step"><code>PRED 3</code></div>
              <div class="step step-reduce"><code>SND (3 SHIFT (PAIR 0 0))</code><span class="step-note">expand PRED</span></div>
              <div class="step step-reduce"><code>SND (PAIR 3 2)</code><span class="step-note">3 SHIFTs: (0,0)→(1,0)→(2,1)→(3,2)</span></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>PRED 0</code></div>
              <div class="step step-reduce"><code>SND (0 SHIFT (PAIR 0 0))</code><span class="step-note">expand PRED</span></div>
              <div class="step step-reduce"><code>SND (PAIR 0 0)</code><span class="step-note">0 SHIFTs — pair is unchanged</span></div>
              <div class="step step-reduce"><code>0</code><span class="step-note">PRED 0 = 0 by convention</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              PRED threads n applications of SHIFT through a seed pair, then reads the
              trailing component. The numeral itself does all the work — PRED just sets up
              the right function and starting value.
            </div>
          `
        },

        // ── Exercise: Quick Check PRED ──────────────────────────────────────
        {
          type: "exercise",
          id: "ex-pred-basic",
          title: "Quick Check: Predecessor",
          instruction: "Use PRED = λn.SND (n SHIFT (PAIR 0 0)).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "PRED 1",
              choices: ["0", "1", "2", "PAIR 1 0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "1 SHIFT applied to PAIR 0 0 gives PAIR 1 0. SND (PAIR 1 0) = 0."
            },
            {
              prompt: "Result of:",
              expr: "PRED 3",
              choices: ["2", "3", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "3 SHIFTs from PAIR 0 0 give PAIR 3 2. SND (PAIR 3 2) = 2."
            },
            {
              prompt: "Result of:",
              expr: "PRED 0",
              choices: ["0", "1", "PAIR 0 0", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "0 SHIFTs leave PAIR 0 0 unchanged. SND (PAIR 0 0) = 0. PRED 0 = 0 by convention — there are no negative Church numerals."
            },
            {
              prompt: "Result of:",
              expr: "PRED (SUCC 2)",
              choices: ["2", "3", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUCC 2 = 3. PRED 3 = 2."
            },
          ]
        },

        // ── Concept: SUB, LEQ, EQ ───────────────────────────────────────────
        {
          type: "concept",
          id: "sub-leq-eq",
          title: "Subtraction, LEQ, and EQ",
          content: `
            <p>With PRED available, subtraction is just repeated predecessor —
            apply PRED n times to m:</p>
            <div class="syntax-box">SUB  =  λm.λn.n PRED m</div>
            <p>When n exceeds m, the result bottoms out at 0 — there are no negative
            Church numerals. This truncated subtraction (sometimes written m ∸ n) is
            still enough for comparison.</p>
            <div class="step-trace">
              <div class="step"><code>SUB 3 1</code></div>
              <div class="step step-reduce"><code>1 PRED 3</code><span class="step-note">apply PRED once to 3</span></div>
              <div class="step step-reduce"><code>PRED 3</code></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>SUB 1 3</code></div>
              <div class="step step-reduce"><code>3 PRED 1</code><span class="step-note">apply PRED three times to 1</span></div>
              <div class="step step-reduce"><code>PRED (PRED (PRED 1))</code></div>
              <div class="step step-reduce"><code>PRED (PRED 0)</code></div>
              <div class="step step-reduce"><code>0</code><span class="step-note">bottoms out — truncated to 0</span></div>
            </div>
            <p>Truncated subtraction is all we need for the comparisons promised back in
            Lesson 7. If <code>SUB m n = 0</code>, then m ≤ n:</p>
            <div class="syntax-box">LEQ  =  λm.λn.ISZERO (SUB m n)</div>
            <div class="syntax-box">EQ   =  λm.λn.AND (LEQ m n) (LEQ n m)</div>
            <p>m equals n when m ≤ n <em>and</em> n ≤ m — each side subtracts to zero,
            meaning neither exceeds the other.</p>
            <div class="step-trace">
              <div class="step"><code>LEQ 2 3</code></div>
              <div class="step step-reduce"><code>ISZERO (SUB 2 3)</code><span class="step-note">expand LEQ</span></div>
              <div class="step step-reduce"><code>ISZERO 0</code><span class="step-note">SUB 2 3 bottoms out at 0</span></div>
              <div class="step step-reduce"><code>TRUE</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>EQ 2 2</code></div>
              <div class="step step-reduce"><code>AND (LEQ 2 2) (LEQ 2 2)</code><span class="step-note">expand EQ</span></div>
              <div class="step step-reduce"><code>AND TRUE TRUE</code><span class="step-note">ISZERO (SUB 2 2) = ISZERO 0 = TRUE</span></div>
              <div class="step step-reduce"><code>TRUE</code></div>
            </div>
          `
        },

        // ── Exercise: Quick Check SUB / LEQ / EQ ────────────────────────────
        {
          type: "exercise",
          id: "ex-sub-leq-eq",
          title: "Quick Check: SUB, LEQ, and EQ",
          instruction: "Use SUB = λm.λn.n PRED m, LEQ = λm.λn.ISZERO (SUB m n), EQ = λm.λn.AND (LEQ m n) (LEQ n m).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "SUB 3 2",
              choices: ["1", "0", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Apply PRED twice to 3: PRED 3 = 2, PRED 2 = 1. SUB 3 2 = 1."
            },
            {
              prompt: "Result of:",
              expr: "SUB 1 3",
              choices: ["0", "1", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Apply PRED three times to 1: PRED 1 = 0, PRED 0 = 0, PRED 0 = 0. Truncated to 0."
            },
            {
              prompt: "Result of:",
              expr: "LEQ 2 3",
              choices: ["TRUE", "FALSE", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUB 2 3 = 0. ISZERO 0 = TRUE. 2 ≤ 3."
            },
            {
              prompt: "Result of:",
              expr: "EQ 2 2",
              choices: ["TRUE", "FALSE", "2", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "AND (LEQ 2 2) (LEQ 2 2) = AND (ISZERO 0) (ISZERO 0) = AND TRUE TRUE = TRUE."
            },
          ]
        },

        // ── Final Review ────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-pred-review",
          title: "Review: Predecessor & Subtraction",
          instruction: "Use PRED, SUB, LEQ, EQ, ISZERO, and the numerals and booleans from previous lessons.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "PRED 2",
              choices: ["1", "2", "0", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "2 SHIFTs from PAIR 0 0 give PAIR 2 1. SND (PAIR 2 1) = 1."
            },
            {
              prompt: "Result of:",
              expr: "SUB 3 3",
              choices: ["0", "1", "3", "2"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Apply PRED three times to 3: PRED 3 = 2, PRED 2 = 1, PRED 1 = 0. SUB 3 3 = 0."
            },
            {
              prompt: "Result of:",
              expr: "SUB 2 1",
              choices: ["1", "0", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Apply PRED once to 2: PRED 2 = 1. SUB 2 1 = 1."
            },
            {
              prompt: "Result of:",
              expr: "LEQ 3 3",
              choices: ["TRUE", "FALSE", "0", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUB 3 3 = 0. ISZERO 0 = TRUE. Any number is ≤ itself."
            },
            {
              prompt: "Result of:",
              expr: "EQ 1 2",
              choices: ["FALSE", "TRUE", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "LEQ 1 2 = TRUE, but LEQ 2 1 = ISZERO (SUB 2 1) = ISZERO 1 = FALSE. AND TRUE FALSE = FALSE."
            },
            {
              prompt: "Result of:",
              expr: "ISZERO (SUB 2 2)",
              choices: ["TRUE", "FALSE", "0", "2"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUB 2 2 = 0. ISZERO 0 = TRUE. This is exactly what LEQ 2 2 computes."
            },
          ]
        }

      ]
    },

    // ── Lesson 10: The Y Combinator ────────────────────────────────────────────
    {
      id: "lesson-10",
      title: "Lesson 10: The Y Combinator",
      description: "How to write recursive functions in a language with no names",
      completionText: "You can now express recursion in pure lambda calculus. Next up: we'll put Y to work immediately — division is just repeated subtraction, and the Y combinator is what lets you express that loop.",

      blocks: [

        // ── Concept: The Recursion Problem ──────────────────────────────────────
        {
          type: "concept",
          id: "recursion-problem",
          title: "The Recursion Problem",
          content: `
            <p>Every definition we've used — TRUE, FALSE, SUCC, ADD — is shorthand.
            Each name stands for a lambda expression you could paste in wholesale.
            But consider factorial:</p>
            <div class="syntax-box"><code>FACT  =  λn.ISZERO n 1 (MULT n (FACT (PRED n)))</code></div>
            <p>The body refers to <code>FACT</code> — but <code>FACT</code> is not a lambda expression.
            It's a name, and the lambda expression it stands for would need to contain itself.
            A finite expression cannot embed itself.</p>
            <p>This is not a technicality. In lambda calculus, the only things that exist
            are variables, abstractions, and applications. There is no global namespace,
            no <code>let rec</code>, no way for an expression to look itself up by name.</p>
            <div class="grammar-rule">
              <span class="g-label">The problem</span>
              Names like TRUE and SUCC are notational convenience — they vanish when
              you write out the actual lambda expressions. A recursive definition needs
              the function to refer to itself, but there is no self to refer to.
            </div>
          `
        },

        // ── Exercise: The Recursion Problem ─────────────────────────────────────
        {
          type: "exercise",
          id: "ex-rec-problem",
          title: "Quick Check: The Recursion Problem",
          instruction: "Check your understanding of why naive recursion fails in pure lambda calculus.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Why can't you define FACT = λn.ISZERO n 1 (MULT n (FACT (PRED n))) in pure lambda calculus?",
              choices: [
                "FACT is a name, not a lambda expression — the body can't refer to a name that would expand to an infinite expression",
                "ISZERO only works on booleans, not Church numerals",
                "PRED hasn't been defined at this point",
                "Lambda abstractions cannot contain more than one redex"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "FACT is shorthand. Fully expanded, the body would need to contain itself — an infinite, self-embedding expression. Names are notation only; they don't exist in the actual calculus."
            },
            {
              prompt: "TRUE = λx.λy.x is shorthand. What does that tell us?",
              choices: [
                "Every occurrence of TRUE can be replaced by λx.λy.x — names exist only for human readability",
                "TRUE is a primitive boolean value built into lambda calculus",
                "TRUE must be defined before any expression that uses it",
                "TRUE is a variable bound by some outer abstraction"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Shorthands expand away. TRUE has no separate existence in the calculus — it is just λx.λy.x written concisely. The same applies to every definition in this course."
            }
          ]
        },

        // ── Concept: The Self-Application Trick ─────────────────────────────────
        {
          type: "concept",
          id: "self-application",
          title: "The Self-Application Trick",
          content: `
            <p>The key insight: instead of a function referring to itself by name,
            it can <em>receive itself as an argument</em>.</p>
            <p>Add an extra parameter <code>self</code> that holds the function itself,
            and call <code>self self</code> wherever the recursive call would go:</p>
            <div class="syntax-box"><code>FACT_HELP  =  λself.λn.ISZERO n 1 (MULT n (self self (PRED n)))</code></div>
            <p>Applying it to itself gives factorial — no names required:</p>
            <div class="step-trace">
              <div class="step"><code>FACT_HELP FACT_HELP 2</code></div>
              <div class="step step-reduce"><code>ISZERO 2 1 (MULT 2 (FACT_HELP FACT_HELP (PRED 2)))</code><span class="step-note">substitute FACT_HELP for self, 2 for n</span></div>
              <div class="step step-reduce"><code>MULT 2 (FACT_HELP FACT_HELP 1)</code><span class="step-note">ISZERO 2 = FALSE — picks second branch</span></div>
              <div class="step step-reduce"><code>MULT 2 (MULT 1 (FACT_HELP FACT_HELP 0))</code><span class="step-note">recurse again</span></div>
              <div class="step step-reduce"><code>MULT 2 (MULT 1 1)</code><span class="step-note">ISZERO 0 = TRUE — base case returns 1</span></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <p>It works — but every recursive call must write <code>self self</code>
            rather than just <code>self</code>. The recursion mechanism is tangled
            into the function's logic. There is a cleaner way.</p>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              A function can receive itself as an argument and pass itself along at each
              recursive call. No names required — the self-reference travels through the parameter.
            </div>
          `
        },

        // ── Exercise: Self-Application ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-self-app",
          title: "Quick Check: Self-Application",
          instruction: "Use FACT_HELP = λself.λn.ISZERO n 1 (MULT n (self self (PRED n))).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "What does self self (PRED n) do inside the body of FACT_HELP?",
              choices: [
                "Passes FACT_HELP to itself again, continuing the recursion one step deeper",
                "Applies the identity function to PRED n",
                "Tests whether PRED n is zero",
                "Multiplies self by PRED n"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "self holds FACT_HELP. Calling self self threads FACT_HELP through to the next call — the same trick, one level deeper. This is how the self-reference propagates without using a name."
            },
            {
              prompt: "Result of:",
              expr: "FACT_HELP FACT_HELP 0",
              choices: ["1", "0", "FACT_HELP 0", "FALSE"],
              answer: 0,
              explanation: "ISZERO 0 = TRUE — the first branch fires and returns 1. self self (PRED 0) is never evaluated."
            },
            {
              prompt: "Result of:",
              expr: "FACT_HELP FACT_HELP 1",
              choices: ["1", "0", "2", "FACT_HELP 1"],
              answer: 0,
              explanation: "ISZERO 1 = FALSE → MULT 1 (FACT_HELP FACT_HELP 0) → MULT 1 1 → 1. 1! = 1."
            }
          ]
        },

        // ── Concept: Fixed Points and Y ──────────────────────────────────────────
        {
          type: "concept",
          id: "fixed-point-y",
          title: "Fixed Points and the Y Combinator",
          content: `
            <p>The self-application trick works, but <code>self self</code> leaks into
            every recursive function. We want to factor the recursion mechanism
            out entirely.</p>
            <p>A <strong>fixed point</strong> of a function F is a value v where
            <code>F v = v</code> — applying F to it gives you back the same thing.
            (A simple example: the identity function <code>λx.x</code> has every value as a fixed point.)
            For recursion, we want a combinator Y such that:</p>
            <div class="syntax-box"><code>Y F  =  F (Y F)</code></div>
            <p>If Y F is a fixed point of F, then applying F to it gives it back.
            Unrolling: <code>Y F = F (Y F) = F (F (Y F)) = F (F (F (Y F))) = …</code> —
            infinite self-application, which is exactly what recursion needs.</p>
            <p>Here is a lambda expression that delivers this property:</p>
            <div class="syntax-box"><code>Y  =  λf.(λx.f (x x))(λx.f (x x))</code></div>
            <p>Trace the reduction:</p>
            <div class="step-trace">
              <div class="step"><code>Y F</code></div>
              <div class="step step-reduce"><code>(λx.F (x x))(λx.F (x x))</code><span class="step-note">substitute F for f</span></div>
              <div class="step step-reduce"><code>F ((λx.F (x x))(λx.F (x x)))</code><span class="step-note">substitute (λx.F (x x)) for x</span></div>
              <div class="step step-reduce"><code>F (Y F)</code><span class="step-note">the bracketed piece is what Y F reduces to</span></div>
            </div>
            <p>The inner <code>λx.f (x x)</code> is the self-application trick —
            when applied to itself, it regenerates the whole structure.
            Y simply automates what FACT_HELP did manually with <code>self self</code>.</p>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Y does not compute a value — it creates a self-reproducing chain.
              Each time F consumes one layer, Y F rebuilds it.
            </div>
          `
        },

        // ── Exercise: Y Combinator ───────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-y-combinator",
          title: "Quick Check: The Y Combinator",
          instruction: "Use Y = λf.(λx.f (x x))(λx.f (x x)) and the property Y F = F (Y F).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Y F reduces to:",
              choices: ["F (Y F)", "Y (F F)", "F F", "Y Y"],
              answer: 0,
              explanation: "Y F = F (Y F). This is the fixed-point property: Y F is a fixed point of F."
            },
            {
              prompt: "What is a fixed point of F?",
              choices: [
                "A value v where F v = v",
                "A value v where F v = F",
                "A function that applies F twice",
                "The normal form of F"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A fixed point v satisfies F v = v. Since Y F = F (Y F), Y F is a fixed point of F."
            },
            {
              prompt: "Why does Y alone (applied to F with no base case) diverge?",
              choices: [
                "Y F = F (Y F) always produces a new Y F redex — it never reaches a normal form, just like Ω",
                "Y contains a free variable that prevents reduction",
                "Y is syntactically invalid without two arguments",
                "Y requires a Church numeral as its argument"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Without a base case, Y F → F (Y F) → F (F (Y F)) → … forever. A new redex is always reproduced. A base case in F is what makes it stop."
            },
            {
              prompt: "Which part of Y = λf.(λx.f (x x))(λx.f (x x)) is the self-application trick?",
              choices: [
                "λx.f (x x) — when applied to itself, x x regenerates the full structure",
                "λf — the outer binder that receives the function",
                "f (x x) — calling f directly on two arguments",
                "The entire expression at once"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "λx.f (x x) is the self-application template. When this term is applied to itself, x gets bound to it and x x reproduces the application — exactly what FACT_HELP did with self self."
            }
          ]
        },

        // ── Concept: Y in Action ─────────────────────────────────────────────────
        {
          type: "concept",
          id: "y-in-action",
          title: "Y in Action: Factorial",
          content: `
            <p>With Y, the recursion mechanism moves entirely out of the function logic.
            Write a clean <em>template</em> — a function that takes <code>rec</code> as
            a placeholder for the recursive call and leaves the self-reference to Y:</p>
            <div class="syntax-box"><code>FACT_STEP  =  λrec.λn.ISZERO n 1 (MULT n (rec (PRED n)))</code></div>
            <p>Compare to FACT_HELP: <code>rec</code> replaces <code>self self</code>.
            The function no longer knows <em>how</em> recursion works — it just calls <code>rec</code>.
            Y supplies the missing piece:</p>
            <div class="syntax-box"><code>FACT  =  Y FACT_STEP</code></div>
            <div class="step-trace">
              <div class="step"><code>FACT 2</code></div>
              <div class="step step-reduce"><code>Y FACT_STEP 2</code><span class="step-note">expand FACT</span></div>
              <div class="step step-reduce"><code>FACT_STEP (Y FACT_STEP) 2</code><span class="step-note">Y F = F (Y F)</span></div>
              <div class="step step-reduce"><code>FACT_STEP FACT 2</code><span class="step-note">Y FACT_STEP = FACT</span></div>
              <div class="step step-reduce"><code>ISZERO 2 1 (MULT 2 (FACT (PRED 2)))</code><span class="step-note">substitute into FACT_STEP body</span></div>
              <div class="step step-reduce"><code>MULT 2 (FACT 1)</code></div>
              <div class="step step-reduce"><code>MULT 2 (MULT 1 (FACT 0))</code></div>
              <div class="step step-reduce"><code>MULT 2 (MULT 1 1)</code><span class="step-note">ISZERO 0 = TRUE — base case returns 1</span></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              FACT_STEP holds the logic; Y handles the self-reference.
              Any recursive function can be written this way: define a step template
              that accepts rec, then apply Y to get the recursive version.
            </div>
          `
        },

        // ── Final Review ─────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-y-review",
          title: "Review: The Y Combinator",
          instruction: "A mix of questions from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Y F equals:",
              choices: ["F (Y F)", "F F", "Y (Y F)", "Y F F"],
              answer: 0,
              explanation: "Y F = F (Y F). This is the fixed-point property that makes recursion possible."
            },
            {
              prompt: "In FACT_STEP = λrec.λn.ISZERO n 1 (MULT n (rec (PRED n))), what does rec represent?",
              choices: [
                "The recursive call — FACT itself, supplied by Y",
                "A boolean that tests whether n is zero",
                "A shorthand for MULT n",
                "The predecessor of n"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Y supplies rec = Y FACT_STEP = FACT. Each time rec is called, Y F = F (Y F) rebuilds FACT one level deeper."
            },
            {
              prompt: "How does FACT 0 terminate?",
              choices: [
                "ISZERO 0 = TRUE — the base case returns 1 without ever calling rec",
                "Y produces a normal form when applied to the numeral 0",
                "PRED 0 = 0 causes the recursion to stabilize",
                "MULT 0 1 short-circuits to 0"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 0 = TRUE selects the first branch (1), ignoring the second entirely. rec is never called — the chain stops."
            },
            {
              prompt: "In FACT_HELP = λself.λn.ISZERO n 1 (MULT n (self self (PRED n))), self self plays the role of:",
              choices: [
                "The rec parameter that Y would otherwise supply",
                "The fixed-point combinator itself",
                "A pair holding self and n",
                "The ISZERO predicate"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "self self reproduces FACT_HELP applied to itself — the manual version of what Y does automatically via Y F = F (Y F)."
            },
            {
              prompt: "First step of:",
              expr: "Y FACT_STEP 3",
              choices: [
                "FACT_STEP (Y FACT_STEP) 3",
                "FACT_STEP FACT_STEP 3",
                "ISZERO 3 1 (MULT 3 (FACT_STEP (PRED 3)))",
                "Y (FACT_STEP 3)"
              ],
              answer: 0,
              explanation: "Y F → F (Y F), so Y FACT_STEP → FACT_STEP (Y FACT_STEP). Then the result is applied to 3."
            },
            {
              prompt: "Why is Y called a fixed-point combinator?",
              choices: [
                "Y F is a fixed point of F — applying F to Y F returns Y F",
                "Y converts any function into its normal form",
                "Y is the simplest lambda expression with no free variables",
                "Y reduces to the same expression regardless of its argument"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "F (Y F) = Y F by the fixed-point property. Y finds the value that F maps back to itself — and that self-replicating value is the recursive function."
            }
          ]
        }

      ]
    },

    // ── Lesson 11: Division ─────────────────────────────────────────────────────
    {
      id: "lesson-11",
      title: "Lesson 11: Division",
      description: "Using Y and truncated subtraction to build integer division and modulo",
      completionText: "You now have a complete arithmetic toolkit built from nothing but functions. DIV and MOD are the same recursive skeleton wearing different clothes — a pattern you'll keep seeing. Next up: lists, encoding sequences of values as functions built on the pair infrastructure you already know.",

      blocks: [

        // ── Concept: Division as Repeated Subtraction ────────────────────────────
        {
          type: "concept",
          id: "div-intro",
          title: "Division as Repeated Subtraction",
          content: `
            <p>Lesson 9 gave us <code>SUB</code> (truncated subtraction) and <code>LEQ</code>
            (less-than-or-equal). Lesson 10 gave us <code>Y</code> for recursion.
            Now we combine all three.</p>
            <p>Integer division asks: how many times can you subtract n from m
            before n is larger than what remains?</p>
            <div class="ex-table">
              <div class="ex-row"><code>6 ÷ 2</code><span>6−2=4 &nbsp;·&nbsp; 4−2=2 &nbsp;·&nbsp; 2−2=0 &nbsp;·&nbsp; 0&lt;2 &nbsp;&rarr;&nbsp; <strong>3</strong></span></div>
              <div class="ex-row"><code>5 ÷ 2</code><span>5−2=3 &nbsp;·&nbsp; 3−2=1 &nbsp;·&nbsp; 1&lt;2 &nbsp;&rarr;&nbsp; <strong>2</strong></span></div>
              <div class="ex-row"><code>1 ÷ 3</code><span>1&lt;3 immediately &nbsp;&rarr;&nbsp; <strong>0</strong></span></div>
            </div>
            <p>Each step: if the divisor n is still ≤ the current value m, subtract and
            count one more. When n &gt; m, stop. We already have everything we need:</p>
            <div class="ex-table">
              <div class="ex-row"><code>LEQ n m</code><span>is n ≤ m? — the condition to keep going</span></div>
              <div class="ex-row"><code>SUB m n</code><span>reduce m by n — the step</span></div>
              <div class="ex-row"><code>SUCC</code><span>count one more</span></div>
              <div class="ex-row"><code>Y</code><span>repeat until the base case fires</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Division can't be expressed without recursion — you don't know in advance
              how many subtractions are needed. That's exactly what Y is for.
            </div>
          `
        },

        // ── Exercise: Reasoning About Division ───────────────────────────────────
        {
          type: "exercise",
          id: "ex-div-reasoning",
          title: "Quick Check: Reasoning About Division",
          instruction: "Think through repeated subtraction before looking at the definition.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "How many times can you subtract 3 from 7 before the result is less than 3?",
              choices: ["2", "3", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "7−3=4, 4−3=1, 1<3 — two subtractions. So 7 ÷ 3 = 2 (integer division)."
            },
            {
              prompt: "What does integer division produce for 5 ÷ 5?",
              choices: ["1", "0", "5", "2"],
              choicesAreCode: false,
              answer: 0,
              explanation: "5−5=0, 0<5 — one subtraction. 5 ÷ 5 = 1."
            },
            {
              prompt: "What does division return when the divisor is larger than the dividend?",
              choices: ["0", "1", "The dividend", "The divisor"],
              choicesAreCode: false,
              answer: 0,
              explanation: "If n > m from the start, LEQ n m = FALSE immediately. Zero subtractions — result is 0."
            },
            {
              prompt: "Which tools from previous lessons does division combine?",
              choices: ["Y, LEQ, SUB, and SUCC", "Y, ISZERO, and PRED", "ADD, MULT, and SUCC", "Y, NOT, and TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "LEQ checks the condition, SUB reduces the dividend, SUCC counts each step, and Y provides the recursion."
            }
          ]
        },

        // ── Concept: DIV ─────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "div-def",
          title: "DIV",
          content: `
            <p>Write the recursive template — a step function that receives <code>rec</code>
            (the recursive call) from Y, plus the dividend <code>m</code> and divisor <code>n</code>:</p>
            <div class="syntax-box"><code>DIV_STEP  =  λrec.λm.λn.LEQ n m (SUCC (rec (SUB m n) n)) 0</code></div>
            <div class="syntax-box"><code>DIV  =  Y DIV_STEP</code></div>
            <ul class="parts-list">
              <li><code>LEQ n m</code> &mdash; is the divisor still ≤ the current dividend?</li>
              <li><code>SUCC (rec (SUB m n) n)</code> &mdash; count 1 and recurse with m reduced by n</li>
              <li><code>0</code> &mdash; base case: divisor exceeds dividend, no more subtractions</li>
            </ul>
            <p>Trace through <code>DIV 6 2</code>:</p>
            <div class="step-trace">
              <div class="step"><code>DIV 6 2</code></div>
              <div class="step step-reduce"><code>DIV_STEP DIV 6 2</code><span class="step-note">Y DIV_STEP = DIV_STEP DIV</span></div>
              <div class="step step-reduce"><code>LEQ 2 6 (SUCC (DIV 4 2)) 0</code><span class="step-note">substitute; SUB 6 2 = 4</span></div>
              <div class="step step-reduce"><code>SUCC (DIV 4 2)</code><span class="step-note">LEQ 2 6 = TRUE</span></div>
              <div class="step step-reduce"><code>SUCC (SUCC (DIV 2 2))</code><span class="step-note">LEQ 2 4 = TRUE; SUB 4 2 = 2</span></div>
              <div class="step step-reduce"><code>SUCC (SUCC (SUCC (DIV 0 2)))</code><span class="step-note">LEQ 2 2 = TRUE; SUB 2 2 = 0</span></div>
              <div class="step step-reduce"><code>SUCC (SUCC (SUCC 0))</code><span class="step-note">LEQ 2 0 = FALSE — base case fires</span></div>
              <div class="step step-reduce"><code>3</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              SUCC accumulates in the call stack — one layer per subtraction.
              The base case unwinds them all, counting the total number of steps.
            </div>
          `
        },

        // ── Exercise: DIV ────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-div",
          title: "Quick Check: DIV",
          instruction: "Use DIV_STEP = λrec.λm.λn.LEQ n m (SUCC (rec (SUB m n) n)) 0 and DIV = Y DIV_STEP.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "DIV 4 2",
              choices: ["2", "1", "0", "4"],
              choicesAreCode: false,
              answer: 0,
              explanation: "4−2=2, 2−2=0, 0<2 — two subtractions. DIV 4 2 = 2."
            },
            {
              prompt: "Result of:",
              expr: "DIV 1 3",
              choices: ["0", "1", "3", "2"],
              choicesAreCode: false,
              answer: 0,
              explanation: "LEQ 3 1 = FALSE immediately — 3 > 1. Zero subtractions. DIV 1 3 = 0."
            },
            {
              prompt: "Result of:",
              expr: "DIV 6 3",
              choices: ["2", "3", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "6−3=3, 3−3=0, 0<3 — two subtractions. DIV 6 3 = 2."
            },
            {
              prompt: "Which correctly defines DIV_STEP?",
              choices: [
                "λrec.λm.λn.LEQ n m (SUCC (rec (SUB m n) n)) 0",
                "λrec.λm.λn.LEQ m n (SUCC (rec (SUB m n) n)) 0",
                "λrec.λm.λn.ISZERO m (SUCC (rec (PRED m) n)) 0",
                "λrec.λm.λn.LEQ n m (rec (SUB m n) n) 0"
              ],
              answer: 0,
              explanation: "The second swaps the LEQ arguments (would stop too early). The third uses PRED instead of SUB and ISZERO instead of LEQ. The fourth is missing SUCC — it recurses without counting."
            }
          ]
        },

        // ── Concept: MOD ─────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "mod-def",
          title: "MOD",
          content: `
            <p>Modulo is the companion to division: instead of <em>counting</em> the
            subtractions, return what's <em>left over</em> when you can't subtract any more.</p>
            <p>The recursive structure is identical to DIV — same condition, same step.
            Only the two branches change:</p>
            <div class="ex-table">
              <div class="ex-row"><code>DIV_STEP</code><span>TRUE branch: <code>SUCC (rec ...)</code> — count one more, then recurse</span></div>
              <div class="ex-row"><code>MOD_STEP</code><span>TRUE branch: <code>rec ...</code> — just recurse, no counting</span></div>
              <div class="ex-row"><code>DIV_STEP</code><span>FALSE branch: <code>0</code> — zero more subtractions</span></div>
              <div class="ex-row"><code>MOD_STEP</code><span>FALSE branch: <code>m</code> — the leftover is the current m</span></div>
            </div>
            <div class="syntax-box"><code>MOD_STEP  =  λrec.λm.λn.LEQ n m (rec (SUB m n) n) m</code></div>
            <div class="syntax-box"><code>MOD  =  Y MOD_STEP</code></div>
            <p>Trace through <code>MOD 5 2</code>:</p>
            <div class="step-trace">
              <div class="step"><code>MOD 5 2</code></div>
              <div class="step step-reduce"><code>LEQ 2 5 (MOD 3 2) 5</code><span class="step-note">SUB 5 2 = 3</span></div>
              <div class="step step-reduce"><code>MOD 3 2</code><span class="step-note">LEQ 2 5 = TRUE — recurse, no count</span></div>
              <div class="step step-reduce"><code>LEQ 2 3 (MOD 1 2) 3</code><span class="step-note">SUB 3 2 = 1</span></div>
              <div class="step step-reduce"><code>MOD 1 2</code><span class="step-note">LEQ 2 3 = TRUE — recurse again</span></div>
              <div class="step step-reduce"><code>LEQ 2 1 (MOD ...) 1</code></div>
              <div class="step step-reduce"><code>1</code><span class="step-note">LEQ 2 1 = FALSE — 1 is the remainder</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              DIV counts subtractions; MOD returns what's left.
              Same skeleton, two different questions about the same process.
            </div>
          `
        },

        // ── Final Review ──────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-div-review",
          title: "Review: Division",
          instruction: "Use DIV = Y DIV_STEP and MOD = Y MOD_STEP from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "DIV 9 3",
              choices: ["3", "2", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "9−3=6, 6−3=3, 3−3=0, 0<3 — three subtractions. DIV 9 3 = 3."
            },
            {
              prompt: "Result of:",
              expr: "DIV 2 5",
              choices: ["0", "1", "2", "5"],
              choicesAreCode: false,
              answer: 0,
              explanation: "LEQ 5 2 = FALSE immediately — 5 > 2. DIV 2 5 = 0."
            },
            {
              prompt: "Result of:",
              expr: "MOD 7 3",
              choices: ["1", "2", "3", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "7−3=4, 4−3=1, 1<3 — remainder is 1. MOD 7 3 = 1."
            },
            {
              prompt: "Result of:",
              expr: "MOD 6 3",
              choices: ["0", "1", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "6−3=3, 3−3=0, 0<3 — remainder is 0. MOD 6 3 = 0."
            },
            {
              prompt: "What differs between DIV_STEP and MOD_STEP?",
              choices: [
                "The TRUE branch: DIV adds SUCC and keeps the count; MOD just recurses without counting",
                "The condition: DIV uses LEQ n m; MOD uses LEQ m n",
                "The step: DIV uses SUB; MOD uses PRED",
                "The base case: DIV returns 0; MOD calls Y again"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Same condition (LEQ n m), same step (SUB m n), same base case structure. Only the TRUE branch differs: DIV wraps SUCC around the recursive call; MOD passes it through unchanged."
            },
            {
              prompt: "Result of:",
              expr: "MOD 4 4",
              choices: ["0", "1", "4", "2"],
              choicesAreCode: false,
              answer: 0,
              explanation: "4−4=0, 0<4 — remainder is 0. Divides evenly. MOD 4 4 = 0."
            }
          ]
        }

      ]
    },

    // ── Lesson 12: Lists ────────────────────────────────────────────────────────
    {
      id: "lesson-12",
      title: "Lesson 12: Lists",
      description: "Encoding sequences as functions — and discovering that a list is a fold",
      completionText: "Lists are folds — the list itself is the computation structure, already waiting for a step function and a base value. Next up: recursive list operations — LENGTH, MAP, and FOLD — all built with Y on the foundation you just saw.",

      blocks: [

        // ── Concept: Lists as Fold Functions ─────────────────────────────────────
        {
          type: "concept",
          id: "list-intro",
          title: "Lists as Fold Functions",
          content: `
            <p>Pairs hold exactly two values. For sequences of arbitrary length,
            we need something new. The key insight: rather than storing elements
            in a data structure, encode the list <em>as the computation it represents</em> —
            a function ready to fold over itself the moment you give it a step and a base.</p>
            <p>A list takes two arguments: a <strong>step function</strong> <code>c</code>
            (called once per element, combining the element with the result so far) and a
            <strong>base value</strong> <code>n</code> (returned for an empty list).
            The constructors:</p>
            <div class="ex-table">
              <div class="ex-row"><code>NIL   =  λc.λn.n</code><span>empty list — no elements, just return n</span></div>
              <div class="ex-row"><code>CONS  =  λh.λt.λc.λn.c h (t c n)</code><span>prepend h — fold the tail first, then combine h with the result</span></div>
            </div>
            <ul class="parts-list">
              <li><code>h</code> &mdash; the head (the new first element)</li>
              <li><code>t</code> &mdash; the tail (the rest of the list — itself a fold function)</li>
              <li><code>c</code> &mdash; the step function, passed through to every level</li>
              <li><code>n</code> &mdash; the base value, passed through to the end</li>
            </ul>
            <p>Watch what happens when you give a list concrete arguments.
            Here is <code>[a, b]</code> — written <code>CONS a (CONS b NIL)</code>:</p>
            <div class="step-trace">
              <div class="step"><code>CONS a (CONS b NIL) c n</code></div>
              <div class="step step-reduce"><code>c a (CONS b NIL c n)</code><span class="step-note">outer CONS applies c to head a</span></div>
              <div class="step step-reduce"><code>c a (c b (NIL c n))</code><span class="step-note">inner CONS applies c to head b</span></div>
              <div class="step step-reduce"><code>c a (c b n)</code><span class="step-note">NIL returns n — no more elements</span></div>
            </div>
            <p>The result <code>c a (c b n)</code> is exactly a <strong>right fold</strong>:
            c is applied to the rightmost element first (<code>c b n</code>), and then
            outward to each element left (<code>c a &hellip;</code>). If you've seen
            <code>foldr</code> in Haskell or similar languages, this is the same idea —
            <code>foldr c n [a, b] = c a (c b n)</code>. The list <em>is</em> the fold.</p>
            <div class="callout-note">
              <span class="cn-label">Heads up</span>
              <span>NIL = λc.λn.n, FALSE = λx.λy.y, and 0 = λf.λx.x are all
              alpha-equivalent — the same function wearing three different hats.
              Each discards its first argument and returns the second.
              In lambda calculus, a function is what it does; context determines meaning.</span>
            </div>
          `
        },

        // ── Exercise: NIL and CONS ────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-list-basics",
          title: "Quick Check: NIL and CONS",
          instruction: "Use NIL = λc.λn.n and CONS = λh.λt.λc.λn.c h (t c n).",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Which expression is NIL?",
              choices: ["λc.λn.n", "λh.λt.λc.λn.c h (t c n)", "λc.λn.c n", "λx.x"],
              answer: 0,
              explanation: "NIL = λc.λn.n — ignores the cons step c and returns the base n. Zero elements, zero applications of c."
            },
            {
              prompt: "Normal form of:",
              expr: "NIL c n",
              choices: ["n", "c", "c n", "c n n"],
              answer: 0,
              explanation: "NIL c n → n. The empty list applies c zero times, just like 0 f x → x."
            },
            {
              prompt: "Normal form of:",
              expr: "CONS a NIL c n",
              choices: ["c a n", "c a (c n)", "a n", "c n a"],
              answer: 0,
              explanation: "CONS a NIL c n → c a (NIL c n) → c a n. One application of c: to head a, with n as the base."
            },
            {
              prompt: "Normal form of:",
              expr: "CONS a (CONS b NIL) c n",
              choices: ["c a (c b n)", "c a (c b (c n))", "c (c a b) n", "a b n"],
              answer: 0,
              explanation: "→ c a (CONS b NIL c n) → c a (c b (NIL c n)) → c a (c b n). This is foldr c n [a, b] — c applied right-to-left, starting from n."
            }
          ]
        },

        // ── Concept: IS_NIL ───────────────────────────────────────────────────────
        {
          type: "concept",
          id: "is-nil",
          title: "IS_NIL",
          content: `
            <p>Testing whether a list is empty follows the same pattern as ISZERO and EVEN:
            choose a cons step that signals "non-empty," and a base that signals "empty."</p>
            <div class="syntax-box"><code>IS_NIL  =  λl.l (λh.λt.FALSE) TRUE</code></div>
            <ul class="parts-list">
              <li><code>λh.λt.FALSE</code> &mdash; the cons step: ignores both arguments, always returns FALSE</li>
              <li><code>TRUE</code> &mdash; the base: returned unchanged if the list is empty</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>IS_NIL NIL</code></div>
              <div class="step step-reduce"><code>NIL (λh.λt.FALSE) TRUE</code></div>
              <div class="step step-reduce"><code>TRUE</code><span class="step-note">NIL returns its base unchanged</span></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>IS_NIL (CONS a NIL)</code></div>
              <div class="step step-reduce"><code>CONS a NIL (λh.λt.FALSE) TRUE</code></div>
              <div class="step step-reduce"><code>(λh.λt.FALSE) a (NIL (λh.λt.FALSE) TRUE)</code><span class="step-note">cons step fires</span></div>
              <div class="step step-reduce"><code>FALSE</code><span class="step-note">h and t are discarded — only their presence matters</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              The cons step fires once for every element. The moment it fires at all,
              we know the list is non-empty — the actual values of h and t don't matter.
            </div>
          `
        },

        // ── Exercise: IS_NIL ──────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-is-nil",
          title: "Quick Check: IS_NIL",
          instruction: "Use IS_NIL = λl.l (λh.λt.FALSE) TRUE.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "IS_NIL NIL",
              choices: ["TRUE", "FALSE", "NIL", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL (λh.λt.FALSE) TRUE = TRUE. The empty list returns its base value — no cons step ever fires."
            },
            {
              prompt: "Result of:",
              expr: "IS_NIL (CONS a (CONS b NIL))",
              choices: ["FALSE", "TRUE", "a", "NIL"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The outermost cons step fires immediately, returning FALSE. The list has elements — that's all we need to know."
            },
            {
              prompt: "Why does the cons step in IS_NIL ignore h and t?",
              choices: [
                "IS_NIL only asks whether a head exists, not what it is — FALSE signals non-empty",
                "h and t are free variables that can't appear in a body",
                "The cons step only fires when the list is empty",
                "Lambda calculus requires constant functions to have no arguments"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "IS_NIL is a yes/no test. The moment a cons step fires at all, we know the list is non-empty. The values of h and t are irrelevant to that question."
            }
          ]
        },

        // ── Concept: HEAD ─────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "head",
          title: "HEAD",
          content: `
            <p>Because a list IS a fold, you extract information by choosing the right
            step function and base. HEAD picks the first element by using a cons step
            that immediately returns the head and ignores everything else:</p>
            <div class="syntax-box"><code>HEAD  =  λl.l (λh.λt.h) FALSE</code></div>
            <ul class="parts-list">
              <li><code>λh.λt.h</code> &mdash; the cons step: return the head, discard the accumulated tail result</li>
              <li><code>FALSE</code> &mdash; the base: returned if the list is empty (undefined case)</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>HEAD (CONS a (CONS b NIL))</code></div>
              <div class="step step-reduce"><code>CONS a (CONS b NIL) (λh.λt.h) FALSE</code></div>
              <div class="step step-reduce"><code>(λh.λt.h) a ((CONS b NIL) (λh.λt.h) FALSE)</code><span class="step-note">outermost cons step fires</span></div>
              <div class="step step-reduce"><code>(λt.a) ((CONS b NIL) (λh.λt.h) FALSE)</code><span class="step-note">h = a; tail result is computed but immediately discarded</span></div>
              <div class="step step-reduce"><code>a</code></div>
            </div>
            <p>The tail of the list continues to reduce — it just gets thrown away.
            HEAD only needs the outermost layer.</p>
            <div class="grammar-rule">
              <span class="g-label">The fold pattern</span>
              Every list operation is a choice of step function and base value.
              <code>l c n</code> folds <code>c</code> over the list starting from <code>n</code>.
              IS_NIL, HEAD, LENGTH, MAP, SUM — all are instances of this pattern.
            </div>
          `
        },

        // ── Final Review ──────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-list-review",
          title: "Review: Lists",
          instruction: "Use NIL, CONS, IS_NIL, and HEAD from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "NIL is alpha-equivalent to which expressions from earlier lessons?",
              choices: ["0 and FALSE", "TRUE and 1", "SUCC and PRED", "PAIR and FST"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL = λc.λn.n, 0 = λf.λx.x, FALSE = λx.λy.y — all discard their first argument and return the second. Same function, three different contexts."
            },
            {
              prompt: "Normal form of:",
              expr: "CONS x NIL c n",
              choices: ["c x n", "x n c", "c (c x n)", "c n x"],
              answer: 0,
              explanation: "CONS x NIL c n → c x (NIL c n) → c x n. One application of c to x, with n as the base."
            },
            {
              prompt: "Result of:",
              expr: "IS_NIL NIL",
              choices: ["TRUE", "FALSE", "NIL", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL (λh.λt.FALSE) TRUE = TRUE. No cons step fires — the base value comes back unchanged."
            },
            {
              prompt: "Result of:",
              expr: "HEAD (CONS a NIL)",
              choices: ["a", "NIL", "FALSE", "CONS a NIL"],
              choicesAreCode: false,
              answer: 0,
              explanation: "CONS a NIL (λh.λt.h) FALSE → (λh.λt.h) a (NIL (λh.λt.h) FALSE) → a. The cons step immediately returns the head."
            },
            {
              prompt: "Result of:",
              expr: "HEAD (CONS a (CONS b NIL))",
              choices: ["a", "b", "CONS b NIL", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "HEAD always extracts the outermost element. The cons step (λh.λt.h) returns h = a and discards the accumulated tail result."
            },
            {
              prompt: "CONS a (CONS b NIL) c n = c a (c b n). What does this tell us?",
              choices: [
                "The list is a right fold — it applies c to each element in order, starting from n",
                "CONS applies c to all elements simultaneously",
                "c is applied left-to-right, with b processed before a",
                "The list reduces to a pair of a and b"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "c a (c b n) is foldr c n [a, b] — the rightmost element (b) is combined with n first, then a is combined with that result. The list encodes this fold directly."
            }
          ]
        }

      ]
    },

    // ── Lesson 13: List Operations ──────────────────────────────────────────────
    {
      id: "lesson-13",
      title: "Lesson 13: List Operations",
      description: "LENGTH, SUM, MAP, and FILTER — all from the same fold",
      completionText: "Every list operation is a fold in disguise: pick a step and a base, hand them to the list, and the list does the work. Next up: putting everything together to write real programs in lambda calculus.",

      blocks: [

        // ── Concept: The Fold Principle ───────────────────────────────────────────
        {
          type: "concept",
          id: "fold-principle",
          title: "Everything Is a Fold",
          content: `
            <p>A list applied to a step function <code>c</code> and a base value <code>n</code>
            folds <code>c</code> over its elements starting from <code>n</code>.
            You already saw this — it's the core of the encoding:</p>
            <div class="syntax-box"><code>CONS a (CONS b (CONS c NIL))  c  n  =  c a (c b (c c_val n))</code></div>
            <p>Every list operation is just a different choice of <code>c</code> and <code>n</code>:</p>
            <div class="ex-table">
              <div class="ex-row"><code>c = λh.λr.SUCC r &nbsp;&nbsp; n = 0</code><span>count elements &rarr; LENGTH</span></div>
              <div class="ex-row"><code>c = ADD &nbsp;&nbsp; n = 0</code><span>add elements &rarr; SUM</span></div>
              <div class="ex-row"><code>c = λh.λr.CONS (f h) r &nbsp;&nbsp; n = NIL</code><span>transform each element &rarr; MAP f</span></div>
              <div class="ex-row"><code>c = λh.λr.f h (CONS h r) r &nbsp;&nbsp; n = NIL</code><span>keep matching elements &rarr; FILTER f</span></div>
            </div>
            <p>No new machinery needed — not even Y. The list already carries its own
            iteration structure. You just choose what to do at each step.</p>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Writing a list operation means answering two questions:
              what do I do with each head and the result so far?
              And what do I start with on an empty list?
            </div>
          `
        },

        // ── Concept: LENGTH and SUM ───────────────────────────────────────────────
        {
          type: "concept",
          id: "length-sum",
          title: "LENGTH and SUM",
          content: `
            <p>The two simplest operations. LENGTH ignores every element and just counts;
            SUM ignores nothing and adds everything.</p>
            <div class="syntax-box"><code>LENGTH  =  λl.l (λh.λr.SUCC r) 0</code></div>
            <div class="syntax-box"><code>SUM     =  λl.l ADD 0</code></div>
            <div class="step-trace">
              <div class="step"><code>LENGTH (CONS a (CONS b NIL))</code></div>
              <div class="step step-reduce"><code>(λh.λr.SUCC r) a (CONS b NIL (λh.λr.SUCC r) 0)</code><span class="step-note">outer cons step fires — h = a is discarded</span></div>
              <div class="step step-reduce"><code>SUCC (CONS b NIL (λh.λr.SUCC r) 0)</code></div>
              <div class="step step-reduce"><code>SUCC (SUCC 0)</code><span class="step-note">inner cons step fires, then NIL returns 0</span></div>
              <div class="step step-reduce"><code>2</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>SUM (CONS 1 (CONS 2 NIL))</code></div>
              <div class="step step-reduce"><code>ADD 1 (CONS 2 NIL ADD 0)</code><span class="step-note">ADD serves as the cons step: ADD h r = h + r</span></div>
              <div class="step step-reduce"><code>ADD 1 (ADD 2 0)</code><span class="step-note">NIL returns 0</span></div>
              <div class="step step-reduce"><code>3</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Note</span>
              SUM uses ADD directly as the cons step because ADD already
              takes exactly two arguments — the head h and the running total r.
            </div>
          `
        },

        // ── Exercise: LENGTH and SUM ──────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-length-sum",
          title: "Quick Check: LENGTH and SUM",
          instruction: "Use LENGTH = λl.l (λh.λr.SUCC r) 0 and SUM = λl.l ADD 0.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "LENGTH NIL",
              choices: ["0", "1", "NIL", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL (λh.λr.SUCC r) 0 = 0. No cons step fires — the base value is returned."
            },
            {
              prompt: "Result of:",
              expr: "LENGTH (CONS a (CONS b (CONS c NIL)))",
              choices: ["3", "2", "1", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Three cons steps fire, each applying SUCC once. SUCC (SUCC (SUCC 0)) = 3."
            },
            {
              prompt: "Result of:",
              expr: "SUM (CONS 1 (CONS 2 (CONS 3 NIL)))",
              choices: ["6", "3", "1", "9"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ADD 1 (ADD 2 (ADD 3 0)) = ADD 1 (ADD 2 3) = ADD 1 5 = 6."
            },
            {
              prompt: "Why can ADD be used directly as the cons step in SUM?",
              choices: [
                "ADD takes two arguments — it receives the head h and running total r and returns h + r",
                "ADD is the only function that works with Church numerals",
                "ADD ignores its first argument, so only r is summed",
                "ADD and SUCC are the same function"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The cons step receives h (the current element) and r (the result so far). ADD h r is exactly what we want — the sum of the current element and the running total."
            }
          ]
        },

        // ── Concept: MAP ──────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "map",
          title: "MAP",
          content: `
            <p>MAP applies a function to every element, rebuilding the list with
            the transformed values. The cons step transforms the head and prepends
            it to the accumulated result:</p>
            <div class="syntax-box"><code>MAP  =  λf.λl.l (λh.λr.CONS (f h) r) NIL</code></div>
            <ul class="parts-list">
              <li><code>f h</code> &mdash; transform the current element</li>
              <li><code>CONS (f h) r</code> &mdash; prepend it to the already-mapped tail</li>
              <li><code>NIL</code> &mdash; the empty list is the base</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>MAP SUCC (CONS 1 (CONS 2 NIL))</code></div>
              <div class="step step-reduce"><code>CONS 1 (CONS 2 NIL) (λh.λr.CONS (SUCC h) r) NIL</code><span class="step-note">expand MAP</span></div>
              <div class="step step-reduce"><code>CONS (SUCC 1) (CONS 2 NIL (λh.λr.CONS (SUCC h) r) NIL)</code><span class="step-note">outer cons step: transform head 1</span></div>
              <div class="step step-reduce"><code>CONS 2 (CONS (SUCC 2) (NIL (λh.λr.CONS (SUCC h) r) NIL))</code><span class="step-note">SUCC 1 = 2 (outer head done); inner cons step fires on head 2</span></div>
              <div class="step step-reduce"><code>CONS 2 (CONS 3 NIL)</code><span class="step-note">SUCC 2 = 3; NIL (base case) returns NIL</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              r is the already-mapped tail — CONS prepends the newly transformed head onto it.
              The list is rebuilt right-to-left, exactly like the fold that it is.
            </div>
          `
        },

        // ── Exercise: MAP ─────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-map",
          title: "Quick Check: MAP",
          instruction: "Use MAP = λf.λl.l (λh.λr.CONS (f h) r) NIL.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "MAP SUCC (CONS 0 NIL)",
              choices: ["CONS 1 NIL", "CONS 0 NIL", "1", "SUCC (CONS 0 NIL)"],
              answer: 0,
              explanation: "SUCC 0 = 1. MAP applies SUCC to the single element: CONS 1 NIL."
            },
            {
              prompt: "Result of:",
              expr: "MAP NOT (CONS TRUE (CONS FALSE NIL))",
              choices: [
                "CONS FALSE (CONS TRUE NIL)",
                "CONS TRUE (CONS FALSE NIL)",
                "CONS FALSE (CONS FALSE NIL)",
                "NIL"
              ],
              answer: 0,
              explanation: "NOT TRUE = FALSE, NOT FALSE = TRUE. Each element is negated in place."
            },
            {
              prompt: "In MAP's cons step λh.λr.CONS (f h) r, what is r?",
              choices: [
                "The already-mapped tail — CONS prepends the transformed head onto it",
                "The original (unmapped) tail",
                "The function f applied to the tail",
                "A boolean that determines whether to include h"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "r accumulates the mapped result from the right. At each step, CONS (f h) r prepends the newly transformed head onto what's already been processed."
            },
            {
              prompt: "Result of:",
              expr: "MAP (λx.x) (CONS a (CONS b NIL))",
              choices: [
                "CONS a (CONS b NIL)",
                "CONS b (CONS a NIL)",
                "a b",
                "NIL"
              ],
              answer: 0,
              explanation: "The identity function returns each element unchanged. MAP (λx.x) is a no-op — the list comes back as-is."
            }
          ]
        },

        // ── Concept: FILTER ───────────────────────────────────────────────────────
        {
          type: "concept",
          id: "filter",
          title: "FILTER",
          content: `
            <p>FILTER keeps elements where a predicate returns TRUE and drops the rest.
            The cons step tests the head — and here, the Church booleans from Lesson 5
            do the work directly:</p>
            <div class="syntax-box"><code>FILTER  =  λf.λl.l (λh.λr.f h (CONS h r) r) NIL</code></div>
            <p><code>f h</code> returns a Church boolean. Recall that
            <code>TRUE x y = x</code> and <code>FALSE x y = y</code> — so applying that boolean
            to two branches is just if-then-else, with no extra machinery:</p>
            <ul class="parts-list">
              <li>if TRUE &mdash; picks <code>CONS h r</code> &mdash; h is kept, prepended to the result</li>
              <li>if FALSE &mdash; picks <code>r</code> &mdash; h is skipped, result passes through unchanged</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>FILTER EVEN (CONS 1 (CONS 2 NIL))</code></div>
              <div class="step step-reduce"><code>EVEN 1 (CONS 1 &hellip;) &hellip;</code><span class="step-note">cons step tests head 1</span></div>
              <div class="step step-reduce"><code>FALSE (CONS 1 &hellip;) &hellip;</code><span class="step-note">EVEN 1 = FALSE</span></div>
              <div class="step step-reduce"><code>EVEN 2 (CONS 2 NIL) NIL</code><span class="step-note">FALSE picks second — 1 is dropped; now testing head 2</span></div>
              <div class="step step-reduce"><code>TRUE (CONS 2 NIL) NIL</code><span class="step-note">EVEN 2 = TRUE</span></div>
              <div class="step step-reduce"><code>CONS 2 NIL</code><span class="step-note">TRUE picks first — 2 is kept</span></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              The predicate f returns a boolean, and that boolean <em>is</em> the branch selector.
              No special if-then-else needed — the encoding handles it automatically.
            </div>
          `
        },

        // ── Final Review ──────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-list-ops-review",
          title: "Review: List Operations",
          instruction: "Use LENGTH, SUM, MAP, and FILTER from this lesson.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "LENGTH (CONS a (CONS b NIL))",
              choices: ["2", "1", "3", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Two cons steps fire, each applying SUCC. SUCC (SUCC 0) = 2."
            },
            {
              prompt: "Result of:",
              expr: "SUM (CONS 2 (CONS 3 NIL))",
              choices: ["5", "6", "2", "3"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ADD 2 (ADD 3 0) = ADD 2 3 = 5."
            },
            {
              prompt: "Result of:",
              expr: "MAP PRED (CONS 1 (CONS 2 (CONS 3 NIL)))",
              choices: [
                "CONS 0 (CONS 1 (CONS 2 NIL))",
                "CONS 1 (CONS 2 (CONS 3 NIL))",
                "CONS 2 (CONS 3 (CONS 4 NIL))",
                "NIL"
              ],
              answer: 0,
              explanation: "PRED 1 = 0, PRED 2 = 1, PRED 3 = 2. Each element is decremented by one."
            },
            {
              prompt: "Result of:",
              expr: "FILTER ISZERO (CONS 0 (CONS 1 (CONS 0 NIL)))",
              choices: [
                "CONS 0 (CONS 0 NIL)",
                "CONS 0 (CONS 1 (CONS 0 NIL))",
                "CONS 1 NIL",
                "NIL"
              ],
              answer: 0,
              explanation: "ISZERO 0 = TRUE (keep), ISZERO 1 = FALSE (drop), ISZERO 0 = TRUE (keep). Result: [0, 0]."
            },
            {
              prompt: "In FILTER's cons step λh.λr.f h (CONS h r) r, what does the boolean f h control?",
              choices: [
                "Which branch is selected — TRUE prepends h to r; FALSE passes r through unchanged",
                "Whether the list continues reducing",
                "Whether to apply MAP or LENGTH next",
                "The base case of the fold"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "f h returns a Church boolean. That boolean is applied to (CONS h r) and r as its two branches — the same if-then-else pattern from Lesson 5."
            },
            {
              prompt: "LENGTH, SUM, MAP, and FILTER all share which structure?",
              choices: [
                "They are all folds — l c n with a different step c and base n for each",
                "They all use Y for recursion over the list",
                "They all require IS_NIL to detect the empty case",
                "They all return Church numerals"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Every operation is l c n in disguise. The list provides the iteration; you provide the step and base. No Y, no IS_NIL, no explicit recursion needed."
            }
          ]
        }

      ]
    },

    // ── Lesson 14: APPEND, REVERSE, and FLATTEN ─────────────────────────────
    {
      id: "lesson-14",
      title: "Lesson 14: APPEND, REVERSE, and FLATTEN",
      description: "Concatenate, reverse, and flatten — all as folds on the list itself",
      completionText: "APPEND, REVERSE, and FLATTEN all work for the same reason: a Church list IS its fold, so operating on a list means calling it with the right step and base. You now have a complete functional list library. Next, we'll combine everything — numbers, recursion, lists — to write programs that solve real problems.",

      blocks: [

        // ── Concept: APPEND ───────────────────────────────────────────────────────
        {
          type: "concept",
          id: "append-intro",
          title: "APPEND",
          content: `
            <p>So far our list operations each work on a <em>single</em> list. What about
            joining two lists end-to-end?</p>
            <p>The key insight: applying a Church list to <code>CONS</code> as the step
            and another list as the base prepends every element of the first list onto the second.
            That's concatenation:</p>
            <div class="syntax-box"><code>APPEND  =  λl1.λl2. l1 CONS l2</code></div>
            <p>That's the whole definition. <code>l1</code> folds <code>CONS</code> over itself
            starting from <code>l2</code>:</p>
            <div class="step-trace">
              <div class="step"><code>APPEND [a, b] [c]</code></div>
              <div class="step step-reduce"><code>CONS a (CONS b NIL) CONS [c]</code><span class="step-note">l1 = [a, b]; l2 = [c]</span></div>
              <div class="step step-reduce"><code>CONS a ((CONS b NIL) CONS [c])</code><span class="step-note">outer CONS step fires — prepend a</span></div>
              <div class="step step-reduce"><code>CONS a (CONS b (NIL CONS [c]))</code><span class="step-note">inner CONS step fires — prepend b</span></div>
              <div class="step step-reduce"><code>CONS a (CONS b [c])</code><span class="step-note">NIL returns base [c]</span></div>
              <div class="step step-reduce"><code>[a, b, c]</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              APPEND doesn't iterate through l1 explicitly — it <em>is</em> l1, used as a fold.
              The list provides its own iteration; you just choose what to do at each step.
            </div>
          `
        },

        // ── Exercise: APPEND ──────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-append",
          title: "Quick Check: APPEND",
          instruction: "Use APPEND = λl1.λl2.l1 CONS l2.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "APPEND NIL [a, b]",
              choices: ["[a, b]", "NIL", "[NIL, a, b]", "[a, b, NIL]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL CONS [a, b] = [a, b]. NIL folds zero times — it immediately returns its base, [a, b], unchanged."
            },
            {
              prompt: "Result of:",
              expr: "APPEND [a] NIL",
              choices: ["[a]", "NIL", "a", "CONS a NIL NIL"],
              choicesAreCode: false,
              answer: 0,
              explanation: "CONS a NIL CONS NIL = CONS a (NIL CONS NIL) = CONS a NIL = [a]. Appending NIL to a list leaves it unchanged."
            },
            {
              prompt: "Result of:",
              expr: "APPEND [a, b] [c, d]",
              choices: ["[a, b, c, d]", "[c, d, a, b]", "[a, c, b, d]", "[a, b]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "[a, b] CONS [c, d] folds CONS over [a, b] starting from [c, d]. Each element of the first list is prepended in order: CONS a (CONS b [c, d]) = [a, b, c, d]."
            },
            {
              prompt: "Why doesn't APPEND need Y?",
              choices: [
                "l1 is a fold — calling it with CONS and l2 already does the iteration",
                "CONS handles recursion internally, so no Y is needed",
                "APPEND only works on lists short enough that recursion isn't required",
                "NIL acts as a termination signal, replacing the role of Y"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A Church list IS a fold. APPEND simply calls l1 as that fold with CONS as the step and l2 as the base. The iteration is already baked into l1 — no separate recursion needed."
            }
          ]
        },

        // ── Concept: REVERSE ──────────────────────────────────────────────────────
        {
          type: "concept",
          id: "reverse-intro",
          title: "REVERSE",
          content: `
            <p>To reverse a list, walk through it left-to-right and each time, append the
            current element to the <em>end</em> of an accumulator. The first element
            visited ends up at the end — exactly the reverse order.</p>
            <div class="syntax-box"><code>REVERSE  =  λl. l (λh.λacc. APPEND acc (CONS h NIL)) NIL</code></div>
            <ul class="parts-list">
              <li><code>λh.λacc. APPEND acc (CONS h NIL)</code> &mdash; step: append h to the <em>end</em> of the accumulator</li>
              <li><code>NIL</code> &mdash; base: start with an empty accumulator</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>REVERSE [a, b]</code></div>
              <div class="step step-reduce"><code>[a, b] (λh.λacc. APPEND acc (CONS h NIL)) NIL</code><span class="step-note">expand REVERSE</span></div>
              <div class="step step-reduce"><code>step a (step b NIL)</code><span class="step-note">fold: a is outermost, b innermost</span></div>
              <div class="step step-reduce"><code>step a (APPEND NIL (CONS b NIL))</code><span class="step-note">inner step: append b to end of NIL</span></div>
              <div class="step step-reduce"><code>step a [b]</code></div>
              <div class="step step-reduce"><code>APPEND [b] (CONS a NIL)</code><span class="step-note">outer step: append a to end of [b]</span></div>
              <div class="step step-reduce"><code>[b, a]</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              The fold visits a first, b second. By appending each to the <em>end</em> of the
              accumulator rather than the front, the visit order becomes the reverse of
              the output order.
            </div>
          `
        },

        // ── Exercise: REVERSE ─────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-reverse",
          title: "Quick Check: REVERSE",
          instruction: "Use REVERSE = λl.l (λh.λacc.APPEND acc (CONS h NIL)) NIL.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "REVERSE NIL",
              choices: ["NIL", "[NIL]", "TRUE", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL (step) NIL = NIL. No elements to process — the base NIL is returned unchanged."
            },
            {
              prompt: "Result of:",
              expr: "REVERSE [a]",
              choices: ["[a]", "NIL", "a", "[NIL]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "step a NIL = APPEND NIL (CONS a NIL) = [a]. A single-element list is its own reverse."
            },
            {
              prompt: "Result of:",
              expr: "REVERSE [a, b, c]",
              choices: ["[c, b, a]", "[a, b, c]", "[c, a, b]", "[b, c, a]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Fold: step a (step b (step c NIL)). Innermost: step c NIL = [c]. Then: step b [c] = APPEND [c] [b] = [c, b]. Then: step a [c, b] = APPEND [c, b] [a] = [c, b, a]."
            },
            {
              prompt: "REVERSE (REVERSE [a, b, c]) = ?",
              choices: ["[a, b, c]", "[c, b, a]", "NIL", "[a, c, b]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Reversing twice returns the original list. REVERSE [a, b, c] = [c, b, a]. REVERSE [c, b, a] = [a, b, c]."
            }
          ]
        },

        // ── Concept: FLATTEN ──────────────────────────────────────────────────────
        {
          type: "concept",
          id: "flatten-intro",
          title: "FLATTEN",
          content: `
            <p>A list of lists: each element is itself a list. To flatten everything into
            one long list, concatenate the elements in sequence. APPEND does the combining —
            and just like SUM passed ADD directly as its step, FLATTEN passes APPEND:</p>
            <div class="syntax-box"><code>FLATTEN  =  λl. l APPEND NIL</code></div>
            <p>The fold step receives two arguments: the current element (a list)
            and the accumulated result (also a list). <code>APPEND h acc</code> joins
            them. Starting from <code>NIL</code>, each element list gets appended
            onto the growing result:</p>
            <div class="step-trace">
              <div class="step"><code>FLATTEN [[a], [b, c]]</code></div>
              <div class="step step-reduce"><code>[[a], [b, c]] APPEND NIL</code><span class="step-note">expand FLATTEN</span></div>
              <div class="step step-reduce"><code>APPEND [a] (APPEND [b, c] NIL)</code><span class="step-note">APPEND as fold step</span></div>
              <div class="step step-reduce"><code>APPEND [a] [b, c]</code><span class="step-note">APPEND [b, c] NIL = [b, c]</span></div>
              <div class="step step-reduce"><code>[a, b, c]</code></div>
            </div>
            <div class="callout-note">
              <span class="cn-label">Pattern</span>
              <span>When the step is already a two-argument function that does exactly what you want,
              pass it directly: <code>SUM = λl.l ADD 0</code>,
              <code>FLATTEN = λl.l APPEND NIL</code>.
              No wrapper lambda needed.</span>
            </div>
          `
        },

        // ── Exercise: FLATTEN ─────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-flatten",
          title: "Quick Check: FLATTEN",
          instruction: "Use FLATTEN = λl.l APPEND NIL.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "FLATTEN NIL",
              choices: ["NIL", "[NIL]", "FALSE", "TRUE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL APPEND NIL = NIL. The empty list of lists flattens to the empty list."
            },
            {
              prompt: "Result of:",
              expr: "FLATTEN [[a], NIL, [b]]",
              choices: ["[a, b]", "[a, NIL, b]", "[[a], [b]]", "NIL"],
              choicesAreCode: false,
              answer: 0,
              explanation: "APPEND [a] (APPEND NIL (APPEND [b] NIL)) = APPEND [a] (APPEND NIL [b]) = APPEND [a] [b] = [a, b]. The NIL element contributes nothing."
            },
            {
              prompt: "Why can APPEND be passed directly as the step (without λh.λacc.APPEND h acc)?",
              choices: [
                "APPEND already takes two arguments — it receives h and acc exactly as needed",
                "APPEND ignores its first argument when used as a fold step",
                "The list encoding automatically curries APPEND for the fold",
                "FLATTEN uses CONS internally, making the explicit APPEND call unnecessary"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The fold step receives two arguments: the current element h and accumulator acc. APPEND h acc is exactly what we want. Since APPEND is already a two-argument function that does this, writing λh.λacc.APPEND h acc would just be eta-expanding it unnecessarily."
            }
          ]
        },

        // ── Final Review ──────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-append-rev-flat-review",
          title: "Review: APPEND, REVERSE, FLATTEN",
          instruction: "Use APPEND = λl1.λl2.l1 CONS l2, REVERSE = λl.l (λh.λacc.APPEND acc (CONS h NIL)) NIL, FLATTEN = λl.l APPEND NIL.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "APPEND [a, b] (APPEND [c] [d])",
              choices: ["[a, b, c, d]", "[a, b, d, c]", "[d, c, a, b]", "[a, c, b, d]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Inner: APPEND [c] [d] = [c, d]. Outer: APPEND [a, b] [c, d] = [a, b, c, d]."
            },
            {
              prompt: "Result of:",
              expr: "APPEND (REVERSE [a, b]) [c]",
              choices: ["[b, a, c]", "[a, b, c]", "[c, a, b]", "[c, b, a]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "REVERSE [a, b] = [b, a]. APPEND [b, a] [c] = [b, a, c]."
            },
            {
              prompt: "Result of:",
              expr: "FLATTEN [NIL, [a], [b, c]]",
              choices: ["[a, b, c]", "[NIL, a, b, c]", "[a, b]", "NIL"],
              choicesAreCode: false,
              answer: 0,
              explanation: "APPEND NIL (APPEND [a] (APPEND [b, c] NIL)) = APPEND NIL (APPEND [a] [b, c]) = APPEND NIL [a, b, c] = [a, b, c]."
            },
            {
              prompt: "FLATTEN (MAP (λx.CONS x NIL) [a, b]) = ?",
              choices: ["[a, b]", "[[a], [b]]", "NIL", "[a, b, a, b]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "MAP (λx.CONS x NIL) [a, b] = [[a], [b]]. FLATTEN [[a], [b]] = [a, b]. Mapping a singleton-list constructor and then flattening is the identity."
            },
            {
              prompt: "Which of these correctly defines FLATTEN?",
              choices: [
                "λl.l APPEND NIL",
                "λl.l (λh.λr.CONS h r) NIL",
                "λl.l NIL APPEND",
                "λl.APPEND l NIL"
              ],
              answer: 0,
              explanation: "λl.l APPEND NIL: fold l with APPEND as the step and NIL as the base. The second option reconstructs a flat list (it's the identity for flat lists). The third has the arguments in the wrong order. The fourth applies APPEND to a list-of-lists and NIL, not a fold."
            }
          ]
        }

      ]
    },

    // ── Lesson 15: Programs in Lambda Calculus ───────────────────────────────
    {
      id: "lesson-15",
      title: "Lesson 15: Programs in Lambda Calculus",
      description: "Fibonacci, number ranges, and list predicates — the whole toolkit in play",
      completionText: "You've now written programs — Fibonacci, number sequences, list predicates — in a language with exactly three constructs: variables, abstraction, and application. Everything else was encoded. Lambda calculus is the foundation every functional programming language is built on, and you've built the foundation yourself.",

      blocks: [

        // ── Concept: FIB ─────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "fib-intro",
          title: "Fibonacci",
          content: `
            <p>FACT had one recursive call. Fibonacci has two — each call reduces n by a
            different amount, and the results are added together:</p>
            <div class="ex-table">
              <div class="ex-row"><code>FIB 0 = 0</code><span>base case</span></div>
              <div class="ex-row"><code>FIB 1 = 1</code><span>base case</span></div>
              <div class="ex-row"><code>FIB n = FIB (n−1) + FIB (n−2)</code><span>recursive case</span></div>
            </div>
            <p>Two base cases means two nested ISZEROs. The recursive case calls
            <code>rec</code> twice and adds the results:</p>
            <div class="syntax-box"><code>FIB_STEP  =  λrec.λn. ISZERO n 0 (ISZERO (PRED n) 1 (ADD (rec (PRED n)) (rec (PRED (PRED n)))))</code></div>
            <div class="syntax-box"><code>FIB  =  Y FIB_STEP</code></div>
            <div class="step-trace">
              <div class="step"><code>FIB 2</code></div>
              <div class="step step-reduce"><code>ISZERO 2 0 (ISZERO (PRED 2) 1 (ADD (FIB (PRED 2)) (FIB (PRED (PRED 2)))))</code><span class="step-note">ISZERO 2 = FALSE — recurse</span></div>
              <div class="step step-reduce"><code>ISZERO 1 1 (ADD (FIB 1) (FIB 0))</code><span class="step-note">PRED 2 = 1; PRED (PRED 2) = 0</span></div>
              <div class="step step-reduce"><code>ADD (FIB 1) (FIB 0)</code><span class="step-note">ISZERO 1 = FALSE — recurse again</span></div>
              <div class="step step-reduce"><code>ADD 1 0</code><span class="step-note">base cases: FIB 1 = 1, FIB 0 = 0</span></div>
              <div class="step step-reduce"><code>1</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Key idea</span>
              Y doesn't care how many times <code>rec</code> is called — it provides a
              self-referential function that can be used as many times as needed in one step.
              Double recursion is no harder to express than single recursion.
            </div>
          `
        },

        // ── Exercise: FIB ─────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-fib",
          title: "Quick Check: FIB",
          instruction: "Use FIB_STEP = λrec.λn.ISZERO n 0 (ISZERO (PRED n) 1 (ADD (rec (PRED n)) (rec (PRED (PRED n))))) and FIB = Y FIB_STEP.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "FIB 0",
              choices: ["0", "1", "NIL", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 0 = TRUE — the first base case fires immediately. FIB 0 = 0."
            },
            {
              prompt: "Result of:",
              expr: "FIB 3",
              choices: ["2", "3", "1", "5"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FIB 3 = ADD (FIB 2) (FIB 1) = ADD 1 1 = 2. The sequence: 0, 1, 1, 2, 3, 5, ..."
            },
            {
              prompt: "Result of:",
              expr: "FIB 5",
              choices: ["5", "8", "3", "4"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FIB 5 = ADD (FIB 4) (FIB 3) = ADD 3 2 = 5. Sequence: 0, 1, 1, 2, 3, 5."
            },
            {
              prompt: "What distinguishes FIB_STEP from FACT_STEP?",
              choices: [
                "FIB_STEP calls rec twice (for n−1 and n−2); FACT_STEP calls rec once",
                "FIB_STEP uses MULT where FACT_STEP uses ADD",
                "FIB_STEP requires two Y combinators, one for each recursive call",
                "FIB_STEP uses SUCC instead of PRED"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "FACT_STEP: MULT n (rec (PRED n)) — one call. FIB_STEP: ADD (rec (PRED n)) (rec (PRED (PRED n))) — two calls. Y handles both cases identically."
            }
          ]
        },

        // ── Concept: RANGE ────────────────────────────────────────────────────────
        {
          type: "concept",
          id: "range-intro",
          title: "RANGE",
          content: `
            <p>So far, Y has always <em>computed</em> a value — a number, a boolean.
            It can also <em>build</em> a data structure. RANGE constructs the list
            <code>[1, 2, …, n]</code>:</p>
            <div class="syntax-box"><code>RANGE_STEP  =  λrec.λn. ISZERO n NIL (APPEND (rec (PRED n)) (CONS n NIL))</code></div>
            <div class="syntax-box"><code>RANGE  =  Y RANGE_STEP</code></div>
            <p>Each recursive call builds the list up to <code>n−1</code>, then appends
            <code>n</code> at the end. The base case (<code>n = 0</code>) returns NIL:</p>
            <div class="step-trace">
              <div class="step"><code>RANGE 3</code></div>
              <div class="step step-reduce"><code>APPEND (RANGE 2) [3]</code><span class="step-note">ISZERO 3 = FALSE</span></div>
              <div class="step step-reduce"><code>APPEND (APPEND (RANGE 1) [2]) [3]</code></div>
              <div class="step step-reduce"><code>APPEND (APPEND (APPEND NIL [1]) [2]) [3]</code><span class="step-note">RANGE 0 = NIL — base case</span></div>
              <div class="step step-reduce"><code>APPEND (APPEND [1] [2]) [3]</code></div>
              <div class="step step-reduce"><code>APPEND [1, 2] [3]</code></div>
              <div class="step step-reduce"><code>[1, 2, 3]</code></div>
            </div>
            <p>RANGE and MAP compose directly. To get the first five Fibonacci numbers:</p>
            <div class="syntax-box"><code>MAP FIB (RANGE 5)  =  [1, 1, 2, 3, 5]</code></div>
            <div class="callout-note">
              <span class="cn-label">Note</span>
              <span>This single line uses six lessons' worth of machinery: Y (Lesson 10),
              FIB (this lesson), RANGE (this lesson), MAP (Lesson 13), CONS/NIL (Lesson 12),
              ADD/PRED/ISZERO (Lessons 6–9). Pure functions, all the way down.</span>
            </div>
          `
        },

        // ── Exercise: RANGE ───────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-range",
          title: "Quick Check: RANGE",
          instruction: "Use RANGE_STEP = λrec.λn.ISZERO n NIL (APPEND (rec (PRED n)) (CONS n NIL)) and RANGE = Y RANGE_STEP.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Result of:",
              expr: "RANGE 0",
              choices: ["NIL", "[0]", "[1]", "FALSE"],
              choicesAreCode: false,
              answer: 0,
              explanation: "ISZERO 0 = TRUE — the base case fires. RANGE 0 = NIL."
            },
            {
              prompt: "Result of:",
              expr: "RANGE 4",
              choices: ["[1, 2, 3, 4]", "[0, 1, 2, 3]", "[4, 3, 2, 1]", "[1, 2, 3]"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Each step appends n to the end of RANGE (n−1). RANGE 4 = APPEND [1, 2, 3] [4] = [1, 2, 3, 4]."
            },
            {
              prompt: "Result of:",
              expr: "LENGTH (RANGE 7)",
              choices: ["7", "6", "8", "1"],
              choicesAreCode: false,
              answer: 0,
              explanation: "RANGE n always produces a list of exactly n elements. LENGTH (RANGE 7) = 7."
            },
            {
              prompt: "Result of:",
              expr: "SUM (RANGE 4)",
              choices: ["10", "6", "4", "24"],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUM [1, 2, 3, 4] = 1 + 2 + 3 + 4 = 10. SUM from Lesson 13, RANGE from this lesson — composing with no glue code needed."
            }
          ]
        },

        // ── Concept: ALL and ANY ──────────────────────────────────────────────────
        {
          type: "concept",
          id: "all-any-intro",
          title: "ALL and ANY",
          content: `
            <p>Two symmetric folds for testing a list against a predicate. No Y needed —
            just the right step and base:</p>
            <div class="syntax-box"><code>ALL  =  λf.λl. l (λh.λr. AND (f h) r) TRUE</code></div>
            <div class="syntax-box"><code>ANY  =  λf.λl. l (λh.λr. OR  (f h) r) FALSE</code></div>
            <ul class="parts-list">
              <li>ALL: start <code>TRUE</code>, AND in each test &mdash; one <code>FALSE</code> poisons the whole result</li>
              <li>ANY: start <code>FALSE</code>, OR in each test &mdash; one <code>TRUE</code> redeems the whole result</li>
            </ul>
            <div class="step-trace">
              <div class="step"><code>ALL ISZERO [0, 1]</code></div>
              <div class="step step-reduce"><code>AND (ISZERO 0) (AND (ISZERO 1) TRUE)</code><span class="step-note">fold: AND each test into TRUE</span></div>
              <div class="step step-reduce"><code>AND TRUE (AND FALSE TRUE)</code></div>
              <div class="step step-reduce"><code>AND TRUE FALSE</code></div>
              <div class="step step-reduce"><code>FALSE</code></div>
            </div>
            <div class="step-trace">
              <div class="step"><code>ANY ISZERO [1, 0]</code></div>
              <div class="step step-reduce"><code>OR (ISZERO 1) (OR (ISZERO 0) FALSE)</code><span class="step-note">fold: OR each test into FALSE</span></div>
              <div class="step step-reduce"><code>OR FALSE (OR TRUE FALSE)</code></div>
              <div class="step step-reduce"><code>OR FALSE TRUE</code></div>
              <div class="step step-reduce"><code>TRUE</code></div>
            </div>
            <div class="grammar-rule">
              <span class="g-label">Pattern</span>
              ALL and ANY mirror FILTER's boolean trick — the predicate returns a Church
              boolean, and that boolean drives a fold combinator (AND or OR) rather than
              a keep-or-skip branch.
            </div>
          `
        },

        // ── Final Review ──────────────────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-programs-review",
          title: "Review: Programs in Lambda Calculus",
          instruction: "Use FIB, RANGE, ALL, ANY, and any operations from earlier lessons.",
          kind: "multiple-choice",
          isFinal: true,
          items: [
            {
              prompt: "Result of:",
              expr: "FIB 4",
              choices: ["3", "4", "2", "5"],
              choicesAreCode: false,
              answer: 0,
              explanation: "FIB 4 = ADD (FIB 3) (FIB 2) = ADD 2 1 = 3. Sequence: 0, 1, 1, 2, 3, 5, ..."
            },
            {
              prompt: "Result of:",
              expr: "ALL ISZERO (RANGE 3)",
              choices: ["FALSE", "TRUE", "NIL", "0"],
              choicesAreCode: false,
              answer: 0,
              explanation: "RANGE 3 = [1, 2, 3]. ISZERO 1 = FALSE — the very first test fails. AND FALSE ... = FALSE."
            },
            {
              prompt: "Result of:",
              expr: "ANY ISZERO (RANGE 4)",
              choices: ["FALSE", "TRUE", "NIL", "4"],
              choicesAreCode: false,
              answer: 0,
              explanation: "RANGE 4 = [1, 2, 3, 4]. ISZERO 1 = ISZERO 2 = ISZERO 3 = ISZERO 4 = FALSE. OR FALSE FALSE FALSE FALSE = FALSE. RANGE starts from 1, so it never contains 0."
            },
            {
              prompt: "Result of:",
              expr: "LENGTH (MAP FIB (RANGE 5))",
              choices: ["5", "8", "FIB 5", "15"],
              choicesAreCode: false,
              answer: 0,
              explanation: "MAP doesn't change the length. RANGE 5 has 5 elements; MAP FIB produces 5 results. LENGTH = 5."
            },
            {
              prompt: "ALL f NIL = ?",
              choices: ["TRUE", "FALSE", "NIL", "f"],
              choicesAreCode: false,
              answer: 0,
              explanation: "NIL applies the step zero times — the base TRUE is returned unchanged. All zero elements of the empty list satisfy any predicate (vacuously true)."
            },
            {
              prompt: "Which expression produces the sum of [1, 2, 3, 4, 5]?",
              choices: [
                "SUM (RANGE 5)",
                "FOLD ADD (RANGE 5) 0",
                "MAP ADD (RANGE 5)",
                "LENGTH (RANGE 5)"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "SUM = λl.l ADD 0. RANGE 5 = [1, 2, 3, 4, 5]. SUM (RANGE 5) = 1+2+3+4+5 = 15. Two operations from two different lessons, composing directly."
            }
          ]
        }

      ]
    }

  ]
};
