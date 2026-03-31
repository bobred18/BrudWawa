import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.db.base import Base
import app.models  # noqa: F401 — ensures all models are registered

config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata

DATABASE_URL = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")


def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


POSTGIS_TABLES = {
    "spatial_ref_sys", "topology", "layer",
    "geocode_settings", "geocode_settings_default",
    "pagc_gaz", "pagc_lex", "pagc_rules",
    "loader_platform", "loader_lookuptables", "loader_variables",
    "county", "county_lookup", "countysub_lookup", "cousub",
    "place", "place_lookup", "state", "state_lookup",
    "tabblock", "tabblock20", "tract", "zcta5",
    "zip_lookup", "zip_lookup_all", "zip_lookup_base", "zip_state", "zip_state_loc",
    "addr", "addrfeat", "bg", "edges", "faces", "featnames",
    "direction_lookup", "secondary_unit_lookup", "street_type_lookup",
}

OUR_TABLES = {"users", "reports", "comments", "votes"}


def include_object(obj, name, type_, reflected, compare_to):
    if type_ == "table":
        return name in OUR_TABLES
    return True


def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        include_object=include_object,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
