export const logInfo = ({ message, data }: { message: string; data?: any }) => {
  console.log(`[${new Date().toISOString()}] [INFO] ${message}`, data);
};

export const logError = ({
  message,
  data,
}: {
  message: string;
  data?: any;
}) => {
  console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, data);
};
