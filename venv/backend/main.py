from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import shutil
from typing import Optional

# Import your database models
from .database import Base, engine, SessionLocal, Plant, Diagnosis, Location

# Geocoding library
from geopy.geocoders import Nominatim

# Assuming these files are in your inference folder
from inference.predictor import DiseasePredictor
from inference.xai import XAIProcess
import cv2

# Initialize your FastAPI app and create tables
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Geocoder instance
geolocator = Nominatim(user_agent="geotag_app")

# Your existing diagnosis function
def full_diagnosis_pipeline(image_path: str, env_data: dict):
    predictor = DiseasePredictor("best_model.keras")
    xai_processor = XAIProcess(predictor.model)
    prediction = predictor.predict(image_path)
    img = predictor.preprocess_image(image_path)
    explanation_img = xai_processor.multi_model_gradcam(img)
    prompt = predictor.generate_prompt(prediction, env_data)
    
    return explanation_img, prompt, prediction

# Pydantic model for environment data
class EnvData(BaseModel):
    location: str
    temp: Optional[int] = None
    humidity: Optional[int] = None
    soil_status: Optional[str] = None
    weather: Optional[str] = None

# New endpoint to receive the diagnosis data
@app.post("/diagnose")
async def diagnose_image(
    file: UploadFile = File(...), 
    env_data: EnvData = Depends(),
    db: Session = Depends(get_db)
):
    # Save the uploaded image temporarily
    temp_file_path = f"temp_{file.filename}"
    try:
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Run the diagnosis pipeline
    explanation_img, prompt, prediction_result = full_diagnosis_pipeline(
        temp_file_path,
        env_data.dict()
    )

    # Geocode the location
    location_obj = geolocator.geocode(env_data.location)
    latitude = location_obj.latitude if location_obj else None
    longitude = location_obj.longitude if location_obj else None

    # Store data in the database
    new_plant = Plant(image_path=temp_file_path)
    db.add(new_plant)
    db.commit()

    new_location = Location(
        location_name=env_data.location,
        latitude=latitude,
        longitude=longitude
    )
    db.add(new_location)
    db.commit()

    new_diagnosis = Diagnosis(
        disease=prediction_result,
        prompt=prompt,
        plant=new_plant,
        location=new_location
    )
    db.add(new_diagnosis)
    db.commit()

    return {
        "prediction": prediction_result,
        "prompt": prompt,
        "explanation_img": "base64_encoded_img", # You will need to encode the image here
        "latitude": latitude,
        "longitude": longitude
    }