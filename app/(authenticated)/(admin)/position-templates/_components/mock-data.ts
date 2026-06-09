import { PositionTemplate } from '@/types/database';

export const mockPositionTemplates: PositionTemplate[] = [
  {
    id: 'template-001',
    organization_id: 'org-001',
    name: 'Standard Council Ballot',
    positions: [
      { name: 'President', seat_count: 1 },
      { name: 'Vice President', seat_count: 1 },
      { name: 'Secretary', seat_count: 1 },
      { name: 'Treasurer', seat_count: 1 },
      { name: 'Council Member', seat_count: 4 },
    ],
    created_at: '2025-11-15T10:30:00Z',
    updated_at: '2026-01-10T14:22:00Z',
    is_deleted: false,
  },
  {
    id: 'template-002',
    organization_id: 'org-001',
    name: 'Freshmen Reps',
    positions: [
      { name: 'Freshman Representative', seat_count: 3 },
      { name: 'Freshman Alternate', seat_count: 2 },
    ],
    created_at: '2025-09-20T08:15:00Z',
    updated_at: '2026-02-05T09:45:00Z',
    is_deleted: false,
  },
  {
    id: 'template-003',
    organization_id: 'org-001',
    name: 'Special By-Election',
    positions: [
      { name: 'Emergency Director', seat_count: 1 },
      { name: 'Deputy Director', seat_count: 1 },
    ],
    created_at: '2026-01-05T12:00:00Z',
    updated_at: '2026-03-01T16:30:00Z',
    is_deleted: false,
  },
  {
    id: 'template-004',
    organization_id: 'org-001',
    name: 'Department Board',
    positions: [
      { name: 'Board Chair', seat_count: 1 },
      { name: 'Board Secretary', seat_count: 1 },
      { name: 'Board Member', seat_count: 5 },
      { name: 'Student Representative', seat_count: 2 },
    ],
    created_at: '2025-08-10T11:20:00Z',
    updated_at: '2025-12-20T13:00:00Z',
    is_deleted: false,
  },
];
