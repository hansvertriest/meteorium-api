import { Pool } from 'pg';

export type GMNRecord = {
    beginningDate: Date;
    beginningTime: string;
    iauNo: number;
    iauCode: string;
    solLonInDeg: number;
    apLstInDeg: number;
    raGeoInDeg: number;
    decGeoInDeg: number;
    lamGeoInDeg: number;
    betGeoInDeg: number;
    vGeoInKmS: number;
    lamHelInDeg: number;
    betHelInDeg: number;
    vHelInDeg: number;
    axisInAu: number;
    eccentricity: number;
    inclinationInDeg: number;
    periInDeg: number;
    nodeInDeg: number;
    lonPeriInDeg: number;
    latPeriInDeg: number;
    distPeriInAu: number;
    anomalyAtBeginningInDeg: number;
    meanAnomalyInDeg: number;
    distAphIndegInAu: number;
    meanMotionInOrbitInDegPerDay: number;
    orbitalPeriod: number;
    tisserandToJupiter: number;
    raAppInDeg: number;
    decAppInDeg: number;
    azimEOfNInDeg: number;
    elevIndeg: number;
    vInitInKms: number;
    vAvgInKms: number;
    latBeginInDeg: number;
    lonBeginInDeg: number;
    heightBeginInKm: number;
    latEndInDeg: number;
    lonEndInDeg: number;
    heightEndInKm: number;
    durationInS: number;
    peakHeightIn100Km: number;
    fParam: number;
    massKg: number;
    maxConvergenceInDeg: number;
    medianFitErrors: number;
    beginInFov: number;
    endFov: number;
    numberOfStations: number;
    participatingStations: string[];
}

// export interface ISource<RawRecord, NormalizedRecord> {
//     // createDbTable: {(): Promise<void>}
//     fetchLatest: {(): Promise<RawRecord[]>};
//     // parseRecords: {(records: RawRecord[]): NormalizedRecord[]};
// }