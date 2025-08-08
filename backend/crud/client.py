from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models.client import Client
from schemas.client import ClientCreate, ClientUpdate

def get_all_clients(db: Session):
    return db.query(Client).all()

def get_client(db: Session, client_id: int):
    return db.query(Client).filter(Client.id == client_id).first()

def create_client(db: Session, client: ClientCreate):
    new_client = Client(**client.dict())
    db.add(new_client)
    try:
        db.commit()
        db.refresh(new_client)
        return new_client
    except IntegrityError as e:
        db.rollback()
        if 'clients_email_key' in str(e.orig):
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
        raise HTTPException(status_code=500, detail="Error interno al crear el cliente.")

def update_client(db: Session, client_id: int, client_data: ClientUpdate):
    client = get_client(db, client_id)
    if not client:
        return None
    for field, value in client_data.dict(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client

def delete_client(db: Session, client_id: int):
    client = get_client(db, client_id)
    if not client:
        return None
    db.delete(client)
    db.commit()
    return client
