export const fallbackPrescriptions = [
  {
    _id: 'rx-1001',
    createdAt: '2026-04-07T10:15:00.000Z',
    imageUrl: '',
    extractedText:
      'Patient advised Tab Metformin 500mg twice daily after meals for 30 days. Follow-up after 2 weeks. Maintain hydration.',
    structuredData: {
      doctor: 'Dr. Ananya Rao',
      medicines: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily after meals',
          duration: '30 days',
        },
      ],
      notes: 'Follow-up in 2 weeks. Maintain hydration.',
    },
  },
  {
    _id: 'rx-1002',
    createdAt: '2026-04-10T14:30:00.000Z',
    imageUrl: '',
    extractedText:
      'Tab Amlodipine 5mg once daily morning. BP monitoring weekly. Reduce dietary sodium intake.',
    structuredData: {
      doctor: 'Dr. Vivek Sharma',
      medicines: [
        {
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily in the morning',
          duration: '60 days',
        },
      ],
      notes: 'Monitor blood pressure weekly. Reduce sodium intake.',
    },
  },
];

export const fallbackSearchResults = [
  {
    id: 'rx-1002',
    score: 0.91,
    metadata: {
      prescriptionId: 'rx-1002',
      text: 'Amlodipine 5mg once daily. BP monitoring weekly. Reduce sodium intake.',
      userId: 'fallback-user',
    },
  },
  {
    id: 'rx-1001',
    score: 0.84,
    metadata: {
      prescriptionId: 'rx-1001',
      text: 'Metformin 500mg twice daily after meals. Follow-up after 2 weeks.',
      userId: 'fallback-user',
    },
  },
];

export const fallbackUploadResult = {
  extractedText:
    'Tab Cetirizine 10mg at bedtime for 5 days. Steam inhalation twice daily. Revisit if fever persists.',
  structuredData: {
    doctor: 'Dr. Meera Iyer',
    medicines: [
      {
        name: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily at bedtime',
        duration: '5 days',
      },
    ],
    notes: 'Steam inhalation twice daily. Revisit if fever persists.',
  },
};

export const chatSuggestedPrompts = [
  'Summarize my latest prescription',
  'What are my active medicines?',
  'What follow-up actions are noted?',
  'Show dosage reminders from my records',
];
