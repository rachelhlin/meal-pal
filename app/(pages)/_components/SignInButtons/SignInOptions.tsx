import { enabledProviders } from '@datalib/auth';
import SignInButtons from './SignInButtons';

// provider list comes from env vars, which only the server can see
export default function SignInOptions({
  callbackURL,
}: {
  callbackURL?: string;
}) {
  return (
    <SignInButtons providers={enabledProviders} callbackURL={callbackURL} />
  );
}
