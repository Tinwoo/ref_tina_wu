from dataclasses import dataclass
from dotenv import load_dotenv
import os
load_dotenv()

@dataclass
class Config:
    RDS_POSTGRES_DB: str = os.getenv('RDS_POSTGRES_DB')
    RDS_POSTGRES_USER: str = os.getenv('RDS_POSTGRES_USER')
    RDS_POSTGRES_PASSWORD: str = os.getenv('RDS_POSTGRES_PASSWORD')
    RDS_POSTGRES_HOST: str = os.getenv('RDS_POSTGRES_HOST')
    POSTGRES_DB: str = os.getenv('POSTGRES_DB')
    POSTGRES_DW: str = os.getenv('POSTGRES_DW')
    POSTGRES_USER: str = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD: str = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_HOST: str = os.getenv('POSTGRES_HOST')
    SPARK_MASTER: str = os.getenv('SPARK_MASTER')

config = Config()