
UPDATE public.professional_resources
SET title = 'Protocolo de Atención Interinstitucional para el Acceso a la Justicia de Niños, Niñas y Adolescentes Víctimas o Testigos de Violencia, Abuso Sexual y otros Delitos',
    description = 'Protocolo provincial de Santa Fe (originalmente aprobado por Decreto N° 2288) de aplicación obligatoria para los equipos intervinientes en casos de violencia y vulneración de derechos. Establece pautas de actuación interinstitucional para garantizar el acceso a la justicia de NNA víctimas o testigos.',
    updated_at = now()
WHERE id = '3004f72a-2742-473b-a5dd-5031bc51b513';

UPDATE public.professional_resources
SET resource_type = 'pdf',
    storage_path  = 'protocols/resolucion-mpa-417-femicidio.pdf',
    url           = NULL,
    updated_at    = now()
WHERE id = '3fe85469-7e48-4028-a50d-8703a09ccb71';

UPDATE public.professional_resources
SET resource_type = 'pdf',
    storage_path  = 'protocols/resolucion-mpa-147-2020-brasilia.pdf',
    url           = NULL,
    updated_at    = now()
WHERE id = 'cc485a3d-cfbd-4bdf-893c-2a7bf6c20ee6';
