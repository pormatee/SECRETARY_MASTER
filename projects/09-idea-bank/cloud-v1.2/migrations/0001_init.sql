CREATE TABLE IF NOT EXISTS idea_bank (
  id TEXT PRIMARY KEY CHECK(id = 'primary'),
  revision INTEGER NOT NULL CHECK(revision >= 1),
  doc TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS idea_history (
  revision INTEGER PRIMARY KEY,
  doc TEXT NOT NULL,
  changed_at TEXT NOT NULL
);
