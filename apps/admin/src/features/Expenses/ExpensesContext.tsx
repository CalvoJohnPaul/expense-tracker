import {createContext} from '@ark-ui/react';
import type {Expense} from '@expense-tracker/defs';
import type {ExpenseFilterInput} from '~/definitions';

export const [ExpenseProvider, useExpenseContext] = createContext<Expense>();
export const [FilterProvider, useFilterContext] = createContext<ExpenseFilterInput>();
