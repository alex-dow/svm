import { Splitter, SplitterPanel } from "primereact/splitter";
import { StationNavPanel } from "@/components/trains/StationNavPanel";
import { Suspense } from "react";


export default async function TrainsRootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{projectId: string}>
}>) {
    const { projectId } = await params;

  return (
    <Splitter className="flex flex-1">
      <SplitterPanel size={25} minSize={25} className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
          <StationNavPanel projectId={parseInt(projectId)}/>
        </div>
      </SplitterPanel>
      <SplitterPanel size={75} className="flex flex-col">
        { children }
      </SplitterPanel>
    </Splitter>
  );
}