# Task & Notes Management App: Project Plan

A personal portfolio project for practicing Supabase with React, ShadCN UI and Tailwind CSS.

## 1. Overview

This app lets a signed-in user manage their own tasks and notes in one place. Tasks have a status, priority and due date. Notes are free-form text and can optionally be attached to one task. Deleted items go to a Trash where they can be restored or permanently removed.

The main purpose is learning. Every feature in this plan exists to exercise a specific part of Supabase: authentication, PostgreSQL tables and relationships, Row Level Security (RLS), the JavaScript client, and query filtering. The result should also be a clean, deployable portfolio piece that an employer can open and use.

## 2. Goals and Scope

**Learning goals**

- Understand how Supabase Auth creates and tracks users and sessions.
- Design relational tables with foreign keys, constraints, defaults and indexes.
- Write RLS policies so each user can only reach their own data.
- Use the Supabase JavaScript client for create, read, update, delete, filtering, sorting and searching.
- Implement soft delete and restore.
- Deploy a full-stack app on free tiers.

**In scope**

- Email and password registration, login, logout and protected pages.
- Task CRUD with status, priority and due date.
- Note CRUD with an optional one-to-one link to a task.
- Filtering, sorting and searching.
- Trash with restore and permanent delete.
- A simple dashboard with counts and upcoming deadlines.

**Out of scope (for this version)**

- Categories, tags, labels or folders. Organization is by status, priority and due date only.
- Sharing or collaboration between users.
- File attachments, reminders, notifications or email.
- Realtime sync, offline mode, and a mobile app.
- TypeScript. The project uses vanilla JavaScript (ES6+).

Keeping the scope small is deliberate. A finished, polished small app is worth more in a portfolio than a large unfinished one.

## 3. Tech Stack

- **Front end:** React 19 with React Router, vanilla JavaScript.
- **UI:** ShadCN UI components, Tailwind CSS, Lucide React icons.
- **Back end:** Supabase on the free tier: PostgreSQL, Auth, RLS and the JavaScript client.
- **Tooling:** Vite, VS Code, Git and GitHub.
- **Hosting:** Vercel for the front end, Supabase cloud for the back end.

**Design direction.** The interface should look formal and clean: lightly sharp corners (`rounded-md` rather than very round shapes), a restrained color palette, clear spacing, and a consistent sidebar layout. ShadCN theme colors live in `index.css` so they can be changed in one place.

## 4. Features

### 4.1 Authentication

- Register with email and password, then log in and log out.
- Session persists after a page refresh.
- Protected routes redirect signed-out visitors to the login page. Signed-in users who visit login or register are redirected to the dashboard.
- Clear error messages for wrong password, existing email and weak password.
- Stretch goal: password reset by email.

### 4.2 Tasks

- Create a task with a title (required), description, status, priority and due date.
- **Status values:** To Do, In Progress, Done.
- **Priority values:** Low, Medium, High.
- Edit any field. Quick actions to change status or mark done directly from the list.
- Filter by status and priority. Sort by due date, priority or created date.
- Search by title.
- Overdue tasks (past due date and not Done) are visibly highlighted.
- Deleting a task moves it to Trash.

### 4.3 Notes

- Create a note with a title and body text.
- Edit and search notes by title or content.
- Sort by last updated.
- Deleting a note moves it to Trash.

### 4.4 Linking a Note to a Task

- A note can be attached to at most one task, and a task can have at most one note (one-to-one).
- Linking and unlinking is done from either side: from the task detail view or from the note editor.
- A task that already has a note cannot be given a second one. The UI shows the existing note instead.
- A note without a task is a standalone note.

### 4.5 Trash (Soft Delete)

- Deleted tasks and notes are marked with a deletion timestamp instead of being removed.
- The Trash page lists both types, with the date deleted.
- Each item can be restored or permanently deleted. "Empty Trash" removes everything after a confirmation dialog.
- Normal lists never show trashed items.
- Rules for links: trashing a task or note keeps the link so restoring brings the pair back together. Permanently deleting a task leaves its note in place as a standalone note.

### 4.6 Dashboard

- Counts of tasks by status.
- Tasks due today and the next seven days.
- Count of overdue tasks.
- Most recently edited notes.

## 5. Pages and Navigation

- **/login and /register:** public auth pages.
- **/dashboard:** summary cards and upcoming tasks.
- **/tasks:** task list with filters, search and a create/edit dialog.
- **/notes:** note list with search and an editor.
- **/trash:** deleted tasks and notes with restore and permanent delete.
- **/settings (optional):** account email and logout.

The layout is a persistent sidebar (Dashboard, Tasks, Notes, Trash) with a top bar showing the user and a logout button. Dialogs and sheets are used for create and edit forms so users stay on the same page.

ShadCN components expected: Button, Input, Textarea, Label, Card, Dialog, Sheet, Select, Badge, Table or list rows, Tabs, Dropdown Menu, Alert Dialog (confirm delete), Toast (feedback), Skeleton (loading states), Calendar and Popover (date picker).

## 6. Database Design

Supabase already provides the `auth.users` table. The app adds two tables that reference it.

### Table: tasks

- **id:** UUID, primary key, generated by default.
- **user\_id:** UUID, required, references the auth user, defaults to the signed-in user, deletes with the user.
- **title:** text, required.
- **description:** text, optional.
- **status:** text, required, default To Do, restricted to the three allowed values by a check constraint.
- **priority:** text, required, default Medium, restricted to the three allowed values by a check constraint.
- **due\_date:** date, optional.
- **deleted\_at:** timestamp, null while active, set when trashed.
- **created\_at / updated\_at:** timestamps with defaults. `updated_at` is refreshed by a small trigger.

### Table: notes

- **id:** UUID, primary key.
- **user\_id:** UUID, required, same rules as tasks.
- **task\_id:** UUID, optional, references tasks, with a **unique constraint** so only one note can point to a given task. This is what enforces the one-to-one link. If a task is permanently deleted, `task_id` is set to null.
- **title:** text, required.
- **content:** text, optional.
- **deleted\_at:** timestamp, null while active.
- **created\_at / updated\_at:** same as tasks.

### Indexes

- tasks: index on user\_id, and on (user\_id, status), (user\_id, due\_date).
- notes: index on user\_id, and on task\_id (covered by the unique constraint).
- Optional: an index on deleted\_at, or a partial index for active rows, if the lists grow.

### Why these choices

- A check constraint on status and priority keeps invalid values out at the database level, not only in the UI.
- Soft delete through `deleted_at` is simple and reversible, and it teaches an important real-world pattern.
- The unique constraint on `task_id` makes the one-to-one rule a guarantee instead of something the front end must remember.
- Because `user_id` defaults to the signed-in user, the client never has to send it, which prevents spoofing.

## 7. Row Level Security Plan

RLS is the most important Supabase concept in this project, so it gets its own section.

**Principle:** RLS is enabled on both tables, and the only rows a user can touch are rows where `user_id` equals their own authenticated ID.

**Policies for each table (tasks and notes):**

- **Select:** allowed when the row's user\_id matches the signed-in user.
- **Insert:** allowed only if the new row's user\_id matches the signed-in user (a WITH CHECK rule).
- **Update:** allowed on own rows, and the result must still belong to the same user.
- **Delete:** allowed on own rows (used for permanent delete).

**Extra rule for links:** a note may only point to a task owned by the same user. This is enforced with a check in the insert and update policies, or a small trigger, so a user cannot attach their note to someone else's task by guessing an ID.

**Things to remember**

- Policies apply to the `authenticated` role. Anonymous visitors get nothing.
- The `anon` key in the front end is safe to expose only because RLS is on. Never put the `service_role` key in the front end.
- Test by creating two accounts and confirming neither can read, edit or delete the other's data, even by calling the API directly.

## 8. Project Structure

A simple, consistent structure keeps the code easy to follow.

- **src/lib:** the Supabase client setup and small helpers (date formatting, class names).
- **src/services:** functions that talk to Supabase, one file per area: authService, taskService, noteService, trashService. Pages never call Supabase directly.
- **src/context:** AuthContext that holds the current user and session and exposes login, register and logout.
- **src/hooks:** small hooks for loading lists, such as useTasks and useNotes, and for toasts and confirmations.
- **src/components/ui:** ShadCN components (generated).
- **src/components/layout:** Sidebar, Topbar, ProtectedRoute, PageHeader.
- **src/components/tasks, notes, trash, dashboard:** feature-specific pieces such as TaskForm, TaskRow, NoteEditor, TrashList, StatCard.
- **src/pages:** one file per route.
- **Environment file:** the Supabase project URL and anon key, kept out of Git.

Naming convention: PascalCase for components, camelCase for functions and files in services, and verbs for service functions (getTasks, createTask, softDeleteTask, restoreTask, permanentlyDeleteTask).

## 9. Build Order (Nov 9 to Nov 13)

### Day 1 (Nov 9): Setup and Authentication

- Create the Vite React project, install React Router, Tailwind, ShadCN and Lucide.
- Set the theme colors and base layout style.
- Create the Supabase project in the new organization and copy the URL and anon key into the environment file.
- Build AuthContext, the login and register pages and ProtectedRoute.
- Done when: you can register, log in, refresh and stay signed in, and log out.

### Day 2 (Nov 10): Schema, RLS and Tasks

- Create the tasks and notes tables, constraints, indexes and the updated\_at trigger.
- Enable RLS and add all policies.
- Build the app layout (sidebar and top bar).
- Build the Tasks page: list, create and edit dialog, and status change.
- Done when: tasks save to the database and only appear for the user who created them.

### Day 3 (Nov 11): Filtering and Notes

- Add task filters, sorting, search and overdue highlighting.
- Build the Notes page with list, search and editor.
- Done when: both lists support create, edit, search and sorting.

### Day 4 (Nov 12): Linking and Trash

- Add the note-to-task link from both sides, with the one-to-one rule handled in the UI.
- Switch delete to soft delete for both types, then build the Trash page with restore, permanent delete and empty trash.
- Done when: linked items behave correctly through delete and restore.

### Day 5 (Nov 13): Dashboard, Polish and Deploy

- Build the dashboard counts and upcoming list.
- Add loading skeletons, empty states, error toasts and confirmation dialogs.
- Run the full testing checklist, including the two-account RLS test.
- Deploy to Vercel and write the README.

If a day runs long, move the dashboard or the password reset to a later pass. Auth, RLS, tasks, notes and trash are the core.

## 10. Testing Checklist

**Authentication**

- Registration, login, logout and refresh all behave correctly.
- Protected pages redirect when signed out.

**Data and RLS**

- With account A, create tasks and notes. With account B, confirm none of them are visible.
- Try to open, edit or delete account A's row by ID while signed in as B. It must fail.
- Confirm a note cannot be linked to another user's task.

**Features**

- Every filter and sort option returns the expected rows.
- Required fields are validated, and invalid status or priority values are rejected.
- A task cannot receive a second note.
- Trashed items disappear from normal lists, and restoring brings them back with their link.
- Permanent delete of a task leaves its note as a standalone note.

**Interface**

- Loading, empty and error states appear where expected.
- Layout works on a laptop and on a phone-sized screen.

## 11. Deployment and Portfolio Presentation

- Push the project to a public GitHub repository, with the environment file excluded.
- Deploy to Vercel and add the Supabase URL and anon key as environment variables.
- In Supabase Auth settings, add the deployed URL as an allowed site URL and redirect.
- Remember that free Supabase projects can pause after a period of inactivity. Open the app before showing it to anyone.

**README should include**

- A short description and a live demo link.
- Screenshots of the dashboard, tasks, notes and trash.
- The tech stack and a list of features.
- The database schema diagram and a short explanation of the RLS policies. This is what sets the project apart from a basic CRUD demo.
- Setup steps for running the project locally.
- A short "what I learned" section.

## 12. Project Name Ideas

- **Docket:** a docket is an official list of things to be handled. Short, formal and easy to remember.
- **Tasklane:** suggests tasks moving along an organized path.
- **Notewell:** a play on "note well", fitting for a notes feature.
- **Plumeline:** a plume is a writing quill, and a line is a list of tasks.
- **Taskpad:** simple and descriptive.
- **Jotwork:** quick notes plus work items.
- **Quillboard:** writing and organizing together.
- **Ledgerly:** a ledger of everything you need to do and remember.

Docket and Plumeline are the most distinctive and fit a formal interface. Before committing, search the name quickly to make sure no well-known product already uses it.

## 13. Open Decisions

These are small choices to settle before or during the build:

- **Auto-delete Trash:** keep items until manually removed, or purge after 30 days. A scheduled purge is a good later enhancement.
- **Trashed items and the one-to-one link:** this plan keeps the link while trashed, which means a task with a trashed note cannot get a new note until the old one is restored or permanently deleted. Confirm you are happy with that rule.
- **Notes format:** plain text only, or simple Markdown rendering.
- **Email confirmation:** keep it off while developing for faster testing, and turn it on before deploying.
- **Final app name.**
