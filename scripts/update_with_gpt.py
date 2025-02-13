import openai
import os

# Obtener la API Key desde las variables de entorno
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def actualizar_archivo():
    # Leer contenido actual del archivo
    with open("client/public/info.txt", "r", encoding="utf-8") as file:
        contenido_actual = file.read()

    # Configurar el cliente de OpenAI
    openai.api_key = OPENAI_API_KEY

    # Pedir a GPT que modifique el contenido
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",  # Cambia esto por gpt-3.5-turbo si no tienes acceso a gpt-4
        messages=[
            {"role": "system", "content": "Eres un asistente que edita archivos de texto."},
            {"role": "user", "content": f"Por favor, mejora o actualiza este archivo:\n\n{contenido_actual}"}
        ]
    )

    # Obtener respuesta de GPT
    nuevo_contenido = response["choices"][0]["message"]["content"]

    # Guardar los cambios en el archivo
    with open("client/public/info.txt", "w", encoding="utf-8") as file:
        file.write(nuevo_contenido)

    print("✅ Archivo actualizado con éxito.")

# Ejecutar función
if __name__ == "__main__":
    actualizar_archivo()

