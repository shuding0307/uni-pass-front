export type CreditValue = string | number | null | undefined;

export interface CreditSummary {
  total?: CreditValue;
  basic_general?: CreditValue;
  balanced_general?: CreditValue;
  academic_foundation?: CreditValue;
  specialized_general?: CreditValue;
  university_core?: CreditValue;
  major_required?: CreditValue;
  major_elective?: CreditValue;
  advanced_major?: CreditValue;
  teaching?: CreditValue;
  free_elective?: CreditValue;
  [key: string]: CreditValue;
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
  student_name: string | null;
  student_id: string | null;
  department: string | null;
  admission_year: number | null;
  total_earned_credits: number | null;
  earned_credit?: CreditSummary;
  basic_credits: CreditSummary;
  taken_courses: TakenCourse[];
}

export interface GraduationRequirement {
  department: string;
  total_credits: number;
  general_education: {
    기초교양: number;
    균형교양: number;
    학문기초: number;
    교양계: number;
  };
  major_base: {
    최소전공_필수: number;
    최소전공_선택: number;
  };
  tracks: Record<
    string,
    {
      심화전공: number;
      전공계: number;
      자유선택: number;
    }
  >;
}

export interface GraduationEvaluation {
  [key: string]: unknown;
}
