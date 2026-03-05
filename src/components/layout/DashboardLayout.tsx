import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

interface Props {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return <MainLayout>{children || <Outlet />}</MainLayout>;
}
