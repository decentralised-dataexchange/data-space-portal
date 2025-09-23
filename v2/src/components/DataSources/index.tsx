import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { getTranslations } from "next-intl/server";
import { gridSpacing } from '@/constants/grid';
import { apiService } from '@/lib/apiService/apiService';
import DDAActions from '@/components/DataSources/DDAActions';
import DDAModalController from '@/components/DataSources/DDAModalController';
import VerifiedBadge from '../common/VerifiedBadge';

import ClientPagination from '../Home/ClientPagination';
import ApiDoc from '@/components/ApiDocs';
import './style.scss';
import OrgConfigCard from '@/components/DataSources/OrgConfigCard';

type Props = {
    params: Promise<{ id?: string; slug?: string }>;
    searchParams?: Promise<{ page?: string; viewApiFor?: string }>;
};

export default async function DataSourceListingPage({ params, searchParams }: Props) {
    const { id, slug } = await params;
    const t = await getTranslations();
    const slugify = (s: string) => s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    // Helper to determine if a string is likely a UUID (v4-style). If not, it's a slug.
    const isUuid = (s?: string) => !!s && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

    // Use unauthenticated service endpoints
    let serviceItem: import('@/types/serviceOrganisation').ServiceOrganisationItem | undefined;
    // Try by ID only if the param looks like a UUID; otherwise it's a slug and by-ID call would 400
    if (id && isUuid(id)) {
        try {
            const resp = await apiService.getServiceOrganisationById(id);
            serviceItem = resp.organisations?.[0];
        } catch (e) {
            // Swallow 4xx and fall back to list fetch
            console.error('[DataSourceListingPage] getServiceOrganisationById failed; falling back to list', e);
        }
    }
    if (!serviceItem) {
        // Fallback: fetch all and try to match by slug first, then by raw ID
        const allResp = await apiService.getServiceOrganisations();
        const list = allResp.organisations ?? [];
        const paramSlug = slug ?? id ?? '';
        if (paramSlug) {
            serviceItem = list.find(item => slugify(item.organisation.name) === paramSlug)
                || list.find(item => item.organisation.id === paramSlug);
        }
    }
    const dataSourceItem = serviceItem; // maintain name for downstream usage
    if (!dataSourceItem) {
        return (
            <Box className="dataListContainer" sx={{ width: '100%', p: 3 }}>
                <Card className='cardContainerList' sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ padding: '24px' }}>
                        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold', mb: 1 }}>
                            {t('common.notFound')}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#666' }}>
                            {t('common.tryAgain')}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }
    const trusted = Boolean(dataSourceItem?.organisationIdentity?.presentationRecord?.verified);
    const sp = await searchParams;
    const ddas = dataSourceItem?.dataDisclosureAgreements ?? [];
    const viewApiFor = sp?.viewApiFor;
    const dataSourceSlug = slugify(dataSourceItem?.organisation?.name || '');
    // pagination setup (disabled when viewing API for a specific DDA)
    const itemsPerPage = 4;
    const totalItems = ddas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageParam = sp?.page;
    const currentPage = pageParam && !isNaN(parseInt(pageParam, 10)) ? parseInt(pageParam, 10) : 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const getDdaId = (dda: any): string | undefined => dda?.dataAgreementId || dda?.['@id'] || dda?.templateId;
    const currentDdas = (viewApiFor
        ? ddas.filter(dda => (getDdaId(dda) === viewApiFor || dda.templateId === viewApiFor))
        : ddas.slice(startIndex, endIndex)
    );

    // Helper: convert nested Key/Value list (and arrays) to a JS object suitable for Swagger
    const kvToObject = (input: any): any => {
        const isKv = (o: any) => o && typeof o === 'object' && ('Key' in o) && ('Value' in o) && Object.keys(o).length === 2;
        if (Array.isArray(input)) {
            // If array elements are Key/Value pairs, convert to object
            if (input.length > 0 && input.every((el: any) => isKv(el))) {
                const out: Record<string, any> = {};
                for (const pair of input) {
                    const k = String(pair.Key);
                    out[k] = kvToObject(pair.Value);
                }
                return out;
            }
            // If array elements are arrays, convert each to object recursively
            if (input.length > 0 && input.every((el: any) => Array.isArray(el))) {
                return input.map(kvToObject);
            }
            // Mixed or primitives
            return input.map(kvToObject);
        }
        if (isKv(input)) {
            const obj: Record<string, any> = {};
            obj[String(input.Key)] = kvToObject(input.Value);
            return obj;
        }
        if (input && typeof input === 'object') {
            const out: Record<string, any> = {};
            for (const [k, v] of Object.entries<any>(input)) out[k] = kvToObject(v);
            return out;
        }
        return input;
    };

    // Normalize kvToObject output into a strict OpenAPI JSON shape for Swagger UI
    const normalizeOasObject = (root: any): any => {
        if (!root || typeof root !== 'object') return root;
        const o = { ...root };
        // Ensure version field exists and is a string
        if (!('openapi' in o) && 'OpenApi' in o) {
            o.openapi = String((o as any).OpenApi);
            delete (o as any).OpenApi;
        }
        if (!('openapi' in o) && 'swagger' in o) {
            // leave as-is (Swagger UI supports swagger 2.0 too)
        }
        if (typeof (o as any).openapi !== 'undefined' && typeof (o as any).openapi !== 'string') {
            o.openapi = String((o as any).openapi);
        }
        if (!('openapi' in o) && !('swagger' in o)) {
            // Fallback to a safe default if backend omitted explicit version
            o.openapi = '3.0.3';
        }
        // Some Swagger UI builds only accept 3.0.x; coerce 3.1.x to 3.0.3 for compatibility
        if (typeof (o as any).openapi === 'string' && /^3\.1(\.|$)/.test((o as any).openapi)) {
            o.openapi = '3.0.3';
        }
        // Flatten possible array-wrapped maps from kv encoding
        const flattenMapArray = (arr: any) => {
            if (!Array.isArray(arr)) return arr;
            return arr.map((el: any) => Array.isArray(el) ? Object.assign({}, ...el.map(kvToObject)) : el);
        };
        if (Array.isArray(o.paths)) {
            // convert array of single-entry objects into a single object
            const merged: Record<string, any> = {};
            for (const entry of o.paths) {
                if (entry && typeof entry === 'object') Object.assign(merged, entry);
            }
            o.paths = merged;
        }
        if (Array.isArray(o.components)) {
            const merged: Record<string, any> = {};
            for (const entry of o.components) if (entry && typeof entry === 'object') Object.assign(merged, entry);
            o.components = merged;
        }
        // Within components, schemas/securitySchemes may be arrays of map-entries
        if (o.components && typeof o.components === 'object') {
            const c: any = o.components;
            const mergeMap = (val: any) => {
                if (!Array.isArray(val)) return val;
                const merged: Record<string, any> = {};
                for (const entry of val) if (entry && typeof entry === 'object') Object.assign(merged, entry);
                return merged;
            };
            if (Array.isArray(c.schemas)) c.schemas = mergeMap(c.schemas);
            if (Array.isArray(c.securitySchemes)) c.securitySchemes = mergeMap(c.securitySchemes);
            // For each schema, properties may also be array-encoded; merge if needed
            if (c.schemas && typeof c.schemas === 'object') {
                for (const key of Object.keys(c.schemas)) {
                    const sch = c.schemas[key];
                    if (sch && Array.isArray(sch.properties)) {
                        const mergedProps: Record<string, any> = {};
                        for (const entry of sch.properties) if (entry && typeof entry === 'object') Object.assign(mergedProps, entry);
                        sch.properties = mergedProps;
                    }
                }
            }
        }
        if (Array.isArray(o.security)) o.security = flattenMapArray(o.security);
        if (Array.isArray(o.servers)) o.servers = flattenMapArray(o.servers);
        // Ensure info exists with minimal required fields
        if (!o.info || typeof o.info !== 'object') o.info = {};
        if (!o.info.title) o.info.title = 'API';
        if (!o.info.version) o.info.version = '1.0.0';
        return o;
    };

    const ddaForApi = viewApiFor ? ddas.find(dda => (getDdaId(dda) === viewApiFor || dda.templateId === viewApiFor)) : undefined;
    const openApiSpecObj = (() => {
        const tryFrom = (src: any): any | undefined => {
            if (!src) return undefined;
            const raw = src.openApiSpecification;
            if (Array.isArray(raw) && raw.length > 0) {
                try {
                    const obj = kvToObject(raw);
                    return normalizeOasObject(obj);
                } catch { return undefined; }
            }
            return undefined;
        };
        // 1) top-level
        let obj = tryFrom(ddaForApi as any);
        if (obj) return obj;
        // 2) nested JSON in objectData
        try {
            const rawObjData = (ddaForApi as any)?.objectData;
            if (rawObjData && typeof rawObjData === 'string') {
                const parsed = JSON.parse(rawObjData);
                const fromObjData = tryFrom(parsed);
                if (fromObjData) return fromObjData;
            }
        } catch {}
        // 3) nested under template revision
        try {
            const raw2 = (ddaForApi as any)?.dataDisclosureAgreementTemplateRevision?.objectData;
            if (raw2 && typeof raw2 === 'string') {
                const parsed2 = JSON.parse(raw2);
                const fromObjData2 = tryFrom(parsed2);
                if (fromObjData2) return fromObjData2;
            }
        } catch {}
        return undefined;
    })();

    // Helper to detect presence of embedded spec for a DDA item (for enabling the View API button)
    const hasEmbeddedSpec = (src: any): boolean => {
        if (!src) return false;
        try {
            if ('openApiSpecification' in src) return true;
            const od = src?.objectData;
            if (od && typeof od === 'string') {
                try { const parsed = JSON.parse(od); if (parsed && ('openApiSpecification' in parsed)) return true; } catch {}
            }
            const rev = src?.dataDisclosureAgreementTemplateRevision?.objectData;
            if (rev && typeof rev === 'string') {
                try { const parsed2 = JSON.parse(rev); if (parsed2 && ('openApiSpecification' in parsed2)) return true; } catch {}
            }
        } catch {}
        return false;
    };

    return (
        <Box className="dataListContainer" sx={{ width: '100%' }}>
            <Grid container spacing={gridSpacing} sx={{ width: '100%', margin: 0 }}>
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={gridSpacing} justifyContent="center">
                        {/* Left info box */}
                        <Grid size={{ lg: 4, md: 12, sm: 12, xs: 12 }} className='leftContainer'>
                            <Card className='leftSection'>
                                <CardMedia component="div" className='card-header' image={dataSourceItem?.organisation?.coverImageUrl}>
                                    <CardMedia
                                        component="img"
                                        image={dataSourceItem?.organisation?.logoUrl}
                                        alt="symbiome"
                                        className='logo'
                                    />
                                </CardMedia>
                                {/* <Box className='policyUrl'>
                                    {dataSourceItem?.policyUrl}
                                </Box> */}
                                <CardContent sx={{ minHeight: "229px" }}>
                                    <Box sx={{
                                        // Always use compact (mobile) styling regardless of screen size
                                        marginLeft: 0,
                                        paddingTop: "48px",
                                        transform: "none"
                                    }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                                            {dataSourceItem?.organisation?.name}
                                        </Typography>
                                        <Typography variant="body2" className="datasource-location" sx={{ fontSize: '14px', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: trusted ? '#2e7d32' : '#d32f2f' }}>
                                            {trusted ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
                                            <VerifiedBadge trusted={trusted} />
                                        </Typography>
                                        {/* Access Point Endpoint is intentionally hidden on this page's left panel */}
                                        <Typography className='datasource-location'>
                                            {dataSourceItem?.organisation?.location}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" className='datasource-overview-label'>
                                        {t("common.overView")}
                                    </Typography>
                                    <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                                        {/* {moreOrLessTxt === 'Read Less....' ? dataSourceItem?.organisation?.description : dataSourceItem?.organisation?.description.slice(0, 275)} */}
                                        {dataSourceItem?.organisation?.description}
                                        {/* read more button to be added here */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Right wide cards list */}
                        <Grid size={{ lg: 8, md: 12, sm: 12, xs: 12 }} className='rightContainer'>
                            <Grid container spacing={2}>
                                {/* Wallet/Org configuration card */}
                                <Grid size={{ xs: 12 }}>
                                    <OrgConfigCard serviceItem={dataSourceItem} />
                                </Grid>
                                {currentDdas.map((dataDisclosureAgreement, index) => {
                                    return (
                                        <Grid
                                            key={index}
                                            size={{ xs: 12 }}
                                            sx={{ width: '100%' }}
                                        >
                                            <Card className='cardContainerList' sx={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <CardContent sx={{ padding: '24px' }}>
                                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px", fontWeight: 'bold' }}>
                                                        {dataDisclosureAgreement.purpose}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "14px", paddingBottom: "20px", color: '#666666' }}>
                                                        {dataDisclosureAgreement.purposeDescription}
                                                    </Typography>
                                                    {/* Version now displayed inline with action buttons inside DDAActions */}
                                                    <DDAActions
                                                        dataDisclosureAgreement={dataDisclosureAgreement}
                                                        openApiUrl={dataSourceItem?.organisation.openApiUrl || ''}
                                                        dataSourceSlug={dataSourceSlug}
                                                        apiViewMode={!!viewApiFor}
                                                        hasEmbeddedSpec={hasEmbeddedSpec(dataDisclosureAgreement)}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            {/* Render API docs below the selected card when viewApiFor is present */}
                            {viewApiFor && (openApiSpecObj || dataSourceItem?.organisation?.openApiUrl) && (
                                <Box sx={{ mt: 2 }}>
                                    <Card className='cardContainerList' sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        <CardContent sx={{ padding: '24px' }}>
                                            <ApiDoc openApiUrl={dataSourceItem.organisation.openApiUrl} spec={openApiSpecObj} />
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}
                        </Grid>
                        {/* Pagination */}
                        {!viewApiFor && totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2, width: '100%' }}>
                                <ClientPagination currentPage={currentPage} totalPages={totalPages} />
                            </Box>
                        )}
                    </Grid>
                </Grid>
                <DDAModalController
                    dataSourceName={dataSourceItem?.organisation?.name || ''}
                    dataSourceLocation={dataSourceItem?.organisation?.location || ''}
                    dataSourceDescription={dataSourceItem?.organisation?.description || ''}
                    coverImage={dataSourceItem?.organisation?.coverImageUrl || ''}
                    logoImage={dataSourceItem?.organisation?.logoUrl || ''}
                    dataDisclosureAgreements={dataSourceItem?.dataDisclosureAgreements ?? []}
                    trusted={trusted}
                />
            </Grid>
        </Box>
    )
}