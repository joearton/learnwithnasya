from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from extensions import db


class BaseModel(db.Model):
    """Base model dengan kolom umum yang bisa diinherit"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(UserMixin, BaseModel):
    """Model user terpadu (regular user dan admin)"""
    __tablename__ = 'users'
    
    # Informasi dasar
    username = db.Column(db.String(255), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Status dan peran
    is_active = db.Column(db.Boolean, default=True, index=True)
    is_admin = db.Column(db.Boolean, default=False, index=True)
    is_staff = db.Column(db.Boolean, default=False, index=True)  # Untuk staff non-admin
    
    # Keamanan
    last_login = db.Column(db.DateTime)
    failed_login_attempts = db.Column(db.Integer, default=0)
    must_reset_password = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    
    # Profile
    profile_picture = db.Column(db.String(255))
    full_name = db.Column(db.String(255))
    
    # Role-based permissions
    permissions = db.Column(db.JSON, default=list)
    groups = db.Column(db.JSON, default=list)  # Untuk grouping permissions
    
    # Login history (relationship)
    login_history = db.relationship('LoginHistory', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    activity_logs = db.relationship('UserActivityLog', backref='user', lazy='dynamic')
    
    # Password handling
    @property
    def password(self):
        raise AttributeError('Password is not readable')
    
    @password.setter
    def password(self, password):
        """Generate password hash"""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        """Verifikasi password"""
        return check_password_hash(self.password_hash, password)
    
    # Authentication methods
    def record_login(self, ip_address=None, user_agent=None, success=True):
        """Catat login"""
        if success:
            self.last_login = datetime.utcnow()
            self.failed_login_attempts = 0
        else:
            self.failed_login_attempts += 1
            
        login_record = LoginHistory(
            user_id=self.id,
            ip_address=ip_address,
            user_agent=user_agent,
            login_success=success
        )
        db.session.add(login_record)
        db.session.commit()
    
    # Permission methods
    def has_permission(self, permission):
        """Cek permission"""
        return self.is_admin or (permission in self.permissions)
    
    def add_permission(self, permission):
        """Tambahkan permission baru"""
        if permission not in self.permissions:
            self.permissions.append(permission)
            db.session.commit()
    
    # Factory methods
    @classmethod
    def create_user(cls, username, password, email=None, is_admin=False):
        """Buat user baru"""
        user = cls(
            username=username,
            email=email,
            is_admin=is_admin
        )
        user.password = password
        db.session.add(user)
        db.session.commit()
        return user
    
    @classmethod
    def create_admin(cls, username, password, email=None):
        """Buat admin user baru"""
        return cls.create_user(username, password, email, is_admin=True)
    
    def __repr__(self):
        return f'<User {self.username} ({"Admin" if self.is_admin else "User"})>'


class LoginHistory(BaseModel):
    """Model untuk mencatat history login semua user"""
    __tablename__ = 'login_history'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    login_time = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.Text)
    login_success = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        status = "success" if self.login_success else "failed"
        return f'<Login {self.user_id} at {self.login_time} ({status})>'


class UserActivityLog(BaseModel):
    """Model untuk mencatat aktivitas user"""
    __tablename__ = 'user_activity_logs'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
    activity_type = db.Column(db.String(50), index=True)
    description = db.Column(db.Text)
    ip_address = db.Column(db.String(50))
    
    def __repr__(self):
        return f'<Activity {self.activity_type} by user {self.user_id}>'