import React, { useCallback } from 'react';
import { useCedarStore } from 'cedar-os';
import { FloatingContainer } from '@/components/cedar-os/structural/FloatingContainer';
import { ChatInput } from '@/components/cedar-os/chatInput/ChatInput';
import Container3D from '@/components/cedar-os/containers/Container3D';
import Container3DButton from '@/components/cedar-os/containers/Container3DButton';
import CaptionMessages from '@/components/cedar-os/chatMessages/CaptionMessages';
import { KeyboardShortcut } from '@/components/cedar-os/ui/KeyboardShortcut';
import { Bug, CheckCircle, History, Package, Settings, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CedarCaptionChatProps {
  dimensions?: {
    width?: number;
    maxWidth?: number;
  };
  className?: string;
  showThinking?: boolean;
  stream?: boolean; // Whether to use streaming for responses
}

export const CedarCaptionChat: React.FC<CedarCaptionChatProps> = ({
  dimensions,
  className = '',
  showThinking = true,
  stream = true,
}) => {
  const [isHidden, setIsHidden] = React.useState(false);
  // Check if there are any nodes with diffs
  const nodesState = useCedarStore((state) => state.registeredStates.nodes);
  const hasDiffs = React.useMemo(() => {
    if (!nodesState?.value || !Array.isArray(nodesState.value)) return false;
    return nodesState.value.some((node: { data?: { diff?: string } }) => node.data?.diff);
  }, [nodesState]);

  const handleAddFeature = useCallback(() => {
    const executeCustomSetter = useCedarStore.getState().executeCustomSetter;
    const newFeature = {
      id: uuidv4(),
      type: 'featureNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: 'New Feature',
        description: 'Describe your new feature here',
        upvotes: 0,
        comments: [],
        status: 'planned' as const,
        nodeType: 'feature' as const,
        diff: 'added' as const,
      },
    };
    executeCustomSetter('nodes', 'addNode', newFeature);
  }, []);

  const handleAddIssue = useCallback(() => {
    const executeCustomSetter = useCedarStore.getState().executeCustomSetter;
    const newIssue = {
      id: uuidv4(),
      type: 'featureNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        title: 'New Bug',
        description: 'Describe the bug here',
        upvotes: 0,
        comments: [],
        status: 'backlog' as const,
        nodeType: 'bug' as const,
        diff: 'added' as const,
      },
    };
    executeCustomSetter('nodes', 'addNode', newIssue);
  }, []);

  const handleAcceptAllDiffs = useCallback(() => {
    const executeCustomSetter = useCedarStore.getState().executeCustomSetter;
    executeCustomSetter('nodes', 'acceptAllDiffs');
  }, []);

  const handleRejectAllDiffs = useCallback(() => {
    const executeCustomSetter = useCedarStore.getState().executeCustomSetter;
    executeCustomSetter('nodes', 'rejectAllDiffs');
  }, []);

  const toggleChat = useCallback(() => {
    setIsHidden(prev => !prev);
  }, []);

  return (
    <>
      {/* Hide/Show Toggle Button - always visible */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Container3DButton
          id="toggle-chat-btn"
          childClassName="p-2"
          onClick={toggleChat}
          className="bg-gray-800/80 backdrop-blur-md border border-white/20"
        >
          <span className="flex items-center gap-2 text-white">
            {isHidden ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isHidden ? 'Show Chat' : 'Hide Chat'}
            </span>
          </span>
        </Container3DButton>
      </div>

      {/* Main Chat Container - conditionally rendered */}
      {!isHidden && (
        <FloatingContainer
          isActive={true}
          position="bottom-center"
          dimensions={dimensions}
          resizable={false}
          className={`cedar-caption-container ${className}`}
        >
      <div className="text-sm">
        {/* Action buttons row */}
        <div className="flex justify-end items-center mb-2">
          <div className="flex space-x-2">
            {hasDiffs && (
              <>
                <Container3DButton
                  id="accept-all-diffs-btn"
                  childClassName="p-1.5"
                  onClick={handleAcceptAllDiffs}
                >
                  <span className="flex items-center gap-1">
                    <KeyboardShortcut shortcut="⇧ Enter" className="ml-1 text-xs" />
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Accept All
                  </span>
                </Container3DButton>
                <Container3DButton
                  id="reject-all-diffs-btn"
                  childClassName="p-1.5"
                  onClick={handleRejectAllDiffs}
                >
                  <span className="flex items-center gap-1">
                    <KeyboardShortcut shortcut="⇧ Del" className="ml-1 text-xs" />
                    <XCircle className="w-4 h-4 text-red-600" />
                    Reject All
                  </span>
                </Container3DButton>
              </>
            )}
            <Container3DButton id="history-btn" childClassName="p-1.5">
              <span className="flex items-center gap-1">
                <History className="w-4 h-4" />
              </span>
            </Container3DButton>
            <Container3DButton id="settings-btn" childClassName="p-1.5">
              <span className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
              </span>
            </Container3DButton>
          </div>
        </div>

        <Container3D className="p-2">
          <div className="w-full pb-3">
            <CaptionMessages showThinking={showThinking} />
          </div>

          <ChatInput className="bg-transparent dark:bg-transparent p-0" stream={stream} />
        </Container3D>
      </div>
        </FloatingContainer>
      )}
    </>
  );
};
