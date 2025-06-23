'use client';
import { NetworkOverviewItem } from "@/lib/types";
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import NetworkOverviewUngroupedList from "./NetworkOverviewUngroupedList";
import NetworkOverviewGroupedList from "./NetworkOverviewGroupedList";
import { ItemStationMapModal } from "../modals/ItemStationMapModal";
import { useParams } from "next/navigation";
import { RadioButton } from "primereact/radiobutton";


export default function NetworkOverviewContainer({ items }: { items: NetworkOverviewItem[] }) {

    const params = useParams<{projectId: string}>();
    const projectId = parseInt(params.projectId);

    const [ groupByPlatform, setGroupByPlatform ] = useState(false);
    const [ sortBy, setSortBy ] = useState<'name' | 'rate'>('name');

    const [ loadingItems, setLoadingItems ] = useState<NetworkOverviewItem[]>([]);
    const [ unloadingItems, setUnloadingItems ] = useState<NetworkOverviewItem[]>([]);
    const [ availabilityItems, setAvailabilityItems ] = useState<NetworkOverviewItem[]>([]);

    const [ loadingItemsGrouped, setLoadingItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);
    const [ unloadingItemsGrouped, setUnloadingItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);
    const [ availabilityItemsGrouped, setAvailabilityItemsGrouped ] = useState<NetworkOverviewItem[][]>([]);

    const [ selectedItemForStatioMap, setSelectedItemForStationMap ] = useState<NetworkOverviewItem>();
    const [ showItemStationMap, setShowItemStationMap ] = useState(false);

    const onItemClick = (item: NetworkOverviewItem) => {
        setSelectedItemForStationMap(item);
        setShowItemStationMap(true);
    }

    useEffect(() => {

        const loadingItems = {} as Record<string, NetworkOverviewItem>;
        const unloadingItems = {} as Record<string, NetworkOverviewItem>;
        const availabilityItems = {} as Record<string, NetworkOverviewItem>;

        items.forEach((item) => {
            if (item.mode === 'loading') {
                if (!loadingItems[item.item_classname]) {
                    loadingItems[item.item_classname] = {...item};
                } else {
                    loadingItems[item.item_classname].rate += item.rate;
                }
            } else if (item.mode === 'unloading') {
                if (!unloadingItems[item.item_classname]) {
                    unloadingItems[item.item_classname] = {...item};
                } else {
                    unloadingItems[item.item_classname].rate += item.rate;
                }
            }

            if (!availabilityItems[item.item_classname]) {
                availabilityItems[item.item_classname] = (item.mode === 'loading') ? {...item} : {...item, rate: -item.rate};
            } else {
                availabilityItems[item.item_classname].rate += (item.mode === 'loading') ? item.rate : -item.rate;
            }
        });
        setLoadingItems(Object.values(loadingItems).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setUnloadingItems(Object.values(unloadingItems).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setAvailabilityItems(Object.values(availabilityItems).sort((a,b) => a.rate > b.rate ? -1 : 1));

    },[items]);

    useEffect(() => {
        if (groupByPlatform) {

            const res = items.reduce((acc, item) => {
                const pos = item.position;
                if (item.mode === 'loading') {
                    if (!acc.loading[pos]) {
                        acc.loading[pos] = {} as Record<string, NetworkOverviewItem>;
                    }

                    if (acc.loading[pos][item.item_classname]) {
                        acc.loading[pos][item.item_classname].rate += item.rate;
                    } else {
                        acc.loading[pos][item.item_classname] = {...item};
                    }
                } else if (item.mode === 'unloading') {
                    if (!acc.unloading[pos]) {
                        acc.unloading[pos] = {} as Record<string, NetworkOverviewItem>;
                    }

                    if (acc.unloading[pos][item.item_classname]) {
                        acc.unloading[pos][item.item_classname].rate += item.rate;
                    } else {
                        acc.unloading[pos][item.item_classname] = {...item};
                    }
                }

                if (!acc.availability[pos]) {
                    acc.availability[pos] = {};
                }

                if (!acc.availability[pos][item.item_classname]) {
                    acc.availability[pos][item.item_classname] = {...item, rate: item.mode === 'loading' ? item.rate : -item.rate};
                } else {
                    if (item.mode === 'loading') {
                        acc.availability[pos][item.item_classname].rate += item.rate;
                    } else {
                        acc.availability[pos][item.item_classname].rate -= item.rate;
                    }
                }
                

                return acc;
            }, {
                'loading': {} as Record<number, Record<string, NetworkOverviewItem>>, 
                'unloading': {} as Record<number, Record<string, NetworkOverviewItem>>, 
                'availability': {} as Record<number, Record<string, NetworkOverviewItem>>
            });

            setLoadingItemsGrouped(Object.values(res.loading).map((items) => Object.values(items)));
            setUnloadingItemsGrouped(Object.values(res.unloading).map((items) => Object.values(items)));
            setAvailabilityItemsGrouped(Object.values(res.availability).map((items) => Object.values(items)));
        }
    },[groupByPlatform, items])
    
    return (
        <div className="flex flex-col">
            <div className="flex gap-4 my-2">
                <div className="flex items-center gap-2">
                    <Checkbox checked={groupByPlatform} onChange={(e) => setGroupByPlatform(e.checked ?? false)} inputId="groupByPlatform" />
                    <label htmlFor="groupByPlatform">Group by platform</label>
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
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={loadingItems} onItemClick={onItemClick}/>}
                    {groupByPlatform && <NetworkOverviewGroupedList items={loadingItemsGrouped} onItemClick={onItemClick}/>}
                </TabPanel>
                <TabPanel header="Unloading" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={unloadingItems} onItemClick={onItemClick}/>}
                    {groupByPlatform && <NetworkOverviewGroupedList items={unloadingItemsGrouped} onItemClick={onItemClick}/>}
                </TabPanel>          
                <TabPanel header="Availability" pt={{
                headerAction: {
                    className: 'p-2'
                }
                }}>
                    {!groupByPlatform && <NetworkOverviewUngroupedList items={availabilityItems} onItemClick={onItemClick}/>}
                    {groupByPlatform && <NetworkOverviewGroupedList items={availabilityItemsGrouped} onItemClick={onItemClick}/>}
                </TabPanel>              
            </TabView>
            
            <ItemStationMapModal projectId={projectId} visible={showItemStationMap} onHide={() => setShowItemStationMap(false)} item={selectedItemForStatioMap} />

        </div>
    )
}