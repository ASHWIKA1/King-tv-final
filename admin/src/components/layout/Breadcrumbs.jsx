import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useI18n();

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Helper to translate route segments to localized strings
  const getSegmentName = (segment, isLast) => {
    // If it's a numeric ID or looks like a UUID/mongoId, mask it as "Edit" or details
    if (/^\d+$/.test(segment) || segment.length > 20) {
      return isLast ? 'Detail' : 'Edit';
    }
    
    const translationMap = {
      dashboard: t('dashboard'),
      admin: t('management') || 'Management',
      news: t('newsManagement') || 'News',
      create: t('createArticle') || 'Create',
      edit: t('edit') || 'Edit',
      users: t('userAccounts') || 'Users',
      settings: t('settings') || 'Settings',
      profanity: t('profanity') || 'Profanity',
      analytics: t('analytics') || 'Analytics',
      taxonomy: t('taxonomy') || 'Taxonomy',
      push: t('push') || 'Push Notifications',
      layout: t('layout') || 'Home Layout',
      breaking: t('breakingNews') || 'Breaking News',
      'ugc-queue': t('ugcQueue') || 'UGC Queue',
      'editorial-calendar': t('editorialCalendar') || 'Editorial Calendar',
      ads: t('adManagement') || 'Ads',
      surveys: t('surveys') || 'Surveys',
      roles: t('rolesPermissions') || 'Roles',
      'audit-logs': t('audit') || 'Audit Logs',
      content: t('contentQueue') || 'Content',
      journalist: t('workspace') || 'Workspace',
      posts: t('myPosts') || 'My Posts',
      profile: t('myProfile') || 'Profile'
    };

    return translationMap[segment.toLowerCase()] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (location.pathname === '/' || location.pathname === '/admin/dashboard' || location.pathname === '/dashboard') {
    return null; // Don't show breadcrumbs on the main landing dashboard
  }

  return (
    <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
      <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
        <Home size={14} style={{ marginRight: '0.2rem' }} />
        <span>{t('dashboard')}</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = getSegmentName(value, last);

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} style={{ opacity: 0.5 }} />
            {last ? (
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{label}</span>
            ) : (
              <Link to={to} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
