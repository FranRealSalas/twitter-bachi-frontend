"use client"
import Navbar from "@/components/Navbar";
import "../globals.css";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-black bg-cover bg-fixed bg-no-repeat w-full h-full text-white">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="h-full">
        <div className="h-full flex px-72 justify-center">
          <div className="flex w-full flex-row min-w-[780px] max-w-7xl">
            <div className="xl:w-1/4 w-1/6 flex justify-end xl:justify-start" >
              <Navbar />
            </div>
            <div className="w-3/4 xl:w-3/4 sm:w-full flex flex-row">
              <div className="w-full xl:w-2/3 flex flex-col mx-3">
                {children}
              </div>
              <div className="w-1/3 hidden xl:block">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
