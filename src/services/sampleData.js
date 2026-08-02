// Initial Sample Project Data for "Kichu Kori" Project Management System

export const INITIAL_PROJECT = {
  id: 'proj-kichu-kori',
  name: 'Kichu Kori Platform',
  description: 'Enterprise E-Commerce & SaaS Management Ecosystem',
  overallProgress: 72,
  startDate: '2026-07-01',
  targetCompletionDate: '2026-08-31',
  modules: [
    { id: 'mod-1', name: 'Authentication', description: 'User login, registration, OAuth & security', progress: 100, color: '#10B981' },
    { id: 'mod-2', name: 'User Management', description: 'Profiles, roles, permissions & team scoping', progress: 80, color: '#6366F1' },
    { id: 'mod-3', name: 'Dashboard', description: 'Real-time analytics, widget grid & metrics', progress: 70, color: '#3B82F6' },
    { id: 'mod-4', name: 'Payment', description: 'Stripe, Bkash, Nagad integration & invoicing', progress: 40, color: '#F59E0B' },
    { id: 'mod-5', name: 'Admin Panel', description: 'System config, audit logs & feature flags', progress: 60, color: '#8B5CF6' }
  ],
  
  // Project Repositories
  repositories: [
    { id: 'repo-1', name: 'Frontend Web Portal', type: 'Frontend', url: 'https://github.com/kichukori/frontend-web', branch: 'main' },
    { id: 'repo-2', name: 'Backend Microservices API', type: 'Backend', url: 'https://github.com/kichukori/backend-api', branch: 'main' },
    { id: 'repo-3', name: 'AI Requirement & LLM Engine', type: 'AI Service', url: 'https://github.com/kichukori/ai-engine', branch: 'main' },
    { id: 'repo-4', name: 'Mobile App (React Native)', type: 'Mobile', url: 'https://github.com/kichukori/mobile-app', branch: 'development' }
  ],

  // Environment Variables Vault
  environmentVars: [
    // Frontend Env
    { id: 'env-1', key: 'VITE_API_BASE_URL', value: 'https://api.kichukori.com/v1', category: 'Frontend', isSecret: false },
    { id: 'env-2', key: 'VITE_STRIPE_PUBLIC_KEY', value: 'pk_live_51NxKichuKoriSampleKey998877', category: 'Frontend', isSecret: true },
    { id: 'env-3', key: 'VITE_ENABLE_AI_DOC_IMPORT', value: 'true', category: 'Frontend', isSecret: false },

    // Backend Env
    { id: 'env-4', key: 'DATABASE_URL', value: 'postgresql://postgres:SecurePass2026@db.kichukori.internal:5432/kichukori_db', category: 'Backend', isSecret: true },
    { id: 'env-5', key: 'REDIS_HOST', value: 'redis://cache.kichukori.internal:6379', category: 'Backend', isSecret: true },
    { id: 'env-6', key: 'JWT_SECRET', value: 'super_secret_jwt_token_key_kichukori_2026', category: 'Backend', isSecret: true },
    { id: 'env-7', key: 'PORT', value: '5000', category: 'Backend', isSecret: false },

    // AI Env
    { id: 'env-8', key: 'OPENAI_API_KEY', value: 'sk-your-api-key-here', category: 'AI Service', isSecret: true },
    { id: 'env-9', key: 'PINECONE_VECTOR_DB_INDEX', value: 'kichukori-embeddings-v2', category: 'AI Service', isSecret: false },
    { id: 'env-10', key: 'EMBEDDING_MODEL', value: 'text-embedding-3-small', category: 'AI Service', isSecret: false }
  ],

  // Dev Quick Links & Docs
  quickLinks: [
    { id: 'link-1', title: 'Figma UI/UX Mockups', url: 'https://figma.com/@kichukori-design', icon: 'figma' },
    { id: 'link-2', title: 'Swagger API Docs', url: 'https://api.kichukori.com/docs', icon: 'api' },
    { id: 'link-3', title: 'Staging Environment', url: 'https://staging.kichukori.com', icon: 'globe' },
    { id: 'link-4', title: 'Production Console', url: 'https://app.kichukori.com', icon: 'shield' }
  ]
};

export const INITIAL_FEATURES = [
  // Authentication (100% complete)
  {
    id: 'feat-1',
    name: 'User Registration',
    description: 'Allow new users to create accounts using email/password or social auth with email verification.',
    module: 'Authentication',
    priority: 'High',
    complexity: 'Medium (12h)',
    devOrder: 1,
    assignedDev: 'Sarah Jenkins',
    devAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    deadline: '2026-08-10',
    status: 'Done',
    requirements: 'Must enforce strong password policy and send email verification token.',
    acceptanceCriteria: [
      'Validates email uniqueness and formatting',
      'Sends 6-digit OTP verification code',
      'Encrypted password storage using bcrypt/argon2'
    ],
    dependencies: ['None'],
    subtasks: [
      { id: 'st-1', title: 'Registration UI Form', completed: true },
      { id: 'st-2', title: 'Email verification API integration', completed: true },
      { id: 'st-3', title: 'Password hash helper & DB model', completed: true },
      { id: 'st-4', title: 'QA & Edge case testing', completed: true }
    ]
  },
  {
    id: 'feat-2',
    name: 'User Login',
    description: 'Secure authentication using JWT tokens, refresh token rotation, and multi-factor auth.',
    module: 'Authentication',
    priority: 'Critical',
    complexity: 'High (16h)',
    devOrder: 2,
    assignedDev: 'Alex Rivera',
    devAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    deadline: '2026-08-12',
    status: 'Done',
    requirements: 'Support email/password auth, remember me session, and rate limiting against brute-force attacks.',
    acceptanceCriteria: [
      'Login UI with form validation',
      'API endpoint returning JWT & Refresh HTTP-only cookie',
      'Rate-limiting (5 failed attempts block for 15 mins)',
      'Responsive design across mobile and desktop'
    ],
    dependencies: ['User Registration'],
    subtasks: [
      { id: 'st-5', title: 'Login UI', completed: true },
      { id: 'st-6', title: 'Form validation', completed: true },
      { id: 'st-7', title: 'API integration', completed: true },
      { id: 'st-8', title: 'Error handling', completed: true },
      { id: 'st-9', title: 'Loading state', completed: true },
      { id: 'st-10', title: 'Authentication state', completed: true },
      { id: 'st-11', title: 'Responsive testing', completed: true },
      { id: 'st-12', title: 'QA testing', completed: true }
    ]
  },
  {
    id: 'feat-3',
    name: 'Password Reset',
    description: 'Provide self-service password recovery via secure email link with token expiration.',
    module: 'Authentication',
    priority: 'High',
    complexity: 'Medium (8h)',
    devOrder: 3,
    assignedDev: 'Michael Chang',
    devAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    deadline: '2026-08-15',
    status: 'Done',
    requirements: 'Generate single-use token expiring in 15 minutes.',
    acceptanceCriteria: [
      'Forgot password request screen',
      'Reset link generation & SMTP delivery',
      'Password reset form with security checks'
    ],
    dependencies: ['User Login'],
    subtasks: [
      { id: 'st-13', title: 'Forgot password UI modal', completed: true },
      { id: 'st-14', title: 'Token generation & email service', completed: true },
      { id: 'st-15', title: 'Reset endpoint validation', completed: true }
    ]
  },

  // User Management
  {
    id: 'feat-4',
    name: 'User Profile Management',
    description: 'Allow users to edit profile picture, full name, phone number, and preference settings.',
    module: 'User Management',
    priority: 'Medium',
    complexity: 'Medium (10h)',
    devOrder: 4,
    assignedDev: 'Elena Rostova',
    devAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    deadline: '2026-08-18',
    status: 'In Progress',
    requirements: 'Avatar image crop/upload to S3/CDN and user details update.',
    acceptanceCriteria: [
      'Avatar image upload with preview',
      'Profile details form validation',
      'Real-time avatar header refresh'
    ],
    dependencies: ['User Login'],
    subtasks: [
      { id: 'st-16', title: 'Profile Settings Layout', completed: true },
      { id: 'st-17', title: 'Avatar Image Uploader', completed: true },
      { id: 'st-18', title: 'User Details PUT API', completed: true },
      { id: 'st-19', title: 'Dark Mode preference toggle', completed: true },
      { id: 'st-20', title: 'Activity Audit Log viewer', completed: false }
    ]
  },

  // Dashboard
  {
    id: 'feat-5',
    name: 'Analytics Overview Dashboard',
    description: 'Visual cards showing total sales, active users, system performance, and quick metrics.',
    module: 'Dashboard',
    priority: 'High',
    complexity: 'High (20h)',
    devOrder: 5,
    assignedDev: 'Alex Rivera',
    devAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    deadline: '2026-08-22',
    status: 'In Progress',
    requirements: 'Interactive charts with date range filtering (7d, 30d, 1y).',
    acceptanceCriteria: [
      'Chart widgets for sales and revenue',
      'Real-time websocket metrics counter',
      'Filterable date range picker'
    ],
    dependencies: ['User Profile Management'],
    subtasks: [
      { id: 'st-21', title: 'Grid dashboard template', completed: true },
      { id: 'st-22', title: 'Chart.js / Recharts integration', completed: true },
      { id: 'st-23', title: 'API Aggregation queries', completed: true },
      { id: 'st-24', title: 'Export report to CSV/PDF', completed: false }
    ]
  },

  // Payment
  {
    id: 'feat-6',
    name: 'Payment Gateway Integration',
    description: 'Support local and global payments: Credit Cards (Stripe), bKash, Nagad, and PayPal.',
    module: 'Payment',
    priority: 'Critical',
    complexity: 'High (30h)',
    devOrder: 6,
    assignedDev: 'Michael Chang',
    devAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    deadline: '2026-08-28',
    status: 'In Progress',
    requirements: 'PCI-DSS compliant payment processing with webhook handlers.',
    acceptanceCriteria: [
      'Checkout form modal',
      'Stripe PaymentIntent API setup',
      'bKash / Nagad payment gateway callback API',
      'Invoice PDF generation'
    ],
    dependencies: ['User Profile Management'],
    subtasks: [
      { id: 'st-25', title: 'Checkout UI Component', completed: true },
      { id: 'st-26', title: 'Stripe Webhook API Listener', completed: true },
      { id: 'st-27', title: 'bKash Merchant Sandbox integration', completed: false },
      { id: 'st-28', title: 'Nagad PG API Integration', completed: false },
      { id: 'st-29', title: 'Payment Failure Recovery & Refund API', completed: false }
    ]
  },

  // Admin Panel
  {
    id: 'feat-7',
    name: 'System Feature Flags & Config',
    description: 'Admin control panel to turn platform features on/off dynamically without code redeployment.',
    module: 'Admin Panel',
    priority: 'Medium',
    complexity: 'Medium (14h)',
    devOrder: 7,
    assignedDev: 'Sarah Jenkins',
    devAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    deadline: '2026-08-30',
    status: 'In Progress',
    requirements: 'Granular permissions check, audit logging for config changes.',
    acceptanceCriteria: [
      'Toggle switch UI for active feature flags',
      'Role-based access check (Admin only)',
      'Redis cache key invalidation on toggle'
    ],
    dependencies: ['User Registration'],
    subtasks: [
      { id: 'st-30', title: 'Admin Feature Flag Table', completed: true },
      { id: 'st-31', title: 'Toggle switch API endpoint', completed: true },
      { id: 'st-32', title: 'Redis caching layer for flags', completed: true },
      { id: 'st-33', title: 'Audit Trail log record creation', completed: false },
      { id: 'st-34', title: 'Role Guard middleware enforcement', completed: false }
    ]
  }
];

export const SAMPLE_REQUIREMENT_DOCUMENTS = [
  {
    id: 'sample-1',
    title: 'E-Commerce Mobile App Requirements',
    type: 'Requirement Document',
    content: `
# Feature Requirements Document: E-Commerce Mobile App (v2.0)

## 1. Product Catalog & Search
Users should be able to browse products by category, filter by price range and rating, search with auto-complete suggestions, and view detailed product image galleries.

## 2. Shopping Cart & Checkout
Users must be able to add products to a shopping cart, apply discount coupon codes, select delivery address, choose payment method (Credit Card, bKash, Cash on Delivery), and receive order confirmation notifications via SMS and Email.

## 3. Order Tracking & Notifications
Customers need a live order status timeline (Ordered -> Processing -> Out for Delivery -> Delivered) with push notifications and courier tracking map integration.

## 4. Product Reviews & Ratings
Verified purchasers should be able to rate products (1-5 stars), upload photo reviews, mark reviews as helpful, and report inappropriate content.
`
  },
  {
    id: 'sample-2',
    title: 'SaaS Multi-Tenant Authentication & Subscriptions',
    type: 'Feature Specification Document',
    content: `
# Specification: SaaS Tenant Workspace & Subscription Module

## 1. Team Workspace Creation
Workspace owners can invite team members via email, assign custom granular roles (Admin, Editor, Viewer), set workspace custom domain, and transfer ownership.

## 2. Subscription & Tiered Billing
The platform must support Tiered Subscription plans (Free, Pro, Enterprise) with monthly/annual billing cycle, seat-based pricing calculation, automatic recurring invoices, and tier usage limits enforcement.

## 3. Single Sign-On (SSO) & OAuth
Enterprise tenants require SAML 2.0 / OIDC Single Sign-On integration (Okta, Google Workspace, Azure AD) and mandatory Enforce-2FA setting for workspace members.
`
  },
  {
    id: 'sample-3',
    title: 'Healthcare Patient Tele-Consultation Portal',
    type: 'PRD',
    content: `
# PRD: Telehealth Consultation & Medical Records

## 1. Doctor Appointment Booking
Patients should be able to search doctors by specialty, view available calendar time slots, book video consultations, and make online appointment payments.

## 2. WebRTC Video Consultation
Doctor and patient can join a secure, encrypted HD video call with in-call chat, screen sharing for lab reports, and connection quality indicators.

## 3. Digital Prescription & E-Pharmacy
Doctors can issue digital prescriptions during/after calls with ICD-10 diagnosis codes, dosage instructions, and auto-dispatch options to partner pharmacies.
`
  }
];

export const DEVELOPERS_LIST = [
  { name: 'Sarah Jenkins', role: 'Full Stack Dev', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { name: 'Alex Rivera', role: 'Lead Backend Eng', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { name: 'Michael Chang', role: 'DevOps & Backend', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { name: 'Elena Rostova', role: 'Frontend Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { name: 'David Kim', role: 'QA Lead & Automation', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' }
];
