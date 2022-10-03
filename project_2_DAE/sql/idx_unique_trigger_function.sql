CREATE UNIQUE INDEX idx_unique_date ON dim_date (full_day, year, month, day);
CREATE UNIQUE INDEX idx_unique_product ON dim_product (type, size);

CREATE OR REPLACE FUNCTION insert_product_sales()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_product_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_product
            (type, size)
            VALUES 
            (NEW.type, NEW.size)
            ON CONFLICT (type, size)
            DO
                UPDATE SET type=NEW.type
                RETURNING id
                INTO dim_product_id;
        INSERT INTO fact_product_sales
            (product_id, unit_price, quantity, pay_date_id)
            VALUES
            (dim_product_id, NEW.unit_price, NEW.quantity, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_product_sales
AFTER INSERT ON staging_product_sales
FOR EACH ROW 
EXECUTE PROCEDURE insert_product_sales();

-- CREATE OR REPLACE FUNCTION trun_staging_product_sales()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
--     BEGIN
--         TRUNCATE staging_product_sales RESTART IDENTITY CASCADE;
--     END;
-- $$;

-- CREATE TRIGGER trigger_trun_staging_product_sales
-- BEFORE INSERT ON staging_product_sales
-- FOR EACH STATEMENT
-- EXECUTE PROCEDURE trun_staging_product_sales();





----------------------------------------------------------------------------
CREATE UNIQUE INDEX idx_unique_users ON dim_users (original_user_id, is_official, is_anonymous,age_range, learning_level, gender, location_id, reason);
CREATE UNIQUE INDEX idx_unique_location ON dim_location (area, district);

CREATE OR REPLACE FUNCTION insert_product_customer()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_product_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_product
            (type, size)
            VALUES 
            (NEW.type, NEW.size)
            ON CONFLICT (type, size)
            DO
                UPDATE SET type=NEW.type
                RETURNING id
                INTO dim_product_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_product_customer
            (product_id, pay_date_id, customer_id)
            VALUES
            (dim_product_id, dim_full_day_id, dim_users_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_product_customer
AFTER INSERT ON staging_product_customer
FOR EACH ROW 
EXECUTE PROCEDURE insert_product_customer();

------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_product_view()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_product_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_product
            (type, size)
            VALUES 
            (NEW.type, NEW.size)
            ON CONFLICT (type, size)
            DO
                UPDATE SET type=NEW.type
                RETURNING id
                INTO dim_product_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_product_view
            (product_id, view_date_id, view_by_user_id)
            VALUES
            (dim_product_id, dim_full_day_id, dim_users_id);
        RETURN NEW;
    END;
$$;


CREATE TRIGGER trigger_insert_fact_product_view
AFTER INSERT ON staging_product_view
FOR EACH ROW 
EXECUTE PROCEDURE insert_product_view();

--------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_product_like()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_product_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_product
            (type, size)
            VALUES 
            (NEW.type, NEW.size)
            ON CONFLICT (type, size)
            DO
                UPDATE SET type=NEW.type
                RETURNING id
                INTO dim_product_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_product_like
            (product_id, like_date_id, like_by_user_id)
            VALUES
            (dim_product_id, dim_full_day_id, dim_users_id);
        RETURN NEW;
    END;
$$;


CREATE TRIGGER trigger_insert_fact_product_like
AFTER INSERT ON staging_product_like
FOR EACH ROW 
EXECUTE PROCEDURE insert_product_like();

-------------------------------------------------------------------
CREATE UNIQUE INDEX idx_unique_post ON dim_post (title, event_date, event_time, event_location, description, is_event, original_post_id);
CREATE UNIQUE INDEX idx_unique_post_tag ON dim_post_tag (post_id, tag);

CREATE OR REPLACE FUNCTION insert_post_create()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_post_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_post
            (title, event_date, event_time, event_location, description, is_event, original_post_id)
            VALUES 
            (NEW.title, NEW.event_date, NEW.event_time, NEW.event_location, NEW.description, NEW.is_event, NEW.original_post_id)
            ON CONFLICT (title, event_date, event_time, event_location, description, is_event, original_post_id)
            DO
                UPDATE SET title=NEW.title
                RETURNING id
                INTO dim_post_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_post_create
            (post_id, user_id, created_date_id)
            VALUES
            (dim_post_id, dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;


CREATE TRIGGER trigger_insert_fact_post_create
AFTER INSERT ON staging_post_create
FOR EACH ROW 
EXECUTE PROCEDURE insert_post_create();

----------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_post_tag_user()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_post_id INT :=0;
        dim_post_tag_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_post
            (title, event_date, event_time, event_location, description, is_event, original_post_id)
            VALUES 
            (NEW.title, NEW.event_date, NEW.event_time, NEW.event_location, NEW.description, NEW.is_event, NEW.original_post_id)
            ON CONFLICT (title, event_date, event_time, event_location, description, is_event, original_post_id)
            DO
                UPDATE SET title=NEW.title
                RETURNING id
                INTO dim_post_id;
        INSERT INTO dim_post_tag
            (post_id, tag)
            VALUES
            (dim_post_id, NEW.tag)
            ON CONFLICT (post_id, tag)
            DO
                UPDATE SET tag=NEW.tag
                RETURNING id
                INTO dim_post_tag_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_post_tag_user
            (post_tag_id, user_id, created_date_id)
            VALUES
            (dim_post_tag_id, dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_post_tag_user
AFTER INSERT ON staging_post_tag_user
FOR EACH ROW 
EXECUTE PROCEDURE insert_post_tag_user();

------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_post_view()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_post_id INT :=0;
        dim_post_tag_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_post
            (title, event_date, event_time, event_location, description, is_event, original_post_id)
            VALUES 
            (NEW.title, NEW.event_date, NEW.event_time, NEW.event_location, NEW.description, NEW.is_event, NEW.original_post_id)
            ON CONFLICT (title, event_date, event_time, event_location, description, is_event, original_post_id)
            DO
                UPDATE SET title=NEW.title
                RETURNING id
                INTO dim_post_id;
        INSERT INTO dim_post_tag
            (post_id, tag)
            VALUES
            (dim_post_id, NEW.tag)
            ON CONFLICT (post_id, tag)
            DO
                UPDATE SET tag=NEW.tag
                RETURNING id
                INTO dim_post_tag_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_post_view
            (post_tag_id, view_by_user_id, view_date_id)
            VALUES
            (dim_post_tag_id, dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_post_view
AFTER INSERT ON staging_post_view
FOR EACH ROW 
EXECUTE PROCEDURE insert_post_view();

--------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_post_like()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_post_id INT :=0;
        dim_post_tag_id INT :=0;
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_post
            (title, event_date, event_time, event_location, description, is_event, original_post_id)
            VALUES 
            (NEW.title, NEW.event_date, NEW.event_time, NEW.event_location, NEW.description, NEW.is_event, NEW.original_post_id)
            ON CONFLICT (title, event_date, event_time, event_location, description, is_event, original_post_id)
            DO
                UPDATE SET title=NEW.title
                RETURNING id
                INTO dim_post_id;
        INSERT INTO dim_post_tag
            (post_id, tag)
            VALUES
            (dim_post_id, NEW.tag)
            ON CONFLICT (post_id, tag)
            DO
                UPDATE SET tag=NEW.tag
                RETURNING id
                INTO dim_post_tag_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_post_like
            (post_tag_id, like_by_user_id, like_date_id)
            VALUES
            (dim_post_tag_id, dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_post_like
AFTER INSERT ON staging_post_like
FOR EACH ROW 
EXECUTE PROCEDURE insert_post_like();

--------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_user_account_register()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_user_account_register
            (user_id, register_date_id)
            VALUES
            (dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_user_account_register
AFTER INSERT ON staging_user_account_register
FOR EACH ROW 
EXECUTE PROCEDURE insert_user_account_register();

-------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION insert_user_account_login()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
    DECLARE
        dim_full_day_id DATE :=now();
        dim_location_id INT :=0;
        dim_users_id INT :=0;
    BEGIN
        INSERT INTO dim_date
            (full_day, year, month, day)
            VALUES
            (NEW.full_day, NEW.year, NEW.month, NEW.day)
            ON CONFLICT(full_day, year, month, day)
            DO
                UPDATE SET full_day=NEW.full_day
                RETURNING full_day
                INTO dim_full_day_id;
        INSERT INTO dim_location
            (area, district)
            VALUES
            (NEW.area, NEW.district)
            ON CONFLICT (area, district)
            DO
                UPDATE SET area=NEW.area
                RETURNING id
                INTO dim_location_id;
        INSERT INTO dim_users
            (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            VALUES 
            (NEW.original_user_id, NEW.is_official, NEW.is_anonymous, NEW.age_range, NEW.learning_level, NEW.gender, dim_location_id, NEW.reason)
            ON CONFLICT (original_user_id, is_official, is_anonymous, age_range, learning_level, gender, location_id, reason)
            DO
                UPDATE SET original_user_id=NEW.original_user_id
                RETURNING id
                INTO dim_users_id;
        INSERT INTO fact_user_account_login
            (user_id, login_date_id)
            VALUES
            (dim_users_id, dim_full_day_id);
        RETURN NEW;
    END;
$$;

CREATE TRIGGER trigger_insert_fact_user_account_login
AFTER INSERT ON staging_user_account_login
FOR EACH ROW 
EXECUTE PROCEDURE insert_user_account_login();


