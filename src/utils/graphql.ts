/* eslint-disable  */
interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function gqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<NonNullable<T> | null> {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HYPERMODE_API_ENDPOINT!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERMODE_API_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  if (!response.ok) {
    console.log(response);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    console.error("GraphQL Errors:", result.errors);
    throw new Error(result.errors[0].message);
  }

  return result.data || null;
}
