import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Pagination } from '../components/Pagination';
import { PlusCircle, Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page: currentPage };
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;

      const response = await taskService.getAll(params);
      const apiResponse = response.data || response;
      let tasksData = apiResponse.data || apiResponse;
      let metaData = response.meta || null;

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      if (metaData && metaData.last_page) {
        setPaginationMeta({
          current_page: metaData.current_page || 1,
          last_page: metaData.last_page || 1,
          total: metaData.total || 0
        });
      } else {
        setPaginationMeta(null);
      }
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterPriority, currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status !== 'done').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/tasks/create">
              <Button variant="primary">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.completed}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pending}</dd>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <Select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // Reset to first page on filter
            }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'To Do', value: 'todo' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Done', value: 'done' },
            ]}
            className="sm:w-48"
          />
          <Select
            label="Filter by Priority"
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setCurrentPage(1); // Reset to first page on filter
            }}
            options={[
              { label: 'All Priorities', value: '' },
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            className="sm:w-48"
          />
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : tasks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDelete={handleDelete} />
              ))}
            </div>

            {paginationMeta && (
              <Pagination
                currentPage={paginationMeta.current_page}
                lastPage={paginationMeta.last_page}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 border-dashed">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task or adjust your filters.
            </p>
            <div className="mt-6">
              <Link to="/tasks/create">
                <Button variant="primary">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
