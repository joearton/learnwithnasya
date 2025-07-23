import os
from dotenv import load_dotenv
from extensions import db, login_manager


load_dotenv()


def create_default_admin_user():
    # Import model setelah db diinisialisasi untuk menghindari circular imports
    from models import User
    
   # Setup user loader supaya bisa diindex oleh Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Cek apakah admin user sudah ada, jika tidak buat
    admin_username = os.getenv('ADMIN_USERNAME')
    admin_email = os.getenv('ADMIN_EMAIL')
    admin_password = os.getenv('ADMIN_PASSWORD')
    
    if not admin_username:
        print("Warning: ADMIN_USERNAME not set in environment variables")
    else:
        # Cek apakah user admin sudah ada
        admin_user = User.query.filter_by(username=admin_username, is_admin=True).first()
        
        if not admin_user:
            try:
                # Buat user admin baru
                admin = User(
                    username=admin_username,
                    email=admin_email,
                    is_admin=True,
                    is_active=True,
                    email_verified=True
                )
                admin.password = admin_password
                
                db.session.add(admin)
                db.session.commit()
                print(f"Admin user '{admin_username}' created successfully!")
                
                # Catat aktivitas
                admin.record_login()
                print(f"Initial login recorded for admin '{admin_username}'")
                
            except Exception as e:
                db.session.rollback()
                print(f"Error creating admin user: {str(e)}")
        else:
            print(f"Admin user '{admin_username}' already exists")
            
            # Update jika ada perubahan di env
            needs_update = False
            if admin_email and admin_user.email != admin_email:
                admin_user.email = admin_email
                needs_update = True
                
            if admin_password and not admin_user.verify_password(admin_password):
                admin_user.password = admin_password
                needs_update = True
                
            if needs_update:
                try:
                    db.session.commit()
                    print(f"Admin user '{admin_username}' updated")
                except Exception as e:
                    db.session.rollback()
                    print(f"Error updating admin user: {str(e)}")
