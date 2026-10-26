-- Agregar columnas de contacto a la tabla Suscripciones
ALTER TABLE "Suscripciones"
ADD COLUMN IF NOT EXISTS "ContactoCorreo" character varying(200),
ADD COLUMN IF NOT EXISTS "ContactoTelefono" character varying(50);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS "IX_Suscripciones_ContactoCorreo" ON "Suscripciones" ("ContactoCorreo");
CREATE INDEX IF NOT EXISTS "IX_Suscripciones_ContactoTelefono" ON "Suscripciones" ("ContactoTelefono");
