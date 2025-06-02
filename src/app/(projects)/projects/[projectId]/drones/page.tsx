export default async function DronesPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (
        <div>
            <p>Drones for { projectId }</p>
        </div>
    )

}