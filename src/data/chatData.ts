export const CHAT_I18N: Record<string, any> = {
  en: {
    stopped: 'Stopped.',
    calc_prefix: 'Result:',
    calc_err: 'Could not evaluate expression.',
    wiki_miss: 'Gemini AI is currently busy.',
    intro_default: "Hi! Ask about Vivek’s skills, projects, or education.",
    identity: "I'm Vivek Sharma, a B.Tech CSE student at LPU.",
    project: 'I built a Student Marks Portal and more.',
    skill: 'Skills: C, Python, HTML, CSS, JavaScript.',
    education: "Pursuing B.Tech CSE at Lovely Professional University.",
    gemini_help: 'Powered by Google Gemini AI.',
    contact: 'Email: viveklpu008@gmail.com',
    hello_greet: "Hello! How can I help you today?",
  },
  hi: {
    stopped: 'रोका गया।',
    calc_prefix: 'परिणाम:',
    calc_err: 'गणना त्रुटि।',
    wiki_miss: 'Gemini AI अभी व्यस्त है।',
    intro_default: 'नमस्ते! विवेक के बारे में पूछें।',
    identity: 'मैं विवेक शर्मा हूँ।',
    project: 'मैंने कई प्रोजेक्ट बनाए हैं।',
    skill: 'स्किल्स: C, Python, HTML, CSS, JavaScript.',
    education: 'मैं LPU से B.Tech कर रहा हूँ।',
    gemini_help: 'Gemini AI द्वारा संचालित।',
    contact: 'ईमेल: viveklpu008@gmail.com',
    hello_greet: 'नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?',
  },
  hing: {
    stopped: 'Stop ho gaya.',
    calc_prefix: 'Answer:',
    calc_err: 'Solve nahi hua.',
    wiki_miss: 'AI abhi busy hai.',
    intro_default: 'Hi! Vivek ke baare mein pucho.',
    identity: 'Main Vivek Sharma hoon.',
    project: 'Maine kaafi projects banaye hain.',
    skill: 'Skills: C, Python, HTML, CSS, JS.',
    education: 'Main LPU se B.Tech kar raha hoon.',
    gemini_help: 'Gemini AI se powered.',
    contact: 'Email: viveklpu008@gmail.com',
    hello_greet: 'Hello! Kaise help karun?',
  },
};

export const getLocalAIResponse = (query: string, lang: 'en' | 'hi' | 'hing') => {
  const x = query.toLowerCase();
  const pack = CHAT_I18N[lang] || CHAT_I18N.en;

  if (x.includes('who') || x.includes('vivek')) return pack.identity;
  if (x.includes('project')) return pack.project;
  if (x.includes('skill')) return pack.skill;
  if (x.includes('education') || x.includes('lpu')) return pack.education;
  if (x.includes('contact') || x.includes('email')) return pack.contact;
  if (x.includes('hi') || x.includes('hello')) return pack.hello_greet;
  
  return null;
};
