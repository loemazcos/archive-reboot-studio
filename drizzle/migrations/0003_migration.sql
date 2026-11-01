DELETE FROM public.game_state WHERE device_id IN (SELECT device_id FROM public.save_slots WHERE name='점검봇');
DELETE FROM public.save_slots WHERE name='점검봇';