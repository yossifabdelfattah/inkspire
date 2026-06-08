import type { ReactNode } from 'react';
import * as S from './AdminLayout.styled';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <S.Page>
      <S.Layout>
        <S.Sidebar aria-label="Admin navigation">
          <S.SidebarLink to="/admin" end>
            Overview
          </S.SidebarLink>
          <S.SidebarLink to="/admin/books">Manage Books</S.SidebarLink>
          <S.SidebarLink to="/admin/requests">Book Requests</S.SidebarLink>
          <S.SidebarLink to="/admin/analytics">Analytics</S.SidebarLink>
        </S.Sidebar>

        <S.Content>{children}</S.Content>
      </S.Layout>
    </S.Page>
  );
}

export default AdminLayout;
