import React from 'react';
import LegalContainer from '../../components/legal/LegalContainer';

const Privacy: React.FC = () => {
  return (
    <LegalContainer title="Privacy Policy" icon="privacy">
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">1. Data Collection & Authentication</h3>
        <p>
          Neural OS prioritizes your digital sovereignty. We collect minimal data necessary to provide a personalized architectural experience. This includes:
        </p>
      <ul className="space-y-2 list-disc pl-5">
          <li><strong className="text-theme-primary">Authentication Data:</strong> We utilize Google and GitHub OAuth providers via Firebase Authentication to secure your identity without storing raw passwords.</li>
          <li><strong className="text-theme-primary">Profile Metadata:</strong> Basic information provided by your OAuth provider (name, email, profile picture) is used to personalize your workspace.</li>
        </ul>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">2. AI Prompt Processing</h3>
        <p>
          Our platform integrates with the <strong>Gemini API</strong> for real-time cognition streaming. When you interact with the Neural Console, your prompts are processed to generate architect-grade responses. We do not use your private prompts to train underlying models without explicit consent.
        </p>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">3. Session & Storage</h3>
        <p>
          We use local storage and secure cookies to persist your session and UI preferences (such as your chosen Neural Profile). This data remains on your device and is not used for cross-site tracking.
        </p>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">4. Analytics & Optimization</h3>
        <p>
          Minimal, privacy-preserving analytics may be used to monitor platform health and neural link stability. This data is anonymized and used exclusively for performance tuning of the Liquid Glass interface.
        </p>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">5. Third-Party Integrations</h3>
        <p>
          Neural OS relies on trusted enterprise partners for core infrastructure:
        </p>
      <ul className="space-y-2 list-disc pl-5">
          <li><strong className="text-theme-primary">Firebase:</strong> For authentication and secure session management.</li>
          <li><strong className="text-theme-primary">Google Cloud:</strong> For AI processing and distributed cognition.</li>
        </ul>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">6. Security Practices</h3>
        <p>
          We implement industry-standard encryption protocols for all data in transit. Your neural session is isolated and protected against unauthorized access using modern web security standards.
        </p>
      </section>

      <hr className="border-white/5" />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-white tracking-tight">7. Contact Information</h3>
        <p>
          For inquiries regarding your data or to request data erasure, please contact the lead architect at: <strong>architect@veraa.ai</strong>
        </p>
      </section>
    </LegalContainer>
  );
};

export default Privacy;
