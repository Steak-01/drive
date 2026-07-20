import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyAccount, type AccountInfo, type AppRole } from "../lib/account.functions";

export function useAccount() {
  const fetchAccount = useServerFn(getMyAccount);
  return useQuery<AccountInfo>({
    queryKey: ["account"],
    queryFn: async () => {
      try {
        return await fetchAccount();
      } catch (error) {
        console.error("Could not load account", error);
        return {
          userId: "",
          email: null,
          profile: null,
          roles: [],
        };
      }
    },
    retry: 1,
    throwOnError: false,
    staleTime: 30_000,
  });
}

export function homeForRoles(roles: AppRole[] | undefined): string {
  if (!roles) return "/dashboard";
  if (roles.includes("admin")) return "/admin";
  return "/dashboard";
}
