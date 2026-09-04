/* Style reminder: Forest Canopy / Field Notebook — data objects stay explicit, inspectable, and free of claimant PII. */

export type FraClaimProperties = {
  claimId: string;
  state: "Madhya Pradesh" | "Chhattisgarh" | "Odisha";
  district: string;
  claimType: "IFR" | "CR" | "CFR";
  status: "Pending" | "Approved" | "Returned";
  pendingDays: number;
  landRecordConflict: boolean;
  claimsReceived: number;
  titlesDistributed: number;
  areaHectares: number;
  registryAreaHectares: number;
};

export type FraClaimFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: FraClaimProperties;
};

export type FraClaimCollection = { type: "FeatureCollection"; features: FraClaimFeature[] };

const makeClaim = (
  index: number,
  state: FraClaimProperties["state"],
  district: string,
  lat: number,
  lng: number,
  claimType: FraClaimProperties["claimType"],
  pendingDays: number,
  landRecordConflict: boolean,
  status: FraClaimProperties["status"],
  claimsReceived: number,
  titlesDistributed: number,
  areaHectares: number,
  registryAreaHectares: number,
): FraClaimFeature => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties: { claimId: `FRA-2025-${String(index).padStart(3, "0")}`, state, district, claimType, status, pendingDays, landRecordConflict, claimsReceived, titlesDistributed, areaHectares, registryAreaHectares },
});

export const fraClaimsGeoJSON: FraClaimCollection = {
  type: "FeatureCollection",
  features: [
    makeClaim(1, "Madhya Pradesh", "Dindori", 22.94, 81.08, "IFR", 124, true, "Pending", 312, 191, 4.8, 5.2),
    makeClaim(2, "Madhya Pradesh", "Mandla", 22.60, 80.38, "CFR", 78, false, "Approved", 428, 337, 12.4, 12.5),
    makeClaim(3, "Madhya Pradesh", "Anuppur", 23.10, 81.70, "IFR", 205, true, "Pending", 267, 144, 6.9, 7.8),
    makeClaim(4, "Madhya Pradesh", "Shahdol", 23.30, 81.36, "CR", 96, false, "Pending", 381, 248, 9.4, 9.6),
    makeClaim(5, "Madhya Pradesh", "Umaria", 23.52, 80.84, "IFR", 42, true, "Returned", 214, 129, 3.1, 4.0),
    makeClaim(6, "Madhya Pradesh", "Balaghat", 21.81, 80.18, "CFR", 118, true, "Pending", 496, 302, 18.2, 20.4),
    makeClaim(7, "Madhya Pradesh", "Seoni", 22.09, 79.55, "IFR", 67, false, "Pending", 352, 241, 5.5, 5.5),
    makeClaim(8, "Madhya Pradesh", "Chhindwara", 22.06, 78.94, "IFR", 153, false, "Pending", 289, 177, 4.2, 4.6),
    makeClaim(9, "Madhya Pradesh", "Betul", 21.90, 77.90, "CR", 34, true, "Returned", 302, 218, 8.8, 10.1),
    makeClaim(10, "Madhya Pradesh", "Khandwa", 21.82, 76.35, "IFR", 101, true, "Pending", 328, 206, 7.6, 8.2),
    makeClaim(11, "Madhya Pradesh", "Khargone", 21.82, 75.61, "CFR", 83, false, "Approved", 412, 320, 15.8, 15.7),
    makeClaim(12, "Madhya Pradesh", "Barwani", 22.03, 74.90, "IFR", 191, true, "Pending", 245, 118, 4.4, 5.7),
    makeClaim(13, "Madhya Pradesh", "Alirajpur", 22.31, 74.36, "CFR", 63, true, "Pending", 389, 254, 16.3, 18.6),
    makeClaim(14, "Madhya Pradesh", "Jhabua", 22.77, 74.59, "IFR", 110, false, "Pending", 277, 160, 5.0, 5.1),
    makeClaim(15, "Madhya Pradesh", "Ratlam", 23.33, 75.04, "CR", 27, false, "Approved", 198, 169, 6.2, 6.2),
    makeClaim(16, "Madhya Pradesh", "Shivpuri", 25.43, 77.74, "IFR", 134, true, "Pending", 254, 132, 5.7, 6.9),
    makeClaim(17, "Madhya Pradesh", "Guna", 24.65, 77.31, "CFR", 59, false, "Approved", 337, 276, 11.2, 11.1),
    makeClaim(18, "Chhattisgarh", "Bastar", 19.10, 81.95, "IFR", 212, true, "Pending", 514, 266, 8.9, 10.8),
    makeClaim(19, "Chhattisgarh", "Dantewada", 18.90, 81.35, "CFR", 143, true, "Pending", 382, 192, 14.8, 16.1),
    makeClaim(20, "Chhattisgarh", "Kondagaon", 19.59, 81.66, "IFR", 88, false, "Pending", 298, 203, 5.6, 5.6),
    makeClaim(21, "Chhattisgarh", "Narayanpur", 19.72, 81.25, "CR", 104, true, "Pending", 225, 114, 7.3, 8.0),
    makeClaim(22, "Chhattisgarh", "Kanker", 20.27, 81.49, "IFR", 71, true, "Returned", 366, 232, 4.9, 6.4),
    makeClaim(23, "Chhattisgarh", "Bijapur", 18.85, 80.80, "CFR", 176, true, "Pending", 418, 183, 17.2, 19.6),
    makeClaim(24, "Chhattisgarh", "Sukma", 18.39, 81.66, "IFR", 129, false, "Pending", 271, 135, 5.8, 6.2),
    makeClaim(25, "Chhattisgarh", "Surguja", 23.12, 83.20, "IFR", 52, true, "Returned", 308, 210, 4.3, 5.0),
    makeClaim(26, "Chhattisgarh", "Koriya", 23.42, 82.43, "CFR", 94, false, "Pending", 341, 213, 13.6, 13.7),
    makeClaim(27, "Chhattisgarh", "Jashpur", 22.89, 84.14, "IFR", 119, true, "Pending", 398, 218, 6.7, 7.9),
    makeClaim(28, "Chhattisgarh", "Raigarh", 21.90, 83.40, "CR", 39, false, "Approved", 267, 219, 8.1, 8.1),
    makeClaim(29, "Chhattisgarh", "Korba", 22.35, 82.68, "IFR", 156, true, "Pending", 320, 149, 4.8, 6.3),
    makeClaim(30, "Chhattisgarh", "Bilaspur", 22.08, 82.15, "CFR", 61, false, "Approved", 452, 356, 17.1, 17.0),
    makeClaim(31, "Chhattisgarh", "Dhamtari", 20.71, 81.55, "IFR", 97, true, "Pending", 278, 163, 5.4, 6.2),
    makeClaim(32, "Chhattisgarh", "Gariaband", 20.63, 82.06, "CR", 111, false, "Pending", 244, 138, 7.5, 7.7),
    makeClaim(33, "Chhattisgarh", "Mahasamund", 21.11, 82.10, "IFR", 46, true, "Returned", 231, 164, 4.1, 4.8),
    makeClaim(34, "Chhattisgarh", "Balod", 20.73, 81.20, "CFR", 73, false, "Approved", 315, 254, 12.7, 12.7),
    makeClaim(35, "Odisha", "Koraput", 18.81, 82.71, "IFR", 136, true, "Pending", 482, 281, 6.2, 7.0),
    makeClaim(36, "Odisha", "Malkangiri", 18.35, 81.89, "CFR", 97, false, "Pending", 396, 235, 15.4, 15.8),
    makeClaim(37, "Odisha", "Rayagada", 19.17, 83.42, "IFR", 68, true, "Returned", 334, 225, 5.8, 6.7),
    makeClaim(38, "Odisha", "Kandhamal", 20.15, 84.02, "CR", 122, true, "Pending", 361, 198, 9.2, 10.0),
    makeClaim(39, "Odisha", "Gajapati", 19.20, 84.18, "IFR", 184, true, "Pending", 278, 124, 4.5, 5.6),
    makeClaim(40, "Odisha", "Nabarangpur", 19.24, 82.55, "CFR", 81, false, "Approved", 419, 336, 18.8, 18.7),
    makeClaim(41, "Odisha", "Kalahandi", 19.91, 83.17, "IFR", 102, false, "Pending", 327, 193, 6.4, 6.5),
    makeClaim(42, "Odisha", "Nuapada", 20.84, 82.54, "CR", 31, true, "Returned", 218, 162, 7.0, 8.1),
    makeClaim(43, "Odisha", "Bolangir", 20.71, 83.49, "IFR", 149, true, "Pending", 299, 155, 5.1, 6.4),
    makeClaim(44, "Odisha", "Boudh", 20.83, 84.33, "CFR", 74, false, "Approved", 275, 221, 11.5, 11.4),
    makeClaim(45, "Odisha", "Deogarh", 21.54, 84.73, "IFR", 116, true, "Pending", 263, 141, 4.7, 5.8),
    makeClaim(46, "Odisha", "Sundargarh", 22.12, 84.03, "CR", 58, false, "Approved", 387, 303, 8.7, 8.7),
    makeClaim(47, "Odisha", "Keonjhar", 21.63, 85.58, "CFR", 131, true, "Pending", 444, 247, 16.5, 18.2),
    makeClaim(48, "Odisha", "Mayurbhanj", 21.93, 86.72, "IFR", 93, false, "Pending", 514, 344, 5.9, 6.0),
    makeClaim(49, "Odisha", "Dhenkanal", 20.66, 85.60, "CR", 44, true, "Returned", 251, 184, 7.6, 8.3),
    makeClaim(50, "Odisha", "Angul", 20.84, 85.10, "IFR", 167, true, "Pending", 306, 145, 4.2, 5.1),
  ],
};

export type FraAnomaly = FraClaimProperties & { id: string; risk: "High" | "Medium"; reason: string; flagType: "Pending > 90 days" | "Land-record conflict" | "Both rules" };

export function scanFraAnomalies(collection: FraClaimCollection): FraAnomaly[] {
  return collection.features.flatMap(({ properties }) => {
    const pendingFlag = properties.pendingDays > 90;
    const conflictFlag = properties.landRecordConflict;
    if (!pendingFlag && !conflictFlag) return [];
    const flagType = pendingFlag && conflictFlag ? "Both rules" : pendingFlag ? "Pending > 90 days" : "Land-record conflict";
    const reason = pendingFlag && conflictFlag
      ? `${properties.pendingDays} days pending; registry area conflicts with submitted record.`
      : pendingFlag
        ? `${properties.pendingDays} days pending, above the 90-day review threshold.`
        : "Land record conflict detected between registry and claim record.";
    return [{ ...properties, id: properties.claimId, risk: pendingFlag && conflictFlag || properties.pendingDays > 180 ? "High" : "Medium", reason, flagType }];
  });
}

export const fraAnomalies = scanFraAnomalies(fraClaimsGeoJSON);
