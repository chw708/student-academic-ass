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
    "고통이 남기고 간 뒤를 보라! 고난이 지나면 반드시 기쁨이 스며든다. - 괴테",
    "어둠이 깊을수록 새벽은 가깝다. 지금의 고통은 내일의 성장이다. - 빅터 위고",
    "세상에서 가장 어려운 일은 자신과의 싸움에서 이기는 것이다. - 아리스토텔레스",
    "지금 당장 시작해라. 완벽한 조건을 기다리다가는 영원히 시작할 수 없다. - 마크 트웨인",
    "실패란 넘어지는 것이 아니라 넘어진 채로 일어나지 않는 것이다. - 메리 픽포드",
    "노력하지 않고 얻은 것은 노력하지 않고 잃어버린다. - 톨스토이",
    "매일 조금씩 쌓인 노력이 기적을 만든다. 포기하지 마라. - 앤서니 로빈스",
    "나는 실패한 것이 아니다. 작동하지 않는 방법 천 가지를 발견한 것이다. - 토마스 에디슨",
    "가장 큰 영광은 넘어지지 않는 것이 아니라, 넘어질 때마다 일어나는 것이다. - 넬슨 만델라",
    "꿈꾸는 것을 멈추는 순간, 우리는 늙기 시작한다. - 엘레노어 루스벨트",
    "오늘 걷지 않으면 내일은 뛰어야 한다. 미루지 마라. - 벤자민 프랭클린",
    "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다. - 헨리 포드",
    "고통 없이는 얻는 것도 없다. 땀 흘린 만큼 성장한다. - 벤자민 프랭클린",
    "성공의 비밀은 시작하는 것이다. 시작의 비밀은 복잡함을 쪼개는 것이다. - 마크 트웨인",
    "자신의 한계는 자신이 정하는 것이다. 믿으면 해낼 수 있다. - 나폴레온 힐",
    "하루하루가 새로운 기회다. 어제의 실수에 얽매이지 마라. - 스티브 잡스",
    "내가 더 멀리 볼 수 있었던 것은 거인의 어깨에 올라서 있었기 때문이다. - 뉴턴",
    "지식은 힘이다. 하지만 실행하는 지식만이 진정한 힘이다. - 프랜시스 베이컨",
    "모든 성취의 출발점은 간절함이다. 진심으로 원하면 길이 보인다. - 나폴레온 힐",
    "천재는 1%의 영감과 99%의 노력으로 만들어진다. - 토마스 에디슨"
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