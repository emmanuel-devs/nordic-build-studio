CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'hammer',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are public" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Commercial',
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  client text NOT NULL DEFAULT '',
  scope text NOT NULL DEFAULT '',
  completed_on text NOT NULL DEFAULT '',
  image_key text NOT NULL DEFAULT 'harbor',
  gallery_keys text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  project_type text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.services (slug, title, blurb, body, icon, sort_order) VALUES
('design-build', 'Design & Build', 'One contract from first sketch to handover — design, engineering and construction under a single accountable team.', 'Our turnkey design & build service removes the seams between architect, engineer and contractor. You get one budget, one programme and one point of contact from feasibility study through to the day we hand over the keys.', 'compass', 1),
('general-contracting', 'General Contracting', 'Full site management, procurement and trade coordination for commercial and residential builds.', 'We take responsibility for the whole site: programme, procurement, subcontractors, safety and quality control. Weekly reporting keeps you informed without needing to be on site.', 'hard-hat', 2),
('renovation', 'Building Renovation', 'Sensitive upgrades to existing structures, from façade restoration to full interior strip-outs.', 'Renovation work rewards experience. We survey carefully, plan for the unexpected and protect what is worth keeping while bringing energy performance and layout up to modern standards.', 'wrench', 3),
('interior-finishing', 'Interior Finishing', 'Joinery, flooring, tiling and finishing carried out by our own in-house craftspeople.', 'The last five percent of a build is what people actually touch. Our finishing teams deliver level surfaces, tight tolerances and materials that age well.', 'ruler', 4),
('foundation-groundwork', 'Foundation & Groundwork', 'Excavation, drainage, piling and structural foundations engineered for Nordic ground conditions.', 'Frost depth, rock and groundwater define what is possible below the surface. We survey, engineer and pour foundations built for the ground you actually have.', 'layers', 5),
('project-development', 'Project Development', 'Feasibility, permitting and cost planning for developers taking a site from land to building.', 'We work alongside developers early, testing yield, buildability and cost before a single drawing is committed to, so decisions are made when they are still cheap.', 'building', 6);

INSERT INTO public.projects (slug, title, category, summary, body, location, client, scope, completed_on, image_key, gallery_keys, featured, sort_order) VALUES
('harbor-view-residences', 'Harbor View Residences', 'Residential', 'Forty-eight apartments in cross-laminated timber overlooking the fjord, delivered three weeks ahead of programme.', 'A six-storey residential block built in cross-laminated timber with a ventilated pine façade. Prefabrication allowed us to close the building envelope before the winter, cutting the wet trades programme dramatically. Every apartment has a glazed balcony facing the water.', 'Bjørvika, Oslo', 'Fjordbo Eiendom', 'Design & build, 48 units, 4 900 m²', 'March 2025', 'harbor', ARRAY['interior','detail'], true, 1),
('nordlys-office-tower', 'Nordlys Office Tower', 'Commercial', 'A twelve-storey headquarters with a double-skin façade and BREEAM Excellent certification.', 'Built on a constrained city site with a live tram line on two sides, this headquarters required night-time crane lifts and a tightly sequenced façade programme. The double-skin glazing cut heating demand by 34 percent against the baseline.', 'Sentrum, Oslo', 'Nordlys Group', 'General contracting, 19 200 m²', 'November 2024', 'office', ARRAY['detail','team'], true, 2),
('stavanger-warehouse-conversion', 'Stavanger Warehouse Conversion', 'Renovation', 'A protected 1890s brick warehouse rebuilt into flexible creative studios without losing its structure.', 'Every original brick arch and steel truss was surveyed, retained and reinforced. New steel-framed glazing sits inside the original openings, and services run in an exposed spine so the historic fabric was never chased into.', 'Stavanger', 'Havnelageret AS', 'Renovation & structural works, 3 100 m²', 'August 2024', 'warehouse', ARRAY['interior','detail'], true, 3),
('granlia-villa', 'Granlia Coastal Villa', 'Residential', 'A black timber family villa on exposed coastal rock, built to passive-house standard.', 'Set on bare rock with no possibility of deep excavation, the villa sits on a pinned concrete raft. Triple glazing, 400 mm of insulation and heat recovery bring annual heating demand close to zero.', 'Hvaler', 'Private client', 'Design & build, 310 m²', 'June 2024', 'villa', ARRAY['interior','detail'], false, 4),
('bekkelaget-school', 'Bekkelaget Primary School', 'Commercial', 'A timber-framed school for 420 pupils delivered across two summer holidays while the school stayed open.', 'Phasing was everything: the existing school remained in operation throughout, so the new wing was built and commissioned in two summer windows with full acoustic and fire separation in between.', 'Bekkelaget, Oslo', 'Oslo Kommune', 'General contracting, 6 400 m²', 'August 2023', 'school', ARRAY['team','detail'], false, 5),
('frogner-apartment-refit', 'Frogner Apartment Refit', 'Renovation', 'A full interior rebuild of a 1902 apartment, restoring original mouldings alongside new services.', 'Original stucco, doors and parquet were catalogued, removed and reinstated. Behind them sit entirely new electrical, plumbing and ventilation systems, plus acoustic separation to the neighbouring flats.', 'Frogner, Oslo', 'Private client', 'Renovation & interior finishing, 185 m²', 'February 2023', 'interior', ARRAY['detail'], false, 6);