import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Content } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: Content;
  compact?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, compact = false }) => {
  const getStatusBadge = () => {
    switch (content.status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const updatedTimeAgo = formatDistanceToNow(new Date(content.updatedAt), { addSuffix: true });
  
  if (compact) {
    return (
      <Link 
        to={`/editor/${content.id}`}
        className="block p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow group"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {content.title}
          </h3>
          {getStatusBadge()}
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" /> Updated {updatedTimeAgo}
        </div>
      </Link>
    );
  }

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-800 line-clamp-1">{content.title}</h3>
          {getStatusBadge()}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {content.content.replace(/#|##|\*\*|__/g, '').substring(0, 120)}...
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            {content.status === 'published' ? (
              <>
                <Calendar className="w-3 h-3 mr-1" />
                <span>Published {formatDistanceToNow(new Date(content.publishedAt || ''), { addSuffix: true })}</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" />
                <span>Updated {updatedTimeAgo}</span>
              </>
            )}
          </div>
          <Link 
            to={`/editor/${content.id}`}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;