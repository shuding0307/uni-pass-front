import {
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Map,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "대시보드", icon: LayoutDashboard, active: true },
];

export const studentInfo = [
  { label: "학번", value: "201912345" },
  { label: "학과", value: "컴퓨터공학과" },
];

export const creditStats = [
  {
    label: "총 이수 학점",
    current: 0,
    total: 0,
    barClassName: "bg-[#2563EB]",
  },
  {
    label: "교양 기초",
    current: 0,
    total: 0,
    barClassName: "bg-[#EF4444]",
  },
  {
    label: "교양 균형",
    current: 0,
    total: 0,
    barClassName: "bg-[#EF4444]",
  },
  {
    label: "교양 특화",
    current: 0,
    total: 0,
    barClassName: "bg-[#EF4444]",
  },
  {
    label: "교양 대교",
    current: 0,
    total: 0,
    barClassName: "bg-[#EF4444]",
  },
  {
    label: "전공 전필",
    current: 0,
    total: 0,
    barClassName: "bg-[#16A34A]",
  },
  {
    label: "전공 전선",
    current: 0,
    total: 0,
    barClassName: "bg-[#16A34A]",
  },
  {
    label: "전공 선택 심화",
    current: 0,
    total: 0,
    barClassName: "bg-[#0F766E]",
  },
  {
    label: "자유 선택 자선",
    current: 0,
    total: 20,
    barClassName: "bg-[#0F766E]",
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
