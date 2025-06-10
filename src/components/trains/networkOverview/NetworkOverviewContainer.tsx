'use client';
import { NetworkOverviewItem } from "@/lib/types";
import { Checkbox } from "primereact/checkbox";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import NetworkOverviewUngroupedList from "./NetworkOverviewUngroupedList";
import NetworkOverviewGroupedList from "./NetworkOverviewGroupedList";
import { ItemStationMapModal } from "../modals/ItemStationMapModal";
import { useParams } from "next/navigation";


export default function NetworkOverviewContainer({ items }: { items: NetworkOverviewItem[] }) {

    const params = useParams<{projectId: string}>();
    const projectId = parseInt(params.projectId);

    const [ groupByPlatform, setGroupByPlatform ] = useState(false);

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

        const li = {} as Record<string, NetworkOverviewItem>;
        const ui = {} as Record<string, NetworkOverviewItem>;
        const ai = {} as Record<string, NetworkOverviewItem>;

        items.forEach((item) => {
            if (item.mode === 'loading') {
                if (!li[item.item_classname]) {
                    li[item.item_classname] = {...item};
                } else {
                    li[item.item_classname].rate += item.rate;
                }
            } else if (item.mode === 'unloading') {
                if (!ui[item.item_classname]) {
                    ui[item.item_classname] = {...item};
                } else {
                    ui[item.item_classname].rate += item.rate;
                }
            }

            if (!ai[item.item_classname]) {
                ai[item.item_classname] = (item.mode === 'loading') ? {...item} : {...item, rate: -item.rate};
            } else {
                ai[item.item_classname].rate += (item.mode === 'loading') ? item.rate : -item.rate;
            }
        });
        setLoadingItems(Object.values(li).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setUnloadingItems(Object.values(ui).sort((a,b) => a.rate > b.rate ? -1 : 1));
        setAvailabilityItems(Object.values(ai).sort((a,b) => a.rate > b.rate ? -1 : 1));

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

            console.log('groupedby res:', res);

            setLoadingItemsGrouped(Object.values(res.loading).map((items) => Object.values(items)));
            setUnloadingItemsGrouped(Object.values(res.unloading).map((items) => Object.values(items)));
            setAvailabilityItemsGrouped(Object.values(res.availability).map((items) => Object.values(items)));
        }
    },[groupByPlatform, items])
    
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <Checkbox checked={groupByPlatform} onChange={(e) => setGroupByPlatform(e.checked ?? false)} inputId="groupByPlatform" />
                <label htmlFor="groupByPlatform">Group by platform</label>
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