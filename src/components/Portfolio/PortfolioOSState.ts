export enum PortfolioState {
  IDLE = 'IDLE',
  CONFIGURING = 'CONFIGURING',
  INITIALIZING = 'INITIALIZING',
  GENERATED_SUMMARY = 'GENERATED_SUMMARY',
  GENERATED_VIEW = 'GENERATED_VIEW',
  EXPLORING_MODULE = 'EXPLORING_MODULE',
  SAVED = 'SAVED'
}

export interface PortfolioData {
  name: string;
  codename: string;
  role: string;
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  aiStyle: string;
  theme: string;
}
