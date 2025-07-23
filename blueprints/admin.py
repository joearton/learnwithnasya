from flask import redirect, url_for, request
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuLink
from flask_login import current_user
from extensions import db
from models import *


class MyAdminIndexView(AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('auth.login', next=request.url))



# Base Secure Model View
class SecureModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('auth.login', next=request.url))


class UserView(SecureModelView):
    column_exclude_list = ['password_hash']
    column_searchable_list = ['username', 'email']
    column_filters = ['is_admin', 'is_active', 'created_at']
    column_editable_list = ['is_active', 'email_verified']
    form_excluded_columns = ['login_history', 'activity_logs']


class LoginHistoryView(SecureModelView):
    column_list = ['user', 'login_time', 'ip_address', 'login_success']
    column_labels = {
        'user': 'User',
        'login_time': 'Login Time',
        'ip_address': 'IP Address',
        'login_success': 'Success'
    }
    column_sortable_list = ['login_time']
    column_default_sort = ('login_time', True)
    page_size = 20
    can_create = False
    can_edit = False
    can_delete = False
    
    # Disable is_active check for this model
    def scaffold_form(self):
        form_class = super(LoginHistoryView, self).scaffold_form()
        return form_class
    
    
class UserActivityLogView(SecureModelView):
    column_list = ['user', 'activity_type', 'description', 'created_at']
    column_searchable_list = ['activity_type', 'description']
    column_filters = ['activity_type', 'created_at']
    column_labels = {
        'user': 'User',
        'activity_type': 'Activity Type',
        'description': 'Description'
    }
    form_widget_args = {
        'description': {
            'rows': 5,
            'style': 'font-family: monospace;'
        }
    }
    can_create = False
        
        
        
def init_app(app):
    # Gunakan nama yang unik untuk endpoint Flask-Admin
    game_admin = Admin(
        app,
        name='Game Admin',
        template_mode='bootstrap3',
        index_view = MyAdminIndexView(),
        url='/game-admin',
    )
    
    # Tambahkan semua view ke admin
    game_admin.add_view(UserView(
        User, 
        db.session, 
        name='Users',
        endpoint='admin-users',
        category='User Management'
    ))
    
    game_admin.add_view(LoginHistoryView(
        LoginHistory,
        db.session,
        name='Login History',
        endpoint='admin-login-history',
        category='Logs'
    ))
    
    game_admin.add_view(UserActivityLogView(
        UserActivityLog,
        db.session,
        name='Activity Logs',
        endpoint='admin-activity-logs',
        category='Logs'
    ))
    
    # Tambahkan link logout
    game_admin.add_link(MenuLink(
        name='Logout',
        url='/logout',
        icon_type='fa',
        icon_value='fa-sign-out'
    ))
    
    # Tambahkan link kembali ke situs utama
    game_admin.add_link(MenuLink(
        name='Back to Site',
        url='/',
        icon_type='fa',
        icon_value='fa-home'
    ))    