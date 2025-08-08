from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas.client import ClientCreate, ClientUpdate, ClientOut
from crud import client as crud_client

router = APIRouter(prefix="/clients", tags=["clients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[ClientOut])
def read_clients(db: Session = Depends(get_db)):
    return crud_client.get_all_clients(db)

@router.get("/{client_id}", response_model=ClientOut)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client = crud_client.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client

@router.post("/", response_model=ClientOut)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    return crud_client.create_client(db, client)

@router.put("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, client: ClientUpdate, db: Session = Depends(get_db)):
    updated = crud_client.update_client(db, client_id, client)
    if not updated:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    deleted = crud_client.delete_client(db, client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"detail": "Cliente eliminado"}
