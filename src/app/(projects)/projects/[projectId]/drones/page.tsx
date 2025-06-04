export default async function DronesPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (
        <div className="p-2">
            <p>Drones for project #{projectId}</p>
            <p>This feature is not implemented yet.</p>
        </div>
    )

}