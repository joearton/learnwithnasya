# auth.py (Blueprint)
import os
import re
import time
from datetime import datetime, timezone

# Third-party Imports
from flask import (
    Blueprint, 
    current_app, 
    flash, 
    redirect, 
    render_template, 
    request, 
    url_for
)
from flask_login import (
    current_user, 
    login_required, 
    login_user, 
    logout_user
)
from itsdangerous import URLSafeTimedSerializer
from PIL import Image
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

# Local Imports
from extensions import db
from models import User



auth_bp = Blueprint('auth', __name__)


def get_password_reset_salt():
    return os.environ.get('PASSWORD_RESET_SALT', 'password-reset-salt')


def generate_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=get_password_reset_salt())


def verify_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=get_password_reset_salt(), max_age=expiration)
    except:
        return False
    return email



@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin.index' if current_user.is_admin else 'main.index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.verify_password(password):
            if not user.is_active:
                flash('⚠️ Your account is inactive. Please contact support.', 'warning')
                return redirect(url_for('auth.login'))
            
            login_user(user, remember=remember)
            user.record_login(ip_address=request.remote_addr, 
                             user_agent=request.user_agent.string)
            flash('🎯 Login Success! Ready to slingshot!', 'success')
            return redirect(url_for('admin.index' if user.is_admin else 'main.index'))
        else:
            if user:
                user.record_login(success=False)
            flash('💥 Oops! Wrong credentials! Try again!', 'danger')    
    
    return render_template('auth/login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validation
        errors = False
        
        if User.query.filter_by(username=username).first():
            flash('🚨 Username already taken!', 'danger')
            errors = True
            
        if User.query.filter_by(email=email).first():
            flash('🚨 Email already registered!', 'danger')
            errors = True
            
        if password != confirm_password:
            flash('🔒 Passwords do not match!', 'danger')
            errors = True
            
        if len(password) < 8:
            flash('🔐 Password must be at least 8 characters', 'danger')
            errors = True
            
        if not errors:
            try:
                user = User(
                    username=username,
                    email=email,
                    is_active=True,  # Set to False if email verification required
                    email_verified=False
                )
                user.password = password
                
                db.session.add(user)
                db.session.commit()
                
                # Send verification email here if needed
                flash('🎉 Registration successful! Please login.', 'success')
                return redirect(url_for('auth.login'))
                
            except Exception as e:
                db.session.rollback()
                flash('⚠️ Error creating account. Please try again.', 'danger')
                
    return render_template('auth/register.html')



@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        
        if user:
            try:
                # Generate token
                token = generate_token(user.email)
                reset_url = url_for('auth.reset_password', token=token, _external=True)
                
                # In production, send email here
                print(f"Password reset link: {reset_url}")  # Remove in production
                
                flash('📧 If an account exists with this email, you will receive a reset link', 'info')
                return redirect(url_for('auth.login'))
            except Exception as e:
                flash('⚠️ Error generating reset link', 'danger')
        else:
            flash('📧 If an account exists with this email, you will receive a reset link', 'info')
            return redirect(url_for('auth.login'))
    
    return render_template('auth/forgot_password.html')


@auth_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    email = verify_token(token)
    if not email:
        flash('🔒 Invalid or expired token', 'danger')
        return redirect(url_for('auth.forgot_password'))
    
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('🔒 Invalid or expired token', 'danger')
        return redirect(url_for('auth.forgot_password'))
    
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('🔒 Passwords do not match!', 'danger')
        elif len(password) < 8:
            flash('🔐 Password must be at least 8 characters', 'danger')
        else:
            try:
                user.password = password
                user.must_reset_password = False
                db.session.commit()
                flash('🔑 Password updated successfully! Please login.', 'success')
                return redirect(url_for('auth.login'))
            except:
                db.session.rollback()
                flash('⚠️ Error updating password', 'danger')
    
    return render_template('auth/reset_password.html', token=token)


@auth_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = current_user
    
    if request.method == 'POST':
        # Get form data
        form_data = {
            'full_name': request.form.get('full_name', '').strip(),
            'email': request.form.get('email', '').lower().strip(),
            'username': request.form.get('username', '').lower().strip(),
            'profile_picture': handle_profile_picture_upload(request.files.get('profile_picture'))
        }
        
        # Initialize validation
        errors = False
        validation_messages = []
        
        # Email validation
        if form_data['email'] and form_data['email'] != user.email:
            if not re.match(r'^[^@]+@[^@]+\.[^@]+$', form_data['email']):
                validation_messages.append('Please enter a valid email address')
                errors = True
            elif User.query.filter(User.email == form_data['email'], User.id != user.id).first():
                validation_messages.append('This email is already registered')
                errors = True
        
        # Username validation
        if form_data['username'] != user.username:
            if len(form_data['username']) < 3:
                validation_messages.append('Username must be at least 3 characters')
                errors = True
            elif not re.match(r'^[a-z0-9_]+$', form_data['username']):
                validation_messages.append('Username can only contain lowercase letters, numbers, and underscores')
                errors = True
            elif User.query.filter(User.username == form_data['username'], User.id != user.id).first():
                validation_messages.append('This username is already taken')
                errors = True
        
        # Handle validation messages
        if validation_messages:
            flash('<br>'.join(validation_messages), 'danger')
        
        # Update profile if no errors
        if not errors:
            try:
                update_user_profile(user, form_data)
                db.session.commit()
                
                flash('Your profile has been updated successfully!', 'success')
                if form_data['email'] != user.email:
                    flash('Please verify your new email address', 'warning')
                
                return redirect(url_for('auth.profile'))
            
            except Exception as e:
                db.session.rollback()
                current_app.logger.error(f'Profile update error: {str(e)}', exc_info=True)
                flash('An error occurred while updating your profile. Please try again.', 'danger')
    
    return render_template('auth/profile.html', user=user)


def handle_profile_picture_upload(file):
    """Process and validate profile picture upload"""
    if not file or file.filename == '':
        return None
    
    try:
        # Validate file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if file_ext not in allowed_extensions:
            raise ValueError('Only image files (PNG, JPG, JPEG, GIF) are allowed')
        
        # Validate file size (2MB max)
        max_size = 2 * 1024 * 1024  # 2MB
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        if file_size > max_size:
            raise ValueError(f'File size exceeds {max_size//(1024*1024)}MB limit')
        
        # Generate secure filename
        filename = f"{current_user.id}_{int(time.time())}.{file_ext}"
        filename = secure_filename(filename)
        upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_pictures')
        
        # Ensure upload directory exists
        os.makedirs(upload_dir, exist_ok=True)
        upload_path = os.path.join(upload_dir, filename)
        
        # Process image
        with Image.open(file) as img:
            # Convert to RGB if RGBA
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Resize while maintaining aspect ratio
            img.thumbnail((500, 500))
            
            # Save optimized image
            img.save(upload_path, quality=85, optimize=True)
        
        return url_for('static', filename=f'uploads/profile_pictures/{filename}', _external=True)
    
    except Exception as e:
        current_app.logger.warning(f'Profile picture upload error: {str(e)}')
        flash(f'Profile picture error: {str(e)}', 'warning')
        return None


def update_user_profile(user, form_data):
    """Update user profile attributes"""
    if form_data['full_name'] is not None:
        user.full_name = form_data['full_name'] or None
    
    if form_data['email'] and form_data['email'] != user.email:
        user.email = form_data['email']
        user.email_verified = False
    
    if form_data['username'] != user.username:
        user.username = form_data['username']
    
    if form_data['profile_picture']:
        # Delete old profile picture if it exists
        if user.profile_picture and 'uploads/profile_pictures' in user.profile_picture:
            try:
                old_filename = user.profile_picture.split('/')[-1]
                old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 
                                      'profile_pictures', 
                                      old_filename)
                if os.path.exists(old_path):
                    os.remove(old_path)
            except Exception as e:
                current_app.logger.error(f'Error deleting old profile picture: {str(e)}')
        
        user.profile_picture = form_data['profile_picture']
    
    user.updated_at = datetime.now(timezone.utc)
    
    

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('🕊️ You flew away safely! Come back soon!', 'info')
    return redirect(url_for('auth.login'))