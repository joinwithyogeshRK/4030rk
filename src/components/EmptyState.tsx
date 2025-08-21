import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  filter: 'all' | 'active' | 'completed';
}

const EmptyState = ({ filter }: EmptyStateProps) => {
  let message = '';
  let subMessage = '';

  switch (filter) {
    case 'all':
      message = 'No tasks yet';
      subMessage = 'Add your first task to get started';
      break;
    case 'active':
      message = 'No active tasks';
      subMessage = 'All your tasks are completed!';
      break;
    case 'completed':
      message = 'No completed tasks';
      subMessage = 'Complete some tasks to see them here';
      break;
  }

  return (
    <div className="empty-state py-12">
      <ClipboardList className="w-16 h-16 mb-4 text-muted" />
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm">{subMessage}</p>
    </div>
  );
};

export default EmptyState;
