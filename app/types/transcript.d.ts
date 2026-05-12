export interface BasicCredits {
  기초: string;
  균형: string;
  특화: string;
  대교: string;
  전필: string;
  전선: string;
  심화: string;
  교직: string;
}

export interface TakenCourse {
  course_code: string;
  name: string;
  credits: number;
  area_type: string;
  grade: string;
  sub_area: string | null;
}

export interface ITranscript {
  student_name: string;
  student_id: int;
  department: string;
  admission_year: number;
  total_earned_credits: number;
  basic_credits: BasicCredits;
  taken_courses: TakenCourse[];
}
