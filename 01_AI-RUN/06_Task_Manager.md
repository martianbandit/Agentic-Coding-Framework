# Task Manager AI Integration Prompt

## Context Awareness

**Previous Phases:**
- Idea Document (logiquement généré par `01_Idea.md` et sauvegardé comme `idea_document.md`)
- Market Research (logiquement généré par `02_Market_Research.md` et sauvegardé comme `market_research.md`)
- Core Concept (logiquement généré par `03_Core_Concept.md` et sauvegardé comme `core_concept.md`)
- PRD Generation (logiquement généré par `04_PRD_Generation.md` et sauvegardé comme `project_prd.md`)
- Technical Specifications (documents **mis à jour** dans `02_AI-DOCS/` et `03_SPECS/` par le prompt logique `05_Specs_Docs.md`)

**Expected Inputs:**
- A comprehensive `project_prd.md`.
- **Updated** technical specifications and documentation within `02_AI-DOCS/` and `03_SPECS/`.

**Current Phase:** Task Management

## Purpose

This prompt establishes a structured workflow for breaking down the PRD into a hierarchical task system using the taskmaster-ai MCP. The goal is to create extremely precise, granular tasks that are optimally sized for implementation, avoiding overly large or ambiguous work items.

## When to Use

Execute this prompt after the PRD has been fully generated and validated. The task decomposition process requires a complete PRD with well-defined features in Section 3.1.

## Prompt Structure

```
@taskmaster-ai

## Project Initialization and Task Decomposition Request

I need comprehensive task management setup for this project, with features broken down into precise, implementable units of work. The PRD is complete and ready for task decomposition.

### Project Context

- **Project Name:** {{project_name}}
- **PRD Reference:** {{prd_reference_id}}
- **Project Objective:** {{project_objective}}

### Primary Request

Please perform the following operations in sequence:

1. Initialize project tracking
2. Create epics from the feature list
3. Decompose each feature into a hierarchy of precisely defined tasks
4. Analyze implementation complexity
5. Generate a detailed implementation roadmap

### Feature List for Epic Creation

{{features_json}}

### Decomposition Guidelines

- Break down each feature into tasks that represent no more than 4 hours of development work
- Ensure each task has a single, clear responsibility
- Include specific technical requirements in task descriptions
- Create logical dependencies between tasks
- Prioritize tasks based on technical dependencies and user value
- Tag tasks with appropriate categories (UI, Backend, Database, etc.)
- Include acceptance criteria for each task

### Expected Outputs

1. Complete task hierarchy with IDs
2. Complexity analysis report
3. Implementation roadmap with timeline estimates
4. Dependency graph visualization description

Thank you for your assistance in organizing this project for optimal implementation.
```

## Implementation Instructions

### Step 1: Project Initialization

Before sending the prompt, replace the placeholder variables with actual values:

- `{{project_name}}`: The official name of the project from the PRD
- `{{prd_reference_id}}`: A unique identifier for the PRD document
- `{{project_objective}}`: A concise summary of the project's core purpose from PRD Section 1.2
- `{{features_json}}`: A JSON array of feature objects extracted from PRD Section 3.1

Example features_json format:

```json
[
  {
    "feature_id": "F1",
    "name": "User Authentication",
    "description": "Secure login system with email and social authentication options",
    "key_user_outcomes": "Users can securely access their accounts through multiple authentication methods",
    "priority": "High",
    "complexity": "Medium"
  },
  {
    "feature_id": "F2",
    "name": "Dashboard",
    "description": "Interactive dashboard showing key user metrics and activities",
    "key_user_outcomes": "Users can quickly view and understand their account status and recent activities",
    "priority": "High",
    "complexity": "High"
  }
]
```

### Step 2: Task Decomposition Workflow

After receiving the initial response from taskmaster-ai, follow this workflow:

1. **Review Epic Creation**
   - Confirm all features have been properly converted to epics
   - Note the assigned task IDs for each epic

2. **Initiate Detailed Decomposition**
   - For each epic, request detailed task breakdown:
   ```
   @taskmaster-ai
   
   Please perform detailed decomposition of epic {{epic_id}} - "{{epic_name}}"
   
   Requirements for decomposition:
   - Maximum task size: 4 hours of development work
   - Include technical implementation details
   - Specify UI components, API endpoints, database changes, etc.
   - Create clear acceptance criteria for each task
   - Establish dependencies between tasks
   - Tag tasks with appropriate categories
   ```

3. **Analyze Task Complexity**
   - After task decomposition, request complexity analysis:
   ```
   @taskmaster-ai
   
   Please analyze the complexity of all tasks for epic {{epic_id}}
   
   Provide:
   - Complexity score (1-5) for each task
   - Risk assessment for complex tasks
   - Suggestions for breaking down any tasks still too large
   - Overall complexity assessment for the epic
   ```

4. **Generate Implementation Roadmap**
   - Once all epics are decomposed, request a complete roadmap:
   ```
   @taskmaster-ai
   
   Please generate a comprehensive implementation roadmap for project {{project_name}}
   
   Include:
   - Suggested implementation phases
   - Critical path analysis
   - Resource allocation recommendations
   - Timeline estimates with confidence levels
   - Risk mitigation strategies
   ```

### Step 3: Task Refinement

After receiving the complete task breakdown:

1. Review all tasks for clarity and appropriate sizing
2. Identify any tasks that need further decomposition
3. Request refinement of specific tasks if needed:
   ```
   @taskmaster-ai
   
   Please refine task {{task_id}} - "{{task_name}}"
   
   This task appears to be too large/ambiguous. Please break it down further into more precise sub-tasks with clear technical specifications.
   ```

## Best Practices

1. **Maintain Hierarchy**: Ensure a clear 3-level hierarchy (Epics → Tasks → Sub-tasks)
2. **Be Specific**: Each task should have concrete, measurable outcomes
3. **Include Technical Details**: Specify implementation requirements in task descriptions
4. **Set Clear Boundaries**: Define what's in and out of scope for each task
5. **Consider Dependencies**: Establish logical task sequencing
6. **Balance Size**: Tasks should be small enough to be manageable but not so small that overhead increases
7. **Include Validation**: Each task should include acceptance criteria

## Example Task Decomposition

For a feature "User Authentication":

**Epic**: User Authentication System

**Tasks**:
1. Design authentication database schema
2. Implement email registration endpoint
3. Create login form UI component
4. Implement JWT token generation service
5. Create password reset flow

**Sub-tasks** (for "Implement email registration endpoint"):
1. Create API route structure
2. Implement input validation
3. Add email verification logic
4. Implement password hashing
5. Write unit tests for registration endpoint

## Expected Outcome

The result of this process will be a comprehensive task breakdown that:

- Provides clear direction for implementation
- Breaks complex features into manageable pieces
- Establishes logical dependencies and sequencing
- Enables accurate progress tracking
- Facilitates efficient resource allocation

This task structure will serve as the foundation for the implementation phase, guiding the development process with precision and clarity.

## Next Steps

### Saving Your Output

Once this task management setup is complete:

1. Save the task breakdown as `tasks/tasks.json` (confirming this path from `00_Getting_Started.md`).
2. This task hierarchy will guide the implementation phase.

### Moving to Implementation

To proceed with implementing the project:

1. Open the prompt file in `01_AI-RUN/` that corresponds to the `07_Start_Building.md` logical step. (Ensure `00_AutoPilot.md` or your manual process calls the correct actual filename).
2. Share it with your AI agent.
3. Reference your `project_prd.md`, the updated documentation in `02_AI-DOCS/` and `03_SPECS/`, and the task breakdown in `tasks/tasks.json`.

```
@ImplementationArchitect

Please help me implement my project according to the PRD and task breakdown. You can find:
- The complete PRD at: `project_prd.md`
- The task breakdown at: `tasks/tasks.json`
- Technical documentation in the `02_AI-DOCS/` and `03_SPECS/` directories

I'm ready to start building, beginning with the first task in the hierarchy.
```

### What to Expect Next

In the Implementation phase, the AI will:

1. Set up the development environment according to the technology stack
2. Implement the core architectural components
3. Systematically work through tasks in the hierarchy
4. Write code, tests, and documentation
5. Validate implementations against acceptance criteria

This implementation phase will transform the detailed plans and specifications into a working product, following the roadmap established by the task decomposition.


**Expected Response Format from `taskmaster-ai`:**

* The response should be a structured JSON object
* It should indicate success or failure status for each operation
* It should include all generated task identifiers
* It should confirm the final status of affected tasks
* In case of errors, it should provide clear error messages

**Output Storage:**

* All task data will be stored in `tasks/tasks.json`.
* This file will be referenced in the implementation phase.

---

## Task Refinement Follow-up

After receiving the initial task breakdown, you may need to further refine complex tasks:

```
@taskmaster-ai

**Action:** Refine task breakdown for feature and identify subtasks.

**Instructions:**

1. Review the detailed specification for epic [epic_id]
2. Identify complex components that need further breakdown
3. For each complex component, create actionable subtasks
4. Ensure subtasks are granular (4 hours max) but not fragmented
5. Maintain clear parent-child relationships in the task hierarchy

**Expected Response:**
* A list of newly created subtasks with IDs and descriptions
* Confirmation that subtasks have been added to the task system
```
*   Confirmation that these subtasks have been added to the project tracking system under the parent epic.
