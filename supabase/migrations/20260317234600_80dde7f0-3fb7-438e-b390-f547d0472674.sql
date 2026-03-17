
ALTER TABLE public.tasks ADD COLUMN price numeric DEFAULT NULL;
ALTER TABLE public.tasks ADD COLUMN capture_date timestamp with time zone DEFAULT NULL;
