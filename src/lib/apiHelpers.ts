export async function safeGetThreadInfo(api: any, threadId: string | number): Promise<any | null> {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      api.getThreadInfo(String(threadId).trim(), (err: any, info: any) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
    return result;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('Not Found') || errorMsg.includes('not valid JSON') || errorMsg.includes('Unexpected token')) {
      return null;
    }
    throw error;
  }
}

export async function safeGetUserInfo(api: any, userIds: string | string[]): Promise<any> {
  try {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const cleanIds = ids.map(id => String(id).trim());
    const result = await new Promise<any>((resolve, reject) => {
      api.getUserInfo(cleanIds, (err: any, info: any) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
    return result || {};
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('Not Found') || errorMsg.includes('not valid JSON') || errorMsg.includes('Unexpected token')) {
      return {};
    }
    throw error;
  }
}

export async function safeGetThreadList(api: any, limit: number, timestamp: any, tags: string[]): Promise<any[]> {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      api.getThreadList(limit, timestamp, tags, (err: any, list: any) => {
        if (err) reject(err);
        else resolve(list);
      });
    });
    return result || [];
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('Not Found') || errorMsg.includes('not valid JSON') || errorMsg.includes('Unexpected token')) {
      return [];
    }
    throw error;
  }
}

export function isApiError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return errorMsg.includes('Not Found') || 
         errorMsg.includes('not valid JSON') || 
         errorMsg.includes('Unexpected token');
}
