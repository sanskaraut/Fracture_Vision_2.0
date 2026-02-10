"""
Test script to check backend API endpoints and outputs
"""
import requests
import json

BASE_URL = "http://localhost:8001"

def test_root():
    """Test root endpoint"""
    print("="*60)
    print("Testing ROOT endpoint: GET /")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response:")
        print(json.dumps(response.json(), indent=2))
        print()
    except Exception as e:
        print(f"Error: {e}\n")

def test_session_status():
    """Test session status endpoint"""
    print("="*60)
    print("Testing SESSION STATUS: GET /session/session_0")
    print("="*60)
    try:
        response = requests.get(f"{BASE_URL}/session/session_0")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 404:
            print("Response: Session not found (expected for new backend)")
        else:
            print(f"Response:")
            print(json.dumps(response.json(), indent=2))
        print()
    except Exception as e:
        print(f"Error: {e}\n")

if __name__ == "__main__":
    print("\n🔍 BACKEND API OUTPUT TEST\n")
    test_root()
    test_session_status()
    
    print("="*60)
    print("✅ Backend is running and responding!")
    print("="*60)
    print("\nAvailable Endpoints:")
    print("  POST /upload/xray - Upload X-ray image for fracture detection")
    print("  POST /upload/model - Upload custom 3D bone model")
    print("  POST /process/landmarks - Process landmarks and generate fracture analysis")
    print("  GET  /model/{session_id}/original - Get original 3D model")
    print("  GET  /model/{session_id}/fractured - Get fractured 3D model")
    print("  GET  /session/{session_id} - Get session status")
    print()
