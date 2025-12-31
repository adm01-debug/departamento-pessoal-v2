-- Tabela para solicitações de reset de senha
CREATE TABLE public.password_reset_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'completed')),
    reason TEXT,
    requested_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewer_notes TEXT,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours'),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuração do fluxo de reset
CREATE TABLE public.password_reset_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    require_approval BOOLEAN DEFAULT true,
    auto_expire_hours INTEGER DEFAULT 24,
    notify_admins BOOLEAN DEFAULT true,
    notify_user_on_approval BOOLEAN DEFAULT true,
    notify_user_on_rejection BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Inserir configuração padrão
INSERT INTO public.password_reset_config (require_approval, auto_expire_hours, notify_admins, notify_user_on_approval, notify_user_on_rejection)
VALUES (true, 24, true, true, true);

-- RLS
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_config ENABLE ROW LEVEL SECURITY;

-- Políticas para admins
CREATE POLICY "Admins can manage password_reset_requests" ON public.password_reset_requests
    FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own requests" ON public.password_reset_requests
    FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create their own requests" ON public.password_reset_requests
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage password_reset_config" ON public.password_reset_config
    FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Índices
CREATE INDEX idx_password_reset_status ON public.password_reset_requests(status);
CREATE INDEX idx_password_reset_user ON public.password_reset_requests(user_id);
CREATE INDEX idx_password_reset_expires ON public.password_reset_requests(expires_at);