# Análisis de comidas por foto

El diario de comidas de `nutrition.html` funciona sin servidor. Para activar **Analizar foto**, despliega `worker.js` como Cloudflare Worker (módulo ES) y configura:

- `OPENAI_API_KEY`: secreto de OpenAI, **solo en el Worker**.
- `APP_TOKEN`: un secreto largo y aleatorio para limitar quién puede usar el análisis. Compártelo solo con quienes vayan a usar la app.
- `ALLOWED_ORIGIN`: origen exacto de la web, por ejemplo `https://sanailcso.github.io` (sin barra final).
- `OPENAI_MODEL` (opcional): modelo con entrada de imagen y salida JSON estructurada; valor inicial `gpt-5.4-mini`.

En la pantalla de comidas, selecciona una foto, pulsa **Analizar foto** e introduce la URL HTTPS del Worker y el acceso personal (`APP_TOKEN`). La URL queda en este navegador; el acceso personal solo en la pestaña actual. La clave de OpenAI nunca se coloca en GitHub Pages. El Worker rechaza otros orígenes y peticiones sin token. Si se publica para más personas, añade límites de uso por usuario en el proveedor antes de abrir el acceso.

Contrato: `POST` JSON `{image: "data:image/jpeg;base64,...", note: "..."}` con `Authorization: Bearer <APP_TOKEN>`; devuelve `{name, items:[{name, grams, kcal100, protein100}]}`. La foto se reduce a 1280 píxeles en el móvil, se envía para ese análisis y no se guarda en el diario. Los resultados se revisan y corrigen antes de guardar.

El lector de códigos usa Open Food Facts directamente. Los alimentos de la lista rápida son valores orientativos, no una base nutricional completa.
