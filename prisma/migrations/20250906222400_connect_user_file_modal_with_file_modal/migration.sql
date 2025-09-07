-- AddForeignKey
ALTER TABLE "public"."user_files" ADD CONSTRAINT "user_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
