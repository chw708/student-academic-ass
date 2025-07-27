import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, Plus, Save } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Task, Subject, SUBJECTS } from '@/lib/types';
import { getWeekStart } from '@/lib/scheduler';

interface TaskInput {
  subject: Subject;
  title: string;
  estimatedMinutes: number;
}

export function TasksPage() {
  const [weeklyTasks, setWeeklyTasks] = useKV<Task[]>('weekly-tasks', []);
  const [dailyTime, setDailyTime] = useKV<Record<string, number>>('daily-available-time', {});
  const [newTask, setNewTask] = useState<TaskInput>({
    subject: '국어',
    title: '',
    estimatedMinutes: 60
  });

  const [timeInputs, setTimeInputs] = useState<Record<string, number>>(() => {
    const defaultTimes: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      defaultTimes[i.toString()] = dailyTime[i.toString()] || 120; // 2 hours default
    }
    return defaultTimes;
  });

  const weekStart = getWeekStart();
  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  function addTask() {
    if (!newTask.title.trim()) {
      toast.error('할 일 제목을 입력해주세요.');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      subject: newTask.subject,
      title: newTask.title.trim(),
      estimatedMinutes: newTask.estimatedMinutes,
      completed: false
    };

    setWeeklyTasks([...weeklyTasks, task]);
    setNewTask({
      subject: '국어',
      title: '',
      estimatedMinutes: 60
    });
    toast.success('할 일이 추가되었습니다.');
  }

  function removeTask(taskId: string) {
    setWeeklyTasks(weeklyTasks.filter(task => task.id !== taskId));
    toast.success('할 일이 삭제되었습니다.');
  }

  function saveSchedule() {
    setDailyTime(timeInputs);
    toast.success('주간 일정이 저장되었습니다.');
  }

  function clearAllTasks() {
    if (confirm('모든 할 일을 삭제하시겠습니까?')) {
      setWeeklyTasks([]);
      toast.success('모든 할 일이 삭제되었습니다.');
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  const totalMinutes = weeklyTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  const totalAvailableMinutes = Object.values(timeInputs).reduce((sum, minutes) => sum + minutes, 0);

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">주간 할 일 관리</CardTitle>
          <p className="text-sm text-muted-foreground">
            이번 주 ({weekStart.replace(/-/g, '.')}~) 학습 계획을 세워보세요.
          </p>
        </CardHeader>
      </Card>

      {/* Add New Task */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">새 할 일 추가</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">과목</Label>
            <Select 
              value={newTask.subject} 
              onValueChange={(value: Subject) => setNewTask({ ...newTask, subject: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">할 일 내용</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="예: 수학 문제집 1단원 풀기"
            />
          </div>

          <div>
            <Label htmlFor="minutes">예상 소요 시간 (분)</Label>
            <Input
              id="minutes"
              type="number"
              min="10"
              max="480"
              step="10"
              value={newTask.estimatedMinutes}
              onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: parseInt(e.target.value) || 60 })}
            />
          </div>

          <Button onClick={addTask} className="w-full">
            <Plus size={16} className="mr-2" />
            할 일 추가
          </Button>
        </CardContent>
      </Card>

      {/* Current Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">이번 주 할 일 목록</CardTitle>
          {weeklyTasks.length > 0 && (
            <Button variant="destructive" size="sm" onClick={clearAllTasks}>
              <Trash size={16} className="mr-1" />
              전체 삭제
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {weeklyTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              아직 등록된 할 일이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {weeklyTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.subject} • {task.estimatedMinutes}분
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                총 학습 시간: {Math.floor(totalMinutes / 60)}시간 {totalMinutes % 60}분
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Available Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">일별 가용 시간</CardTitle>
          <p className="text-sm text-muted-foreground">
            각 요일별로 학습 가능한 시간을 입력해주세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {dayNames.map((dayName, index) => (
            <div key={index} className="flex items-center justify-between">
              <Label className="w-16">{dayName}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={timeInputs[index.toString()] / 60}
                  onChange={(e) => {
                    const hours = parseFloat(e.target.value) || 0;
                    setTimeInputs({
                      ...timeInputs,
                      [index.toString()]: Math.round(hours * 60)
                    });
                  }}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">시간</span>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
            주간 총 가용 시간: {Math.floor(totalAvailableMinutes / 60)}시간 {totalAvailableMinutes % 60}분
            {totalMinutes > totalAvailableMinutes && (
              <div className="text-red-600 mt-1">
                ⚠️ 할 일이 가용 시간보다 많습니다!
              </div>
            )}
          </div>

          <Button onClick={saveSchedule} className="w-full">
            <Save size={16} className="mr-2" />
            일정 저장
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}