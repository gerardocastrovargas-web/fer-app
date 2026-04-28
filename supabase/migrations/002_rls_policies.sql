-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (single user can only see their own data)
CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cases"
  ON cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cases"
  ON cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cases"
  ON cases FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments"
  ON payments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own events"
  ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events"
  ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents');
