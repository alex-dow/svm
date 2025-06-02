export default async function TrainsPage({params}: {params: Promise<{projectId: string}>}) {
    const { projectId } = await params;

    return (
        <div className="p-2">
            <p>Select a train station from the left side menu</p>
        </div>
    );
}