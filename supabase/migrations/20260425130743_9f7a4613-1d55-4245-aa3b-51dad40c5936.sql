
ALTER TABLE public.professional_resources
  DROP CONSTRAINT IF EXISTS professional_resources_section_check;

ALTER TABLE public.professional_resources
  ADD CONSTRAINT professional_resources_section_check CHECK (
    section = ANY (ARRAY[
      'protocols'::text,
      'gender_violence'::text,
      'psychological_damage'::text,
      'sexual_abuse'::text,
      'communication_regime'::text,
      'audience_tips'::text,
      'bibliography'::text,
      'informed_consent'::text,
      'report_models'::text,
      'testimony_psychology'::text,
      'psychological_autopsy'::text
    ])
  );

INSERT INTO public.professional_resources
  (section, resource_type, role_tag, title, description, author, source, url, sort_order)
VALUES
  ('psychological_autopsy', 'link', 'forensic',
   'Shneidman, E. S. (1981). The psychological autopsy. Suicide and Life-Threatening Behavior',
   'Artículo fundacional: definición y método de la autopsia psicológica.',
   'Shneidman, E. S.', 'Wiley — DOI 10.1111/j.1943-278X.1981.tb00019.x',
   'https://doi.org/10.1111/j.1943-278X.1981.tb00019.x', 10),
  ('psychological_autopsy', 'link', 'forensic',
   'Conner, K. R., Beautrais, A. L., et al. (2011). The next generation of psychological autopsy studies. SLTB',
   'Revisión metodológica y propuestas de estandarización para AP contemporánea.',
   'Conner, K. R. et al.', 'Wiley — DOI 10.1111/j.1943-278X.2011.00038.x',
   'https://doi.org/10.1111/j.1943-278X.2011.00038.x', 20),
  ('psychological_autopsy', 'link', 'forensic',
   'Cavanagh, J. T. O., Carson, A. J., Sharpe, M., & Lawrie, S. M. (2003). Psychological autopsy studies of suicide: A systematic review. Psychological Medicine',
   'Revisión sistemática: trastorno mental presente en > 90 % de suicidios consumados.',
   'Cavanagh, J. T. O. et al.', 'Cambridge — DOI 10.1017/S0033291702006943',
   'https://doi.org/10.1017/S0033291702006943', 30),
  ('psychological_autopsy', 'link', 'forensic',
   'Hawton, K., Appleby, L., Platt, S., et al. (1998). The psychological autopsy approach to studying suicide. JAD',
   'Discusión clásica de fiabilidad inter-jueces, sesgo del informante y validez retrospectiva.',
   'Hawton, K. et al.', 'Elsevier — DOI 10.1016/S0165-0327(98)00056-2',
   'https://doi.org/10.1016/S0165-0327(98)00056-2', 40),
  ('psychological_autopsy', 'link', 'forensic',
   'Pouliot, L., & De Leo, D. (2006). Critical issues in psychological autopsy studies. SLTB',
   'Crítica metodológica: heterogeneidad de protocolos y necesidad de instrumentos estandarizados.',
   'Pouliot, L. & De Leo, D.', 'Wiley — DOI 10.1521/suli.2006.36.5.491',
   'https://doi.org/10.1521/suli.2006.36.5.491', 50),
  ('psychological_autopsy', 'link', 'forensic',
   'IASP — International Association for Suicide Prevention',
   'Organización científica internacional de referencia en suicidología y AP.',
   'IASP', 'iasp.info', 'https://www.iasp.info/', 60),
  ('psychological_autopsy', 'link', 'forensic',
   'AAS — American Association of Suicidology',
   'Estándares profesionales y formación en autopsia psicológica.',
   'AAS', 'suicidology.org', 'https://suicidology.org/', 70),
  ('psychological_autopsy', 'link', 'forensic',
   'Ley Nacional 27.130 — Prevención del Suicidio (Argentina)',
   'Marco normativo nacional que ordena políticas públicas de prevención del suicidio.',
   'Congreso de la Nación', 'InfoLEG',
   'https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/245618/norma.htm', 80),
  ('psychological_autopsy', 'link', 'forensic',
   'Ley Provincial 12.734 — Código Procesal Penal de Santa Fe',
   'Encuadre del peritaje psicológico forense (incl. AP) en el sistema acusatorio provincial.',
   'Legislatura de Santa Fe', 'santafe.gov.ar',
   'https://www.santafe.gov.ar/index.php/web/content/view/full/111291', 90);
