import os
import django

# Set up Django environment engines
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pos_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Your final administrative access profile setup
username = "GraceMuthoni"
email = "grace@deveronig.com"
password = "1234567890"

if not User.objects.filter(username=username).exists():
    print(f"🚀 Creating cloud superuser profile for {username}...")
    User.objects.create_superuser(username=username, email=email, password=password)
    print("✅ Cloud superuser created successfully!")
else:
    print(f"ℹ️ User {username} already exists in the cloud database profile.")