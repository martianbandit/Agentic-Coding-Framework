# Argentic AI-Assisted Development Workflow Template

## How to Use

1. Fork this repository to create a new project. 
2. Install all MCP @ 01_AI-RUN/Template/MCP-Server.json
3. Just run in cursor / cline / windsurf with this prompt : 

--->  Read the full codebase and let's get started with '01_AI-RUN/00_Getting_Started.md

## Purpose

This repository serves as a template and framework for initiating software projects using a structured, AI-assisted workflow. It provides a sequence of prompts (`01_AI-RUN/`) designed to guide an AI coding agent (like Cline, Cursor, Windsurf, or similar) from an initial user idea through market research, concept definition, PRD generation, technical documentation/specification updates, task breakdown, and finally into the implementation phase.

The core goal is to leverage AI capabilities for efficient documentation generation and planning while maintaining high standards and human oversight, embodying a concept we term "Argentic Coding Logic."

**This repository is intended to be forked for each new project.** The AI agent will then work directly within the forked repository.

## Core Concept: Argentic Coding Logic

This workflow implements a practical interpretation of "Argentic Coding Logic," inspired by principles of thoughtful design, iterative development, and the need for robust guidance when working with powerful AI agents. It emphasizes:

1.  **Structured Interaction:** Using detailed, sequential prompts (`01_AI-RUN/`) to guide the AI through distinct development phases.
2.  **Defined AI Roles:** Assigning specific personas (e.g., `ProjectArchitect`, `MarketMaster Pro`) within prompts to focus the AI's behavior.
3.  **Context Management:** Ensuring outputs from one phase correctly feed into the next, and providing mechanisms for the AI to access relevant project context (PRD, existing code/docs within the fork, best practices).
4.  **Iterative Validation:** Incorporating defined points for human review and approval of key AI proposals and generated documents.
5.  **Quality Focus & Best Practices:** Explicitly instructing the AI to adhere to coding standards, security principles, and maintainability goals, primarily guided by the central document: [`02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`](02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md).
6.  **Mitigating AI Weaknesses:** Using clear constraints, requesting clarification for ambiguities, and emphasizing human oversight to reduce the risk of hallucinations or logical errors.
7.  **Leveraging AI Strengths:** Automating documentation generation, research assistance (via MCPs), task decomposition, and boilerplate code generation.
## Why This Workflow? The Argentic AI Coding Advantage

This template isn't just a collection of prompts; it's a manifestation of **Argentic AI Coding Logic** – a powerful, structured methodology designed to transform any idea, from complex software projects and video games to innovative digital concepts, into reality with unprecedented efficiency and quality.

**What makes it extraordinary?**

*   **Structured Creativity:** It channels the vast potential of AI through a meticulously designed, phase-by-phase workflow. This ensures that creativity is grounded in market realities, technical feasibility, and strategic planning from the outset.
*   **Deep Contextual Understanding:** Each phase builds upon the last, creating an ever-richer context for the AI. This allows for increasingly nuanced and accurate outputs, minimizing generic responses and maximizing project-specific value.
*   **AI as a True Partner:** The prompts are crafted to elevate the AI from a simple code generator to a strategic partner in market research, concept development, technical architecture, and task management.
*   **Human-AI Synergy:** It masterfully blends AI's speed and data processing power with human strategic oversight and validation. You remain in control, guiding the AI at critical junctures, ensuring the final product aligns perfectly with your vision.
*   **Versatility for Any Code-Based Project:** Whether you're launching a SaaS platform, developing an indie game, designing a mobile app, or even structuring complex technical documentation, the underlying principles of breaking down complexity, ensuring thorough research, and detailed planning are universally applicable.
*   **Automation of Tedious Work:** Frees you from the time-consuming aspects of initial research, documentation drafting, and task breakdown, allowing you to focus on high-level strategy, innovation, and creative problem-solving.
*   **Built-in Best Practices:** The workflow, especially through the `AI_Coding_Agent_Optimization.md` guidelines, instills best practices in coding, security, and documentation from the very first step.
*   **Rapid Prototyping & Iteration:** The structured outputs (PRD, task lists) enable faster movement into development and provide a solid foundation for quick iterations based on feedback.

**How it works its magic:**

The "magic" lies in the synergy between:
1.  **Detailed, Role-Specific Prompts:** Guiding the AI to adopt expert personas for each task.
2.  **Sequential Information Flow:** Ensuring each step is informed by validated outputs from previous steps.
3.  **Integration with MCPs (Model Context Protocol):** Allowing the AI to leverage external tools and real-time data for research, coding, and more.
4.  **Emphasis on "Updatable" Core Documents:** Key documents like architecture or coding conventions are treated as living templates within your project fork, evolved by the AI with project-specific details.

By using this Argentic AI Coding workflow, you're not just automating tasks; you're orchestrating a sophisticated, AI-powered development process designed for excellence and speed, turning ambitious concepts into tangible successes.

---
## Workflow Overview

The workflow consists of 7 logical phases, orchestrated by [`01_AI-RUN/00_AutoPilot.md`](01_AI-RUN/00_AutoPilot.md:1) for automated execution or runnable step-by-step using the sequential prompts:

1.  **Idea (`01_Idea.md`):** Capturing the initial concept. (Output: `idea_document.md`)
2.  **Market Research (`02_Market_Research.md`):** Analyzing market viability. (Output: `market_research.md`)
3.  **Core Concept (`03_Core_Concept.md`):** Refining the idea based on research. (Output: `core_concept.md`)
4.  **PRD Generation (`04_PRD_Generation.md`):** Creating the detailed Product Requirements Document. (Output: `project_prd.md`)
5.  **Specs & Docs (`05_Specs_Docs.md`):** **Updating** technical documentation and specifications within the fork's `02_AI-DOCS/` and `03_SPECS/` directories, using the existing files as templates. Also references `02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`.
6.  **Task Manager (`06_Task_Manager.md`):** Breaking down the PRD into tasks using `taskmaster-ai` MCP. (Output: `tasks/tasks.json`)
7.  **Start Building (`07_Start_Building.md`):** Guiding the implementation phase. (Output: Project code)

Refer to [`01_AI-RUN/00_Getting_Started.md`](01_AI-RUN/00_Getting_Started.md:1) for a more detailed explanation of each phase.

## How to Use

1.  **Fork this Repository:** Create a new repository for your project by forking this template.
2.  **Customize Best Practices (Crucial):** Edit [`02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`](02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md) to reflect *your* specific coding standards, architectural preferences, and AI interaction guidelines. This document is central to guiding the AI effectively.
3.  **Configure MCPs & API Keys:** If using MCPs that require API keys (e.g., Stripe, OpenAI via Taskmaster, GitHub), configure them either via environment variables recognized by your AI agent/MCP setup or by updating placeholder values in configuration files like [`01_AI-RUN/Template/MCP-Server.json`](01_AI-RUN/Template/MCP-Server.json) (ensure this file is appropriately secured or gitignored if containing secrets).
4.  **Initiate Workflow:**
    *   **Automated (Recommended):** Open [`01_AI-RUN/00_AutoPilot.md`](01_AI-RUN/00_AutoPilot.md:1) in your AI coding agent (e.g., Cline, Cursor). Share the prompt with the agent and provide your initial project idea when requested.
    *   **Manual:** Execute prompts `01` through `07` sequentially, providing the necessary inputs at each stage.
5.  **Validate:** Review and validate the AI's proposals and generated outputs at the designated intervention points outlined in [`01_AI-RUN/00_AutoPilot.md`](01_AI-RUN/00_AutoPilot.md:1).

## Directory Structure

*   **`01_AI-RUN/`**: Contains the sequential prompts (`01` to `07`), the main orchestrator (`00_AutoPilot.md`), the getting started guide, and templates.
    *   **`Template/`**: Holds base templates like the PRD structure.
*   **`02_AI-DOCS/`**: Contains core documentation files that are **updated** by the AI for each project based on their initial template structure.
    *   **`Architecture/`**: System architecture documentation.
    *   **`BusinessLogic/`**: Business rules and logic.
    *   **`Conventions/`**: Coding conventions.
    *   **`Deployment/`**: Deployment guides.
    *   **`Integrations/`**: API integration details.
    *   **`Documentation/`**: Contains the crucial `AI_Coding_Agent_Optimization.md`.
    *   **`AI-Coder/`**: Holds reusable prompts for specific AI coding tasks (likely static).
*   **`03_SPECS/`**: Contains specification files that are **updated** by the AI.
    *   **`features/`**: Feature specifications.
    *   **`bugfixes/`**: Bugfix specifications.
    *   *(Other subdirectories like `technical/`, `integration/`, `data/`, `security/` might be populated or updated based on project needs).*
*   **`tasks/`**: Contains the generated `tasks.json` file from the Task Manager phase.
*   **(Project Root)**: Intermediate documents (`idea_document.md`, `market_research.md`, `core_concept.md`, `project_prd.md`) are created here.
*   **`README.md`**: This file.

## Technology Assumptions

This workflow assumes a default stack of:
*   Frontend: Next.js (TypeScript)
*   Backend/DB: Supabase
*   Styling: Tailwind CSS (with Shadcn/ui inspiration)
It also heavily relies on the availability and configuration of various **Model Context Protocol (MCP) servers** (see [`01_AI-RUN/Template/MCP-Context.md`](01_AI-RUN/Template/MCP-Context.md) and the PRD template Section 5.6.1) for tasks like documentation lookup, task management, GitHub operations, etc.

## Customization

Feel free to adapt the prompts in [`01_AI-RUN/`](01_AI-RUN) and especially the guidelines in [`02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`](02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md) to better suit your specific needs, preferred tools, and coding standards.
## Roadmap: From 0 to 1 with Full Argentic AI Coding Assistance

This workflow is designed for comprehensive AI assistance, orchestrated by the [`01_AI-RUN/00_AutoPilot.md`](01_AI-RUN/00_AutoPilot.md:1) file, with human intervention points for validation and strategic direction. Here’s a conceptual step-by-step journey:

**Phase 0: Initialization & User Idea**

1.  **User:** Forks the template repository for a new project.
2.  **User:** Opens [`01_AI-RUN/00_AutoPilot.md`](01_AI-RUN/00_AutoPilot.md:1) in their AI agent (e.g., Cline).
3.  **User:** Shares the `00_AutoPilot.md` content with the AI agent.
4.  **AI Agent (as `ProjectArchitect`):** Understands "Core Operational Rules." Prompts the user for a brief project idea (1-3 sentences).
5.  **User:** Provides the initial idea.
6.  **AI Agent:** Asks 5-7 targeted questions (from `00_AutoPilot.md`) to clarify the idea (target users, main problem, key MVP features, business model, tech/design preferences).
7.  **User:** Answers clarification questions.

**Phase 1: Initial Idea Expansion (Logic from [`01_AI-RUN/01_Idea.md`](01_AI-RUN/01_Idea.md:1))**

8.  **AI Agent:** Based on the initial idea and clarifications, uses the `01_Idea.md` logical prompt structure to generate a structured idea document.
9.  **AI Agent:** Saves this document as `idea_document.md` in the project root.
10. **AI Agent:** Presents the completed `idea_document.md` to the user for quick validation.
11. **User:** Validates or requests minor adjustments.

**Phase 2: Automated Market Research (Logic from [`01_AI-RUN/02_Market_Research.md`](01_AI-RUN/02_Market_Research.md:1))**

12. **AI Agent:** Announces it's conducting market research.
13. **AI Agent (as `MarketMaster Pro`):** Internally uses the `02_Market_Research.md` logical prompt, taking `idea_document.md` as input.
14. **AI Agent:** Leverages MCPs (e.g., `context7`, `firecrawl`) as needed to simulate data gathering.
15. **AI Agent:** Generates a comprehensive market analysis.
16. **AI Agent:** Saves this analysis as `market_research.md` in the root.
17. **AI Agent:** Presents a summary of main findings to the user.
18. **User:** Decides whether to review the full analysis or proceed.

**Phase 3: Core Concept Development (Logic from [`01_AI-RUN/03_Core_Concept.md`](01_AI-RUN/03_Core_Concept.md:1))**

19. **AI Agent:** Announces it's developing the core concept.
20. **AI Agent (as `ConceptForge`):** Internally uses the `03_Core_Concept.md` logical prompt, taking `idea_document.md` and `market_research.md` as inputs.
21. **AI Agent:** Synthesizes the idea and market research into a refined concept.
22. **AI Agent:** Saves this concept as `core_concept.md` in the root.
23. **AI Agent:** Presents the value proposition and key feature matrix to the user.
24. **User:** Validates the core concept before proceeding.

**Phase 4: PRD Generation (Logic from [`01_AI-RUN/04_PRD_Generation.md`](01_AI-RUN/04_PRD_Generation.md:1))**

25. **AI Agent:** Announces it's creating the Product Requirements Document (PRD).
26. **AI Agent (as `PRDarchitect`):** Internally uses the `04_PRD_Generation.md` logical prompt, taking `core_concept.md` as main input and referencing the [`01_AI-RUN/Template/PRD_template.md`](01_AI-RUN/Template/PRD_template.md:1).
27. **AI Agent:** Generates a complete PRD.
28. **AI Agent:** Saves the PRD as `project_prd.md` in the root.
29. **AI Agent:** Presents an executive summary with links to full sections.
30. **User:** Decides whether to review specific sections or proceed.

**Phase 5: Technical Documentation (Logic from [`01_AI-RUN/05_Specs_Docs.md`](01_AI-RUN/05_Specs_Docs.md:1))**

31. **AI Agent:** Announces it's updating technical documentation.
32. **AI Agent (as `TechDocNavigator`):** Internally uses the `05_Specs_Docs.md` logical prompt, taking `project_prd.md` as input.
33. **AI Agent:** **Updates** existing files in `02_AI-DOCS/` and `03_SPECS/` using their structure as templates, integrating information from the PRD and technical research (via MCPs if needed). Also references [`02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`](02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md).
34. **AI Agent:** Creates or updates `03_SPECS/documentation_index.md`.
35. **AI Agent:** Presents a summary of the tech stack and key integrations. (`00_AutoPilot.md` instructs to proceed automatically).

**Phase 6: Task Management (Logic from [`01_AI-RUN/06_Task_Manager.md`](01_AI-RUN/06_Task_Manager.md:1))**

36. **AI Agent:** Announces it's breaking down the project into tasks.
37. **AI Agent:** Internally uses the `06_Task_Manager.md` logical prompt, taking `project_prd.md` and updated technical documents as inputs.
38. **AI Agent:** Interacts with the `taskmaster-ai` MCP to initialize the project, create epics from PRD features, and decompose each epic into tasks and sub-tasks.
39. **AI Agent:** Saves the task hierarchy in [`tasks/tasks.json`](tasks/tasks.json:1).
40. **AI Agent:** Presents high-level epics and priority tasks.
41. **User:** May request to modify task priorities.

**Phase 7: Implementation (Logic from [`01_AI-RUN/07_Start_Building.md`](01_AI-RUN/07_Start_Building.md:1))**

42. **AI Agent:** Announces it's starting implementation.
43. **AI Agent (as `ImplementationArchitect`):** Internally uses the `07_Start_Building.md` logical prompt.
44. **AI Agent:** If not done in Phase 5, creates/updates detailed specifications for each feature in `03_SPECS/features/`.
45. **AI Agent:** Requests the next task to implement from `taskmaster-ai` MCP.
46. **AI Agent:** Implements priority tasks first, using relevant MCPs (e.g., `@21st-dev/magic` for UI, `github` for versioning, `supabase` for DB).
47. **AI Agent:** Writes code, tests, and associated documentation, adhering to [`02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md`](02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md) and PRD guidelines.
48. **AI Agent:** Provides regular progress updates.
49. **AI Agent:** Presents completed features for validation.
50. **User:** Validates implemented features.
51. **AI Agent:** Marks tasks as complete in `taskmaster-ai`.
52. **Repeat (steps 45-51):** The task implementation cycle continues until all MVP tasks are completed.

**Phase "1" (End of 0->1 Cycle): Deployment & Iteration**

53. **AI Agent:** Once all MVP tasks are implemented and validated, assists with the deployment process (based on [`02_AI-DOCS/Deployment/deployment_guide_template.md`](02_AI-DOCS/Deployment/deployment_guide_template.md:1) and PRD instructions).
54. **User & AI Agent:** Collect user feedback on the deployed product.
55. **User:** Decides on next steps/iterations.
56. **If New Iteration:** The cycle can restart at Phase 0 or Phase 1, using learnings and feedback to refine `idea_document.md` or directly `core_concept.md`. Existing documents (`project_prd.md`, [`tasks/tasks.json`](tasks/tasks.json:1), etc.) are updated.

This roadmap outlines the ideal flow. The AI agent is designed to be proactive, but the "Core Operational Rules" in `00_AutoPilot.md` require it to seek clarification for ambiguities and report errors, ensuring the user remains the ultimate supervisor.
