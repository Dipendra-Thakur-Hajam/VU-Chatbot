// Chat service with mock RAG responses

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Source {
  id: string;
  title: string;
  type: 'policy' | 'faq' | 'course' | 'deadline';
  excerpt: string;
  relevance: number;
}

interface ChatResponse {
  message: Message;
  sources: Source[];
}

// Mock knowledge base for RAG simulation
const knowledgeBase = {
  admission: {
    response: "Our admission process for 2025 consists of three main phases: Online Application (Jan 15 - Mar 30), Entrance Examination (Apr 15), and Counseling & Seat Allotment (May 1-15). You'll need to submit your 10+2 marksheet, ID proof, passport photos, and the application fee of $50.",
    sources: [
      { id: '1', title: 'Admissions Policy 2025', type: 'policy' as const, excerpt: 'Application deadline: March 30, 2025', relevance: 0.95 },
      { id: '2', title: 'Required Documents', type: 'policy' as const, excerpt: '10+2 marksheet, ID proof, 4 passport photos', relevance: 0.88 },
    ]
  },
  fees: {
    response: "Tuition fees vary by program: Engineering programs are $12,000/year, Business programs are $10,000/year, and Arts & Sciences are $8,000/year. We offer merit-based scholarships covering up to 50% of tuition, and need-based financial aid is available. Payment can be made in two installments per semester.",
    sources: [
      { id: '3', title: 'Fee Structure 2025-26', type: 'policy' as const, excerpt: 'Engineering: $12,000 | Business: $10,000 | Arts: $8,000', relevance: 0.92 },
      { id: '4', title: 'Scholarship Programs', type: 'faq' as const, excerpt: 'Merit scholarships up to 50% available', relevance: 0.85 },
    ]
  },
  courses: {
    response: "We offer 45+ undergraduate programs across Engineering (CSE, ECE, Mechanical, Civil), Business (BBA, B.Com, Economics), Arts & Sciences (Physics, Chemistry, Mathematics, English), and Healthcare (Nursing, Pharmacy). Each program is designed with industry collaboration and includes mandatory internships.",
    sources: [
      { id: '5', title: 'Course Catalog 2025', type: 'course' as const, excerpt: '45+ programs across 4 faculties', relevance: 0.94 },
      { id: '6', title: 'Engineering Programs', type: 'course' as const, excerpt: 'CSE, ECE, Mechanical, Civil Engineering', relevance: 0.89 },
    ]
  },
  eligibility: {
    response: "General eligibility requires 60% aggregate in 10+2 (55% for reserved categories). Engineering requires Physics, Chemistry, and Mathematics. Business programs accept any stream. Additional requirements include valid entrance exam scores and age limit of 21 years as of admission date.",
    sources: [
      { id: '7', title: 'Eligibility Criteria', type: 'policy' as const, excerpt: 'Minimum 60% in 10+2 for general category', relevance: 0.96 },
      { id: '8', title: 'Engineering Requirements', type: 'policy' as const, excerpt: 'PCM mandatory for engineering programs', relevance: 0.87 },
    ]
  },
  deadlines: {
    response: "Important dates for 2025: Application Opens - January 15, Last Date to Apply - March 30, Entrance Exam - April 15, Results Announcement - April 25, Counseling - May 1-15, Classes Begin - July 1. Late applications with penalty accepted until April 5.",
    sources: [
      { id: '9', title: 'Academic Calendar 2025', type: 'deadline' as const, excerpt: 'Classes begin July 1, 2025', relevance: 0.93 },
      { id: '10', title: 'Application Timeline', type: 'deadline' as const, excerpt: 'Apply by March 30 to avoid late fees', relevance: 0.91 },
    ]
  },
  hostel: {
    response: "On-campus accommodation is available for all students. Single rooms are $3,000/year, shared rooms (2-person) are $2,000/year, and dormitory style is $1,500/year. All hostels include Wi-Fi, laundry facilities, 24/7 security, and meal plans. Apply during admission for guaranteed accommodation.",
    sources: [
      { id: '11', title: 'Hostel Facilities', type: 'faq' as const, excerpt: 'Single, shared, and dormitory options available', relevance: 0.90 },
      { id: '12', title: 'Campus Life Guide', type: 'faq' as const, excerpt: 'All hostels include Wi-Fi and meal plans', relevance: 0.82 },
    ]
  },
  default: {
    response: "I'm here to help with all your college admission queries! I can assist you with information about admission process, eligibility criteria, available courses, fee structure, important deadlines, scholarships, hostel facilities, and more. What would you like to know?",
    sources: [
      { id: '13', title: 'General FAQs', type: 'faq' as const, excerpt: 'Comprehensive guide to college admissions', relevance: 0.75 },
    ]
  }
};

const findRelevantTopic = (query: string): keyof typeof knowledgeBase => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('admission') || lowerQuery.includes('apply') || lowerQuery.includes('application')) {
    return 'admission';
  }
  if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('tuition') || lowerQuery.includes('scholarship')) {
    return 'fees';
  }
  if (lowerQuery.includes('course') || lowerQuery.includes('program') || lowerQuery.includes('degree') || lowerQuery.includes('major')) {
    return 'courses';
  }
  if (lowerQuery.includes('eligib') || lowerQuery.includes('require') || lowerQuery.includes('qualify') || lowerQuery.includes('criteria')) {
    return 'eligibility';
  }
  if (lowerQuery.includes('deadline') || lowerQuery.includes('date') || lowerQuery.includes('when') || lowerQuery.includes('schedule')) {
    return 'deadlines';
  }
  if (lowerQuery.includes('hostel') || lowerQuery.includes('accommodation') || lowerQuery.includes('dormitor') || lowerQuery.includes('stay')) {
    return 'hostel';
  }
  
  return 'default';
};

export const sendMessage = async (content: string): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const topic = findRelevantTopic(content);
  const knowledge = knowledgeBase[topic];
  
  return {
    message: {
      id: Date.now().toString(),
      content: knowledge.response,
      role: 'assistant',
      timestamp: new Date(),
    },
    sources: knowledge.sources,
  };
};

export const getChatHistory = (): Message[] => {
  const stored = localStorage.getItem('college_agent_chat_history');
  return stored ? JSON.parse(stored) : [];
};

export const saveChatHistory = (messages: Message[]): void => {
  localStorage.setItem('college_agent_chat_history', JSON.stringify(messages));
};

export default { sendMessage, getChatHistory, saveChatHistory };

export async function sendMessage(question: string) {
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  return res.json();
}

