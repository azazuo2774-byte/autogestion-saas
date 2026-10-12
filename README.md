# AutoGestión SaaS — Landing beta

## Estado
Código base preparado. No se ha publicado en Vercel ni conectado a una instancia real de Supabase. No contiene resultados de pruebas reales.

## Puesta en marcha
1. Registra un proyecto en https://supabase.com y abre SQL Editor.
2. Ejecuta `AutoGestion_Supabase_FN0.sql` (adjunto al paquete).
3. Copia `.env.example` como `.env`, y sustituye la URL y clave **pública** (anon/publishable) del proyecto.
4. Abre una terminal en esta carpeta: `npm install` y luego `npm run dev`.
5. Modifica el campo `Responsable del proyecto: [COMPLETAR...]` en `src.js` por datos de contacto públicos adecuados, antes de publicar. Revisa el aviso de privacidad.
6. Prueba todos los campos, los mensajes de éxito/error y la vista móvil; verifica en el panel privado de Supabase la fila creada.
7. Sube el código a un repositorio (sin `.env` y sin `node_modules`), importa el repositorio en https://vercel.com y agrega en Project Settings > Environment Variables las mismas variables `VITE_`.
8. Build command: `npm run build`; output: `dist`. Publica y realiza **una inscripción nueva desde la URL pública**. Guarda capturas de URL, formulario, éxito, SQL y tabla privada (ocultando correos reales).

## Seguridad
- Nunca incluyas `service_role` ni `secret key` en frontend.
- La clave anon/publishable puede exponerse únicamente con RLS y privilegios bien configurados.
- Política actual: INSERT anon restringido y sin SELECT, UPDATE ni DELETE públicos.
- La RLS no evita spam por sí sola; para producción, suma protección antibots y límites de frecuencia.
- La restricción UNIQUE del correo reduce duplicados; una persona no puede consultar si otra está registrada.
- El aviso de privacidad actual es mínimo académico: revisarlo antes de captar datos reales.

## Entrega académica
Adjunta el código comprimido (sin secretos), el SQL, instrucciones, enlace público y evidencia genuina de un registro.
