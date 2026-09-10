ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS challenge text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS approach text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS outcome text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contract_value text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS duration text NOT NULL DEFAULT '';

UPDATE public.projects SET
  challenge = 'A reclaimed quay with poor ground conditions, a 48-unit programme and a client who needed pre-sales imagery eighteen months before handover.',
  approach = 'We took the scheme from planning through to handover on a single fixed-price contract: piled foundations designed with our own engineers, prefabricated timber facade cassettes assembled off site, and a rolling apartment mock-up used for pre-sales.',
  outcome = 'All 48 units handed over three weeks ahead of programme, with 41 sold before completion and a snag list closed inside four weeks.',
  metrics = '[{"value":"3 weeks","label":"Ahead of programme"},{"value":"48/48","label":"Units handed over"},{"value":"0","label":"Reportable incidents"}]'::jsonb,
  contract_value = 'NOK 310–340m',
  duration = '26 months'
WHERE slug = 'harbor-view-residences';

UPDATE public.projects SET
  challenge = 'A city-centre tower on a constrained site with one delivery street shared by three neighbouring businesses.',
  approach = 'We ran a just-in-time logistics plan with booked delivery slots, night pours for the core and weekly cost reporting the client could take straight to their board.',
  outcome = 'Delivered on the contract date with no street closures beyond the agreed window and a final account within 1.4% of the tender sum.',
  metrics = '[{"value":"1.4%","label":"Final account variance"},{"value":"19 200 m²","label":"Delivered"},{"value":"On date","label":"Practical completion"}]'::jsonb,
  contract_value = 'NOK 620–680m',
  duration = '34 months'
WHERE slug = 'nordlys-office-tower';

UPDATE public.projects SET
  challenge = 'A protected 1920s harbour warehouse with rotted timber columns and a heritage listing that ruled out visible steel.',
  approach = 'We surveyed every column, spliced in matched-grain timber where possible and hid new structure inside existing sections, working alongside the heritage authority week by week.',
  outcome = 'Full change of use approved first time, with 78% of the original structure retained and the embodied carbon of a new build avoided.',
  metrics = '[{"value":"78%","label":"Original structure retained"},{"value":"First time","label":"Heritage approval"},{"value":"3 100 m²","label":"Converted"}]'::jsonb,
  contract_value = 'NOK 95–110m',
  duration = '18 months'
WHERE slug = 'stavanger-warehouse-conversion';

UPDATE public.projects SET
  challenge = 'An exposed coastal plot, a winter build window and a client who wanted a passive-house standard without the industrial detailing.',
  approach = 'We closed the envelope before December using prefabricated wall panels, then completed joinery and finishes through the winter with a single carpentry crew on site.',
  outcome = 'Airtightness tested at 0.4 air changes per hour and the family moved in for the summer season as planned.',
  metrics = '[{"value":"0.4 ACH","label":"Airtightness result"},{"value":"310 m²","label":"Floor area"},{"value":"On plan","label":"Summer handover"}]'::jsonb,
  contract_value = 'NOK 18–22m',
  duration = '11 months'
WHERE slug = 'granlia-villa';

UPDATE public.projects SET
  challenge = 'A live school site: 340 pupils stayed on the grounds throughout construction.',
  approach = 'We phased the build into three zones with hoarded pedestrian routes, ran noisy works inside agreed windows and held a fortnightly coordination meeting with the head teacher.',
  outcome = 'Zero lost teaching days, handover completed during the summer break and the building occupied on the first day of term.',
  metrics = '[{"value":"0","label":"Lost teaching days"},{"value":"340","label":"Pupils on site throughout"},{"value":"6 400 m²","label":"Delivered"}]'::jsonb,
  contract_value = 'NOK 180–200m',
  duration = '22 months'
WHERE slug = 'bekkelaget-school';

UPDATE public.projects SET
  challenge = 'A listed 1890s apartment where original mouldings and parquet had to survive a full services replacement.',
  approach = 'We lifted, labelled and stored the parquet, cast new service routes into the floor build-up and reinstated every moulding profile from templates taken before strip-out.',
  outcome = 'Complete electrical, heating and ventilation renewal with the original interior intact and a four-month occupied programme.',
  metrics = '[{"value":"100%","label":"Original parquet reinstated"},{"value":"4 months","label":"On site"},{"value":"185 m²","label":"Refitted"}]'::jsonb,
  contract_value = 'NOK 6–8m',
  duration = '4 months'
WHERE slug = 'frogner-apartment-refit';