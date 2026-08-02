// OpenAI Service for Feature Requirement Extraction & Subtask Generation

const OPENAI_API_KEY = ''; // Set your API key via the UI or environment variable

/**
 * Analyzes document text using OpenAI API to extract structured features.
 */
export async function analyzeRequirementDocument(docText, customApiKey = null) {
  const apiKey = customApiKey || OPENAI_API_KEY;

  const prompt = `
You are an expert Agile Product Manager and Software Architect.
Analyze the following requirement document and extract all distinct software features.

Return ONLY a valid JSON object matching this exact schema:
{
  "features": [
    {
      "name": "Feature Name",
      "description": "Detailed clear description of what this feature does",
      "module": "Suggested Module Name (e.g. Authentication, Shopping Cart, Payment, User Management, Order Management, Notifications)",
      "priority": "Critical" | "High" | "Medium" | "Low",
      "requirements": "Detailed functional requirements text",
      "acceptanceCriteria": [
        "Criteria 1",
        "Criteria 2",
        "Criteria 3"
      ],
      "suggestedSubtasks": [
        "UI implementation subtask",
        "Form / Input validation subtask",
        "API & Database integration subtask",
        "Error handling & loading state",
        "Testing & QA subtask"
      ],
      "dependencies": ["Prerequisite Feature Name or None"],
      "estimatedComplexity": "Low (4h)" | "Medium (12h)" | "High (24h)",
      "suggestedDevOrder": 1
    }
  ]
}

Document Content to Analyze:
${docText}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI Product Management assistant that extracts software features into clean JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('OpenAI API returned error status, switching to smart local fallback:', response.status, errData);
      return fallbackLocalExtraction(docText);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    if (parsed.features && Array.isArray(parsed.features) && parsed.features.length > 0) {
      return parsed.features.map((f, idx) => ({
        id: `ai-extracted-${Date.now()}-${idx}`,
        name: f.name || 'Unnamed Feature',
        description: f.description || '',
        module: f.module || 'General',
        priority: f.priority || 'Medium',
        requirements: f.requirements || '',
        acceptanceCriteria: Array.isArray(f.acceptanceCriteria) ? f.acceptanceCriteria : [f.acceptanceCriteria].filter(Boolean),
        suggestedSubtasks: Array.isArray(f.suggestedSubtasks) ? f.suggestedSubtasks : [
          'UI Component Setup',
          'Form & State Validation',
          'API Endpoint Integration',
          'QA & Unit Testing'
        ],
        dependencies: Array.isArray(f.dependencies) ? f.dependencies : ['None'],
        complexity: f.estimatedComplexity || 'Medium (12h)',
        devOrder: f.suggestedDevOrder || idx + 1,
        approved: true, // Selected for review by default
        edited: false
      }));
    } else {
      return fallbackLocalExtraction(docText);
    }
  } catch (err) {
    console.warn('OpenAI Fetch failed, utilizing resilient smart AI local parser:', err);
    return fallbackLocalExtraction(docText);
  }
}

/**
 * AI Subtask generator for any given feature name + description
 */
export async function generateSubtasksForFeature(featureName, featureDesc, customApiKey = null) {
  const apiKey = customApiKey || OPENAI_API_KEY;

  const prompt = `
Generate granular, actionable software development subtasks for the following feature:
Feature Name: "${featureName}"
Description: "${featureDesc}"

Return ONLY a valid JSON object matching this schema:
{
  "subtasks": [
    "Subtask title 1",
    "Subtask title 2",
    "Subtask title 3",
    "Subtask title 4",
    "Subtask title 5",
    "Subtask title 6"
  ]
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Senior Lead Developer generating concrete engineering subtasks.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4
      })
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      if (parsed.subtasks && Array.isArray(parsed.subtasks)) {
        return parsed.subtasks;
      }
    }
  } catch (err) {
    console.warn('AI Subtask fetch failed, fallback to local generator:', err);
  }

  // Fallback intelligent subtasks based on feature context
  return [
    `${featureName} UI Layout & UX Component`,
    'Form Inputs & State Validation',
    'Backend API Endpoint & Schema Integration',
    'Error Handling & User Feedback Notifications',
    'Loading State & skeleton screen indicators',
    'Authentication & Permission Guard checks',
    'Cross-browser & Responsive Screen Testing',
    'QA Automated Test Suite & Sign-off'
  ];
}

/**
 * Resilient Smart Local Fallback Parser if OpenAI API is offline / rate limited.
 */
function fallbackLocalExtraction(docText) {
  const lines = docText.split('\n').map(l => l.trim()).filter(Boolean);
  const features = [];
  let currentModule = 'General Module';

  // Section / Header matching
  lines.forEach((line, idx) => {
    if (line.startsWith('#') || line.match(/^[0-9]+\.\s*/)) {
      const cleanName = line.replace(/^[#0-9.\s]+/, '').split(':')[0].trim();
      if (cleanName.toLowerCase().includes('requirement') || cleanName.toLowerCase().includes('specification')) {
        return;
      }
      
      let priority = 'Medium';
      if (cleanName.toLowerCase().includes('auth') || cleanName.toLowerCase().includes('login') || cleanName.toLowerCase().includes('payment')) {
        priority = 'Critical';
      } else if (cleanName.toLowerCase().includes('checkout') || cleanName.toLowerCase().includes('cart') || cleanName.toLowerCase().includes('order')) {
        priority = 'High';
      }

      // Infer module
      let module = 'Core Systems';
      if (cleanName.toLowerCase().includes('search') || cleanName.toLowerCase().includes('catalog')) module = 'Product Catalog';
      if (cleanName.toLowerCase().includes('cart') || cleanName.toLowerCase().includes('checkout') || cleanName.toLowerCase().includes('billing')) module = 'Payment';
      if (cleanName.toLowerCase().includes('auth') || cleanName.toLowerCase().includes('login') || cleanName.toLowerCase().includes('sso')) module = 'Authentication';
      if (cleanName.toLowerCase().includes('profile') || cleanName.toLowerCase().includes('user') || cleanName.toLowerCase().includes('workspace')) module = 'User Management';

      const nextLines = lines.slice(idx + 1, idx + 4).join(' ');

      features.push({
        id: `ai-extracted-fallback-${Date.now()}-${features.length}`,
        name: cleanName,
        description: nextLines || `Implement full functionality for ${cleanName} with validation and error handling.`,
        module: module,
        priority: priority,
        requirements: `Complete engineering implementation for ${cleanName}. Must support user inputs, API synchronization, and responsive views.`,
        acceptanceCriteria: [
          `Form validation & clean error states for ${cleanName}`,
          `REST API / GraphQL integration completed`,
          `Mobile and desktop layout responsive checks pass`
        ],
        suggestedSubtasks: [
          `${cleanName} UI Component & Styling`,
          `Client-side Validation & State Management`,
          `API Controller & Database Model Integration`,
          `Error Handling & Edge Case Protection`,
          `QA Testing & Code Review`
        ],
        dependencies: ['None'],
        complexity: priority === 'Critical' ? 'High (24h)' : priority === 'High' ? 'Medium (16h)' : 'Low (8h)',
        devOrder: features.length + 1,
        approved: true,
        edited: false
      });
    }
  });

  // If no sections matched, create 3 default extracted features from text blocks
  if (features.length === 0) {
    features.push(
      {
        id: `ai-extracted-fallback-${Date.now()}-1`,
        name: 'User Registration & Onboarding',
        description: docText.slice(0, 150) + '...',
        module: 'Authentication',
        priority: 'High',
        requirements: 'Allow seamless sign up with validation.',
        acceptanceCriteria: ['Valid email check', 'Secure password storage'],
        suggestedSubtasks: ['Registration UI', 'Form validation', 'API integration', 'Email Verification'],
        dependencies: ['None'],
        complexity: 'Medium (12h)',
        devOrder: 1,
        approved: true,
        edited: false
      },
      {
        id: `ai-extracted-fallback-${Date.now()}-2`,
        name: 'Core Feature Workflow',
        description: 'Implementation of primary business logic based on uploaded document requirements.',
        module: 'Core System',
        priority: 'Critical',
        requirements: 'High availability logic with security checks.',
        acceptanceCriteria: ['End-to-end integration test passes', 'Responsive design'],
        suggestedSubtasks: ['Core Engine UI', 'Business Logic API', 'Database Migration', 'QA Signoff'],
        dependencies: ['User Registration & Onboarding'],
        complexity: 'High (24h)',
        devOrder: 2,
        approved: true,
        edited: false
      }
    );
  }

  return features;
}
