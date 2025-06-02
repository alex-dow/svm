export default async function TrucksPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (
        <div>
            <p>Trucks for { projectId }</p>
        </div>
    )

}