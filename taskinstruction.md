Mathreya Task Instructions

Purpose

This file is the short operational instruction for AI coding agents working on Mathreya.

Rule: Read context.md first. Use it as the project background. Do not repeatedly ask for the full project context.

How to Work

When the user gives a task:

Read context.md.

Identify the exact requested feature/change.

Inspect only the relevant existing files needed for that task.

Reuse existing Mathreya patterns before creating new ones.

Make the smallest clean change that fully satisfies the task.

Preserve all existing working features.

Keep TypeScript type-safe.

Keep the existing Mathreya visual style.

Keep mobile + desktop responsive behavior.

Run/build/check the project when practical.

Fix errors caused by your changes.

Report what was changed briefly.

Scope Control

Do NOT:

rewrite the whole project

refactor unrelated files

change the design system without being asked

add libraries without a real need

replace existing working components unnecessarily

remove existing features

change backend architecture for a UI-only task

modify Flutter for a React-only task

use fake APIs or claim a real booking/payment/medical action happened

use as any to hide a TypeScript problem when a proper type is possible

If the task is small, make a small change.

Menopause Feature Rule

Menopause is now a required real life-stage module, not a "Coming Soon" placeholder.

The menopause experience should be comparable in quality and structure to Puberty and Pregnancy.

Use the existing project architecture rather than inventing a new architecture.

Required direction

Menopause should cover the appropriate combination of:

overview/education

perimenopause, menopause and postmenopause explanation

symptom/wellness tracking

daily routines/self-care

AI menopause guidance

community

doctor/consultation discovery

media/resources

private safe space

Do not force every module into one giant page. Prefer reusable cards, tabs, sections or subviews consistent with the existing Puberty/Pregnancy UX.

Menopause Navigation

When implementing menopause:

add menopause to AppScreen

add it to LifeStage if the data model requires it

add the route in App.tsx

update Navbar.tsx if the drawer needs a direct menopause item

update DashboardView.tsx

remove Coming Soon

make the dashboard menopause card clickable

create a dedicated menopause view/component

Do not permanently solve the route with as any.

Menopause Content

Keep language:

mature

respectful

reassuring

simple

medically responsible

culturally warm

Important medical framing:

menopause is a normal life stage, not a disease

perimenopause is the transition before menopause

menopause is generally identified after 12 consecutive months without a menstrual period when no other cause explains it

postmenopause follows menopause

Do not:

diagnose

prescribe medication

promise cures

present Ayurveda/home remedies as medical replacements

imply every symptom is caused by menopause

Where appropriate, tell users to consult a qualified clinician.

Menopause Community

Follow the existing community pattern.

Community should allow menopause-related discussion such as:

symptoms

sleep

mood

nutrition

movement

relationships

work/life

perimenopause questions

doctor experiences

postmenopause wellbeing

Keep moderation/privacy concepts consistent with the existing CommunityPost model.

Never expose private health logs as public posts automatically.

Menopause Doctor Area

Create/reuse doctor cards similar to existing healthcare modules.

Possible specialties:

Gynecologist / OB-GYN

Women's health physician

General physician

Endocrinologist

Mental health professional

If booking is only demo UI, label it as such through the existing UX convention. Never claim a real appointment was booked unless a real booking system exists.

Menopause AI

If the task includes AI:

add a menopause_assistant persona in server.ts

keep the AI concise and easy to understand

answer general women's health questions

do not diagnose

do not prescribe

recommend professional care for concerning symptoms

do not use childish/teenage language

do not confuse menopause with pregnancy or puberty

Keep the API key server-side.

Reuse Before Rebuild

Before creating a new UI pattern, inspect:

PubertyView.tsx

PregnancyView.tsx

DashboardView.tsx

Navbar.tsx

types.ts

data.ts

Reuse:

card styles

tab patterns

modal patterns

doctor cards

community structures

AI chat patterns

tracking patterns

responsive layouts

existing icons and haptics

Data / Types

Update types properly when menopause needs new data.

Examples:

menopause

perimenopause

postmenopause

menopause symptom logs

menopause-specific community stage

menopause media categories

menopause journal category

Prefer explicit TypeScript unions/interfaces over any.

Do not modify unrelated interfaces unless needed.

File Selection

Use this priority:

If task is dashboard/navigation

Inspect:

src/App.tsx

src/components/DashboardView.tsx

src/components/Navbar.tsx

src/types.ts

If task is menopause UI

Inspect:

src/components/PubertyView.tsx

src/components/PregnancyView.tsx

relevant data/types
Then create/update the menopause component.

If task is menopause AI

Inspect:

server.ts

existing AI UI component/pattern

If task is community

Inspect:

existing community implementation in Puberty/Pregnancy

src/types.ts

src/data.ts

If task is Flutter

Only inspect/modify flutter_project/ when the user explicitly asks for Flutter work.

Verification

After implementation, check:

TypeScript errors

build errors

broken imports

invalid routes

missing assets

responsive layout

existing navigation

existing modules still accessible

Preferred commands:

npm run lint

npm run build

If a command cannot be run, continue with careful static verification and state that it was not run.

Response Style to User

The user prefers direct, simple, humanized explanations.

After coding:

say what was done

mention important files changed

mention verification status

mention any remaining limitation

Do not dump the entire code unless requested.

Task Input Format

The user can provide only the task after this file is loaded.

Example:

Add menopause navigation and create the basic menopause page.

The agent should infer the project context from context.md, inspect the relevant files, and work directly.

For a larger task, the user can write:

Build the menopause module with overview, symptom tracker, community, doctors, media and AI assistant.

The agent should implement it incrementally using the existing architecture and styling.

Priority Order

When requirements conflict, use this order:

User's latest explicit task

Existing project functionality

context.md

Existing UI/design patterns

General implementation preference

Never let this file override a newer explicit user instruction.