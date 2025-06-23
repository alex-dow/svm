import { SaveComponent, SaveEntity } from "@etothepii/satisfactory-file-parser";

/**
 * Platform and station types, including mods.
 */

/**
 * Vanilla platform/station types.
 */
export const vanillaPlatformTypes = [
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStation.Build_TrainDockingStation_C',
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainPlatformEmpty.Build_TrainPlatformEmpty_C',
    '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainDockingStationLiquid.Build_TrainDockingStationLiquid_C'
] as Readonly<string[]>;

/**
 * Small Train Station Mod platform/station types.
 * 
 * See: https://ficsit.app/mod/SmallTrainStation
 */
export const smallTrainStationPlatformTypes = [
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
] as Readonly<string[]>;

/**
 * Modular Station Mod platform/station types.
 * 
 * See: https://ficsit.app/mod/DgzoFEpaM5vtXv
 */
export const modularStationPlatformTypes = [
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSide_Underfed.Build_TrainPlatformDockingSide_Underfed_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSideFluid_Underfed.Build_TrainPlatformDockingSideFluid_Underfed_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSideFluid.Build_TrainPlatformDockingSideFluid_C',
    '/ModularStations/Buildables/CargoPlatform/Build_TrainPlatformDockingSide.Build_TrainPlatformDockingSide_C'
] as Readonly<string[]>;

export const platformTypes = [
    ...vanillaPlatformTypes,
    ...smallTrainStationPlatformTypes,
    ...modularStationPlatformTypes
] as Readonly<string[]>;


/**
 * Common typePaths
 */

/**
 * Station identifier - this will have the train station name and the instance name of the actual
 * train station.
 */
export const stationTypeFilter = '/Script/FactoryGame.FGTrainStationIdentifier';

/**
 * Represents a connection point of a train station platform. This is the rail connection point
 * 
 * Platforms and stations have two connection points each. The first station platform is 
 * connected to connection point 0 of the train station.
 */
export const platformConnectionType = '/Script/FactoryGame.FGTrainPlatformConnection';

/**
 * Represents a connection between conveyor belts I think
 */
export const connectionComponentType = '/Script/FactoryGame.FGFactoryConnectionComponent';

/**
 * Represents a conveyor merger
 * 
 * There is a priority merger but haven't used it yet in game.
 */
export const conveyorMergerType = ['/Game/FactoryGame/Buildable/Factory/CA_Merger/Build_ConveyorAttachmentMerger.Build_ConveyorAttachmentMerger_C'];

export const conveyorSplitterType = [''];


export const timetableType = '/Script/FactoryGame.FGRailroadTimeTable';
export const trainType = '/Game/FactoryGame/Buildable/Vehicle/Train/-Shared/BP_Train.BP_Train_C';
export const locomotiveType = '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C';
export const freightWagonType = '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C';




export type SaveItem = SaveEntity | SaveComponent;