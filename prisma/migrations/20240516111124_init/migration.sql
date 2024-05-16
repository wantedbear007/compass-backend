-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'others',
    "title" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL DEFAULT 'NA',

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activities_id_key" ON "Activities"("id");
