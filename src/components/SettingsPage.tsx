import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Trash, Calendar } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Settings } from '@/lib/types';
import { getDateString } from '@/lib/scheduler';

export function SettingsPage() {
  const [settings, setSettings] = useKV<Settings>('settings', {});
  const [, setWeeklyTasks] = useKV('weekly-tasks', []);
  const [, setDailyTime] = useKV('daily-available-time', {});

  const [examDate, setExamDate] = useState(settings.examDate || '');
  const [examName, setExamName] = useState(settings.examName || '');

  function saveSettings() {
    if (examDate && examDate < getDateString()) {
      toast.error('시험 날짜는 오늘 이후로 설정해주세요.');
      return;
    }

    setSettings({
      ...settings,
      examDate: examDate || undefined,
      examName: examName || undefined,
    });
    toast.success('설정이 저장되었습니다.');
  }

  function clearAllData() {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setSettings({});
      setWeeklyTasks([]);
      setDailyTime({});
      setExamDate('');
      setExamName('');
      toast.success('모든 데이터가 삭제되었습니다.');
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">설정</CardTitle>
          <p className="text-sm text-muted-foreground">
            앱 설정을 관리하고 데이터를 초기화할 수 있습니다.
          </p>
        </CardHeader>
      </Card>

      {/* Exam Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Calendar className="text-primary" size={20} />
          <CardTitle className="text-lg">시험 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="exam-name">시험명</Label>
            <Input
              id="exam-name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="예: 중간고사, 기말고사"
            />
          </div>

          <div>
            <Label htmlFor="exam-date">시험 날짜</Label>
            <Input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={getDateString()}
            />
          </div>

          <Button onClick={saveSettings} className="w-full">
            <Save size={16} className="mr-2" />
            설정 저장
          </Button>
        </CardContent>
      </Card>

      {/* Timetable Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시간표 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            현재 버전에서는 시간표 자동 연동 기능을 준비 중입니다.
            향후 업데이트에서 컴시간알리미 연동 기능을 제공할 예정입니다.
          </p>
          <Button variant="secondary" disabled className="w-full">
            시간표 연동 (준비 중)
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">앱 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>버전</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>개발자</span>
            <span>학습 관리 어시스턴트 팀</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>데이터 저장</span>
            <span>로컬 브라우저</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            모든 학습 데이터, 설정, 진도 정보가 삭제됩니다.
          </p>
          
          <Button 
            variant="destructive" 
            onClick={clearAllData}
            className="w-full"
            size="lg"
          >
            <Trash size={16} className="mr-2" />
            모든 데이터 삭제
          </Button>
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">사용 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>📚 효과적인 학습 계획:</strong>
              <p className="text-muted-foreground mt-1">
                주초에 할 일을 모두 등록하고, 하루 가용 시간을 정확히 설정하세요.
              </p>
            </div>
            
            <div>
              <strong>⏰ 시간 관리:</strong>
              <p className="text-muted-foreground mt-1">
                예상 소요 시간은 여유를 두고 설정하는 것이 좋습니다.
              </p>
            </div>
            
            <div>
              <strong>📈 진도 관리:</strong>
              <p className="text-muted-foreground mt-1">
                매일 완료한 할 일을 체크하여 성취감을 느껴보세요.
              </p>
            </div>
            
            <div>
              <strong>🎯 목표 설정:</strong>
              <p className="text-muted-foreground mt-1">
                시험 날짜를 설정하면 D-Day 카운터로 동기부여에 도움이 됩니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
