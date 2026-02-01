import {createContext} from '@ark-ui/react';
import type {Account} from '@expense-tracker/defs';

export const [MemberProvider, useMemberContext] = createContext<Account>();
