import { supabase } from "@/integrations/supabase/client";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export async function callApi<T>(
  functionName: string,
  options: {
    method?: HttpMethod;
    body?: any;
    queryParams?: Record<string, string>;
  } = {}
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(functionName, {
    method: options.method || 'GET',
    body: options.body,
    query: options.queryParams,
  });

  if (error) {
    console.error('API Error:', error);
    throw error;
  }

  return data;
}

// Example usage:
// const data = await callApi<{ message: string }>('hello', { 
//   queryParams: { name: 'John' } 
// });