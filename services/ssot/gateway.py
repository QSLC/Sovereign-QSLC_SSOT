import os
from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from service import Store, authorized

security = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app):
    if len(os.environ.get('QSLC_ADMIN_TOKEN', '')) < 32:
        raise RuntimeError('QSLC_ADMIN_TOKEN must contain at least 32 characters')
    app.state.store = Store(os.environ.get('SSOT_DB', '/data/ssot.db'))
    yield

app = FastAPI(title='QSLC Private SSOT Gateway', lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)

def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if not credentials or not authorized(credentials.credentials, os.environ.get('QSLC_ADMIN_TOKEN', '')):
        raise HTTPException(401, 'Unauthorized', headers={'WWW-Authenticate': 'Bearer'})

class Observation(BaseModel):
    component: str = Field(min_length=1, max_length=100)
    passed: bool
    evidence: str = Field(min_length=1, max_length=4000)

@app.get('/healthz')
def health():
    return {'status': 'process_running'}

@app.get('/api/v1/telemetry/live', dependencies=[Depends(require_admin)])
def telemetry(response: Response):
    response.headers['Cache-Control'] = 'no-store'
    return app.state.store.telemetry()

@app.post('/api/v1/evidence', status_code=201, dependencies=[Depends(require_admin)])
def evidence(observation: Observation):
    try:
        app.state.store.record(observation.component, observation.passed, observation.evidence)
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    return {'recorded': True, 'ticket_transitioned': False}
