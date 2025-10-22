-- Step 1: Create a database (only run once)
CREATE DATABASE busdb;

-- Step 2: Connect to database
\c busdb;

-- Step 3: Create a table for bus data
CREATE TABLE bus_data (
    id SERIAL PRIMARY KEY,       -- auto-increment id
    bus_id INT NOT NULL,         -- bus number/id
    route VARCHAR(50),           -- route name/number
    latitude DECIMAL(9,6),       -- latitude coordinate
    longitude DECIMAL(9,6),      -- longitude coordinate
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert some sample records
INSERT INTO bus_data (bus_id, route, latitude, longitude)
VALUES
(101, 'A1', 26.4499, 80.3319),
(102, 'B2', 26.4670, 80.3500),
(103, 'C3', 26.5000, 80.3600);

-- Step 5: Query data
SELECT * FROM bus_data;

-- Step 6: Example filter (all buses on route A1)
SELECT * FROM bus_data WHERE route = 'A1';
