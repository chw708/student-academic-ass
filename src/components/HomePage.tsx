import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Calendar, BookOpen } from '@phosphor-icons/react';
import { Settings, Task, DailySchedule } from '@/lib/types';
import { getDateString, formatDate, getDaysBetween, getTodaysQuote, getSubjectColor, autoScheduleTasks, getWeekStart } from '@/lib/scheduler';
import { WelcomeScreen } from './WelcomeScreen';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [settings] = useKV<Settings>('settings', {});
  const [weeklyTasks] = useKV<Task[]>('weekly-tasks', []);
  const [dailyTime] = useKV<Record<string, number>>('daily-available-time', {});
  const [, setWeeklyTasks] = useKV<Task[]>('weekly-tasks', []);
  
  const today = getDateString();
  const weekStart = getWeekStart();
  const todaySchedule = getTodaySchedule();
  const quote = getTodaysQuote();

  // Show welcome screen if no tasks are set up
  if (weeklyTasks.length === 0) {
    return <WelcomeScreen onGetStarted={() => onNavigate?.('tasks')} />;
  }

  function getTodaySchedule(): DailySchedule {
    const schedules = autoScheduleTasks(weeklyTasks, dailyTime, weekStart);
    return schedules.find(s => s.date === today) || {
      date: today,
      tasks: [],
      availableMinutes: dailyTime['0'] || 0
    };
  }

  function toggleTaskCompletion(taskId: string) {
    const updatedTasks = weeklyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setWeeklyTasks(updatedTasks);
  }

  function getDDayInfo() {
    if (!settings.examDate) return null;
    const daysLeft = getDaysBetween(today, settings.examDate);
    return { daysLeft, examName: settings.examName || '시험' };
  }

  const dDayInfo = getDDayInfo();
  const completedTasks = todaySchedule.tasks.filter(task => task.completed).length;
  const totalTasks = todaySchedule.tasks.length;

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            안녕하세요! 📚
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {formatDate(today)}
          </p>
          {dDayInfo && (
            <div className="mt-4 p-4 bg-accent/10 rounded-lg text-center">
              <div className="text-2xl font-bold text-accent">
                D-{dDayInfo.daysLeft}
              </div>
              <div className="text-sm text-muted-foreground">
                {dDayInfo.examName}까지
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Quote */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BookOpen className="text-primary" size={20} />
          <CardTitle className="text-lg">오늘의 명언</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-center leading-relaxed">
            "{quote}"
          </p>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            <CardTitle className="text-lg">오늘 할 일</CardTitle>
          </div>
          <Badge variant="secondary">
            {completedTasks}/{totalTasks}
          </Badge>
        </CardHeader>
        <CardContent>
          {todaySchedule.tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              오늘 예정된 할 일이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {todaySchedule.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    task.completed ? 'bg-muted/50 opacity-60' : 'bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="p-0 h-auto"
                    >
                      <CheckCircle
                        size={20}
                        weight={task.completed ? 'fill' : 'regular'}
                        className={task.completed ? 'text-green-600' : 'text-muted-foreground'}
                      />
                    </Button>
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="secondary" 
                          className={getSubjectColor(task.subject)}
                        >
                          {task.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.estimatedMinutes}분
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simple Timetable */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Calendar className="text-primary" size={20} />
          <CardTitle className="text-lg">오늘 시간표</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            시간표 기능은 설정에서 수동으로 입력할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}