export interface Task {
  id: string;
  subject: Subject;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  scheduledDate?: string; // YYYY-MM-DD format
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD format
  tasks: Task[];
  availableMinutes: number;
}

export interface WeeklyPlan {
  weekStart: string; // YYYY-MM-DD format (Monday)
  tasks: Task[];
  dailyAvailableTime: Record<string, number>; // day -> minutes
}

export interface Settings {
  examDate?: string; // YYYY-MM-DD format
  examName?: string;
  timetable?: ClassSchedule[];
}

export interface ClassSchedule {
  day: number; // 0 = Monday, 6 = Sunday
  period: number; // 1-7
  subject: string;
  teacher?: string;
}

export type Subject = '국어' | '영어' | '수학' | '사회' | '과학' | '역사' | '기타';

export const SUBJECTS: Subject[] = ['국어', '영어', '수학', '사회', '과학', '역사', '기타'];

export const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export const MOTIVATIONAL_QUOTES = [
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