-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "properties" JSON,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);