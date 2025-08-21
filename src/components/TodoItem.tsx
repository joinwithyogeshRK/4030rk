import { useState } from 'react';
import { Todo } from './TodoApp';
import { CheckCircle, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDetails: (id: string, details: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onUpdateDetails }: TodoItemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(todo.details || '');

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(e.target.value);
    onUpdateDetails(todo.id, e.target.value);
  };

  return (
    <div className="group task-item">
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "checkbox-container",
          todo.completed && "checkbox-checked"
        )}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed ? (
          <CheckCircle className="h-5 w-5 text-primary-foreground animate-checkbox-check" />
        ) : (
          <Circle className="h-5 w-5 text-primary" />
        )}
      </button>

      <span 
        className={cn(
          "flex-1 transition-all", 
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.title}
      </span>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="task-detail-toggle mr-2"
      >
        {showDetails ? (
          <>
            <span className="mr-1">Hide</span>
            <ChevronUp className="h-4 w-4 inline" />
          </>
        ) : (
          <>
            <span className="mr-1">Details</span>
            <ChevronDown className="h-4 w-4 inline" />
          </>
        )}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="delete-button opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {showDetails && (
        <div className="task-details w-full mt-2">
          <Textarea
            placeholder="Add details about this task..."
            value={details}
            onChange={handleDetailsChange}
            className="w-full min-h-[80px] bg-transparent border-muted"
          />
        </div>
      )}
    </div>
  );
};

export default TodoItem;
