import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata:Metadata={title:"NextWave Build — Don't just learn it. Build it.",description:"Practical skills, real projects and mentor support. Explore E-commerce, Freelancing, and Technology & AI with NextWave Build.",icons:{icon:"/assets/logo.svg"}};
export const viewport:Viewport={themeColor:"#101214"};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>;}
