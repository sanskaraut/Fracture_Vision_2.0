"""
YOLO-based fracture detection module
"""
import os
import cv2
import numpy as np
from ultralytics import YOLO
from typing import Dict, Tuple, Optional


class FractureDetector:
    """YOLO-based fracture detector for X-ray images"""
    
    def __init__(self, model_path: str = "./models/extracted/best"):
        """
        Initialize fracture detector with YOLO model
        
        Args:
            model_path: Path to YOLO model file or directory
        """
        self.model_path = model_path
        self.model = None
        self._load_model()
    
    def _load_model(self):
        """Load YOLO model"""
        # Check if path is a .zip file and extract it temporarily
        if self.model_path.endswith('.zip'):
            import zipfile
            import tempfile
            
            try:
                # Extract to temp directory
                temp_dir = tempfile.mkdtemp()
                with zipfile.ZipFile(self.model_path, 'r') as zip_ref:
                    zip_ref.extractall(temp_dir)
                
                # Find the extracted model (usually named 'best' or similar)
                extracted_files = os.listdir(temp_dir)
                if extracted_files:
                    # Use the first directory/file found
                    self.model_path = os.path.join(temp_dir, extracted_files[0])
                    print(f"📦 Extracted model to: {self.model_path}")
            except Exception as e:
                print(f"⚠️  Could not extract zip file: {e}")
                return
        
        if not os.path.exists(self.model_path):
            print(f"⚠️ Warning: YOLO model not found at {self.model_path}")
            print("   Fracture detection will use fallback mode")
            return
        
        try:
            self.model = YOLO(self.model_path)
            print(f"✅ YOLO model loaded successfully from {self.model_path}")
        except Exception as e:
            print(f"❌ Error loading YOLO model: {e}")
            self.model = None
    
    def detect_fractures(
        self, 
        image: np.ndarray,
        center: Tuple[int, int]
    ) -> Dict[str, Tuple[int, int]]:
        """
        Detect fractures in X-ray image
        Implementation from ML developer's notebook
        
        Args:
            image: Input X-ray image (numpy array)
            center: Center point (cx, cy) for coordinate transformation
            
        Returns:
            Dictionary mapping bone names to fracture coordinates
            Format: {'ulna_break': (x, y), 'radius_break': (x, y)}
        """
        if self.model is None:
            return self._fallback_detection(center)
        
        try:
            # Run YOLO detection
            results = self.model(image)
            boxes = results[0].boxes.xyxy.cpu().numpy()
            
            h, w = image.shape[:2]
            cx, cy = center
            
            Xray_breaks = {}
            
            if len(boxes) == 0:
                print("❌ No fractures detected.")
            elif len(boxes) == 1:
                # Single fracture detected
                x1, y1, x2, y2 = boxes[0]
                x_center = (x1 + x2) / 2
                y_center = (y1 + y2) / 2
                if x_center < cx:
                    Xray_breaks['radius_break'] = (int(x_center - cx), int((h // 2) - y_center))
                    print("→ radius fracture")
                else:
                    Xray_breaks['ulna_break'] = (int(x_center - cx), int((h // 2) - y_center))
                    print("→ ulna fracture")
            else:
                # Multiple fractures detected
                for box in boxes:
                    x1, y1, x2, y2 = box
                    x_center = (x1 + x2) / 2
                    y_center = (y1 + y2) / 2
                    if x_center < cx and 'radius_break' not in Xray_breaks:
                        Xray_breaks['radius_break'] = (int(x_center - cx), int((h // 2) - y_center))
                        print("→ radius fracture")
                    elif x_center >= cx and 'ulna_break' not in Xray_breaks:
                        Xray_breaks['ulna_break'] = (int(x_center - cx), int((h // 2) - y_center))
                        print("→ ulna fracture")
            
            if Xray_breaks:
                print(f"\n--> Detected Fracture Points (centered):")
                for k, v in Xray_breaks.items():
                    print(f"{k} → {v}")
            
            return Xray_breaks
            
        except Exception as e:
            print(f"❌ Error during YOLO detection: {e}")
            return self._fallback_detection(center)
    
    def _fallback_detection(self, center: Tuple[int, int]) -> Dict[str, Tuple[int, int]]:
        """
        Fallback detection when YOLO is unavailable
        Returns mock fracture positions
        """
        print("ℹ️ Using fallback fracture detection")
        return {
            'ulna_break': (50, 100),
            'radius_break': (-30, 80)
        }
    
    @property
    def is_loaded(self) -> bool:
        """Check if YOLO model is properly loaded"""
        return self.model is not None
