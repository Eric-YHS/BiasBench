import type { ReactNode } from "react";

type FAQSection = {
  title: string;
  items: {
    question: string;
    answer: ReactNode;
  }[];
};

const faqSections: FAQSection[] = [
  {
    title: "Validity & data security",
    items: [
      {
        question: "Can AI effectively simulate human psychology and behaviour? Is there supporting evidence?",
        answer: (
          <>
            <p>
              Yes. Independent teams at universities such as Harvard and Stanford have replicated
              social-science findings with language models. Their studies consistently show that AI
              agents can approximate human responses in controlled experiments.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Higher fidelity: our replication accuracy improves the 50%-75% range reported in prior work to 93.2%.</li>
              <li>Stricter tests: we purposefully reproduce studies published after January 2023 to avoid overlap with the model&apos;s pre-training data.</li>
              <li>Operationalisation: the AITurk platform wraps the workflow into a service for researchers and practitioners.</li>
            </ul>
          </>
        ),
      },
      {
        question: "Will my study ideas or data be exposed when I upload them to AITurk?",
        answer: (
          <>
            <p>
              No. All research materials are encrypted at rest and accessible only to the users and
              teams you authorise. Platform staff cannot inspect your projects without permission.
            </p>
            <p>
              Intellectual property and authorship remain yours. We contractually commit not to reuse
              study assets outside the scope you approve.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: "Sample configuration",
    items: [
      {
        question: "Can I specify richer demographic variables such as income or industry?",
        answer: (
          <p>
            Yes. Enable the “Custom” option in the demographic panel to define bespoke attributes for
            income, occupation, health status, overseas experience, and more.
          </p>
        ),
      },
      {
        question: "I targeted CEOs but received 18- to 19-year-old participants. How can I avoid implausible combinations?",
        answer: (
          <p>
            Ensure that the traits you request are internally consistent (for example pairing the CEO
            role with an age bracket above 30). Consider cross-checking age, education and occupation
            together.
          </p>
        ),
      },
      {
        question: "Why do the aggregated demographics sometimes deviate slightly from my settings?",
        answer: (
          <p>
            A small share of AI agents can fail to return valid responses, and the augmentation logic
            introduces minor noise when rebalancing the sample. The discrepancies are usually modest
            and do not affect headline conclusions.
          </p>
        ),
      },
      {
        question: "Does the field \"Location\" map to the participants' country or region?",
        answer: <p>Yes. “Location” refers to the country or region assigned to the simulated participant.</p>,
      },
      {
        question: "Do you offer built-in power analysis when selecting sample sizes?",
        answer: (
          <p>
            No. Empirically, 30 samples per cell already match the accuracy of larger crowdsourced
            studies (93.2% in our trials). We therefore recommend 30-per-group as the default setting.
          </p>
        ),
      },
    ],
  },
  {
    title: "Research design",
    items: [
      {
        question: "What is the difference between scenario-based and recall/writing experiments?",
        answer: (
          <p>
            Scenario experiments manipulate variables via vignettes that participants read before
            responding. Recall/writing designs ask participants to reflect on past experiences or
            compose text (for instance, answering prompts or describing imagined scenes).
          </p>
        ),
      },
      {
        question: "Can I embed images in the study materials?",
        answer: <p>Yes. Image upload is supported in instruction fields such as “Guidance” and “Condition description”.</p>,
      },
      {
        question: "Is AITurk suitable for every type of social-science study?",
        answer: (
          <p>
            Not all of them. The platform focuses on tasks that could reasonably be executed on
            crowdsourcing sites like MTurk or Prolific, where structured instructions and textual
            responses are sufficient.
          </p>
        ),
      },
    ],
  },
  {
    title: "Measurement settings",
    items: [
      {
        question: "What counts as a large, medium or small expected effect size?",
        answer: (
          <p>
            The sliders are subjective. Choose “Medium” for most studies. If you expect a strong
            relationship (for example job satisfaction vs. life satisfaction) pick “Large”; if you are
            purely exploring weak associations, pick “Small”.
          </p>
        ),
      },
      {
        question: "Do I need to insert attention checks like I would on MTurk?",
        answer: (
          <p>
            No. The AI respondents always follow instructions, so attention checks can introduce
            artefacts instead of improving quality.
          </p>
        ),
      },
      {
        question: "Does showing the full Likert scale versus only the endpoints change the results?",
        answer: (
          <p>
            No. It only affects authoring convenience. If you need to mirror a previous study, choose
            the presentation that matches the original.
          </p>
        ),
      },
    ],
  },
  {
    title: "Other topics",
    items: [
      {
        question: "Can I control fonts, colours, bold or underline formatting?",
        answer: (
          <p>
            Not necessary. The models interpret the text directly, so styling does not influence their
            responses.
          </p>
        ),
      },
      {
        question: "Is pagination available?",
        answer: (
          <p>
            No. Pagination is not needed because the models process the full prompt context at once.
          </p>
        ),
      },
      {
        question: "Do you support languages other than English?",
        answer: (
          <p>
            Yes. You can provide materials in any language supported by the underlying model (English,
            Chinese, Spanish, Portuguese, Korean, and more). Be mindful of potential cultural
            differences when mixing languages.
          </p>
        ),
      },
      {
        question: "Why is the within-group variance relatively small?",
        answer: (
          <p>
            We calibrate sampling temperature to keep variance low, enabling reliable pilot studies
            with small cell sizes (around 30 samples per group).
          </p>
        ),
      },
      {
        question: "Do I need to pay again if I retrain a study after editing the materials?",
        answer: (
          <p>
            Edits are free before running training. Once the system generates data, retraining requires
            a new run because it triggers fresh model calls.
          </p>
        ),
      },
      {
        question: "Can I import another user's shared AITurk study into my account?",
        answer: (
          <p>
            Yes. Use “Import study” on the workspace page and paste the shared link to copy it into your
            project list.
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container-narrow space-y-8">
      <header className="space-y-2">
        <h1 className="h1">Frequently asked questions</h1>
        <p className="text-sm text-slate-500">
          Answers reflect the current demo scope. Production features may expand or change.
        </p>
      </header>
      <div className="space-y-8">
        {faqSections.map(section => (
          <section key={section.title} className="space-y-4">
            <h2 className="h2">{section.title}</h2>
            <div className="space-y-4">
              {section.items.map(item => (
                <article key={item.question} className="card p-5 space-y-2 text-sm text-slate-600">
                  <h3 className="text-base font-semibold text-slate-800">{item.question}</h3>
                  <div className="space-y-2 leading-relaxed">{item.answer}</div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
