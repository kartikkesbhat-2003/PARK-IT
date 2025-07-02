export function useUser() {
  const userData = localStorage.getItem("user");

  if (userData) {
    return {
      user: JSON.parse(userData),
    };
  }

  return {
    user: null,
  };
}
