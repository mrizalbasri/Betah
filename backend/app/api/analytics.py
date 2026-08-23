from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from app.api.employees import load_employee_data

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=Dict[str, Any])
async def get_analytics_summary():
    """
    Mengembalikan data ringkasan analitik statistik perusahaan untuk Header Cards & Grafik Dashboard.
    """
    try:
        data = load_employee_data()
        total_employees = len(data)
        
        if total_employees == 0:
            return {
                "overview": {},
                "department_breakdown": [],
                "top_company_factors": []
            }
            
        high_risk_employees = [emp for emp in data if emp.get("prediction") == "Yes" or emp.get("risk_score_percentage", 0) >= 50.0]
        low_risk_employees = [emp for emp in data if emp.get("prediction") != "Yes" and emp.get("risk_score_percentage", 0) < 50.0]
        
        high_risk_count = len(high_risk_employees)
        low_risk_count = len(low_risk_employees)
        high_risk_percentage = round((high_risk_count / total_employees) * 100, 2)
        
        # Hitung Rata-rata Gaji Bulanan (MonthlyIncome)
        income_high_risk = [emp.get("MonthlyIncome", 0) for emp in high_risk_employees]
        income_low_risk = [emp.get("MonthlyIncome", 0) for emp in low_risk_employees]
        
        avg_income_high_risk = round(sum(income_high_risk) / len(income_high_risk), 2) if income_high_risk else 0.0
        avg_income_low_risk = round(sum(income_low_risk) / len(income_low_risk), 2) if income_low_risk else 0.0
        
        # Breakdown Risiko per Departemen
        dept_map = {}
        for emp in data:
            dept = emp.get("Department", "Unknown")
            if dept not in dept_map:
                dept_map[dept] = {"total": 0, "high_risk": 0, "incomes": []}
                
            dept_map[dept]["total"] += 1
            dept_map[dept]["incomes"].append(emp.get("MonthlyIncome", 0))
            if emp.get("prediction") == "Yes" or emp.get("risk_score_percentage", 0) >= 50.0:
                dept_map[dept]["high_risk"] += 1
                
        department_breakdown = []
        for dept_name, stats in dept_map.items():
            t = stats["total"]
            hr = stats["high_risk"]
            hr_pct = round((hr / t) * 100, 2) if t > 0 else 0.0
            avg_inc = round(sum(stats["incomes"]) / len(stats["incomes"]), 2) if stats["incomes"] else 0.0
            
            department_breakdown.append({
                "department": dept_name,
                "total_employees": t,
                "high_risk_count": hr,
                "high_risk_percentage": hr_pct,
                "avg_monthly_income": avg_inc
            })
            
        # Top 5 Faktor Penyebab Resign Terbanyak (Global Summary)
        factor_counts = {}
        for emp in high_risk_employees:
            tf = emp.get("top_factor", "Lainnya")
            factor_counts[tf] = factor_counts.get(tf, 0) + 1
            
        sorted_factors = sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)
        top_company_factors = [
            {"factor": factor, "count": count, "percentage": round((count / high_risk_count) * 100, 2) if high_risk_count > 0 else 0.0}
            for factor, count in sorted_factors[:5]
        ]

        return {
            "overview": {
                "total_employees": total_employees,
                "high_risk_count": high_risk_count,
                "low_risk_count": low_risk_count,
                "high_risk_percentage": high_risk_percentage,
                "avg_monthly_income_high_risk": avg_income_high_risk,
                "avg_monthly_income_low_risk": avg_income_low_risk
            },
            "department_breakdown": department_breakdown,
            "top_company_factors": top_company_factors
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses analitik summary: {str(e)}")
