import { Industry, MonthData } from './types';
import { 
  Mail, Zap, TrendingUp, MousePointerClick, 
  AlertCircle, ShieldCheck, ThumbsUp, Gift, 
  Video, Star, RefreshCw, UserCheck 
} from 'lucide-react';

export const INDUSTRIES: Industry[] = [
  'Finance',
  'IT Industry',
  'SaaS Industry',
  'Travel',
  'Renal Business Services',
  'Airport Lounge Services',
  'E-commerce OMS/WMS'
];

export const EMAIL_ICONS: Record<string, any> = {
  intro: Mail,
  value: Zap,
  insight: TrendingUp,
  cta: MousePointerClick,
  pain: AlertCircle,
  objection: ShieldCheck,
  success: ThumbsUp,
  resource: Gift,
  demo: Video,
  checkin: UserCheck,
  update: RefreshCw,
  personal: Star,
};

// All industries follow the same structure as per the prompt
export const FLOW_STRUCTURE: MonthData[] = [
  {
    month: 1,
    theme: "Value + Introduction",
    emails: [
      { id: '1.1', title: "Introduction", day: 1, type: 'intro', description: "Initial welcome and setting expectations." },
      { id: '1.2', title: "Value Proposition", day: 7, type: 'value', description: "Highlighting unique selling points." },
      { id: '1.3', title: "Industry Insight", day: 14, type: 'insight', description: "Sharing expert knowledge to build authority." },
      { id: '1.4', title: "Soft CTA", day: 21, type: 'cta', description: "Low-friction call to action." },
    ]
  },
  {
    month: 2,
    theme: "Deep Dive & Objection Handling",
    emails: [
      { id: '2.1', title: "Pain Point Deep Dive", day: 28, type: 'pain', description: "Addressing specific customer problems." },
      { id: '2.2', title: "Objection Handling: Cost", day: 35, type: 'objection', description: "Justifying ROI and pricing structure." },
      { id: '2.3', title: "Objection Handling: Implementation", day: 42, type: 'objection', description: "Easing fears about ease of use/setup." },
      { id: '2.4', title: "Success Story", day: 49, type: 'success', description: "Social proof and case studies." },
    ]
  },
  {
    month: 3,
    theme: "Nurture & Conversion Focus",
    emails: [
      { id: '3.1', title: "Resource Offering", day: 56, type: 'resource', description: "Providing a whitepaper, checklist, or tool." },
      { id: '3.2', title: "Demo Invitation", day: 63, type: 'demo', description: "Direct invite to see the product/service." },
      { id: '3.3', title: "Value Reinforcement", day: 70, type: 'value', description: "Reminding them of the core benefits." },
      { id: '3.4', title: "Direct CTA", day: 77, type: 'cta', description: "Strong push for conversion/sale." },
    ]
  },
  {
    month: 4,
    theme: "Re-engagement & Long-term Strategy",
    emails: [
      { id: '4.1', title: "Check-in", day: 91, type: 'checkin', description: "Casual check-in to maintain relationship." },
      { id: '4.2', title: "Industry Update", day: 105, type: 'update', description: "News relevant to their specific sector." },
      { id: '4.3', title: "Personal Connection", day: 119, type: 'personal', description: "Building a human connection." },
      { id: '4.4', title: "Long-term Nurture Setup", day: 133, type: 'update', description: "Transitioning to a maintenance cadence." },
    ]
  }
];