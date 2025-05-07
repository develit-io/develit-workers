export const calculateExponentialBackoff = (
  attempts: number,
  baseDelaySeconds: number,
) => {
  return baseDelaySeconds ** attempts
}
