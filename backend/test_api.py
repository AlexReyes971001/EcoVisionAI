import requests
import base64


# Cambia esta ruta por una imagen que tengas para probar
RUTA_IMAGEN = r"C:\Users\Alejandro\Documents\DSRN\EcoVisionAI\backend\imagen.jpeg"


# Convertir imagen a Base64
with open(RUTA_IMAGEN, "rb") as archivo:
    imagen_base64 = base64.b64encode(
        archivo.read()
    ).decode("utf-8")


# Crear formato que espera la API
data = {
    "image": "data:image/jpeg;base64," + imagen_base64
}


# Enviar imagen al backend
respuesta = requests.post(
    "http://127.0.0.1:8000/classify",
    json=data
)


print("Código:", respuesta.status_code)

print("\nResultado:")
print(respuesta.json())