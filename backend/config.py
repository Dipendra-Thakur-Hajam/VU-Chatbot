from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    JWT_SECRET: str
    
    # App
    APP_NAME: str = "College Admission Agent"

    # IBM Cloud
    IBM_CLOUD_API_KEY: str = Field(..., env="IBM_CLOUD_API_KEY")
    IBM_PROJECT_ID: str = Field(..., env="IBM_PROJECT_ID")
    IBM_WATSONX_URL: str = Field(..., env="IBM_WATSONX_URL")

    # Granite models
    GRANITE_EMBEDDING_MODEL: str
    GRANITE_CHAT_MODEL: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
