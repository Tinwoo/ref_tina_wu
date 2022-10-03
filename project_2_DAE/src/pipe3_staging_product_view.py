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


print("[INFO] Connecting RDS cap_project TB products")
df_products=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable", "products")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_products.printSchema()
df_products.show()

print("[INFO] Connecting RDS cap_project TB product_views")
df_product_views=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","product_views")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_product_views.printSchema()
df_product_views.show()

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
df_user_info.printSchema()
df_user_info.show()


print("[INFO] transform......")
df_products.createOrReplaceTempView('products')
df_product_views.createOrReplaceTempView('product_views')
df_users.createOrReplaceTempView('users')
df_user_info.createOrReplaceTempView('user_info')

print("[INFO] transform s1......")
df=spark.sql('SELECT name, view_begin, product_views.user_id, is_admin, is_anonymous, age_range, learning_level, gender, reason, area, district FROM product_views JOIN products ON product_views.product_id = products.id JOIN users ON product_views.user_id = users.id LEFT JOIN user_info ON users.id = user_info.user_id')
df.show()

print("[INFO] transform s2......")

df = df.withColumnRenamed('name','type')\
    .withColumnRenamed('user_id','original_user_id')\
    .withColumnRenamed('is_admin','is_official')\
    .withColumn('size',F.lit(0))\
    .withColumn('year', F.year(df['view_begin']))\
    .withColumn('month', F.month(df['view_begin']))\
    .withColumn('day', F.dayofmonth(df['view_begin']))\
    .withColumn('full_day',F.to_date(df['view_begin']))\
    .na.fill(value='others')\
    .drop('view_begin')
df.show()

print("[INFO]load data to psql......")
df=df.write.format('jdbc')\
    .option('url',"jdbc:postgresql://{}/{}".format(config.POSTGRES_HOST,config.POSTGRES_DW))\
    .option('dbtable','staging_product_view')\
    .option('user',config.POSTGRES_USER)\
    .option('password',config.POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .mode('append')\
    .save()
