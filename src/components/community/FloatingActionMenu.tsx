import { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingActionMenuProps {
  onCreatePost: () => void;
  onOpenHistory: () => void;
}

export function FloatingActionMenu({
  onCreatePost,
  onOpenHistory,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {/* History Button - Always visible as single action */}
        <motion.button
          onClick={onOpenHistory}
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Lịch sử
          </span>
          <div className="w-14 h-14 rounded-full bg-[#1AB1F6] flex items-center justify-center shadow-lg hover:bg-[#1599d6] transition-colors">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
