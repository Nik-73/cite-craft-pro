-- Add Bluebook and ALWD citation styles to the citation_style constraint
ALTER TABLE public.papers
DROP CONSTRAINT IF EXISTS papers_citation_style_check;

ALTER TABLE public.papers
ADD CONSTRAINT papers_citation_style_check
CHECK (citation_style IN ('APA', 'MLA', 'Chicago', 'Harvard', 'Bluebook', 'ALWD'));

-- Add missing citations_file_name column
ALTER TABLE public.papers
ADD COLUMN IF NOT EXISTS citations_file_name TEXT;
