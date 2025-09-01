import Replicate from 'replicate';

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function getReplicateImageUrl(
  modelVersion: string,
  input: Record<string, any>,
): Promise<string> {
  const replicateOutput = await replicate.run(
    modelVersion as '`${string}/${string}` | `${string}/${string}:${string}`',
    {
      input,
    },
  );

  const replicateOutputUrl = Array.isArray(replicateOutput)
    ? replicateOutput[0].url()
    : // @ts-expect-error - replicateOutput is not typed
      replicateOutput.url();

  return replicateOutputUrl;
}

export async function getReplicateOutput(
  modelVersion: string,
  input: Record<string, any>,
) {
  const replicateOutput = await replicate.run(
    modelVersion as '`${string}/${string}` | `${string}/${string}:${string}`',
    {
      input,
    },
  );

  return replicateOutput;
}
