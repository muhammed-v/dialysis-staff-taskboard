# Care Plan Taskboard for Dialysis Center Staff

A frontend system for managing patient care tasks across multiple healthcare roles (nurse, dietician, social worker), designed to handle **imperfect backend data, network failures, and optimistic UI updates**.

---

## 🚀 Overview

Dialysis centers require coordination between multiple roles managing recurring and ad-hoc tasks per patient. This project implements a **taskboard interface** that allows staff to:

* View patient-specific tasks grouped by status
* Filter tasks by role and time
* Create and update tasks with **optimistic UI**
* Handle unreliable backend responses gracefully

The focus of this implementation is **robust frontend architecture**, not feature breadth.

---

## 🧱 Architecture Overview

The system is structured with clear separation of concerns:

```
UI Components → Hooks (React Query) → API Client → Mock Backend Layer
```

### Key Layers

* **UI Layer**
  * Stateless, reusable components (TaskCard, TaskColumn, TaskBoard)
* **State Layer**
  * Managed using React Query for server-state synchronization
* **API Layer**
  * Encapsulates all backend communication
* **Mock Backend**
  * Simulates latency, failures, and inconsistent data (custom layer)

### Folder Structure

```
src/
 ├── api/            # API client & Mock backend
 ├── types/          # TypeScript interfaces
 ├── hooks/          # React Query hooks
 ├── components/     # UI components
 ├── pages/          # Page-level components
 ├── utils/          # Helper functions (filterTasks)
 └── test/           # Vitest test suites
```

---

## 🧠 Data Modeling

Given ambiguous backend specifications, the following data contracts were defined:

### Patient

```ts
type Patient = {
  id: string
  name: string
  age?: number
}
```

### Task

```ts
type Role = "nurse" | "dietician" | "social_worker"

type TaskStatus = "todo" | "in_progress" | "completed"

type Task = {
  id: string
  patientId: string
  title: string
  role: Role
  status: TaskStatus
  dueDate?: string
  createdAt: string
}
```

### Design Decisions

* `dueDate` is optional → backend may omit it
* Strict enums for `role` and `status` → ensures predictable UI behavior
* Tasks are normalized by `patientId` → enables efficient grouping

---

## ⚖️ Assumptions & Trade-offs

### Assumptions

* Authentication is out of scope
* Dataset is small → no pagination implemented
* Tasks belong to a single patient
* Backend may return incomplete or malformed data

### Trade-offs

* Used **React Query** instead of Redux to reduce boilerplate and leverage built-in caching and retries
* Custom mock backend instead of real API to simulate failure scenarios
* Focused on **core workflows** rather than exhaustive features

---

## 🔄 State Management

**React Query (TanStack Query)** is used for managing server state.

### Why React Query?

* Built-in caching and background refetching
* Native support for **optimistic updates**
* Automatic retry on failure
* Simplifies loading and error state handling

---

## ⚡ Key Features

### Taskboard View
* Rows represent patients
* Columns represent task status (Todo, In Progress, Completed)

### Filtering
* By role: nurse, dietician, social worker
* By time:
  * Overdue
  * Due today
  * Upcoming

### Task Management
* Create new tasks
* Update task status with **optimistic UI**
* **Success/Error Toasts** for all mutation states

---

## 💥 Integration & Failure Modes

### 1. Network Failures
* Automatic retries via React Query
* Error messages displayed to user
* Retry actions available on rows

### 2. Optimistic Updates
* UI updates immediately on user action
* If server request fails:
  * Previous state is restored (rollback)
  * User is notified via toast

### 3. Inconsistent Backend Data
Handled via:
* Optional chaining
* Default fallbacks
* Defensive rendering (in `filterTasks` utility)

---

## 🔮 Extensibility

### Adding a New Role
* Extend `Role` type in `src/types/index.ts`
* UI automatically adapts once `roleConfig` in `TaskCard.tsx` is updated.

### Adding New Task Status
* Extend `TaskStatus` type in `src/types/index.ts`
* Column renders automatically once added to `statuses` in `PatientRow.tsx`.

### Scaling Backend
* Replace mock functions in `src/api/client.ts` with real endpoints.
* No UI changes required due to API abstraction layer.

---

## 🧪 Testing Strategy

### Covered Areas
* **Optimistic update rollback** (server error handling)
* **Filtering logic** (role and date correctness)

### Tools Used
* Vitest (test runner)
* React Testing Library (component/hook testing)

---

## 🛠️ Setup Instructions

```bash
git clone <repo-url>
cd dialysis-staff-taskboard
npm install
npm run dev
```

App will be available at:
```
http://localhost:5173
```

---

## 📦 Mock Backend

A custom mock layer in `src/api/mockBackend.ts` is used to simulate:
* Network latency
* Random failures (~20%)
* Partial/malformed responses (missing titles, invalid dates)

---

## 🤖 AI Usage

AI tools were used for:
* Initial logic setup and structural scaffolding
* Defining the optimistic update hook pattern
* Generating the colorful UI redesign based on a clinical theme

### Manual Adjustments
* Custom theme redesign (green/emerald palette with Lucide icons)
* Refined data models and error handling logic
* Integration of `react-hot-toast` for real-time user feedback

---

## 🚧 Known Limitations
* No authentication or real-time persistence
* No drag-and-drop task movement
* Limited dataset size for the mock layer

---

## 🎯 Final Note

This project prioritizes **system resilience** and **clean UI logic** over breadth of features. It demonstrates how a production-ready dialysis taskboard should handle the messiness of real-world backend integrations.
