import  { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../../app/rootReducer";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
