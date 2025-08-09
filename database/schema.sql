-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'guest');
CREATE TYPE club_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE membership_status AS ENUM ('pending', 'active', 'suspended', 'expired');

-- Create clubs table
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    max_members INTEGER DEFAULT 100,
    status club_status DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(150),
    avatar_url TEXT,
    phone VARCHAR(50),
    date_of_birth DATE,
    skill_level INTEGER DEFAULT 1 CHECK (skill_level >= 1 AND skill_level <= 10),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create club memberships table
CREATE TABLE club_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    status membership_status DEFAULT 'pending',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    invited_by UUID REFERENCES auth.users(id),
    invitation_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role permissions mapping
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, permission_id)
);

-- Create audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
-- Club management
('club:create', 'Create new clubs', 'club', 'create'),
('club:read', 'View club information', 'club', 'read'),
('club:update', 'Update club settings', 'club', 'update'),
('club:delete', 'Delete clubs', 'club', 'delete'),
('club:manage_members', 'Manage club members', 'club', 'manage_members'),

-- Session management
('session:create', 'Create sessions', 'session', 'create'),
('session:read', 'View sessions', 'session', 'read'),
('session:update', 'Update sessions', 'session', 'update'),
('session:delete', 'Delete sessions', 'session', 'delete'),
('session:join', 'Join sessions', 'session', 'join'),

-- User management
('user:read', 'View user profiles', 'user', 'read'),
('user:update', 'Update user profiles', 'user', 'update'),
('user:delete', 'Delete users', 'user', 'delete'),
('user:manage_roles', 'Manage user roles', 'user', 'manage_roles'),

-- Game management
('game:create', 'Create games', 'game', 'create'),
('game:read', 'View games', 'game', 'read'),
('game:update', 'Update games', 'game', 'update'),
('game:delete', 'Delete games', 'game', 'delete'),

-- Analytics
('analytics:read', 'View analytics', 'analytics', 'read'),
('analytics:export', 'Export analytics', 'analytics', 'export');

-- Assign permissions to roles
INSERT INTO role_permissions (role, permission_id) 
SELECT 'owner', id FROM permissions;

INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', id FROM permissions 
WHERE name IN (
    'club:read', 'club:update', 'club:manage_members',
    'session:create', 'session:read', 'session:update', 'session:delete', 'session:join',
    'user:read', 'user:update',
    'game:create', 'game:read', 'game:update', 'game:delete',
    'analytics:read', 'analytics:export'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'member', id FROM permissions 
WHERE name IN (
    'club:read',
    'session:read', 'session:join',
    'user:read', 'user:update',
    'game:create', 'game:read', 'game:update',
    'analytics:read'
);

INSERT INTO role_permissions (role, permission_id) 
SELECT 'guest', id FROM permissions 
WHERE name IN (
    'club:read',
    'session:read'
);

-- Create indexes for better performance
CREATE INDEX idx_club_memberships_club_id ON club_memberships(club_id);
CREATE INDEX idx_club_memberships_user_id ON club_memberships(user_id);
CREATE INDEX idx_club_memberships_role ON club_memberships(role);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_club_memberships_updated_at BEFORE UPDATE ON club_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
