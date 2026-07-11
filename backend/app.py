from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import torch.nn.functional as F

import io
import base64


# =====================================================
# CONFIGURACIÓN
# =====================================================

app = FastAPI(title="EcoVisionAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RUTA_MODELO = "EcoVisionAI_ResNet50.pth"


CLASES = [
    "Basura",
    "Bateria",
    "Biologica",
    "Carton",
    "Metal",
    "Papel",
    "Plastico",
    "Vidrio Cafe",
    "Vidrio Verde",
    "Vidrio blanco"
]


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# =====================================================
# CARGAR MODELO RESNET50
# =====================================================

model = models.resnet50(weights=None)

num_features = model.fc.in_features

model.fc = nn.Linear(
    num_features,
    len(CLASES)
)


model.load_state_dict(
    torch.load(
        RUTA_MODELO,
        map_location=device
    )
)


model = model.to(device)

model.eval()


print("Modelo EcoVisionAI cargado correctamente")


# =====================================================
# TRANSFORMACIONES
# =====================================================

transformaciones = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])


# =====================================================
# CONSEJOS
# =====================================================

consejos = {

"Basura":
"Este residuo puede no ser reciclable. Intenta reducir su consumo y separarlo correctamente.",

"Bateria":
"No tires baterías a la basura común. Llévalas a un punto de recolección especializado.",

"Biologica":
"Los residuos orgánicos pueden aprovecharse mediante composta.",

"Carton":
"Puedes reciclarlo. Retira restos de comida y evita mojarlo.",

"Metal":
"Los metales pueden reciclarse. Límpialos antes de depositarlos.",

"Papel":
"Separa el papel limpio para facilitar su reciclaje.",

"Plastico":
"Limpia los envases y sepáralos correctamente para reciclaje.",

"Vidrio Cafe":
"Separa el vidrio café del resto de materiales.",

"Vidrio Verde":
"Deposita el vidrio verde en el contenedor adecuado.",

"Vidrio blanco":
"El vidrio transparente puede reciclarse correctamente."

}


# =====================================================
# MODELO DE DATOS RECIBIDO
# =====================================================

class ImageRequest(BaseModel):
    image: str



# =====================================================
# ENDPOINT PRINCIPAL
# =====================================================

@app.post("/classify")
async def classify(data: ImageRequest):

    try:

        # Quitar encabezado Base64
        image_data = data.image.split(",")[1]


        # Convertir Base64 a imagen
        image_bytes = base64.b64decode(image_data)

        imagen = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")


        # Transformar imagen

        imagen_tensor = transformaciones(imagen)

        imagen_tensor = (
            imagen_tensor
            .unsqueeze(0)
            .to(device)
        )


        # Predicción

        with torch.no_grad():

            salida = model(imagen_tensor)

            probabilidades = F.softmax(
                salida,
                dim=1
            )


        confianza, indice = torch.max(
            probabilidades,
            1
        )


        clase = CLASES[indice.item()]

        confianza_valor = (
            confianza.item()*100
        )


        # TOP 5

        top5_probabilidades, top5_indices = torch.topk(
            probabilidades,
            5
        )


        top_predictions = []


        for i in range(5):

            categoria = CLASES[
                top5_indices[0][i].item()
            ]

            porcentaje = (
                top5_probabilidades[0][i].item()
                *100
            )


            top_predictions.append(
                {
                    "category": categoria,
                    "confidence": round(
                        porcentaje,
                        2
                    )
                }
            )


        return {

            "recognized": confianza_valor >= 40,

            "itemName": clase,

            "category": clase,

            "confidence": round(
                confianza_valor,
                2
            ),

            "binColor": "Consultar separación local",

            "recommendation":
                consejos.get(
                    clase,
                    "Separa correctamente este residuo."
                ),

            "environmentalImpact":
                "Separar residuos correctamente ayuda a reducir contaminación.",


            "topPredictions":
                top_predictions

        }



    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )