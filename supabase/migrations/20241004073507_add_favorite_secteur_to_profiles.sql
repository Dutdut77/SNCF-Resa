alter table "public"."profiles" add column "favorite_secteur" bigint;

alter table "public"."profiles" add constraint "public_profiles_favoriteSecteur_fkey" FOREIGN KEY (favorite_secteur) REFERENCES secteurs(id) not valid;

alter table "public"."profiles" validate constraint "public_profiles_favoriteSecteur_fkey";