import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

import psycopg2
from app.api.auth import DEMO_USERS

DATABASE_URL = os.getenv("DATABASE_URL")

def init_neon_db():
    print(f"[*] Menghubungkan ke Neon PostgreSQL Database...")
    if not DATABASE_URL or "localhost" in DATABASE_URL:
        print("[!] Error: DATABASE_URL belum diatur ke Neon PostgreSQL di backend/.env")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("[+] Koneksi ke Neon PostgreSQL BERHASIL!")

        # 1. Buat Tabel Users (HR Manager Users)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(50) NOT NULL,
            department VARCHAR(100) NOT NULL,
            avatar TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("[+] Tabel 'users' berhasil dibuat/diverifikasi.")

        # 2. Buat Tabel Prediction Logs (Riwayat Prediksi Attrition & SHAP)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS prediction_logs (
            id SERIAL PRIMARY KEY,
            employee_id INT,
            job_role VARCHAR(100),
            department VARCHAR(100),
            attrition_risk_percentage FLOAT NOT NULL,
            prediction VARCHAR(10) NOT NULL,
            top_factors JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("[+] Tabel 'prediction_logs' berhasil dibuat/diverifikasi.")

        # 3. Seed Users dari DEMO_USERS jika belum ada
        for email, user in DEMO_USERS.items():
            cursor.execute("SELECT id FROM users WHERE email = %s;", (email,))
            if not cursor.fetchone():
                cursor.execute("""
                INSERT INTO users (id, name, email, password, role, department, avatar)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
                """, (
                    user["id"],
                    user["name"],
                    user["email"],
                    user["password"],
                    user["role"],
                    user["department"],
                    user["avatar"]
                ))
                print(f"[+] User '{user['name']}' ({email}) berhasil di-seed ke Neon DB.")

        conn.commit()
        cursor.close()
        conn.close()

        print("\n[V] INSIALISASI NEON POSTGRESQL DATABASE SUKSES 100%!")

    except Exception as e:
        print(f"[!] Error saat inisialisasi Neon Database: {e}")

if __name__ == "__main__":
    init_neon_db()
