---
name: SECURITY DEFINER warnings 0029 - Aceptados por diseño
description: Justificación de las 5 funciones SECURITY DEFINER ejecutables por authenticated que generan WARN 0029 inevitable
type: constraint
---
Las siguientes funciones DEBEN permanecer SECURITY DEFINER ejecutables por authenticated. El warning 0029 del linter Supabase es esperado e inevitable; intentar resolverlo rompe el sistema:

1. **has_role(uuid, app_role)**: base del RLS, evita recursión infinita en user_roles. Patrón recomendado por Supabase. Solo retorna boolean.
2. **issue_pdf_code**: valida internamente admin/profesional aprobado. Necesita DEFINER para escribir en secure_pdf_codes y activity_log con identidad del solicitante.
3. **consume_pdf_code**: invocada desde Edge Function pública /descargar. Validación por código 6 dígitos + TTL + consumed_at.
4. **mark_professional_active**: heartbeat. Solo hace UPDATE WHERE user_id = auth.uid(). No expone datos.
5. **patient_update_session**: el paciente solo puede editar patient_notes y patient_questions en sesiones marcadas is_editable_by_patient = true. Filtra por auth.uid().

**Why:** Cambiar a INVOKER rompe RLS o la auditoría. Mover a edge function añade latencia + complejidad sin beneficio de seguridad (la autorización ya está en el cuerpo de la función).
