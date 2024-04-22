import base64
import os

import pyrebase

config = {
    'apiKey': "AIzaSyAhCKUMbP8GGtwkAaAEV38dKWzn6BcxS5Y",
    'authDomain': "neural-st.firebaseapp.com",
    'projectId': "neural-st",
    'measurementId': "G-7YF88TGD3Y",
    'storageBucket': "neural-st.appspot.com",
    'messagingSenderId': "690387462569",
    'appId': "1:690387462569:web:8b5709267710c33a227cb8",
    'databaseURL': "https://neural-st-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(config)

db= firebase.database()

urls = [
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fwoman_matisse_thumb.jpg?alt=media&token=a3fa3311-5e2a-4023-853d-e9abfcb5fb07",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fwave_thumb.jpg?alt=media&token=91f5c4a8-cd47-45b0-91b6-09707072ecb2",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Frain_princess_thumb.jpg?alt=media&token=fca2b5e5-8b63-48a2-bbd2-f20c22006ba4",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fmosaic_thumb.jpg?alt=media&token=e488780a-232a-4f9d-b2d5-2cae2305beb5",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fflower_thumb.jpg?alt=media&token=c18e25c8-029d-479b-81e4-78070863833b",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fescher_sphere_thumb.jpg?alt=media&token=41f9e497-d8d1-426e-a985-d8b919f47a44",
    "https://firebasestorage.googleapis.com/v0/b/neural-st.appspot.com/o/style_references%2Fdenoised_starry_thumb.jpg?alt=media&token=d511c535-cea6-4c34-9414-a6e8c22135af"
]

# Push each URL to the database under the child "reference_images"
for url in urls:
    db.child("reference_images").push({"url": url})
    print("URL added to database:", url)
    

    



   