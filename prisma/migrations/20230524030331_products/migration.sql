CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "properties" JSONB,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);