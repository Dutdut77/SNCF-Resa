alter table "public"."resa_salles" add column "id_secteur" bigint;

alter table "public"."resa_vehicules" add column "id_secteur" bigint;

alter table "public"."vehicules" drop column "carmillon";

alter table "public"."vehicules" add column "vitesse" smallint;

alter table "public"."resa_salles" add constraint "public_resa_salles_id_secteur_fkey" FOREIGN KEY (id_secteur) REFERENCES secteurs(id) ON DELETE CASCADE not valid;

alter table "public"."resa_salles" validate constraint "public_resa_salles_id_secteur_fkey";

alter table "public"."resa_vehicules" add constraint "public_resa_vehicules_id_secteur_fkey" FOREIGN KEY (id_secteur) REFERENCES secteurs(id) ON DELETE CASCADE not valid;

alter table "public"."resa_vehicules" validate constraint "public_resa_vehicules_id_secteur_fkey";

create policy "all_access_authenticated"
on "public"."carburant"
as permissive
for all
to authenticated
using (true);


create policy "all_access_authenticated"
on "public"."resa_salles"
as permissive
for select
to authenticated
using (true);


create policy "all_access_authenticated"
on "public"."resa_vehicules"
as permissive
for all
to authenticated
using (true);


create policy "all_access_authenticated"
on "public"."salles"
as permissive
for all
to authenticated
using (true);


create policy "All_Access_Authenticated"
on "public"."vehicules"
as permissive
for all
to authenticated
using (true);