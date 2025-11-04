import { startPasswordlessLogin, verifyPasswordlessCode } from "./passwordless";

const mutationFns = {
  startPasswordlessLogin,
  verifyPasswordlessCode,
};

const queryFns = {} as const;

const queryKeys: Record<
  keyof typeof queryFns,
  string | string[] | ((args: unknown) => string | string[])
> = {};

export { mutationFns, queryFns, queryKeys };
