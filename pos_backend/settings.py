"""
Django settings for pos_backend project.

Optimized for: React / Vite Frontend API Integration
Production Cloud Profile: Render & Vercel
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-j_bk*f8%6)n)=*_t11$4t208y7*bi-99qr737j14bsu@*m6k$3'

# 🎯 SECURITY WARNING: Switch debug OFF in production so error trace grids remain hidden
DEBUG = False

# 🎯 SECURITY ALLOWLIST: Grant explicit routing clearance to your live Render server domain
ALLOWED_HOSTS = [
    'deveronig-backend.onrender.com',
    'localhost',
    '127.0.0.1'
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 🌟 REST FRAMEWORK & SECURITY EXTENSIONS
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    
    # 🌟 CORE APPS
    'sales',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    
    # 🎯 WHITE NOISE STATIC ROUTER (Optional addition if running admin styles on simple free servers)
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    # 🌟 CORS HEADERS MIDDLEWARE (Must remain right here above CommonMiddleware)
    'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pos_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pos_backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

# 🌟 Localized to East Africa Time zone layout for accurate transactional receipts
TIME_ZONE = 'Africa/Nairobi'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/6.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# 🌟 FRONTEND API GATEWAY TUNING
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    # Enforce safe default restriction metrics across endpoints unless explicitly overridden in views
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    # 🌟 Always format errors and metadata responses into clean JSON datasets for React
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer', # Keeps your browser testing view readable
    ],
}

# 🌟 EXPLICIT REVENUE PLATFORM SECURITY RULES
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Default standard React app port
    "http://localhost:5173",  # Standard Vite engine asset routing port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    # 🎯 TODO: Once Vercel gives you your frontend link tomorrow morning, paste it right here!
    # "https://deveronig-pos.vercel.app"
]

# 🌟 Allow React to read standard cross-origin verification headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Since your file has CORS_ALLOW_ALL_ORIGINS active at the bottom, we preserve it 
# so your React app can safely perform handshakes without CORS blockages.
CORS_ALLOW_ALL_ORIGINS = True