from config import Config
config = Config()
from dotenv import load_dotenv
import os
import pyspark.sql.functions as F
import time

load_dotenv()

from pyspark.sql import SparkSession
packages = [
    "com.amazonaws:aws-java-sdk-s3:1.12.95",
    "org.apache.hadoop:hadoop-aws:3.2.0",
    "org.apache.spark:spark-avro_2.12:2.4.4",
    "org.postgresql:postgresql:42.2.18"
]

spark = SparkSession.builder.appName("Transform Recent change stream")\
        .master('spark://{}:7077'.format(config.SPARK_MASTER))\
        .config("spark.jars.packages",",".join(packages))\
        .getOrCreate()


print("[INFO] Connecting RDS cap_project TB posts")
df_posts=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","posts")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_posts.printSchema()
df_posts.show()

print("[INFO] Connecting RDS cap_project TB tags")
df_tags=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","tags")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_tags.printSchema()
df_tags.show()

print("[INFO] Connecting RDS cap_project TB post_tags")
df_post_tags=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","post_tags")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_post_tags.printSchema()
df_post_tags.show()

print("[INFO] Connecting RDS cap_project TB users")
df_users=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","users")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_users.printSchema()
df_users.show()

print("[INFO] Connecting RDS cap_project TB user_info")
df_user_info=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","user_info")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_users.printSchema()
df_users.show()


print("[INFO] transform......")
df_posts.createOrReplaceTempView('posts')
df_tags.createOrReplaceTempView('tags')
df_post_tags.createOrReplaceTempView('post_tags')
df_users.createOrReplaceTempView('users')
df_user_info.createOrReplaceTempView('user_info')

df=spark.sql('SELECT title, event_date, event_time, event_location, description, is_event, posts.created_at, is_admin, is_anonymous, age_range, learning_level, gender, reason, area, district, posts.user_id, tag, posts.id FROM posts JOIN users ON posts.user_id = users.id LEFT JOIN user_info ON posts.user_id = user_info.user_id LEFT JOIN post_tags ON posts.id = post_tags.post_id JOIN tags ON post_tags.tag_id =tags.id')

df = df.withColumnRenamed('is_admin','is_official')\
    .withColumnRenamed('user_id','original_user_id')\
    .withColumnRenamed('id','original_post_id')\
    .withColumn('year', F.year(df['created_at']))\
    .withColumn('month', F.month(df['created_at']))\
    .withColumn('day', F.dayofmonth(df['created_at']))\
    .withColumn('full_day',F.to_date(df['created_at']))\
    .na.fill(value='others')\
    .drop('created_at')
df.show()

print("[INFO]load data to psql......")
df=df.write.format('jdbc')\
    .option('url',"jdbc:postgresql://{}/{}".format(config.POSTGRES_HOST,config.POSTGRES_DW))\
    .option('dbtable','staging_post_tag_user')\
    .option('user',config.POSTGRES_USER)\
    .option('password',config.POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .mode('append')\
    .save()
