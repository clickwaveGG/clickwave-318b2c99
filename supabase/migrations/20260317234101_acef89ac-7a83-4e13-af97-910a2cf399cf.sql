
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  contact_info text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can manage all clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Creator can update own clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Creator can delete own clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);
