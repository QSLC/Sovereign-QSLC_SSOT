FROM python:3.12-slim
WORKDIR /app
COPY services/ssot/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home eve && mkdir /data && chown eve /data
COPY services/ssot/ /app/
USER eve
EXPOSE 8000
CMD ["uvicorn", "gateway:app", "--host", "0.0.0.0", "--port", "8000"]
