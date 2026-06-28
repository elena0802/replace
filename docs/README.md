# Re:Place Documentation

This directory contains the permanent documentation system for the Re:Place project. These documents govern product decisions, visual identity, design tokens, AI-assisted development, process, architecture, operations, API, database, and implementation workflow.

## Documentation Hierarchy

```
Foundation
├── Product Constitution
├── Core Product Principles
├── Visual Language Guide
├── Design System v2
└── AI Design Rules

Process
├── Feature RFC Template
└── Product Roadmap Philosophy

Architecture
├── Information Architecture
├── Interaction Specification
├── Component Specification
├── Engineering Architecture
└── AI Prompt Guide

Operations
├── Product Metrics
├── Release Process
├── Git Workflow
├── Security Guide
└── Accessibility Guide

API / Database
├── API Specification
└── Database Schema

Playbook
├── Development Playbook
└── Changelog Guide

AI Context
└── AI Context Pack (docs/AI_CONTEXT.md)

Implementation
```

### Decision flow (read top to bottom)

```
Product Constitution
        ↓
Core Product Principles
        ↓
Visual Language Guide
        ↓
Design System v2
        ↓
AI Design Rules
        ↓
Feature RFC Template
        ↓
Product Roadmap Philosophy
        ↓
Information Architecture → Interaction Specification → Component Specification
        ↓
Engineering Architecture
        ↓
AI Prompt Guide
        ↓
Operations (Metrics · Release · Git · Security · Accessibility)
        ↓
API Specification · Database Schema
        ↓
Development Playbook · Changelog Guide
        ↓
AI Context (session entry — load first before coding)
        ↓
Implementation
```

When documents conflict:

| Topic | Source of truth |
|-------|-----------------|
| Product identity | **Product Constitution** |
| Feature fit | **Core Product Principles** |
| Emotional/visual character | **Visual Language Guide** |
| Tokens and UI specs | **Design System v2** |
| AI behavior | **AI Design Rules** + **AI Prompt Guide** |
| Prioritization | **Product Roadmap Philosophy** |
| Routes and mental model | **Information Architecture** |
| Interaction behavior | **Interaction Specification** |
| Component design | **Component Specification** |
| Code structure | **Engineering Architecture** |
| HTTP routes | **API Specification** |
| Data model and RLS | **Database Schema** |
| Day-to-day build process | **Development Playbook** |
| Release notes format | **Changelog Guide** |
| Agent session entry | **AI Context** |
| Success measurement | **Product Metrics** |
| Shipping quality | **Release Process** |
| Repository collaboration | **Git Workflow** |
| Trust and data protection | **Security Guide** |
| Inclusive UX | **Accessibility Guide** |

## Before Implementation

Contributors and AI agents should **not start coding** until context is loaded in this order:

1. **[AI Context](AI_CONTEXT.md)** — compressed identity, rules, and self-checklist
2. **Relevant Foundation docs** — Constitution, Principles, Design System as needed
3. **Relevant Architecture docs** — IA, Components, Engineering for the task
4. **Relevant Operations docs** — Security, Git, Release when shipping or touching trust
5. **Relevant API / Database docs** — [API Specification](api/API_SPECIFICATION.md) and [Database Schema](database/DATABASE_SCHEMA.md) for routes, queries, or migrations

Then follow the [Development Playbook](playbook/DEVELOPMENT_PLAYBOOK.md) from branch through release.

## Foundation Documents

| Document | Path | Purpose |
|----------|------|---------|
| Product Constitution | [`foundation/PRODUCT_CONSTITUTION.md`](foundation/PRODUCT_CONSTITUTION.md) | Governing law for product, design, and AI |
| Core Product Principles | [`foundation/CORE_PRODUCT_PRINCIPLES.md`](foundation/CORE_PRODUCT_PRINCIPLES.md) | Feature fit and product logic |
| Visual Language Guide | [`foundation/VISUAL_LANGUAGE_GUIDE.md`](foundation/VISUAL_LANGUAGE_GUIDE.md) | Brand personality and visual direction |
| Design System v2 | [`foundation/DESIGN_SYSTEM_V2.md`](foundation/DESIGN_SYSTEM_V2.md) | Tokens, components, and UI specification |
| AI Design Rules | [`foundation/AI_DESIGN_RULES.md`](foundation/AI_DESIGN_RULES.md) | Rules for AI-assisted UI/UX generation |

## Process Documents

| Document | Path | Purpose |
|----------|------|---------|
| Feature RFC Template | [`process/FEATURE_RFC_TEMPLATE.md`](process/FEATURE_RFC_TEMPLATE.md) | Mandatory template before design and development |
| Product Roadmap Philosophy | [`process/PRODUCT_ROADMAP_PHILOSOPHY.md`](process/PRODUCT_ROADMAP_PHILOSOPHY.md) | Prioritization tiers and roadmap decision framework |

## Architecture Documents

| Document | Path | Purpose |
|----------|------|---------|
| Information Architecture | [`architecture/INFORMATION_ARCHITECTURE.md`](architecture/INFORMATION_ARCHITECTURE.md) | Mental model, routes, navigation — where features live |
| Interaction Specification | [`architecture/INTERACTION_SPECIFICATION.md`](architecture/INTERACTION_SPECIFICATION.md) | How every interaction should feel and behave |
| Component Specification | [`architecture/COMPONENT_SPECIFICATION.md`](architecture/COMPONENT_SPECIFICATION.md) | Component taxonomy, primitives, and extension rules |
| Engineering Architecture | [`architecture/ENGINEERING_ARCHITECTURE.md`](architecture/ENGINEERING_ARCHITECTURE.md) | App structure, data flow, Supabase, security, performance |
| AI Prompt Guide | [`architecture/AI_PROMPT_GUIDE.md`](architecture/AI_PROMPT_GUIDE.md) | How AI agents load docs, prompt, and avoid identity drift |

## Operations Documents

| Document | Path | Purpose |
|----------|------|---------|
| Product Metrics | [`operations/PRODUCT_METRICS.md`](operations/PRODUCT_METRICS.md) | Archive-aligned success measurement — meaning before growth |
| Release Process | [`operations/RELEASE_PROCESS.md`](operations/RELEASE_PROCESS.md) | Official release workflow and Definition of Done |
| Git Workflow | [`operations/GIT_WORKFLOW.md`](operations/GIT_WORKFLOW.md) | Branches, commits, PRs, and AI git rules |
| Security Guide | [`operations/SECURITY_GUIDE.md`](operations/SECURITY_GUIDE.md) | Trust model, auth, RLS, secrets, privacy |
| Accessibility Guide | [`operations/ACCESSIBILITY_GUIDE.md`](operations/ACCESSIBILITY_GUIDE.md) | WCAG-aligned standards for every screen |

## API

| Document | Path | Purpose |
|----------|------|---------|
| API Specification | [`api/API_SPECIFICATION.md`](api/API_SPECIFICATION.md) | Current HTTP routes, auth, payloads, errors, and change policy |

## Database

| Document | Path | Purpose |
|----------|------|---------|
| Database Schema | [`database/DATABASE_SCHEMA.md`](database/DATABASE_SCHEMA.md) | Tables, RLS, storage, migrations, and change policy |

## Playbook

| Document | Path | Purpose |
|----------|------|---------|
| Development Playbook | [`playbook/DEVELOPMENT_PLAYBOOK.md`](playbook/DEVELOPMENT_PLAYBOOK.md) | Idea-to-release workflow for humans and AI |
| Changelog Guide | [`playbook/CHANGELOG_GUIDE.md`](playbook/CHANGELOG_GUIDE.md) | How to write user-facing release notes |

## AI Context

| Document | Path | Purpose |
|----------|------|---------|
| AI Context Pack | [`AI_CONTEXT.md`](AI_CONTEXT.md) | Single compressed starting point before any implementation session |

## Other Documentation

| Document | Path | Purpose |
|----------|------|---------|
| Supabase Setup | [`supabase-setup.md`](supabase-setup.md) | Database and auth configuration |
| Deployment | [`deployment.md`](deployment.md) | Deployment instructions |

## For Contributors

| Role | Start here |
|------|------------|
| **Designers** | Visual Language Guide → Design System v2 → Component Specification → Accessibility Guide |
| **Engineers** | AI Context → Development Playbook → Engineering Architecture → API/Database specs → Git Workflow |
| **Product** | Product Constitution → Core Product Principles → Product Metrics → Product Roadmap Philosophy |
| **AI agents** | **AI Context** → Development Playbook → AI Prompt Guide → task-specific docs |

## Typical Workflows

### Starting implementation (any task)

1. Read [AI Context](AI_CONTEXT.md)  
2. Read [Development Playbook](playbook/DEVELOPMENT_PLAYBOOK.md)  
3. Load task-specific Foundation, Architecture, Operations, API, Database docs  
4. RFC if required → branch → implement → DoD → PR  

### Proposing a new feature

1. Read Product Constitution and Core Product Principles  
2. Copy Feature RFC Template → fill completely  
3. Score with Product Roadmap Philosophy prioritization framework  
4. Assign tier (1–5) — confirm not on Never list  
5. Confirm IA placement in Information Architecture  
6. Confirm API/Database impact in API Specification and Database Schema  
7. Obtain approval → implement per Architecture specs  

### Building UI

1. Design System v2 + Component Specification  
2. Interaction Specification + Accessibility Guide  
3. Visual Language Guide for tone and motion  

### Shipping a release

1. Complete [Release Process](operations/RELEASE_PROCESS.md) checklists  
2. Draft notes per [Changelog Guide](playbook/CHANGELOG_GUIDE.md)  
3. [Git Workflow](operations/GIT_WORKFLOW.md) PR + human approval  
4. [Security Guide](operations/SECURITY_GUIDE.md) and [Accessibility Guide](operations/ACCESSIBILITY_GUIDE.md) reviews as applicable  
5. Post-release monitoring per Release Process  

### AI-assisted implementation

1. [AI Context](AI_CONTEXT.md) — always first  
2. [Development Playbook](playbook/DEVELOPMENT_PLAYBOOK.md) — workflow  
3. AI Prompt Guide — documentation loading order  
4. AI Design Rules — constraints  
5. Git Workflow — no auto commit/push/merge  
6. Run AI self-checklist before PR  

### Measuring success

1. [Product Metrics](operations/PRODUCT_METRICS.md) — north star and primary metrics  
2. Reject DAU/session-length optimization as success  
3. Quarterly review aligned with Product Roadmap Philosophy  

### Prioritizing backlog

1. Product Roadmap Philosophy — tier assignment and weighted score  
2. Prefer Tier 1 debt and Tier 2 archive experience over expansion  
3. Reject or amend anything on Never list without constitution change  

---

This document is part of the Re:Place documentation system.
