export interface FunctionCallInfo {
  file: string,
  function: string,
  line: string
}

export type LoggerSeverity = 'error' | 'warn' | 'info' | 'debug'; 