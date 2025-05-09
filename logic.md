# Technical Manual: AI Builder Flow

## Introduction

This document describes the internal logic and step-by-step operation of the "AI Builder Flow" workflow. It aims to provide a clear understanding of each phase of the process, the actions undertaken by the AI agent, the documents generated, and the expected interactions with the user.

This workflow is designed to guide a software development project from the initial idea to implementation, relying on a series of structured prompts and rigorous state management.

## Fundamental Principles

1.  **Orchestration:** The [`01_AI-RUN/01_AutoPilot.md`](01_AI-RUN/01_AutoPilot.md:1) file serves as the main orchestrator, guiding the AI through the different phases.
2.  **State Management:** The [`project_session_state.json`](project_session_state.json:1) file at the root of the project is crucial. It maintains the current state of the workflow (current phase, last completed step, project information, etc.) and allows the process to be resumed in case of interruption.
3.  **Prompt Sequence:** The workflow relies on a series of prompts (`.md` files in `01_AI-RUN/`) that define the AI's role and the tasks to be accomplished for each phase.
4.  **Document Generation:** Each phase produces specific documents (e.g., `idea_document.md`, `project_prd.md`, `tasks/tasks.json`) which serve as input for subsequent phases.
5.  **Template Management:** For technical documentation (`02_AI-DOCS/`) and specifications (`03_SPECS/`), the system **creates new project-specific files** based on the provided templates. The original templates remain intact.

## General Workflow Diagram

```mermaid
flowchart TD
    A0[Startup & Initialization (00_Getting_Started.md, 01_AutoPilot.md)] --> A
    A[Phase 1: Idea (01_Idea.md)] --> B
    B[Phase 2: Market Research (02_Market_Research.md)] --> C
    C[Phase 3: Core Concept (03_Core_Concept.md)] --> D
    D[Phase 4: PRD Generation (04_PRD_Generation.md)] --> E
    E[Phase 5: Specifications & Technical Docs (05_Specs_Docs.md)] --> F
    F[Phase 6: Task Manager (06_Task_Manager.md)] --> G
    G[Phase 6.5: README Generation (in 01_AutoPilot.md)] --> H
    H[Phase 7: Implementation (07_Start_Building.md)] --> I
    I[Deployment & Iteration]

    A0 -- Reads --> project_session_state.json
    A0 -- Updates --> project_session_state.json
    A -- Creates --> idea_document.md
    B -- Creates --> market_research.md
    C -- Creates --> core_concept.md
    D -- Creates --> project_prd.md
    E -- Creates/Populates --> Files in 02_AI-DOCS/ and 03_SPECS/
    E -- Creates/Updates --> 03_SPECS/documentation_index.md
    F -- Creates --> tasks/tasks.json
    G -- Creates/Updates --> README.md
    H -- Implements code --> Project source code
```

## Detailed Workflow Phases

### Phase 0: Initialization and Startup

*   **Files Involved:**
    *   [`01_AI-RUN/00_Getting_Started.md`](01_AI-RUN/00_Getting_Started.md:1): General workflow guide, conventions.
    *   [`01_AI-RUN/01_AutoPilot.md`](01_AI-RUN/01_AutoPilot.md:1): Main orchestration prompt.
    *   [`project_session_state.json`](project_session_state.json:1): Session state file.
*   **Logic:**
    1.  The AI agent (initially "ProjectArchitect") is instructed by [`01_AI-RUN/01_AutoPilot.md`](01_AI-RUN/01_AutoPilot.md:1).
    2.  **State Check:** Attempts to load [`project_session_state.json`](project_session_state.json:1).
        *   If existing and populated, confirms with the user whether to resume or not.
        *   Manages pending actions or previous errors.
        *   If non-existent or empty, proceeds with a new initialization.
    3.  **Guide Reading:** The AI reads and internalizes [`01_AI-RUN/00_Getting_Started.md`](01_AI-RUN/00_Getting_Started.md:1) to understand the overall framework.
    4.  **Initial Information Gathering:** If a new project starts, the AI asks targeted questions to the user to define:
        *   `projectType` (Main project type, e.g., "React Web Application")
        *   `projectName` (Project name)
        *   `projectObjective` (Project objective, including target users, problem to solve, key MVP features)
        *   Business model, technological/design preferences (if known).
    5.  **State Update:** The collected information is saved in [`project_session_state.json`](project_session_state.json:1). `currentWorkflowPhase` is set to "ideaGeneration", `lastCompletedStep` to "initialInfoGathered".
*   **Why:** This phase ensures that the AI has all the necessary basic information and understands the project context before starting the substantive work. State management allows for persistence and resumption.

### Phase 1: Expansion of the Initial Idea

*   **Logic Prompt File:** [`01_AI-RUN/01_Idea.md`](01_AI-RUN/01_Idea.md:1)
*   **AI Role:** Idea structuring assistant.
*   **Inputs:** Initial project information (collected in Phase 0 or from [`project_session_state.json`](project_session_state.json:1)).
*   **Process:**
    1.  The AI uses the template provided by the `01_Idea.md` prompt to guide the user (or guide itself if in full AutoPilot mode) to detail:
        *   Project title.
        *   Central concept (pitch).
        *   Main problem solved.
        *   Proposed solution.
        *   Essential features (MVP).
        *   Initial design and technology preferences.
        *   Initial questions and uncertainties.
    2.  The state is saved in [`project_session_state.json`](project_session_state.json:1) before document creation (`pendingAction` set to `create_idea_document`), then updated after (`lastCompletedStep` to "ideaDocumentCreated", `pendingAction` cleared).
*   **Output:**
    *   `idea_document.md` file created at the project root.
    *   The AI presents this document to the user for validation.
*   **Transition:** After user validation, `lastCompletedStep` is updated to "ideaDocumentValidated" in [`project_session_state.json`](project_session_state.json:1), and `currentWorkflowPhase` transitions to "marketResearch".
*   **Why:** Formalizing the initial idea in a structured document ensures that all key aspects are considered and serves as a solid basis for subsequent steps, particularly market research.

### Phase 2: Automated (Interactive) Market Research

*   **Logic Prompt File:** [`01_AI-RUN/02_Market_Research.md`](01_AI-RUN/02_Market_Research.md:1)
*   **AI Role:** "MarketResearch Assistant".
*   **Input:** The `idea_document.md` file.
*   **Process:**
    1.  The AI announces that it is conducting market research.
    2.  It uses the `02_Market_Research.md` prompt to structure an **interactive discussion** with the user (or an internal analysis if in AutoPilot mode) on:
        *   Understanding the idea and user pain points.
        *   Market and trends.
        *   Competition.
        *   Monetization and viability.
        *   Key opportunities and risks.
        *   Overall market attractiveness.
    3.  The AI synthesizes the discussion points. [`project_session_state.json`](project_session_state.json:1) is updated with `pendingAction` set to `create_market_research_document` before creation.
*   **Output:**
    *   `market_research.md` file created at the root, containing a concise summary of the market analysis.
    *   The AI presents a summary of the main conclusions and asks if the user wants to review the full analysis or continue.
*   **Transition:** After user confirmation, `lastCompletedStep` is updated to "marketResearchCompleted" in [`project_session_state.json`](project_session_state.json:1) (and `pendingAction` cleared), and `currentWorkflowPhase` transitions to "coreConceptDevelopment".
*   **Why:** Validate the idea against the existing market, identify competitors, understand user segments, and assess economic viability before investing more time in concept development.

### Phase 3: Core Concept Development

*   **Logic Prompt File:** [`01_AI-RUN/03_Core_Concept.md`](01_AI-RUN/03_Core_Concept.md:1)
*   **AI Role:** "ConceptForge", product strategist.
*   **Inputs:** `idea_document.md` and `market_research.md`.
*   **Process:**
    1.  The AI announces that it is developing the core concept.
    2.  It uses the `03_Core_Concept.md` prompt to synthesize information from the input documents and define:
        *   Summary of concept evolution.
        *   Refined value proposition.
        *   Detailed user personas (primary and secondary).
        *   Core feature matrix (linking user pain points, features, value, and priority).
        *   Unique Selling Points (USPs).
        *   Concept positioning.
        *   Success metrics.
        *   Risks and mitigation strategies.
        *   Concept visualization.
    3.  [`project_session_state.json`](project_session_state.json:1) is updated with `pendingAction` set to `create_core_concept_document` before creation.
*   **Output:**
    *   `core_concept.md` file created at the root.
    *   The AI presents the value proposition and key feature matrix for validation.
*   **Transition:** After user validation, `lastCompletedStep` is updated to "coreConceptValidated" in [`project_session_state.json`](project_session_state.json:1) (and `pendingAction` cleared), and `currentWorkflowPhase` transitions to "prdGeneration".
*   **Why:** Refine the initial idea into a solid, market-validated concept that will serve as a direct foundation for the Product Requirements Document (PRD).

### Phase 4: PRD (Product Requirements Document) Generation

*   **Logic Prompt File:** [`01_AI-RUN/04_PRD_Generation.md`](01_AI-RUN/04_PRD_Generation.md:1)
*   **AI Role:** "PRDarchitect", expert in product management and full-stack architecture.
*   **Inputs:**
    *   `core_concept.md`.
    *   The PRD template (typically [`01_AI-RUN/Template/PRD_template.md`](01_AI-RUN/Template/PRD_template.md:1)).
    *   Specific user information.
*   **Process:**
    1.  The AI announces the PRD creation.
    2.  It **scrupulously** follows the PRD template structure to create a new file.
    3.  It integrates elements from `core_concept.md` into the appropriate sections of the PRD.
    4.  It adapts the PRD based on specific information provided by the user, particularly design preferences.
    5.  It uses its technical expertise to detail specifications (system architecture, data model, APIs, test strategies).
    6.  Particular attention is paid to section 5.2 (Design System) to obtain user design preferences, crucial for initializing `design_conventions.md` later.
    7.  [`project_session_state.json`](project_session_state.json:1) is updated with `pendingAction` set to `create_project_prd_document` before creation.
*   **Output:**
    *   `project_prd.md` file created at the root.
    *   The AI presents an executive summary with links to the full sections and asks if the user wants to review specific sections.
*   **Transition:** After user confirmation, `lastCompletedStep` is updated to "prdValidated" in [`project_session_state.json`](project_session_state.json:1) (and `pendingAction` cleared), and `currentWorkflowPhase` transitions to "technicalDocumentation".
*   **Why:** Create the single, exhaustive reference document that will guide all product development, ensuring all requirements (functional, non-functional, technical, design) are clearly defined.

### Phase 5: Creation of Technical Specifications and Documentation

*   **Logic Prompt File:** [`01_AI-RUN/05_Specs_Docs.md`](01_AI-RUN/05_Specs_Docs.md:1)
*   **AI Role:** "TechDocNavigator", technical documentation specialist.
*   **Input:** The `project_prd.md` file.
*   **Process:**
    1.  The AI announces the update/creation of technical documentation.
    2.  **PRD Analysis:** Extracts all technologies, frameworks, APIs, etc., from `project_prd.md`.
    3.  **Information Gathering:** Uses MCPs (like `context7`, `github`, `firecrawl`) to retrieve official documentation, code examples, etc., for each identified technical element.
    4.  **Creation of Project-Specific Documents:**
        *   The AI **creates new files** in the subdirectories of `02_AI-DOCS/` (e.g., `02_AI-DOCS/Architecture/architecture.md`) and `03_SPECS/` (e.g., `03_SPECS/features/feature_spec_FEAT-001.md`). For feature specifications, filenames should follow the pattern `03_SPECS/features/feature_spec_[FEATURE_ID].md`, where `[FEATURE_ID]` is derived from the PRD or task management system.
        *   To do this, it **copies** the appropriate template (e.g., `architecture_template.md`) to the new file name. The `write_to_file` tool will handle directory creation if needed.
        *   It reads the structure of the newly copied file and **populates** it with relevant information extracted from the PRD and collected documentation.
        *   The original templates (`*_template.md`) **are not modified**.
        *   Particular attention is given to `02_AI-DOCS/Conventions/design_conventions.md` which is populated based on `02_AI-DOCS/Documentation/AI_Design_Agent_Optimization.md` and PRD preferences.
    5.  **Indexing:** Creates or updates `03_SPECS/documentation_index.md` to list and link all created technical documents and reference documents (like `AI_Coding_Agent_Optimization.md`). The AI should be capable of listing files in specified directories and generating markdown links.
    6.  The documents `02_AI-DOCS/Documentation/AI_Coding_Agent_Optimization.md` and `AI_Design_Agent_Optimization.md` serve as references and are not copied/modified.
*   **Output:**
    *   Set of project-specific technical documents created and populated in `02_AI-DOCS/` and `03_SPECS/`.
    *   An updated `03_SPECS/documentation_index.md` file.
    *   The AI presents a summary of the technical stack and key integrations.
*   **Transition:** Once all documents are generated and `documentation_index.md` is updated, `lastCompletedStep` is set to "technicalDocumentationCompleted" in [`project_session_state.json`](project_session_state.json:1), and `currentWorkflowPhase` transitions to "taskManagement".
*   **Why:** Build a solid, project-specific technical knowledge repository that will serve as a basis for task breakdown and implementation.

### Phase 6: Task Manager

*   **Logic Prompt File:** [`01_AI-RUN/06_Task_Manager.md`](01_AI-RUN/06_Task_Manager.md:1)
*   **AI Role:** Interface with the `taskmaster-ai` MCP.
*   **Inputs:**
    *   `project_prd.md`.
    *   Project-specific technical documents created in `02_AI-DOCS/` and `03_SPECS/`.
    *   Design principles from `02_AI-DOCS/Documentation/AI_Design_Agent_Optimization.md`.
*   **Process:**
    1.  The AI announces the project breakdown into tasks.
    2.  It prepares a prompt for `@taskmaster-ai` by extracting project contextual information (name, objective) and the list of features (Section 3.1 of the PRD) in JSON format.
    3.  **Interaction with `taskmaster-ai` (MCP):**
        *   Requests project tracking initialization (e.g., using `taskmaster-ai initialize_project`).
        *   Requests epic creation from the feature list (e.g., using `taskmaster-ai add_task` for each feature, marking them as epics if possible, or by parsing the PRD with `taskmaster-ai parse_prd` if the PRD is structured appropriately).
        *   For each epic, requests a detailed breakdown into tasks (max 4h per task), emphasizing the inclusion of technical details and design requirements (referencing `design_conventions.md` and `AI_Design_Agent_Optimization.md`) (e.g., using `taskmaster-ai expand_task` or `add_subtask`).
        *   Requests a complexity analysis for each task and epic (e.g., using `taskmaster-ai analyze_project_complexity`).
        *   Requests the generation of an implementation roadmap (this might be a synthesis of `taskmaster-ai get_tasks` output, ordered by priority and dependencies).
    4.  The AI may initiate additional refinement requests to `taskmaster-ai` if some tasks still seem too large or ambiguous.
    5.  [`project_session_state.json`](project_session_state.json:1) is updated with `pendingAction` set to `generate_tasks_file` before `tasks/tasks.json` is finalized.
*   **Output:**
    *   `tasks/tasks.json` file created/updated with the complete task hierarchy (epics, tasks, sub-tasks), their descriptions, acceptance criteria, dependencies, etc.
    *   The AI presents high-level epics and priority tasks.
    *   Asks the user if they want to modify priorities before implementation.
*   **Transition:** After user confirmation of priorities, `lastCompletedStep` is updated to "taskPrioritiesConfirmed" in [`project_session_state.json`](project_session_state.json:1) (and `pendingAction` cleared), and `currentWorkflowPhase` transitions to "readmeGeneration".
*   **Why:** Transform PRD requirements into a concrete, granular action plan, facilitating estimation, resource allocation, and implementation tracking.

### Phase 6.5: README Generation

*   **Logic Prompt File:** Managed within [`01_AI-RUN/01_AutoPilot.md`](01_AI-RUN/01_AutoPilot.md:1) (section "Phase 6.5").
*   **AI Role:** Technical writer.
*   **Inputs:**
    *   `projectName`, `projectType`, `projectObjective` from [`project_session_state.json`](project_session_state.json:1).
    *   Technical stack details from `02_AI-DOCS/Architecture/architecture.md` (created in phase 5) or `project_prd.md`.
*   **Process:**
    1.  The AI announces the `README.md` generation.
    2.  It assembles the Markdown content including:
        *   Quick start instruction for the AI agent (to restart the workflow).
        *   Project title.
        *   Project type badge.
        *   Short description.
        *   "Main Technical Stack" section.
        *   "Quick Start (Manual)" section (placeholder).
        *   "Project Structure" section.
    3.  Uses the `write_to_file` tool to save the content to `README.md` at the root, overwriting the existing file.
*   **Output:** `README.md` file created/updated at the project root.
*   **Transition:** `lastCompletedStep` is updated to "readmeGenerated" in [`project_session_state.json`](project_session_state.json:1), and `currentWorkflowPhase` transitions to "implementation". Automatic to the next phase.
*   **Why:** Provide a clear entry point for the project, explaining its objective, structure, and how to get started (manually or with AI).

### Phase 7: Implementation

*   **Logic Prompt File:** [`01_AI-RUN/07_Start_Building.md`](01_AI-RUN/07_Start_Building.md:1)
*   **AI Role:** "ImplementationArchitect", full-stack developer and technical lead.
*   **Inputs:**
    *   `project_prd.md`.
    *   Project-specific technical documents in `02_AI-DOCS/` (notably `architecture.md`, `coding_conventions.md`, `design_conventions.md`) and `03_SPECS/` (notably `feature_spec_[ID].md`).
    *   `tasks/tasks.json`.
    *   Design principles from `02_AI-DOCS/Documentation/AI_Design_Agent_Optimization.md`.
*   **Process:**
    1.  **Project Setup:**
        *   Set up the development environment according to the PRD stack.
        *   Initialize the project (framework, dependencies), **including creating the base source code directory structure (e.g., `src/`, `src/components/`, `src/services/`, `src/utils/` as defined in `architecture.md` or relevant conventions).** The `write_to_file` tool used for creating initial files will handle directory creation.
        *   Configure version control (e.g., `git init`, create `.gitignore`).
    2.  **Architecture Implementation:**
        *   Implement core architectural components as per `architecture.md` and high-priority architectural tasks from `tasks/tasks.json`.
        *   Configure the database schema based on `project_prd.md` and `architecture.md`.
    3.  **Systematic Task Implementation:**
        *   The AI interacts with `@taskmaster-ai` (MCP) to get the next task to implement (e.g., using `taskmaster-ai next_task`).
        *   For each task:
            *   Analyzes detailed specifications and acceptance criteria for the task (obtained from `@taskmaster-ai get_task [task_id]` and spec documents).
            *   Writes code, scrupulously respecting coding and design conventions (references to `coding_conventions.md`, `design_conventions.md`, `AI_Design_Agent_Optimization.md`).
            *   Uses appropriate MCPs (e.g., `@21st-dev/magic` for UI components, GitHub MCP for commits).
            *   Writes tests (unit, integration) as specified in the task or conventions.
            *   Documents the code as per conventions.
            *   Verifies against acceptance criteria.
            *   Commits changes (potentially using GitHub MCP).
            *   Updates task status via `@taskmaster-ai set_task_status [task_id] done`.
    4.  **Continuous Progression:** The AI requests the next task from `@taskmaster-ai` and reports its progress. [`project_session_state.json`](project_session_state.json:1) is updated with `lastCompletedStep` reflecting the ID of the last completed task.
*   **Output:** Functional project source code, tests, associated documentation.
*   **Transition:** Once all tasks in `tasks/tasks.json` are completed (verified by checking statuses via `@taskmaster-ai`), `lastCompletedStep` is updated to "implementationCompleted" in [`project_session_state.json`](project_session_state.json:1), and `currentWorkflowPhase` moves to "deploymentAndIteration". The `07_Start_Building.md` prompt includes instructions to initiate a new development cycle based on user feedback.
*   **Why:** Transform plans and specifications into a functional product, following a structured approach and maintaining high code and documentation quality.

### Phase 8: Deployment & Iteration (Conceptual)

*   **Logic:** Although not materialized by a dedicated prompt in `01_AI-RUN/` for the first iteration, this phase is the logical continuation of implementation. `currentWorkflowPhase` is "deploymentAndIteration".
*   **Process:**
    1.  **Deployment:** The AI can assist with deployment by following instructions in `02_AI-DOCS/Deployment/deployment_guide.md` (created in phase 5). This may involve using MCPs for cloud providers or executing CLI commands. `lastCompletedStep` can be updated to "deploymentCompleted".
    2.  **Feedback Collection:** The user collects feedback on implemented features.
    3.  **New Cycle:** For a new iteration, the user can instruct the AI to restart the workflow (potentially returning to Phase 1: Idea, or directly to Phase 6 for new features if the core concept remains). The AI would use the existing [`project_session_state.json`](project_session_state.json:1) to understand the current project, and new prompts would guide it. The `07_Start_Building.md` prompt (lines 244-259) provides an example prompt to initiate this new iteration with `@ConceptForge`.
*   **Why:** Enable continuous product improvement based on real usage and feedback, and adapt the project to changing needs.

This manual should provide a detailed understanding of the logic of your "AI Builder Flow".