import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Subject, SUBJECTS } from '@/lib/types';

interface TaskEntry {
  task: string;
  time: number;
}

type TasksData = Record<Subject, TaskEntry[]>;

export function TasksPage() {
  const [weeklyStudyTime, setWeeklyStudyTime] = useKV<number>('weekly-study-time', 7);
  const [tasksData, setTasksData] = useKV<TasksData>('tasks-data', {
    '국어': [],
    '영어': [],
    '수학': [],
    '사회': [],
    '과학': [],
    '역사': [],
    '기타': []
  });

  // Local state for current inputs
  const [taskInputs, setTaskInputs] = useState<Record<Subject, string>>({
    '국어': '',
    '영어': '',
    '수학': '',
    '사회': '',
    '과학': '',
    '역사': '',
    '기타': ''
  });

  const [timeInputs, setTimeInputs] = useState<Record<Subject, string>>({
    '국어': '',
    '영어': '',
    '수학': '',
    '사회': '',
    '과학': '',
    '역사': '',
    '기타': ''
  });

  function addTask(subject: Subject) {
    const taskText = taskInputs[subject].trim();
    const timeValue = parseInt(timeInputs[subject]) || 0;

    if (!taskText) {
      toast.error('할 일을 입력해주세요.');
      return;
    }

    if (timeValue <= 0) {
      toast.error('시간을 올바르게 입력해주세요.');
      return;
    }

    const newTask: TaskEntry = {
      task: taskText,
      time: timeValue
    };

    setTasksData(current => ({
      ...current,
      [subject]: [...current[subject], newTask]
    }));

    // Clear inputs for this subject
    setTaskInputs(current => ({ ...current, [subject]: '' }));
    setTimeInputs(current => ({ ...current, [subject]: '' }));

    toast.success('할 일이 추가되었습니다.');
  }

  function removeTask(subject: Subject, index: number) {
    setTasksData(current => ({
      ...current,
      [subject]: current[subject].filter((_, i) => i !== index)
    }));
    toast.success('할 일이 삭제되었습니다.');
  }

  function saveAllTasks() {
    toast.success('모든 할 일이 저장되었습니다.');
  }

  const studyTimeOptions = Array.from({ length: 8 }, (_, i) => i + 5); // 5-12 hours

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">할 일 저장하기</h1>
        
        {/* Weekly Study Time Dropdown */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-3">이번 주 공부 가능한 시간</label>
          <Select 
            value={weeklyStudyTime.toString()} 
            onValueChange={(value) => setWeeklyStudyTime(parseInt(value))}
          >
            <SelectTrigger className="w-48 mx-auto bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {studyTimeOptions.map((hours) => (
                <SelectItem key={hours} value={hours.toString()} className="text-popover-foreground hover:bg-accent">
                  {hours}시간
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Display selected time */}
          <div className="mt-4 text-2xl font-bold text-primary">
            {weeklyStudyTime}시간
          </div>
        </div>
      </div>

      {/* Task Input Section */}
      <div className="space-y-6 mb-8">
        {SUBJECTS.map((subject) => (
          <div key={subject} className="space-y-3">
            {/* Subject Name */}
            <h2 className="text-xl font-bold text-primary mb-3">{subject}</h2>
            
            {/* Input Row */}
            <div className="flex items-center gap-3 mb-3">
              <Input
                value={taskInputs[subject]}
                onChange={(e) => setTaskInputs(current => ({ ...current, [subject]: e.target.value }))}
                placeholder="할 일 추가"
                className="flex-1 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
              />
              <Input
                type="number"
                value={timeInputs[subject]}
                onChange={(e) => setTimeInputs(current => ({ ...current, [subject]: e.target.value }))}
                placeholder="분"
                className="w-20 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
                min="1"
              />
              <Button
                onClick={() => addTask(subject)}
                className="bg-primary hover:bg-primary/80 text-primary-foreground p-2"
                size="sm"
              >
                <Plus size={20} />
              </Button>
            </div>

            {/* Display existing tasks for this subject */}
            {tasksData[subject].length > 0 && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                {tasksData[subject].map((taskEntry, index) => (
                  <div key={index} className="flex items-center justify-between bg-card/50 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="text-foreground">{taskEntry.task}</span>
                      <span className="text-muted-foreground ml-2">({taskEntry.time}분)</span>
                    </div>
                    <Button
                      onClick={() => removeTask(subject, index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/20"
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="fixed bottom-20 left-0 right-0 p-6">
        <Button
          onClick={saveAllTasks}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-4 text-lg font-bold rounded-2xl"
        >
          <Save size={24} className="mr-2" />
          저장
        </Button>
      </div>
    </div>
  );
}
