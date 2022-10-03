from config import Config
config = Config()
from dotenv import load_dotenv
import os
import pyspark.sql.functions as F
import time
from pyspark.sql.types import StringType,BooleanType,DateType

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

print("[INFO] Connecting RDS cap_project TB oder_history")
df_order_history=spark.read.format('jdbc')\
                .option("url", "jdbc:postgresql://{}/{}".format(config.RDS_POSTGRES_HOST, config.RDS_POSTGRES_DB))\
                .option("dbtable","order_history")\
                .option("user", config.RDS_POSTGRES_USER)\
                .option("password", config.RDS_POSTGRES_PASSWORD)\
                .option("driver", "org.postgresql.Driver")\
                .load()
df_order_history.printSchema()
df_order_history.show()


print("[INFO] transform......")
df_order_details.createOrReplaceTempView('order_details')
df_products.createOrReplaceTempView('products')
df_order_history.createOrReplaceTempView('order_history')

df=spark.sql('SELECT name, order_size, unit_price,order_quantity, pay_date FROM order_details JOIN products ON order_details.product_id = products.id JOIN order_history ON order_details.order_history_id =order_history.id')
df = df.withColumnRenamed('name','type')\
    .withColumnRenamed('order_size','size')\
    .withColumnRenamed('order_quantity','quantity')\
    .withColumn('year', F.year(df['pay_date']))\
    .withColumn('month', F.month(df['pay_date']))\
    .withColumn('day', F.dayofmonth(df['pay_date']))\
    .withColumn('full_day',F.to_date(df['pay_date']))\
    .withColumn('full_day',F.col("full_day").cast(DateType()))\
    .drop('pay_date')
df.show()

print("[INFO]load data to psql......")
df=df.write.format('jdbc')\
    .option('url',"jdbc:postgresql://{}/{}".format(config.POSTGRES_HOST,config.POSTGRES_DW))\
    .option('dbtable','staging_product_sales')\
    .option('user',config.POSTGRES_USER)\
    .option('password',config.POSTGRES_PASSWORD)\
    .option('driver','org.postgresql.Driver')\
    .mode('append')\
    .save()
