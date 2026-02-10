"""
Medical RAG Analysis Module
Based on ML developer's notebook (lines 740-854)
Analyzes fracture data to identify at-risk anatomical structures
"""
import json
import os
from typing import Dict, List, Any, Optional
from langchain_groq import ChatGroq


def build_medical_prompt(fracture_data: List[Dict]) -> str:
    """
    Build prompt for medical analysis
    Based on notebook lines 776-814
    
    Args:
        fracture_data: List of fracture information dictionaries
        
    Returns:
        Formatted prompt string
    """
    fracture_json = json.dumps(fracture_data, indent=2)
    
    # Simplified medical context (without ChromaDB)
    medical_context = """
    FOREARM ANATOMY REFERENCE:
    
    RADIUS (Lateral bone):
    - Radial artery: Runs along the lateral/thumb side of the forearm
    - Superficial radial nerve: Provides sensation to back of hand
    - At risk in: Distal and middle third fractures
    
    ULNA (Medial bone):
    - Ulnar artery: Runs along the medial/pinky side
    - Ulnar nerve: Passes behind medial epicondyle, controls hand muscles
    - Median nerve: Can be affected in severe displaced fractures
    - At risk in: Proximal and middle third fractures
    
    FRACTURE LOCATION RISK:
    - Proximal (0.0-0.3): Nerve damage more common
    - Middle (0.3-0.7): Both vessel and nerve risk
    - Distal (0.7-1.0): Vessel damage more common
    
    ANGULATION SEVERITY:
    - Mild (<8°): Low risk of vascular/nerve damage
    - Moderate (8-15°): Moderate risk, close monitoring needed
    - Severe (>15°): High risk of neurovascular compromise
    """
    
    prompt = f"""You are a medical reasoning assistant analyzing forearm fractures.

### Context:
{medical_context}

### Input Data (JSON):
{fracture_json}

### Task:
Based on the fracture location, bone involved, and angulation:

1. Identify ONLY the blood vessel(s) or nerve(s) that are MOST likely to be damaged.
2. Ignore structures with low or moderate risk.
3. Focus only on the highest-risk structure(s).

### Output Format:
Return ONLY a valid JSON object in this exact format:

{{
  "most_likely_damaged_structures": [
    "name_1",
    "name_2"
  ],
  "explanation": "One clear medical paragraph explaining why these structures are most at risk based on anatomy and fracture pattern."
}}

### Rules:
1. Include only high-risk structures (artery, vein, or nerve).
2. Use standard anatomical names (e.g., radial artery, median nerve).
3. "explanation" must be ONE paragraph (3–5 sentences).
4. Output MUST be strict JSON.
5. No markdown. No extra text.
6. Use double quotes only.
"""
    
    return prompt


def extract_json(text: str) -> str:
    """
    Extract JSON object from LLM response
    Based on notebook lines 816-824
    
    Args:
        text: Raw LLM response text
        
    Returns:
        Extracted JSON string
        
    Raises:
        ValueError: If no valid JSON found
    """
    start = text.find("{")
    end = text.rfind("}")
    
    if start == -1 or end == -1:
        raise ValueError("No JSON found in LLM output")
    
    return text[start:end + 1]


def analyze_fracture_risk(
    fracture_data: List[Dict],
    api_key: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Analyze fracture data to identify at-risk anatomical structures
    Based on notebook lines 826-854
    
    Args:
        fracture_data: List of fracture dictionaries with bone, location, angles
        api_key: Groq API key (reads from env if not provided)
        
    Returns:
        Dictionary with 'most_likely_damaged_structures' and 'explanation'
        Returns None if analysis fails
    """
    if not fracture_data:
        return None
    
    # Get API key
    if api_key is None:
        api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        print("⚠️ GROQ_API_KEY not found, skipping medical analysis")
        return None
    
    try:
        # Initialize LLM (based on notebook line 830)
        llm = ChatGroq(
            api_key=api_key,
            model="llama-3.1-8b-instant"
        )
        
        # Build prompt (based on notebook line 833)
        prompt = build_medical_prompt(fracture_data)
        
        # Get LLM response (based on notebook line 835)
        response_text = llm.invoke(prompt).content.strip()
        
        print("\n===== RAW LLM OUTPUT =====")
        print(response_text)
        print("==========================\n")
        
        # Extract and parse JSON (based on notebook lines 842-843)
        clean_json = extract_json(response_text)
        output_data = json.loads(clean_json)
        
        print("✅ Medical analysis complete")
        return output_data
        
    except Exception as e:
        print(f"❌ Medical analysis failed: {e}")
        return None


def get_medical_analysis(fracture_results: List[Dict]) -> Optional[Dict]:
    """
    Convenience wrapper for medical analysis
    
    Args:
        fracture_results: Fracture data from /process/landmarks
        
    Returns:
        Medical analysis dictionary or None
    """
    return analyze_fracture_risk(fracture_results)
