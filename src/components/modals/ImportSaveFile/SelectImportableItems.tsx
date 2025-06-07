import { ImportTrain, ImportTrainStation } from "@/lib/types/satisfactory/importSaveTypes";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export interface SelectImportableItemsProps {
    trainStations: ImportTrainStation[],
    trains: ImportTrain[],
    onImportItems: (e: {trainStations: ImportTrainStation[], trains: ImportTrain[]}) => void
    saveName: string
}

export interface ItemsHeaderProps {
    items: ImportTrain[] | ImportTrainStation[],
    header: React.ReactNode,
    setSelectedItems: (v: string[]) => void,
    selectedItems: string[]
}

export function ItemsHeader({items, header, setSelectedItems, selectedItems}: ItemsHeaderProps) {
    return (
        
        <div className="flex items-center gap-4">
            <Checkbox
                onClick={(e) => e.stopPropagation()}
                checked={selectedItems.length === items.length} 
                onChange={(e) => {
                    setSelectedItems(e.checked ? items.map((item) => item.instanceName) : []);
                }}
            />
            <div>
                { header }
            </div>
            <div className="flex-1 flex justify-end">
                <Badge value={items.length}/> 
            </div>
                        
        </div>
    )
}

export interface ItemsListProps {
    items: {instanceName: string, label: string}[]
    setSelectedItems: (v: string[]) => void,
    selectedItems: string[],
}
export function ItemsList({items, selectedItems, setSelectedItems}: ItemsListProps) {
return (
    <ul>
        {items.map((item) => (
            <li key={item.instanceName} className="flex items-center gap-2 p-0.5">
                <Checkbox 
                    checked={selectedItems.includes(item.instanceName)} 
                    onChange={(e) => {
                        if (e.checked) {
                            setSelectedItems([...selectedItems, item.instanceName]);
                        } else {
                            setSelectedItems(selectedItems.filter((id) => id === item.instanceName));
                        }
                    }}
                /> 
                {item.label }
            </li>
        ))}
    </ul>    
)
}


export default function SelectImportableItems({trainStations, trains, onImportItems, saveName}: SelectImportableItemsProps) {
    const [ selectedTrainStations, setSelectedTrainStations ] = useState<string[]>([]);
    const [ selectedTrains, setSelectedTrains ] = useState<string[]>([]);
    const [ projectName, setProjectName ] = useState<string>(saveName);

    const onClick = () => {
        const items = {
            trainStations: trainStations.filter((station) => selectedTrainStations.includes(station.instanceName)),
            trains: trains.filter((train) => selectedTrains.includes(train.instanceName))
        }

        onImportItems(items);
    }

    return (
        <div className="flex flex-1 flex-col gap-2">
            
            <label htmlFor="project-name">Project name</label>
            <InputText value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" id="project-name"/>
            
            <p>Choose which items to import:</p>
            
            <Accordion>
                <AccordionTab header={(
                    <ItemsHeader 
                        items={trainStations} 
                        selectedItems={selectedTrainStations} 
                        setSelectedItems={setSelectedTrainStations}
                        header="Train Stations"
                    />
                )}>
                    <ItemsList 
                        items={trainStations.map(ts => ({instanceName: ts.instanceName, label: ts.stationName}))} 
                        selectedItems={selectedTrainStations} 
                        setSelectedItems={setSelectedTrainStations} 
                    />
                </AccordionTab>                
                <AccordionTab header={(
                    <ItemsHeader 
                        items={trains} 
                        selectedItems={selectedTrains} 
                        setSelectedItems={setSelectedTrains}
                        header="Trains"
                    />
                )}>
                    <ItemsList 
                        items={trains.map(t => ({instanceName: t.instanceName, label: t.trainName}))} 
                        selectedItems={selectedTrains} 
                        setSelectedItems={setSelectedTrains} 
                    />
                </AccordionTab>

            </Accordion>
            <Button label="Create project" onClick={onClick}/>
        </div>
    )
}