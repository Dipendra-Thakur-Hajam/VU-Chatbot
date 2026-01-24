import React from 'react';
import { FileText, HelpCircle, BookOpen, Calendar } from 'lucide-react';
import { Source } from '@/services/chatService';

interface SourceCardProps {
  source: Source;
}

const getTypeIcon = (type: Source['type']) => {
  switch (type) {
    case 'policy':
      return FileText;
    case 'faq':
      return HelpCircle;
    case 'course':
      return BookOpen;
    case 'deadline':
      return Calendar;
    default:
      return FileText;
  }
};

const getTypeColor = (type: Source['type']) => {
  switch (type) {
    case 'policy':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'faq':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'course':
      return 'bg-success/10 text-success border-success/20';
    case 'deadline':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const Icon = getTypeIcon(source.type);
  const colorClass = getTypeColor(source.type);

  return (
    <div className="group p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClass} border`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
            {source.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {source.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${colorClass}`}>
              {source.type}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {Math.round(source.relevance * 100)}% relevant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCard;
