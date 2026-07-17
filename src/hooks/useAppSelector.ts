import { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../store/rootReducer";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
