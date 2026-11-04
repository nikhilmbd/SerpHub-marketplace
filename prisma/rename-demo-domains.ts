import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const renames: Record<string, string> = {
  "amberpeakstudio.example": "amberpeakstudio.com",
  "blueorbitacademy.example": "blueorbitacademy.org",
  "cedarvalleyfoods.example": "cedarvalleyfoods.com",
  "dawnlightwellness.example": "dawnlightwellness.co",
  "evergreenhabitat.example": "evergreenhabitat.org",
  "foxtailcreative.example": "foxtailcreative.com",
  "goldenbridgeconsulting.example": "goldenbridgeconsulting.com",
  "harborviewinn.example": "harborviewinn.com",
  "indigowavefitness.example": "indigowavefitness.com",
  "junipertrailoutdoors.example": "junipertrailoutdoors.com",
  "keystonecloudlabs.example": "keystonecloudlabs.io",
  "lakesidebistro.example": "lakesidebistro.com",
  "mapleleaflearning.example": "mapleleaflearning.org",
  "northstarlegalgroup.example": "northstarlegalgroup.com",
  "opalbeautycollective.example": "opalbeautycollective.com",
  "pinecrestlogistics.example": "pinecrestlogistics.net",
  "quartzmediahouse.example": "quartzmediahouse.com",
  "riverbendnonprofit.example": "riverbendnonprofit.org",
  "silverlinecommerce.example": "silverlinecommerce.co",
  "willowbrookdesign.example": "willowbrookdesign.com",
};

async function main() {
  let renamed = 0;
  for (const [oldName, newName] of Object.entries(renames)) {
    const existing = await prisma.domain.findUnique({ where: { name: oldName } });
    if (!existing) continue;

    const conflict = await prisma.domain.findUnique({ where: { name: newName } });
    if (conflict && conflict.id !== existing.id) {
      throw new Error(`Cannot rename ${oldName}: ${newName} already exists.`);
    }

    await prisma.domain.update({
      where: { id: existing.id },
      data: {
        name: newName,
        slug: newName.toLowerCase(),
        description: "DEMO SAMPLE — fictional placeholder for homepage preview only; not an actual domain sale or verified transaction.",
      },
    });
    renamed++;
  }
  console.log(`Demo domain names updated: ${renamed}.`);
}

main()
  .catch((error) => {
    console.error("Demo domain rename failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
