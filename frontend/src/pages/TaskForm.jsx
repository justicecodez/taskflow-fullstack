import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const TaskForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchTask = async () => {
        try {
          const response = await taskService.getById(id);
          const task = response.data || {};
          setTitle(task.title || '');
          setDescription(task.description || '');
          setStatus(task.status || 'todo');
          setPriority(task.priority || 'medium');
          if (task.due_date) {
            setDueDate(format(new Date(task.due_date), 'yyyy-MM-dd'));
          }
        } catch (err) {
          setError('Failed to fetch task details.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchTask();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});
    
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate || null
    };

    try {
      if (isEditMode) {
        await taskService.update(id, taskData);
      } else {
        await taskService.create(taskData);
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setValidationErrors(err.response.data.errors || {});
      } else {
        setError(err.response?.data?.message || 'Failed to save task.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to {isEditMode ? 'update the' : 'create a new'} task.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Task Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={validationErrors.title?.[0]}
                placeholder="e.g. Design homepage mockup"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details..."
                />
                {validationErrors.description && <p className="mt-1 text-sm text-red-500">{validationErrors.description[0]}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  error={validationErrors.status?.[0]}
                  options={[
                    { label: 'To Do', value: 'todo' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Done', value: 'done' },
                  ]}
                />

                <Select
                  label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  error={validationErrors.priority?.[0]}
                  options={[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                  ]}
                />
              </div>

              <div className="sm:w-1/2">
                <Input
                  label="Due Date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  error={validationErrors.due_date?.[0]}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                <Link to="/dashboard">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
