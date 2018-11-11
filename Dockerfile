FROM python:3.7.1
RUN apt-get update -y && apt-get install -y python-pip python-dev build-essential libpq-dev curl
RUN curl -sSL https://sdk.cloud.google.com | bash
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/gunicorn", "-b", ":8000", "app:flaskapp", "--workers=5", "--threads=5"]
