-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create papers table
CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Paper',
  content TEXT,
  file_name TEXT,
  file_type TEXT,
  citation_style TEXT DEFAULT 'APA' CHECK (citation_style IN ('APA', 'MLA', 'Chicago', 'Harvard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- Papers policies
CREATE POLICY "Users can view own papers"
  ON public.papers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own papers"
  ON public.papers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own papers"
  ON public.papers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own papers"
  ON public.papers FOR DELETE
  USING (auth.uid() = user_id);

-- Create citations table
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  title TEXT NOT NULL,
  year INTEGER,
  publication TEXT,
  url TEXT,
  doi TEXT,
  pages TEXT,
  volume TEXT,
  issue TEXT,
  publisher TEXT,
  citation_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

-- Citations policies
CREATE POLICY "Users can view citations for their papers"
  ON public.citations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.papers
      WHERE papers.id = citations.paper_id
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create citations for their papers"
  ON public.citations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.papers
      WHERE papers.id = citations.paper_id
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update citations for their papers"
  ON public.citations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.papers
      WHERE papers.id = citations.paper_id
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete citations for their papers"
  ON public.citations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.papers
      WHERE papers.id = citations.paper_id
      AND papers.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_papers
  BEFORE UPDATE ON public.papers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();