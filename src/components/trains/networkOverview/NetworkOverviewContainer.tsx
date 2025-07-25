'use client';
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import NetworkOverviewUngroupedList from "./NetworkOverviewUngroupedList";
import NetworkOverviewGroupedList from "./NetworkOverviewGroupedList";
import { ItemStationMapModal } from "../modals/ItemStationMapModal";
import { useParams } from "next/navigation";
import { RadioButton } from "primereact/radiobutton";
import { TrainNetworkItem } from "@/server/db/schemas/trains";
import RebuildNetwork from "./buttons/RebuildNetwork";

export default function NetworkOverviewContainer({ items }: { items: TrainNetworkItem[] }) {

    const params = useParams<{projectId: string}>();
    const projectId = parseInt(params.projectId);

    const [ groupByPlatform, setGroupByPlatform ] = useState(false);
    const [ sortBy, setSortBy ] = useState<'name' | 'rate'>('name');

    const [ selectedItemForStatioMap, setSelectedItemForStationMap ] = useState<TrainNetworkItem>();
    const [ showItemStationMap, setShowItemStationMap ] = useState(false);

    const onItemClick = (item: TrainNetworkItem) => {
        setSelectedItemForStationMap(item);
        setShowItemStationMap(true);
    }

    
    return (
        <div className="flex flex-col">
            <div className="flex gap-4 my-2">
                <div className="flex items-center gap-2">
                    <Checkbox checked={groupByPlatform} onChange={(e) => setGroupByPlatform(e.checked ?? false)} inputId="groupByPlatform" />
                    <label htmlFor="groupByPlatform">Group by platform</label>
                    <RebuildNetwork />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center flex-1 gap-2">
                        <RadioButton inputId="sort-by-name" name="sort-by" value="name" onChange={(e) => setSortBy(e.value as 'name' | 'rate')} checked={sortBy === 'name'} />
                        <label htmlFor="sort-by-name">Sort by name</label>
                    </div>
                    <div className="flex items-center flex-1 gap-2">
                        <RadioButton inputId="sort-by-rate" name="sort-by" value="rate" onChange={(e) => setSortBy(e.value as 'name' | 'rate')} checked={sortBy === 'rate'} />
                        <label htmlFor="sort-by-rate">Sort by rate</label>
                    </div>
                </div>
            </div>
           
            <TabView pt={{
                panelContainer: {
                className: 'p-0'
                },
                
            }}>
                <TabPanel header="Loading" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={items} onItemClick={onItemClick} mode="loading" sortBy={sortBy} />}
                    {groupByPlatform && <NetworkOverviewGroupedList items={items} onItemClick={onItemClick} mode="loading" sortBy={sortBy} />}
                </TabPanel>
                <TabPanel header="Unloading" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={items} onItemClick={onItemClick} mode="unloading" sortBy={sortBy}/>}
                    {groupByPlatform && <NetworkOverviewGroupedList items={items} onItemClick={onItemClick} mode="unloading" sortBy={sortBy}/>}
                </TabPanel>          
                <TabPanel header="Availability" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={items} onItemClick={onItemClick} mode="availability" sortBy={sortBy}/>}
                    {groupByPlatform && <NetworkOverviewGroupedList items={items} onItemClick={onItemClick} mode="availability" sortBy={sortBy}/>}
                </TabPanel>              
            </TabView>
            
            <ItemStationMapModal projectId={projectId} visible={showItemStationMap} onHide={() => setShowItemStationMap(false)} item={selectedItemForStatioMap} />

        </div>
    )
}