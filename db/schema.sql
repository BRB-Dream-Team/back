CREATE TABLE Phone (
  phone_id SERIAL PRIMARY KEY,
  country_code INT NOT NULL DEFAULT 998,
  mobile_operator_code INT NOT NULL,
  phone_number INT NOT NULL
);

CREATE TABLE User (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_id INT,
  email VARCHAR(255) NOT NULL UNIQUE,
  entrepreneur_id INT,
  contributor_id INT,
  FOREIGN KEY (phone_id) REFERENCES Phone(phone_id)
);

CREATE TYPE gender_enum AS ENUM ('male', 'female', 'non_binary');

CREATE TABLE Address (
  address_id SERIAL PRIMARY KEY,
  street_number INT,
  street_name VARCHAR(255),
  region VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255) DEFAULT 'Uzbekistan',
  zip INT
);

CREATE TABLE Passport (
  passport_id SERIAL PRIMARY KEY,
  series VARCHAR(2),
  number INT,
  issue_date TIMESTAMP,
  expiration_date TIMESTAMP
);

CREATE TABLE BankAgreement (
  agreement_id SERIAL PRIMARY KEY,
  document JSONB,
  is_signed BOOLEAN
);

CREATE TABLE Entrepreneur (
  entrepreneur_id SERIAL PRIMARY KEY,
  gender gender_enum,
  dob TIMESTAMP NOT NULL,
  passport_id INT NOT NULL REFERENCES Passport(passport_id),
  address_id INT NOT NULL REFERENCES Address(address_id),
  agreement_id INT REFERENCES BankAgreement(agreement_id),
  startup_id INT
);

ALTER TABLE "User" ADD COLUMN entrepreneur_id INT REFERENCES Entrepreneur(entrepreneur_id);

CREATE TABLE Contributor (
  contributor_id SERIAL PRIMARY KEY,
  gender gender_enum,
  dob TIMESTAMP NOT NULL,
  passport_id INT NOT NULL REFERENCES Passport(passport_id),
  agreement_id INT REFERENCES BankAgreement(agreement_id)
);

ALTER TABLE "User" ADD COLUMN contributor_id INT REFERENCES Contributor(contributor_id);

CREATE TYPE startup_type_enum AS ENUM ('charity', 'equity');
CREATE TYPE startup_batch_enum AS ENUM ('close_to_the_goal', 'just_launched', 'finished', 'none');

CREATE TABLE Category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE Region (
  region_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

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

CREATE TABLE Contribution (
  contribution_id SERIAL PRIMARY KEY,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  amount DECIMAL NOT NULL,
  startup_id INT NOT NULL REFERENCES Startup(startup_id),
  contributor_id INT NOT NULL REFERENCES Contributor(contributor_id)
);

ALTER TABLE Entrepreneur ADD CONSTRAINT fk_startup
FOREIGN KEY (startup_id) REFERENCES Startup(startup_id);