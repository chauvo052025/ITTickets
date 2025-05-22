/*
  # Initial Schema Setup for School IT Support System

  1. New Tables
    - `users`: Staff and teachers accounts
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text)
      - `department` (text)
      - `created_at` (timestamp)
      
    - `tickets`: Support requests
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `priority` (text)
      - `created_by` (uuid, references users)
      - `assigned_to` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `comments`: Ticket updates and responses
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references tickets)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `is_internal` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('TEACHER', 'IT_STAFF', 'ADMIN')),
  department text,
  created_at timestamptz DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  priority text NOT NULL CHECK (priority IN ('LOW', 'NORMAL', 'HIGH')),
  created_by uuid REFERENCES users NOT NULL,
  assigned_to uuid REFERENCES users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets NOT NULL,
  user_id uuid REFERENCES users NOT NULL,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Tickets policies
CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view own tickets or assigned tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('IT_STAFF', 'ADMIN')
    )
  );

-- Comments policies
CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('IT_STAFF', 'ADMIN')
        )
      )
    )
  );

CREATE POLICY "Users can view comments on accessible tickets"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_id
      AND (
        tickets.created_by = auth.uid() OR
        tickets.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('IT_STAFF', 'ADMIN')
        )
      )
    )
  );