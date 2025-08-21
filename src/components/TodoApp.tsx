import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, Circle, Trash2, Plus, Info, X, CheckCheck, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import EmptyState from './EmptyState';
import TodoItem from './TodoItem';
import { useTheme } from './ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  details?: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('onboardingShown') !== 'true';
  });
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: uuidv4(),
      title: newTodo.trim(),
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
    
    toast({
      title: "Task added",
      description: "Your new task has been added to the list."
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      variant: "destructive"
    });
  };

  const updateTodoDetails = (id: string, details: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, details } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingShown', 'true');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCheck className="text-primary h-6 w-6" />
            <h1 className="app-logo">My App</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="theme-mode" 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Label htmlFor="theme-mode">Dark Mode</Label>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {showOnboarding && (
          <div className="bg-primary/10 rounded-lg p-4 mb-6 relative">
            <button 
              onClick={dismissOnboarding}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss onboarding"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Welcome to My App!</h3>
                <p className="text-sm text-muted-foreground">
                  Add tasks using the input below. Click the circle to mark a task as complete. 
                  Add details to your tasks by clicking "Details".
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="task-input flex items-center gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent"
          />
          <Button onClick={addTodo} className="shrink-0">
            <Plus className="h-5 w-5 mr-1" /> Add
          </Button>
        </div>

        <div className="mt-6 mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'filter-button-active' : 'filter-button-default'}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'filter-button-active' : 'filter-button-default'}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('completed')}
              className={filter === 'completed' ? 'filter-button-active' : 'filter-button-default'}
            >
              Completed
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {todos.filter(t => !t.completed).length} items left
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdateDetails={updateTodoDetails}
              />
            ))
          ) : (
            <EmptyState filter={filter} />
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoApp;
