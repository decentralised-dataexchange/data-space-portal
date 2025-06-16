type Connection = {
    invitationUrl: string
}

type PersonalDaum = {
    attributeId: string
    attributeName: string
    attributeDescription: string
}

type DataController = {
    did: string
    url: string
    name: string
    legalId: string
    industrySector: string
}

type DataSharingRestrictions = {
    policyUrl: string
    jurisdiction: string
    industrySector: string
    storageLocation: string
    dataRetentionPeriod: number
    geographicRestriction: string
}

type PresentationRecord = {
    role: string;
    state: string;
    trace: boolean;
    verified: string;
    initiator: string;
    thread_id: string;
    created_at: string;
    updated_at: string;
    template_id: string;
    auto_present: boolean;
    presentation: {
        proof: {
            proofs: {
                primary_proof: {
                    eq_proof: {
                        e: string;
                        m: Record<string, string>;
                        v: string;
                        m2: string;
                        a_prime: string;
                        revealed_attrs: Record<string, string>;
                    };
                    ge_proofs: any[];
                };
                non_revoc_proof: any;
            }[];
            aggregated_proof: {
                c_hash: string;
                c_list: number[][];
            };
        };
    };
    identifiers: {
        schema_id: string;
        timestamp: string | null;
        rev_reg_id: string | null;
        cred_def_id: string;
    }[];
    requested_proof: {
        predicates: Record<string, any>;
        revealed_attrs: Record<string, { raw: string; encoded: string; sub_proof_index: number }>;
        unrevealed_attrs: Record<string, any>;
        self_attested_attrs: Record<string, any>;
    };
};

type PresentationRequest = {
    name: string;
    nonce: string;
    version: string;
    requested_attributes: Record<string, {
        name: string;
        restrictions: { schema_id: string; cred_def_id: string }[];
    }>;
    requested_predicates: Record<string, any>;
};

type PresentationRequestDict = {
    "@id": string;
    "@type": string;
    comment: string;
    "~data-agreement-context": any;
    proof: any;
    purpose: string;
    version: string;
    language: string;
    dataPolicy: any;
    templateId: string;
    lawfulBasis: string;
    methodOfUse: string;
    personalData: any[];
};

type Verification = {
    id: string;
    dataSourceId: string;
    presentationExchangeId: string;
    presentationState: string;
    presentationRecord: PresentationRecord;
    connection_id: string;
    presentation_request: PresentationRequest;
    presentation_exchange_id: string;
    presentation_request_dict: PresentationRequestDict;
}

export interface DataDisclosureAgreement {
  purpose: string;
  version: string;
  language: string;
  connection: Connection;
  templateId: string;
  lawfulBasis: string;
  personalData: PersonalDaum[];
  codeOfConduct: string;
  dataController: DataController;
  agreementPeriod: number;
  purposeDescription: string;
  dataSharingRestrictions: DataSharingRestrictions;
  status: string;
  isLatestVersion: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type DataSource = {
    description: string,
    logoUrl: string,
    id: string
    coverImageUrl: string,
    name: string,
    sector: string,
    location: string,
    policyUrl: string,
    openApiUrl: string,
}

export type DataSourceListResponse = {
    dataSources: {
        api: string[],
        dataSource: DataSource,
        dataDisclosureAgreements: DataDisclosureAgreement[]
        verification: Verification
    }[],
    pagination: {
        currentPage: number,
        totalItems: number,
        totalPages: number,
        limit: number,
        hasPrevious: boolean,
        hasNext: boolean
    }
}