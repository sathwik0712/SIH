export interface BhunakshaRoRResponse {
  stateCode: string;
  district: string;
  tehsil: string;
  villageCode: string;
  khasraNo: string;
  recordedAreaHectares: number;
  landClassification: 'DRY_AGRICULTURAL' | 'WET_IRRIGATED' | 'GOVT_GIRJAN' | 'INDUSTRIAL' | 'COMMERCIAL';
  primaryOwnerName: string;
  jointHoldersCount: number;
  encumbranceStatus: 'CLEAR' | 'MORTGAGED_COOP_BANK' | 'LITIGATION_PENDING';
  geometryGeoJson: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  lastMutationDate: string;
  sourceServer: string;
}

export interface PFMSDisbursalPayload {
  schemeCode: string; // e.g. 'NHAI-LA-001'
  awardReferenceNo: string;
  beneficiaryName: string;
  beneficiaryAadhaarHash: string;
  accountNumberMasked: string;
  ifscCode: string;
  amountInr: number;
  debitAccountAgency: string;
}

export interface PFMSDisbursalResponse {
  pfmsTransactionId: string;
  utrNumber: string;
  status: 'CREDITED_SUCCESS' | 'PENDING_TREASURY' | 'REJECTED_IFSC_MISMATCH';
  amountDisbursed: number;
  settledTimestamp: string;
  gatewayRemarks: string;
  statusCode: string;
}

export interface EGazettePublicationRequest {
  issuingMinistry: string;
  actSection: 'SEC_4_PRELIMINARY' | 'SEC_11_NOTIFICATION' | 'SEC_19_DECLARATION' | 'SEC_23_AWARD';
  projectCode: string;
  stateCode: string;
  draftGazettePdfUrl: string;
  signatoryOfficer: string;
}

export interface EGazetteReceipt {
  issueNumber: string;
  soNumber: string; // e.g., 'S.O. 1892(E)'
  publishedTimestamp: string;
  gazettePdfDownloadUri: string;
  digitalSignatureCertThumbprint: string;
  pressStation: string;
}

export interface StateLandRegistryResponse {
  statePortal: 'DHARANI_TS' | 'BHOOMI_KA' | 'MAHABHULEKH_MH' | 'BHULEKH_UP' | 'ANYROR_GJ';
  surveyNumber: string;
  subDivisionNo: string;
  khataNumber: string;
  pattadarName: string;
  aadhaarSeeded: boolean;
  marketRatePerAcreInr: number;
  isGovernmentLand: boolean;
  syncTimestamp: string;
}

export interface GatewayHealthReport {
  gatewayId: string;
  name: string;
  category: 'GIS' | 'PAYMENT' | 'GAZETTE' | 'LAND_RECORDS';
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  uptimePercentage: number;
  lastPingTimestamp: string;
  connectedNodes: number;
}

class ExternalIntegrationService {
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch cadastral plot polygon & RoR rights from NIC Bhunaksha API
   */
  async fetchFromBhunaksha(stateCode: string, district: string, khasraNo: string): Promise<BhunakshaRoRResponse> {
    await this.sleep(450); // Simulated network latency
    return {
      stateCode: stateCode.toUpperCase(),
      district,
      tehsil: 'Haveli / Khed Sub-Division',
      villageCode: 'VIL-27-048',
      khasraNo,
      recordedAreaHectares: 2.45,
      landClassification: 'DRY_AGRICULTURAL',
      primaryOwnerName: 'Shri Tukaram Sambhaji Gaikwad',
      jointHoldersCount: 2,
      encumbranceStatus: 'CLEAR',
      geometryGeoJson: {
        type: 'Polygon',
        coordinates: [
          [
            [73.8567, 18.5204],
            [73.8582, 18.5209],
            [73.8591, 18.5192],
            [73.8573, 18.5188],
            [73.8567, 18.5204]
          ]
        ]
      },
      lastMutationDate: '2024-08-12',
      sourceServer: 'nic-bhunaksha-gateway-node-03.nic.in'
    };
  }

  /**
   * Disburse compensation to beneficiary bank account via PFMS DBT Gateway
   */
  async syncWithPFMS(payload: PFMSDisbursalPayload): Promise<PFMSDisbursalResponse> {
    await this.sleep(600); // Simulated PFMS bank clearing delay
    const utr = `UTR${Date.now()}IN09`;
    return {
      pfmsTransactionId: `PFMS-DBT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      utrNumber: utr,
      status: 'CREDITED_SUCCESS',
      amountDisbursed: payload.amountInr,
      settledTimestamp: new Date().toISOString(),
      gatewayRemarks: 'Funds routed via RBI e-Kuber National Settlement Network directly to beneficiary account.',
      statusCode: 'PFMS_00_SUCCESS'
    };
  }

  /**
   * Publish statutory land notification to e-Gazette Central Press digital repository
   */
  async publishToEGazette(request: EGazettePublicationRequest): Promise<EGazetteReceipt> {
    await this.sleep(550);
    const issueYear = new Date().getFullYear();
    const issueNum = Math.floor(1200 + Math.random() * 400);
    return {
      issueNumber: `EXTRAORDINARY-${issueYear}-${issueNum}`,
      soNumber: `S.O. ${Math.floor(1000 + Math.random() * 9000)}(E)`,
      publishedTimestamp: new Date().toISOString(),
      gazettePdfDownloadUri: `https://egazette.gov.in/WriteReadData/${issueYear}/Notification_${request.projectCode}.pdf`,
      digitalSignatureCertThumbprint: 'SHA256:4C82FA931498BBA420059E4DF09EAA830219EF874',
      pressStation: 'Government of India Press, Mayapuri, New Delhi'
    };
  }

  /**
   * Query State Revenue land registry (Dharani/Bhoomi/MahaBhulekh/AnyRoR)
   */
  async verifyStateRoRRecord(stateCode: string, surveyNo: string): Promise<StateLandRegistryResponse> {
    await this.sleep(400);
    return {
      statePortal: stateCode === 'TS' ? 'DHARANI_TS' : stateCode === 'KA' ? 'BHOOMI_KA' : 'MAHABHULEKH_MH',
      surveyNumber: surveyNo,
      subDivisionNo: '1/A',
      khataNumber: 'KT-8942',
      pattadarName: 'Shri Tukaram Sambhaji Gaikwad',
      aadhaarSeeded: true,
      marketRatePerAcreInr: 4500000,
      isGovernmentLand: false,
      syncTimestamp: new Date().toISOString()
    };
  }

  /**
   * Get real-time health and latency telemetry of national government integration gateways
   */
  async getGatewayHealthStatus(): Promise<GatewayHealthReport[]> {
    await this.sleep(300);
    return [
      {
        gatewayId: 'NIC_BHUNAKSHA_PROD',
        name: 'NIC Bhunaksha Cadastral Map Engine',
        category: 'GIS',
        status: 'ONLINE',
        latencyMs: 42,
        uptimePercentage: 99.85,
        lastPingTimestamp: 'Just now',
        connectedNodes: 36
      },
      {
        gatewayId: 'PFMS_DBT_NATIONAL',
        name: 'PFMS Central DBT Settlement Switch',
        category: 'PAYMENT',
        status: 'ONLINE',
        latencyMs: 110,
        uptimePercentage: 99.92,
        lastPingTimestamp: 'Just now',
        connectedNodes: 148
      },
      {
        gatewayId: 'EGAZETTE_DIGITAL_PRESS',
        name: 'e-Gazette Digital Extraordinary Press Service',
        category: 'GAZETTE',
        status: 'ONLINE',
        latencyMs: 65,
        uptimePercentage: 99.78,
        lastPingTimestamp: '1 min ago',
        connectedNodes: 8
      },
      {
        gatewayId: 'STATE_ROR_LAND_FEDERATION',
        name: 'National Land Record Modernization Federation (DILRMP)',
        category: 'LAND_RECORDS',
        status: 'ONLINE',
        latencyMs: 88,
        uptimePercentage: 99.64,
        lastPingTimestamp: 'Just now',
        connectedNodes: 28
      }
    ];
  }
}

export const externalIntegrationService = new ExternalIntegrationService();
