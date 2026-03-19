import { TaskBoard } from '../components/TaskBoard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 w-full max-w-[1600px] mx-auto">
      <TaskBoard />
    </div>
  )
}
