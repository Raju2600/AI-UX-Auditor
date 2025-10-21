export enum Intrusiveness {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

// --- Foundational UX Metrics (from original app) ---

export interface LoadSpeedReport {
  score: number;
  fcp: number; 
  lcp: number;
  cls: number;
}

export interface AccessibilityIssue {
  issue: string;
  explanation: string;
  recommendation: string;
}

export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
}

export interface Popup {
  type: string;
  trigger: string;
  intrusiveness: Intrusiveness;
}

export interface PopupReport {
  popups: Popup[];
}

// --- NEW: Advanced Behavioral Analytics ---

export interface DashboardMetric {
    totalSessions: number;
    bounceRate: number;
    avgSessionDuration: number; // in seconds
    deviceBreakdown: { name: 'Desktop' | 'Tablet' | 'Mobile'; value: number }[];
}

export interface HeatmapPoint {
    x: number; // percentage
    y: number; // percentage
    intensity: number; // 0-1
}

export interface Heatmap {
    type: 'click' | 'scroll' | 'move';
    points: HeatmapPoint[];
    aiSummary: string;
}

export interface FunnelStep {
    name: string;
    userCount: number;
}

export interface ConversionFunnel {
    steps: FunnelStep[];
    aiSummary: string;
}

export interface UsabilityTestParticipant {
    id: string;
    location: string;
    device: string;
    demographics: string; // e.g., "Age 25-34, Tech Enthusiast"
}

export interface Highlight {
    timestamp: string; // e.g., "0:45"
    quote: string;
    tag: 'Frustration' | 'Discovery' | 'Success' | 'Confusion';
    aiSummary: string;
}

export interface UsabilityTest {
    participant: UsabilityTestParticipant;
    transcript: string;
    highlightReel: Highlight[];
    aiOverallSummary: string;
}


// --- NEW: Main Report Structure ---

export interface AnalysisReport {
  // Original metrics, now part of the dashboard
  loadSpeed: LoadSpeedReport;
  accessibility: AccessibilityReport;
  popupBehavior: PopupReport;
  
  // New comprehensive metrics
  dashboard: DashboardMetric;
  heatmaps: Heatmap[];
  conversionFunnel: ConversionFunnel;
  usabilityTests: UsabilityTest[];
}

export interface AuditHistoryItem {
  url: string;
  date: string;
  report: AnalysisReport;
}
