// faceRecognition Integration Types
export interface faceRecognitionConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  webhookUrl?: string;
}

export interface faceRecognitionMessage {
  to: string;
  content: string;
  type: 'text' | 'template' | 'media';
}

export interface faceRecognitionResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
