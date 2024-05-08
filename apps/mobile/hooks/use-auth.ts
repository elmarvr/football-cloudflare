export function useAuth() {
  async function signInWithCode(provider: "google", code: string) {
    const response = await fetch(`/auth/${provider}/sign-in`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    const { sessionId } = await response.json();

    return sessionId;
  }

  return {
    signInWithCode,
  };
}
