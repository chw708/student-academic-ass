import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, TrendUp } from '@phosphor-icons/react';
import { Task } from '@/lib/types';
import { autoScheduleTasks, getWeekStart, addDays, getSubjectColor } from '@/lib/scheduler';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function ProgressPage() {
  const [weeklyTasks] = useLocalStorage<Task[]>('weekly-tasks', []);
  const [dailyTime] = useLocalStorage<Record<string, number>>('daily-available-time', {});

  const weekStart = getWeekStart();
  const schedules = autoScheduleTasks(weeklyTasks, dailyTime, weekStart);

  const completedTasks = weeklyTasks.filter(task => task.completed);
  const totalTasks = weeklyTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const totalMinutes = weeklyTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  const completedMinutes = completedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);

  // ✅ 과목별 진행 상황
  const subjectProgress = weeklyTasks.reduce((acc, task) => {
    if (!acc[task.subject]) {
      acc[task.subject] = { total: 0, completed: 0, totalMinutes: 0, completedMinutes: 0 };
    }
    acc[task.subject].total += 1;
    acc[task.subject].totalMinutes += task.estimatedMinutes;
    if (task.completed) {
      acc[task.subject].completed += 1;
      acc[task.subject].completedMinutes += task.estimatedMinutes;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number; totalMinutes: number; completedMinutes: number }>);

  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">학습 진도 현황</CardTitle>
          <p className="text-sm text-muted-foreground">
            이번 주 학습 진행 상황을 확인해보세요.
          </p>
        </CardHeader>
      </Card>

      {/* 전체 진도율 */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendUp className="text-primary" size={20} />
          <CardTitle className="text-lg">전체 진도율</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>완료된 할 일</span>
              <span>{completedTasks.length}/{totalTasks}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-center text-2xl font-bold text-primary">
              {Math.round(progressPercentage)}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(completedMinutes / 60)}</div>
              <div className="text-sm text-muted-foreground">완료 시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.floor(totalMinutes / 60)}</div>
              <div className="text-sm text-muted-foreground">총 계획 시간</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 과목별 진도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">과목별 진도</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(subjectProgress).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              아직 등록된 할 일이 없습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(subjectProgress).map(([subject, data]) => {
                const percentage = data.total > 0 ? (data.completed / data.total) * 100 : 0;
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getSubjectColor(subject)}>
                        {subject}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {data.completed}/{data.total} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(data.completedMinutes / 60)}시간 / {Math.floor(data.totalMinutes / 60)}시간
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주간 일정 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">주간 일정 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule, index) => {
              const dayTasks = schedule.tasks;
              const completedDayTasks = dayTasks.filter(task => task.completed);
              const dayProgress = dayTasks.length > 0 ? (completedDayTasks.length / dayTasks.length) * 100 : 0;

              return (
                <div key={schedule.date} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dayNames[index]}</span>
                      <span className="text-sm text-muted-foreground">
                        {schedule.date.slice(5).replace('-', '.')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dayTasks.length > 0 && (
                        <>
                          <CheckCircle
                            size={16}
                            className={dayProgress === 100 ? 'text-green-600' : 'text-muted-foreground'}
                            weight={dayProgress === 100 ? 'fill' : 'regular'}
                          />
                          <span className="text-sm">
                            {completedDayTasks.length}/{dayTasks.length}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {dayTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">할 일 없음</p>
                  ) : (
                    <>
                      <Progress value={dayProgress} className="h-2 mb-3" />
                      <div className="space-y-2">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-center gap-2 text-sm ${
                              task.completed ? 'text-muted-foreground line-through' : ''
                            }`}
                          >
                            <CheckCircle
                              size={14}
                              weight={task.completed ? 'fill' : 'regular'}
                              className={task.completed ? 'text-green-600' : 'text-muted-foreground'}
                            />
                            <span className="flex-1">{task.title}</span>
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="text-xs">{task.estimatedMinutes}분</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
