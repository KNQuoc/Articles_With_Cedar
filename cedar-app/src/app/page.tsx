'use client';

import React from 'react';
import { BookLibrary } from '@/components/books';
import { FloatingCedarChat } from '@/components/cedar-os/chatComponents/FloatingCedarChat';
import { SidePanelCedarChat } from '@/components/cedar-os/chatComponents/SidePanelCedarChat';
import { CedarCaptionChat } from '@/components/cedar-os/chatComponents/CedarCaptionChat';

type ChatMode = 'floating' | 'sidepanel' | 'caption';

export default function BookLibraryPage() {
  const [chatMode, setChatMode] = React.useState<ChatMode>('caption');

  const renderContent = () => (
    <div className="relative min-h-screen w-full">
      <BookLibrary />

      {chatMode === 'caption' && <CedarCaptionChat />}

      {chatMode === 'floating' && (
        <FloatingCedarChat
          side="right"
          title="📚 Book Library Assistant"
          collapsedLabel="💬 Need help with your books?"
        />
      )}
    </div>
  );

  if (chatMode === 'sidepanel') {
    return (
      <SidePanelCedarChat
        side="right"
        title="📚 Book Library Assistant"
        collapsedLabel="💬 Need help with your books?"
        showCollapsedButton={true}
      >
        {renderContent()}
      </SidePanelCedarChat>
    );
  }

  return renderContent();
}
