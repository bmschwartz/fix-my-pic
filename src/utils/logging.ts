// logger.ts
class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private getTimeStamp(): string {
    return new Date().toISOString();
  }

  public debug(message: string, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG ${this.namespace}] [${this.getTimeStamp()}]: ${message}`, ...optionalParams);
    }
  }

  public info(message: string, ...optionalParams: any[]): void {
    console.log(`[INFO ${this.namespace}] [${this.getTimeStamp()}]: ${message}`, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: any[]): void {
    console.warn(`[WARN ${this.namespace}] [${this.getTimeStamp()}]: ${message}`, ...optionalParams);
  }

  public error(message: string, ...optionalParams: any[]): void {
    console.error(`[ERROR ${this.namespace}] [${this.getTimeStamp()}]: ${message}`, ...optionalParams);
  }
}

export const getLogger = (namespace: string): Logger => {
  return new Logger(namespace);
};
