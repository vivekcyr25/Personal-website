import { useState, useCallback, useRef } from 'react';
import { aiMonitor } from '../services/ai/AIConnectionMonitor';

export type StreamState = 'IDLE' | 'CONNECTING' | 'STREAMING' | 'COMPLETE' | 'ERROR' | 'ABORTED' | 'DISCONNECTED';

interface UseAIStreamOptions {
  onToken?: (token: string) => void;
  onDone?: () => void;
  onError?: (error: string, details?: string) => void;
}

export const useAIStream = () => {
  const [state, setState] = useState<StreamState>('IDLE');
  const abortControllerRef = useRef<AbortController | null>(null);
  const rawApiUrl = import.meta.env.VITE_API_URL;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = (!rawApiUrl || rawApiUrl.includes('localhost')) 
    ? (isLocalhost ? 'http://localhost:5000' : 'https://personal-websiteneural-os-api.onrender.com')
    : rawApiUrl;

  const stream = useCallback(async (message: string, context: any, options: UseAIStreamOptions = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setState('CONNECTING');
    aiMonitor.setState('CONNECTING');

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `NEURAL_UPLINK_OFFLINE: ${response.status}`);
      }

      if (!response.body) throw new Error('STREAM_SIGNAL_LOST');

      setState('STREAMING');
      aiMonitor.trackStreamStart();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
          if (!block.trim()) continue;
          
          const lines = block.split('\n');
          const eventLine = lines.find(l => l.startsWith('event: '));
          const dataLine = lines.find(l => l.startsWith('data: '));

          if (!eventLine || !dataLine) continue;

          const event = eventLine.slice(7).trim();
          let data;
          try {
            data = JSON.parse(dataLine.slice(6).trim());
          } catch (e) {
            continue;
          }

          if (event === 'token') {
            options.onToken?.(data.token);
          } else if (event === 'error') {
            throw new Error(data.details || data.error || 'COGNITION_ERROR');
          }
        }
      }

      setState('COMPLETE');
      aiMonitor.setState('CONNECTED');
      aiMonitor.trackStreamEnd();
      options.onDone?.();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setState('ABORTED');
        aiMonitor.setState('ABORTED');
      } else {
        console.error('[STREAM_FAILURE]', error);
        setState('ERROR');
        aiMonitor.setState('FAILED');
        options.onError?.(error.message);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [API_URL]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { stream, abort, state };
};
