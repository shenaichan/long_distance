import { ReactNode } from "react";

export type popupProps = {title: string, content: ReactNode};
export type popupKind = "info" | "message" | "pins" | "favorites" | "creation";