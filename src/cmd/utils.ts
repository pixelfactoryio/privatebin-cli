import { prompt } from 'inquirer';

export async function readPassword(): Promise<string> {
  const answer = await prompt({
    type: 'password',
    message: 'Password?',
    mask: '*',
    name: 'password',
  });
  return answer.password;
}
