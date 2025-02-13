import openai
import os

# Configurar API Key (debes agregarla en los Secrets de GitHub)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def actualizar_archivo():
    # Leer contenido actual del archivo
    with open("client/public/info.txt", "r", encoding="utf-8") as file:
        contenido_actual = file.read()

    # Pedir a GPT que modifique el contenido
    response = openai.ChatCompletion.create(
        model="gpt-4",
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

    print("Archivo actualizado con éxito.")

# Ejecutar función
if __name__ == "__main__":
    actualizar_archivo()

