-- Imagen de encabezado del dashboard de cada materia.
-- Guarda una data URL (imagen comprimida en el navegador) o una URL http(s).
-- MEDIUMTEXT admite hasta 16 MB; la API limita el tamaño a ~4 MB.
ALTER TABLE subjects
    ADD COLUMN header_image MEDIUMTEXT NULL AFTER evaluation_criteria;

-- Revertir:
-- ALTER TABLE subjects DROP COLUMN header_image;
