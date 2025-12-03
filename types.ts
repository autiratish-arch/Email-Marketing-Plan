export type Industry = 
  | 'Finance'
  | 'IT Industry'
  | 'SaaS Industry'
  | 'Travel'
  | 'Renal Business Services'
  | 'Airport Lounge Services'
  | 'E-commerce OMS/WMS';

export interface EmailNode {
  id: string;
  title: string;
  day: number;
  type: 'intro' | 'value' | 'insight' | 'cta' | 'pain' | 'objection' | 'success' | 'resource' | 'demo' | 'checkin' | 'update' | 'personal';
  description?: string;
}

export interface MonthData {
  month: number;
  theme: string;
  emails: EmailNode[];
}

export interface GeneratedContent {
  subject: string;
  bodySnippet: string;
  keyPoints: string[];
  emailBody: string;
  generatedAt?: number;
}