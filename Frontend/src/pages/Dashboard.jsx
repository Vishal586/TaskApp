import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tasksService } from '@/services/tasks';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadTasks();
    }, [searchTerm, statusFilter]);

    const loadTasks = async () => {
        try {
            const data = await tasksService.getTasks(searchTerm, statusFilter);
            setTasks(data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        setFormLoading(true);
        try {
            const newTask = await tasksService.createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
            setShowTaskForm(false);
            toast.success('Task created successfully');
        } catch (error) {
            toast.error('Failed to create task');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateTask = async (taskData) => {
        if (!editingTask) return;

        setFormLoading(true);
        try {
            const updatedTask = await tasksService.updateTask(editingTask._id, taskData);
            setTasks(prev => prev.map(task =>
                task._id === editingTask._id ? updatedTask : task
            ));
            setEditingTask(null);
            toast.success('Task updated successfully');
        } catch (error) {
            toast.error('Failed to update task');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await tasksService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task._id !== taskId));
            toast.success('Task deleted successfully');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleCancelForm = () => {
        setShowTaskForm(false);
        setEditingTask(null);
    };

    // ✅ REMOVED: The redundant 'filteredTasks' constant has been removed.

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
                    <p className="text-gray-600 mt-2">Manage your tasks and stay organized</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasks.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {tasks.filter(t => t.status === 'in-progress').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {tasks.filter(t => t.status === 'completed').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>



                    <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Task
                    </Button>
                </div>

                {/* Tasks Grid */}
                {/* ✅ CORRECTED: Now using 'tasks' directly */}
                {tasks.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || statusFilter
                                    ? "Try adjusting your search or filter criteria."
                                    : "Get started by creating your first task!"
                                }
                            </p>
                            {!searchTerm && !statusFilter && (
                                <Button onClick={() => setShowTaskForm(true)}>
                                    Create Your First Task
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ✅ CORRECTED: Now using 'tasks' directly */}
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}

                {/* Task Form Dialog */}
                <Dialog open={showTaskForm || !!editingTask} onOpenChange={() => handleCancelForm()}>
                    <DialogContent className="max-w-md">
                        <TaskForm
                            task={editingTask}
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            onCancel={handleCancelForm}
                            loading={formLoading}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}