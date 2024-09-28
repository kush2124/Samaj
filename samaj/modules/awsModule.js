import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { config } from '@dotenvx/dotenvx';

config();
const client = new SecretsManagerClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  },
});

export async function getSecret(secretName) {
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });

  try {
    const response = await client.send(command);
    if (response.SecretString) {
      const secret = JSON.parse(response.SecretString);
      return secret;
    }
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}
