// frontend/src/App.jsx

import React, { useState } from 'react';
import { tournaments } from '@/demo/tournaments/fixtures';
import { UpcomingTournamentsModal } from '@/demo/tournaments/UpcomingTournamentsModal';
import { BaseLayout } from '@/app/layout/BaseLayout';
import { Home } from '@/app/pages/Home';

export default function App() {
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const openTournaments = () => setTournamentsOpen(true);
  const closeTournaments = () => setTournamentsOpen(false);

  return (
    <BaseLayout onOpenTournaments={openTournaments}>
      <Home onOpenTournaments={openTournaments} />

      {tournamentsOpen && (
        <UpcomingTournamentsModal
          items={tournaments}
          onClose={closeTournaments}
        />
      )}
    </BaseLayout>
  );
}

