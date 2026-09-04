import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, UserRole, Project, LandParcel, StatutoryNotification, 
  Objection, AwardRecord, CompensationDisbursement, AffectedFamily, 
  RRBenefit, PossessionRecord, DMSDocument, AlertNotification, 
  AuditLogEntry, ExternalServiceIntegration, AcquisitionStage 
} from '../types';
import { 
  DEMO_USERS, DEMO_PROJECTS, DEMO_PARCELS, DEMO_NOTIFICATIONS, 
  DEMO_OBJECTIONS, DEMO_AWARDS, DEMO_COMPENSATION, DEMO_FAMILIES, 
  DEMO_RR_BENEFITS, DEMO_POSSESSION, DEMO_DOCUMENTS, DEMO_ALERTS, 
  DEMO_AUDIT_LOGS, DEMO_INTEGRATIONS 
} from '../data/seedData';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  currentUser: User;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
  switchRole: (role: UserRole) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'larger';
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
  
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProjectId: (id: string | null) => void;
  createProject: (newProject: Omit<Project, 'id' | 'code' | 'landAcquiredHa' | 'totalParcelsCount' | 'compensationDisbursedCr' | 'currentStage' | 'riskScore' | 'delayDays'>) => void;
  updateProject: (project: Project) => void;
  
  parcels: LandParcel[];
  addParcel: (parcel: Omit<LandParcel, 'id'>) => void;
  updateParcel: (parcel: LandParcel) => void;
  verifyParcelInField: (parcelId: string, officerName: string, remarks: string, photoUrl?: string) => void;
  
  notifications: StatutoryNotification[];
  addNotification: (notif: Omit<StatutoryNotification, 'id'>) => void;
  
  objections: Objection[];
  fileObjection: (obj: Omit<Objection, 'id'>) => void;
  disposeObjection: (id: string, decision: Objection['decision'], remarks?: string) => void;
  
  awards: AwardRecord[];
  draftAward: (award: Omit<AwardRecord, 'id'>) => void;
  approveAward: (id: string) => void;
  
  compensationRecords: CompensationDisbursement[];
  disburseCompensation: (id: string, utr: string) => void;
  referToCourtEscrow: (id: string) => void;
  
  families: AffectedFamily[];
  rrBenefits: RRBenefit[];
  updateRRBenefit: (benefit: RRBenefit) => void;
  
  possessionRecords: PossessionRecord[];
  recordPhysicalPossession: (possession: Omit<PossessionRecord, 'id'>) => void;
  
  documents: DMSDocument[];
  uploadDocument: (doc: Omit<DMSDocument, 'id' | 'uploadDate' | 'uploadedBy' | 'uploadedRole'>) => void;
  
  alerts: AlertNotification[];
  markAlertRead: (id: string) => void;
  
  auditLogs: AuditLogEntry[];
  integrations: ExternalServiceIntegration[];
  syncIntegration: (index: number) => void;
  
  advanceProjectStage: (projectId: string, nextStage: AcquisitionStage) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'BHOOMISETU_ENTERPRISE_STATE_V1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // Central Ministry
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const t = (key: string): string => {
    const item = TRANSLATIONS[key];
    if (item && item[language]) return item[language];
    return key;
  };

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_PROJECTS`);
    return saved ? JSON.parse(saved) : DEMO_PROJECTS;
  });

  const [selectedProjectId, setSelectedProjectIdState] = useState<string | null>(projects[0]?.id || null);

  const [parcels, setParcels] = useState<LandParcel[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_PARCELS`);
    return saved ? JSON.parse(saved) : DEMO_PARCELS;
  });

  const [notifications, setNotifications] = useState<StatutoryNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_NOTIFS`);
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  const [objections, setObjections] = useState<Objection[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_OBJECTIONS`);
    return saved ? JSON.parse(saved) : DEMO_OBJECTIONS;
  });

  const [awards, setAwards] = useState<AwardRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_AWARDS`);
    return saved ? JSON.parse(saved) : DEMO_AWARDS;
  });

  const [compensationRecords, setCompensationRecords] = useState<CompensationDisbursement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_COMPENSATION`);
    return saved ? JSON.parse(saved) : DEMO_COMPENSATION;
  });

  const [families, setFamilies] = useState<AffectedFamily[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_FAMILIES`);
    return saved ? JSON.parse(saved) : DEMO_FAMILIES;
  });

  const [rrBenefits, setRRBenefits] = useState<RRBenefit[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_RR`);
    return saved ? JSON.parse(saved) : DEMO_RR_BENEFITS;
  });

  const [possessionRecords, setPossessionRecords] = useState<PossessionRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_POSSESSION`);
    return saved ? JSON.parse(saved) : DEMO_POSSESSION;
  });

  const [documents, setDocuments] = useState<DMSDocument[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_DOCUMENTS`);
    return saved ? JSON.parse(saved) : DEMO_DOCUMENTS;
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ALERTS`);
    return saved ? JSON.parse(saved) : DEMO_ALERTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_AUDIT`);
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [integrations, setIntegrations] = useState<ExternalServiceIntegration[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_INTEGRATIONS`);
    return saved ? JSON.parse(saved) : DEMO_INTEGRATIONS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_PROJECTS`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_PARCELS`, JSON.stringify(parcels));
  }, [parcels]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_COMPENSATION`, JSON.stringify(compensationRecords));
  }, [compensationRecords]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_AUDIT`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ALERTS`, JSON.stringify(alerts));
  }, [alerts]);

  const logAction = (action: string, module: string, entityId: string, prevStatus?: string, newStatus?: string, details?: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: formatted,
      user: currentUser.name,
      role: currentUser.role,
      action,
      module,
      entityId,
      previousStatus: prevStatus,
      newStatus,
      ipAddress: '10.24.110.19 (NIC-Secured)',
      details: details || `Action executed by ${currentUser.name} (${currentUser.designation})`,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const matched = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(matched);
    logAction(`User Persona Switched to ${matched.role}`, 'Authentication', matched.id, undefined, matched.role, `Switched persona to ${matched.name} (${matched.designation})`);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  const setSelectedProjectId = (id: string | null) => {
    setSelectedProjectIdState(id);
  };

  const createProject = (newProj: Omit<Project, 'id' | 'code' | 'landAcquiredHa' | 'totalParcelsCount' | 'compensationDisbursedCr' | 'currentStage' | 'riskScore' | 'delayDays'>) => {
    const id = `PRJ-${projects.length + 101}`;
    const code = `GOI/${newProj.state.slice(0, 2).toUpperCase()}/${newProj.sector.slice(0, 3).toUpperCase()}/${Date.now().toString().slice(-4)}`;
    const fullProject: Project = {
      ...newProj,
      id,
      code,
      landAcquiredHa: 0,
      totalParcelsCount: 0,
      compensationDisbursedCr: 0,
      currentStage: 1,
      riskScore: 10,
      delayDays: 0,
    };
    setProjects(prev => [fullProject, ...prev]);
    logAction('Project Proposal Created', 'Projects', id, 'None', 'Proposal Drafted', `New project proposal registered: ${newProj.name}`);
  };

  const updateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAction('Project Parameters Updated', 'Projects', updated.id, undefined, updated.status, `Updated project metadata for ${updated.name}`);
  };

  const addParcel = (parcel: Omit<LandParcel, 'id'>) => {
    const id = `PCL-${parcel.projectId.replace('PRJ-', '')}-${String(parcels.length + 1).padStart(3, '0')}`;
    const newParcel: LandParcel = { ...parcel, id };
    setParcels(prev => [newParcel, ...prev]);
    
    // Update project parcel count
    setProjects(prev => prev.map(p => {
      if (p.id === parcel.projectId) {
        return {
          ...p,
          totalParcelsCount: p.totalParcelsCount + 1,
        };
      }
      return p;
    }));

    logAction('Land Parcel Registered', 'Land Parcels', id, 'None', newParcel.verificationStatus, `Survey No. ${newParcel.surveyNumber} added to Project ${parcel.projectId}`);
  };

  const updateParcel = (parcel: LandParcel) => {
    const old = parcels.find(p => p.id === parcel.id);
    setParcels(prev => prev.map(p => p.id === parcel.id ? parcel : p));
    logAction('Land Parcel Details Modified', 'Land Parcels', parcel.id, old?.verificationStatus, parcel.verificationStatus, `Modified parcel ${parcel.surveyNumber}`);
  };

  const verifyParcelInField = (parcelId: string, officerName: string, remarks: string, photoUrl?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setParcels(prev => prev.map(p => {
      if (p.id === parcelId) {
        return {
          ...p,
          verificationStatus: 'Verified',
          acquisitionStatus: p.acquisitionStatus === 'Identified' ? 'Under Verification' : p.acquisitionStatus,
          verifiedByOfficer: officerName,
          verificationDate: today,
          remarks: remarks || p.remarks,
          photographUrl: photoUrl || p.photographUrl,
        };
      }
      return p;
    }));
    logAction('Field Verification Completed', 'Field Revenue Officer', parcelId, 'Pending', 'Verified', `Field Officer ${officerName} verified parcel boundary with GPS: ${remarks}`);
  };

  const addNotification = (notif: Omit<StatutoryNotification, 'id'>) => {
    const id = `NOTIF-${String(notifications.length + 1).padStart(2, '0')}`;
    const full = { ...notif, id };
    setNotifications(prev => [full, ...prev]);
    logAction('Statutory Notification Published', 'Notifications', id, 'Drafted', full.status, `Gazette notification ${full.gazetteNumber} issued under ${full.sectionType}`);
  };

  const fileObjection = (obj: Omit<Objection, 'id'>) => {
    const id = `OBJ-${String(objections.length + 1).padStart(3, '0')}`;
    const full = { ...obj, id };
    setObjections(prev => [full, ...prev]);
    logAction('Objection Filed under Sec 15', 'Claims & Objections', id, 'None', 'Hearing Scheduled', `Objection filed by ${full.applicantName} for Survey ${full.surveyNumber}`);
  };

  const disposeObjection = (id: string, decision: Objection['decision'], remarks?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setObjections(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          decision,
          decisionDate: today,
          status: 'Disposed',
        };
      }
      return o;
    }));
    logAction('Objection Hearing Disposed', 'Claims & Objections', id, 'Hearing Scheduled', 'Disposed', `Collector passed order: ${decision}. ${remarks || ''}`);
  };

  const draftAward = (award: Omit<AwardRecord, 'id'>) => {
    const id = `AWD-${award.projectId.replace('PRJ-', '')}-${String(awards.length + 1).padStart(2, '0')}`;
    const full = { ...award, id };
    setAwards(prev => [full, ...prev]);
    logAction('Statutory Award Drafted', 'Awards', id, 'None', full.collectorApprovalStatus, `Award ${full.awardNumber} drafted for ₹${full.totalAwardAmount} Lakhs`);
  };

  const approveAward = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAwards(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          collectorApprovalStatus: 'Approved by Collector',
          approvalDate: today,
        };
      }
      return a;
    }));
    logAction('Statutory Award Approved by Collector', 'Awards', id, 'Recommended by CALA', 'Approved by Collector', `Award finalized with 100% Solatium`);
  };

  const disburseCompensation = (id: string, utr: string) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedRecord: CompensationDisbursement | undefined;
    setCompensationRecords(prev => prev.map(c => {
      if (c.id === id) {
        updatedRecord = {
          ...c,
          status: 'Paid',
          amountDisbursed: c.amountApproved,
          pendingAmount: 0,
          paymentDate: today,
          utrTransactionNumber: utr || `PFMS${Date.now()}`,
        };
        return updatedRecord;
      }
      return c;
    }));

    if (updatedRecord) {
      // Sync parcel compensation status
      setParcels(prev => prev.map(p => {
        if (p.id === updatedRecord?.parcelId) {
          return {
            ...p,
            compensationStatus: 'Disbursed',
            acquisitionStatus: 'Compensation Disbursed',
          };
        }
        return p;
      }));

      // Update project financial disbursement
      setProjects(prev => prev.map(p => {
        if (p.id === updatedRecord?.projectId) {
          return {
            ...p,
            compensationDisbursedCr: +(p.compensationDisbursedCr + (updatedRecord?.amountApproved || 0) / 100).toFixed(2),
          };
        }
        return p;
      }));

      logAction('Direct Benefit Transfer Disbursed', 'Compensation', id, 'Approved', 'Paid', `Disbursed ₹${updatedRecord.amountApproved} Lakhs to ${updatedRecord.beneficiaryName} via UTR ${utr}`);
    }
  };

  const referToCourtEscrow = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setCompensationRecords(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Disputed Escrow',
          disbursementMode: 'Civil Court Escrow (Sec 64/76)',
          paymentDate: today,
          utrTransactionNumber: `ESCROW-COURT-${Date.now()}`,
          remarks: 'Transferred to Principal District Court escrow deposit under Sec 76 RFCTLARR Act.',
        };
      }
      return c;
    }));
    logAction('Compensation Deposited in Civil Court Escrow', 'Compensation', id, 'Disputed', 'Disputed Escrow', `Disputed claim referred to court under Sec 76`);
  };

  const updateRRBenefit = (benefit: RRBenefit) => {
    setRRBenefits(prev => prev.map(b => b.id === benefit.id ? benefit : b));
    logAction('R&R Entitlement Status Updated', 'Resettlement & Rehabilitation', benefit.id, undefined, benefit.relocationStatus, `Updated benefit allotment for family ${benefit.headOfFamily}`);
  };

  const recordPhysicalPossession = (possession: Omit<PossessionRecord, 'id'>) => {
    const id = `POS-${String(possessionRecords.length + 1).padStart(3, '0')}`;
    const full = { ...possession, id };
    setPossessionRecords(prev => [full, ...prev]);

    // Update parcel status
    setParcels(prev => prev.map(p => {
      if (p.id === possession.parcelId) {
        return {
          ...p,
          acquisitionStatus: 'Possession Taken',
        };
      }
      return p;
    }));

    // Update project acquired area
    setProjects(prev => prev.map(p => {
      if (p.id === possession.projectId) {
        return {
          ...p,
          landAcquiredHa: +(p.landAcquiredHa + possession.areaPossessedHa).toFixed(2),
        };
      }
      return p;
    }));

    logAction('Physical Possession Handed Over', 'Physical Possession', id, 'Pending Handover', 'Possession Completed', `Panchnama ${full.panchnamaNumber} executed for ${possession.surveyNumber}`);
  };

  const uploadDocument = (doc: Omit<DMSDocument, 'id' | 'uploadDate' | 'uploadedBy' | 'uploadedRole'>) => {
    const today = new Date().toISOString().split('T')[0];
    const id = `DOC-${String(documents.length + 1).padStart(3, '0')}`;
    const full: DMSDocument = {
      ...doc,
      id,
      uploadDate: today,
      uploadedBy: currentUser.name,
      uploadedRole: currentUser.role,
    };
    setDocuments(prev => [full, ...prev]);
    logAction('Official Document Uploaded', 'Document Management', id, 'None', full.verificationStatus, `Uploaded ${full.title} (${full.category})`);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const syncIntegration = (index: number) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setIntegrations(prev => prev.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          status: 'Connected (Simulated API)',
          lastSyncTime: formatted,
          recordsSyncedCount: item.recordsSyncedCount + Math.floor(Math.random() * 25) + 5,
        };
      }
      return item;
    }));
    logAction('External Gateway API Synchronized', 'Administration', integrations[index]?.name || 'Integration', 'Offline', 'Connected', `Triggered live data sync with ${integrations[index]?.provider}`);
  };

  const advanceProjectStage = (projectId: string, nextStage: AcquisitionStage) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          currentStage: nextStage,
          status: nextStage === 10 ? 'Completed' : p.status,
        };
      }
      return p;
    }));
    logAction(`Statutory Stage Advanced to Stage ${nextStage}`, 'Acquisition Workflow', projectId, undefined, `Stage ${nextStage}`, `Project progressed under RFCTLARR statutory lifecycle`);
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setProjects(DEMO_PROJECTS);
    setParcels(DEMO_PARCELS);
    setNotifications(DEMO_NOTIFICATIONS);
    setObjections(DEMO_OBJECTIONS);
    setAwards(DEMO_AWARDS);
    setCompensationRecords(DEMO_COMPENSATION);
    setFamilies(DEMO_FAMILIES);
    setRRBenefits(DEMO_RR_BENEFITS);
    setPossessionRecords(DEMO_POSSESSION);
    setDocuments(DEMO_DOCUMENTS);
    setAlerts(DEMO_ALERTS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    setIntegrations(DEMO_INTEGRATIONS);
    logAction('System Factory Reset Executed', 'Administration', 'SYSTEM', 'Custom', 'Default Demo Seed', 'Reset all entities to standard SIH demo seed data');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        language,
        setLanguage,
        t,
        switchRole,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        projects,
        selectedProject,
        setSelectedProjectId,
        createProject,
        updateProject,
        parcels,
        addParcel,
        updateParcel,
        verifyParcelInField,
        notifications,
        addNotification,
        objections,
        fileObjection,
        disposeObjection,
        awards,
        draftAward,
        approveAward,
        compensationRecords,
        disburseCompensation,
        referToCourtEscrow,
        families,
        rrBenefits,
        updateRRBenefit,
        possessionRecords,
        recordPhysicalPossession,
        documents,
        uploadDocument,
        alerts,
        markAlertRead,
        auditLogs,
        integrations,
        syncIntegration,
        advanceProjectStage,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
