export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) return 'Not available';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: options.withTime ? 'short' : undefined,
  }).format(date);
};

export const extractErrorMessage = (error, fallbackMessage = 'Something went wrong.') => {
  if (!error) return fallbackMessage;

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallbackMessage
  );
};

export const getInitials = (name = '') => {
  const safeName = name.trim();
  if (!safeName) return 'U';

  const parts = safeName.split(' ').filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase());

  return initials.join('') || 'U';
};

export const safeArray = (value) => (Array.isArray(value) ? value : []);

export const parseStructuredData = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return null;
};

export const buildFallbackChatReply = (question = '') => {
  const normalizedQuestion = question.trim().toLowerCase();

  if (normalizedQuestion.includes('side effect')) {
    return 'Potential side effects vary by medicine. Please review your prescription notes and contact your doctor for individualized advice.';
  }

  if (normalizedQuestion.includes('dosage') || normalizedQuestion.includes('dose')) {
    return 'Please follow the dosage exactly as prescribed by your physician. If any instruction is unclear, contact your clinic before changing usage.';
  }

  return 'I can help summarize your prescription context. Please share your question clearly, and I will provide guidance based on available records.';
};
