import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectIsAuthenticated } from "../redux/slices/authSlice";
import { toast } from "sonner";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

// Map URL parameters to correct stage values
const STAGE_MAP = {
  'inprogress': 'in progress',
  'todo': 'todo',
  'completed': 'completed'
};

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [searchParams] = useSearchParams();
  const [searchTerm] = useState(searchParams.get("search") || "");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);

  // Map the URL parameter to the correct stage value
  const rawStatus = params?.status || "";
  const status = STAGE_MAP[rawStatus.toLowerCase()] || rawStatus.toLowerCase();

  const { data: taskData, isLoading, error } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  }, {
    skip: !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/log-in');
      return;
    }

    if (error) {
      console.error('Task fetch error:', error);
      if (error.status === 401) {
        dispatch(logout());
        navigate('/log-in');
        return;
      }
      toast.error(error.data?.message || 'Failed to load tasks');
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('URL status parameter:', rawStatus);
    console.log('Mapped status:', status);
    console.log('Tasks data:', taskData);
  }, [rawStatus, status, taskData]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-10 text-center text-red-500'>
        Error loading tasks: {error.data?.message || 'Something went wrong'}
      </div>
    );
  }

  // Check if we have valid task data
  const tasks = taskData?.status ? taskData.tasks : [];

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={rawStatus ? `${rawStatus} Tasks` : "Tasks"} />

        {!rawStatus && user?.isAdmin && (
          <Button
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!rawStatus && (
            <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
              <TaskTitle label='To Do' className={TASK_TYPE.todo} />
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label='Completed' className={TASK_TYPE.completed} />
            </div>
          )}

          {selected === 0 ? (
            <BoardView tasks={tasks} />
          ) : (
            <Table tasks={tasks} />
          )}
        </Tabs>
      </div>
      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
