# Interview Assistant

A modern AI-powered interview preparation platform that helps users practice job interviews with AI voice agents, receive instant feedback, and track their interview history.

<div align="center">
    <img src="https://img.shields.io/badge/-Next.JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-Vapi-white?style=for-the-badge&color=5dfeca" alt="vapi" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logoColor=white&logo=firebase&color=DD2C00" alt="firebase" />
  <img src="https://img.shields.io/badge/-Google_Gemini-black?style=for-the-badge&logoColor=white&logo=google&color=4285F4" alt="google-gemini" />
</div>

## 🚀 Features

- **AI Voice Interviews**: Conduct real-time interviews with Vapi AI voice agents
- **Interview Generation**: Generate personalized interview questions based on role, level, and tech stack
- **Instant Feedback**: Get AI-powered feedback on your interview performance
- **User Authentication**: Secure sign-up and sign-in with Firebase
- **Interview History**: Track and manage all your past interviews
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Transcripts**: View live transcripts during interviews
- **Detailed Analytics**: Comprehensive feedback breakdown by category

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Voice AI**: Vapi AI
- **AI Models**: Google Gemini
- **UI Components**: shadcn/ui
- **Form Validation**: Zod + React Hook Form

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account and project
- Vapi account and API token
- Google Gemini API key

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BHUVI-SHIP-IT/interview_assistant.git
cd interview_assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Vapi Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-web-token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-vapi-workflow-id

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

### Setup Guides

- **[Vapi Workflow Setup Guide](./VAPI_WORKFLOW_SETUP.md)**: Complete step-by-step guide for creating the Vapi workflow manually
- **[Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)**: Detailed instructions for deploying to production (Vercel, Netlify, etc.)

### Getting Your API Keys

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Get your web app config from Project Settings
6. Generate a service account key for Admin SDK

#### Vapi Setup

1. Sign up at [Vapi Dashboard](https://dashboard.vapi.ai)
2. Get your API token from Settings → API Keys
3. Follow the [Vapi Workflow Setup Guide](./VAPI_WORKFLOW_SETUP.md) to create your workflow
4. Copy the Workflow ID to your `.env.local`

#### Google Gemini Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local`

## 🏗️ Project Structure

```
interview_assistant/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/              # Main application routes
│   │   ├── interview/       # Interview pages
│   │   └── page.tsx         # Home page
│   └── api/                 # API routes
│       └── vapi/
│           └── generate/    # Interview generation endpoint
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── Agent.tsx            # Vapi voice agent component
│   ├── AuthForm.tsx         # Authentication form
│   └── InterviewCard.tsx    # Interview card component
├── firebase/                # Firebase configuration
│   ├── admin.ts             # Server-side Firebase Admin
│   └── client.ts            # Client-side Firebase
├── lib/                     # Utility functions
│   ├── actions/             # Server actions
│   │   ├── auth.action.ts   # Authentication actions
│   │   └── general.action.ts # General actions
│   ├── utils.ts             # Utility functions
│   └── vapi.sdk.ts          # Vapi SDK initialization
├── constants/               # Constants and configurations
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Interview Generation

Users can generate personalized interview questions by:
1. Starting a voice conversation with Vapi
2. Providing job role, experience level, interview type, tech stack, and number of questions
3. The system generates questions using Google Gemini AI
4. Questions are saved to Firestore for later use

### AI Voice Interviews

- Real-time voice conversations with AI interviewers
- Live transcription of the conversation
- Automatic feedback generation after interview completion
- Detailed performance analysis

### Feedback System

After each interview, users receive:
- Overall score (0-100)
- Category-wise scores:
  - Communication Skills
  - Technical Knowledge
  - Problem-Solving
  - Cultural Fit
  - Confidence and Clarity
- Strengths and areas for improvement
- Final assessment

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy

For detailed deployment instructions, see [Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md).

### Production API URL

After deployment, your API endpoint will be:
```
https://your-project.vercel.app/api/vapi/generate
```

Update this URL in your Vapi workflow configuration.

## 🔧 Troubleshooting

### Common Issues

**Firebase Collections Not Appearing**
- Ensure all Firebase environment variables are set correctly
- Check that Firebase Admin SDK is properly initialized
- Verify Firestore rules allow read/write access

**Vapi Workflow Not Working**
- Verify `NEXT_PUBLIC_VAPI_WORKFLOW_ID` is set correctly
- Check that the workflow is deployed in Vapi dashboard
- Ensure the API endpoint URL in workflow is correct

**API Endpoint Errors**
- Verify all environment variables are set in production
- Check API route logs for specific errors
- Ensure CORS is configured if needed

For more troubleshooting help, see the guides in the Documentation section.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Repository**: [https://github.com/BHUVI-SHIP-IT/interview_assistant](https://github.com/BHUVI-SHIP-IT/interview_assistant)
- **Firebase**: [https://firebase.google.com](https://firebase.google.com)
- **Vapi**: [https://vapi.ai](https://vapi.ai)
- **Next.js**: [https://nextjs.org](https://nextjs.org)

## 📞 Support

If you encounter any issues or have questions:
1. Check the documentation guides
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Built with ❤️ using Next.js, Vapi AI, and Firebase**
