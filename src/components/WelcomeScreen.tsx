import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Target, Lightbulb } from '@phosphor-icons/react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="space-y-6 pb-20">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <BookOpen size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            학습 관리 어시스턴트에<br />오신 것을 환영합니다! 🎓
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            체계적인 학습 계획으로<br />
            목표를 달성해보세요!
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">주간 계획 수립</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  과목별 할 일과 가용 시간을 입력하면 자동으로 최적의 일정을 만들어드려요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target size={16} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">목표 관리</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  D-Day 카운터와 진도율 추적으로 학습 동기를 유지하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb size={16} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">동기부여</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  매일 다른 명언과 성취도 추적으로 꾸준한 학습을 도와드려요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button onClick={onGetStarted} size="lg" className="w-full">
            학습 계획 시작하기
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            먼저 이번 주 할 일을 등록해보세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}