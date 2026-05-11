import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "대시보드", icon: LayoutDashboard, active: true },
  // { label: "로드맵", icon: Map },
  // { label: "수강 일정", icon: CalendarDays },
  // { label: "설정", icon: Settings }
];

export const studentInfo = [
  { label: "학번", value: "201912345" },
  { label: "학과", value: "컴퓨터공학과" },
];

export const creditStats = [
  {
    label: "총 이수 학점",
    current: 124,
    total: 140,
    barClassName: "bg-[#2563EB]",
  },
  {
    label: "전공 학점",
    current: 54,
    total: 60,
    barClassName: "bg-[#16A34A]",
  },
  // {
  //   label: "MSC 학점",
  //   current: 28,
  //   total: 30,
  //   barClassName: "bg-[#0F766E]",
  // },
  {
    label: "교양 학점",
    current: 18,
    total: 20,
    barClassName: "bg-[#EF4444]",
  },
];

export const abeekItems = [
  {
    title: "설계 학점 이수",
    description: "공학 전공 핵심 필수 요건",
    status: "진행 중",
    score: "9 / 12",
    done: false,
  },
  {
    title: "선수 과목 확인",
    description: "기초 과학 및 수학 선수 체계 검증",
    status: "완료",
    score: "100%",
    done: true,
  },
  {
    title: "공학 윤리 세미나",
    description: "지정 필수 세미나 이수",
    status: "완료",
    score: "2 / 2",
    done: true,
  },
];

export const aiInsights = [
  {
    label: "졸업 가능성",
    value: "94%",
    description:
      "현재 수강 내역 및 과거 데이터를 기준으로 2026년 2월 졸업 가능성이 높습니다.",
  },
  {
    label: "추천 과목",
    value: "과학 철학",
    description: "교양 3영역 부족 학점을 채우기 좋은 과목입니다.",
  },
];

export const quickActions = [
  { label: "졸업 사정 조회", icon: GraduationCap },
  { label: "요건 상세 보기", icon: LayoutDashboard },
];
