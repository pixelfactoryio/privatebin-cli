import { password } from '@inquirer/prompts';

export async function readPassword(): Promise<string> {
  const answer = await password({
    message: 'Password?',
  });
  return answer;
}
