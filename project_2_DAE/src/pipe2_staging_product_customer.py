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


print("[INFO] Connecting RDS cap_project TB order_details")
df_order_details=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","order_details")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_order_details.printSchema()
df_order_details.show()

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

print("[INFO] Connecting RDS cap_project TB order_history")
df_order_history=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","order_history")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_order_history.printSchema()
df_order_history.show()

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
df_order_details.createOrReplaceTempView('order_details')
df_products.createOrReplaceTempView('products')
df_order_history.createOrReplaceTempView('order_history')
df_users.createOrReplaceTempView('users')
df_user_info.createOrReplaceTempView('user_info')

df=spark.sql('SELECT name, order_size, pay_date, order_history.user_id, is_admin, is_anonymous, age_range, learning_level, gender, reason, area, district FROM order_details JOIN products ON order_details.product_id = products.id JOIN order_history ON order_details.order_history_id =order_history.id JOIN users ON order_history.user_id = users.id LEFT JOIN user_info ON users.id = user_info.user_id')

df = df.withColumnRenamed('name','type')\
    .withColumnRenamed('user_id','original_user_id')\
    .withColumnRenamed('is_admin','is_official')\
    .withColumnRenamed('order_size','size')\
    .withColumnRenamed('order_quantity','quantity')\
    .withColumn('year', F.year(df['pay_date']))\
    .withColumn('month', F.month(df['pay_date']))\
    .withColumn('day', F.dayofmonth(df['pay_date']))\
    .withColumn('full_day',F.to_date(df['pay_date']))\
    .na.fill(value='others')\
    .drop('pay_date')
df.show()

print("[INFO]load data to psql......")
df=df.write.format('jdbc')\
    .option('url',"jdbc:postgresql://{}/{}".format(config.POSTGRES_HOST,config.POSTGRES_DW))\
    .option('dbtable','staging_product_customer')\
    .option('user',config.POSTGRES_USER)\
    .option('password',config.POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .mode('append')\
    .save()
