from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, Float, String, Text, Boolean, DateTime
from sqlalchemy.ext.serializer import Serializer
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

db = SQLAlchemy()


class User(db.Model):
    __talbename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(128), index=True, unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    full_name = Column(String(128), default='')
    is_admin = Column(Boolean, default=False)

    projects = relationship('Project', back_populates='creator')

    _static_pwd_context = None

    @property
    def _pwd_context(self):
        if User._static_pwd_context is None:
            config = current_app.config['PASSLIB_CONTEXT_CONFIG']
            User._static_pwd_context = CryptContext.from_string(config)
        return User._static_pwd_context

    @property
    def password(self):
        raise AttributeError('`password` is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = self._pwd_context.hash(password)

    def verify_password(self, password):
        return self._pwd_context.verify(password, self.password_hash)

    @property
    def token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return str(s.dumps({'id': self.id}), encoding='utf-8')

    @staticmethod
    def verify_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        data = s.loads(token)
        user = User.query.get(data['id'])
        return user
