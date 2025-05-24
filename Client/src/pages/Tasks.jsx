"use client"

import { useState } from "react"
import { IoMdAdd } from "react-icons/io"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button, Loading, Title } from "../components"
import { AddTask, BoardView } from "../components/tasks"
import { useGetAllTaskQuery, useAutoAssignTasksMutation } from "../redux/slices/api/taskApiSlice"
import { useGetUserQuery } from "../redux/slices/api/userApiSlice"

const Tasks = () => {
  const [open, setOpen] = useState(false)
  const { status: rawStatus } = useParams()
  const status = rawStatus?.toLowerCase()

  const { data, isLoading, isError, refetch } = useGetAllTaskQuery({
    strQuery: status || "",
    isTrashed: "",
    search: "",
  })

  const { data: user } = useGetUserQuery()
  const [autoAssignTasks, { isLoading: isAutoAssigning }] = useAutoAssignTasksMutation()

  const handleAutoAssign = async () => {
    try {
      const result = await autoAssignTasks().unwrap()
      toast.success(result.message)
      // Refetch tasks to show updated assignments
      refetch()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Auto assign error:", error)
      toast.error(error?.data?.message || "Failed to auto assign tasks")
    }
  }

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    )
  }

  if (isError) {
    return <div className="py-10 text-center text-red-500">Error loading tasks</div>
  }

  return (
    <div className="w-full">
      <AddTask open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between mb-4">
        <Title title={rawStatus ? `${rawStatus} Tasks` : "Tasks"} />

        <div className="flex gap-2">
          {/* Show Auto Assign button only for admins and on main tasks page */}
          {!rawStatus && user?.isAdmin && (
            <Button
              label={isAutoAssigning ? "Assigning..." : "Auto Assign"}
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-green-600 text-white rounded-md py-2 2xl:py-2.5 hover:bg-green-700 disabled:opacity-50"
              onClick={handleAutoAssign}
              disabled={isAutoAssigning}
            />
          )}

          {/* Show Create Task button for admins */}
          {user?.isAdmin && (
            <Button
              label="Create Task"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5 hover:bg-blue-700"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>

      <div className="py-4">
        <BoardView tasks={data?.tasks || []} />
      </div>
    </div>
  )
}

export default Tasks
