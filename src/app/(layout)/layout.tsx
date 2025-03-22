"use client"
import Navbar from "@/components/Navbar";
import "../globals.css";
import SearchBar from "@/components/SearchBar";
import WhoToFollowComponent from "@/components/WhoToFollowComponent";
import ChatMenuComponent from "@/components/ChatMenuComponent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-black bg-cover bg-fixed bg-no-repeat w-full h-full text-white scrollbar scrollbar-track-black scrollbar-thumb-gray-100">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="h-full">
        <div className="h-full flex px-3 sm:px-72 justify-center">
          <div className="flex w-full justify-center flex-row min-w-fit max-w-7xl">
            <div className="w-1/4 flex xl:justify-center justify-end" >
              <Navbar />
            </div>
            <div className="w-3/4 flex flex-row">
              <div className="w-2/3 min-w-fit flex flex-col mx-3">
                {children}
              </div>
              <div className="w-1/3 hidden 2xl:block">
                <div className="fixed w-72 h-full top-0">
                  <SearchBar />
                  <WhoToFollowComponent />
                </div>
                <div className="fixed bottom-0">
                  <ChatMenuComponent/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
