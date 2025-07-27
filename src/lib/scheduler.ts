import { Task, DailySchedule, WeeklyPlan } from './types';

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return getDateString(date);
}

export function getDayOfWeek(dateString: string): number {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

export function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function autoScheduleTasks(
  tasks: Task[], 
  dailyAvailableTime: Record<string, number>, 
  weekStart: string
): DailySchedule[] {
  const schedules: DailySchedule[] = [];
  const unscheduledTasks = [...tasks.filter(task => !task.completed)];
  
  // Create 7 days of schedules
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const availableMinutes = dailyAvailableTime[i.toString()] || 0;
    schedules.push({
      date,
      tasks: [],
      availableMinutes
    });
  }

  // Sort tasks by estimated time (shorter tasks first)
  unscheduledTasks.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

  // Distribute tasks across days
  for (const task of unscheduledTasks) {
    // Find the day with most available time that can fit this task
    const availableDays = schedules
      .map((schedule, index) => ({
        schedule,
        index,
        remainingTime: schedule.availableMinutes - 
          schedule.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
      }))
      .filter(day => day.remainingTime >= task.estimatedMinutes)
      .sort((a, b) => b.remainingTime - a.remainingTime);

    if (availableDays.length > 0) {
      const targetDay = availableDays[0];
      targetDay.schedule.tasks.push({
        ...task,
        scheduledDate: targetDay.schedule.date
      });
    } else {
      // If task doesn't fit anywhere, add it to the day with most available time
      const dayWithMostTime = schedules.reduce((max, current, index) => {
        const maxRemaining = max.availableMinutes - 
          max.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
        const currentRemaining = current.availableMinutes - 
          current.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
        return currentRemaining > maxRemaining ? current : max;
      });
      
      dayWithMostTime.tasks.push({
        ...task,
        scheduledDate: dayWithMostTime.date
      });
    }
  }

  return schedules;
}

export function getTodaysQuote(): string {
  const quotes = [
    "꿈을 지녀라. 그러면 어려운 현실을 이길 수 있다. - 월트 디즈니",
    "성공은 준비와 기회가 만날 때 일어난다. - 세네카",
    "오늘 하루도 최선을 다하면, 내일은 더 나은 내가 될 것이다. - 랄프 왈도 에머슨",
    "작은 노력들이 모여 큰 성취를 만든다. - 벤자민 프랭클린",
    "실패는 성공의 어머니다. - 토마스 에디슨",
    "시작이 반이다. - 아리스토텔레스",
    "꾸준함이 천재를 이긴다. - 뉴턴",
    "오늘의 나는 어제의 내가 공부한 결과다. - 공자",
    "배움에는 끝이 없다. - 소크라테스",
    "노력 없는 성공은 없다. - 토마스 제퍼슨"
  ];
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    '국어': 'bg-red-100 text-red-800',
    '영어': 'bg-blue-100 text-blue-800',
    '수학': 'bg-green-100 text-green-800',
    '사회': 'bg-yellow-100 text-yellow-800',
    '과학': 'bg-purple-100 text-purple-800',
    '역사': 'bg-orange-100 text-orange-800',
    '기타': 'bg-gray-100 text-gray-800'
  };
  return colors[subject] || colors['기타'];
}