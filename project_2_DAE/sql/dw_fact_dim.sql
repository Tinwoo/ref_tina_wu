CREATE TABLE dim_date( 
    full_day DATE PRIMARY KEY UNIQUE,
    year INTEGER,
    month INTEGER,
    day INTEGER
);


CREATE TABLE dim_product(
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    size DECIMAL(6,3)
);

CREATE TABLE dim_post(
    id SERIAL primary key,
    title VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    event_location VARCHAR(255),
    description TEXT,
    is_event BOOLEAN,
    original_post_id INTEGER
);

CREATE TABLE dim_post_tag(
    id SERIAL PRIMARY KEY,
    tag VARCHAR(255),
    post_id INTEGER,
    FOREIGN KEY(post_id) REFERENCES dim_post(id)
);

CREATE TABLE dim_location(
    id SERIAL primary key,
    area VARCHAR(255),
    district VARCHAR(255)
);

CREATE TABLE dim_users(
    id SERIAL primary key,
    original_user_id INTEGER,
    is_official BOOLEAN,
    is_anonymous BOOLEAN,
    age_range VARCHAR(255),
    learning_level VARCHAR(255),
    gender VARCHAR(255),
    reason TEXT,
    location_id INTEGER,
    FOREIGN KEY(location_id) REFERENCES dim_location(id)
);


----------------------------------------------------------
-- products related --
----------------------------------------------------------
CREATE TABLE fact_product_sales(
    id SERIAL primary key,
    product_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES dim_product(id),
    unit_price DECIMAL(8,2),
    quantity INTEGER,
    pay_date_id DATE,
    FOREIGN KEY(pay_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);

CREATE TABLE fact_product_customer(
    id SERIAL primary key, 
    product_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES dim_product(id),
    pay_date_id DATE,
    FOREIGN KEY(pay_date_id) REFERENCES dim_date(full_day),
    customer_id INTEGER,
    FOREIGN KEY(customer_id) REFERENCES dim_users(id),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);

CREATE TABLE fact_product_view(
    id SERIAL primary key,
    product_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES dim_product(id),
    view_by_user_id INTEGER,
    FOREIGN KEY(view_by_user_id) REFERENCES dim_users(id),
    view_date_id DATE,
    FOREIGN KEY(view_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);

CREATE TABLE fact_product_like(
    id SERIAL primary key,
    product_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES dim_product(id),
    like_by_user_id INTEGER,
    FOREIGN KEY(like_by_user_id) REFERENCES dim_users(id),
    like_date_id DATE,
    FOREIGN KEY(like_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);


----------------------------------------------------------
-- posts related --
----------------------------------------------------------

CREATE TABLE fact_post_create(
    id SERIAL primary key, 
    post_id INTEGER,
    FOREIGN KEY(post_id) REFERENCES dim_post(id),
    created_date_id DATE,
    FOREIGN KEY(created_date_id) REFERENCES dim_date(full_day),
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES dim_users(id),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);

CREATE TABLE fact_post_tag_user(
    id SERIAL primary key, 
    post_tag_id INTEGER,
    FOREIGN KEY(post_tag_id) REFERENCES dim_post_tag(id),
    created_date_id DATE,
    FOREIGN KEY(created_date_id) REFERENCES dim_date(full_day),
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES dim_users(id),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()
);

CREATE TABLE fact_post_view(
    id SERIAL primary key, 
    post_tag_id INTEGER,
    FOREIGN KEY(post_tag_id) REFERENCES dim_post_tag(id),
    view_by_user_id INTEGER,
    FOREIGN KEY(view_by_user_id) REFERENCES dim_users(id),
    view_date_id DATE,
    FOREIGN KEY(view_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()  
);

CREATE TABLE fact_post_like(
    id SERIAL primary key, 
    post_tag_id INTEGER,
    FOREIGN KEY(post_tag_id) REFERENCES dim_post_tag(id),
    like_by_user_id INTEGER,
    FOREIGN KEY(like_by_user_id) REFERENCES dim_users(id),
    like_date_id DATE,
    FOREIGN KEY(like_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()  
);

----------------------------------------------------------
-- accounts related --
----------------------------------------------------------

CREATE TABLE fact_user_account_register(
    id SERIAL primary key, 
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES dim_users(id),
    register_date_id DATE,
    FOREIGN KEY(register_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()  
);

CREATE TABLE fact_user_account_login(
    id SERIAL primary key, 
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES dim_users(id),
    login_date_id DATE,
    FOREIGN KEY(login_date_id) REFERENCES dim_date(full_day),
    data_input_at TIMESTAMP default NOW(),
    data_update_at TIMESTAMP default NOW()  
);

















