from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, select
from dotenv import load_dotenv
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware

import os

# Load .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Async engine and session
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI()

# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashedPassword = Column(String)

class Maps(Base):
    __tablename__ = "maps"
    id = Column(Integer, primary_key=True, index=True)
    mapname = Column(String, unique=True, index=True)

# Async table creation function
async def init_db():
    async with engine.begin() as conn:
        # This creates tables in the database
        await conn.run_sync(Base.metadata.create_all)

# Dependency for DB sessions
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Pydantic model for login
class LoginRequest(BaseModel):
    email: str
    password: str

class MapRequest(BaseModel):
    mapName: str

origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # <--- frontend URL
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],         # allow all headers
)

app.add_middleware(
    SessionMiddleware,
    secret_key= os.getenv("secrete_key")
)

# Login endpoint
@app.post("/login")
async def login(data: LoginRequest, request:Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    if not user or not pwd_context.verify(data.password, user.hashedPassword):
        raise HTTPException(status_code=400, detail="invalid email or password")
    
    request.session["user"] = user.id

    return {"status":"ok", "message": "Login Successful"}

@app.post("/createmap")
async def createmap(data: MapRequest, db: AsyncSession = Depends(get_db)):
    # Create a Map Instance From The Pydantic Mode
    new_map = Maps(mapname = data.mapName)

    #Add to the DB
    db.add(new_map)
    await db.commit()
    await db.refresh(new_map) # Optional, to get auto-generated fields like id
    
    return {"status": "ok", "message": f"Map '{new_map.mapname}' created", "id": new_map.id}

@app.get("/existingmaps")
async def existingmaps(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Maps))
    maps = result.scalars().all()  # gets a list of Maps objects
    maps_list = [{"id": m.id, "mapName": m.mapname} for m in maps]
    return {"maps": maps_list}

# Ensure tables are created on startup
@app.on_event("startup")
async def on_startup():
    await init_db()
    print("✅ Tables created (if not already present)")



