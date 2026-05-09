import React from 'react';
import { motion } from 'framer-motion';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Activity, Shield, Cpu, Zap, Maximize2, Settings, RefreshCw } from 'lucide-react';
import HologramPanel from './HologramPanel';
import { useTelemetry } from '../hooks/useTelemetry';

const mockAIData = [
  { id: 'OS-X-1', name: 'Neural Core Primary', load: '42.8%', sync: '99.98%', temp: '34°C', nodes: '1,024', security: 'Level 5 (Max)', stability: 'Fixed' },
  { id: 'OS-X-2', name: 'Quantum Processor A1', load: '88.1%', sync: '94.20%', temp: '48°C', nodes: '512', security: 'Level 4', stability: 'Fluctuating' },
  { id: 'OS-X-3', name: 'Deep Mind Sentinel', load: '12.4%', sync: '100.00%', temp: '26°C', nodes: '2,048', security: 'Level 5 (Max)', stability: 'Solid' },
  { id: 'OS-X-4', name: 'Logic Flow Engine', load: '25.5%', sync: '99.99%', temp: '31°C', nodes: '128', security: 'Level 3', stability: 'Stable' },
  { id: 'OS-X-5', name: 'Memory Nexus Grid', load: '67.9%', sync: '98.50%', temp: '42°C', nodes: '4,096', security: 'Level 4', stability: 'Active' },
  { id: 'OS-X-6', name: 'Neural Bridge Alpha', load: '5.2%', sync: '99.00%', temp: '24°C', nodes: '64', security: 'Level 5 (Max)', stability: 'Calibrating' },
];

const AIDashboard: React.FC = () => {
  const telemetry = useTelemetry();

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Bar (Command Center Scale) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: Activity, label: 'Global Load', val: `${telemetry.load}%`, color: 'text-theme-primary' },
          { icon: Zap, label: 'Neural Throughput', val: '1.2 PB/s', color: 'text-theme-secondary' },
          { icon: Shield, label: 'Sec Grid', val: '99.99%', color: 'text-theme-accent' },
          { icon: Cpu, label: 'Core Temp', val: `${telemetry.temp}°C`, color: 'text-theme-primary' }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-white/30 transition-all duration-500"
          >
            <div>
              <p className="text-[9px] font-space-mono text-white/40 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <p className={item.color + " font-orbitron font-black text-2xl group-hover:scale-105 transition-transform"}>{item.val}</p>
            </div>
            <item.icon size={24} className="text-white/10 group-hover:text-white/40 transition-colors" />
          </motion.div>
        ))}
      </div>

      <HologramPanel title="SYSTEM_DIAGNOSTICS_MATRIX" className="p-0">
        <div className="bg-black/40 p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${telemetry.stability === 'STABLE' ? 'bg-neon-green' : 'bg-neon-yellow'} animate-pulse`} />
              <div className="w-2 h-2 rounded-full bg-neon-blue/20" />
              <div className="w-2 h-2 rounded-full bg-neon-pink/20" />
            </div>
            <span className="text-[10px] font-space-mono text-white/40 tracking-widest uppercase">System Core v4.8.2 // {telemetry.stability}</span>
          </div>
          <div className="flex gap-4">
            <RefreshCw size={14} className="text-white/20 hover:text-neon-blue cursor-pointer transition-colors" />
            <Settings size={14} className="text-white/20 hover:text-neon-blue cursor-pointer transition-colors" />
            <Maximize2 size={14} className="text-white/20 hover:text-neon-blue cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          <GridComponent 
            dataSource={mockAIData} 
            allowPaging={true} 
            pageSettings={{ pageSize: 6 }}
            allowSorting={true}
            width="100%"
            className="cyber-grid"
          >
            <ColumnsDirective>
              <ColumnDirective field="id" headerText="OS_ID" width="100" textAlign="Center" />
              <ColumnDirective 
                field="name" 
                headerText="SYSTEM_MODULE" 
                width="220" 
                template={(data: any) => (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                    <span>{data.name}</span>
                  </div>
                )}
              />
              <ColumnDirective field="load" headerText="NEURAL_LOAD" width="130" textAlign="Right" />
              <ColumnDirective field="sync" headerText="QUANTUM_SYNC" width="140" textAlign="Right" />
              <ColumnDirective field="temp" headerText="CORE_TEMP" width="120" textAlign="Right" />
              <ColumnDirective field="security" headerText="SEC_LAYER" width="160" />
              <ColumnDirective 
                field="stability" 
                headerText="STABILITY" 
                width="140" 
                template={(data: any) => (
                  <span className={data.stability === 'Fixed' || data.stability === 'Solid' ? 'text-neon-green' : 'text-neon-yellow'}>
                    {data.stability.toUpperCase()}
                  </span>
                )}
              />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter]} />
          </GridComponent>
        </div>

        <div className="bg-neon-blue/5 p-3 flex justify-between items-center text-[8px] font-space-mono text-neon-blue/60 border-t border-white/5">
          <span>PACKET_INSPECTION_ACTIVE</span>
          <span className="flex items-center gap-2">
            LATENCY: {telemetry.latency}ms
            <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: [`${telemetry.load}%`, '80%', '40%'] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="h-full bg-neon-blue"
              />
            </div>
          </span>
        </div>
      </HologramPanel>

    </div>
  );
};

export default AIDashboard;
