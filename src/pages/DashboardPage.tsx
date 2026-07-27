import React from 'react';
import { DashboardView } from '../components/views/DashboardView';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return <DashboardView onNavigate={onNavigate} />;
};

export default DashboardPage;
