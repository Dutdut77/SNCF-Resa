alter table "public"."resa_salles" add column "titre" text;

alter table "public"."secteurs" drop column "sect_admin_id_user";

alter table "public"."secteurs" drop column "superviseurs";

