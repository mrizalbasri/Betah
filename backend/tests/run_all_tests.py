#!/usr/bin/env python
import os
import sys
import subprocess
import time

TEST_FILES = [
    "test_auth.py",
    "test_employees.py",
    "test_predict.py",
    "test_analytics.py",
    "test_chat.py",
    "test_rag.py"
]

def run_suite():
    print("=" * 60)
    print("      BETAH BACKEND SUITE RUNNER -- PYTEST / UNIT TESTS     ")
    print("=" * 60 + "\n")

    results = []
    python_exe = os.path.join(os.path.dirname(__file__), "..", ".venv", "Scripts", "python.exe")
    if not os.path.exists(python_exe):
        python_exe = sys.executable

    tests_dir = os.path.dirname(os.path.abspath(__file__))

    for test_file in TEST_FILES:
        filepath = os.path.join(tests_dir, test_file)
        if not os.path.exists(filepath):
            print(f"[-] File {test_file} tidak ditemukan, skip.")
            continue

        print(f"[*] Menjalankan {test_file}...")
        start_t = time.time()
        res = subprocess.run([python_exe, filepath], capture_output=True, text=True)
        elapsed = round(time.time() - start_t, 2)

        if res.returncode == 0:
            results.append((test_file, "PASSED", elapsed, res.stdout))
            print(f"    [V] {test_file} PASSED ({elapsed}s)")
        else:
            results.append((test_file, "FAILED", elapsed, res.stderr or res.stdout))
            print(f"    [X] {test_file} FAILED ({elapsed}s)")

    print("\n" + "=" * 60)
    print("                    HASIL AKHIR RINGKASAN TEST              ")
    print("=" * 60)
    passed_count = sum(1 for r in results if r[1] == "PASSED")
    total_count = len(results)
    
    for filename, status, duration, output in results:
        indicator = "[PASS]" if status == "PASSED" else "[FAIL]"
        print(f"{indicator:8} | {filename:20} | {duration}s")
        if status == "FAILED":
            print(f"   Error Output:\n{output.strip()}\n")

    print("=" * 60)
    print(f"TOTAL: {passed_count}/{total_count} PASSED ({round((passed_count/total_count)*100, 1) if total_count > 0 else 0}%)")
    print("=" * 60)

if __name__ == "__main__":
    run_suite()
