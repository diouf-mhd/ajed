import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const migrated = await db.$transaction(async (tx) => {
    const columns = await tx.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Action'
          AND column_name = 'quartierId'
      ) AS "exists"
    `;
    if (!columns[0]?.exists) return false;

    const tables = await tx.$queryRaw<Array<{ exists: boolean }>>`
      SELECT to_regclass('"Quartier"') IS NOT NULL AS "exists"
    `;
    if (!tables[0]?.exists) {
      throw new Error('La table "Quartier" doit exister avant de migrer Action.quartierId.');
    }

    await tx.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_ActionToQuartier" (
        "A" TEXT NOT NULL,
        "B" TEXT NOT NULL,
        CONSTRAINT "_ActionToQuartier_A_fkey" FOREIGN KEY ("A") REFERENCES "Action"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "_ActionToQuartier_B_fkey" FOREIGN KEY ("B") REFERENCES "Quartier"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    await tx.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "_ActionToQuartier_AB_unique" ON "_ActionToQuartier"("A", "B")');
    await tx.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "_ActionToQuartier_B_index" ON "_ActionToQuartier"("B")');
    await tx.$executeRawUnsafe(`
      INSERT INTO "_ActionToQuartier" ("A", "B")
      SELECT action."id", action."quartierId"
      FROM "Action" AS action
      INNER JOIN "Quartier" AS quartier ON quartier."id" = action."quartierId"
      WHERE action."quartierId" IS NOT NULL
      ON CONFLICT ("A", "B") DO NOTHING
    `);
    await tx.$executeRawUnsafe('ALTER TABLE "Action" DROP COLUMN IF EXISTS "quartierId"');
    return true;
  });

  console.log(migrated ? "Liens de quartiers migrés." : "Aucune ancienne colonne Action.quartierId à migrer.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
