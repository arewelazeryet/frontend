CREATE TABLE `daily` (
	`date` integer PRIMARY KEY NOT NULL,
	`stable` integer NOT NULL,
	`lazer` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_date` ON `daily` (`date`,`stable`,`lazer`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_timestamp` ON `measurements` (`timestamp`,`stable`,`lazer`);
