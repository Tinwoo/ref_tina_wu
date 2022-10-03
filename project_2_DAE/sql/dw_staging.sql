-- product staging --
CREATE TABLE staging_product_sales(
    id SERIAL primary key,
    type VARCHAR(255),
    size DECIMAL(6,3),
    unit_price DECIMAL(8,2),
    quantity INTEGER,
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER
);


CREATE TABLE staging_product_customer(
    id SERIAL primary key,
    type VARCHAR(255),
    size DECIMAL(6,3),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    original_user_id INTEGER
);

CREATE TABLE staging_product_view(
    id SERIAL primary key,
    type VARCHAR(255),
    size DECIMAL(6,3),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    original_user_id INTEGER
);

CREATE TABLE staging_product_like(
    id SERIAL primary key,
    type VARCHAR(255),
    size DECIMAL(6,3),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    original_user_id INTEGER
);

-- post staging --

CREATE TABLE staging_post_create(
    id SERIAL primary key, 
    title VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    event_location VARCHAR(255),
    description TEXT,
    is_event BOOLEAN,
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    original_user_id INTEGER,
    original_post_id INTEGER
);

-- ALTER TABLE staging_post_like ADD COLUMN original_post_id INTEGER;

CREATE TABLE staging_post_tag_user(
    id SERIAL primary key,
    tag VARCHAR(255), 
    title VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    event_location VARCHAR(255),
    description TEXT,
    is_event BOOLEAN,
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    original_user_id INTEGER,
    original_post_id INTEGER
);

CREATE TABLE staging_post_view(
    id SERIAL primary key,
    tag VARCHAR(255), 
    title VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    event_location VARCHAR(255),
    description TEXT,
    is_event BOOLEAN,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    original_user_id INTEGER,
    original_post_id INTEGER
);

CREATE TABLE staging_post_like(
    id SERIAL primary key,
    tag VARCHAR(255), 
    title VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    event_location VARCHAR(255),
    description TEXT,
    is_event BOOLEAN,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    original_user_id INTEGER,
    original_post_id INTEGER
);

-- acount staging --
CREATE TABLE staging_user_account_register(
    id SERIAL primary key, 
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    original_user_id INTEGER
);

CREATE TABLE staging_user_account_login(
    id SERIAL primary key, 
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    area VARCHAR(255),
    district VARCHAR(255),
    full_day DATE,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    original_user_id INTEGER
);






