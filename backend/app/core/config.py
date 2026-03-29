from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    redis_url: str
    minio_endpoint: str
    minio_root_user: str
    minio_root_password: str
    minio_bucket: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60
    gemini_api_key: str

    class Config:
        env_file = ".env"


settings = Settings()
