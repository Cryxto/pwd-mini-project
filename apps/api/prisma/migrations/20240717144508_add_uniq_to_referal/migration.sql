/*
  Warnings:

  - A unique constraint covering the columns `[referalCode]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_referalCode_key` ON `users`(`referalCode`);
