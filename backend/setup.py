from setuptools import setup, find_packages

with open('requirements.txt') as f:
    requirements = f.read().splitlines()
setup(
    name="aibou",
    version="0.0.1",
    packages=find_packages(),
    entry_points={
        "console_scripts": [
            "aibou=server.cli:cli",
        ],
    },
    author="aibou",
    author_email="abel@aibou.com",
    description="Welcome to aibou: The RAGtriever chatbot",
    long_description=open("readme.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/InfinityCodebase/edu-ai-hub",
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    include_package_data=True,
    install_requires=requirements,
    extras_require={"dev": ["pytest", "wheel", "twine", "black", "setuptools"]}
)
