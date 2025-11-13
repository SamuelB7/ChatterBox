/**
 * NewConversationButton Component
 * Button to create a new conversation
 */

import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NewConversationButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function NewConversationButton({ onClick, isLoading = false }: NewConversationButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      size="md"
      fullWidth
      isLoading={isLoading}
    >
      <Plus className="w-5 h-5 mr-2" />
      Nova Conversa
    </Button>
  );
}

export default NewConversationButton;
