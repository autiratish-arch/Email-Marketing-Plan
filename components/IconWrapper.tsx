import React from 'react';
import { EMAIL_ICONS } from '../constants';

interface IconWrapperProps {
  type: string;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ type, className }) => {
  const IconComponent = EMAIL_ICONS[type] || EMAIL_ICONS['intro'];
  return <IconComponent className={className} />;
};
