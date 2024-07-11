import pytest
from logs.loggers.logger import logger_config
import json


@pytest.fixture
def data():
    with open("tests/data/log_test_data.json") as f:
        data = json.load(f)
    return data
    

class TestLogger:
    @pytest.mark.operation
    def test_logger(self, data):
        for item in data:
            assert logger_config(__name__) == logger_config(item["module"])