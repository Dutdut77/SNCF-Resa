alter table "public"."anomalies" add column "id_secteur" bigint;

alter table "public"."profiles" add column "secteur_admin" integer;

alter table "public"."anomalies" add constraint "public_anomalies_id_secteur_fkey" FOREIGN KEY (id_secteur) REFERENCES secteurs(id) not valid;

alter table "public"."anomalies" validate constraint "public_anomalies_id_secteur_fkey";

alter table "public"."profiles" add constraint "public_profiles_secteur_admin_fkey" FOREIGN KEY (secteur_admin) REFERENCES secteurs(id) not valid;

alter table "public"."profiles" validate constraint "public_profiles_secteur_admin_fkey";