-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(tbl text) RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = tbl
  ) INTO exists;
  RETURN exists;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(tbl text, col text) RETURNS boolean AS $$
DECLARE
  exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = tbl AND column_name = col
  ) INTO exists;
  RETURN exists;
END;
$$ LANGUAGE plpgsql;

-- Create Phone table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('phone') THEN
    CREATE TABLE Phone (
      phone_id SERIAL PRIMARY KEY,
      country_code INT NOT NULL DEFAULT 998,
      mobile_operator_code INT NOT NULL,
      phone_number INT NOT NULL
    );
  END IF;
END $$;

-- Create Passport table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('passport') THEN
    CREATE TABLE Passport (
      passport_id SERIAL PRIMARY KEY,
      series VARCHAR(9),
      number INT,
      issue_date TIMESTAMP,
      expiration_date TIMESTAMP
    );
  ELSE
    -- If the table already exists, alter the column
    ALTER TABLE Passport
    ALTER COLUMN series TYPE VARCHAR(9);
  END IF;
END $$;

-- Create user_role_enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'banker');
  END IF;
END $$;

-- Modify Users table to include role
DO $$ 
BEGIN
  IF NOT table_exists('users') THEN
    CREATE TABLE Users (
      user_id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone_id INT REFERENCES Phone(phone_id),
      passport_id INT REFERENCES Passport(passport_id),
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role user_role_enum NOT NULL DEFAULT 'user'
    );
  ELSE
    -- If the table already exists, add the role column if it doesn't exist
    IF NOT column_exists('users', 'role') THEN
      ALTER TABLE Users ADD COLUMN role user_role_enum NOT NULL DEFAULT 'user';
    END IF;
  END IF;
END $$;

-- Create gender_enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_enum') THEN
    CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary');
  END IF;
END $$;

-- Create Address table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('address') THEN
    CREATE TABLE Address (
      address_id SERIAL PRIMARY KEY,
      street_number INT,
      street_name VARCHAR(255),
      region VARCHAR(255),
      city VARCHAR(255),
      country VARCHAR(255) DEFAULT 'Uzbekistan',
      zip INT
    );
  END IF;
END $$;

-- Create BankAgreement table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('bankagreement') THEN
    CREATE TABLE BankAgreement (
      agreement_id SERIAL PRIMARY KEY,
      document JSONB,
      is_signed BOOLEAN
    );
  END IF;
END $$;

-- Create Entrepreneur table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('entrepreneur') THEN
    CREATE TABLE Entrepreneur (
      entrepreneur_id SERIAL PRIMARY KEY,
      gender gender_enum,
      dob TIMESTAMP NOT NULL,
      address_id INT NOT NULL REFERENCES Address(address_id),
      agreement_id INT REFERENCES BankAgreement(agreement_id),
      startup_id INT
    );
  END IF;
END $$;

-- Add entrepreneur_id column to Users table if it doesn't exist
DO $$
BEGIN
  IF NOT column_exists('users', 'entrepreneur_id') THEN
    ALTER TABLE Users ADD COLUMN entrepreneur_id INT REFERENCES Entrepreneur(entrepreneur_id);
  END IF;
END $$;

-- Create Contributor table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('contributor') THEN
    CREATE TABLE Contributor (
      contributor_id SERIAL PRIMARY KEY,
      gender gender_enum,
      dob TIMESTAMP NOT NULL,
      agreement_id INT REFERENCES BankAgreement(agreement_id)
    );
  END IF;
END $$;

-- Add contributor_id column to Users table if it doesn't exist
DO $$
BEGIN
  IF NOT column_exists('users', 'contributor_id') THEN
    ALTER TABLE Users ADD COLUMN contributor_id INT REFERENCES Contributor(contributor_id);
  END IF;
END $$;

-- Create startup_type_enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'startup_type_enum') THEN
    CREATE TYPE startup_type_enum AS ENUM ('charity', 'equity');
  END IF;
END $$;

-- Create startup_batch_enum type if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'startup_batch_enum') THEN
    CREATE TYPE startup_batch_enum AS ENUM ('close_to_the_goal', 'just_launched', 'finished', 'none');
  END IF;
END $$;

-- Create Category table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('category') THEN
    CREATE TABLE Category (
      category_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  END IF;
END $$;

-- Create Region table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('region') THEN
    CREATE TABLE Region (
      region_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  END IF;
END $$;

-- Create Startup table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('startup') THEN
    CREATE TABLE Startup (
      startup_id SERIAL PRIMARY KEY,
      title VARCHAR(30) NOT NULL,
      active_status BOOLEAN NOT NULL,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      description TEXT NOT NULL,
      video_link JSONB NOT NULL,
      donated_amount DECIMAL,
      number_of_contributors INT,
      rating INT,
      type startup_type_enum,
      batch startup_batch_enum,
      category_id INT NOT NULL REFERENCES Category(category_id),
      region_id INT NOT NULL REFERENCES Region(region_id)
    );
  END IF;
END $$;

-- Create Contribution table if it doesn't exist
DO $$ 
BEGIN
  IF NOT table_exists('contribution') THEN
    CREATE TABLE Contribution (
      contribution_id SERIAL PRIMARY KEY,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      amount DECIMAL NOT NULL,
      startup_id INT NOT NULL REFERENCES Startup(startup_id),
      contributor_id INT NOT NULL REFERENCES Contributor(contributor_id)
    );
  END IF;
END $$;

-- Add constraint to Entrepreneur table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_startup' AND table_name = 'entrepreneur'
  ) THEN
    ALTER TABLE Entrepreneur ADD CONSTRAINT fk_startup
    FOREIGN KEY (startup_id) REFERENCES Startup(startup_id);
  END IF;
END $$;

-- Remove passport_id from Entrepreneur table if it exists
ALTER TABLE Entrepreneur DROP COLUMN IF EXISTS passport_id;

-- Remove passport_id from Contributor table if it exists
ALTER TABLE Contributor DROP COLUMN IF EXISTS passport_id;

-- Add unique constraints if they don't exist
DO $$
BEGIN
    -- Check if the constraint doesn't exist before adding it to Users table
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_user_passport' AND conrelid = 'users'::regclass
    ) THEN
        ALTER TABLE Users ADD CONSTRAINT uq_user_passport UNIQUE (passport_id);
    END IF;

    -- Check if the constraint doesn't exist before adding it to Passport table
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_passport_user' AND conrelid = 'passport'::regclass
    ) THEN
        ALTER TABLE Passport ADD CONSTRAINT uq_passport_user UNIQUE (passport_id);
    END IF;
END$$;

-- Create index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'idx_users_passport_id'
        AND n.nspname = current_schema()
    ) THEN
        CREATE INDEX idx_users_passport_id ON Users(passport_id);
    END IF;
END$$;