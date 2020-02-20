

-- NOTE: CSV Paths are hardcoded, you must set them to your appropriate path


DROP TABLE IF EXISTS "gpp";
DROP TABLE IF EXISTS "zips";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "tickets";
DROP TABLE IF EXISTS "utilities";

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar
);

CREATE TABLE "zips" (
	"id" SERIAL PRIMARY KEY,
	"zip" INT,
	"eiaid" INT,
	"state" VARCHAR,
	"eia_state" VARCHAR
);

CREATE TABLE "utilities" (
	"id" SERIAL PRIMARY KEY,
	"eiaid" INT,
	"eia_state" VARCHAR,
	"state" VARCHAR,
	"utility_name" VARCHAR,
	"bundled_avg_comm_rate" FLOAT,
	"bundled_avg_ind_rate" FLOAT,
	"bundled_avg_res_rate" FLOAT,
	"delivery_avg_comm_rate" FLOAT,
	"delivery_avg_ind_rate" FLOAT,
	"delivery_avg_res_rate" FLOAT,
  	"production" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "gpp" (
	"id" SERIAL PRIMARY KEY,
	"eiaid" INT,
	"utility_name" VARCHAR,
	"state" VARCHAR,
	"eia_state" VARCHAR,
	"program_id" VARCHAR,
	"program_name" VARCHAR,
	"wind" FLOAT,
	"solar" FLOAT,
	"bio" FLOAT,
	"hydro" FLOAT,
	"geo" FLOAT,
	"other" FLOAT,
	"cost_kwh" FLOAT,
	"cost_range" VARCHAR,
	"contract_length" VARCHAR,
	"credit_yn" VARCHAR,
	"credit_kwh" FLOAT,
	"blocks_available" VARCHAR,
	"block_size_kwh" VARCHAR,
	"block_cost" VARCHAR,
	"percentage_options" VARCHAR,
	"percentage_range" VARCHAR,
	"monthly_min" VARCHAR,
	"termination_fee" VARCHAR,
	"termination_cost" VARCHAR,
	"green_e" VARCHAR,
	"recs_retired" VARCHAR,
	"revenue_neutral" VARCHAR,
	"retail" VARCHAR,
	"waitlist" VARCHAR,
	"sign_up_text" VARCHAR,
	"sign_up_url" VARCHAR,
	"date_updated" DATE DEFAULT CURRENT_DATE,
	"production" INT DEFAULT 0
);

CREATE TABLE "tickets" (
	"id" SERIAL PRIMARY KEY,
	"resolved" BOOLEAN DEFAULT FALSE,
	"type" INT,
	-- 0: missing utility company
	-- 1: missing program
	-- 2: errors in program
	"state" VARCHAR,
	"zip" INT,
	"zips_id" INT,
	"utility_name" VARCHAR,
	"eia_state" VARCHAR,
	"program_name" VARCHAR,
	"gpp_id" INT,
	"email" VARCHAR,
	"date_submitted" DATE DEFAULT CURRENT_DATE,
	"comments" VARCHAR
);

BEGIN;
	CREATE TEMPORARY TABLE "t" (
		"zip" INT,
		"eiaid" INT,
		"utility_name" VARCHAR,
		"state" VARCHAR,
		"eia_state" VARCHAR,
		"bundled_avg_comm_rate" FLOAT,
		"bundled_avg_ind_rate" FLOAT,
		"bundled_avg_res_rate" FLOAT,
		"delivery_avg_comm_rate" FLOAT,
		"delivery_avg_ind_rate" FLOAT,
		"delivery_avg_res_rate" FLOAT,
		"energy_avg_comm_rate" FLOAT,
		"energy_avg_ind_rate" FLOAT,
		"energy_avg_res_rate" FLOAT,
		"x1" VARCHAR, "x2" VARCHAR, "x3" VARCHAR, "x4" VARCHAR, "x5" VARCHAR, "x6" VARCHAR, "x7" VARCHAR, "x8" VARCHAR, "x9" VARCHAR, "x10" VARCHAR, "x11" VARCHAR, "x12" VARCHAR, "x13" VARCHAR, "x14" VARCHAR
	);

	\copy "t" FROM './green_neighbor_zips.tsv' DELIMITER E'\t' CSV HEADER;
	INSERT INTO "zips" ("zip", "eiaid", "state", "eia_state")
	SELECT "zip", "eiaid", "state", "eia_state" FROM "t";

	INSERT INTO "utilities" ("utility_name", "state", "eiaid", "eia_state", "bundled_avg_comm_rate", "bundled_avg_ind_rate", "bundled_avg_res_rate", "delivery_avg_comm_rate", "delivery_avg_ind_rate", "delivery_avg_res_rate")
	SELECT "utility_name", "state", "eiaid", "eia_state", "bundled_avg_comm_rate", "bundled_avg_ind_rate", "bundled_avg_res_rate", "delivery_avg_comm_rate", "delivery_avg_ind_rate", "delivery_avg_res_rate"
	FROM "t"
	GROUP BY "utility_name", "state", "eiaid", "eia_state", "bundled_avg_comm_rate", "bundled_avg_ind_rate", "bundled_avg_res_rate", "delivery_avg_comm_rate", "delivery_avg_ind_rate", "delivery_avg_res_rate";
COMMIT;

BEGIN;
	CREATE TEMPORARY TABLE "alldata" (
		"EIAID" INT,
		"Utility Name" VARCHAR,
		"State" VARCHAR,
		"eiaSTATE" VARCHAR,
		"ProgramID" VARCHAR,
		"Program Name" VARCHAR,
		"Wind" FLOAT,
		"Solar" FLOAT,
		"Bio" FLOAT,
		"Hydro" FLOAT,
		"Geo" FLOAT,
		"Other" FLOAT,
		"Cost (c/kwh)" FLOAT,
		"Cost Range (c/kwh)" VARCHAR,
		"Credit (Y/N)" VARCHAR,
		"Credit (c/kwh)" FLOAT,
		"Blocks Available" VARCHAR,
		"Block Size (kWh)" VARCHAR,
		"Block Cost ($)" VARCHAR,
		"Percentage Options" VARCHAR,
		"Percentage Range" VARCHAR,
		"Contract Length" VARCHAR,
		"Monthly Minimum" VARCHAR,
		"Termination Fee" VARCHAR,
		"Termination Cost" VARCHAR,
		"Green-e" VARCHAR,
		"RECs Retired?" VARCHAR,
		"Revenue Neutral" VARCHAR,
		"Retail" VARCHAR,
		"Waitlist (Y/N)" VARCHAR,
		"Rating (TBD for now)" VARCHAR,
		"Link to Sign-up Form" VARCHAR,
		"Sign-Up URL" VARCHAR,
		"Step 1" VARCHAR,
		"Step 2" VARCHAR,
		"Step 3" VARCHAR,
		"Step 4" VARCHAR,
		"Step 5" VARCHAR,
		"Link to FAQ's" VARCHAR,
		"FAQ URL" VARCHAR,
		"sign in required?" VARCHAR,
		"account name required?" VARCHAR,
		"account number?" VARCHAR,
		"Address?" VARCHAR,
		"Enrollment choices?" VARCHAR,
		"must be printed/mailed" VARCHAR,
		"Email" VARCHAR,
		"Contact URL" VARCHAR,
		"Phone" VARCHAR,
		"Date Updated" DATE,
		"Notes" VARCHAR,
		"Production" INT
	);
	
	\copy "alldata" FROM './green_neighbor_data.tsv' DELIMITER E'\t' CSV HEADER;
	
	INSERT INTO "gpp" ("eiaid", "utility_name", "state", "eia_state", "program_id", "program_name", "wind", "solar", "bio", "hydro", "geo", "other", "cost_kwh", "cost_range", "credit_yn", "credit_kwh", "blocks_available", "block_size_kwh", "block_cost", "percentage_options", "percentage_range", "contract_length", "monthly_min", "termination_fee", "termination_cost", "green_e", "recs_retired", "revenue_neutral", "retail", "waitlist", "sign_up_text", "sign_up_url", "date_updated", "production"
		) SELECT "EIAID", "Utility Name", "State", "eiaSTATE", "ProgramID", "Program Name", "Wind", "Solar", "Bio", "Hydro", "Geo", "Other", "Cost (c/kwh)", "Cost Range (c/kwh)", "Credit (Y/N)", "Credit (c/kwh)", "Blocks Available", "Block Size (kWh)", "Block Cost ($)", "Percentage Options", "Percentage Range", "Contract Length", "Monthly Minimum", "Termination Fee", "Termination Cost", "Green-e", "RECs Retired?", "Revenue Neutral", "Retail", "Waitlist (Y/N)", "Link to Sign-up Form", "Sign-Up URL", "Date Updated", "Production"
		FROM "alldata";

	UPDATE "utilities" SET "production"=true
		FROM "gpp" 
		WHERE "utilities"."eia_state"="gpp"."eia_state"
		AND "gpp"."production"=1;
COMMIT;