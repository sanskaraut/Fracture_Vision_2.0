# Backend V2 - Bone Fracture Detection API

Advanced fracture detection system with integrated YOLO machine learning model.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip

### Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the server**:
   ```bash
   python -m uvicorn app:app --reload --host 0.0.0.0 --port 8001
   ```

The API will be available at `http://localhost:8001`

## 📁 Project Structure

```
backend_v2/
├── app.py                  # Main FastAPI application
├── utils/
│   ├── geometry.py         # Fracture geometry calculations
│   └── yolo_detector.py    # YOLO model integration
├── models/
│   └── yolo_fracture.pt    # YOLO detection model
├── .env                    # Configuration (not committed)
├── .env.example            # Configuration template
└── requirements.txt        # Dependencies
```

## 🔧 Configuration

Edit `.env` file:

```env
# YOLO Model
YOLO_MODEL_PATH=./models/yolo_fracture.pt

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📡 API Endpoints

### Health Check
```
GET /
```

### Upload X-ray
```
POST /upload/xray
Content-Type: multipart/form-data

Response:
{
  "session_id": "session_0",
  "image_base64": "data:image/jpeg;base64,...",
  "width": 1920,
  "height": 1080,
  "fractures_detected": 2,
  "fracture_types": ["ulna_break", "radius_break"]
}
```

### Upload 3D Model
```
POST /upload/model?session_id=session_0
Content-Type: multipart/form-data
```

### Process Landmarks
```
POST /process/landmarks
Content-Type: application/json

Body:
{
  "session_id": "session_0",
  "landmarks": [
    {"x": 100, "y": 200, "label": "ulna_head"},
    {"x": 120, "y": 400, "label": "ulna_tail"},
    {"x": 150, "y": 210, "label": "radius_head"},
    {"x": 170, "y": 410, "label": "radius_tail"}
  ]
}

Response:
{
  "fractures": [
    {
      "bone": "ulna",
      "damage": "crack",
      "location": 0.45,
      "top_angle": 12.5,
      "bottom_angle": -8.3,
      "severity": "moderate"
    }
  ],
  "confidence": 0.92,
  "detected_bones": ["ulna"]
}
```

## 🧪 Testing

Test the API is running:
```bash
curl http://localhost:8001/
```

Expected response:
```json
{
  "message": "Bone Fracture Detection API V2",
  "version": "2.0",
  "yolo_loaded": true,
  "status": "running"
}
```

## 🎯 Features

- ✅ **Real YOLO Detection**: Automatic fracture detection on X-ray upload
- ✅ **Accurate Geometry**: Uses proven geometry functions from original code
- ✅ **3D Deformation**: Realistic bone fracture visualization
- ✅ **Session Management**: Handle multiple concurrent sessions
- ✅ **Auto-reload**: Development mode with hot-reloading
- ✅ **Error Handling**: Comprehensive error handling and logging

## 🔗 Frontend Integration

Update your frontend's `.env`:
```env
VITE_API_URL=http://localhost:8001
```

## 📦 Deployment

For production deployment (e.g., Render):

The `Procfile` is configured:
```
web: uvicorn app:app --host 0.0.0.0 --port $PORT
```

Environment variables to set:
- `YOLO_MODEL_PATH`
- `GROQ_API_KEY` (if using Groq features)
- `CORS_ORIGINS` (your frontend URL)

## 🐛 Troubleshooting

### YOLO model not loading
- Verify `models/yolo_fracture.pt` exists
- Check `YOLO_MODEL_PATH` in `.env`
- Model will fallback to mock detection if unavailable

### Port already in use
- Change `PORT` in `.env`
- Or use: `--port XXXX` flag

### CORS errors
- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Format: `http://localhost:5173,https://yourdomain.com`

## 📝 License

Part of Fracture Vision 2.0 project
