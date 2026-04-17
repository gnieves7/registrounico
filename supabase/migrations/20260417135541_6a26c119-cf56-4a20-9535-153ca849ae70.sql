-- Enable realtime for sessions so patient dashboards reflect admin/Calendar updates
ALTER TABLE public.sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;