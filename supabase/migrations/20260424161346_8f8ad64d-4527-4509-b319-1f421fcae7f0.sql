
DELETE FROM public.professional_resources
WHERE id IN (
  '3608cac8-4844-408a-a65f-4c88485feed5',
  '7287a896-a25d-4354-b60e-51b71b351f2e',
  'dd50afc9-4dfe-4981-8b50-d4b30387feef'
);

INSERT INTO public.professional_resources
  (section, title, description, resource_type, role_tag, sort_order, source, author, storage_path, url)
VALUES
  ('protocols',
   'Protocolo de Atención a Víctimas de Violencia de Género en Efectores de Salud',
   'Guía operativa provincial para la atención integral de víctimas de violencia de género en el sistema sanitario de Santa Fe. Incluye detección, primera escucha, registro y derivación.',
   'pdf', 'institutional', 10,
   'Ministerio de Salud — Provincia de Santa Fe', 'Provincia de Santa Fe',
   'protocols/protocolo-efectores-salud-violencia-genero.pdf', NULL),

  ('protocols',
   'Procedimiento ante Situaciones Conflictivas Escolares',
   'Documento de la Cámara de Diputados de la Provincia de Santa Fe sobre el procedimiento institucional ante situaciones conflictivas en el ámbito escolar (incluye violencia, abuso y vulneración de derechos de NNyA).',
   'pdf', 'institutional', 20,
   'Cámara de Diputados — Provincia de Santa Fe', 'Provincia de Santa Fe',
   'protocols/procedimiento-situaciones-conflictivas-escolares.pdf', NULL),

  ('protocols',
   'Protocolo Santa Fe — Decreto 2288',
   'Texto oficial del Protocolo provincial aprobado por Decreto N° 2288, de aplicación obligatoria para los equipos intervinientes en casos de violencia y vulneración de derechos en la Provincia de Santa Fe.',
   'pdf', 'institutional', 30,
   'Gobierno de la Provincia de Santa Fe — Decreto 2288', 'Provincia de Santa Fe',
   'protocols/protocolo-santa-fe-decreto-2288.pdf', NULL),

  ('protocols',
   'Ley Provincial N° 13.348 — Protección Integral contra las Violencias por Razones de Género',
   'Ley provincial de adhesión y aplicación del marco nacional (Ley 26.485) en Santa Fe. Define competencias, dispositivos y obligaciones del Estado provincial frente a las violencias de género.',
   'link', 'institutional', 40,
   'Honorable Legislatura de la Provincia de Santa Fe', 'Provincia de Santa Fe',
   NULL, 'https://www.santafe.gov.ar/index.php/web/content/download/198508/963525/'),

  ('protocols',
   'Decreto Reglamentario N° 4028/13 — Ley 13.348',
   'Reglamentación de la Ley Provincial 13.348 (primera reglamentación, año 2013). Define el funcionamiento operativo de los dispositivos de prevención, asistencia y erradicación de la violencia de género en Santa Fe.',
   'link', 'institutional', 50,
   'Gobierno de la Provincia de Santa Fe', 'Provincia de Santa Fe',
   NULL, 'https://www.santafe.gov.ar/normativa/getFile.php?id=222573&item=109541&cod=ec0b8c8b6b5b1c6b5b6b5b6b5b6b5b6b'),

  ('protocols',
   'Decreto N° 2013/2023 — Actualización reglamentaria Ley 13.348',
   'Actualización de la reglamentación de la Ley 13.348 (año 2023). Incorpora ajustes operativos y de articulación interinstitucional. Santa Fe adhirió a la Convención de Belém do Pará.',
   'link', 'institutional', 60,
   'Gobierno de la Provincia de Santa Fe', 'Provincia de Santa Fe',
   NULL, 'https://www.santafe.gob.ar/boletinoficial/'),

  ('protocols',
   'Resolución MPA N° 417 — Protocolo para la Investigación y Litigio de Casos de Femicidio',
   'Protocolo del Ministerio Público de la Acusación de Santa Fe para la investigación y litigio de muertes violentas de mujeres (femicidios), basado en el Protocolo Latinoamericano de la ONU y adaptado a la realidad provincial.',
   'link', 'institutional', 70,
   'Ministerio Público de la Acusación — Provincia de Santa Fe', 'MPA Santa Fe',
   NULL, 'https://www.mpa.santafe.gov.ar/'),

  ('protocols',
   'Resolución MPA N° 147/2020 — Adhesión a las 100 Reglas de Brasilia',
   'Adhesión del Ministerio Público de la Acusación de Santa Fe a las 100 Reglas de Brasilia sobre Acceso a la Justicia de las Personas en Condición de Vulnerabilidad. Rige la actuación con víctimas en todo el proceso penal provincial.',
   'link', 'institutional', 80,
   'Ministerio Público de la Acusación — Provincia de Santa Fe', 'MPA Santa Fe',
   NULL, 'https://www.mpa.santafe.gov.ar/');
