# Badminton Club & Games Management PWA — Project Plan

## Task Checklist

- [x] Set up a new Next.js project with TypeScript and PWA support, and initialize Git repository.
- [x] Integrate Supabase for authentication (Google OAuth and email/password), including account merge logic and forgot-password flow.
- [x] Design and implement user roles (Owner, Admin, Member, Guest) and permissions system.
- [ ] Implement club management features: create club, settings, status toggle, membership workflow, backup/restore.
- [ ] Build session and attendance management: session types, court override, check-in, rest/pause, tie-breakers.
- [ ] Develop matchmaking engine for singles and doubles, including team/opponent pairing and algorithm tracking.
- [ ] Implement ratings and player progression (Elo, K-factor, class scale, promotion logic).
- [ ] Create game lifecycle management: create, score entry, undo, conflict resolution, Elo update.
- [ ] Add notifications (email for session reminders, score edits, membership approval) and prepare hooks for push/SMS.
- [ ] Develop analytics and reporting dashboards with filters, CSV export, and real-time updates via WebSockets.
- [ ] Implement offline-first architecture: local SQLite (IndexedDB), sync logic, conflict resolution, real-time layer.
- [ ] Handle guest and minor logic: guest limits, auto-delete, parental consent for photo uploads.
- [ ] Ensure GDPR compliance: PII encryption, right to be forgotten, audit logs, configurable log retention.
- [ ] Document architecture, setup, and usage in README; plan for modular future features (payments, tournaments, push notifications).

## 🎯 **Current Status:**
- **Live URL**: https://badminton-6z7ygksl7-amit-sanghvis-projects.vercel.app
- **Authentication**: ✅ Google OAuth + Email/Password working
- **Database**: ✅ Supabase configured and connected
- **Deployment**: ✅ Vercel production deployment successful
- **User Roles**: ✅ Owner, Admin, Member, Guest roles implemented
- **Permissions**: ✅ Granular permission system with role-based access control
- **Database Schema**: ✅ All tables created and ready for use

## 📁 **Files Created:**
- `src/types/database.ts` - Database types and interfaces
- `src/lib/roles.ts` - Role and permission utilities
- `src/lib/database.ts` - Database operations
- `src/hooks/usePermissions.ts` - Permission checking hook
- `src/components/RoleBadge.tsx` - Role display component
- `src/components/PermissionGuard.tsx` - Permission-based rendering
- `src/contexts/AuthContext.tsx` - Updated with user profiles
- `database/schema.sql` - Database schema for Supabase
