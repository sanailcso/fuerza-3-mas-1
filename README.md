# Fuerza 3+1

Aplicación web móvil para registrar una rutina de gimnasio de tres días más uno opcional.

## Funciones

- Registro de peso y repeticiones por serie.
- Historial de entrenamientos guardado en el dispositivo.
- Última carga utilizada en cada ejercicio.
- Técnica, respiración y errores frecuentes.
- Seguimiento de sesiones semanales.

## Uso

Abre `index.html` en un navegador o publica el repositorio con GitHub Pages. Los datos se guardan localmente en el navegador mediante `localStorage`.

## Diario de comidas

Abre **Comidas** desde la pantalla principal. Puedes registrar alimentos con cantidades editables, repetir comidas, consultar calorías y proteínas por día, buscar productos por código EAN y exportar el diario en JSON. Los datos se guardan en este navegador, por separado de las copias de entrenamiento. La foto solo se envía si pulsas **Analizar foto** y has configurado el [servidor de análisis](nutrition-api/README.md). Sin servidor, puedes registrar la foto manualmente. Las estimaciones fotográficas requieren revisión de porciones y aceite.
