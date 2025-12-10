import { parseDocs } from "@/lib/satisfactory/docs";

export default async function main(args: string[]) {
  const docsPath = args[0];

  const docs = parseDocs(docsPath);

  console.log(docs);
}

main(process.argv.slice(2));
