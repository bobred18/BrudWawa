CREATE EXTENSION IF NOT EXISTS postgis;

-- USERS
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REPORTS
CREATE TYPE report_status AS ENUM ('pending', 'approved', 'rejected', 'resolved');

CREATE TABLE reports (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    category        VARCHAR(100) NOT NULL,
    threat_level    SMALLINT NOT NULL CHECK (threat_level BETWEEN 1 AND 5),
    suggested_service VARCHAR(100),
    status          report_status NOT NULL DEFAULT 'pending',
    image_key       VARCHAR(500),
    location        GEOMETRY(Point, 4326) NOT NULL,
    district        VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX reports_location_idx ON reports USING GIST (location);
CREATE INDEX reports_status_idx ON reports (status);
CREATE INDEX reports_category_idx ON reports (category);

-- COMMENTS
CREATE TABLE comments (
    id          SERIAL PRIMARY KEY,
    report_id   INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX comments_report_idx ON comments (report_id);

-- VOTES
CREATE TABLE votes (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_id   INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    value       SMALLINT NOT NULL CHECK (value IN (1, -1)),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, report_id)
);

CREATE INDEX votes_report_idx ON votes (report_id);
