// curriculum.js — Term Functor Logic: Relational Syllogisms
// Based on: Sommers & Englebretsen, "An Invitation to Formal Reasoning: The Logic of Terms" (2000)
// Chapter 6 — Syllogistic (II): relational arguments, distribution, indirect proof
// Prerequisites: Introduction (all), The Full Language L2 (relational statements),
// L5 (REGAL), L6 (matrix method / dictum de omni).

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
  title: "Term Functor Logic: Relational Syllogisms",
  subtitle: "The dictum, distribution, and indirect proof",
  icon: "∴",
  lessons: [

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 1: The Dictum Applied to Relational Arguments
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-01",
      title: "Lesson 1: The Dictum Applied to Relational Arguments",
      navTitle: "The Dictum, Relational",
      description: "Extend the dictum de omni into relational complexes — the middle term can now sit inside the parentheses, and the same cancellation algebra handles arguments syllogistic logic was said to be unable to touch.",
      completionText: "The dictum reaches inside parentheses: a middle term cancels wherever it occurs, host + against donor −, and relational syllogisms fall to exactly the algebra you already knew. The De Morgan challenge dissolves once tautological relational premises are on the table. In the next lesson you'll make the machinery precise: how to compute whether a term buried in a complex is distributed or undistributed, by multiplying the signs that govern it.",
      blocks: [

        // ── Concept: The Challenge ───────────────────────────────────────────
        {
          type: "concept",
          id: "demorgan-challenge",
          title: "1. An Argument Logic 'Couldn’t Handle'",
          content: `
            <p>In 1860 the logician Augustus De Morgan issued a famous challenge to traditional
            syllogistic logic. Consider:</p>

            <div class="syllogism-display">
                <div class="syl-row"><span class="syl-label">Premise:</span><span class="syl-text">Every horse is an animal.</span></div>
                <hr class="syl-divider">
                <div class="syl-row syl-conclusion"><span class="syl-therefore">∴</span><span class="syl-text">Every head of a horse is a head of an animal.</span></div>
              </div>

            <p>The argument is plainly valid — yet it seems to be no syllogism. The conclusion's
            terms (<em>head of a horse</em>, <em>head of an animal</em>) never appear in the premise.
            De Morgan concluded that arguments turning on <strong>relations</strong> lie beyond
            syllogistic logic, and the standard story says modern predicate logic (MPL) had to be
            invented to handle them.</p>

            <p>This course tells the other story: Sommers' term logic handles relational arguments
            with the <em>same sign algebra</em> you have been using all along. No variables, no
            quantifier rules — just terms, signs, and cancellation. By the end of this lesson the
            horse's head will have fallen.</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              English normal form for relational statements (The Full Language, Lesson 2):
              <code>±S ±(R ±O)</code> — subject quantity, functor sign, and object quantity inside
              the compound predicate. <code>−Man+(Lov+Woman)</code>: every man loves some woman.
              Singular terms (UDTs) take wild quantity and an asterisk: <code>±Mary*</code>.
            </div>
          `
        },

        // ── Concept: The Dictum Reaches Inside ───────────────────────────────
        {
          type: "concept",
          id: "ddo-inside",
          title: "2. The Dictum Reaches Inside Parentheses",
          content: `
            <p>Recall the engine of every syllogism (The Full Language, Lesson 6):</p>

            <div class="grammar-rule">
              <span class="g-label">Dictum de Omni (DDO)</span>
              Whatever characterizes every X also characterizes any X. The <strong>donor</strong>
              premise (<code>−X+Y</code>, universal, X distributed) licenses substituting Y for X
              in the <strong>host</strong> premise, where X occurs undistributed (+).
            </div>

            <p>Here is the extension that unlocks relational arguments — and it is barely an
            extension at all: <strong>the host occurrence of the middle term may sit inside a
            relational complex.</strong> If some boy loves some girl, and every girl is a student,
            then whatever holds of every girl holds of the girl he loves:</p>

            ${syl([["+Boy+(Lov+Girl)", "some boy loves some girl — host: Girl occurs +"],
                   ["−Girl+Student", "every girl is a student — donor: Girl occurs −"]],
                  ["+Boy+(Lov+Student)", "some boy loves some student"])}

            <p>Algebraically nothing new happens. Sum the premises; the middle term cancels;
            what the donor donates lands exactly where the middle term used to be — even though
            that position is inside the parentheses:</p>

            <div class="step-trace">
              <div class="step"><code>+Boy+(Lov+Girl) &nbsp;+&nbsp; (−Girl+Student)</code></div>
              <div class="step step-reduce"><span>Girl occurs + in the host (inside the complex) and − in the donor.</span></div>
              <div class="step step-reduce"><code>+Boy+(Lov + Student) + (+Girl − Girl)</code></div>
              <div class="step step-reduce"><code>+Boy+(Lov+Student)</code><span class="step-note">Girl cancels ✓ — Student takes its place in the complex</span></div>
            </div>

            <div class="grammar-rule">
              <span class="g-label">Cancellation Is Position-Blind</span>
              A middle term cancels wherever it occurs — subject slot, predicate slot, or inside
              a relational complex — provided it occurs + in one premise (host) and − in the
              other (donor). The donated term inherits the middle term's exact position.
            </div>

            <p>The middle term can equally well be the <em>subject</em> of the relational premise.
            If some dog chases some cat, and every dog is a pet, then some pet chases some cat:</p>

            ${syl([["+Dog+(Chases+Cat)", "host: Dog occurs + (subject slot)"],
                   ["−Dog+Pet", "donor: Dog occurs −"]],
                  ["+Pet+(Chases+Cat)", "some pet chases some cat"])}
          `
        },

        // ── Exercise: Complete the Syllogism ─────────────────────────────────
        {
          type: "exercise",
          id: "ex-complete",
          title: "Quick Check: Complete the Syllogism",
          instruction: "Sum the premises, cancel the middle term, and pick the conclusion the algebra yields.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Premises:", "+Journalist+(Interviewed+Senator) &nbsp;·&nbsp; −Senator+Politician"),
              choices: ["+Journalist+(Interviewed+Politician)", "+Journalist+(Interviewed−Politician)", "−Journalist+(Interviewed+Politician)", "+Senator+(Interviewed+Journalist)"],
              answer: 0,
              explanation: "Senator occurs + in the host (inside the complex) and − in the donor. They cancel; Politician lands in Senator's position: +Journalist+(Interviewed+Politician) — some journalist interviewed some politician."
            },
            {
              promptHtml: mcPrompt("Premises:", "−Student+(Reads+Novel) &nbsp;·&nbsp; −Novel+Book"),
              choices: ["−Student+(Reads+Book)", "+Student+(Reads+Book)", "−Student+(Reads−Book)", "−Novel+(Reads+Student)"],
              answer: 0,
              explanation: "Novel occurs + in the host complex, − in the donor. Cancel and substitute: −Student+(Reads+Book) — every student reads some book. The subject's quantity sign is untouched by the cancellation."
            },
            {
              promptHtml: mcPrompt("Premises:", "+Dog+(Chases+Cat) &nbsp;·&nbsp; −Cat+Mammal"),
              choices: ["+Dog+(Chases+Mammal)", "+Mammal+(Chases+Cat)", "+Dog+(Chases−Mammal)", "−Dog+(Chases+Mammal)"],
              answer: 0,
              explanation: "The middle term is Cat: + in the host (object slot of the complex), − in the donor. Mammal replaces Cat inside the complex: +Dog+(Chases+Mammal)."
            },
            {
              promptHtml: mcPrompt("Premises:", "+Child+(Trusts+Doctor) &nbsp;·&nbsp; −Child+Patient"),
              choices: ["+Patient+(Trusts+Doctor)", "+Child+(Trusts+Patient)", "−Patient+(Trusts+Doctor)", "+Doctor+(Trusts+Patient)"],
              answer: 0,
              explanation: "This time the middle term (Child) is the relational premise's subject. Child occurs + in the host's subject slot, − in the donor. Patient takes the subject position: +Patient+(Trusts+Doctor) — some patient trusts some doctor."
            }
          ]
        },

        // ── Concept: When the Dictum Does Not Apply ──────────────────────────
        {
          type: "concept",
          id: "ddo-fails",
          title: "3. When the Dictum Does Not Apply",
          content: `
            <p>The dictum's two requirements do not relax inside parentheses. The middle term
            must occur <strong>+ in the host</strong> and <strong>− in the donor</strong>.
            Watch both failure modes.</p>

            <p><strong>Failure 1: the host occurrence is − (universal object).</strong>
            "Bob loves every girl; every girl is a student; therefore Bob loves every student"?</p>

            ${syl([["±Bob*+(Lov−Girl)", "Bob loves every girl — Girl occurs −"],
                   ["−Girl+Student", "every girl is a student — Girl occurs − again"]],
                  ["±Bob*+(Lov−Student) ??", "Bob loves every student — INVALID"])}

            <div class="step-trace">
              <div class="step"><code>±Bob*+(Lov−Girl) &nbsp;+&nbsp; (−Girl+Student)</code></div>
              <div class="step step-reduce"><span>Girl occurs − in <em>both</em> premises. Same signs never cancel.</span></div>
              <div class="step step-reduce"><code>±Bob* + Lov − Girl − Girl + Student</code><span class="step-note">leftover Girl terms — the sum is not the conclusion ✗</span></div>
            </div>

            <p>And rightly so: there may be students who are not girls, and nothing says Bob loves
            <em>them</em>. The algebra's refusal to cancel is the logic's refusal to infer.</p>

            <p><strong>Failure 2: the donor is particular.</strong> "Some cat chases some mouse;
            some mouse is a pet; therefore some cat chases some pet"?</p>

            ${syl([["+Cat+(Chases+Mouse)", "host: Mouse occurs +"],
                   ["+Mouse+Pet", "'donor' is particular — Mouse occurs +"]],
                  ["+Cat+(Chases+Pet) ??", "INVALID"])}

            <p>Both occurrences of Mouse are + — no cancellation. And intuitively: the mouse being
            chased and the mouse that is a pet may be <em>different mice</em>. Only a universal
            premise can donate: DDO needs "every."</p>

            <div class="callout-note">
              <span class="cn-label">Regularity Still Rules</span>
              REGAL's regularity condition applies to relational syllogisms unchanged. Two
              particular premises (as in Failure 2) can never yield a valid conclusion; a
              particular conclusion needs exactly one particular premise. Wild quantity ±
              counts as + for regularity, exactly as in Introduction Lesson 7.
            </div>
          `
        },

        // ── Exercise: Valid or Invalid ───────────────────────────────────────
        {
          type: "exercise",
          id: "ex-relational-validity",
          title: "Quick Check: Valid or Invalid?",
          instruction: "Judge each relational syllogism. Check that the middle term occurs + in one premise and − in the other, and that the mood is regular.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl([["+Boy+(Lov+Girl)", ""], ["−Girl+Student", ""]], ["+Boy+(Lov+Student)", ""]),
              answer: "valid",
              explanation: "Girl occurs + in the host complex and − in the donor: cancels. Mood: one particular premise, particular conclusion — P-regular ✓. Valid."
            },
            {
              exprHtml: syl([["±Bob*+(Lov−Girl)", ""], ["−Girl+Student", ""]], ["±Bob*+(Lov−Student)", ""]),
              answer: "invalid",
              explanation: "Girl occurs − in both premises — no cancellation, so equality fails. Loving every girl plus every girl being a student does not reach every student. Invalid."
            },
            {
              exprHtml: syl([["−Philosopher+(Admires±Socrates*)", ""], ["±Socrates*+Stoic", ""]], ["−Philosopher+(Admires+Stoic)", ""]),
              answer: "valid",
              explanation: "The middle term is the UDT Socrates. Wild quantity serves as needed: + in the host complex, − in the donor subject — cancellation goes through, and Stoic lands in the object slot. Valid: every philosopher admires some Stoic (namely Socrates)."
            },
            {
              exprHtml: syl([["+Cat+(Chases+Mouse)", ""], ["+Mouse+Rodent", ""]], ["+Cat+(Chases+Rodent)", ""]),
              answer: "invalid",
              explanation: "Two failures at once: Mouse occurs + in both premises (no cancellation), and the mood has two particular premises (irregular). The chased mouse and the rodent mouse may differ. Invalid."
            },
            {
              exprHtml: syl([["−Doctor+(Treats+Patient)", ""], ["−Patient+Person", ""]], ["−Doctor+(Treats+Person)", ""]),
              answer: "valid",
              explanation: "Patient: + in the host complex, − in the donor — cancels, Person substitutes in place. Mood: all three statements universal — U-regular ✓. Valid: every doctor treats some person."
            }
          ]
        },

        // ── Concept: The Horse's Head Falls ──────────────────────────────────
        {
          type: "concept",
          id: "horse-head",
          title: "4. The Horse’s Head Falls",
          content: `
            <p>Back to De Morgan. The premise "every horse is an animal" is a perfect donor —
            <code>−Horse+Animal</code>. What the argument seems to lack is a host premise
            containing <code>+Horse</code>. But relational terms hand us one for free.</p>

            <p><strong>Every head of a horse is a head of a horse.</strong> A tautology — true no
            matter what — so we may add it as a premise at no cost. In ENF, with
            <code>Head</code> as the relation:</p>

            <div class="syntax-box"><code>−(Head+Horse)+(Head+Horse)</code></div>

            <p>The predicate side contains exactly what we need: <code>Horse</code> occurring
            undistributed (+) inside the complex <code>+(Head+Horse)</code>. The dictum does the
            rest:</p>

            <div class="step-trace">
              <div class="step"><code>−(Head+Horse)+(Head+Horse) &nbsp;+&nbsp; (−Horse+Animal)</code></div>
              <div class="step step-reduce"><span>Horse in the <em>predicate-side</em> complex occurs +; the donor's Horse occurs −. Cancel and substitute.</span></div>
              <div class="step step-reduce"><code>−(Head+Horse)+(Head+Animal)</code><span class="step-note">every head of a horse is a head of an animal ✓</span></div>
            </div>

            <p>De Morgan's "impossible" argument is a one-step syllogism — an enthymeme whose
            missing premise is a tautology. The subject-side occurrence of Horse stays put:
            the donor cancels only the <em>undistributed</em> (+) occurrence, and inside
            <code>−(Head+Horse)</code> the subject's − sign governs Horse. Making that notion —
            which occurrences count as distributed — fully precise is the business of the next
            lesson.</p>

            <div class="grammar-rule">
              <span class="g-label">The Tautology Move</span>
              For any relation R and term T, <code>−(R+T)+(R+T)</code> is a logical truth and
              may be introduced as a premise whenever needed. It supplies a host occurrence of
              T for any donor <code>−T+Y</code>, yielding <code>−(R+T)+(R+Y)</code>.
            </div>
          `
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-dictum-final",
          isFinal: true,
          title: "Final Review: The Dictum at Work",
          instruction: "Transcription, cancellation, and the tautology move — everything from this lesson.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "Every voter trusts some candidate.",
              choices: ["−Voter+(Trusts+Candidate)", "+Voter+(Trusts+Candidate)", "−Voter+(Trusts−Candidate)", "−Candidate+(Trusts+Voter)"],
              answer: 0,
              explanation: "Universal subject (−Voter), affirmed functor (+), particular object inside the complex (+Candidate): −Voter+(Trusts+Candidate)."
            },
            {
              promptHtml: mcPrompt("Premises:", "+Lawyer+(Cites+Ruling) &nbsp;·&nbsp; −Ruling+Precedent"),
              choices: ["+Lawyer+(Cites+Precedent)", "−Lawyer+(Cites+Precedent)", "+Lawyer+(Cites−Precedent)", "+Ruling+(Cites+Lawyer)"],
              answer: 0,
              explanation: "Ruling occurs + in the host complex and − in the donor: cancel, substitute Precedent. +Lawyer+(Cites+Precedent) — some lawyer cites some precedent."
            },
            {
              promptHtml: mcPrompt("Which premise pair validly yields:", "+Nurse+(Assists+Surgeon)"),
              choices: [
                "+Nurse+(Assists+Resident) and −Resident+Surgeon",
                "+Nurse+(Assists−Resident) and −Resident+Surgeon",
                "+Nurse+(Assists+Resident) and +Resident+Surgeon",
                "−Surgeon+(Assists+Nurse) and −Resident+Surgeon"
              ],
              answer: 0,
              explanation: "Only the first pair has the middle term Resident + in the host and − in the donor. The second has Resident − in both (no cancellation); the third has a particular donor; the fourth never mentions a host occurrence of Resident at all."
            },
            {
              promptHtml: mcPrompt("The tacit tautological premise that validates:", "−Senator+Politician ∴ −(Friend+Senator)+(Friend+Politician)"),
              choices: [
                "−(Friend+Senator)+(Friend+Senator)",
                "−(Friend+Politician)+(Friend+Politician)",
                "−Senator+(Friend+Politician)",
                "+Senator+(Friend+Senator)"
              ],
              answer: 0,
              explanation: "The tautology move: every friend of a senator is a friend of a senator. Its predicate side supplies +Senator inside the complex; the donor −Senator+Politician cancels it, yielding −(Friend+Senator)+(Friend+Politician)."
            },
            {
              promptHtml: mcPrompt("Valid or not, and why:", "±Ada*+(Reads−Manuscript) · −Manuscript+Document ∴ ±Ada*+(Reads−Document)"),
              choices: [
                "Invalid — the middle term occurs − in both premises",
                "Valid — Manuscript cancels against the donor",
                "Invalid — a UDT cannot appear in a relational premise",
                "Valid — wild quantity makes any singular argument valid"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Reading every manuscript and every manuscript being a document does not extend Ada's reading to every document. Algebraically: Manuscript is − in the host complex and − in the donor — same signs, no cancellation, equality fails."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 2: Distributed Terms and DDO
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-02",
      title: "Lesson 2: Distributed Terms and DDO",
      navTitle: "Distribution",
      description: "Make 'distributed' computable: multiply the signs that govern a term occurrence — even one buried inside nested relational complexes — and state the dictum de omni in its final, precise form.",
      completionText: "Distribution is now arithmetic: the net sign of an occurrence is the product of its own sign and every sign governing its enclosing complexes. The dictum reads exactly as the algebra does — cancel a distributed occurrence against an undistributed one — and whole relational complexes can be donated, not just simple terms. In the final lesson of this course you'll meet arguments where no direct cancellation works at all, and prove them valid indirectly: by refuting their counterclaims, with proterms carrying distribution across statements.",
      blocks: [

        // ── Concept: Why Distribution Needs Computing ────────────────────────
        {
          type: "concept",
          id: "why-compute",
          title: "1. Why Distribution Needs Computing",
          content: `
            <p>Last lesson ended on a promissory note. In the horse's-head argument, the
            tautology <code>−(Head+Horse)+(Head+Horse)</code> contains <em>two</em> occurrences
            of Horse — yet the donor <code>−Horse+Animal</code> cancelled only the predicate-side
            one. Why that one?</p>

            <p>Recall what distribution means. A statement <strong>distributes</strong> a term
            when it commits itself about the term's <em>whole</em> extension — "every horse,"
            "no horse." It leaves the term <strong>undistributed</strong> when it commits itself
            only to <em>part</em> — "some horse." In simple monadic statements one sign settles
            it: the subject of <code>−S+P</code> is distributed, the subject of <code>+S+P</code>
            is not.</p>

            <p>But a term buried inside a relational complex is governed by more than its own
            sign. In <code>+Man−(Lov+Woman)</code> — "some man does not love any woman" — the
            sign written on Woman is +, yet the statement plainly speaks of <em>all</em> women:
            not loving <em>any</em> of them. The denial sign outside the parenthesis reaches
            inside and flips Woman's force.</p>

            <p>So distribution inside complexes must be <em>computed</em>, not read off a single
            sign. The computation is one multiplication.</p>
          `
        },

        // ── Concept: The Net Sign Rule ───────────────────────────────────────
        {
          type: "concept",
          id: "net-sign-rule",
          title: "2. The Net Sign Rule",
          content: `
            <div class="grammar-rule">
              <span class="g-label">Net Sign Rule</span>
              The <strong>net sign</strong> of a term occurrence is the product of its own
              quantity sign and every sign governing an enclosing complex. Net − means
              <strong>distributed</strong>; net + means <strong>undistributed</strong>.
            </div>

            <p>Sign multiplication works as in ordinary algebra: like signs give +, unlike
            signs give −. Each minus a term sits under flips its force once; two minuses
            cancel.</p>

            <div class="ex-table">
              <div class="ex-row"><code>−Man+(Lov+Woman)</code><span>Woman: (+)(+) = <strong>+</strong> undistributed — "loves <em>some</em> woman"</span></div>
              <div class="ex-row"><code>−Man+(Lov−Woman)</code><span>Woman: (+)(−) = <strong>−</strong> distributed — "loves <em>every</em> woman"</span></div>
              <div class="ex-row"><code>+Man−(Lov+Woman)</code><span>Woman: (−)(+) = <strong>−</strong> distributed — "doesn't love <em>any</em> woman"</span></div>
              <div class="ex-row"><code>+Man−(Lov−Woman)</code><span>Woman: (−)(−) = <strong>+</strong> undistributed — "doesn't love every woman" leaves <em>some</em> woman unloved</span></div>
              <div class="ex-row"><code>−(Head+Horse)</code><span>Horse: (−)(+) = <strong>−</strong> distributed — the subject complex's − governs it</span></div>
            </div>

            <p>The last two rows are the payoff cases. "Some man does not love every woman"
            <em>sounds</em> like it is about all women, but the two minuses cancel: it only
            commits to some woman who goes unloved. And the horse's head mystery dissolves:
            in <code>−(Head+Horse)+(Head+Horse)</code>, the subject-side Horse computes to
            (−)(+) = − distributed, while the predicate-side Horse computes to (+)(+) = +
            undistributed. The donor — needing an undistributed occurrence to feed — could
            only take the predicate side.</p>

            <p>The rule extends to any nesting depth: multiply <em>all</em> the signs on the
            way in. In <code>−Boy+(Lov+(Adm−Teacher))</code> — "every boy loves some admirer
            of every teacher" — Teacher's net sign is (+)(+)(−) = <strong>−</strong>:
            distributed.</p>

            <div class="callout-note">
              <span class="cn-label">Wild Quantity</span>
              A UDT occurrence <code>±Socrates*</code> computes with whichever value the
              inference needs — its ± multiplies out as + or − at your convenience, exactly
              as in Lesson 1 and Introduction Lesson 7.
            </div>
          `
        },

        // ── Exercise: Compute the Net Sign ───────────────────────────────────
        {
          type: "exercise",
          id: "ex-net-sign",
          title: "Quick Check: Distributed or Undistributed?",
          instruction: "Compute the net sign of the named term: multiply its own sign by every sign governing its enclosing complexes.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Woman, in:", "−Man−(Lov+Woman)"),
              choices: ["Distributed — net (−)(+) = −", "Undistributed — net +", "Distributed — net (−)(−) = +", "Cannot be computed"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The functor sign − governs the complex; Woman's own sign is +. Net: (−)(+) = − distributed. 'No man loves any woman' commits about every woman."
            },
            {
              promptHtml: mcPrompt("Book, in:", "+Student−(Reads−Book)"),
              choices: ["Undistributed — net (−)(−) = +", "Distributed — net −", "Undistributed — the subject is particular", "Distributed — Book carries −"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Two minuses govern Book: the denial functor − and its own −. Net: (−)(−) = + undistributed. 'Some student doesn't read every book' only commits to some unread book."
            },
            {
              promptHtml: mcPrompt("Senator, in:", "−(Friend+Senator)+(Friend+Politician)"),
              choices: ["Distributed — net (−)(+) = −", "Undistributed — net (+)(+) = +", "Distributed — net (+)(−) = −", "Undistributed — Senator is inside parentheses"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Senator sits in the subject-side complex, governed by the subject's − quantity sign; its own sign is +. Net: (−)(+) = − distributed. (Compare the predicate-side Politician: (+)(+) = + undistributed.)"
            },
            {
              promptHtml: mcPrompt("Teacher, in:", "+Boy−(Lov+(Adm−Teacher))"),
              choices: ["Undistributed — net (−)(+)(−) = +", "Distributed — net (+)(+)(−) = −", "Distributed — Teacher carries −", "Undistributed — nesting blocks distribution"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Three signs govern Teacher: the denial functor (−), the inner complex's quantity (+), and its own (−). Net: (−)(+)(−) = + undistributed. Every minus on the way in flips the force once; two flips cancel."
            }
          ]
        },

        // ── Concept: DDO, Stated Precisely ───────────────────────────────────
        {
          type: "concept",
          id: "ddo-precise",
          title: "3. The Dictum, Stated Precisely",
          content: `
            <p>With net signs in hand, the dictum de omni takes its final form — and it is
            nothing but the algebra read aloud:</p>

            <div class="grammar-rule">
              <span class="g-label">DDO (Final Form)</span>
              A donor premise containing a <strong>distributed</strong> (net −) occurrence of M
              licenses substituting what it donates for an <strong>undistributed</strong>
              (net +) occurrence of M in the host — whatever position that occurrence holds.
              Algebraically: net-opposite occurrences cancel in the sum.
            </div>

            <p>Two consequences follow immediately — the classical "distribution rules" of the
            syllogism, now theorems of the sign algebra rather than memorized regulations:</p>

            <ul>
              <li><strong>The middle term must be distributed exactly once.</strong> Cancellation
              needs one net − occurrence against one net + occurrence. Two undistributed
              occurrences (the classic <em>undistributed middle</em>) or two distributed ones
              leave residue in the sum.</li>
              <li><strong>No term may be distributed in the conclusion that was undistributed in
              its premise.</strong> Summation preserves the net signs of the surviving terms —
              a conclusion demanding net − where the premises supplied net + (the classic
              <em>illicit process</em>) cannot be the premises' sum.</li>
            </ul>

            <p>And one genuinely new power: <strong>what a donor donates need not be a simple
            term.</strong> A relational complex can be donated whole. If every boy loves some
            girl, and every girl admires every teacher:</p>

            ${syl([["−Boy+(Lov+Girl)", "host: Girl occurs net (+)(+) = +"],
                   ["−Girl+(Adm−Teacher)", "donor: Girl net −; donates the complex (Adm−Teacher)"]],
                  ["−Boy+(Lov+(Adm−Teacher))", "every boy loves some admirer of every teacher"])}

            <div class="step-trace">
              <div class="step"><code>−Boy+(Lov+Girl) &nbsp;+&nbsp; (−Girl+(Adm−Teacher))</code></div>
              <div class="step step-reduce"><span>Girl: net + in the host, net − in the donor — cancel.</span></div>
              <div class="step step-reduce"><code>−Boy+(Lov+(Adm−Teacher))</code><span class="step-note">the whole complex (Adm−Teacher) lands in Girl's position ✓</span></div>
            </div>

            <p>The conclusion nests one complex inside another — and the net sign rule from
            this lesson is exactly what lets you keep reading it: Teacher's net sign in the
            conclusion is (+)(+)(−) = −, just as it was in the donor. Nothing was smuggled.</p>
          `
        },

        // ── Exercise: Valid or Invalid ───────────────────────────────────────
        {
          type: "exercise",
          id: "ex-distribution-validity",
          title: "Quick Check: Valid or Invalid?",
          instruction: "Compute net signs before you judge. The middle term needs one net − and one net + occurrence; conclusion terms must keep their premise net signs.",
          kind: "valid-or-invalid",
          items: [
            {
              exprHtml: syl([["−Boy+(Lov+Girl)", ""], ["−Girl+(Adm−Teacher)", ""]], ["−Boy+(Lov+(Adm−Teacher))", ""]),
              answer: "valid",
              explanation: "Girl: net + in the host, net − in the donor — cancels, and the donated complex (Adm−Teacher) takes its position. U-regular (all universal). Valid."
            },
            {
              exprHtml: syl([["+Critic+(Praises+Film)", ""], ["+Film+Masterpiece", ""]], ["+Critic+(Praises+Masterpiece)", ""]),
              answer: "invalid",
              explanation: "Film computes net + in both premises — undistributed middle, no cancellation. (Also irregular: two particular premises.) The praised film and the masterpiece film may differ. Invalid."
            },
            {
              exprHtml: syl([["+Editor−(Rejects+Manuscript)", ""], ["−Manuscript+Submission", ""]], ["+Editor−(Rejects+Submission)", ""]),
              answer: "invalid",
              explanation: "Careful: in the host, Manuscript's net sign is (−)(+) = − distributed; the donor's Manuscript is also − distributed. Two net-minus occurrences never cancel. ('Rejects no manuscript' plus 'every manuscript is a submission' cannot reach 'rejects no submission' — there may be submissions that aren't manuscripts.) Invalid."
            },
            {
              exprHtml: syl([["±Ada*+(Reads+Manuscript)", ""], ["−Manuscript+Document", ""]], ["±Ada*+(Reads+Document)", ""]),
              answer: "valid",
              explanation: "Manuscript: net (+)(+) = + in the host, net − in the donor — cancels; Document substitutes in place. P-regular with the wild ± counting as +. Valid."
            },
            {
              exprHtml: syl([["+Donor+(Funds+Charity)", ""], ["−Charity+Nonprofit", ""]], ["+Donor+(Funds−Nonprofit)", ""]),
              answer: "invalid",
              explanation: "The cancellation itself is fine — Charity net + in the host, net − in the donor — but the conclusion writes Nonprofit with net (+)(−) = − distributed, while the donor supplied it undistributed (net + in −Charity+Nonprofit). Illicit process: a conclusion may not distribute what its premise did not. The valid conclusion is +Donor+(Funds+Nonprofit)."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-distribution-final",
          isFinal: true,
          title: "Final Review: Distribution",
          instruction: "Net signs, the precise dictum, and complex donation.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("Horse, in the subject complex of:", "−(Head+Horse)+(Head+Animal)"),
              choices: ["Distributed — net (−)(+) = −", "Undistributed — net (+)(+) = +", "Distributed — net (−)(−) = +", "Undistributed — only predicates distribute"],
              choicesAreCode: false,
              answer: 0,
              explanation: "The subject complex is governed by −; Horse's own sign is +. Net (−)(+) = − distributed. This is why Lesson 1's donor could not feed the subject-side occurrence."
            },
            {
              prompt: "Why must the middle term be distributed exactly once in a valid syllogism?",
              choices: [
                "Cancellation requires one net − occurrence against one net + occurrence",
                "Tradition: the rule was fixed by medieval logicians",
                "Because the donor premise must be particular",
                "Because relational complexes can only hold undistributed terms"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Equality demands the middle vanish from the sum, and signed terms vanish only as net-opposite pairs. Two net + occurrences (undistributed middle) or two net − occurrences leave residue. The classical rule is an algebraic theorem."
            },
            {
              promptHtml: mcPrompt("Premises:", "−Voter+(Trusts+Auditor) &nbsp;·&nbsp; −Auditor+(Reviews−Budget)"),
              choices: [
                "−Voter+(Trusts+(Reviews−Budget))",
                "−Voter+(Trusts+Auditor+Reviews)",
                "−Voter+(Reviews−Budget)",
                "−Auditor+(Trusts+(Reviews−Budget))"
              ],
              answer: 0,
              explanation: "Auditor: net + in the host, net − in the donor — cancel, and the donor donates its whole complex (Reviews−Budget) into Auditor's position: every voter trusts some reviewer of every budget."
            },
            {
              promptHtml: mcPrompt("What blocks:", "+Chef−(Uses+Additive) · −Additive+Chemical ∴ +Chef−(Uses+Chemical)"),
              choices: [
                "The host's Additive computes net (−)(+) = − — two distributed occurrences, no cancellation",
                "Nothing — the argument is valid",
                "The conclusion is irregular",
                "UDTs cannot appear under a denial functor"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The denial functor reaches inside: Additive's net sign in the host is (−)(+) = −, and the donor's is − too. No net + occurrence exists for the donor to feed. 'Uses no additive' plus 'every additive is a chemical' says nothing about all chemicals."
            },
            {
              prompt: "A conclusion writes term T with net sign −, but T's occurrence in its premise had net sign +. The argument is:",
              choices: [
                "Invalid — illicit process: summation preserves net signs",
                "Valid if the middle term cancels",
                "Valid if T is a UDT",
                "Invalid only when T is the middle term"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The conclusion must be the algebraic sum of the premises, and surviving terms keep their net signs through the sum. A net − demand where the premises supplied net + cannot balance — regardless of what the middle term does."
            }
          ]
        }

      ]
    },

    // ════════════════════════════════════════════════════════════════════════
    // LESSON 3: Indirect Proofs and Distributed Proterms
    // ════════════════════════════════════════════════════════════════════════
    {
      id: "lesson-03",
      title: "Lesson 3: Indirect Proofs and Distributed Proterms",
      navTitle: "Indirect Proof",
      description: "When no single cancellation settles an argument, refute its counterclaim step by step — pronominalize the particulars, let proterms carry fixed reference through the proof, and read their wild quantity distributed exactly where the inference needs it.",
      completionText: "Course complete! Indirect proof turns the counterclaim principle into a working procedure: pronominalize the particular statements, push consequences through with DDO, and force a proterm contradiction. Distributed proterms are TFL's answer to MPL's instantiation rules — wild quantity on fixed reference, no variables required. Together with the dictum and the net sign rule, you now have the full relational syllogistic of Chapter 6. Course 4 turns to statement logic: proofs, trees, and the bridge between TFL and modern predicate logic.",
      blocks: [

        // ── Concept: When One Cancellation Isn't Enough ──────────────────────
        {
          type: "concept",
          id: "beyond-direct",
          title: "1. When One Cancellation Isn’t Enough",
          content: `
            <p>Every argument so far fell to a single application of the dictum: sum the
            premises, cancel the middle, read off the conclusion. But consider:</p>

            ${engSyl("Some boy loves some girl.", "No boy loves any coward.", "Some girl is not a coward.")}

            <div class="proof-box">
              <div class="proof-row"><code>+Boy+(Lov+Girl)</code><span class="proof-note">Premise 1</span></div>
              <div class="proof-row"><code>−Boy−(Lov+Coward)</code><span class="proof-note">Premise 2</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">∴</span><code>+Girl−Coward</code><span class="proof-note">Conclusion</span></div>
            </div>

            <p>The argument is valid — if the girl he loves were a coward, the boy would love
            a coward, which premise 2 forbids. But try to sum the premises: the candidate middle
            terms tangle. Boy occurs + in premise 1 and − in premise 2, yet what cancels must
            take the whole complex <code>(Lov+Girl)</code> against <code>(Lov+Coward)</code> —
            and those are different terms. No single cancellation yields the conclusion.</p>

            <p>The way through is a principle you already own. Recall from The Full Language,
            Lesson 5:</p>

            <div class="grammar-rule">
              <span class="g-label">Principle of Validity (PV)</span>
              An argument is valid if and only if its counterclaim — all premises conjoined
              with the contradictory of the conclusion — is inconsistent.
            </div>

            <p>There you <em>checked</em> counterclaims algebraically. Here you will
            <strong>refute</strong> them: assume the counterclaim outright, derive consequences
            with the dictum, and force an explicit contradiction. This is <strong>indirect
            proof</strong> — and to run it, you need a way to hold onto <em>particular
            individuals</em> across proof steps. That is what proterms were made for.</p>

            <div class="callout-note">
              <span class="cn-label">Recall</span>
              Contradictories flip both leading signs — subject quantity and functor quality —
              and leave the complex internals alone: the contradictory of <code>+Girl−Coward</code>
              is <code>−Girl+Coward</code>; the contradictory of <code>−Boy+(Lov+Girl)</code>
              is <code>+Boy−(Lov+Girl)</code>.
            </div>
          `
        },

        // ── Concept: Pronominalization ───────────────────────────────────────
        {
          type: "concept",
          id: "pronominalization",
          title: "2. Pronominalization: Fixing Reference Mid-Proof",
          content: `
            <p>A particular statement asserts that <em>something</em> exists — some boy who loves
            some girl. In a proof you want to talk about <em>that</em> boy and <em>that</em> girl
            in later lines. Proterms (The Full Language, Lesson 4) do exactly this: a prime
            superscript marks co-denoting occurrences, and pronoun occurrences take wild
            quantity ±.</p>

            <div class="grammar-rule">
              <span class="g-label">Pronominalization Rule</span>
              A <strong>particular</strong> statement in a proof may be rewritten with fresh
              proterms fixing its witnesses: from <code>+Boy+(Lov+Girl)</code> infer
              <code>±Boy'+(Lov±Girl')</code> — <em>that boy loves that girl</em> — together
              with the anchor statements <code>±Boy'+Boy</code> and <code>±Girl'+Girl</code>.
            </div>

            <p>Three points of discipline:</p>
            <ul>
              <li><strong>Only particulars introduce individuals.</strong> A universal
              <code>−S+P</code> says <em>if</em> anything is S it is P — it hands you no witness
              to name. Pronominalizing a universal is an illegal move.</li>
              <li><strong>Fresh primes each time.</strong> A second pronominalization in the same
              proof uses new markers (<code>''</code>) — different witnesses must not be
              conflated.</li>
              <li><strong>UDTs need no introduction.</strong> A singular term <code>±Socrates*</code>
              already has fixed reference; it behaves as its own proterm.</li>
            </ul>

            <p>The anchor statements are what let the dictum reach the witnesses. From
            <code>±Boy'+Boy</code> — "that boy is a boy" — any donor about all boys can now be
            brought to bear on <em>him</em>:</p>

            <div class="step-trace">
              <div class="step"><code>±Boy'+Boy &nbsp;+&nbsp; (−Boy−(Lov+Coward))</code></div>
              <div class="step step-reduce"><span>Boy: net + in the anchor (host), net − in the donor — cancel.</span></div>
              <div class="step step-reduce"><code>±Boy'−(Lov+Coward)</code><span class="step-note">that boy loves no coward ✓</span></div>
            </div>
          `
        },

        // ── Exercise: Contradictories and Pronominalization ──────────────────
        {
          type: "exercise",
          id: "ex-pronominalize",
          title: "Quick Check: Setting Up the Counterclaim",
          instruction: "Form contradictories and apply the pronominalization rule correctly.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("The contradictory of:", "+Girl−Coward"),
              choices: ["−Girl+Coward", "+Girl+Coward", "−Girl−Coward", "+Coward−Girl"],
              answer: 0,
              explanation: "Flip both leading signs: quantity + → − and quality − → +. 'Some girl is not a coward' contradicts 'every girl is a coward.'"
            },
            {
              promptHtml: mcPrompt("The contradictory of:", "−Boy+(Lov+Girl)"),
              choices: ["+Boy−(Lov+Girl)", "−Boy−(Lov+Girl)", "+Boy+(Lov−Girl)", "−Girl+(Lov+Boy)"],
              answer: 0,
              explanation: "Flip the subject quantity (− → +) and the functor (+ → −); the complex's internals stay untouched. 'Every boy loves some girl' contradicts 'some boy loves no girl.'"
            },
            {
              promptHtml: mcPrompt("Which statement may be pronominalized?", "−Dog+Pet &nbsp;·&nbsp; +Cat+(Chases+Mouse) &nbsp;·&nbsp; −Bird−(Eats+Seed)"),
              choices: ["+Cat+(Chases+Mouse) — it is particular", "−Dog+Pet — it is the shortest", "−Bird−(Eats+Seed) — denials introduce witnesses", "All three"],
              choicesAreCode: false,
              answer: 0,
              explanation: "Only particular statements assert existence and hand you witnesses to name. The two universals say only what holds if anything is a dog (or bird) — no individual to fix a proterm on."
            },
            {
              promptHtml: mcPrompt("Pronominalizing", "+Boy+(Lov+Girl)"),
              choices: [
                "±Boy'+(Lov±Girl'), with anchors ±Boy'+Boy and ±Girl'+Girl",
                "−Boy'+(Lov−Girl') — proterms are always universal",
                "±Boy'+(Lov±Boy') — one marker for both terms",
                "+Boy+(Lov+Girl') — only the object gets a marker"
              ],
              answer: 0,
              explanation: "Fresh markers on both witnessed terms, wild quantity on the pronoun occurrences, and one anchor per proterm tying the witness to its kind. The single-marker option would wrongly identify the boy with the girl."
            }
          ]
        },

        // ── Concept: Distributed Proterms ────────────────────────────────────
        {
          type: "concept",
          id: "distributed-proterms",
          title: "3. Distributed Proterms",
          content: `
            <p>Here is the last piece. Suppose mid-proof you have derived:</p>

            <div class="proof-box">
              <div class="proof-row"><code>±Boy'+(Lov±Girl')</code><span class="proof-note">that boy loves that girl</span></div>
              <div class="proof-row"><code>±Girl'+Coward</code><span class="proof-note">that girl is a coward</span></div>
            </div>

            <p>You want to conclude: <em>that boy loves a coward</em>. The dictum needs a donor
            with a <strong>distributed</strong> occurrence of Girl′ — but the second statement
            shows <code>±Girl'</code>, wild. May you read it as −?</p>

            <div class="grammar-rule">
              <span class="g-label">Distributed Proterms</span>
              Yes. A proterm's reference is already fixed by its antecedent, so — exactly as
              with UDTs — the all/some distinction collapses: "she is a coward" and "every one
              of <em>them</em> (namely, she) is a coward" say the same thing. In a proof, a
              proterm occurrence may be read with whichever sign the inference requires.
            </div>

            <div class="step-trace">
              <div class="step"><code>±Boy'+(Lov±Girl') &nbsp;+&nbsp; (−Girl'+Coward)</code><span class="step-note">reading the donor's ± as −</span></div>
              <div class="step step-reduce"><span>Girl′: net + in the host complex, net − in the donor — cancel.</span></div>
              <div class="step step-reduce"><code>±Boy'+(Lov+Coward)</code><span class="step-note">that boy loves a coward ✓</span></div>
            </div>

            <p>This is TFL's counterpart to MPL's instantiation rules — existential
            instantiation when you pronominalize a particular, universal instantiation when a
            donor feeds an anchor — but there are no variables, no scope brackets, and no
            special quantifier rules. Just terms with fixed reference and a wild sign.</p>

            <div class="callout-note">
              <span class="cn-label">The One Restriction</span>
              A ± may be read distributed only when its reference is fixed — by an antecedent
              proterm occurrence earlier in the proof, or by being a UDT. An unanchored ±
              plucked from nowhere proves anything; the antecedent requirement is what keeps
              the wild sign honest.
            </div>
          `
        },

        // ── Concept: A Complete Indirect Proof ───────────────────────────────
        {
          type: "concept",
          id: "full-proof",
          title: "4. A Complete Indirect Proof",
          content: `
            <p>Everything together. To prove: <em>some boy loves some girl; no boy loves any
            coward; therefore some girl is not a coward.</em> Assume the counterclaim — both
            premises plus the contradictory of the conclusion — and refute it:</p>

            <div class="proof-box">
              <div class="proof-row"><code>1.&nbsp; +Boy+(Lov+Girl)</code><span class="proof-note">premise</span></div>
              <div class="proof-row"><code>2.&nbsp; −Boy−(Lov+Coward)</code><span class="proof-note">premise</span></div>
              <div class="proof-row"><code>3.&nbsp; −Girl+Coward</code><span class="proof-note">contradictory of conclusion — assume for refutation</span></div>
              <div class="proof-row"><code>4.&nbsp; ±Boy'+(Lov±Girl')</code><span class="proof-note">pronominalize 1</span></div>
              <div class="proof-row"><code>5.&nbsp; ±Boy'+Boy</code><span class="proof-note">anchor, from 1</span></div>
              <div class="proof-row"><code>6.&nbsp; ±Girl'+Girl</code><span class="proof-note">anchor, from 1</span></div>
              <div class="proof-row"><code>7.&nbsp; ±Girl'+Coward</code><span class="proof-note">DDO: 6 hosts the donor 3 — that girl is a coward</span></div>
              <div class="proof-row"><code>8.&nbsp; ±Boy'+(Lov+Coward)</code><span class="proof-note">DDO: 4 hosts the donor 7, its ± read as − (distributed proterm)</span></div>
              <div class="proof-row"><code>9.&nbsp; ±Boy'−(Lov+Coward)</code><span class="proof-note">DDO: 5 hosts the donor 2 — that boy loves no coward</span></div>
              <div class="proof-row proof-conclusion"><span class="proof-therefore">⊥</span><code>8 contradicts 9</code><span class="proof-note">counterclaim refuted — the argument is valid ✓</span></div>
            </div>

            <p>Lines 8 and 9 say of the <em>same</em> fixed individual — that boy — that he does
            and does not love a coward. No interpretation can satisfy the counterclaim, so by PV
            the original argument is valid.</p>

            <p>Notice the division of labor: pronominalization (line 4–6) names the witnesses,
            anchors host the universal premises (lines 7, 9), and one distributed proterm
            (line 8) moves the derived fact into the relational complex. Every step is a
            cancellation you already know how to check with net signs.</p>
          `
        },

        // ── Exercise: Proof Steps ────────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-proof-steps",
          title: "Quick Check: Justify the Step",
          instruction: "Each item shows a proof situation. Pick the correct step or diagnosis.",
          kind: "multiple-choice",
          items: [
            {
              promptHtml: mcPrompt("From lines", "±Cat'+Cat &nbsp;and&nbsp; −Cat−(Fears+Dog)"),
              choices: ["±Cat'−(Fears+Dog)", "±Cat'+(Fears+Dog)", "−Cat'−(Fears−Dog)", "Nothing follows — proterms cannot host"],
              answer: 0,
              explanation: "The anchor ±Cat'+Cat hosts (Cat net +); the universal premise donates its whole predicate: that cat fears no dog. Anchors exist precisely to give donors a way to reach the witness."
            },
            {
              promptHtml: mcPrompt("From lines", "±Owl'+(Watches±Mouse') &nbsp;and&nbsp; ±Mouse'+Rodent"),
              choices: [
                "±Owl'+(Watches+Rodent) — read the donor's ± as −",
                "Nothing follows — ±Mouse'+Rodent is particular",
                "±Owl'+(Watches−Rodent)",
                "±Mouse'+(Watches+Owl')"
              ],
              answer: 0,
              explanation: "Mouse′ is a proterm with fixed reference, so its ± may be read distributed (−), making the second line a donor. Cancellation inside the complex puts Rodent in Mouse′'s position, undistributed."
            },
            {
              promptHtml: mcPrompt("What is wrong with this step: from", "−Fish+Swimmer &nbsp;infer&nbsp; ±Fish'+Swimmer"),
              choices: [
                "Universals cannot be pronominalized — they provide no witness",
                "Nothing — any statement may be pronominalized",
                "The prime should be on Swimmer",
                "The inferred statement needs a − on Fish′"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "A universal says what holds if anything is a fish; it does not assert that any fish exists. Only particular statements (and UDTs, which carry their own reference) introduce individuals a proterm can name."
            },
            {
              promptHtml: mcPrompt("An indirect proof of", "−A+B, −B+C ∴ −A+C &nbsp;(Barbara)"),
              choices: [
                "Assume +A−C; pronominalize it; anchors host both premises; derive ±A'+C and ±A'−C — contradiction",
                "Assume −A+C and cancel it against premise 1",
                "Assume +A+C; derive +A+B; done",
                "Barbara cannot be proven indirectly — it has no particular premise"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "The counterclaim's denied conclusion +A−C is particular — it supplies the witness. Pronominalize: ±A'−C with anchor ±A'+A. The anchor hosts premise 1 (±A'+B), whose result hosts premise 2 (±A'+C) — contradicting ±A'−C. Indirect proof recovers the direct cancellation as a special case."
            }
          ]
        },

        // ── Exercise: Final Review ───────────────────────────────────────────
        {
          type: "exercise",
          id: "ex-indirect-final",
          isFinal: true,
          title: "Final Review: Indirect Proof",
          instruction: "The counterclaim method, proterm discipline, and the full course in five questions.",
          kind: "multiple-choice",
          items: [
            {
              prompt: "An indirect proof establishes validity by:",
              choices: [
                "Deriving a contradiction from the premises plus the contradictory of the conclusion",
                "Summing the premises and reading off the conclusion",
                "Showing the conclusion is a tautology",
                "Finding an interpretation that makes the premises true"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "PV: valid iff the counterclaim is inconsistent. The indirect proof exhibits the inconsistency — typically as a proterm statement and its denial about one fixed witness."
            },
            {
              promptHtml: mcPrompt("The counterclaim of:", "+Boy+(Lov+Girl), −Boy−(Lov+Coward) ∴ +Girl−Coward"),
              choices: [
                "{+Boy+(Lov+Girl), −Boy−(Lov+Coward), −Girl+Coward}",
                "{+Boy+(Lov+Girl), −Boy−(Lov+Coward), +Girl+Coward}",
                "{−Boy−(Lov+Girl), +Boy+(Lov+Coward), −Girl+Coward}",
                "{+Boy+(Lov+Girl), −Boy−(Lov+Coward), −Coward+Girl}"
              ],
              answer: 0,
              explanation: "Keep the premises; replace the conclusion with its contradictory — flip both leading signs of +Girl−Coward to get −Girl+Coward."
            },
            {
              prompt: "Why may a proterm's ± be read as − when the inference needs a donor?",
              choices: [
                "Its reference is fixed by an antecedent, so 'some' and 'all' coincide — as with UDTs",
                "All pronouns are universal in English",
                "Because the proof would fail otherwise",
                "It may not — only UDTs can be donors"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Wild quantity is earned by fixed reference. Once an antecedent pins the witness down, claims about 'it' and about 'every one of it' collapse — the same collapse that gives singular terms their ±."
            },
            {
              promptHtml: mcPrompt("In the worked proof, line 8 (", "±Boy'+(Lov+Coward)") ,
              choices: [
                "Uses line 7 as donor with its ± read distributed, feeding the complex in line 4",
                "Pronominalizes line 2",
                "Is the contradictory of line 9, assumed for refutation",
                "Uses the tautology move from Lesson 1"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "±Girl'+Coward (line 7) becomes the donor −Girl'+Coward; the host is Girl′'s net + occurrence inside (Lov±Girl') in line 4. Coward lands in her position: that boy loves a coward."
            },
            {
              prompt: "Which sequence describes the standard indirect-proof recipe?",
              choices: [
                "Form the counterclaim → pronominalize its particulars → anchors host the universals via DDO → derive a proterm contradiction",
                "Pronominalize every statement → sum everything → check regularity",
                "Form the counterclaim → check that it is P-regular → conclude validity",
                "Convert all statements to passives → cancel → read the conclusion"
              ],
              choicesAreCode: false,
              answer: 0,
              explanation: "Counterclaim first (PV), witnesses second (pronominalization), then the dictum does the work through the anchors until one fixed individual is asserted and denied the same thing. Regularity checks moods; proofs refute counterclaims."
            }
          ]
        }

      ]
    }

  ]
};
