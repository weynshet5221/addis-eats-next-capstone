
export default async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("Unable to load data.");
    error.status = response.status;
    throw error;
  }

  return response.json();
}
