import type { Report, ReportTarget } from '../types';
import { getDb, mutate, nid } from './store';

export async function createReport(input: {
  reporterId: string;
  targetType: ReportTarget;
  targetId: string;
  reason: string;
}): Promise<Report> {
  const row: Report = {
    id: nid('r'),
    reporterId: input.reporterId,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason.trim() || '—',
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  await mutate((d) => {
    d.reports.push(row);
  });
  return row;
}

export function listReports(): Report[] {
  return [...getDb().reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function resolveReport(id: string): Promise<void> {
  await mutate((d) => {
    const r = d.reports.find((x) => x.id === id);
    if (r) r.status = 'resolved';
  });
}
