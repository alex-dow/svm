export default async function TrainsPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (<div>

        <p>Manage train stuff for project #{projectId}</p>
    </div>)
}