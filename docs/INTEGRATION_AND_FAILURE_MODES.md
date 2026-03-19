# Integration & Failure Modes

## Architecture Overview

```
UI Components ──→ React Query Hooks ──→ API Client ──→ Mock Backend
(TaskBoard)       (usePatients)         (client.ts)    (mockBackend.ts)
(PatientRow)      (useTasks)
(TaskCard)        (useTaskMutations)
```

Each layer has a single responsibility:

| Layer | Responsibility | Key Files |
|---|---|---|
| **UI Components** | Rendering, user interaction | `TaskBoard`, `PatientRow`, `TaskCard`, `TaskColumn`, `Filters`, `CreateTaskForm` |
| **State (Hooks)** | Data fetching, caching, mutations, optimistic updates | `usePatients`, `useTasks`, `useTaskMutations` |
| **API Client** | Normalize data, standardize errors | `client.ts` |
| **Backend (Mock)** | In-memory data, simulated delays/failures | `mockBackend.ts` |

---

## Failure Modes & Behavior

### 1. Network Failure on Data Fetch

**Trigger:** `mockBackend` throws with ~20% probability.

**Behavior:**
- React Query retries **3 times** automatically (`retry: 3`).
- If all retries fail, the component renders an **error overlay** with a **Retry button** (calls `refetch()`).
- Patient-level and board-level errors are isolated — one patient failing doesn't block others.

**User experience:** Loading spinner → error message + retry link. No crash, no blank screen.

### 2. Network Failure During Task Update (Optimistic Rollback)

**Trigger:** User changes a task's status/role/date, but the API call fails.

**Behavior:**
1. `onMutate`: Cancel in-flight queries, snapshot the current cache, write optimistic data.
2. `onError`: Restore cache to the snapshot. Show `toast.error()` with the failure message.
3. `onSettled`: Always `invalidateQueries` to resync with the server.

**User experience:** Task visually updates instantly → if server rejects, task snaps back + error toast appears. No stale state.

### 3. Network Failure During Task Creation

**Trigger:** User submits the create form, but the API call fails.

**Behavior:**
- `onError`: `toast.error("Failed to create task. Please try again.")`
- `onSettled`: `invalidateQueries` to resync.
- Form stays open with the entered data so the user can retry without retyping.

### 4. Malformed / Missing Data from Backend

**Trigger:** `mockBackend.simulateImperfectData` randomly drops `dueDate` (~15%) and `title` (~5%).

**Behavior:**
- **API Client (`normalizeTask`)**: Fills missing `title` with `"Untitled Task"`.
- **`TaskCard`**: Uses fallback values (`title || 'Untitled Task'`, `role || 'unassigned'`). Validates `dueDate` with `isNaN(new Date(...).getTime())` before rendering.
- **`filterTasks`**: Tasks with missing or invalid `dueDate` are excluded from time-based filters (overdue/today/upcoming) instead of crashing.

**User experience:** Gracefully degraded cards — never a crash, never a blank field.

### 5. Patient With No Tasks

**Behavior:** Columns show an `<Inbox>` icon with "No tasks" text. No errors thrown.

---

## Adaptation Strategy

### Adding a New Role

1. **Add the value** to the `Role` union type in `src/types/index.ts`:
   ```ts
   export type Role = "nurse" | "dietician" | "social_worker" | "pharmacist";
   ```
2. **Add role config** to `TaskCard.tsx` (`roleConfig` map) — icon, badge color, label.
3. **Add option** to dropdown selects in `TaskCard.tsx`, `CreateTaskForm.tsx`, and `Filters.tsx`.
4. **Add mock data** in `mockBackend.ts` if needed for testing.

No structural changes required. The filter system, optimistic updates, and all hooks work automatically with any `Role` value.

### Adding a New Task Status

1. **Add the value** to the `TaskStatus` union type in `src/types/index.ts`.
2. **Add config** to `TaskColumn.tsx` (`statusConfig` map) — icon, color, label.
3. **Add option** to the status dropdown in `TaskCard.tsx`.
4. **Add the new status** to the `statuses` array in `PatientRow.tsx` to render the column.

### Adding a New Task Field

1. **Add the field** to the `Task` interface in `src/types/index.ts`.
2. **Add normalization** in `client.ts` (`normalizeTask`) if a fallback is needed.
3. **Display it** in `TaskCard.tsx` and add an edit control if needed.
4. **Include it** in `CreateTaskForm.tsx` if it should be set at creation time.

### Swapping to a Real Backend

Replace the function bodies in `src/api/client.ts` with `fetch()`/`axios` calls. The hooks, components, and types remain completely unchanged because the API client is the only layer that touches the backend.
