/**
 * Nexus Ecosystem — Shared Navigation Registry
 * ---------------------------------------------------------------
 * Single source of truth for every navigable module in the app.
 *
 * Each module declares:
 *   folder  — physical folder name on disk (page lives at folder/code.html)
 *   label   — display name in sidebar, navbar title, breadcrumb
 *   icon    — Material Symbols Outlined ligature name
 *   shell   — 'app' (full sidebar+navbar) | 'public' (slim top bar)
 *   parent  — parent module id (drives breadcrumbs)
 *   group   — sidebar group id (drives sidebar placement)
 *   role    — informational badge for the sidebar
 */
(function (root) {
  'use strict';

  const modules = {
    /* ── PUBLIC FLOW ─────────────────────────────────────────────── */
    landing: {
      folder: 'platform_landing_page',
      label: 'Landing Page',
      icon: 'rocket_launch',
      shell: 'public',
      parent: null,
    },
    signIn: {
      folder: 'login_employee_ecosystem',
      label: 'Sign In',
      icon: 'login',
      shell: 'public',
      parent: 'landing',
    },
    createAccount: {
      folder: 'create_enterprise_account',
      label: 'Create Account',
      icon: 'person_add',
      shell: 'public',
      parent: 'signIn',
    },
    twoFactor: {
      folder: 'two_factor_authentication',
      label: 'Two-Factor Auth',
      icon: 'shield_lock',
      shell: 'public',
      parent: 'signIn',
    },

    /* ── HUB ─────────────────────────────────────────────────────── */
    welcome: {
      folder: 'nexus_enterprise',
      label: 'Welcome, Alex',
      icon: 'waving_hand',
      shell: 'app',
      parent: 'signIn',
      group: 'home',
    },

    /* ── PRIMARY DASHBOARDS ──────────────────────────────────────── */
    employeeDashboard: {
      folder: 'personal_employee_dashboard',
      label: 'Employee Dashboard',
      icon: 'space_dashboard',
      shell: 'app',
      parent: 'welcome',
      group: 'workspace',
      role: 'Employee',
    },
    hrDashboard: {
      folder: 'hr_administration_dashboard',
      label: 'HR Dashboard',
      icon: 'badge',
      shell: 'app',
      parent: 'welcome',
      group: 'workspace',
      role: 'HR',
    },
    execDashboard: {
      folder: 'executive_dashboard',
      label: 'Executive Dashboard',
      icon: 'trending_up',
      shell: 'app',
      parent: 'welcome',
      group: 'workspace',
      role: 'Executive',
    },
    adminDashboard: {
      folder: 'managerial_insights_dashboard',
      label: 'Admin Dashboard',
      icon: 'admin_panel_settings',
      shell: 'app',
      parent: 'welcome',
      group: 'workspace',
      role: 'Admin',
    },

    /* ── EMPLOYEE WORKSPACE ──────────────────────────────────────── */
    messages: {
      folder: 'enterprise_messaging_chat',
      label: 'Messages',
      icon: 'chat',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    communities: {
      folder: 'communities_groups_hub',
      label: 'Communities',
      icon: 'groups',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    companyFeed: {
      folder: 'company_news_feed',
      label: 'Company Feed',
      icon: 'newspaper',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    reels: {
      folder: 'social_news_feed_stories',
      label: 'Reels',
      icon: 'movie',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    performance: {
      folder: 'performance_review_center',
      label: 'Performance Goals',
      icon: 'flag',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    payroll: {
      folder: 'payroll_benefits',
      label: 'Payroll & Benefits',
      icon: 'payments',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },
    projects: {
      folder: 'project_kanban_board',
      label: 'Projects Board',
      icon: 'task_alt',
      shell: 'app',
      parent: 'employeeDashboard',
      group: 'employee',
    },

    /* ── PEOPLE / HR ─────────────────────────────────────────────── */
    recruitment: {
      folder: 'recruitment_pipeline_dashboard',
      label: 'Recruitment Hub',
      icon: 'group_add',
      shell: 'app',
      parent: 'hrDashboard',
      group: 'people',
    },
    approvals: {
      folder: 'employee_onboarding_workflow',
      label: 'Approvals & Workflows',
      icon: 'fact_check',
      shell: 'app',
      parent: 'hrDashboard',
      group: 'people',
    },
    employeeEcosystem: {
      folder: 'employee_social_profile',
      label: 'Employee Ecosystem',
      icon: 'hub',
      shell: 'app',
      parent: 'hrDashboard',
      group: 'people',
    },
    orgStructure: {
      folder: 'organizational_hierarchy_chart',
      label: 'Org Structure',
      icon: 'account_tree',
      shell: 'app',
      parent: 'hrDashboard',
      group: 'people',
    },

    /* ── INSIGHTS ────────────────────────────────────────────────── */
    aiAnalytics: {
      folder: 'ai_intelligence_hub',
      label: 'AI Analytics',
      icon: 'analytics',
      shell: 'app',
      parent: 'execDashboard',
      group: 'insights',
    },
  };

  /**
   * Sidebar layout — ordered groups & their items.
   * `home` is rendered at the top without a title.
   */
  const navGroups = [
    { id: 'home',      title: '',           items: ['welcome'] },
    { id: 'workspace', title: 'Workspaces', items: ['employeeDashboard', 'hrDashboard', 'execDashboard', 'adminDashboard'] },
    { id: 'employee',  title: 'My Work',    items: ['messages', 'communities', 'companyFeed', 'reels', 'performance', 'payroll', 'projects'] },
    { id: 'people',    title: 'People',     items: ['recruitment', 'approvals', 'employeeEcosystem', 'orgStructure'] },
    { id: 'insights',  title: 'Insights',   items: ['aiAnalytics'] },
  ];

  /**
   * Quick-link cards rendered inside each dashboard module via
   * `[data-quicklinks="<dashboardId>"]` containers.
   */
  const dashboardLinks = {
    employeeDashboard: ['messages', 'communities', 'companyFeed', 'reels', 'performance', 'payroll'],
    hrDashboard:       ['recruitment', 'approvals', 'employeeEcosystem', 'orgStructure'],
    execDashboard:     ['aiAnalytics', 'companyFeed', 'orgStructure'],
    adminDashboard:    ['aiAnalytics', 'employeeEcosystem', 'recruitment', 'approvals', 'orgStructure'],
  };

  /** Resolve the URL for a module from any page. */
  function urlFor(moduleId) {
    const m = modules[moduleId];
    if (!m) return '#';
    // All pages live one folder deep, so root is always '../'.
    return '../' + m.folder + '/code.html';
  }

  /** Walk the parent chain — returns ['landing', 'signIn', ..., currentId]. */
  function trail(moduleId) {
    const out = [];
    let id = moduleId;
    const seen = new Set();
    while (id && modules[id] && !seen.has(id)) {
      seen.add(id);
      out.unshift(id);
      id = modules[id].parent;
    }
    return out;
  }

  root.NEXUS_NAV = {
    modules,
    navGroups,
    dashboardLinks,
    urlFor,
    trail,
    brand: {
      name: 'Nexus Ecosystem',
      tagline: 'Enterprise Intelligence Platform',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEjI2OOfeZGjYBJRD58k-fogyVGJgGkmhuSgd8iCUJoa2AVB1MXgG5v6UvpS6tr5e_NE_69srAWP2nTJmuvcuQLqNocDl3mnq6T6Khx_nrXBbXMn9Yo2nV5vtp7rUzlmKdr2bnfML5Z58FZZIty2V21aJguJek7oknOmXIRD-VmT7pKGDJV4LOXjg_1deKieTd3g4W4cf-VieGBEgNPwAHRz-JrTR3PD5BYuAPs0mUpM7Y85ybpuByOcZ7lWDFhmeOQapDuoqGclQp',
      userName: 'Alex Morgan',
      userTitle: 'Senior Product Strategist',
    },
  };
})(window);
