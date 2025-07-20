# Badminton Club & Games Management PWA — Project Plan

## Task Checklist

- [ ] Set up a new Next.js project with TypeScript and PWA support, and initialize Git repository.
- [ ] Integrate Supabase for authentication (Google OAuth and email/password), including account merge logic and forgot-password flow.
- [ ] Design and implement user roles (Owner, Admin, Member, Guest) and permissions system.
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