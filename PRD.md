# 학습 관리 어시스턴트 - Product Requirements Document

학생들이 주간 학습 계획을 세우고 일일 일정을 관리할 수 있는 개인 맞춤형 학습 도우미 애플리케이션입니다.

**Experience Qualities**:
1. **효율적 (Efficient)**: 복잡한 학습 계획을 간단한 입력으로 자동 배분하여 시간 관리 부담을 줄입니다.
2. **동기부여적 (Motivational)**: 매일 다른 명언과 D-Day 카운트다운으로 학습 의욕을 지속시킵니다.
3. **직관적 (Intuitive)**: 학생들이 쉽게 이해하고 사용할 수 있는 명확한 한국어 인터페이스를 제공합니다.

**Complexity Level**: Light Application (multiple features with basic state)
여러 기능(주간 계획, 자동 스케줄링, 진도 관리)을 포함하지만 기본적인 로컬 상태 관리로 충분한 수준입니다.

## Essential Features

### 홈 화면
- **Functionality**: 환영 메시지, D-Day 카운트다운, 오늘의 명언, 오늘 할 일, 시간표 표시
- **Purpose**: 하루 시작 시 필요한 모든 정보를 한눈에 파악할 수 있게 함
- **Trigger**: 앱 접속 시 기본 화면
- **Progression**: 앱 열기 → 환영 메시지 확인 → D-Day 확인 → 명언 읽기 → 오늘 할 일 확인 → 시간표 확인
- **Success criteria**: 모든 정보가 로딩되고 사용자가 오늘의 학습 계획을 명확히 파악

### 주간 할 일 입력
- **Functionality**: 과목별 주간 학습 과제 입력 및 예상 소요 시간 설정
- **Purpose**: 체계적인 주간 학습 계획 수립
- **Trigger**: 주 초 또는 사용자가 새 계획 수립 시
- **Progression**: 입력 페이지 접근 → 과목 선택 → 과제 내용 입력 → 예상 시간 설정 → 저장
- **Success criteria**: 모든 과목의 할 일이 저장되고 자동 스케줄러에서 활용 가능

### 주간 가용 시간 입력
- **Functionality**: 요일별 학습 가능 시간 설정
- **Purpose**: 현실적인 학습 계획 수립을 위한 시간 제약 설정
- **Trigger**: 주간 할 일 입력 후 또는 별도 설정
- **Progression**: 입력 페이지 접근 → 요일별 시간 입력 → 저장 → 자동 스케줄링 실행
- **Success criteria**: 요일별 시간이 저장되고 자동 스케줄러가 이를 반영

### 자동 스케줄러
- **Functionality**: 할 일과 가용 시간을 기반으로 최적 일정 배분
- **Purpose**: 효율적이고 균형잡힌 학습 계획 자동 생성
- **Trigger**: 주간 데이터 입력 완료 시 자동 실행
- **Progression**: 데이터 수집 → 우선순위 분석 → 시간 배분 계산 → 일정 생성 → 결과 표시
- **Success criteria**: 모든 할 일이 주간 가용 시간 내에 균등하게 배분됨

### 진도 관리
- **Functionality**: 완료된 과제 체크 및 주간 진도율 표시
- **Purpose**: 학습 성취도 추적 및 동기부여
- **Trigger**: 과제 완료 시 또는 진도 확인 시
- **Progression**: 완료 과제 체크 → 진도율 계산 → 시각적 피드백 제공
- **Success criteria**: 실시간 진도 업데이트 및 명확한 성취도 표시

## Edge Case Handling
- **과도한 할 일**: 가용 시간 초과 시 경고 메시지 및 조정 제안
- **빈 일정**: 할 일이 없을 때 학습 제안 또는 휴식 권장
- **시험 날짜 없음**: D-Day 대신 일반적인 격려 메시지 표시
- **데이터 손실**: 로컬 스토리지 백업 및 복구 기능
- **시간표 오류**: 수동 입력 옵션 제공

## Design Direction
깔끔하고 학습에 집중할 수 있는 미니멀한 디자인으로, 한국 학생들에게 친숙한 교육적 색상과 타이포그래피를 사용하여 신뢰감과 안정감을 줍니다.

## Color Selection
Analogous (인접 색상) - 청색 계열을 중심으로 학습과 집중을 상징하는 차분하고 신뢰감 있는 색상 조합을 사용합니다.

- **Primary Color**: 진한 네이비 블루 (oklch(0.3 0.15 250)) - 신뢰성과 학습 집중력을 나타냄
- **Secondary Colors**: 밝은 블루 (oklch(0.7 0.12 250)) - 보조 정보와 카드 배경용
- **Accent Color**: 따뜻한 오렌지 (oklch(0.7 0.15 50)) - 중요한 알림과 CTA 버튼용
- **Foreground/Background Pairings**:
  - Background (White #FFFFFF): 다크 네이비 텍스트 (oklch(0.2 0.1 250)) - 비율 8.2:1 ✓
  - Primary (Navy #1E3A8A): 화이트 텍스트 (oklch(0.98 0 0)) - 비율 7.1:1 ✓
  - Accent (Orange #F97316): 화이트 텍스트 (oklch(0.98 0 0)) - 비율 4.8:1 ✓
  - Card (Light Blue #EBF4FF): 다크 네이비 텍스트 (oklch(0.2 0.1 250)) - 비율 6.5:1 ✓

## Font Selection
한국어 가독성이 뛰어나고 교육적 신뢰감을 주는 Noto Sans KR을 주 폰트로 사용하여 깔끔하고 현대적인 느낌을 전달합니다.

- **Typographic Hierarchy**:
  - H1 (페이지 제목): Noto Sans KR Bold/32px/tight letter spacing
  - H2 (섹션 제목): Noto Sans KR SemiBold/24px/normal letter spacing
  - H3 (카드 제목): Noto Sans KR Medium/18px/normal letter spacing
  - Body (본문): Noto Sans KR Regular/16px/relaxed line height
  - Caption (보조 정보): Noto Sans KR Regular/14px/normal letter spacing

## Animations
학습 환경에 방해가 되지 않는 부드럽고 목적이 명확한 애니메이션을 사용하여 인터페이스의 응답성과 진행 상황을 명확히 전달합니다.

- **Purposeful Meaning**: 페이지 전환과 상태 변화를 자연스럽게 연결하고, 완료된 과제에 대한 성취감을 시각적으로 표현
- **Hierarchy of Movement**: 중요한 알림(D-Day, 완료)에는 적절한 강조 애니메이션, 일반적인 상호작용에는 미묘한 전환 효과

## Component Selection
- **Components**: 
  - Cards (할 일 목록, 시간표, 진도 표시)
  - Buttons (과제 완료, 설정 저장)
  - Forms (할 일 입력, 시간 설정)
  - Progress bars (주간 진도율)
  - Dialogs (설정, 확인)
  - Tabs (과목별 분류)
- **Customizations**: 한국형 시간표 컴포넌트, D-Day 카운터, 과목별 색상 태그
- **States**: 호버 시 카드 elevation 증가, 완료된 과제는 체크 애니메이션과 함께 흐려짐
- **Icon Selection**: Phosphor Icons의 학습 관련 아이콘 (Book, Clock, Calendar, CheckCircle)
- **Spacing**: 16px 기본 간격, 카드 간 24px, 섹션 간 40px
- **Mobile**: 카드 스택 레이아웃, 하단 고정 네비게이션, 터치 친화적 버튼 크기 (최소 44px)