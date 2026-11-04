import { PrismaClient, DomainStatus } from "@prisma/client";
import records from "./import-domains.json";
const prisma = new PrismaClient();
function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
async function main() {
 let created=0, updated=0;
 for (const item of records) {
  const category=await prisma.category.upsert({where:{name:item.category},update:{},create:{name:item.category,slug:slugify(item.category)}});
  const data={name:item.name,slug:item.name.toLowerCase(),priceUSD:item.priceUSD,description:item.description ?? null,categoryId:category.id,ageYears:item.ageYears,authorityScore:item.authorityScore,domainAuthority:item.domainAuthority,pageAuthority:item.pageAuthority,domainRating:item.domainRating,backlinks:BigInt(item.backlinks),tags:item.tags,status: item.status === "SOLD" ? DomainStatus.SOLD : DomainStatus.AVAILABLE,listingType:"OWNED" as const};
  const existing=await prisma.domain.findUnique({where:{name:item.name}});
  await prisma.domain.upsert({where:{name:item.name},update:data,create:data});
  if(existing) updated++; else created++;
 }
 console.log(`Import complete: ${created} created, ${updated} updated.`);
}
main().catch(e=>{console.error("Domain import failed:",e);process.exitCode=1;}).finally(async()=>{await prisma.$disconnect();});
