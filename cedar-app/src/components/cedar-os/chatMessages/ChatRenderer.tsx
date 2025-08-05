import { useCedarStore, useStyling, Message, TickerMessage } from 'cedar-os';
import { Ticker } from 'motion-plus-react';
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import DialogueOptions from '@/components/cedar-os/chatMessages/DialogueOptions';
import MultipleChoice from '@/components/cedar-os/chatMessages/MultipleChoice';
import TodoList from '@/components/cedar-os/chatMessages/TodoList';
import Flat3dContainer from '@/components/cedar-os/containers/Flat3dContainer';

interface ChatRendererProps {
  message: Message;
}

export const ChatRenderer: React.FC<ChatRendererProps> = ({ message }) => {
  const { styling } = useStyling();
  const getMessageRenderer = useCedarStore((state) => state.getMessageRenderer);
  const isDark = styling.darkMode;

  // Check if there's a registered renderer for this message type
  const customRenderer = getMessageRenderer(message.type);
  if (customRenderer) {
    // Use the custom renderer
    return <>{customRenderer(message)}</>;
  }

  // Gradient mask for ticker edges
  const mask = 'linear-gradient(to right, transparent 5%, black 15%, black 85%, transparent 95%)';

  // Custom markdown renderers to ensure code blocks wrap
  const markdownComponents = {
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        {...props}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowX: 'auto',
          margin: 0,
        }}
      />
    ),
    code: ({ className, children, ...rest }) => {
      const common = {
        className,
        ...rest,
      } as React.HTMLAttributes<HTMLElement>;
      return (
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            margin: 0,
            fontSize: '0.75rem',
          }}
        >
          <code {...common}>{children}</code>
        </pre>
      );
    },
  } as Components;
  // Get common message styling
  const getMessageStyles = (role: string) => {
    const commonClasses =
      'prose prose-sm inline-block rounded-xl py-2 relative text-sm w-fit [&>*+*]:mt-3 [&>ol>li+li]:mt-2 [&>ul>li+li]:mt-2 [&>ol>li>p]:mb-1 [&>ul>li>p]:mb-1';
    const roleClasses =
      role === 'bot' || role === 'assistant'
        ? `font-serif ${isDark ? 'text-gray-100' : 'text-[#141413]'}`
        : 'text-[white] px-3';

    const style =
      role === 'bot' || role === 'assistant'
        ? {
            fontSize: '0.95rem',
            lineHeight: '1.5em',
          }
        : {
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
          };

    return {
      className: `${commonClasses} ${roleClasses}`,
      style,
    };
  };

  // Render different message types based on the message.type
  switch (message.type) {
    case 'dialogue_options':
      return (
        <div className="w-full">
          <div
            {...getMessageStyles(message.role)}
            className={`${getMessageStyles(message.role).className} w-full`}
          >
            <DialogueOptions message={message} />
          </div>
        </div>
      );

    case 'multiple_choice':
      return (
        <div className="w-full">
          <div
            {...getMessageStyles(message.role)}
            className={`${getMessageStyles(message.role).className} w-full`}
          >
            <MultipleChoice message={message} />
          </div>
        </div>
      );

    case 'todolist':
      const messageStyles = getMessageStyles(message.role);
      return (
        <div className="w-full">
          <div {...messageStyles.style} className={`${messageStyles.className} w-full`}>
            <TodoList message={message} />
          </div>
        </div>
      );

    case 'ticker': {
      const buttons = (message as TickerMessage).buttons;
      const items = buttons.map((button, bidx) => (
        <Flat3dContainer
          key={bidx}
          whileHover={{ scale: 1.05 }}
          className="w-48 my-3 flex flex-col items-center justify-start p-4"
          // Apply custom background colour if provided
          style={
            button.colour ? { backgroundColor: button.colour, willChange: 'transform' } : undefined
          }
        >
          {/* Render icon above title at larger size */}
          {button.icon && <div className="mb-2 text-2xl">{button.icon}</div>}
          <p className="text-sm font-medium text-center truncate">{button.title}</p>
          <p className="mt-1 text-center text-xs">{button.description}</p>
        </Flat3dContainer>
      ));
      return (
        <div className="w-full">
          <div className="mb-2">
            <Ticker hoverFactor={0} items={items} style={{ maskImage: mask }} />
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="max-w-[100%]">
          <div {...getMessageStyles(message.role)}>
            <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
          </div>
        </div>
      );
  }
};

export default ChatRenderer;
