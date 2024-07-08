import os
import sys
from dotenv import load_dotenv
from logs.loggers.logger import logger_config

logger = logger_config(__name__)


class OPENAI_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '') or None
        logger.debug(f"Fetched OpenAI Keys")

class VDB_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.VDB_API_KEY = os.environ.get('VDB_API_KEY', '') or None
        self.VDB_URL = os.environ.get('VDB_URL', '') or None
        logger.debug(f"Fetched VDB Keys")


def _get_openai_keys(env_file) -> OPENAI_KEYS:
    return OPENAI_KEYS(env_file)

def _get_vdb_keys(env_file) -> VDB_KEYS:
    return VDB_KEYS(env_file)



def get_env_manager(env_file: str = '.env/.env') -> dict:
    openai_keys = _get_openai_keys(env_file).__dict__
    vdb_keys = _get_vdb_keys(env_file).__dict__
    return {
        'openai_keys': openai_keys,
        'vdb_keys': vdb_keys
    }
