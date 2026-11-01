CREATE TABLE public.game_state (
  device_id text PRIMARY KEY,
  run jsonb NOT NULL DEFAULT '{}'::jsonb,
  codex jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.game_state TO service_role;
ALTER TABLE public.game_state ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.dm_messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id text NOT NULL,
  thread_id text NOT NULL CHECK (thread_id IN ('sanghyuk','donghyun','jaehyun','seongho')),
  sender text NOT NULL CHECK (sender IN ('me','them')),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 300),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','delivered','read','unsent')),
  deliver_at integer NOT NULL DEFAULT 0,
  read_at integer,
  unsent_at integer,
  unsend_after_min smallint CHECK (unsend_after_min IS NULL OR unsend_after_min BETWEEN 1 AND 30),
  typing_cycles smallint NOT NULL DEFAULT 0 CHECK (typing_cycles BETWEEN 0 AND 3),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX dm_messages_device_thread_deliver_idx ON public.dm_messages (device_id, thread_id, deliver_at);
GRANT ALL ON public.dm_messages TO service_role;
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  title text NOT NULL,
  event_date date NOT NULL,
  start_time time,
  end_time time,
  place text,
  memo text,
  kind text NOT NULL CHECK (kind IN ('school','festival','club','exam','council','personal')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','changed','cancelled')),
  status_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX calendar_events_device_date_idx ON public.calendar_events (device_id, event_date);
GRANT ALL ON public.calendar_events TO service_role;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.clue_discoveries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  device_id text NOT NULL,
  clue_id text NOT NULL,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (device_id, clue_id)
);
GRANT ALL ON public.clue_discoveries TO service_role;
ALTER TABLE public.clue_discoveries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.rate_limits (
  device_id text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (device_id, window_start)
);
GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text, p_window timestamptz, p_limit integer)
RETURNS boolean LANGUAGE sql SET search_path = public AS $$
  WITH bumped AS (
    INSERT INTO public.rate_limits AS r (device_id, window_start, count)
    VALUES (p_key, p_window, 1)
    ON CONFLICT (device_id, window_start)
    DO UPDATE SET count = r.count + 1 WHERE r.count < p_limit
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM bumped);
$$;
REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(text, timestamptz, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, timestamptz, integer) TO service_role;

CREATE TABLE public.save_slots (
  name text PRIMARY KEY CHECK (char_length(name) BETWEEN 1 AND 12),
  pin_hash text NOT NULL,
  device_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.save_slots TO service_role;
ALTER TABLE public.save_slots ENABLE ROW LEVEL SECURITY;