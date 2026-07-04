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
    }

  ]
};
