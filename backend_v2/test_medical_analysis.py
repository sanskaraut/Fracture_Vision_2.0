"""
Test script for medical analysis module
"""
import sys
sys.path.insert(0, '.')

from utils.medical_rag import analyze_fracture_risk
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

# Test data
fractures = [
    {
        "bone": "radius",
        "damage": "crack",
        "location": 0.321,
        "top_angle": -21.69,
        "bottom_angle": 6.63,
        "severity": "severe"
    },
    {
        "bone": "ulna",
        "damage": "crack",
        "location": 0.332,
        "top_angle": -18.4,
        "bottom_angle": 6.37,
        "severity": "severe"
    }
]

print("Testing medical analysis...")
print(f"GROQ_API_KEY present: {bool(os.getenv('GROQ_API_KEY'))}")
print()

result = analyze_fracture_risk(fractures)

if result:
    print("\n✅ Medical Analysis Result:")
    print(f"Damaged Structures: {result.get('most_likely_damaged_structures')}")
    print(f"\nExplanation: {result.get('explanation')}")
else:
    print("\n❌ No result returned")
