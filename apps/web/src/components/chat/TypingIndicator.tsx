/**
 * TypingIndicator Component
 * Shows animated dots when AI is typing
 */

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg max-w-fit">
      <span className="text-sm text-gray-600">IA está digitando</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot" />
      </div>
    </div>
  );
}

export default TypingIndicator;
