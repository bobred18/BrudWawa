import uuid

from minio import Minio
from minio.error import S3Error

from app.core.config import settings

client = Minio(
    settings.minio_endpoint,
    access_key=settings.minio_root_user,
    secret_key=settings.minio_root_password,
    secure=False,
)


def ensure_bucket():
    if not client.bucket_exists(settings.minio_bucket):
        client.make_bucket(settings.minio_bucket)
        policy = f"""{{
            "Version": "2012-10-17",
            "Statement": [{{
                "Effect": "Allow",
                "Principal": {{"AWS": ["*"]}},
                "Action": ["s3:GetObject"],
                "Resource": ["arn:aws:s3:::{settings.minio_bucket}/*"]
            }}]
        }}"""
        client.set_bucket_policy(settings.minio_bucket, policy)


def get_public_url(key: str) -> str:
    return f"http://{settings.minio_endpoint}/{settings.minio_bucket}/{key}"


def upload_image(data: bytes, content_type: str) -> str:
    ensure_bucket()
    ext = content_type.split("/")[-1]
    key = f"{uuid.uuid4()}.{ext}"
    from io import BytesIO
    client.put_object(
        settings.minio_bucket,
        key,
        BytesIO(data),
        length=len(data),
        content_type=content_type,
    )
    return key


def get_image_url(key: str) -> str:
    return client.presigned_get_object(settings.minio_bucket, key)


def download_image(key: str) -> tuple[bytes, str]:
    response = client.get_object(settings.minio_bucket, key)
    data = response.read()
    content_type = response.headers.get("Content-Type", "image/jpeg")
    response.close()
    return data, content_type


def delete_image(key: str):
    try:
        client.remove_object(settings.minio_bucket, key)
    except S3Error:
        pass
