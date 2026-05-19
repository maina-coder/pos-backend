from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # Opens your built-in database administration dashboard
    path('admin/', admin.site.urls),
    
    # 🔐 AUTHENTICATION ENDPOINT
    # When a cashier sends their username/password here, it returns a secure token pass-key
    path('api/auth/login/', obtain_auth_token, name='api_login'),
    
    # 🧾 CORE BUSINESS ENDPOINTS
    # This pulls in all the individual routes we just wrote inside sales/urls.py
    path('api/', include('sales.urls')),
]