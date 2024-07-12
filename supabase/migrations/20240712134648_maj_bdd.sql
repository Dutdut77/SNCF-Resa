drop policy "all_access_authenticated" on "public"."resa_salles";

alter table "public"."salles" add column "capacite" bigint;

alter table "public"."salles" add column "video_proj" smallint;

alter table "public"."salles" add column "webcam" smallint;

alter table "public"."secteurs" alter column "sect_admin_id_user" set data type text using "sect_admin_id_user"::text;

create policy "all_access_authenticated"
on "public"."resa_salles"
as permissive
for all
to authenticated
using (true);