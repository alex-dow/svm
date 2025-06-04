import { AddItemButton } from "./buttons/AddItemButton";
    
export default async function PlatformAccordionTabHeader({platformId}: {platformId: number}) {

    return (

        <div className="flex flex-1 justify-between items-center">
            <AddItemButton platformId={platformId}/>
        </div>
    );
}