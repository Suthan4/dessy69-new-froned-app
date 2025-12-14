import { useEffect } from 'react';
import { useSocket } from './useSocket';

export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void,
  deps: any[] = []
) {
  const { on, off } = useSocket();

  useEffect(() => {
    on(event, handler);

    return () => {
      off(event, handler);
    };
  }, [event, on, off, ...deps])
}