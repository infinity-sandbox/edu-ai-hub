import os
import click
import uvicorn
from logs.loggers.logger import logger_config
from app.config.env_manager import get_env_manager
from utils.docker.util import is_docker


logger = logger_config(__name__)
env_manager = get_env_manager()


@click.group()
def cli():
    """Main command group for tenxbot."""
    pass


@cli.command()
@click.option(
    "--uvreload",
    default=not is_docker(),
    help="Checking if we are running in docker or not",
)
def start(uvreload):
    """
    -- Run the FastAPI application
    """
    if uvreload:
        logger.warning(f"uvicorn reloading: {uvreload}")
    else:
        logger.warning(f"uvicorn not reloading b/c we are running in docker: {uvreload}")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=uvreload)

if __name__ == "__main__":
    cli()
