# auth.py (Blueprint)
from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from extensions import db
from models import User
from itsdangerous import URLSafeTimedSerializer
from flask import current_app
from datetime import datetime
import os

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



@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('🕊️ You flew away safely! Come back soon!', 'info')
    return redirect(url_for('auth.login'))