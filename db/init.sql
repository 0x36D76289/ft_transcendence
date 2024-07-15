CREATE TABLE "match"(
    "id" BIGINT NOT NULL,
    "id_p1" BIGINT NOT NULL,
    "id_p2" BIGINT NOT NULL,
    "time_start" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "time_end" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "score_p1" smallserial NOT NULL,
    "score_p2" smallserial NOT NULL
);
ALTER TABLE
    "match" ADD PRIMARY KEY("id");
CREATE INDEX "match_id_p1_index" ON
    "match"("id_p1");
CREATE INDEX "match_id_p2_index" ON
    "match"("id_p2");
CREATE TABLE "user"(
    "id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "42_account" VARCHAR(255) NULL,
    "nb_matchs" SERIAL NOT NULL,
    "nb_wins" SERIAL NOT NULL
);
ALTER TABLE
    "user" ADD PRIMARY KEY("id");
CREATE INDEX "user_username_index" ON
    "user"("username");
CREATE INDEX "user_42_account_index" ON
    "user"("42_account");
ALTER TABLE
    "match" ADD CONSTRAINT "match_id_p2_foreign" FOREIGN KEY("id_p2") REFERENCES "user"("id");
ALTER TABLE
    "match" ADD CONSTRAINT "match_id_p1_foreign" FOREIGN KEY("id_p1") REFERENCES "user"("id");