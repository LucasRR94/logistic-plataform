-- Create a new database
CREATE DATABASE LOGISTIC_COMPANY;

-- Switch to the newly created database
\c LOGISTIC_COMPANY;

/*
    Business 
*/
    /*
        Definition of types
    
    */
-- FUEL_TYPE present all types
CREATE TYPE FUEL_TYPE AS ENUM(
    'Hybrid - Gasoline/Electric',
    'Hybrid - Diesel/Electric',
    'Hybrid - Navy Diesel/Electric',
    'Hybrid - Navy Gasoline/Electric',
    'Hybrid - Navy Biodiesel/Electric',
    'Hybrid - Navy Ethanol/Electric',
    'Aviation Gasoline',
    'Jet Fuel',
    'Electric',
    'Diesel',
    'Biodiesel',
    'Natural Gas'
);

-- MEASURE_UNITY present all types
CREATE TYPE MEASURE_UNITY AS ENUM(
    'Kilowatt-hour - kWh',
    'Kilometers per liters - KML',
    'undefined'
);

-- reference a status order, that contain a description and 
CREATE TYPE STATUS_CODE_TRANSPORT AS ENUM(
    'active',    -- active is when the transport is already happen
    'inactive',  -- inactive it means that already finished
    'hold',      -- hold is the status were the service is pending 
    'cancelled', -- cancelled is the status when the client terminated with the contract or the service before the service start
    'planning',  -- on planning is a service that currently is beeing planned
    'incident',  -- an incident happened when the transport already started, and the transport have been terminated 
    'scheduled', -- an transportation have been scheduled for some day, and is waiting this day,
    'inspecting' -- the transportation is awainting for inspection of clients or regulators
    ); 


CREATE TYPE MODE_OF_TRANSPORTATION AS ENUM(
    'terrestrial',
    'river',
    'air',
    'multiple modes',
    'undefined'
);

CREATE TYPE MODE_STOPS AS ENUM(
    'one load, one dowload',
    'one load, multiple download',
    'multiple loads, multiple downloads',
    'undefined'
);

-- contain a generic description of a adress
CREATE TABLE IF NOT EXISTS ADDRESS(
    address_id BIGSERIAL PRIMARY KEY,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_date DATE, 
    update_date DATE
);
-- individual contain the description of all the individual description
CREATE TABLE IF NOT EXISTS INDIVIDUAL(
    individual_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    email VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    nationality VARCHAR(100),
    main_address BIGSERIAL REFERENCES ADDRESS(address_id),
    created_date DATE,
    update_date DATE
);
-- individual contain the description of all the individual company
CREATE TABLE COMPANY (
    company_id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    nationality VARCHAR(100),
    company_headquarters BIGSERIAL REFERENCES ADDRESS(address_id),
    UNIQUE (company_id, company_headquarters), -- Ensure each company has a unique headquarters
    created_date DATE,
    update_date DATE
);

-- contain the contact register, that can be company or a individual reference
CREATE TABLE IF NOT EXISTS CONTACT(
    contact_id BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(20), -- e.g., "Individual", "Company"
    individual_id BIGSERIAL REFERENCES INDIVIDUAL(individual_id),
    company_id BIGSERIAL REFERENCES COMPANY(company_id),
    address_id BIGSERIAL REFERENCES ADDRESS(address_id),
    created_date DATE,
    update_date DATE
);


-- contain payments, referecing the origin, and providing  history for all the invoices
CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id BIGSERIAL PRIMARY KEY,
    receiver BIGSERIAL REFERENCES CONTACT(contact_id),
    payer BIGSERIAL REFERENCES CONTACT(contact_id),
    reference VARCHAR(100),
    order_id VARCHAR(100),
    amount NUMERIC(10, 2),
    deadline DATE,
    received_date DATE,
    observation TEXT,
    created_date DATE, 
    update_date DATE
);

-- so this is necessary if the company address want to register a manager and submanager at the same address
CREATE TABLE COMPANY_ADDRESS (
    company_id BIGSERIAL REFERENCES COMPANY(company_id),
    address_id BIGSERIAL REFERENCES ADDRESS(address_id),
    PRIMARY KEY (company_id, address_id),
    FOREIGN KEY (company_id) REFERENCES COMPANY(company_id) ON DELETE CASCADE, -- Ensure referential integrity
    FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id) ON DELETE CASCADE, -- Ensure referential integrity
    created_date DATE,
    update_date DATE
);

-- so this is necessary if the company address want to register a individual of manager and submanager at the same address
CREATE TABLE INDIVIDUAL_ADDRESS (
    individual_id BIGSERIAL REFERENCES INDIVIDUAL(individual_id),
    address_id BIGSERIAL REFERENCES ADDRESS(address_id),
    PRIMARY KEY (individual_id, address_id),
    FOREIGN KEY (individual_id) REFERENCES INDIVIDUAL(individual_id) ON DELETE CASCADE, -- Ensure referential integrity
    FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id) ON DELETE CASCADE, -- Ensure referential integrity
    created_date DATE,
    update_date DATE
);

-- this is the more general services - description, and it includes many routes, with all stops ,
-- different many of transportations, and it have a started date, and a final date, for conclude
-- the total displacement of the load
CREATE TABLE SERVICE_DESCRIPTION(
    id BIGSERIAL PRIMARY KEY,     -- the id that represents the service description
    title VARCHAR(100),        -- title that represents the service description
    description_service text,  -- the text that represent the service description
    transportation_mode MODE_OF_TRANSPORTATION default 'undefined',
    stops MODE_STOPS default 'undefined',
    initial_date DATE,
    end_date DATE
);

-- all the ref_orders are individual
-- this table will contain all the references of services
-- and with some observations and link to the payment
CREATE TABLE REFERENCE_ORDER(
    id BIGSERIAL PRIMARY KEY,
    payment_order BIGSERIAL REFERENCES PAYMENT(payment_id),
    status_code STATUS_CODE_TRANSPORT default 'planning',
    observations TEXT,
    created_date DATE,
    update_date DATE,
    service_provided BIGSERIAL REFERENCES SERVICE_DESCRIPTION(id),
    service_type MODE_OF_TRANSPORTATION default 'undefined'
);


CREATE TABLE VEHICLE_MODEL(
    id BIGSERIAL PRIMARY KEY,
    model_name VARCHAR(100),
    color_description VARCHAR(30),
    payload_capacity INT,
    fuel FUEL_TYPE,
    consumption NUMERIC(4, 2),
    measure_unity_consumption MEASURE_UNITY default 'undefined',
    year_launch INT,
    manufactured VARCHAR(50),
    brand VARCHAR(50),
    truck_number_axles INT
);

CREATE TABLE VEHICLE_REF(
    id BIGSERIAL PRIMARY KEY,
    vehicle_identification VARCHAR(100),
    model BIGSERIAL REFERENCES VEHICLE_MODEL(id)
);

CREATE TABLE DISPLACEMENT(
    id BIGSERIAL PRIMARY KEY,
    main_service BIGSERIAL REFERENCES SERVICE_DESCRIPTION(id),
    initial_point DECIMAL(9, 6),
    initial_point_name VARCHAR(100),
    second_point DECIMAL(9, 6),
    second_point_name VARCHAR(100),
    vehicle_ref BIGSERIAL REFERENCES VEHICLE_REF(id),
    transportation_mode MODE_OF_TRANSPORTATION default 'undefined', 
    displacement_pick_up_date DATE,
    displacement_delivery_date DATE,
    created_date DATE, 
    update_date DATE
);



/*  ---------------------------------
    auth credentials roles, users
*/
CREATE TYPE ROLES_DB AS ENUM(
    'admin',
    'user',
    'guest'
);

CREATE TABLE USERS (
    id BIGSERIAL PRIMARY KEY,  
    email VARCHAR(100) UNIQUE,
    user_role ROLES_DB DEFAULT 'guest', 
    individual_id BIGSERIAL REFERENCES INDIVIDUAL(individual_id),
    pass_user VARCHAR(100),
    pass_salt VARCHAR(100)
);
/*
---------------------------------------
*/