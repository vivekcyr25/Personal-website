import React from 'react';
import { motion } from 'framer-motion';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Category, Tooltip, DataLabel, AreaSeries } from '@syncfusion/ej2-react-charts';
import HologramPanel from '../../components/HologramPanel';
import { useTelemetry } from '../../hooks/useTelemetry';

const Analytics: React.FC = () => {
  const telemetry = useTelemetry();
  const data = [
    { x: 'MON', y: 45 }, { x: 'TUE', y: 52 }, { x: 'WED', y: 48 },
    { x: 'THU', y: 70 }, { x: 'FRI', y: 85 }, { x: 'SAT', y: 60 }, { x: 'SUN', y: 50 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HologramPanel title="TOTAL_ENGAGEMENT">
          <div className="text-center py-6">
            <motion.h3 
              key={telemetry.load}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black text-theme-primary font-orbitron"
            >
              {(telemetry.load * 420).toFixed(0)}
            </motion.h3>
            <p className="text-[9px] font-space-mono text-white/40 uppercase tracking-widest mt-2">Neural Interactions</p>
          </div>
        </HologramPanel>
        
        <HologramPanel title="ACTIVE_SESSIONS">
          <div className="text-center py-6">
            <motion.h3 
              key={telemetry.nodes}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black text-theme-secondary font-orbitron"
            >
              {telemetry.nodes + (telemetry.load > 50 ? 12 : 0)}
            </motion.h3>
            <p className="text-[9px] font-space-mono text-white/40 uppercase tracking-widest mt-2">Concurrent Uplinks</p>
          </div>
        </HologramPanel>

        <HologramPanel title="SYS_EFFICIENCY">
          <div className="text-center py-6">
            <motion.h3 
              key={telemetry.latency}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black text-theme-accent font-orbitron"
            >
              {(100 - telemetry.latency * 100).toFixed(1)}%
            </motion.h3>
            <p className="text-[9px] font-space-mono text-white/40 uppercase tracking-widest mt-2">Cognition Stability</p>
          </div>
        </HologramPanel>
      </div>

      <HologramPanel title="TRAFFIC_NEURAL_MAP">
        <div className="h-[400px] w-full bg-black/20 rounded-xl overflow-hidden p-4">
          <ChartComponent 
            id="traffic-chart"
            primaryXAxis={{ valueType: 'Category', labelStyle: { color: 'rgba(255,255,255,0.4)' } }}
            primaryYAxis={{ labelStyle: { color: 'rgba(255,255,255,0.4)' } }}
            chartArea={{ border: { width: 0 } }}
            background="transparent"
            tooltip={{ enable: true }}
          >
            <Inject services={[LineSeries, Category, Tooltip, DataLabel, AreaSeries]} />
            <SeriesCollectionDirective>
              <SeriesDirective 
                dataSource={data} 
                xName='x' 
                yName='y' 
                type='Area' 
                fill='rgba(0, 212, 255, 0.2)' 
                border={{ width: 2, color: '#00d4ff' }}
                animation={{ enable: true, duration: 2000 }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </HologramPanel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HologramPanel title="GEOGRAPHIC_HEATMAP">
          <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-white/5 rounded-xl gap-4">
             <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-theme-primary/10 rounded-full animate-ping" />
                <div className="absolute inset-4 bg-theme-primary/20 rounded-full animate-pulse" />
             </div>
             <span className="text-[10px] font-space-mono text-white/20 uppercase tracking-[0.5em]">Global_Sync_Active</span>
          </div>
        </HologramPanel>
        <HologramPanel title="INTERACTION_DENSITY">
           <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-white/5 rounded-xl gap-4 p-8">
             <div className="w-full space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: [`${30+i*10}%`, `${70-i*5}%`, `${50+i*2}%`] }}
                      transition={{ repeat: Infinity, duration: 3 + i }}
                      className="h-full bg-theme-primary/40"
                    />
                  </div>
                ))}
             </div>
             <span className="text-[10px] font-space-mono text-white/20 uppercase tracking-[0.5em]">Density_Telemetry_Active</span>
          </div>
        </HologramPanel>
      </div>
    </div>
  );
};

export default Analytics;
