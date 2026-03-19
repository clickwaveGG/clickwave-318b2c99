ALTER TABLE public.client_services ADD COLUMN is_recurring boolean NOT NULL DEFAULT true;
ALTER TABLE public.client_services ADD COLUMN notes text DEFAULT NULL;