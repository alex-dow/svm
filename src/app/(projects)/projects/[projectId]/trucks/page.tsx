export default async function TrucksPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (
        <div className="p-2">
            <p>Trucks for project #{projectId}</p>
            <p>This feature is not implemented yet.</p>
        </div>
    )

}