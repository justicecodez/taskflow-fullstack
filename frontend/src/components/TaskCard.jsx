import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { format } from 'date-fns';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskCard = ({ task, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
        <div className="flex space-x-2">
          <Link to={`/tasks/${task.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4 text-gray-500" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description || 'No description provided.'}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100'}`}>
          {task.status.replace('_', ' ').toUpperCase()}
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority] || 'bg-gray-100'}`}>
          {task.priority.toUpperCase()} Priority
        </span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 space-x-4">
        {task.due_date && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
