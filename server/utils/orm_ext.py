from pydantic import BaseModel
from tinydb import TinyDB, Query
from tinydb.table import Table, Document
from typing import Union, Optional

class ORMModel(BaseModel):
    doc_id: Optional[int] = None
    @classmethod
    def load(cls, db: Union[TinyDB, Table], query: Query):
        return [cls(doc_id=entry.doc_id, **entry) for entry in db.search(query)]
    
    def dump(self, db: Union[TinyDB, Table]):
        if self.doc_id:
            db.upsert(Document(self.anonymized, self.doc_id))
        else:
            db.insert({k:v for k, v in self.model_dump().items() if not k == "doc_id"})
    
    @property
    def anonymized(self) -> dict:
        return {k:v for k, v in self.model_dump().items() if not k == "doc_id"}