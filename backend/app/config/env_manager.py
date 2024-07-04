import os
import sys
from dotenv import load_dotenv
from logs.loggers.logger import logger_config

logger = logger_config(__name__)


class AWS_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '') or None
        self.AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '') or None
        self.AWS_REGION = os.environ.get('AWS_REGION', '') or None
        self.AWS_S3_BUCKET_NAME = os.environ.get('AWS_S3_BUCKET_NAME', '') or None
        logger.debug(f"Fetched AWS Keys")


class SLACK_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.SLACK_BOT_TOKEN = os.environ.get('SLACK_BOT_TOKEN', '') or None
        self.SLACK_USER_TOKEN = os.environ.get('SLACK_USER_TOKEN', '') or None
        self.SLACK_SIGNING_SECRET = os.environ.get('SLACK_SIGNING_SECRET', '') or None
        self.SLACK_CLIENT_ID = os.environ.get('SLACK_CLIENT_ID', '') or None
        self.SLACK_CLIENT_SECRET = os.environ.get('SLACK_CLIENT_SECRET', '') or None
        logger.debug(f"Fetched Slack Keys")


class OPENAI_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '') or None
        logger.debug(f"Fetched OpenAI Keys")


class WEAVIATE_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.WEAVIATE_API_KEY = os.environ.get('WEAVIATE_API_KEY', '') or None
        self.WEAVIATE_URL = os.environ.get('WEAVIATE_URL', '') or None
        self.WEAVIATE_MODEL = os.environ.get('WEAVIATE_MODEL', '') or None
        logger.debug(f"Fetched Weaviate Keys")


class VITE_API_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.VITE_API_BACKEND_URL = os.environ.get('VITE_API_BACKEND_URL', '') or None
        self.VITE_API_CHATBOT_BACKEND_URL = os.environ.get('VITE_API_CHATBOT_BACKEND_URL', '') or None
        logger.debug(f"Fetched Vite API Keys")


class SPOTIFY_API_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID', '') or None
        self.SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET', '') or None
        self.SPOTIFY_REDIRECT_URI = os.environ.get('SPOTIFY_REDIRECT_URI', '') or None
        logger.debug(f"Fetched Spotify API Keys")


class NOTION_API_KEYS:
    def __init__(self, env_file):
        load_dotenv(env_file)
        self.NOTION_TOKEN = os.environ.get('NOTION_TOKEN', '') or None
        self.DATABASE_ID = os.environ.get('CB_SCHEDULE_DATABASE_ID', '') or None
        logger.debug(f"Fetched Notion API Keys")


def _get_aws_keys(env_file) -> AWS_KEYS:
    return AWS_KEYS(env_file)


def _get_notion_keys(env_file) -> NOTION_API_KEYS:
    return NOTION_API_KEYS(env_file)


def _get_slack_keys(env_file) -> SLACK_KEYS:
    return SLACK_KEYS(env_file)


def _get_openai_keys(env_file) -> OPENAI_KEYS:
    return OPENAI_KEYS(env_file)


def _get_weaviate_keys(env_file) -> WEAVIATE_KEYS:
    return WEAVIATE_KEYS(env_file)


def _get_vite_keys(env_file) -> VITE_API_KEYS:
    return VITE_API_KEYS(env_file)


def _get_spotify_keys(env_file) -> SPOTIFY_API_KEYS:
    return SPOTIFY_API_KEYS(env_file)


def get_env_manager(env_file: str = '.env/.env') -> dict:
    aws_keys = _get_aws_keys(env_file).__dict__
    slack_keys = _get_slack_keys(env_file).__dict__
    openai_keys = _get_openai_keys(env_file).__dict__
    weaviate_keys = _get_weaviate_keys(env_file).__dict__
    vite_keys = _get_vite_keys(env_file).__dict__
    spotify_keys = _get_spotify_keys(env_file).__dict__
    notion_keys = _get_notion_keys(env_file).__dict__

    return {
        'aws_keys': aws_keys,
        'slack_keys': slack_keys,
        'openai_keys': openai_keys,
        'weaviate_keys': weaviate_keys,
        'vite_keys': vite_keys,
        'spotify_keys': spotify_keys,
        'notion_keys': notion_keys,
    }
