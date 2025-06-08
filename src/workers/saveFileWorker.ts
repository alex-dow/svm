import { BoolProperty, ObjectProperty, Parser, SatisfactorySave, SaveComponent, SaveEntity, StructArrayProperty, StructProperty, TextProperty } from "@etothepii/satisfactory-file-parser";
import { getErrorMessage, sendEvent } from "./base";
import { TimeTableStop, TrainDockingRuleSet } from "@/lib/types/satisfactory/saveFileTypes";
import { ImportTrain, ImportTrainStation, ImportTrainStationPlatform, ImportTrainTimetableStop } from "@/lib/types/satisfactory/importSaveTypes";
import { ItemType } from "@/lib/satisfactory/data";

/**
 * This worker will collect the following data:
 * 1. save game name
 * 2. train station names
 * 3. number of platforms per train station
 *
 * TODO:
 * Collect train consist names and number of rail cars per consist
 * Collect truck stations
 * Collect drone stations
 * 
 */


// common typePath filters
const stationTypeFilter = '/Script/FactoryGame.FGTrainStationIdentifier';
const platformConnectionType = '/Script/FactoryGame.FGTrainPlatformConnection';
const timetableType = '/Script/FactoryGame.FGRailroadTimeTable';
const trainType = '/Game/FactoryGame/Buildable/Vehicle/Train/-Shared/BP_Train.BP_Train_C';
const locomotiveType = '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C';
const freightWagonType = '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C';

// dislike having to maintain a list like this since it means always have to manually
// update when mods change but I am not sure there is another way to do it without
// having to reiterate over the whole save

const vanillaPlatformTypes = [
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation.Build_TrainDockingStation_C',
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainPlatformEmpty.Build_TrainPlatformEmpty_C',
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStationLiquid.Build_TrainDockingStationLiquid_C'
];

// small train station mod: https://ficsit.app/mod/SmallTrainStation
const smallTrainStationPlatformTypes = [
    '/SmallTrainStation/Build_SmallTrainDockingStation.Build_SmallTrainDockingStation_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationLiquid.Build_SmallTrainDockingStationLiquid_C',
    '/SmallTrainStation/Build_SmallEmpty.Build_SmallEmpty_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationINPUTS.Build_SmallTrainDockingStationINPUTS_C',
    '/SmallTrainStation/Build_SmallTrainDockingOUTPUTS.Build_SmallTrainDockingOUTPUTS_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationLiquidINPUTS.Build_SmallTrainDockingStationLiquidINPUTS_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationLiquidOUTPUTS.Build_SmallTrainDockingStationLiquidOUTPUTS_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationLiquidUnderground.Build_SmallTrainDockingStationLiquidUnderground_C',
    '/SmallTrainStation/Build_SmallTrainDockingStationUnderground.Build_SmallTrainDockingStationUnderground_C',
    '/SmallTrainStation/DI_Stations/DI_Outputs.DI_Outputs_C',
    '/SmallTrainStation/DI_Stations/DI_Inputs.DI_Inputs_C',


]

// modular station mod: https://ficsit.app/mod/DgzoFEpaM5vtXv
const modularStationPlatformTypes = [
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSide_Underfed.Build_TrainPlatformDockingSide_Underfed_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSideFluid_Underfed.Build_TrainPlatformDockingSideFluid_Underfed_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSideFluid.Build_TrainPlatformDockingSideFluid_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSide.Build_TrainPlatformDockingSide_C'
]

const platformTypes = [
    ...vanillaPlatformTypes,
    ...smallTrainStationPlatformTypes,
    ...modularStationPlatformTypes
];

export type SaveItem = SaveEntity | SaveComponent;


/**
 * Collects names and IDs of things we want to import.
 * 
 * Currently only imports train stations.
 * 
 * TODO: Train consists, truck stations, drone stations
 */
export function collectImportableItems(save: SatisfactorySave) {

    // collected train stations
    const trainStations: (SaveEntity | SaveComponent)[] = [];

    // collected platform connections. 
    const platformConnections: (SaveEntity | SaveComponent)[] = [];

    // collected platforms
    const platforms: (SaveEntity | SaveComponent)[] = [];

    // collected consists
    const trainConsists: (SaveEntity | SaveComponent)[] = [];

    // collected locomotives
    const locomotives: (SaveEntity | SaveComponent)[] = [];

    // colleted wagons
    const wagons: (SaveEntity | SaveComponent)[] = [];

    // collected timestables
    const timetables: (SaveEntity | SaveComponent)[] = [];


    const levels = Object.values(save.levels);
    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        for (let j = 0; j < level.objects.length; j++) {
            const obj = level.objects[j];



            if (obj.typePath === stationTypeFilter) {
                trainStations.push(obj);
            } else if (obj.typePath === platformConnectionType) {
                platformConnections.push(obj);
            } else if (obj.typePath === trainType) {
                trainConsists.push(obj);
            } else if (obj.typePath === locomotiveType) {
                locomotives.push(obj);
            } else if (obj.typePath === freightWagonType) {
                wagons.push(obj);
            } else if (obj.typePath === timetableType) {
                timetables.push(obj);
            } else if (platformTypes.includes(obj.typePath)) {
                platforms.push(obj);
            }
        }
    }

    return { trainStations, platformConnections, trainConsists, locomotives, wagons, timetables, platforms };
}


export function getTrainWagons(carId: string, wagons: SaveItem[]) {
    const consistWagons = [];

    for (let i = 0; i < wagons.length; i++) {
        const w = wagons[i];
        if (w.specialProperties.type === 'VehicleSpecialProperties') {
            if (w.specialProperties.vehicleInFront?.pathName === carId) {
                if (w.specialProperties.vehicleBehind?.pathName) {
                    consistWagons.push(...getTrainWagons(w.specialProperties.vehicleBehind.pathName, wagons));
                }
                break;
            }
        }
    }
    return wagons;
}

export function getTimetableStops(mStops: StructArrayProperty): ImportTrainTimetableStop[] {

    return mStops.values.map((stop: StructProperty) => {
        const timeTableStop = stop.value as unknown as TimeTableStop;
        
        const stationInstanceName = timeTableStop.properties.Station.value.pathName || 'unknown';

        const dockingRulesSet = timeTableStop.properties.DockingRuleSet.value as unknown as TrainDockingRuleSet;

        const loadingItems = dockingRulesSet.properties.LoadFilterDescriptors.values
        .filter((desc) => desc.pathName != '/Game/FactoryGame/Resource/FilteringRules/Desc_None.Desc_None_C')
        .map((desc) => {
            return desc.pathName.split('.').pop() as ItemType;
        });

        const unloadingItems = dockingRulesSet.properties.UnloadFilterDescriptors.values
        .filter((desc) => desc.pathName != '/Game/FactoryGame/Resource/FilteringRules/Desc_None.Desc_None_C')
        .map((desc) => {
            return desc.pathName.split('.').pop() as ItemType;
        });

        return {
            loadingItems,
            stationInstanceName,
            unloadingItems
        }

    });
}


export function buildTrain(train: SaveItem, wagons: SaveItem[], timetables: SaveItem[]): ImportTrain {
    const mTrainName = train.properties['mTrainName'] as TextProperty;
    const firstVehicle = train.properties['FirstVehicle'] as ObjectProperty;
    const timeTable = train.properties['TimeTable'] as ObjectProperty;

    const trainName = mTrainName.value.value || 'unknown'
    const instanceName = train.instanceName;

    const consistWagons = getTrainWagons(firstVehicle.value.pathName, wagons);

    let timeTableStops: ImportTrainTimetableStop[] = [];

    const timeTableInstance = timetables.find((tt) => tt.instanceName === timeTable.value.pathName);
    if (timeTableInstance) {
        const stops = timeTableInstance.properties['mStops'] as StructArrayProperty;
        timeTableStops = getTimetableStops(stops);
    }

    return {
        instanceName,
        timetable: timeTableStops,
        trainName,
        wagons: consistWagons.length,
    }
}




/**
 * Get the entire chain of platform connections for a given connectionId.
 * 
 * @param connectionId 
 * @param platforms 
 * @returns 
 */
export function getStationPlatforms(connectionId: string, platformConnections: SaveItem[], platforms: SaveItem[]): ImportTrainStationPlatform[] {

    const stationPlatforms: ImportTrainStationPlatform[] = [];

    for (let i = 0; i < platformConnections.length; i++) {
        if (platformConnections[i].instanceName === connectionId) {
            const mConnectedTo = platformConnections[i].properties['mConnectedTo'] as ObjectProperty
            if (mConnectedTo) {
                const pathName = mConnectedTo.value.pathName;
                const platformId = pathName.replace('.PlatformConnection0','').replace('.PlatformConnection1','');
                const platform = platforms.find((e) => e.instanceName === platformId);
                const platformMode = platform?.properties['mIsInLoadMode'] ? (platform.properties['mIsInLoadMode'] as BoolProperty).value : true
                stationPlatforms.push({
                    instanceName: pathName,
                    mode: platformMode ? 'loading' : 'unloading'
                });
                break;
            }
        }
    }

    if (stationPlatforms.length > 0) {
        const connectedTo = stationPlatforms[stationPlatforms.length-1];
        let nextConnection: string;
        if (connectedTo.instanceName.endsWith('.PlatformConnection0')) {
            nextConnection = connectedTo.instanceName.replace('.PlatformConnection0','.PlatformConnection1');
        } else if (connectedTo.instanceName.endsWith('.PlatformConnection1')) {
            nextConnection = connectedTo.instanceName.replace('.PlatformConnection1','.PlatformConnection0');
        } else {
            console.warn('strange platform?', connectedTo);
            return stationPlatforms;
        }
        
        stationPlatforms.push(...getStationPlatforms(nextConnection, platformConnections, platforms));
    }

    return stationPlatforms;
}


/**
 * With an FGTrainStationIdentifier object, we can get the station name, id, and number of platforms.
 * 
 * @param station FGTrainStationIdentifier object
 * @param platforms FGTrainPlatformConnection objects
 * @returns stationName, stationId, platforms: number
 */
export function buildStation(station: SaveItem, platformConnections: SaveItem[], platforms: SaveItem[]): ImportTrainStation {
    const mStation = station.properties['mStation'] as ObjectProperty;
    const mStationName = station.properties['mStationName'] as TextProperty;

    const stationInstanceName = mStation.value.pathName;
    const connectionId = stationInstanceName + '.PlatformConnection0';

    const stationPlatforms = getStationPlatforms(connectionId, platformConnections, platforms);

    return {
        instanceName: station.instanceName,
        platforms: stationPlatforms,
        stationName: mStationName.value.value || '', 
        stationInstanceName 
    };
}

export interface ParseSaveFileOptions {
    onProgressCallback?: (progress: number) => void;
}

export async function parseSaveFile(saveFile: File, options: ParseSaveFileOptions = {}) {
    const buf = await saveFile.arrayBuffer();

    const parserOptions = {
        onProgressCallback: options.onProgressCallback
    }

    const save = Parser.ParseSave('MySave', buf, parserOptions);

    return save;
}



export async function dispatcher(e: MessageEvent<File>) {
    try {
        sendEvent('parsing');
        const save = await parseSaveFile(e.data, {
            onProgressCallback: (progress) => {
                sendEvent('parsing-progress', progress);
            }
        });

        sendEvent('collecting-items');
        sendEvent('save-name', save.header.sessionName);
        const collected = collectImportableItems(save);

        const trainStations = collected.trainStations.map((trainStation) => buildStation(trainStation, collected.platformConnections, collected.platforms));
        sendEvent('train-stations', trainStations);
        
        const trains = collected.trainConsists.map((trainConsist) => buildTrain(trainConsist, collected.wagons, collected.timetables));
        sendEvent('trains', trains);
        
        
        
    } catch (err) {
        console.error(err);
        const message = getErrorMessage(err);
        sendEvent('error', message);
    }
    sendEvent('finished');
}

onmessage = async function (e) {
    dispatcher(e);
}