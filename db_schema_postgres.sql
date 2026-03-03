-- PostgreSQL Schema for LGU Legislative Portal

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Regular', 'Special', 'Public Hearing')),
    status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, Live, Ended, Archived
    description TEXT,
    video_url VARCHAR(255),
    streaming_platform VARCHAR(50), -- YouTube, Facebook, RTMP
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ORDINANCES & RESOLUTIONS
CREATE TABLE legislations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legislation_type VARCHAR(20) CHECK (legislation_type IN ('Ordinance', 'Resolution')),
    number VARCHAR(50) NOT NULL, -- e.g., "Ord. No. 2024-001"
    title TEXT NOT NULL,
    description TEXT,
    author_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'Proposed', -- Proposed, First Reading, Committee, Second Reading, Approved, Vetoed
    date_approved DATE,
    file_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- COMMENTS
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legislation_id UUID REFERENCES legislations(id),
    session_id UUID REFERENCES sessions(id),
    user_name VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE, -- OTP verification
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_legislations_type ON legislations(legislation_type);
CREATE INDEX idx_legislations_status ON legislations(status);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_comments_status ON comments(status);
