// Mock data for ManuVerse dashboard
// TODO: replace with actual API calls once backend is ready

export const oeeTrendData = [
  { day: 'Mon', availability: 92, performance: 88, quality: 97, oee: 78.5 },
  { day: 'Tue', availability: 94, performance: 90, quality: 98, oee: 82.9 },
  { day: 'Wed', availability: 91, performance: 87, quality: 96, oee: 76.1 },
  { day: 'Thu', availability: 95, performance: 92, quality: 98, oee: 85.7 },
  { day: 'Fri', availability: 96, performance: 91, quality: 99, oee: 86.6 },
  { day: 'Sat', availability: 93, performance: 89, quality: 97, oee: 80.3 },
  { day: 'Sun', availability: 97, performance: 93, quality: 99, oee: 89.2 },
];

export const productionData = [
  { day: 'Mon', planned: 2200, actual: 2050, pct: 93 },
  { day: 'Tue', planned: 2200, actual: 2140, pct: 97 },
  { day: 'Wed', planned: 2200, actual: 1890, pct: 86 },
  { day: 'Thu', planned: 2200, actual: 2180, pct: 99 },
  { day: 'Fri', planned: 2200, actual: 2100, pct: 95 },
  { day: 'Sat', planned: 1500, actual: 1420, pct: 95 },
  { day: 'Sun', planned: 1500, actual: 1350, pct: 90 },
];

export type MachineStatus = 'RUNNING' | 'IDLE' | 'DOWN' | 'MAINTENANCE';

export interface Machine {
  id: string;
  name: string;
  status: MachineStatus;
  oee: number;
  currentJob: string;
}

export const machines: Machine[] = [
  { id: 'M01', name: 'CNC Mill #1', status: 'RUNNING', oee: 91, currentJob: 'JOB-4521' },
  { id: 'M02', name: 'CNC Mill #2', status: 'RUNNING', oee: 87, currentJob: 'JOB-4523' },
  { id: 'M03', name: 'Lathe #1', status: 'IDLE', oee: 0, currentJob: '—' },
  { id: 'M04', name: 'Lathe #2', status: 'RUNNING', oee: 94, currentJob: 'JOB-4518' },
  { id: 'M05', name: 'Press #1', status: 'DOWN', oee: 0, currentJob: '—' },
  { id: 'M06', name: 'Press #2', status: 'RUNNING', oee: 82, currentJob: 'JOB-4530' },
  { id: 'M07', name: 'Welder #1', status: 'RUNNING', oee: 89, currentJob: 'JOB-4527' },
  { id: 'M08', name: 'Welder #2', status: 'MAINTENANCE', oee: 0, currentJob: '—' },
  { id: 'M09', name: 'Grinder #1', status: 'RUNNING', oee: 78, currentJob: 'JOB-4532' },
  { id: 'M10', name: 'Grinder #2', status: 'IDLE', oee: 0, currentJob: '—' },
  { id: 'M11', name: 'Assembly #1', status: 'RUNNING', oee: 96, currentJob: 'JOB-4519' },
  { id: 'M12', name: 'Packaging #1', status: 'DOWN', oee: 0, currentJob: '—' },
];

export type AlertType = 'warning' | 'success' | 'info' | 'error';

export interface Alert {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  timeAgo: string;
}

export const recentAlerts: Alert[] = [
  { id: 1, type: 'error', title: 'Press #1 – Hydraulic Failure', message: 'Hydraulic pressure dropped below threshold. Maintenance dispatched.', timeAgo: '12 min ago' },
  { id: 2, type: 'warning', title: 'Inventory Low – Steel Rods', message: 'Stock below reorder level (150 units remaining).', timeAgo: '34 min ago' },
  { id: 3, type: 'success', title: 'JOB-4518 Completed', message: 'Batch of 500 units passed QC with 99.2% yield.', timeAgo: '1 hr ago' },
  { id: 4, type: 'info', title: 'Shift Change – B Shift Started', message: '48 operators clocked in for the evening shift.', timeAgo: '2 hr ago' },
  { id: 5, type: 'warning', title: 'CNC Mill #2 – Spindle Vibration', message: 'Vibration levels elevated; predictive alert triggered.', timeAgo: '3 hr ago' },
];

export const downtimeReasons = [
  { reason: 'Hydraulic Failure', minutes: 185 },
  { reason: 'Tooling Changeover', minutes: 142 },
  { reason: 'Material Shortage', minutes: 98 },
  { reason: 'Operator Absence', minutes: 67 },
  { reason: 'Electrical Fault', minutes: 45 },
];

export const inventoryByCategory = [
  { name: 'Raw Materials', value: 42, color: '#3b82f6' },
  { name: 'WIP', value: 28, color: '#8b5cf6' },
  { name: 'Finished Goods', value: 18, color: '#10b981' },
  { name: 'Consumables', value: 12, color: '#f59e0b' },
];
