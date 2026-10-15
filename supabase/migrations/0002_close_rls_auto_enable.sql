-- public.rls_auto_enable() is created by Supabase ("Enable automatic RLS") as an
-- event trigger function. It is reachable through /rest/v1/rpc by anon and
-- authenticated. Called that way it can only fail, but no API role needs it:
-- event triggers fire without an EXECUTE grant.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
