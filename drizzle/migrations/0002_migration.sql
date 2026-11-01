DELETE FROM public.game_state WHERE device_id IN (SELECT device_id FROM public.save_slots WHERE name='테스트봇');
DELETE FROM public.calendar_events WHERE device_id IN (SELECT device_id FROM public.save_slots WHERE name='테스트봇');
DELETE FROM public.clue_discoveries WHERE device_id IN (SELECT device_id FROM public.save_slots WHERE name='테스트봇');
DELETE FROM public.dm_messages WHERE device_id IN (SELECT device_id FROM public.save_slots WHERE name='테스트봇');
DELETE FROM public.save_slots WHERE name='테스트봇';