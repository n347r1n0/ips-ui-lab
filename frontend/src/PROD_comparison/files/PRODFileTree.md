ips-website/  
├── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   │   ├── features/  
│   │   │   │   ├── Admin/  
│   │   │   │   │   ├── AdminRoute.jsx  
│   │   │   │   │   ├── BlindsStructureEditor.jsx  
│   │   │   │   │   ├── BlindsStructurePreview.jsx  
│   │   │   │   │   ├── BuyInSettingsEditor.jsx  
│   │   │   │   │   ├── DeleteConfirmModal.jsx  
│   │   │   │   │   ├── MockTimerModal.jsx  
│   │   │   │   │   └── TournamentModal.jsx  
│   │   │   │   ├── AtmosphereGallery/ 
│   │   │   │   │   └── AtmosphereGallery.jsx  
│   │   │   │   ├── Auth/  
│   │   │   │   │   ├── AuthModal.jsx  
│   │   │   │   │   ├── TelegramLoginWidget.jsx  
│   │   │   │   │   └── TelegramLoginRedirect.jsx  
│   │   │   │   ├── FAQ/
│   │   │   │   │   └── FAQ.jsx
│   │   │   │   ├── Hero/
│   │   │   │   │   └── HeroSection.jsx
│   │   │   │   ├── PlayerRatingWidget/
│   │   │   │   │   └── PlayerRatingWidget.jsx
│   │   │   │   ├── RegistrationForm/  
│   │   │   │   │   ├── GuestFormModal.jsx
│   │   │   │   │   └── RegistrationForm.jsx
│   │   │   │   ├── TournamentCalendar/  
│   │   │   │   │   ├── BlindsStructureViewer.jsx  
│   │   │   │   │   ├── BuyInSummary.jsx  
│   │   │   │   │   ├── EventMarker.jsx  
│   │   │   │   │   ├── RegistrationConfirmationModal.jsx  
│   │   │   │   │   ├── TournamentCalendar.jsx  
│   │   │   │   │   ├── TournamentListForDay.jsx  
│   │   │   │   │   ├── TournamentResultsModal.jsx  
│   │   │   │   │   └── UpcomingTournamentsModal.jsx  
│   │   │   │   ├── UserPaths/  
│   │   │   │   │   └── UserPathsSection.jsx
│   │   │   │   └── ValueProps/ 
│   │   │   │   │   ├── FeatureCard.jsx
│   │   │   │   │   └── ValuePropsSection.jsx
│   │   │   ├── layout/ (Header, Footer, Section, etc.)  
│   │   │   └── ui/ (AuthErrorDisplay, Button, GlassPanel, Toast, etc.)  
│   │   ├── contexts/ (AuthContext.jsx)  
│   │   ├── hooks/ (useAuthVersion.js, useMediaQuery.js)  
│   │   ├── lib/  
│   │   │   ├── supabaseClient.js  
│   │   │   ├── authSynchronizer.js (NEW - auth state sync)  
│   │   │   ├── sessionUtils.js  
│   │   │   ├── preAuthCleanup.js  
│   │   │   ├── validatedStorage.js  
│   │   │   ├── iosSafariUtils.js  
│   │   │   └── , etc.
│   │   ├── pages/ (HomePage, AdminDashboardPage, DashboardPage, TelegramCallbackPage)  
│   │   ├── App.jsx, main.jsx, index.css  
│   ├── tailwind.config.js, postcss.config.js, vite.config.js  
│   ├── AUTH-SYSTEM.md, CLAUDE.md, README.md  
│   └── .env.local, .env.development.local  
└── supabase/  
    ├── functions/  
    │   ├── telegram-auth-callback/  
    │   │   └── index.ts  
    │   └── mock-tournament-ender/  
    │       └── index.ts  
    └── migrations/