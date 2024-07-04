import pytest
from logs.loggers.logger import logger_config


@pytest.fixture
def data():
    number = 10
    self_module = '__main__'
    module = 'tests.test_logs.test_log'
    
    return {
                "number": number,
                "self_module": self_module,
                "module": module
            }

class TestLogger:
    @pytest.mark.operation
    def test_logger(self, data):
        assert logger_config(__name__) == logger_config(data["module"])