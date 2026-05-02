/**
 * Mock Notifications Data
 * 
 * Sample data for development and testing
 */

import { NotificationRecord } from './types';

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  {
    ID: '618c4ee3-76e1-4efd-a487-fb65fc56b3fd',
    Type: 'Placement',
    Message: 'Meta Platforms Inc. hiring',
    Timestamp: '2026-05-01T19:06:00Z',
  },
  {
    ID: '4b9ed26d-0797-4cf6-ac26-19f28de1a172',
    Type: 'Placement',
    Message: 'Broadcom Inc. hiring',
    Timestamp: '2026-05-01T18:37:00Z',
  },
  {
    ID: 'd415c753-2beb-492b-b197-5728b08adb6e',
    Type: 'Placement',
    Message: 'Nvidia Corporation hiring',
    Timestamp: '2026-05-01T16:36:00Z',
  },
  {
    ID: 'a1f5e2c3-9d8b-4a7c-b6f2-8e9c3d2a1b5f',
    Type: 'Placement',
    Message: 'Amazon Web Services hiring',
    Timestamp: '2026-05-01T15:30:00Z',
  },
  {
    ID: '5e490309-8f6f-4331-bbdb-85a525af86bc',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: '2026-05-01T18:07:00Z',
  },
  {
    ID: '9d087d38-7e53-4a8d-9265-25445384778c',
    Type: 'Result',
    Message: 'internal',
    Timestamp: '2026-05-01T13:06:00Z',
  },
  {
    ID: 'd5d438ab-b5fb-4188-9d3c-6173a96bdbfb',
    Type: 'Result',
    Message: 'mid-sem',
    Timestamp: '2026-05-01T15:36:00Z',
  },
  {
    ID: '7c2a4d9e-1b3f-4c5e-8a6b-2d9f1c3e5b7a',
    Type: 'Result',
    Message: 'end-sem',
    Timestamp: '2026-05-01T12:00:00Z',
  },
  {
    ID: '6de97750-84e8-401d-b35b-4a7c3ccbf828',
    Type: 'Event',
    Message: 'tech-fest',
    Timestamp: '2026-05-01T09:06:00Z',
  },
  {
    ID: 'a00b9968-94d1-45bb-b868-9f6d8427d349',
    Type: 'Event',
    Message: 'induction',
    Timestamp: '2026-05-01T18:36:00Z',
  },
  {
    ID: 'b3e5f7c9-2a1d-4b8c-6e3a-9f2d1c4e5b8a',
    Type: 'Event',
    Message: 'hackathon',
    Timestamp: '2026-05-01T10:30:00Z',
  },
  {
    ID: 'c4f6g8d0-3b2e-5c9d-7f4b-0g3e2d5f6c9b',
    Type: 'Event',
    Message: 'workshop: web development',
    Timestamp: '2026-05-01T14:00:00Z',
  },
];

/**
 * Generate mock notifications with extended data
 */
export const generateMockNotifications = (count: number): NotificationRecord[] => {
  const notifications: NotificationRecord[] = [];
  const types: Array<'Placement' | 'Result' | 'Event'> = ['Placement', 'Result', 'Event'];
  const messages = {
    Placement: [
      'Google hiring',
      'Microsoft hiring',
      'Apple hiring',
      'Facebook hiring',
      'Amazon hiring',
      'Tesla hiring',
      'Netflix hiring',
    ],
    Result: [
      'Quiz results published',
      'Assignment grades',
      'Midterm results',
      'Project evaluation',
      'Lab exam results',
      'Final exam results',
    ],
    Event: [
      'Seminar on cloud computing',
      'Career fair',
      'Tech talks',
      'Coding competition',
      'Networking event',
      'Guest lecture',
      'Product launch',
    ],
  };

  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const messageList = messages[type];
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    const timestamp = new Date(Date.now() - i * 3600000).toISOString();

    notifications.push({
      ID: `${Math.random().toString(36).substring(2, 11)}-${Math.random().toString(36).substring(2, 11)}-${Math.random().toString(36).substring(2, 11)}-${Math.random().toString(36).substring(2, 11)}`,
      Type: type,
      Message: `${message} #${i}`,
      Timestamp: timestamp,
    });
  }

  return notifications;
};
