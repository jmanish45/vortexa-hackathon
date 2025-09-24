from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import json
import cv2
import base64
import io

from main import full_diagnosis_pipeline

app = FastAPI(title="AI Medical Diagnosis API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_remedies():
  try:
    with open("genAI.json", "r") as f:
      return json.load(f)
  except FileNotFoundError:
    print("Error: genAI.json file not found.")
    return {}

@app.post("/diagnose")
async def diagnose_plant(
    image: UploadFile = File(...),
    env_data: str = Form(...),
):
  try:
    env_data_dict = json.loads(env_data)
  except json.JSONDecodeError:
    return JSONResponse(
      status_code=400,
      content={"message": "Invalid JSON format for env_data"}
    )

  with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
    temp_file.write(await image.read())
    temp_file_path = temp_file.name

  try:
    explaination_img, prompt, prediction = full_diagnosis_pipeline(
      image_path=temp_file_path,
      env_data=env_data_dict
    )

    remedies = load_remedies()

    disease_name = prediction.get("disease", "")
    remedy = remedies.get(disease_name, "No remedy found for this disease.")

    _, img_encoded = cv2.imencode('.jpg', explaination_img)
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')

    os.unlink(temp_file_path)

    return {
      "prediction" : prediction,
      "remedy" : remedy,
      "explanation_img": img_base64
    }
  
  except Exception as e:
    if os.path.exists(temp_file_path):
      os.unlink(temp_file_path)
    
    return JSONResponse(
      status_code=500,
      content={"message": f"An error occurred: {str(e)}"}
    )
  
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

