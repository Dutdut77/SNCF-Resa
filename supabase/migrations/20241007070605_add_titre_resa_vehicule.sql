alter table "public"."profiles" alter column "secteur_auth" set default ''::text;

alter table "public"."resa_vehicules" add column "titre" text;