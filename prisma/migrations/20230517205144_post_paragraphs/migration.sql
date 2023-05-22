ALTER TABLE "Post"
ADD COLUMN "paragraphs" TEXT[];

UPDATE "Post"
SET paragraphs = ARRAY[content];

ALTER TABLE "Post"
DROP COLUMN content;
