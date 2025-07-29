import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FloppyDisk } from '@phosphor-icons/react';
import { Subject, SUBJECTS } from '@/lib/types';

export function TasksPage() {
  const [tasks, setTasks] = useState<{ subject: Subject; task: string }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const addTask = () => {
    if (!newTask || !selectedSubject) return;
    const updatedTasks = [...tasks, { subject: selectedSubject as Subject, task: newTask }];
    setTasks(updatedTasks);
    setNewTask('');
    setSelectedSubject('');
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    alert('할 일이 저장되었습니다.');
  };

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center space-x-2">
        <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as Subject)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="과목" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="할 일 입력"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1"
        />

        <button
          onClick={addTask}
          className="bg-green-600 px-3 py-2 rounded-lg flex items-center hover:bg-green-700 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={index} className="flex justify-between bg-gray-800 p-2 rounded">
            <span>{task.subject} - {task.task}</span>
          </div>
        ))}
      </div>

      <button
        onClick={saveTasks}
        className="w-full bg-blue-600 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
      >
        <FloppyDisk size={20} className="mr-2" /> 저장하기
      </button>
    </div>
  );
}
