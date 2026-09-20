import React, { useState, useEffect } from 'react';
import {
  externalIntegrationService,
  GatewayHealthReport
} from '../../services/externalIntegrationService';
import {
  Cpu,
  Terminal,
  Copy,
  Check,
  Zap,
  RefreshCw,
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiGatewayConsole: React.FC<Props> = ({ isOpen, onClose }) => {
  const [gateways, setGateways] = useState<GatewayHealthReport[]>([]);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'BHUNAKSHA' | 'PFMS' | 'EGAZETTE'>('BHUNAKSHA');
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Form input parameters
  const [khasraInput, setKhasraInput] = useState('142/1A');
  const [pfmsAmountInput, setPfmsAmountInput] = useState(17425000);
  const [projectCodeInput, setProjectCodeInput] = useState('NHAI-DME-PKG-14');

  const fetchHealth = () => {
    setIsLoadingHealth(true);
    externalIntegrationService.getGatewayHealthStatus()
      .then(res => setGateways(res))
      .finally(() => setIsLoadingHealth(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      executeSimulation('BHUNAKSHA');
    }
  }, [isOpen]);

  const executeSimulation = async (endpoint: 'BHUNAKSHA' | 'PFMS' | 'EGAZETTE') => {
    setIsExecuting(true);
    setResponseOutput(null);

    if (endpoint === 'BHUNAKSHA') {
      const res = await externalIntegrationService.fetchFromBhunaksha('MH', 'Pune', khasraInput);
      setResponseOutput(res);
    } else if (endpoint === 'PFMS') {
      const res = await externalIntegrationService.syncWithPFMS({
        schemeCode: 'NHAI-LA-001',
        awardReferenceNo: 'AWD-2026-MH-092',
        beneficiaryName: 'Shri Tukaram Sambhaji Gaikwad',
        beneficiaryAadhaarHash: 'SHA256:7B8A91C0DE24F91',
        accountNumberMasked: 'XXXX-XXXX-4819',
        ifscCode: 'SBIN0001248',
        amountInr: pfmsAmountInput,
        debitAccountAgency: 'National Highways Authority of India'
      });
      setResponseOutput(res);
    } else if (endpoint === 'EGAZETTE') {
      const res = await externalIntegrationService.publishToEGazette({
        issuingMinistry: 'Ministry of Road Transport and Highways',
        actSection: 'SEC_11_NOTIFICATION',
        projectCode: projectCodeInput,
        stateCode: 'MH',
        draftGazettePdfUrl: 'https://bhoomisetu.gov.in/gazette/draft_so_1892.pdf',
        signatoryOfficer: 'Joint Secretary (Land Resources)'
      });
      setResponseOutput(res);
    }

    setIsExecuting(false);
  };

  const copyToClipboard = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  National Integration API Gateway Console
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  ENTERPRISE ARCHITECTURE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspect live government API schemas, connectivity telemetry, and simulated network response payloads
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchHealth}
              disabled={isLoadingHealth}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Health Telemetry Cards */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Live National Gateway Nodes Telemetry
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {gateways.map(gw => (
                <div key={gw.gatewayId} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{gw.category}</span>
                    <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{gw.status}</span>
                    </span>
                  </div>
                  <div className="font-bold text-slate-200 truncate" title={gw.name}>
                    {gw.name}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
                    <span>Uptime: <strong className="text-emerald-400">{gw.uptimePercentage}%</strong></span>
                    <span>Latency: <strong className="text-amber-400">{gw.latencyMs}ms</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Endpoint Sandbox */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">Interactive Endpoint Sandbox</span>
              </div>

              {/* Endpoint Switcher */}
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    setSelectedEndpoint('BHUNAKSHA');
                    executeSimulation('BHUNAKSHA');
                  }}
                  className={`px-3 py-1 rounded font-mono font-bold text-[11px] transition-colors ${
                    selectedEndpoint === 'BHUNAKSHA'
                      ? 'bg-[#0B3559] text-white border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  GET /bhunaksha/ror
                </button>
                <button
                  onClick={() => {
                    setSelectedEndpoint('PFMS');
                    executeSimulation('PFMS');
                  }}
                  className={`px-3 py-1 rounded font-mono font-bold text-[11px] transition-colors ${
                    selectedEndpoint === 'PFMS'
                      ? 'bg-[#0B3559] text-white border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  POST /pfms/dbt-disburse
                </button>
                <button
                  onClick={() => {
                    setSelectedEndpoint('EGAZETTE');
                    executeSimulation('EGAZETTE');
                  }}
                  className={`px-3 py-1 rounded font-mono font-bold text-[11px] transition-colors ${
                    selectedEndpoint === 'EGAZETTE'
                      ? 'bg-[#0B3559] text-white border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  POST /egazette/publish
                </button>
              </div>
            </div>

            {/* Parameter Input Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              {selectedEndpoint === 'BHUNAKSHA' && (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Target Cadastral Khasra Number:
                  </label>
                  <input
                    type="text"
                    value={khasraInput}
                    onChange={e => setKhasraInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
              )}

              {selectedEndpoint === 'PFMS' && (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Beneficiary Compensation Amount (INR):
                  </label>
                  <input
                    type="number"
                    value={pfmsAmountInput}
                    onChange={e => setPfmsAmountInput(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
              )}

              {selectedEndpoint === 'EGAZETTE' && (
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Statutory Project Notification Code:
                  </label>
                  <input
                    type="text"
                    value={projectCodeInput}
                    onChange={e => setProjectCodeInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-300 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
              )}

              <button
                onClick={() => executeSimulation(selectedEndpoint)}
                disabled={isExecuting}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded flex items-center justify-center space-x-1.5 transition-colors shadow"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Executing Request...' : 'Send Simulated Request'}</span>
              </button>
            </div>

            {/* JSON Response Terminal Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>Response Payload (HTTP 200 OK):</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60 leading-relaxed shadow-inner">
                {isExecuting ? '// Transmitting through NIC government proxy switch...' : JSON.stringify(responseOutput, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400 font-mono">
          <span>Security Protocol: TLS 1.3 / Mutual Auth e-Pramaan Token Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded transition-colors"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
