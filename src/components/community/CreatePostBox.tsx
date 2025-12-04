import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CreatePostBoxProps {
  onClick: () => void;
  userAvatar?: string;
  userName?: string;
}

export function CreatePostBox({ onClick, userAvatar, userName = 'User' }: CreatePostBoxProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-500 hover:bg-gray-200 transition-colors">
          Bạn đang nghĩ gì?
        </div>
        <button className="w-10 h-10 rounded-full bg-[#1AB1F6] flex items-center justify-center hover:bg-[#1599d6] transition-colors flex-shrink-0">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
